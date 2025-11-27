document.addEventListener('DOMContentLoaded', () => {
  // 状态（保留原定义，新增文件数量统计）
  let platform = null;           // 'android' | 'ios'
  let pkgFile = null;            // APK 或 IPA
  let modFiles = [];             // ZIP/XZ 模组（支持追加）
  let outputBlob = null;         // 最终生成文件
  const MAX_MOD_COUNT = 100;     // 新增：模组数量上限

  // DOM（保留原定义，补充删除功能相关元素）
  const pkgDropZone = document.getElementById('pkgDropZone');
  const pkgFileInput = document.getElementById('pkgFileInput');
  const pkgBrowseBtn = document.getElementById('pkgBrowseBtn');
  const pkgFileInfo = document.getElementById('pkgFileInfo');
  const pkgError = document.getElementById('pkgError');
  const pkgClearBtn = document.createElement('span'); // 新增：安装包删除按钮

  const modsDropZone = document.getElementById('modsDropZone');
  const modsFileInput = document.getElementById('modsFileInput');
  const modsBrowseBtn = document.getElementById('modsBrowseBtn');
  const modsFileList = document.getElementById('modsFileList');
  const modsError = document.getElementById('modsError');
  const modCountHint = document.createElement('div'); // 新增：模组数量提示

  const installBtn = document.getElementById('installBtn');
  const installProgress = document.getElementById('installProgress');
  const installProgressFill = document.getElementById('installProgressFill');
  const installProgressText = document.getElementById('installProgressText');
  const installError = document.getElementById('installError');
  const installResult = document.getElementById('installResult');
  const platformHint = document.getElementById('platformHint');
  const resultHint = document.getElementById('resultHint');
  
  // XOR 解密配置与工具函数（支持 .XOR 模组解密）
  const XOR_DECRYPT_PASSWORD = "d.bxq.me"; // 与加密时密码一致
  const XOR_MOD_SUFFIX = '.xor'; // 加密模组后缀
  
  // 将字符串转换为 ASCII 数组（密码处理）
  function stringToAsciiArray(str) {
    if (!str) throw new Error("XOR 解密密码未配置");
    const arr = [];
    for (let i = 0; i < str.length; i++) arr.push(str.charCodeAt(i));
    return arr;
  }
  
  // 核心 XOR 解密逻辑
  function xorDecrypt(data, passwordAscii) {
    const result = new Uint8Array(data.length);
    const pwdLen = passwordAscii.length;
    for (let i = 0; i < data.length; i++) result[i] = data[i] ^ passwordAscii[i % pwdLen];
    return result;
  }
  
  // 解密 .XOR 文件为 Uint8Array
  async function decryptXorFile(file) {
    const fileData = await readFileAsArrayBuffer(file);
    const passwordAscii = stringToAsciiArray(XOR_DECRYPT_PASSWORD);
    return xorDecrypt(new Uint8Array(fileData), passwordAscii);
  }


  // 初始化：创建并插入删除按钮与数量提示
  function initExtraElements() {
    // 1. 安装包删除按钮（插入到文件信息栏）
    pkgClearBtn.textContent = '[删除]';
    pkgClearBtn.style.color = '#d00';
    pkgClearBtn.style.cursor = 'pointer';
    pkgClearBtn.style.marginLeft = '10px';
    pkgClearBtn.style.fontSize = '14px';
    pkgClearBtn.addEventListener('click', clearPkgFile);
    pkgFileInfo.appendChild(pkgClearBtn);

    // 2. 模组数量提示（插入到模组列表上方）
    modCountHint.className = 'muted';
    modCountHint.style.margin = '8px 0';
    modCountHint.style.textAlign = 'right';
    modsDropZone.after(modCountHint);
    updateModCountHint();
  }
  initExtraElements(); // 执行初始化

  // 绑定（保留原绑定，无修改）
  initDropZone(pkgDropZone, pkgFileInput, handlePkgFile);
  initDropZone(modsDropZone, modsFileInput, handleModFiles);
  pkgBrowseBtn.addEventListener('click', () => pkgFileInput.click());
  modsBrowseBtn.addEventListener('click', () => modsFileInput.click());
  pkgFileInput.addEventListener('change', e => { if (e.target.files.length) handlePkgFile(e.target.files[0]); });
  modsFileInput.addEventListener('change', e => { if (e.target.files.length) handleModFiles(Array.from(e.target.files)); });
  installBtn.addEventListener('click', async () => { await installMods(); });
  document.getElementById('downloadBtnAndroid').addEventListener('click', () => saveOutput());
  document.getElementById('downloadBtnIOS').addEventListener('click', () => saveOutput());

  // —— 新增1：安装包删除功能 ——
  function clearPkgFile() {
    pkgFile = null;
    pkgFileInfo.innerHTML = ''; // 清空文件信息
    pkgFileInfo.style.display = 'none';
    platform = null;
    platformHint.textContent = '当前平台：未选择';
    checkReadyState();
  }

  // —— 新增2：模组数量提示更新 ——
  function updateModCountHint() {
    modCountHint.textContent = `已选模组：${modFiles.length}/${MAX_MOD_COUNT} 个`;
    // 数量超限提示
    if (modFiles.length >= MAX_MOD_COUNT) {
      modCountHint.style.color = '#d00';
      modCountHint.textContent += '（已达上限，无法继续添加）';
    } else {
      modCountHint.style.color = 'var(--secondary)';
    }
  }

  // —— 优化1：处理安装包（保留原逻辑，调整删除按钮显示）——
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
    // 重构文件信息HTML，包含删除按钮
    pkgFileInfo.innerHTML = `<strong>${platform === 'android' ? '[安卓]' : '[苹果]'}</strong> ${file.name} (${formatFileSize(file.size)})`;
    pkgFileInfo.appendChild(pkgClearBtn); // 重新添加删除按钮
    pkgFileInfo.style.display = 'block';
    platformHint.textContent = '当前平台：' + (platform === 'android' ? '[安卓]（APK）' : '[苹果]（IPA）');
    checkReadyState();
  }
  
  /**
 * 模组预处理：自动解密 .XOR 文件，返回原始模组数据（Zip/XZ）
 * @param {File} file - 待处理模组文件（可能是 Zip/XZ 或 XOR 加密文件）
 * @returns {Promise<{name: string, data: ArrayBuffer}|null>} 预处理后的模组数据，无效则返回 null
 */
  async function preprocessModFile(file) {
    const fileName = file.name.toLowerCase();
    let modData, targetName;
  
    try {
      if (fileName.endsWith(XOR_MOD_SUFFIX)) {
        // 解密 .XOR 文件
        const decryptedUint8 = await decryptXorFile(file);
        modData = decryptedUint8.buffer;
        // 移除 .xor 后缀，恢复原始文件名（如 "mod.zip.xor" → "mod.zip"）
        targetName = file.name.slice(0, file.name.length - XOR_MOD_SUFFIX.length);
      } else {
        // 普通 Zip/XZ 文件，直接读取
        modData = await readFileAsArrayBuffer(file);
        targetName = file.name;
      }
  
      // 验证解密后是否为有效 Zip/XZ（通过文件签名简单校验）
      const signature = new Uint8Array(modData.slice(0, 4));
      const isZip = signature[0] === 0x50 && signature[1] === 0x4B && signature[2] === 0x03 && signature[3] === 0x04;
      const isXz = signature[0] === 0xFD && signature[1] === 0x37 && signature[2] === 0x7A && signature[3] === 0x58;
      
      if (!isZip && !isXz) {
        console.warn(`无效模组文件：${file.name}（解密后不是 Zip/XZ）`);
        return null;
      }
  
      return { name: targetName, data: modData };
    } catch (error) {
      console.error(`处理模组失败：${file.name}`, error);
      return null;
    }
  }


  // —— 优化2：处理模组文件（改为追加模式，支持去重+数量限制）——
  function handleModFiles(newFiles) {
    modsError.style.display = 'none';
    // 步骤1：过滤有效模组（保留原逻辑）
    const validNewFiles = newFiles.filter(f => f.name.match(/\.(zip|xz|xor)$/i) && !f.name.match(/\.smali$/i));
    if (validNewFiles.length === 0) {
      showError(modsError, '未找到有效的模组文件（.zip/.xz/.xor）');
      return;
    }

    // 步骤2：去重（按文件名+大小，避免重复添加）
    const uniqueNewFiles = validNewFiles.filter(newFile => 
      !modFiles.some(existFile => 
        existFile.name === newFile.name && existFile.size === newFile.size
      )
    );
    if (uniqueNewFiles.length === 0) {
      showError(modsError, '所选文件已在列表中，无需重复添加');
      return;
    }

    // 步骤3：数量限制校验
    const totalAfterAdd = modFiles.length + uniqueNewFiles.length;
    if (totalAfterAdd > MAX_MOD_COUNT) {
      const available = MAX_MOD_COUNT - modFiles.length;
      const actualAdd = available > 0 ? uniqueNewFiles.slice(0, available) : [];
      if (actualAdd.length > 0) {
        modFiles = [...modFiles, ...actualAdd];
        showError(modsError, `模组数量超限！仅添加${actualAdd.length}个（剩余${available}个名额）`);
      } else {
        showError(modsError, `模组数量已达上限（${MAX_MOD_COUNT}个），无法继续添加`);
        return;
      }
    } else {
      // 数量未超限，全部追加
      modFiles = [...modFiles, ...uniqueNewFiles];
    }

    // 步骤4：排序（保留原逻辑）
    modFiles.sort((a, b) => {
      const weight = (fn) => {
        if (/BM\d+\.\d+\.\d+\.zip/i.test(fn)) return 0;
        if (/BM\d{3}\.zip/i.test(fn)) return 1;
        if (/BM.*\.zip/i.test(fn)) return 2;
        return 3;
      };
      const wa = weight(a.name), wb = weight(b.name);
      return wa !== wb ? wa - wb : a.name.localeCompare(b.name);
    });

    // 步骤5：更新模组列表（新增删除按钮）
    renderModList();
    // 步骤6：更新数量提示
    updateModCountHint();
    checkReadyState();
  }

  // —— 新增3：渲染模组列表（带单个删除按钮）——
  function renderModList() {
   modsFileList.innerHTML = '';
   if (modFiles.length === 0) {
     modsFileList.style.display = 'none';
     return;
   }
   modsFileList.style.display = 'block';
   modFiles.forEach((file, index) => {
     let modType = '[其他]';
     let icon = '💿';
     // 新增：判断是否为加密模组
     const isXorMod = file.name.toLowerCase().endsWith(XOR_MOD_SUFFIX);
     if (/BM\d+\.\d+\.\d+\.zip/i.test(file.name)) { 
       icon = '📀'; 
       modType = '[框架]'; 
     } else if (/BM\d{3}\.zip/i.test(file.name)) { 
       icon = '📀'; 
       modType = '[模组]'; 
     } else if (/BM.*\.zip/i.test(file.name)) { 
       icon = '📀'; 
       modType = '[补丁]'; 
     }
     // 保留原有的 icon 和 modType 控制逻辑，新增加密标识
     icon = isXorMod ? '🔒' : icon; 
     modType = isXorMod ? modType : modType;
     const div = document.createElement('div');
     div.className = 'file-item';
     div.innerHTML = `${icon} <strong>${modType}</strong> ${file.name} (${formatFileSize(file.size)})
       <span class="file-remove" data-index="${index}" style="color:#d00;cursor:pointer;margin-left:10px;">[删除]</span>`;
     modsFileList.appendChild(div);
   });

    // 绑定单个模组删除事件
    document.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        modFiles.splice(index, 1); // 删除对应索引的模组
        renderModList(); // 重新渲染列表
        updateModCountHint(); // 更新数量提示
        checkReadyState();
      });
    });
  }

  // —— 保留原逻辑：状态检查 ——
  function checkReadyState() {
    installBtn.disabled = !(pkgFile && modFiles.length > 0);
  }

  // —— 保留原逻辑：安装流程 ——
  async function installMods() {
    if (!platform || !pkgFile || modFiles.length === 0) return;
    installError.style.display = 'none';
    installResult.style.display = 'none';
    outputBlob = null;

    installProgress.style.display = 'block';
    setProgress(0, '准备安装...');

    try {
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
      
      setTimeout(() => {
        document.getElementById('installResult').style.display = 'block';
        document.getElementById('installResult').scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch (err) {
      console.error(err);
      setProgress(0, '安装失败');
      showError(installError, '安装失败：' + (err && err.message ? err.message : String(err)));
    }
  }

  // —— 保留原逻辑：Android 流程 ——
  async function installForAndroid() {
    setProgress(10, '正在处理模组...');
    const assetsMap = new Map();
    const counters = { framework:0, bmxxx:0, thirdParty:0 };
    let processed = 0;
    for (const mf of modFiles) {
      setProgress(10 + (processed / modFiles.length) * 20, `处理：${mf.name} (${processed+1}/${modFiles.length})`);
      // 新增：模组预处理（解密 .XOR 文件）
      const processedMod = await preprocessModFile(mf);
      if (!processedMod) {
        console.warn('跳过不支持的模组：', mf.name);
        processed++;
        continue;
      }
      // 传入预处理后的模组数据
      const ok = await processModFileAndroid(processedMod, assetsMap, counters);
      if (!ok) console.warn('跳过不支持的模组：', mf.name);
      processed++;
    }

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

  // —— 保留原逻辑：Android 模组处理 ——
  async function processModFileAndroid(processedMod, assetsMap, counters) {
    const { name: modFileName, data: modData } = processedMod;
    // 直接使用预处理后的模组数据加载 Zip
    const zip = await JSZip.loadAsync(modData);
  
    // 后续逻辑不变（保持原有的 AddToObb 解析和资源合并逻辑）
    let hasAddToObb = false, hasMainLua = false;
    const addToObbFiles = new Map();
  
    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const norm = path.replace(/\\/g,'/');
      const lower = norm.toLowerCase();
      if (lower.endsWith('/main.lua')) hasMainLua = true;
      const m = lower.match(/(^|\/)add_to_obb\/(.+)/);
      if (m) {
        hasAddToObb = true;
        const idx = norm.toLowerCase().indexOf('add_to_obb/');
        if (idx !== -1) {
          const rel = norm.slice(idx + 'add_to_obb/'.length);
          addToObbFiles.set(`assets/${rel}`, entry);
        }
      }
    }
  
    if (hasAddToObb) {
      if (hasMainLua) counters.framework++; else counters.bmxxx++;
      for (const [assetPath, entry] of addToObbFiles) {
        assetsMap.set(assetPath, await entry.async('uint8array'));
      }
      return true;
    }
  
    // 三方模组验证逻辑不变
    let modinfoFound = false;
    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const norm = path.replace(/\\/g,'/');
      if (norm.toLowerCase().endsWith('/modinfo.lua')) { modinfoFound = true; break; }
    }
    if (!modinfoFound) return false;
  
    counters.thirdParty++;
    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const norm = path.replace(/\\/g,'/');
      const newPath = `assets/mods/${norm}`;
      assetsMap.set(newPath, await entry.async('uint8array'));
    }
    return true;
  }


  // —— 保留原逻辑：Android 配置生成 ——
  async function generateBmmodsLuaAndroid(apkZip) {
    const modsFolder = 'assets/mods/';
    const bmmodsPath = modsFolder + 'bmmods.lua';
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
  }

  // —— 保留原逻辑：iOS 流程 ——
  async function installForIOS() {
    const toAdd = { '_data': {}, '_dlc0002': {} };
     setProgress(10, '处理模组文件...');
     let processed = 0;
     for (const mf of modFiles) {
       setProgress(10 + (processed / modFiles.length) * 20, `处理：${mf.name} (${processed+1}/${modFiles.length})`);
       // 新增：模组预处理（解密 .XOR 文件）
       const processedMod = await preprocessModFile(mf);
       if (!processedMod) {
         console.warn('跳过不支持的模组：', mf.name);
         processed++;
         continue;
       }
       // 传入预处理后的模组数据
       const ok = await processModFileIOS(processedMod, toAdd);
       if (!ok) console.warn('跳过不支持的模组：', mf.name);
       processed++;
     }

    setProgress(35, '读取 IPA...');
    const ipaBuf = await readFileAsArrayBuffer(pkgFile);
    const ipaZip = await JSZip.loadAsync(ipaBuf);

    let appPath = '';
    for (const fn of Object.keys(ipaZip.files)) {
      if (fn.includes('Payload/') && fn.endsWith('.app/')) { appPath = fn; break; }
    }
    if (!appPath) throw new Error('找不到 Payload 目录下的 .app');

    const dataArchivePath = `${appPath}data.archive`;
    const dlcArchivePath  = `${appPath}dlc0002.archive`;

    const dataFile = ipaZip.files[dataArchivePath];
    const dlcFile  = ipaZip.files[dlcArchivePath];

    if (!dataFile || dataFile.dir) throw new Error('找不到 data.archive');

    setProgress(40, '解包原始 archive...');
    const dataArchiveData = await dataFile.async('uint8array');
    const dlcArchiveData  = dlcFile ? await dlcFile.async('uint8array') : null;

    const originalDataFiles = await KLFA.unpack(dataArchiveData);     // 需要 /js/klfa.encrypt.js
    const originalDlcFiles  = dlcArchiveData ? await KLFA.unpack(dlcArchiveData) : [];

    setProgress(45, '合并模组文件...');
    const mergedDataFiles = [...originalDataFiles];
    const mergedDlcFiles  = [...originalDlcFiles];

    for (const [path, u8] of Object.entries(toAdd['_data'])) {
      const i = mergedDataFiles.findIndex(f => f.name === path);
      if (i >= 0) mergedDataFiles[i].data = u8;
      else mergedDataFiles.push({ name: path, data: u8, size: u8.length });
    }
    if (dlcArchiveData) {
      for (const [path, u8] of Object.entries(toAdd['_dlc0002'])) {
        const i = mergedDlcFiles.findIndex(f => f.name === path);
        if (i >= 0) mergedDlcFiles[i].data = u8;
        else mergedDlcFiles.push({ name: path, data: u8, size: u8.length });
      }
    }

    if (mergedDataFiles.length > 0) {
      setProgress(50, '生成配置文件...');
      const bmmodsContent = generateBmmodsLuaIOS(mergedDataFiles);
      const enc = new TextEncoder();
      const bytes = enc.encode(bmmodsContent);
      mergedDataFiles.push({ name:'mods/bmmods.lua', data: bytes, size: bytes.length });
    }

    setProgress(55, '重新打包 archive...');
    const newDataArchive = await KLFA.pack(mergedDataFiles);
    const newDlcArchive  = dlcArchiveData ? await KLFA.pack(mergedDlcFiles) : null;

    setProgress(60, '更新 IPA...');
    ipaZip.remove(dataArchivePath);
    if (dlcFile) ipaZip.remove(dlcArchivePath);
    ipaZip.file(dataArchivePath, newDataArchive);
    if (newDlcArchive) ipaZip.file(dlcArchivePath, newDlcArchive);

    setProgress(70, '生成 IPA...');
    const blob = await ipaZip.generateAsync({ type:'blob' }, meta => {
      if (meta.percent) setProgress(70 + (meta.percent/100)*20, '正在生成 IPA...');
    });
    return blob;
  }

  // —— 保留原逻辑：iOS 模组处理 ——
  async function processModFileIOS(processedMod, toAdd) {
    const { name: modFileName, data: modData } = processedMod;
    // 直接使用预处理后的模组数据加载 Zip
    const zip = await JSZip.loadAsync(modData);
  
    // 后续逻辑不变（保持原有的 AddToObb 解析和资源合并逻辑）
    let hasAddToObb = false, hasMainLua = false;
    const addToObbFiles = new Map();
  
    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const norm = path.replace(/\\/g,'/');
      const lower = norm.toLowerCase();
      if (lower.endsWith('/main.lua')) hasMainLua = true;
      const m = lower.match(/(^|\/)add_to_obb\/(.+)/);
      if (m) {
        hasAddToObb = true;
        const idx = norm.toLowerCase().indexOf('add_to_obb/');
        if (idx !== -1) {
          const rel = norm.slice(idx + 'add_to_obb/'.length);
          addToObbFiles.set(rel, entry);
        }
      }
    }
  
    if (hasAddToObb) {
      for (const [assetPath, entry] of addToObbFiles) {
        const u8 = await entry.async('uint8array');
        if (assetPath.startsWith('mods/') || assetPath.startsWith('scripts/')) {
          toAdd['_data'][assetPath] = u8;
        } else if (assetPath.startsWith('DLC0002/')) {
          const target = assetPath.replace(/^DLC0002\//,'');
          toAdd['_dlc0002'][target] = u8;
        } else {
          toAdd['_data'][assetPath] = u8;
        }
      }
      return true;
    }
  
    // 三方模组验证逻辑不变
    let modinfoFound = false, modDirName = '';
    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const norm = path.replace(/\\/g,'/');
      if (norm.toLowerCase().endsWith('/modinfo.lua')) {
        modinfoFound = true;
        modDirName = norm.split('/')[0];
        break;
      }
    }
    if (!modinfoFound) return false;
  
    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const norm = path.replace(/\\/g,'/');
      const newPath = `mods/${norm}`;
      toAdd['_data'][newPath] = await entry.async('uint8array');
    }
    return true;
  }


  // —— 保留原逻辑：iOS 配置生成 ——
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
    s += '\nreturn {}';
    return s;
  }

  // —— 保留原逻辑：保存输出 ——
  function saveOutput() {
    if (!outputBlob || !pkgFile || !platform) return;

    const ext = platform === 'android' ? '.apk' : '.ipa';
    const mime = platform === 'android'
      ? 'application/vnd.android.package-archive'
      : 'application/octet-stream';

    const date = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    const stamp = `${mm}${dd}-${hh}${mi}`;
    const filename = `_${stamp}-bm${ext}`;

    saveAs(new Blob([outputBlob], { type: mime }), filename);
  }

  // —— 保留原逻辑：工具函数 ——
  function initDropZone(dropZone, fileInput, handler) {
    ['dragenter','dragover','dragleave','drop'].forEach(ev => dropZone.addEventListener(ev, preventDefaults, false));
    ['dragenter','dragover'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.add('drag-over'), false));
    ['dragleave','drop'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.remove('drag-over'), false));
    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt.files.length > 0) {
        if (fileInput.multiple) handler(Array.from(dt.files));
        else handler(dt.files[0]);
      }
    });
  }

  function preventDefaults(e){ e.preventDefault(); e.stopPropagation(); }
  function setProgress(percent, text){ installProgressFill.style.width = `${Math.max(0, Math.min(100, percent))}%`; installProgressText.textContent = text || ''; }
  function showError(el, msg){ el.textContent = msg; el.style.display = 'block'; setTimeout(() => { el.style.display='none'; }, 6000); }
  function formatFileSize(bytes){ if (bytes < 1024) return bytes + ' B'; if (bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB'; return (bytes/1048576).toFixed(1) + ' MB'; }
  function readFileAsArrayBuffer(file){ return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsArrayBuffer(file); }); }
});
