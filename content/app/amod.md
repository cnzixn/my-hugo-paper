---
title: ""
layout: page
searchHidden: true
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
    }
    .progress-container {
        margin: 10px 0;
        display: none;
    }
    .progress-bar {
        height: 20px;
        border-radius: 3px;
        overflow: hidden;
    }
    .progress-fill {
        height: 100%;
        width: 0%;
        transition: width 0.3s;
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
        background-color: #fff;
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

<div class="section">
    <p><strong>温馨提示：</strong> 本工具<strong>不消耗流量</strong>，文件在浏览器本地处理，不需要上传到服务器。经过测试，Chrome、Edge浏览器可正常使用本工具，其他浏览器兼容性未知。</p>
</div>


<div class="section">
    <h2>1. 选择APK安装包</h2>
    <div id="apkDropZone" class="drop-zone">
        <p>拖放 .apk 文件到这里 或</p>
        <button id="apkBrowseBtn">选择APK文件</button>
        <input type="file" id="apkFileInput" accept=".apk" style="display: none;">
    </div>
    <div id="apkFileInfo" class="file-info" style="display: none;"></div>
    <div id="apkError" class="error"></div>
</div>

<div class="section">
    <h2>2. 选择框架文件</h2>
    <div id="frameworkDropZone" class="drop-zone">
        <p>拖放 BM框架.zip 文件到这里 或</p>
        <button id="frameworkBrowseBtn">选择框架文件</button>
        <input type="file" id="frameworkFileInput" accept=".zip" style="display: none;">
    </div>
    <div id="frameworkFileInfo" class="file-info" style="display: none;"></div>
    <div id="frameworkError" class="error"></div>
</div>

<div class="section">
    <h2>3. 选择模组文件 (多选)</h2>
    <div id="modsDropZone" class="drop-zone">
        <p>拖放 BM模组.zip 文件到这里 或</p>
        <button id="modsBrowseBtn">选择模组文件</button>
        <input type="file" id="modsFileInput" accept=".zip" multiple style="display: none;">
    </div>
    <div id="modsFileList" class="file-list" style="display: none;"></div>
    <div id="modsError" class="error"></div>
</div>

<div class="section">
    <h2>4. 安装模组</h2>
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


<!-- <div class="section"> -->
  <!-- <p><strong>免责声明：</strong> 本工具仅供学习使用，请勿用于任何非法用途。使用本工具即表示您了解并同意承担所有责任。</p> -->
<!-- </div> -->

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // 文件变量
        let apkFile = null;
        let frameworkFile = null;
        let modFiles = [];
        let modifiedApk = null;
        
        // DOM元素
        const apkDropZone = document.getElementById('apkDropZone');
        const apkFileInput = document.getElementById('apkFileInput');
        const apkBrowseBtn = document.getElementById('apkBrowseBtn');
        const apkFileInfo = document.getElementById('apkFileInfo');
        const apkError = document.getElementById('apkError');
        
        const frameworkDropZone = document.getElementById('frameworkDropZone');
        const frameworkFileInput = document.getElementById('frameworkFileInput');
        const frameworkBrowseBtn = document.getElementById('frameworkBrowseBtn');
        const frameworkFileInfo = document.getElementById('frameworkFileInfo');
        const frameworkError = document.getElementById('frameworkError');
        
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
        initDropZone(frameworkDropZone, frameworkFileInput, handleFrameworkFile);
        initDropZone(modsDropZone, modsFileInput, handleModFiles);
        
        // 浏览按钮事件
        apkBrowseBtn.addEventListener('click', () => apkFileInput.click());
        frameworkBrowseBtn.addEventListener('click', () => frameworkFileInput.click());
        modsBrowseBtn.addEventListener('click', () => modsFileInput.click());
        
        // 文件选择事件
        apkFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleApkFile(e.target.files[0]);
        });
        
        frameworkFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFrameworkFile(e.target.files[0]);
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
                // 确保文件名以.apk结尾
                // 正则表达式匹配 .apk（不区分大小写），并替换为 _modded.apk
                let filename = apkFile.name.replace(/\.apk$/i, '_未签名.apk');
                if (!filename.toLowerCase().endsWith('.apk')) {
                    filename += '.apk';
                }
                
                // 明确指定MIME类型
                const blob = new Blob([modifiedApk], { 
                    type: 'application/vnd.android.package-archive' 
                });
                
                // 使用更可靠的下载方式
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                
                // 清理
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
            apkFileInfo.innerHTML = `已选择: <strong>${file.name}</strong> (${formatFileSize(file.size)})`;
            apkFileInfo.style.display = 'block';
            checkReadyState();
        }
        
        // 处理框架文件
        function handleFrameworkFile(file) {
            if (!file.name.match(/BM\d+\.\d+\.\d+\(.*\)\.zip/i)) {
                showError(frameworkError, '请选择有效的BM框架文件 (格式应为BMXX.XX.XX(X.XX).zip)');
                return;
            }
            
            frameworkError.style.display = 'none';
            frameworkFile = file;
            frameworkFileInfo.innerHTML = `已选择: <strong>${file.name}</strong> (${formatFileSize(file.size)})`;
            frameworkFileInfo.style.display = 'block';
            checkReadyState();
        }
        
        // 处理模组文件
        function handleModFiles(files) {
            modsError.style.display = 'none';
            modFiles = files.filter(file => 
                file.name.match(/BM\d{3}\.zip/i) || 
                file.name.match(/BM\d+\.\d+\.\d+\(.*\)\.zip/i)
            );
            
            if (modFiles.length === 0) {
                showError(modsError, '未找到有效的BM模组文件 (格式应为BMXXX.zip或BMXX.XX.XX(X.XX).zip)');
                return;
            }
            
            modsFileList.innerHTML = '';
            modFiles.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.textContent = `${file.name} (${formatFileSize(file.size)})`;
                modsFileList.appendChild(fileItem);
            });
            modsFileList.style.display = 'block';
            checkReadyState();
        }
        
        // 检查是否准备好安装
        function checkReadyState() {
            installBtn.disabled = !(apkFile && frameworkFile);
        }
        
        // 安装模组
        async function installMods() {
            installError.style.display = 'none';
            installProgress.style.display = 'block';
            installProgressText.textContent = '准备安装...';
            installProgressFill.style.width = '0%';
            
            try {
                // 1. 解压框架和模组文件
                installProgressText.textContent = '正在解压框架和模组...';
                installProgressFill.style.width = '10%';
                
                const assets = new Map(); // 用于存储所有模组文件
                
                // 先解压框架
                await extractZipToAssets(frameworkFile, assets, '20%');
                
                // 再解压模组
                for (let i = 0; i < modFiles.length; i++) {
                    const progress = 20 + (i / modFiles.length) * 30;
                    await extractZipToAssets(modFiles[i], assets, `${Math.round(progress)}%`);
                }
                
                // 2. 读取APK文件
                installProgressText.textContent = '正在读取APK文件...';
                installProgressFill.style.width = '50%';
                
                const apkArrayBuffer = await readFileAsArrayBuffer(apkFile);
                const apkZip = await JSZip.loadAsync(apkArrayBuffer);
                
                // 3. 合并assets到APK
                installProgressText.textContent = '正在合并模组到APK...';
                installProgressFill.style.width = '60%';
                
                // 统计原有assets文件
                const originalAssetsCount = Object.keys(apkZip.files)
                    .filter(filename => filename.startsWith('assets/'))
                    .length;
                
                // 合并文件（模组文件会覆盖同名文件）
                let addedCount = 0;
                const totalFiles = assets.size;
                for (const [path, fileData] of assets) {
                    apkZip.file(`assets/${path}`, fileData);
                    addedCount++;
                    
                    const progress = 60 + (addedCount / totalFiles) * 30;
                    installProgressFill.style.width = `${progress}%`;
                    installProgressText.textContent = `合并文件中... ${addedCount}/${totalFiles}`;
                }
                
                // 4. 生成修改后的APK
                installProgressText.textContent = '正在生成修改后的APK...';
                installProgressFill.style.width = '95%';
                
                const modifiedApkBlob = await apkZip.generateAsync({ type: 'blob' }, (metadata) => {
                    if (metadata.percent) {
                        const progress = 95 + (metadata.percent / 100) * 5;
                        installProgressFill.style.width = `${progress}%`;
                    }
                });
                
                modifiedApk = modifiedApkBlob;
                
                // 完成
                installProgressFill.style.width = '100%';
                installProgressText.textContent = `安装完成！(原assets文件:${originalAssetsCount}个, 新增/覆盖:${totalFiles}个)`;
                
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
        
        // 从ZIP提取assets到Map中
        async function extractZipToAssets(zipFile, assetsMap, progressPercent) {
            installProgressFill.style.width = progressPercent;
            installProgressText.textContent = `正在解压: ${zipFile.name}...`;
            
            const arrayBuffer = await readFileAsArrayBuffer(zipFile);
            const zip = await JSZip.loadAsync(arrayBuffer);
            
            // 查找ADD_TO_OBB文件夹
            let addToObbPrefix = '';
            for (const filename of Object.keys(zip.files)) {
                if (filename.includes('ADD_TO_OBB/') || filename.includes('ADD_TO_OBB\\')) {
                    addToObbPrefix = filename.split('ADD_TO_OBB')[0] + 'ADD_TO_OBB/';
                    break;
                }
            }
            
            // 提取文件
            for (const filename of Object.keys(zip.files)) {
                const zipEntry = zip.files[filename];
                if (zipEntry.dir) continue;
                
                // 如果是ADD_TO_OBB中的文件
                if (filename.startsWith(addToObbPrefix)) {
                    const relativePath = filename.slice(addToObbPrefix.length);
                    const fileData = await zipEntry.async('uint8array');
                    assetsMap.set(relativePath, fileData);
                }
            }
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
