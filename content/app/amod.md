---
title: ""
layout: page
searchHidden: true
disableJsonLd: true
---

<style>
  h1 {
    text-align: center;
    margin-bottom: 30px;
  }
  .section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
  .drop-zone {
    border: 2px dashed #aaa;
    padding: 20px;
    text-align: center;
    margin: 10px 0;
    cursor: pointer;
    border-radius: 3px;
  }
  .drop-zone.drag-over {
    border-color: #666;
  }
  .section button {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px; /* 可去掉左右固定padding，避免与width冲突 */
    margin: 10px auto;
    border-radius: 3px;
    cursor: pointer;
    display: block;
    width: 200px; /* 固定宽度，根据需求调整数值 */
  }
  .section button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px #666;
  }

  .file-info {
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 3px;
      white-space: nowrap; /* 保持一行不换行 */
      overflow-x: auto; /* 允许横向滑动 */
  }

  .progress-container {
    margin: 10px 0;
    display: none;
  }
  .progress-bar {
    height: 5px;
    border: 1px solid #666;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    width: 0%;
    transition: width 0.3s;
    background-color: #4cd964; /* 进度填充色（绿色示例） */
  }

  .error {
    color: red;
    margin: 10px 0;
    display: none;
  }
  .file-list {
    margin: 10px 0;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    padding: 10px;
  }
  .file-item {
    padding: 5px;
    border-bottom: 1px solid #eee;
  }
  .file-item:last-child {
    border-bottom: none;
  }
</style>


<h1><i class="bi bi-android2"></i> 模组安装器 </h1>

<div class="section reminder">
    <p><strong>温馨提示：</strong> 本工具<strong>不消耗流量</strong>，文件在浏览器本地处理，不需要上传到服务器。经过测试，Chrome、Edge浏览器可正常使用本工具，其他浏览器兼容性未知。</p>
</div>

<div class="section">
    <h3>1. 选择APK安装包</h3>
    <div id="apkDropZone" class="drop-zone">
        <p>拖放 .apk 文件到这里 或</p>
        <button id="apkBrowseBtn">选择APK文件</button>
        <input type="file" id="apkFileInput" accept=".apk" style="display: none;">
    </div>
    <div id="apkFileInfo" class="file-info" style="display: none;"></div>
    <div id="apkError" class="error"></div>
</div>

<div class="section">
    <h3>2. 选择ZIP文件(多选)</h3>
    <p class="note">支持BM框架、BM模组和三方模组</p>
    <div id="modsDropZone" class="drop-zone">
        <p>拖放 .zip 文件到这里 或</p>
        <button id="modsBrowseBtn">选择模组文件</button>
        <input type="file" id="modsFileInput" accept=".zip" multiple style="display: none;">
    </div>
    <div id="modsFileList" class="file-list" style="display: none;"></div>
    <div id="modsError" class="error"></div>
</div>

<div class="section">
    <h3>3. 安装模组</h3>
    <button id="installBtn" disabled>开始安装</button>
    <div id="installProgress" class="progress-container">
        <div class="progress-bar">
            <div id="installProgressFill" class="progress-fill"></div>
        </div>
        <p id="installProgressText">准备就绪</p>
    </div>
    <div id="installError" class="error"></div>
    <div id="installResult" style="display: none;">
        <button id="downloadBtn">下载修改后的APK</button>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        // 文件变量
        let apkFile = null;
        let modFiles = [];
        let modifiedApk = null;
        
        // DOM元素
        const apkDropZone = document.getElementById('apkDropZone');
        const apkFileInput = document.getElementById('apkFileInput');
        const apkBrowseBtn = document.getElementById('apkBrowseBtn');
        const apkFileInfo = document.getElementById('apkFileInfo');
        const apkError = document.getElementById('apkError');
        
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
        
        // 初始化拖放区域
        initDropZone(apkDropZone, apkFileInput, handleApkFile);
        initDropZone(modsDropZone, modsFileInput, handleModFiles);
        
        // 浏览按钮事件
        apkBrowseBtn.addEventListener('click', () => apkFileInput.click());
        modsBrowseBtn.addEventListener('click', () => modsFileInput.click());
        
        // 文件选择事件
        apkFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleApkFile(e.target.files[0]);
        });
        
        modsFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleModFiles(Array.from(e.target.files));
        });
        
        // 安装按钮事件
        installBtn.addEventListener('click', async () => {
            await installMods();
        });
        
        // 下载按钮事件
        downloadBtn.addEventListener('click', () => {
            if (modifiedApk) {
                const filename = apkFile.name.replace(/\.apk$/i, '_modded.apk');
                const blob = new Blob([modifiedApk], { type: 'application/vnd.android.package-archive' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
            }
        });
        
        // 处理APK文件
        function handleApkFile(file) {
            if (!file.name.toLowerCase().endsWith('.apk')) {
                showError(apkError, '请选择有效的APK文件');
                return;
            }
            apkError.style.display = 'none';
            apkFile = file;
            apkFileInfo.innerHTML = `<i class="bi bi-android2">${file.name} (${formatFileSize(file.size)})`;
            apkFileInfo.style.display = 'block';
            checkReadyState();
        }
        
        // 处理模组文件（包括框架文件）
        function handleModFiles(files) {
            modsError.style.display = 'none';
            
            // 更宽松的过滤规则
            modFiles = files.filter(file => 
                file.name.match(/\.zip/i) &&  // 接受所有ZIP文件
                !file.name.match(/\.smali$/i) // 排除明显的非模组文件
            );
            
            if (modFiles.length === 0) {
                showError(modsError, '未找到有效的ZIP模组文件');
                return;
            }
            
            modsFileList.innerHTML = '';
            modFiles.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                
                // 识别文件类型
                let modType = 'unknown';
                let icon = '❓';
                
                if (file.name.match(/BM\d{3}\.zip/i)) {
                    modType = 'BM模组';
                    icon = '🧩<i class="bi bi-puzzle">';
                } else if (file.name.match(/BM\d+\.\d+\.\d+\(.*\)\.zip/i)) {
                    modType = '框架';
                    icon = '🔧<i class="bi bi-cpu"></i>';
                } else {
                    modType = '三方模组';
                    icon = '📦<i class="bi bi-box-seam">';
                }
                
                fileItem.innerHTML = `${icon} <strong>${modType}</strong>: ${file.name} (${formatFileSize(file.size)})`;
                modsFileList.appendChild(fileItem);
            });
            modsFileList.style.display = 'block';
            checkReadyState();
        }
        
        // 检查是否准备好安装
        function checkReadyState() {
            installBtn.disabled = !(apkFile && modFiles.length > 0);
        }
        
        // 安装模组核心逻辑
        async function installMods() {
            installError.style.display = 'none';
            installProgress.style.display = 'block';
            installProgressText.textContent = '准备安装...';
            installProgressFill.style.width = '0%';
            
            try {
                // 资产存储
                const allAssets = new Map();
                const modCounters = {
                    framework: 0,
                    bmxxx: 0,
                    thirdParty: 0
                };
                
                // 解压APK
                installProgressText.textContent = '正在解析APK...';
                installProgressFill.style.width = '10%';
                
                const apkArrayBuffer = await readFileAsArrayBuffer(apkFile);
                const apkZip = await JSZip.loadAsync(apkArrayBuffer);
                const originalAssetsCount = Object.keys(apkZip.files)
                    .filter(filename => filename.startsWith('assets/'))
                    .length;
                
                // 处理所有模组文件
                installProgressText.textContent = '正在安装模组...';
                
                let processed = 0;
                for (const modFile of modFiles) {
                    const progress = 10 + (processed / modFiles.length) * 40;
                    installProgressFill.style.width = `${progress}%`;
                    
                    // 更新进度文本
                    installProgressText.textContent = `正在处理: ${modFile.name} (${processed+1}/${modFiles.length})`;
                    
                    // 处理模组文件
                    const result = await processModFile(modFile, allAssets, modCounters);
                    processed++;
                    
                    if (!result) {
                        console.warn(`跳过不支持的模组: ${modFile.name}`);
                    }
                }
                
                // 将模组资产添加到APK
                installProgressText.textContent = '正在合并到APK...';
                installProgressFill.style.width = '50%';
                
                for (const [path, data] of allAssets) {
                    apkZip.file(path, data);
                }
                
                // 生成配置文件
                installProgressText.textContent = '生成配置文件...';
                installProgressFill.style.width = '55%';
                await generateBmmodsLua(apkZip);
                
                // 生成修改后的APK
                installProgressText.textContent = '正在生成APK...';
                installProgressFill.style.width = '60%';
                
                modifiedApk = await apkZip.generateAsync({ type: 'blob' }, (metadata) => {
                    if (metadata.percent) {
                    const progress = 60 + (metadata.percent / 100) * 40;
                        installProgressFill.style.width = `${progress}%`;
                    }
                });
                
                // 完成提示
                installProgressFill.style.width = '100%';
                const summary = [
                    `框架: ${modCounters.framework}个`,
                    `BM模组: ${modCounters.bmxxx}个`,
                    `三方模组: ${modCounters.thirdParty}个`,
                    `总计: ${modFiles.length}个文件`
                ];
                
                installProgressText.textContent = `安装完成! 新增 ${allAssets.size} 项资源`;
                
                // 显示下载按钮
                setTimeout(() => {
                    installResult.style.display = 'block';
                    installResult.scrollIntoView({ behavior: 'smooth' });
                }, 500);

            } catch (error) {
                showError(installError, '安装失败: ' + error.message);
                console.error('完整错误信息:', error);
                installProgressText.textContent = '安装失败';
                installProgressFill.style.width = '0%';
            }
        }

        // 处理单个模组文件
        async function processModFile(modFile, assetsMap, counters) {
            try {
                const arrayBuffer = await readFileAsArrayBuffer(modFile);
                const zip = await JSZip.loadAsync(arrayBuffer);
                
                let isBMXXX = false;
                let isFramework = false;
                let isThirdParty = false;
                
                // 识别模组类型
                if (modFile.name.match(/BM\d{3}\.zip/i)) {
                    isBMXXX = true;
                    counters.bmxxx++;
                } else if (modFile.name.match(/BM\d+\.\d+\.\d+\(.*\)\.zip/i)) {
                    isFramework = true;
                    counters.framework++;
                } else {
                    isThirdParty = true;
                    counters.thirdParty++;
                }
                
                // 统一处理ADD_TO_OBB目录 - BM模组和框架
                let hasAddToObb = false;
                let hasMainLua = false;
                const addToObbFiles = new Map();
                // 首次遍历：检测目录结构特征
                for (const [path, entry] of Object.entries(zip.files)) {
                    if (entry.dir) continue;
                    
                    // 仅统一路径分隔符，保持原始大小写（不转小写）
                    const normalizedPath = path.replace(/\\/g, '/');
                    // 临时转小写用于匹配判断（忽略大小写）
                    const lowerPath = normalizedPath.toLowerCase();
                    
                    // 检测 main.lua（忽略大小写，无论在哪个目录，但原始路径不变）
                    if (lowerPath.endsWith('/main.lua')) {
                        hasMainLua = true;
                    }
                
                    // 检测 ADD_TO_OBB 目录（忽略大小写匹配目录名，原始路径不变）
                    const obbMatch = lowerPath.match(/(^|\/)add_to_obb\/(.+)/);
                    if (obbMatch) {
                        hasAddToObb = true;
                        // 从原始路径中提取相对路径（保持原始大小写）
                        // 找到原始路径中 "add_to_obb"（忽略大小写）的位置
                        const obbIndex = normalizedPath.toLowerCase().indexOf('add_to_obb/');
                        if (obbIndex !== -1) {
                            const relPath = normalizedPath.slice(obbIndex + 'add_to_obb/'.length);
                            addToObbFiles.set(`assets/${relPath}`, entry);
                        }
                    }
                }
                // 根据特征重新识别模组类型
                if (hasAddToObb) {
                    if (hasMainLua) {
                        isFramework = true;
                        counters.framework++;
                    } else {
                        isBMXXX = true;  // 标准模组
                        counters.bmxxx++;
                    }
                    
                    // 统一处理 ADD_TO_OBB 文件（路径保持原始大小写）
                    for (const [assetPath, entry] of addToObbFiles) {
                        assetsMap.set(assetPath, await entry.async('uint8array'));
                    }
                    return true;  // 标准/框架模组处理完成
                } else {
                    isThirdParty = true;
                    counters.thirdParty++;
                    // 第三方模组不处理ADD_TO_OBB，继续后续逻辑
                }


                
                // 处理三方模组
                if (isThirdParty) {
                    // 查找modinfo.lua文件
                    let modinfoFound = false;
                    for (const [path, entry] of Object.entries(zip.files)) {
                        if (entry.dir) continue;
                        
                        const normalizedPath = path.replace(/\\/g, '/');
                        if (normalizedPath.toLowerCase().endsWith('/modinfo.lua')) {
                            modinfoFound = true;
                            break;
                        }
                    }
                    
                    if (!modinfoFound) {
                        console.warn(`三方模组 ${modFile.name} 缺少 modinfo.lua 文件`);
                        return false;
                    }
                    
                    for (const [path, entry] of Object.entries(zip.files)) {
                        if (entry.dir) continue;
                        
                        const normalizedPath = path.replace(/\\/g, '/');
                        const newPath = `assets/mods/${normalizedPath}`;
                        assetsMap.set(newPath, await entry.async('uint8array'));
                    }
                    
                    return true;
                }
                
                return false;
                
            } catch (error) {
                console.error(`处理模组失败: ${modFile.name}`, error);
                throw new Error(`处理模组失败: ${modFile.name}`);
            }
        }
        
        // 生成正确的配置文件
        async function generateBmmodsLua(apkZip) {
            const modsFolder = 'assets/mods/';
            const bmmodsPath = `${modsFolder}bmmods.lua`;
            
            // 确保mods目录存在
            apkZip.folder(modsFolder);
            
            // 查找所有安装的三方模组目录
            const thirdPartyModDirs = new Set();
            
            // 统计所有assets/mods/下的第一级目录
            for (const path in apkZip.files) {
                if (apkZip.files[path].dir) continue;
                
                if (path.startsWith(modsFolder)) {
                    const parts = path.substring(modsFolder.length).split('/');
                    if (parts.length > 1) {
                        thirdPartyModDirs.add(parts[0]);
                    }
                }
            }
            
            // 生成配置文件内容
            let bmmodsContent = '-- 模组配置文件 - 自动生成\n\n';
            
            thirdPartyModDirs.forEach(modDir => {
                if (!modDir.match(/^BM\d{3}/)) { // 跳过标准BM模组
                    bmmodsContent += `Add('${modDir}')\n`;
                }
            });
            
            bmmodsContent += '\nreturn {}';
            
            // 更新APK中的配置文件
            apkZip.file(bmmodsPath, bmmodsContent);
        }

        // 辅助函数
        function initDropZone(dropZone, fileInput, handler) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, preventDefaults, false);
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.classList.add('drag-over');
                }, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.classList.remove('drag-over');
                }, false);
            });
            
            dropZone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                if (dt.files.length > 0) {
                    if (fileInput.multiple) {
                        handler(Array.from(dt.files));
                    } else {
                        handler(dt.files[0]);
                    }
                }
            });
        }
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        function showError(element, message) {
            element.textContent = message;
            element.style.display = 'block';
            
            // 自动隐藏错误提示
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
        
        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
            else return (bytes / 1048576).toFixed(1) + ' MB';
        }
        
        function readFileAsArrayBuffer(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        }
    });
</script>
