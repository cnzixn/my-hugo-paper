---
title: "苹果-模组安装器"
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
        border-radius: 8px;
        padding: 10px; /* 可去掉左右固定padding，避免与width冲突 */
        margin: 10px auto;
        cursor: pointer;
        display: block;
        width: 200px; /* 固定宽度，根据需求调整数值 */
        background-color: #4CAF50;
        background-color: #0183FD;
        background-color: #1AB8F9;

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
        border-radius: 3px;
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



<div class="section">
    <small><strong>温馨提示：</strong><br>　• 本工具<strong>不消耗流量</strong>，文件在浏览器本地处理，不需要上传到服务器。<br>　• 经过测试，Chrome、Edge浏览器可正常使用本工具。<br>　• 本工具打包的 App 需要签名，才能安装到手机。</small>
</div>

<div class="section">
    <h2>1. 选择IPA安装包</h2>
    <div id="ipaDropZone" class="drop-zone">
        <p>拖放 .ipa 文件到这里 或</p>
        <button id="ipaBrowseBtn">选择IPA文件</button>
        <input type="file" id="ipaFileInput" accept=".ipa" style="display: none;">
    </div>
    <div id="ipaFileInfo" class="file-info" style="display: none;"></div>
    <div id="ipaError" class="error"></div>
</div>

<div class="section">
    <h2>2. 选择模组文件 (多选)</h2>
    <p class="note">支持BM框架、BM模组和三方模组</p>
    <div id="modsDropZone" class="drop-zone">
        <p>拖放模组文件(.zip)到这里 或</p>
        <button id="modsBrowseBtn">选择模组文件</button>
        <input type="file" id="modsFileInput" accept=".zip,.xz" multiple style="display: none;">
    </div>
    <div id="modsFileList" class="file-list" style="display: none;"></div>
    <div id="modsError" class="error"></div>
</div>

<div class="section">
    <h2>3. 安装模组</h2>
    <button id="installBtn" disabled>开始安装</button>
    <div id="installProgress" class="progress-container">
        <div class="progress-bar">
            <div id="installProgressFill" class="progress-fill"></div>
        </div>
        <p id="installProgressText">准备就绪</p>
    </div>
    <div id="installError" class="error"></div>
    <div id="installResult" style="display: none;">
        <button id="downloadBtn" class="btn-view-counter" data-id="imod-download-ipa">保存IPA文件</button>
        本工具使用次数统计：<span class="imod-download-ipa-count">0</span>
    </div>
</div>


<script defer src="/js/bv.encrypt.js"></script>
<script src="/js/klfa.encrypt.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // 文件变量
        let ipaFile = null;
        let modFiles = [];
        let modifiedIpa = null;
        
        // DOM元素
        const ipaDropZone = document.getElementById('ipaDropZone');
        const ipaFileInput = document.getElementById('ipaFileInput');
        const ipaBrowseBtn = document.getElementById('ipaBrowseBtn');
        const ipaFileInfo = document.getElementById('ipaFileInfo');
        const ipaError = document.getElementById('ipaError');
        
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
        initDropZone(ipaDropZone, ipaFileInput, handleIpaFile);
        initDropZone(modsDropZone, modsFileInput, handleModFiles);
        
        // 浏览按钮事件
        ipaBrowseBtn.addEventListener('click', () => ipaFileInput.click());
        modsBrowseBtn.addEventListener('click', () => modsFileInput.click());
        
        // 文件选择事件
        ipaFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleIpaFile(e.target.files[0]);
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
            if (modifiedIpa) {

                const date = new Date();
                // 提取并格式化时间各部分（补零处理）
                const yy = String(date.getFullYear()).slice(-2);
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                const hh = String(date.getHours()).padStart(2, '0');
                const min = String(date.getMinutes()).padStart(2, '0');
                const ss = String(date.getSeconds()).padStart(2, '0');
                
                const timeStr = `${yy}${mm}${dd}_${hh}${min}${ss}`;
                
                // 替换 .ipa 后缀，添加时间戳
                const filename = ipaFile.name
                    .replace(/_.*?(?=\.ipa$)/i, '') // 移除 .apk 前的 _xxxxx 部分
                    .replace(/\.ipa$/i, `_${timeStr}.ipa`); // 替换为格式化后的时间

                const blob = new Blob([modifiedIpa], { 
                    type: 'application/octet-stream' 
                });
                saveAs(blob, filename);
            }
        });
        
        // 处理IPA文件
        function handleIpaFile(file) {
            if (!file.name.toLowerCase().endsWith('.ipa')) {
                showError(ipaError, '请选择有效的IPA文件');
                return;
            }
            
            ipaError.style.display = 'none';
            ipaFile = file;
            ipaFileInfo.innerHTML = `<i class="bi bi-apple"> - </i>  <strong>${file.name}</strong> (${formatFileSize(file.size)})`;
            ipaFileInfo.style.display = 'block';
            checkReadyState();
        }
        
        // 处理模组文件
        function handleModFiles(files) {
            modsError.style.display = 'none';
            
            // 更宽松的过滤规则
            modFiles = files.filter(file => 
                file.name.match(/\.zip/i) &&  // 接受所有ZIP文件
                !file.name.match(/\.smali$/i) // 排除明显的非模组文件
            );
            
            if (modFiles.length === 0) {
                showError(modsError, '未找到有效的模组文件');
                return;
            }
            
            modsFileList.innerHTML = '';


            // 先对文件数组进行排序
            modFiles.sort((a, b) => {
              // 定义分类权重（权重越小优先级越高）
              const getWeight = (fileName) => {
                if (/BM\d+\.\d+\.\d+\.zip.*/i.test(fileName)) return 0;   // BM框架（版本号格式）
                if (/BM\d{3}\.zip.*/i.test(fileName)) return 1;          // BM模组（三位数字格式）
                if (/BM.*\.zip.*/i.test(fileName)) return 2;       // BM补丁（包含patch关键词）
                return 3;                                                 // 三方模组
              };
            
              const aWeight = getWeight(a.name);
              const bWeight = getWeight(b.name);
              
              // 先按类别权重排序
              if (aWeight !== bWeight) {
                return aWeight - bWeight;
              }
              
              // 同类文件按文件名排序（字母升序）
              return a.name.localeCompare(b.name);
            });
            
            // 渲染排序后的文件列表
            modFiles.forEach(file => {
              const fileItem = document.createElement('div');
              fileItem.className = 'file-item';
              
              // 识别文件类型
              let modType, icon;
              
              if (file.name.match(/BM\d+\.\d+\.\d+\.zip.*/i)) {
                modType = 'BM框架';
                icon = '<i class="bi bi-cpu"></i>';               // CPU图标
              } else if (file.name.match(/BM\d{3}\.zip.*/i)) {
                modType = 'BM模组';
                icon = '<i class="bi bi-puzzle"></i>';             // 拼图图标
              } else if (file.name.match(/BM.*\.zip.*/i)) {
                modType = 'BM补丁';
                icon = '<i class="bi bi-wrench"></i>';             // 扳手图标
              } else {
                modType = '三方模组';
                icon = '<i class="bi bi-box-seam"></i>';           // 盒子图标
              }
              modType = ' - ';
              fileItem.innerHTML = `${icon} <strong>${modType}</strong>  ${file.name} (${formatFileSize(file.size)})`;
              modsFileList.appendChild(fileItem);
            });


            modsFileList.style.display = 'block';
            checkReadyState();
        }
        
        // 检查是否准备好安装
        function checkReadyState() {
            installBtn.disabled = !(ipaFile && modFiles.length > 0);
        }
        
        // 安装模组
        async function installMods() {
            installError.style.display = 'none';
            installProgress.style.display = 'block';
            installProgressText.textContent = '准备安装...';
            installProgressFill.style.width = '0%';
            
            try {
                // 收集所有要添加的文件
                const modFilesToAdd = {
                    '_data': {},  // 对应data.archive
                    '_dlc0002': {} // 对应dlc0002.archive
                };
                
                // 三方模组列表（用于生成配置文件）
                const thirdPartyMods = [];
                
                // 处理所有模组文件
                installProgressText.textContent = '正在处理模组文件...';
                
                let processed = 0;
                for (const modFile of modFiles) {
                    const progress = 10 + (processed / modFiles.length) * 40;
                    installProgressFill.style.width = `${progress}%`;
                    
                    // 更新进度文本
                    installProgressText.textContent = `正在处理: ${modFile.name} (${processed+1}/${modFiles.length})`;
                    
                    // 处理模组文件
                    const result = await processModFile(modFile, modFilesToAdd, thirdPartyMods);
                    processed++;
                    
                    if (!result) {
                        console.warn(`跳过不支持的模组: ${modFile.name}`);
                    }
                }
                
                // 2. 读取IPA文件
                installProgressText.textContent = '正在读取IPA文件...';
                installProgressFill.style.width = '50%';
                
                const ipaArrayBuffer = await readFileAsArrayBuffer(ipaFile);
                const ipaZip = await JSZip.loadAsync(ipaArrayBuffer);
                
                // 3. 提取原始archive文件
                installProgressText.textContent = '正在提取原始游戏数据...';
                installProgressFill.style.width = '60%';
                
                // 查找Payload目录下的.app文件
                let appPath = '';
                for (const filename of Object.keys(ipaZip.files)) {
                    if (filename.includes('Payload/') && filename.endsWith('.app/')) {
                        appPath = filename;
                        break;
                    }
                }
                
                if (!appPath) {
                    throw new Error('找不到Payload目录下的.app文件');
                }
                
                // 提取data.archive和dlc0002.archive
                const dataArchivePath = `${appPath}data.archive`;
                const dlcArchivePath = `${appPath}dlc0002.archive`;
                
                const dataArchiveFile = ipaZip.files[dataArchivePath];
                const dlcArchiveFile = ipaZip.files[dlcArchivePath];
                
                if (!dataArchiveFile || dataArchiveFile.dir) {
                    throw new Error('找不到data.archive文件');
                }
                
                // 4. 解压原始archive文件
                installProgressText.textContent = '正在解压游戏数据...';
                installProgressFill.style.width = '70%';
                
                const dataArchiveData = await dataArchiveFile.async('uint8array');
                const dlcArchiveData = dlcArchiveFile ? await dlcArchiveFile.async('uint8array') : null;
                
                // 使用KLFA解包
                const originalDataFiles = await KLFA.unpack(dataArchiveData);
                const originalDlcFiles = dlcArchiveData ? await KLFA.unpack(dlcArchiveData) : [];
                
                // 5. 合并模组文件
                installProgressText.textContent = '正在合并模组文件...';
                installProgressFill.style.width = '80%';
                
                // 创建合并后的文件集合
                const mergedDataFiles = [...originalDataFiles];
                const mergedDlcFiles = [...originalDlcFiles];
                
                // 添加模组文件到data
                for (const [path, fileData] of Object.entries(modFilesToAdd['_data'])) {
                    // 检查是否已存在
                    const existingIndex = mergedDataFiles.findIndex(f => f.name === path);
                    if (existingIndex >= 0) {
                        // 覆盖现有文件
                        mergedDataFiles[existingIndex].data = fileData;
                    } else {
                        // 添加新文件
                        mergedDataFiles.push({
                            name: path,
                            data: fileData,
                            size: fileData.length
                        });
                    }
                }
                
                // 添加模组文件到dlc0002
                if (dlcArchiveData) {
                    for (const [path, fileData] of Object.entries(modFilesToAdd['_dlc0002'])) {
                        const existingIndex = mergedDlcFiles.findIndex(f => f.name === path);
                        if (existingIndex >= 0) {
                            mergedDlcFiles[existingIndex].data = fileData;
                        } else {
                            mergedDlcFiles.push({
                                name: path,
                                data: fileData,
                                size: fileData.length
                            });
                        }
                    }
                }
                
                // 6. 生成并添加三方模组配置文件
                if (mergedDataFiles.length > 0) {
                    installProgressText.textContent = '生成三方模组配置文件...';
                    
                    // 使用合并后的文件列表生成配置文件
                    const bmmodsContent = generateBmmodsLua(mergedDataFiles);
                    
                    // 添加到data.archive
                    mergedDataFiles.push({
                        name: 'mods/bmmods.lua',
                        data: new TextEncoder().encode(bmmodsContent),
                        size: bmmodsContent.length
                    });
                }

                
                // 7. 重新打包archive文件
                installProgressText.textContent = '正在重新打包游戏数据...';
                installProgressFill.style.width = '85%';
                
                const newDataArchive = await KLFA.pack(mergedDataFiles);
                const newDlcArchive = dlcArchiveData ? await KLFA.pack(mergedDlcFiles) : null;
                
                // 8. 更新IPA文件
                installProgressText.textContent = '正在更新IPA文件...';
                installProgressFill.style.width = '90%';
                
                // 删除旧的archive文件
                ipaZip.remove(dataArchivePath);
                if (dlcArchiveFile) {
                    ipaZip.remove(dlcArchivePath);
                }
                
                // 添加新的archive文件
                ipaZip.file(dataArchivePath, newDataArchive);
                if (newDlcArchive) {
                    ipaZip.file(dlcArchivePath, newDlcArchive);
                }
                
                // 9. 生成修改后的IPA
                installProgressText.textContent = '正在生成修改后的IPA...';
                installProgressFill.style.width = '95%';
                
                modifiedIpa = await ipaZip.generateAsync({ type: 'blob' }, (metadata) => {
                    if (metadata.percent) {
                        const progress = 95 + (metadata.percent / 100) * 5;
                        installProgressFill.style.width = `${progress}%`;
                    }
                });
                
                // 完成
                installProgressFill.style.width = '100%';
                installProgressText.textContent = '安装完成！';
                
                // 显示下载按钮
                setTimeout(() => {
                    installResult.style.display = 'block';
                    installResult.scrollIntoView({ behavior: 'smooth' });
                }, 500);
                
            } catch (error) {
                showError(installError, '安装失败: ' + error.message);
                console.error(error);
                installProgressText.textContent = '安装失败';
                installProgressFill.style.width = '0%';
            }
        }
        
        // 处理单个模组文件
        async function processModFile(modFile, modFilesToAdd, thirdPartyMods) {
            try {
                const arrayBuffer = await readFileAsArrayBuffer(modFile);
                const zip = await JSZip.loadAsync(arrayBuffer);
                
                let isBMXXX = false;
                let isFramework = false;
                let isThirdParty = false;
                
                // 识别模组类型
                if (modFile.name.match(/BM\d{3}\.zip.*/i)) {
                    isBMXXX = true;
                    counters.bmxxx++;
                } else if (modFile.name.match(/BM\d+\.\d+\.\d+.*\.zip.*/i)) {
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
                    
                    // 仅统一路径分隔符，保持原始大小写
                    const normalizedPath = path.replace(/\\/g, '/');
                    // 临时转小写用于匹配判断（忽略大小写）
                    const lowerPath = normalizedPath.toLowerCase();
                    
                    // 检测 main.lua（忽略大小写）
                    if (lowerPath.endsWith('/main.lua')) {
                        hasMainLua = true;
                    }
                
                    // 检测 ADD_TO_OBB 目录（忽略大小写）
                    const obbMatch = lowerPath.match(/(^|\/)add_to_obb\/(.+)/);
                    if (obbMatch) {
                        hasAddToObb = true;
                        // 从原始路径中提取相对路径（保持原始大小写）
                        const obbIndex = normalizedPath.toLowerCase().indexOf('add_to_obb/');
                        if (obbIndex !== -1) {
                            const relPath = normalizedPath.slice(obbIndex + 'add_to_obb/'.length);
                            addToObbFiles.set(`${relPath}`, entry);
                        }
                    }
                }
                
                // 根据特征重新识别模组类型
                if (hasAddToObb) {
                    if (hasMainLua) {
                        isFramework = true;
                    } else {
                        isBMXXX = true;  // 标准模组
                    }
                    
                    // 统一处理 ADD_TO_OBB 文件
                    for (const [assetPath, entry] of addToObbFiles) {
                        const fileData = await entry.async('uint8array');
                        
                        // 根据路径决定添加到哪个archive
                        if (assetPath.startsWith('mods/') || assetPath.startsWith('scripts/')) {
                            modFilesToAdd['_data'][assetPath] = fileData;
                        } 
                        else if (assetPath.startsWith('DLC0002/')) {
                            const targetPath = assetPath.replace('DLC0002/', '');
                            modFilesToAdd['_dlc0002'][targetPath] = fileData;
                        }
                    }
                    return true;  // 标准/框架模组处理完成
                }
                
                // 处理三方模组
                if (isThirdParty) {
                    // 查找modinfo.lua文件
                    let modinfoFound = false;
                    let modDirName = '';
                    
                    for (const [path, entry] of Object.entries(zip.files)) {
                        if (entry.dir) continue;
                        
                        const normalizedPath = path.replace(/\\/g, '/');
                        if (normalizedPath.toLowerCase().endsWith('/modinfo.lua')) {
                            modinfoFound = true;
                            // 提取模组目录名
                            modDirName = normalizedPath.split('/')[0];
                            break;
                        }
                    }
                    
                    if (!modinfoFound) {
                        console.warn(`三方模组 ${modFile.name} 缺少 modinfo.lua 文件`);
                        return false;
                    }
                    
                    // 记录三方模组
                    thirdPartyMods.push(modDirName);
                    
                    // 添加所有文件到data.archive
                    for (const [path, entry] of Object.entries(zip.files)) {
                        if (entry.dir) continue;
                        
                        const normalizedPath = path.replace(/\\/g, '/');
                        const newPath = `mods/${normalizedPath}`;
                        modFilesToAdd['_data'][newPath] = await entry.async('uint8array');
                    }
                    
                    return true;
                }
                
                return false;
                
            } catch (error) {
                console.error(`处理模组失败: ${modFile.name}`, error);
                throw new Error(`处理模组失败: ${modFile.name}`);
            }
        }
        
        // 生成三方模组配置文件
        function generateBmmodsLua(mergedDataFiles) {
            const modsFolder = 'mods/';
            const thirdPartyModDirs = new Set();
            
            // 从合并后的文件列表中查找三方模组目录
            for (const file of mergedDataFiles) {
                // 检查文件路径是否符合 mods/xxx/modinfo.lua 格式
                if (file.name.startsWith(modsFolder) && file.name.includes('/modinfo.lua')) {
                    // 提取模组目录名（mods/后的第一级目录）
                    const relPath = file.name.substring(modsFolder.length);
                    const modDir = relPath.split('/')[0];
                    
                    // 排除标准BM模组（以BM后跟三位数字开头）
                    if (modDir && !modDir.match(/^BM\d{3}/)) {
                        thirdPartyModDirs.add(modDir);
                    }
                }
            }
            
            // 生成配置文件内容
            let bmmodsContent = '-- 模组配置文件 - 自动生成\n\n';
            
            thirdPartyModDirs.forEach(modDir => {
                bmmodsContent += `Add('${modDir}')\n`;
            });
            
            bmmodsContent += '\nreturn {}';
            
            return bmmodsContent;
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
