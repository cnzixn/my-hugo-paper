const FRAMEWORK_MAINFUNCTION_VALID_MD5S = [
  // BM26.02.13
  '4186716d14c5f10ab230074404fb2344',
  // BM26.03.01
  "777040b532e0193b023a564b8d3be12c",
];

// 检查登录状态
function checkLogin() {
  const token = localStorage.getItem('userToken');
  console.log('检查登录状态 - token:', token ? '存在' : '不存在');
  if (!token) return false;
  // 检查token是否过期
  const isExpired = isTokenExpired(token);
  console.log('检查登录状态 - token是否过期:', isExpired);
  return !isExpired;
}

// 跳转到登录页面
function redirectToLogin() {
  const currentUrl = encodeURIComponent(window.location.href);
  window.location.href = `https://user.bxq.me/login?from=${currentUrl}`;
}

// 获取用户token
function getUserToken() {
  return localStorage.getItem('userToken');
}

// 解码Base64URL
function decodeBase64Url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
    }
    str += new Array(5 - pad).join('=');
  }
  return atob(str);
}

// 检查token是否过期
function isTokenExpired(token) {
  try {
    const tokenParts = token.split('.');
    const payload = JSON.parse(decodeBase64Url(tokenParts[1]));
    const exp = payload.exp * 1000; // 转换为毫秒
    return Date.now() > exp;
  } catch (error) {
    return true;
  }
}

// 获取用户QQ号（从token中提取）
function getUserId() {
  const token = getUserToken();
  if (!token) return '0';
  try {
    const tokenParts = token.split('.');
    const payload = JSON.parse(decodeBase64Url(tokenParts[1]));
    return payload.uid || '0';
  } catch (error) {
    return '0';
  }
}

// API 基础 URL
const API_BASE_URL = 'https://user.bxq.me';

// 从URL参数中获取token并保存
function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    localStorage.setItem('userToken', token);
    // 移除URL中的token参数，避免重复使用
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.replaceState({}, document.title, url.toString());
  }
}

// 显示登录错误信息
function showLoginError(message) {
  const errorDiv = document.getElementById('loginError');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'flex';
    setTimeout(() => {
      if (errorDiv) {
        errorDiv.style.display = 'none';
      }
    }, 3000);
  }
}

// 开始验证码倒计时
function startCountdown() {
  const sendCodeBtn = document.getElementById('sendCodeBtn');
  if (!sendCodeBtn) return;
  
  const countdown = 60;
  sendCodeBtn.disabled = true;
  sendCodeBtn.textContent = `${countdown}秒后重发`;
  
  let remaining = countdown;
  const timer = setInterval(() => {
    remaining--;
    if (sendCodeBtn) {
      sendCodeBtn.textContent = `${remaining}秒后重发`;
      if (remaining <= 0) {
        clearInterval(timer);
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = '发送';
      }
    } else {
      clearInterval(timer);
    }
  }, 1000);
}

// 发送验证码
async function sendVerificationCode() {
  const uidInput = document.getElementById('loginUid');
  if (!uidInput) {
    console.error('登录表单元素未找到');
    return;
  }
  
  const uid = uidInput.value.trim();
  
  if (!uid || !/^\d+$/.test(uid)) {
    showLoginError('请输入有效的 QQ 号');
    return;
  }
  
  const sendCodeBtn = document.getElementById('sendCodeBtn');
  if (!sendCodeBtn) {
    console.error('发送验证码按钮未找到');
    return;
  }
  
  sendCodeBtn.disabled = true;
  sendCodeBtn.textContent = '发送中...';
  
  try {
    // 生成时间戳（精确到秒）
    const timestamp = Math.floor(Date.now() / 1000);
    console.log('发送验证码请求:', {
      url: `${API_BASE_URL}/api/secode`,
      data: { uid, timestamp, platform: 'web' }
    });
    
    // 发送请求
    const response = await fetch(`${API_BASE_URL}/api/secode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid, timestamp, platform: 'web' }),
      redirect: 'manual' // 阻止fetch自动跟随重定向
    });
    
    console.log('发送验证码响应状态:', response.status);
    console.log('发送验证码响应头:', Object.fromEntries(response.headers.entries()));
    
    // 检查是否是重定向
    if (response.redirected) {
      // 手动跳转到重定向的URL
      window.location.href = response.url;
      return;
    }
    
    // 尝试解析JSON响应
    try {
      const data = await response.json();
      console.log('发送验证码响应数据:', data);
      
      // 检查响应状态和数据结构
      if (response.ok) {
        // 后端返回200状态码
        if (data.success || data.code === 200 || data.status === 'success') {
          // 兼容不同的成功响应格式
          showLoginError('验证码已发送到你的邮箱');
        } else {
          // 后端返回错误信息
          showLoginError(data.error || data.message || '发送验证码失败');
        }
      } else {
        // 后端返回非200状态码
        showLoginError(data.error || data.message || `发送验证码失败，状态码: ${response.status}`);
      }
    } catch (jsonError) {
      console.error('JSON解析失败:', jsonError);
      // 如果JSON解析失败，可能是因为返回了HTML或其他格式
      showLoginError('服务器响应格式错误，请稍后重试');
    }
  } catch (error) {
    console.error('发送验证码失败:', error);
    // 详细的错误信息
    if (error instanceof SyntaxError) {
      showLoginError('服务器响应格式错误，请稍后重试');
    } else if (error.message.includes('Network') || error.message.includes('CORS') || error.message.includes('fetch')) {
      // 特殊处理网络和CORS错误，因为用户可能已经收到了验证码
      showLoginError('验证码可能已发送，请检查邮箱');
    } else {
      showLoginError('发送验证码失败，请稍后重试');
    }
  } finally {
    startCountdown();
  }
}

// 登录
async function login() {
  console.log('开始执行登录函数');
  const uidInput = document.getElementById('loginUid');
  const codeInput = document.getElementById('loginCode');
  
  console.log('获取登录表单元素:', { uidInput: uidInput ? '找到' : '未找到', codeInput: codeInput ? '找到' : '未找到' });
  
  if (!uidInput || !codeInput) {
    console.error('登录表单元素未找到');
    showLoginError('登录表单元素未找到，请刷新页面重试');
    return;
  }
  
  console.log('获取输入值');
  const uid = uidInput.value.trim();
  const code = codeInput.value.trim();
  console.log('输入值:', { uid, code });
  
  if (!uid || !/^\d+$/.test(uid)) {
    showLoginError('请输入有效的 QQ 号');
    return;
  }
  
  if (!code || code.length !== 6) {
    showLoginError('请输入 6 位验证码');
    return;
  }
  
  const loginBtn = document.getElementById('loginBtn');
  if (!loginBtn) {
    console.error('登录按钮未找到');
    return;
  }
  
  loginBtn.disabled = true;
  loginBtn.textContent = '登录中...';
  
  try {
    // 生成时间戳（精确到秒）
    const timestamp = Math.floor(Date.now() / 1000);
    console.log('登录请求:', {
      url: `${API_BASE_URL}/api/app/login`,
      data: { uid, code, timestamp, platform: 'web' }
    });
    
    // 调用登录接口
    const loginResponse = await fetch(`${API_BASE_URL}/api/app/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid, code, timestamp, platform: 'web' }),
      redirect: 'manual' // 阻止fetch自动跟随重定向
    });
    
    console.log('登录响应状态:', loginResponse.status);
    console.log('登录响应头:', Object.fromEntries(loginResponse.headers.entries()));
    
    // 检查是否是重定向
    if (loginResponse.redirected) {
      // 手动跳转到重定向的URL
      window.location.href = loginResponse.url;
      return;
    }
    
    // 检查响应状态
    if (!loginResponse.ok) {
      throw new Error(`登录请求失败，状态码: ${loginResponse.status}`);
    }
    
    const data = await loginResponse.json();
    console.log('登录响应数据:', data);
    
    if (data.success) {
      // 登录成功，保存 token 到 localStorage
      localStorage.setItem('userToken', data.token);
      showLoginError('登录成功');
      // 跳转到主内容
      setTimeout(() => {
        showMainContent();
      }, 1000);
    } else {
      // 登录失败
      showLoginError(data.error || '登录失败');
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = '登录';
      }
    }
  } catch (error) {
    console.error('登录失败:', error);
    showLoginError('登录失败，请稍后重试');
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.textContent = '登录';
    }
  }
}

// 显示主内容
function showMainContent() {
  const loginSection = document.getElementById('loginSection');
  const section1 = document.getElementById('section1');
  const section2 = document.getElementById('section2');
  const section3 = document.getElementById('section3');
  
  if (loginSection) loginSection.style.display = 'none';
  if (section1) section1.style.display = 'block';
  if (section2) section2.style.display = 'block';
  if (section3) section3.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  // 从URL参数中获取token
  getTokenFromUrl();
  
  // 检查登录状态
  const isLoggedIn = checkLogin();
  console.log('登录状态检查:', isLoggedIn);
  
  if (isLoggedIn) {
    console.log('已登录，显示主内容');
    showMainContent();
  } else {
    console.log('未登录，显示登录表单');
    // 确保登录表单显示
    const loginSection = document.getElementById('loginSection');
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    const section3 = document.getElementById('section3');
    
    if (loginSection) loginSection.style.display = 'block';
    if (section1) section1.style.display = 'none';
    if (section2) section2.style.display = 'none';
    if (section3) section3.style.display = 'none';
  }
  
  // 绑定登录相关事件
  setTimeout(() => {
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const loginBtn = document.getElementById('loginBtn');
    
    console.log('绑定登录相关事件:', { sendCodeBtn: sendCodeBtn ? '找到' : '未找到', loginBtn: loginBtn ? '找到' : '未找到' });
    
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', sendVerificationCode);
      console.log('发送验证码按钮点击事件已绑定');
    }
    
    if (loginBtn) {
      // 使用addEventListener绑定点击事件，确保事件被正确绑定
      loginBtn.addEventListener('click', async function() {
        console.log('登录按钮被点击');
        await login();
      });
      console.log('登录按钮点击事件已绑定');
    } else {
      console.error('登录按钮未找到，无法绑定点击事件');
    }
  }, 100);
  
  const MAX_MOD_COUNT = 100;
  const XOR_DECRYPT_PASSWORD = "d.bxq.me";
  const XOR_MOD_SUFFIX = '.xor';

  let platform = null;
  let pkgFile = null;
  let modFiles = [];
  let processedMods = [];
  let outputBlob = null;

  // DOM 元素
  const pkgDropZone = document.getElementById('pkgDropZone');
  const pkgFileInput = document.getElementById('pkgFileInput');
  const pkgBrowseBtn = document.getElementById('pkgBrowseBtn');
  const pkgFileInfo = document.getElementById('pkgFileInfo');
  const pkgError = document.getElementById('pkgError');
  const pkgClearBtn = document.createElement('span');

  const modsDropZone = document.getElementById('modsDropZone');
  const modsFileInput = document.getElementById('modsFileInput');
  const modsBrowseBtn = document.getElementById('modsBrowseBtn');
  const modsFileList = document.getElementById('modsFileList');
  const modsError = document.getElementById('modsError');
  const modCountHint = document.createElement('div');

  const installBtn = document.getElementById('installBtn');
  const installProgress = document.getElementById('installProgress');
  const installProgressFill = document.getElementById('installProgressFill');
  const installProgressText = document.getElementById('installProgressText');
  const installError = document.getElementById('installError');
  const installResult = document.getElementById('installResult');
  const platformHint = document.getElementById('platformHint');
  const resultHint = document.getElementById('resultHint');

  // 工具函数
  function showError(el, msg) { 
    el.textContent = msg; 
    el.style.display = 'block'; 
    setTimeout(() => { el.style.display = 'none'; }, 6000); 
  }

  function formatFileSize(bytes) { 
    if (bytes < 1024) return bytes + ' B'; 
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'; 
    return (bytes / 1048576).toFixed(1) + ' MB'; 
  }

  function readFileAsArrayBuffer(file) { 
    return new Promise((res, rej) => { 
      const r = new FileReader(); 
      r.onload = () => res(r.result); 
      r.onerror = rej; 
      r.readAsArrayBuffer(file); 
    }); 
  }

  function setProgress(percent, text) { 
    installProgressFill.style.width = `${Math.max(0, Math.min(100, percent))}%`; 
    installProgressText.textContent = text || ''; 
  }

  function preventDefaults(e) { 
    e.preventDefault(); 
    e.stopPropagation(); 
  }

  function initDropZone(dropZone, fileInput, handler) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => 
      dropZone.addEventListener(ev, preventDefaults, false)
    );
    ['dragenter', 'dragover'].forEach(ev => 
      dropZone.addEventListener(ev, () => dropZone.classList.add('drag-over'), false)
    );
    ['dragleave', 'drop'].forEach(ev => 
      dropZone.addEventListener(ev, () => dropZone.classList.remove('drag-over'), false)
    );
    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt.files.length > 0) {
        if (fileInput.multiple) handler(Array.from(dt.files));
        else handler(dt.files[0]);
        fileInput.value = '';
      }
    });
  }

  // XOR 解密相关
  function stringToAsciiArray(str) {
    if (!str) throw new Error("XOR 解密密码未配置");
    return Array.from(str, c => c.charCodeAt(0));
  }

  function xorDecrypt(data, passwordAscii) {
    const result = new Uint8Array(data.length);
    const pwdLen = passwordAscii.length;
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i] ^ passwordAscii[i % pwdLen];
    }
    return result;
  }

  async function decryptXorFile(file) {
    const fileData = await readFileAsArrayBuffer(file);
    const passwordAscii = stringToAsciiArray(XOR_DECRYPT_PASSWORD);
    return xorDecrypt(new Uint8Array(fileData), passwordAscii);
  }

  // MD5 验证相关
  async function calculateArrayBufferMD5(arrayBuffer) {
    return new Promise((resolve) => {
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(arrayBuffer);
      resolve(spark.end());
    });
  }

  async function analyzeAndValidateMod(zip, modData, fileName) {
    let hasGamelogic = false;
    let hasMainfunctions = false;
    let hasModinfo = false;
    let hasModmain = false;
    let hasAddToObb = false;
    let addToObbFiles = new Map();
    let modDirName = '';
    let isBMPatch = false;
    let isBMMod = false;
    
    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const norm = path.replace(/\\/g, '/');
      const filePath = norm.toLowerCase();
      const fileNameOnly = norm.split('/').pop().toLowerCase();
      
      if (fileNameOnly === 'gamelogic.lua' || filePath.endsWith('/gamelogic.lua')) {
        hasGamelogic = true;
      }
      
      if (fileNameOnly === 'mainfunctions.lua' || filePath.endsWith('/mainfunctions.lua')) {
        hasMainfunctions = true;
      }
      
      if (fileNameOnly === 'modinfo.lua' || filePath.endsWith('/modinfo.lua')) {
        hasModinfo = true;
        modDirName = norm.split('/')[0];
        if (!hasGamelogic && !hasMainfunctions) {
          if (modDirName.startsWith('BM') && modDirName.length === 5) {
            isBMPatch = true;
          } else if (modDirName.startsWith('BM')) {
            isBMMod = true;
          }
        }
      }
      
      if (fileNameOnly === 'modmain.lua' || filePath.endsWith('/modmain.lua')) {
        hasModmain = true;
      }
      
      const m = filePath.match(/(^|\/)add_to_obb\/(.+)/);
      if (m) {
        hasAddToObb = true;
        const idx = filePath.indexOf('add_to_obb/');
        if (idx !== -1) {
          const rel = norm.slice(idx + 'add_to_obb/'.length);
          addToObbFiles.set(rel, entry);
        }
      }
    }
    
    const isFramework = hasGamelogic && hasMainfunctions;
    const isMod = hasModinfo && hasModmain;
    const isBMxxx = isBMPatch || isBMMod || hasAddToObb;

    let validation = { isValid: true, message: '✅ 验证通过' };
    
    if (isFramework) {
      try {
        let targetEntry = null;
        for (const [path, entry] of Object.entries(zip.files)) {
          if (entry.dir) continue;
          const fileNameOnly = path.toLowerCase().split('/').pop();
          if (fileNameOnly === 'mainfunctions.lua' || path.toLowerCase().endsWith('/mainfunctions.lua')) {
            targetEntry = entry;
            break;
          }
        }
        
        if (targetEntry) {
          const targetData = await targetEntry.async('arraybuffer');
          const calculatedMd5 = await calculateArrayBufferMD5(targetData);
          const calculatedMd5Lower = calculatedMd5.toLowerCase();
          
          const cleanedMd5List = FRAMEWORK_MAINFUNCTION_VALID_MD5S
            .map(md5 => typeof md5 === 'string' ? md5.trim().toLowerCase().replace(/[^a-f0-9]/g, '') : '')
            .filter(md5 => /^[a-f0-9]{32}$/.test(md5));
          
          const isValid = cleanedMd5List.includes(calculatedMd5Lower);
          
          if (!isValid) {
            const errorMsg = `<br>❌ 框架验证失败<br>当前MD5: ${calculatedMd5Lower}`;
            validation = { isValid: false, message: errorMsg };
          } else {
            validation = { isValid: true, message: `✅ 框架验证通过 (MD5: ${calculatedMd5Lower})` };
          }
        } else {
          validation = { isValid: false, message: '❌ 框架验证失败：未找到 mainfunctions.lua 文件' };
        }
      } catch (error) {
        validation = { isValid: false, message: `❌ 验证过程出错: ${error.message}` };
      }
    }
    
    return {
      name: fileName,
      data: modData,
      zip,
      analysis: {
        isFramework,
        isMod,
        isBMxxx,
        isBMPatch,
        isBMMod,
        hasAddToObb,
        addToObbFiles,
        modDirName,
        hasGamelogic,
        hasMainfunctions,
        hasModinfo,
        hasModmain
      },
      validation
    };
  }

  async function preprocessModFile(file) {
    const fileName = file.name.toLowerCase();
    let modData, targetName;
    
    try {
      if (fileName.endsWith(XOR_MOD_SUFFIX)) {
        const decryptedUint8 = await decryptXorFile(file);
        modData = decryptedUint8.buffer;
        targetName = file.name.slice(0, file.name.length - XOR_MOD_SUFFIX.length);
      } else {
        modData = await readFileAsArrayBuffer(file);
        targetName = file.name;
      }
      
      const signature = new Uint8Array(modData.slice(0, 4));
      const isZip = signature[0] === 0x50 && signature[1] === 0x4B && signature[2] === 0x03 && signature[3] === 0x04;
      const isXz = signature[0] === 0xFD && signature[1] === 0x37 && signature[2] === 0x7A && signature[3] === 0x58;
      if (!isZip && !isXz) {
        console.warn(`无效模组文件：${file.name}（解密后不是 Zip/XZ）`);
        return null;
      }
      
      const zip = await JSZip.loadAsync(modData);
      const processedMod = await analyzeAndValidateMod(zip, modData, targetName);
      
      console.log(`${file.name} 处理完成:`, {
        类型: processedMod.analysis.isFramework ? '框架' : 
              processedMod.analysis.isBMPatch ? 'BM补丁' :
              processedMod.analysis.isBMMod ? 'BM模组' :
              processedMod.analysis.isBMxxx ? '其他BM文件' : '第三方模组',
        验证: processedMod.validation.message
      });
      
      return processedMod;
      
    } catch (error) {
      console.error(`处理模组失败：${file.name}`, error);
      return null;
    }
  }

  async function processAndroidModFile(processedMod, platformData) {
    const { assetsMap, counters } = platformData;
    const { analysis, zip } = processedMod;
    
    try {
      if (analysis.hasAddToObb) {
        if (analysis.isFramework) {
          counters.framework++;
        } else if (analysis.isBMPatch) {
          counters.bmpatch++;
        } else if (analysis.isBMMod) {
          counters.bmmod++;
        } else if (analysis.isBMxxx) {
          counters.bmxxx++;
        } else if (analysis.isMod) {
          counters.framework++;
        }
        
        for (const [assetPath, entry] of analysis.addToObbFiles) {
          assetsMap.set(`assets/${assetPath}`, await entry.async('uint8array'));
        }
        return true;
      }
      
      if (analysis.isMod) {
        counters.thirdParty++;
        for (const [path, entry] of Object.entries(zip.files)) {
          if (entry.dir) continue;
          const norm = path.replace(/\\/g, '/');
          const newPath = `assets/mods/${norm}`;
          assetsMap.set(newPath, await entry.async('uint8array'));
        }
        return true;
      }
      
      console.warn(`不支持的文件格式：${processedMod.name}`);
      return false;
      
    } catch (error) {
      console.error(`处理模组失败：${processedMod.name}`, error);
      return false;
    }
  }

  async function processIOSModFile(processedMod, toAdd) {
    const { analysis, zip } = processedMod;
    
    try {
      if (analysis.hasAddToObb) {
        for (const [assetPath, entry] of analysis.addToObbFiles) {
          const u8 = await entry.async('uint8array');
          if (assetPath.startsWith('mods/') || assetPath.startsWith('scripts/')) {
            toAdd._data[assetPath] = u8;
          } else if (assetPath.startsWith('DLC0002/')) {
            const target = assetPath.replace(/^DLC0002\//, '');
            toAdd._dlc0002[target] = u8;
          } else {
            toAdd._data[assetPath] = u8;
          }
        }
        return true;
      }
      
      if (analysis.isMod) {
        for (const [path, entry] of Object.entries(zip.files)) {
          if (entry.dir) continue;
          const norm = path.replace(/\\/g, '/');
          const newPath = `mods/${norm}`;
          toAdd._data[newPath] = await entry.async('uint8array');
        }
        return true;
      }
      
      console.warn(`不支持的文件格式：${processedMod.name}`);
      return false;
      
    } catch (error) {
      console.error(`处理模组失败：${processedMod.name}`, error);
      return false;
    }
  }

  // UI 相关函数
  function initExtraElements() {
    pkgClearBtn.textContent = '[删除]';
    pkgClearBtn.style.color = '#d00';
    pkgClearBtn.style.cursor = 'pointer';
    pkgClearBtn.style.marginLeft = '10px';
    pkgClearBtn.style.fontSize = '14px';
    pkgClearBtn.addEventListener('click', clearPkgFile);
    pkgFileInfo.appendChild(pkgClearBtn);

    modCountHint.className = 'muted';
    modCountHint.style.margin = '8px 0';
    modCountHint.style.textAlign = 'right';
    modsDropZone.after(modCountHint);
    updateModCountHint();
  }

  function updateModCountHint() {
    modCountHint.textContent = `已选模组：${modFiles.length}/${MAX_MOD_COUNT} 个`;
    modCountHint.style.color = modFiles.length >= MAX_MOD_COUNT ? '#d00' : 'var(--secondary)';
    if (modFiles.length >= MAX_MOD_COUNT) {
      modCountHint.textContent += '（已达上限，无法继续添加）';
    }
  }

  function clearPkgFile() {
    pkgFile = null;
    pkgFileInfo.innerHTML = '';
    pkgFileInfo.style.display = 'none';
    platform = null;
    platformHint.textContent = '当前平台：未选择';
    checkReadyState();
  }

  function handlePkgFile(file) {
    const name = file.name.toLowerCase();
    if (name.endsWith('.apk')) {
      platform = 'android';
    } else if (name.endsWith('.ipa')) {
      platform = 'ios';
    } else {
      showError(pkgError, '请选择有效的安装包（.apk 或 .ipa）');
      return;
    }
    pkgError.style.display = 'none';
    pkgFile = file;
    pkgFileInfo.innerHTML = `<strong>${platform === 'android' ? '[安卓]' : '[苹果]'}</strong> ${file.name} (${formatFileSize(file.size)})`;
    pkgFileInfo.appendChild(pkgClearBtn);
    pkgFileInfo.style.display = 'block';
    platformHint.textContent = '当前平台：' + (platform === 'android' ? '[安卓]（APK）' : '[苹果]（IPA）');
    checkReadyState();
  }

  // ========== 核心：统一排序规则函数 ==========
  function getModTypeWeight(file) {
    const fileName = file.name.toUpperCase();
    // 1. 框架：BMxx.xx.xx 格式（含两个小数点）
    if (/^BM\d+\.\d+\.\d+/.test(fileName)) {
      return 1;
    }
    // 2. 模组：BM + 1-3位数字 格式（无小数点）
    else if (/^BM\d{1,3}\./.test(fileName)) { 
      return 3;
    }
    // 3. 补丁：其他 BM 前缀的文件
    else if (fileName.startsWith('BM')) {
      return 2;
    }
    // 4. 其他文件
    else {
      return 4;
    }
  }

  // ========== 统一排序比较器 ==========
  function modFileSorter(a, b) {
    const weightA = getModTypeWeight(a);
    const weightB = getModTypeWeight(b);
    if (weightA !== weightB) {
      return weightA - weightB;
    }
    return a.name.localeCompare(b.name);
  }

  // ========== 处理文件选择 ==========
  async function handleModFiles(newFiles) {
    modsError.style.display = 'none';
    const validNewFiles = newFiles.filter(f => f.name.match(/\.(zip|xz|xor)$/i) && !f.name.match(/\.smali$/i));
    if (validNewFiles.length === 0) {
      showError(modsError, '未找到有效的模组文件（.zip/.xz/.xor）');
      return;
    }

    const sortedNewFiles = validNewFiles.sort(modFileSorter);

    const existingNames = new Set(modFiles.map(f => f.name));
    const uniqueSortedNewFiles = sortedNewFiles.filter(f => !existingNames.has(f.name));
    
    if (uniqueSortedNewFiles.length === 0) {
      showError(modsError, '所选文件已在列表中，无需重复添加');
      modsFileInput.value = '';
      return;
    }

    modFiles = [...modFiles, ...uniqueSortedNewFiles];
    modFiles.sort(modFileSorter);

    if (modFiles.length > MAX_MOD_COUNT) {
      const overCount = modFiles.length - MAX_MOD_COUNT;
      modFiles = modFiles.slice(0, MAX_MOD_COUNT);
      showError(modsError, `模组数量超限！已自动截断为${MAX_MOD_COUNT}个（超出${overCount}个）`);
    }

    modsFileInput.value = '';
    renderModList();
    updateModCountHint();
    checkReadyState();
  }

  // ========== 渲染文件列表 & 修复删除排序 ==========
  function renderModList() {
    modsFileList.innerHTML = '';
    if (modFiles.length === 0) {
      modsFileList.style.display = 'none';
      return;
    }
    modsFileList.style.display = 'block';
    
    modFiles.forEach((file, index) => {
      const isXorMod = file.name.toLowerCase().endsWith(XOR_MOD_SUFFIX);
      const icon = isXorMod ? '🔒' : '💿';
      
      const div = document.createElement('div');
      div.className = 'file-item';
      div.innerHTML = `${icon} ${file.name} (${formatFileSize(file.size)})
        <span class="file-remove" data-index="${index}" style="color:#d00;cursor:pointer;margin-left:10px;">[删除]</span>`;
      modsFileList.appendChild(div);
    });

    document.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        modFiles.splice(index, 1);
        // ========== 关键修复：使用统一排序器 ==========
        modFiles.sort(modFileSorter);
        renderModList();
        updateModCountHint();
        checkReadyState();
        modsFileInput.value = '';
      });
    });
  }

  function checkReadyState() {
    installBtn.disabled = !(pkgFile && modFiles.length > 0);
  }

  // 预处理：按列表顺序
  async function preprocessAllModFiles() {
    processedMods = [];
    let processed = 0;
    
    for (const mf of modFiles) {
      setProgress(5 + (processed / modFiles.length) * 15, 
        `预处理：${mf.name} (${processed+1}/${modFiles.length})`);
      
      try {
        const processedMod = await preprocessModFile(mf);
        if (!processedMod) {
          console.warn('跳过不支持的模组：', mf.name);
          processed++;
          continue;
        }
        
        if (!processedMod.validation.isValid && processedMod.analysis.isFramework) {
          throw new Error(`${mf.name} ${processedMod.validation.message}`);
        }
        
        processedMods.push(processedMod);
        processed++;
        
      } catch (error) {
        console.error(`处理模组失败：${mf.name}`, error);
        throw error;
      }
    }

    console.log(`预处理完成：共处理${processedMods.length}个有效模组，顺序与文件列表一致`);
    return processedMods;
  }

  async function processAllPreprocessedMods(processFn, platformData) {
    let processed = 0;
    const total = processedMods.length;
    for (const processedMod of processedMods) {
      const percent = 20 + (processed / total) * 20;
      setProgress(percent, `处理：${processedMod.name} (${processed+1}/${total})`);
      
      const ok = await processFn(processedMod, platformData);
      if (!ok) console.warn('跳过不支持的模组：', processedMod.name);
      processed++;
    }
  }

  async function installForAndroid() {
    setProgress(20, '正在处理模组...');
    const assetsMap = new Map();
    const counters = { framework: 0, bmpatch: 0, bmmod: 0, bmxxx: 0, thirdParty: 0 };
    
    await processAllPreprocessedMods(processAndroidModFile, { assetsMap, counters });

    setProgress(40, '正在解析 APK...');
    const apkBuf = await readFileAsArrayBuffer(pkgFile);
    const apkZip = await JSZip.loadAsync(apkBuf);

    setProgress(50, '合并资源到 APK...');
    for (const [path, data] of assetsMap) apkZip.file(path, data);

    setProgress(60, '生成配置文件...');
    await generateBmmodsLuaAndroid(apkZip);

    setProgress(70, '打包 APK...');
    const blob = await apkZip.generateAsync({ type: 'blob' }, meta => {
      if (meta.percent) setProgress(70 + (meta.percent/100)*30, '正在生成 APK...');
    });
    return blob;
  }

  async function generateBmmodsLuaAndroid(apkZip) {
    const modsFolder = 'assets/mods/';
    const bmmodsPath = modsFolder + 'bmmods.lua';
    const tokenPath = modsFolder + '_token.lua';
    apkZip.folder(modsFolder);

    const thirdParty = new Set();
    for (const path in apkZip.files) {
      if (apkZip.files[path].dir) continue;
      if (path.startsWith(modsFolder)) {
        const parts = path.substring(modsFolder.length).split('/');
        if (parts.length > 1) thirdParty.add(parts[0]);
      }
    }
    
    let content = '-- 模组配置文件 - 自动生成\n\n';
    thirdParty.forEach(dir => {
      if (!/^BM\d{3}/.test(dir)) content += `Add('${dir}')\n`;
    });
    content += '\nreturn {}';
    apkZip.file(bmmodsPath, content);
    
    // 写入token文件
    if (checkLogin()) {
      const userId = getUserId();
      const token = getUserToken();
      const tokenContent = `return ${userId}, "${token}"`;
      apkZip.file(tokenPath, tokenContent);
    }
  }

  async function installForIOS() {
    setProgress(20, '正在处理模组...');
    const toAdd = { _data: {}, _dlc0002: {} };
    
    await processAllPreprocessedMods(processIOSModFile, toAdd);

    setProgress(40, '读取 IPA...');
    const ipaBuf = await readFileAsArrayBuffer(pkgFile);
    const ipaZip = await JSZip.loadAsync(ipaBuf);

    let appPath = '';
    for (const fn of Object.keys(ipaZip.files)) {
      if (fn.includes('Payload/') && fn.endsWith('.app/')) { 
        appPath = fn; 
        break; 
      }
    }
    if (!appPath) throw new Error('找不到 Payload 目录下的 .app');

    const dataArchivePath = `${appPath}data.archive`;
    const dlcArchivePath = `${appPath}dlc0002.archive`;
    const dataFile = ipaZip.files[dataArchivePath];
    const dlcFile = ipaZip.files[dlcArchivePath];

    if (!dataFile || dataFile.dir) throw new Error('找不到 data.archive');

    setProgress(45, '解包原始 archive...');
    const dataArchiveData = await dataFile.async('uint8array');
    const dlcArchiveData = dlcFile ? await dlcFile.async('uint8array') : null;
    const originalDataFiles = await KLFA.unpack(dataArchiveData);
    const originalDlcFiles = dlcArchiveData ? await KLFA.unpack(dlcArchiveData) : [];

    setProgress(50, '合并模组文件...');
    const mergedDataFiles = [...originalDataFiles];
    const mergedDlcFiles = [...originalDlcFiles];

    for (const [path, u8] of Object.entries(toAdd._data)) {
      const i = mergedDataFiles.findIndex(f => f.name === path);
      if (i >= 0) mergedDataFiles[i].data = u8;
      else mergedDataFiles.push({ name: path, data: u8, size: u8.length });
    }
    
    if (dlcArchiveData) {
      for (const [path, u8] of Object.entries(toAdd._dlc0002)) {
        const i = mergedDlcFiles.findIndex(f => f.name === path);
        if (i >= 0) mergedDlcFiles[i].data = u8;
        else mergedDlcFiles.push({ name: path, data: u8, size: u8.length });
      }
    }

    if (mergedDataFiles.length > 0) {
      setProgress(55, '生成配置文件...');
      const bmmodsContent = generateBmmodsLuaIOS(mergedDataFiles);
      const enc = new TextEncoder();
      const bytes = enc.encode(bmmodsContent);
      mergedDataFiles.push({ name: 'mods/bmmods.lua', data: bytes, size: bytes.length });
      
      // 添加token文件
      addTokenFileForIOS(mergedDataFiles);
    }

    setProgress(60, '重新打包 archive...');
    const newDataArchive = await KLFA.pack(mergedDataFiles);
    const newDlcArchive = dlcArchiveData ? await KLFA.pack(mergedDlcFiles) : null;

    setProgress(65, '更新 IPA...');
    ipaZip.remove(dataArchivePath);
    if (dlcFile) ipaZip.remove(dlcArchivePath);
    ipaZip.file(dataArchivePath, newDataArchive);
    if (newDlcArchive) ipaZip.file(dlcArchivePath, newDlcArchive);

    setProgress(70, '生成 IPA...');
    const blob = await ipaZip.generateAsync({ type: 'blob' }, meta => {
      if (meta.percent) setProgress(70 + (meta.percent/100)*30, '正在生成 IPA...');
    });
    return blob;
  }

  function generateBmmodsLuaIOS(mergedDataFiles) {
    const modsFolder = 'mods/';
    const thirdParty = new Set();
    for (const f of mergedDataFiles) {
      if (f.name.startsWith(modsFolder) && f.name.includes('/modinfo.lua')) {
        const rel = f.name.substring(modsFolder.length);
        const dir = rel.split('/')[0];
        if (dir && !/^BM\d{3}/.test(dir)) thirdParty.add(dir);
      }
    }
    
    let s = '-- 模组配置文件 - 自动生成\n\n';
    thirdParty.forEach(dir => { s += `Add('${dir}')\n`; });
    // s += `Test('BM000~19B0B01477E4869591A0DF7DD0A9ECF5', "樂卟嘶屬")\n`;
    s += '\nreturn {}';
    return s;
  }
  
  // 为iOS添加token文件
  function addTokenFileForIOS(mergedDataFiles) {
    if (checkLogin()) {
      const userId = getUserId();
      const token = getUserToken();
      const tokenContent = `return ${userId}, "${token}"`;
      const enc = new TextEncoder();
      const bytes = enc.encode(tokenContent);
      mergedDataFiles.push({ name: 'mods/_token.lua', data: bytes, size: bytes.length });
    }
  }

  async function installMods() {
    // 检查登录状态
    if (!checkLogin()) {
      showError(installError, '请先登录后再安装模组');
      return;
    }
    
    // 检查其他必要条件
    if (!platform || !pkgFile || modFiles.length === 0) return;
    
    // 开始安装流程
    installError.style.display = 'none';
    installResult.style.display = 'none';
    outputBlob = null;

    installProgress.style.display = 'block';
    setProgress(0, '准备安装...');

    try {
      console.log('🚀 开始安装流程');
      console.log('平台:', platform);
      console.log('安装包:', pkgFile.name);
      console.log('模组数量:', modFiles.length);
      
      setProgress(5, '预处理模组文件...');
      await preprocessAllModFiles();
      
      setProgress(20, '开始安装...');
      
      if (platform === 'android') {
        outputBlob = await installForAndroid();
        setProgress(100, '安装完成！（Android）');
        resultHint.textContent = '已生成 APK（未签名）。';
        document.getElementById('androidResult').style.display = 'block';
        document.getElementById('iosResult').style.display = 'none';
      } else {
        outputBlob = await installForIOS();
        setProgress(100, '安装完成！（iOS）');
        resultHint.textContent = '已生成 IPA（未签名）。';
        document.getElementById('iosResult').style.display = 'block';
        document.getElementById('androidResult').style.display = 'none';
      }
      
      console.log('🎉 安装流程完成');
      
      setTimeout(() => {
        document.getElementById('installResult').style.display = 'block';
        document.getElementById('installResult').scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch (err) {
      console.error('❌ 安装失败:', err.message);
      setProgress(0, '安装失败');
      showError(installError, '安装失败：' + (err && err.message ? err.message : String(err)));
    }
  }

  function saveOutput() {
    if (!outputBlob || !pkgFile || !platform) return;

    const ext = platform === 'android' ? '.apk' : '.ipa';
    const mime = platform === 'android'
      ? 'application/vnd.android.package-archive'
      : 'application/octet-stream';
    const pad = (n) => String(n).padStart(2, '0');
    const date = new Date();
    const stamp = `${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
    const filename = `_${stamp}-bm${ext}`;

    if (window.saveAs) {
      saveAs(new Blob([outputBlob], { type: mime }), filename);
    } else {
      const url = URL.createObjectURL(new Blob([outputBlob], { type: mime }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  // 初始化
  initExtraElements();
  
  initDropZone(pkgDropZone, pkgFileInput, handlePkgFile);
  initDropZone(modsDropZone, modsFileInput, handleModFiles);
  
  pkgBrowseBtn.addEventListener('click', () => pkgFileInput.click());
  modsBrowseBtn.addEventListener('click', () => modsFileInput.click());
  
  pkgFileInput.addEventListener('change', e => { 
    if (e.target.files.length) handlePkgFile(e.target.files[0]); 
  });
  
  modsFileInput.addEventListener('change', e => { 
    if (e.target.files.length) handleModFiles(Array.from(e.target.files)); 
  });
  
  installBtn.addEventListener('click', async () => { 
    await installMods(); 
  });
  
  document.getElementById('downloadBtnAndroid').addEventListener('click', () => saveOutput());
  document.getElementById('downloadBtnIOS').addEventListener('click', () => saveOutput());
});
