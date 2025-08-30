
// <script>
document.addEventListener('DOMContentLoaded', () => {
  // 状态
  let platform = null;           // 'android' | 'ios'
  let pkgFile = null;            // APK 或 IPA
  let modFiles = [];             // ZIP/XZ 模组
  let outputBlob = null;         // 最终生成文件

  // DOM
  const pkgDropZone = document.getElementById('pkgDropZone');
  const pkgFileInput = document.getElementById('pkgFileInput');
  const pkgBrowseBtn = document.getElementById('pkgBrowseBtn');
  const pkgFileInfo = document.getElementById('pkgFileInfo');
  const pkgError = document.getElementById('pkgError');

  const modsDropZone = document.getElementById('modsDropZone');
  const modsFileInput = document.getElementById('modsFileInput');
  const modsBrowseBtn = document.getElementById('modsBrowseBtn');
  const modsFileList = document.getElementById('modsFileList');
  const modsError = document.getElementById('modsError');

  const installBtn = document.getElementById('installBtn');
  const installProgress = document.getElementById('installProgress');
  const installProgressFill = document.getElementById('installProgressFill');
  const installProgressText = document.getElementById('installProgressText');
  const installError = document.getElementById('installError');
  const installResult = document.getElementById('installResult');
  const downloadBtn = document.getElementById('downloadBtn');
  const platformHint = document.getElementById('platformHint');
  const resultHint = document.getElementById('resultHint');

  // 绑定
  initDropZone(pkgDropZone, pkgFileInput, handlePkgFile);
  initDropZone(modsDropZone, modsFileInput, handleModFiles);
  pkgBrowseBtn.addEventListener('click', () => pkgFileInput.click());
  modsBrowseBtn.addEventListener('click', () => modsFileInput.click());
  pkgFileInput.addEventListener('change', e => { if (e.target.files.length) handlePkgFile(e.target.files[0]); });
  modsFileInput.addEventListener('change', e => { if (e.target.files.length) handleModFiles(Array.from(e.target.files)); });
  installBtn.addEventListener('click', async () => { await installMods(); });
  <!-- downloadBtn.addEventListener('click', () => saveOutput()); -->
  document.getElementById('downloadBtnAndroid').addEventListener('click', () => saveOutput());
  document.getElementById('downloadBtnIOS').addEventListener('click', () => saveOutput());

  // —— 处理安装包（自动识别平台）——
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
    pkgFileInfo.innerHTML = `${platform === 'android' ? '<i class="bi bi-android2"></i> Android - ' : '<i class="bi bi-apple"></i> iOS - '}<strong>${file.name}</strong> (${formatFileSize(file.size)})`;
    pkgFileInfo.style.display = 'block';
    platformHint.textContent = '当前平台：' + (platform === 'android' ? 'Android（APK）' : 'iOS（IPA）');
    checkReadyState();
  }

  // —— 处理模组文件 —— 
  function handleModFiles(files) {
    modsError.style.display = 'none';
    modFiles = files.filter(f => f.name.match(/\.(zip|xz)$/i) && !f.name.match(/\.smali$/i));
    if (modFiles.length === 0) {
      showError(modsError, '未找到有效的模组文件（.zip / .xz）');
      return;
    }
    // 排序：框架 > BMxxx > BM* > 三方
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
    modsFileList.innerHTML = '';
    modFiles.forEach(file => {
      let icon = '<i class="bi bi-box-seam"></i>'; let modType = '三方模组';
      if (/BM\d+\.\d+\.\d+\.zip/i.test(file.name)) { icon = '<i class="bi bi-cpu"></i>'; modType = 'BM框架'; }
      else if (/BM\d{3}\.zip/i.test(file.name)) { icon = '<i class="bi bi-puzzle"></i>'; modType = 'BM模组'; }
      else if (/BM.*\.zip/i.test(file.name)) { icon = '<i class="bi bi-wrench"></i>'; modType = 'BM补丁'; }
      // 统一隐藏具体类型标签：展示一个占位 "-"
      modType = ' - ';
      const div = document.createElement('div');
      div.className = 'file-item';
      div.innerHTML = `${icon} <strong>${modType}</strong> ${file.name} (${formatFileSize(file.size)})`;
      modsFileList.appendChild(div);
    });
    modsFileList.style.display = 'block';
    checkReadyState();
  }

  function checkReadyState() {
    installBtn.disabled = !(pkgFile && modFiles.length > 0);
  }

  // —— 安装 —— 
  async function installMods() {
    if (!platform || !pkgFile || modFiles.length === 0) return;
    installError.style.display = 'none';
    installResult.style.display = 'none';
    outputBlob = null;

    installProgress.style.display = 'block';
    setProgress(0, '准备安装...');

    try {
      // if (platform === 'android') {
        // outputBlob = await installForAndroid();
        // setProgress(100, '安装完成！（Android）');
        // resultHint.textContent = '已生成 APK（未签名）。';
      // } else {
        // outputBlob = await installForIOS();
        // setProgress(100, '安装完成！（iOS）');
        // resultHint.textContent = '已生成 IPA（未签名）。';
      // }
      // setTimeout(() => {
        // document.getElementById('installResult').style.display = 'block';
        // document.getElementById('installResult').scrollIntoView({behavior:'smooth'});
      // }, 300);
      
      if (platform === 'android') {
        outputBlob = await installForAndroid();
        setProgress(100, '安装完成！（Android）');
        resultHint.textContent = '已生成 APK（未签名）。';
      
        // 显示 Android 统计区域
        document.getElementById('androidResult').style.display = 'block';
        document.getElementById('iosResult').style.display = 'none';
      } else {
        outputBlob = await installForIOS();
        setProgress(100, '安装完成！（iOS）');
        resultHint.textContent = '已生成 IPA（未签名）。';
      
        // 显示 iOS 统计区域
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

  // —— Android 流程（APK）——
  async function installForAndroid() {
    setProgress(10, '正在解析 APK...');
    const apkBuf = await readFileAsArrayBuffer(pkgFile);
    const apkZip = await JSZip.loadAsync(apkBuf);

    setProgress(20, '正在处理模组...');
    const assetsMap = new Map();
    const counters = { framework:0, bmxxx:0, thirdParty:0 };

    let processed = 0;
    for (const mf of modFiles) {
      setProgress(20 + (processed / modFiles.length) * 30, `处理：${mf.name} (${processed+1}/${modFiles.length})`);
      const ok = await processModFileAndroid(mf, assetsMap, counters);
      if (!ok) console.warn('跳过不支持的模组：', mf.name);
      processed++;
    }

    setProgress(55, '合并资源到 APK...');
    for (const [path, data] of assetsMap) apkZip.file(path, data);

    setProgress(60, '生成配置文件...');
    await generateBmmodsLuaAndroid(apkZip);

    setProgress(65, '正在打包 APK...');
    const blob = await apkZip.generateAsync({ type: 'blob' }, meta => {
      if (meta.percent) setProgress(65 + (meta.percent/100)*35, '正在生成 APK...');
    });
    return blob;
  }

  async function processModFileAndroid(modFile, assetsMap, counters) {
    const buf = await readFileAsArrayBuffer(modFile);
    const zip = await JSZip.loadAsync(buf);

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

    // 三方模组
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

  // —— iOS 流程（IPA）——
  async function installForIOS() {
    // 收集要写入 data.archive / dlc0002.archive 的文件
    const toAdd = { '_data': {}, '_dlc0002': {} };

    setProgress(10, '处理模组文件...');
    let processed = 0;
    for (const mf of modFiles) {
      setProgress(10 + (processed / modFiles.length) * 30, `处理：${mf.name} (${processed+1}/${modFiles.length})`);
      const ok = await processModFileIOS(mf, toAdd);
      if (!ok) console.warn('跳过不支持的模组：', mf.name);
      processed++;
    }

    setProgress(45, '读取 IPA...');
    const ipaBuf = await readFileAsArrayBuffer(pkgFile);
    const ipaZip = await JSZip.loadAsync(ipaBuf);

    // 定位 Payload/*.app/
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

    setProgress(55, '解包原始 archive...');
    const dataArchiveData = await dataFile.async('uint8array');
    const dlcArchiveData  = dlcFile ? await dlcFile.async('uint8array') : null;

    const originalDataFiles = await KLFA.unpack(dataArchiveData);     // 需要 /js/klfa.encrypt.js
    const originalDlcFiles  = dlcArchiveData ? await KLFA.unpack(dlcArchiveData) : [];

    setProgress(70, '合并模组文件...');
    const mergedDataFiles = [...originalDataFiles];
    const mergedDlcFiles  = [...originalDlcFiles];

    // 写入 data.archive
    for (const [path, u8] of Object.entries(toAdd['_data'])) {
      const i = mergedDataFiles.findIndex(f => f.name === path);
      if (i >= 0) mergedDataFiles[i].data = u8;
      else mergedDataFiles.push({ name: path, data: u8, size: u8.length });
    }
    // 写入 dlc0002.archive
    if (dlcArchiveData) {
      for (const [path, u8] of Object.entries(toAdd['_dlc0002'])) {
        const i = mergedDlcFiles.findIndex(f => f.name === path);
        if (i >= 0) mergedDlcFiles[i].data = u8;
        else mergedDlcFiles.push({ name: path, data: u8, size: u8.length });
      }
    }

    // 生成 bmmods.lua（仅统计三方模组）
    if (mergedDataFiles.length > 0) {
      setProgress(78, '生成配置文件...');
      const bmmodsContent = generateBmmodsLuaIOS(mergedDataFiles);
      const enc = new TextEncoder();
      const bytes = enc.encode(bmmodsContent);
      mergedDataFiles.push({ name:'mods/bmmods.lua', data: bytes, size: bytes.length });
    }

    setProgress(85, '重新打包 archive...');
    const newDataArchive = await KLFA.pack(mergedDataFiles);
    const newDlcArchive  = dlcArchiveData ? await KLFA.pack(mergedDlcFiles) : null;

    setProgress(90, '更新 IPA...');
    ipaZip.remove(dataArchivePath);
    if (dlcFile) ipaZip.remove(dlcArchivePath);
    ipaZip.file(dataArchivePath, newDataArchive);
    if (newDlcArchive) ipaZip.file(dlcArchivePath, newDlcArchive);

    setProgress(95, '生成 IPA...');
    const blob = await ipaZip.generateAsync({ type:'blob' }, meta => {
      if (meta.percent) setProgress(95 + (meta.percent/100)*5, '压缩中...');
    });
    return blob;
  }

  async function processModFileIOS(modFile, toAdd) {
    const buf = await readFileAsArrayBuffer(modFile);
    const zip = await JSZip.loadAsync(buf);

    let hasAddToObb = false, hasMainLua = false;
    const addToObbFiles = new Map();

    // 扫描结构
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
          const rel = norm.slice(idx + 'add_to_obb/'.length); // 保留原大小写
          addToObbFiles.set(rel, entry);
        }
      }
    }

    if (hasAddToObb) {
      // 框架（含 main.lua） 或 标准 BM 模组（不含 main.lua）
      for (const [assetPath, entry] of addToObbFiles) {
        const u8 = await entry.async('uint8array');
        if (assetPath.startsWith('mods/') || assetPath.startsWith('scripts/')) {
          toAdd['_data'][assetPath] = u8;
        } else if (assetPath.startsWith('DLC0002/')) {
          const target = assetPath.replace(/^DLC0002\//,'');
          toAdd['_dlc0002'][target] = u8;
        } else {
          // 其他资源默认进 data
          toAdd['_data'][assetPath] = u8;
        }
      }
      return true;
    }

    // 三方模组：必须包含 modinfo.lua
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

    // 整包写入 data.archive 下的 mods/
    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const norm = path.replace(/\\/g,'/');
      const newPath = `mods/${norm}`;
      toAdd['_data'][newPath] = await entry.async('uint8array');
    }
    return true;
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
    s += '\nreturn {}';
    return s;
  }

  // —— 保存输出 —— 
  function saveOutput() {
    if (!outputBlob || !pkgFile || !platform) return;

    const ext = platform === 'android' ? '.apk' : '.ipa';
    const mime = platform === 'android'
      ? 'application/vnd.android.package-archive'
      : 'application/octet-stream';

    const date = new Date();
    // 补零函数
    const pad = (n) => String(n).padStart(2, '0');
    // 各个时间部分
    const yy = String(date.getFullYear()).slice(-2); // 年（两位）
    const mm = pad(date.getMonth() + 1);             // 月
    const dd = pad(date.getDate());                  // 日
    const hh = pad(date.getHours());                 // 时
    const mi = pad(date.getMinutes());               // 分
    const ss = pad(date.getSeconds());               // 秒
    
    // const stamp = `${yy}${mm}${dd}_${hh}${mi}${ss}`;
    // const filename = pkgFile.name
      // .replace(/_.*?(?=\.(apk|ipa)$)/i, '') // 去掉原文件名中末尾下划线段
      // .replace(/\.(apk|ipa)$/i, `_${stamp}${ext}`);

    const stamp = `${mm}${dd}-${hh}${mi}`;
    const filename = `_${stamp}-bm${ext}`;

    saveAs(new Blob([outputBlob], { type: mime }), filename);
  }

  // —— 工具函数 —— 
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
// </script>