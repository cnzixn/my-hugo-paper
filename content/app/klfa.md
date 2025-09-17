---
title: 'KLFA 测试工具'
layout: 'page'
searchHidden: true
draft: true
url: '/p/814/'
---

<style>
    h1 {
        text-align: center;
    }
    .section {
        margin-bottom: 30px;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    .drop-zone {
        border: 2px dashed #aaa;
        padding: 20px;
        text-align: center;
        margin: 10px 0;
        cursor: pointer;
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
    #fileList {
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
    .progress-container {
        margin: 10px 0;
        display: none;
    }
    .progress-bar {
        height: 20px;
        background-color: #e0e0e0;
        border-radius: 4px;
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
    
    
</style>





<div class="section">
特别鸣谢：<a href="http://quickbms.aluigi.org" target="_blank">QuickBMS</a>
</div>

<div class="section">
    <h2>解包 archive</h2>
    <div id="unpackDropZone" class="drop-zone">
        <p>拖放 archive 文件到这里 或</p>
        <button id="unpackBrowseBtn">选择文件</button>
        <input type="file" id="unpackFileInput" accept=".archive" style="display: none;">
    </div>
    <div id="unpackError" class="error"></div>
    <div id="unpackProgress" class="progress-container">
        <div class="progress-bar">
            <div id="unpackProgressFill" class="progress-fill"></div>
        </div>
        <p id="unpackProgressText">准备就绪</p>
    </div>
    <div id="unpackResult" style="display: none;">
        <h3>解包结果</h3>
        <div id="fileList"></div>
        <button id="downloadAllBtn">下载所有文件 (zip)</button>
    </div>
</div>

<div class="section">
    <h2>打包 archive</h2>
    <div id="packDropZone" class="drop-zone">
        <p>拖放 zip 文件到这里 或</p>
        <button id="packBrowseBtn">选择文件</button>
        <input type="file" id="packFileInput" accept=".zip" style="display: none;">
    </div>
    <div id="packError" class="error"></div>
    <div id="packProgress" class="progress-container">
        <div class="progress-bar">
            <div id="packProgressFill" class="progress-fill"></div>
        </div>
        <p id="packProgressText">准备就绪</p>
    </div>
    <div id="packResult" style="display: none;">
        <h3>打包结果</h3>
        <p>文件数量: <span id="packFileCount">0</span></p>
        <p>总大小: <span id="packTotalSize">0 B</span></p>
        <button id="downloadKlfaBtn">下载 archive 文件</button>
    </div>
</div>


<!-- <div class="section"> -->
  <!-- <p><strong>免责声明：</strong> 本工具仅供学习使用，请勿用于任何非法用途。使用本工具即表示您了解并同意承担所有责任。</p> -->
<!-- </div> -->

<!-- <script src="/js/klfa.js"></script> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // ================== 解包功能 ==================
        const unpackDropZone = document.getElementById('unpackDropZone');
        const unpackFileInput = document.getElementById('unpackFileInput');
        const unpackBrowseBtn = document.getElementById('unpackBrowseBtn');
        const unpackProgress = document.getElementById('unpackProgress');
        const unpackProgressFill = document.getElementById('unpackProgressFill');
        const unpackProgressText = document.getElementById('unpackProgressText');
        const unpackResult = document.getElementById('unpackResult');
        const fileList = document.getElementById('fileList');
        const downloadAllBtn = document.getElementById('downloadAllBtn');
        const unpackError = document.getElementById('unpackError');
        
        let extractedFiles = [];
        
        // 浏览按钮点击事件
        unpackBrowseBtn.addEventListener('click', () => {
            unpackFileInput.click();
        });
        
        // 文件选择变化事件
        unpackFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleUnpackFile(e.target.files[0]);
            }
        });
        
        // 拖放事件处理
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            unpackDropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            unpackDropZone.addEventListener(eventName, () => {
                unpackDropZone.classList.add('drag-over');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            unpackDropZone.addEventListener(eventName, () => {
                unpackDropZone.classList.remove('drag-over');
            }, false);
        });
        
        unpackDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            handleUnpackFile(dt.files[0]);
        });
        
        
        // 处理文件函数
        async function handleUnpackFile(file) {
            unpackError.style.display = 'none';
            unpackProgress.style.display = 'block';
            unpackProgressText.textContent = '正在读取文件...';
            unpackProgressFill.style.width = '0%';
            
            try {
                const arrayBuffer = await file.arrayBuffer();
                unpackProgressText.textContent = '正在解包...';
                unpackProgressFill.style.width = '50%';
                
                // 使用KLFA解包
                extractedFiles = await KLFA.unpack(arrayBuffer);
                
                unpackProgressFill.style.width = '100%';
                unpackProgressText.textContent = '解包完成！';
                
                // 显示结果
                showUnpackResults(extractedFiles);
            } catch (error) {
                showUnpackError('解包失败: ' + error.message);
            }
        }
        
        // 显示解包结果
        function showUnpackResults(files) {
            fileList.innerHTML = '';
            files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.textContent = `${file.name} (${formatFileSize(file.size)})`;
                fileList.appendChild(fileItem);
            });
            
            unpackResult.style.display = 'block';
        }

        // 下载所有文件
        downloadAllBtn.addEventListener('click', async () => {
            unpackProgressText.textContent = '正在创建 zip 文件...';
            unpackProgressFill.style.width = '0%';
            
            try {
                const zip = new JSZip();
                
                // 过滤掉 .svn 目录中的文件
                const filteredFiles = extractedFiles.filter(file => {
                    const normalizedPath = file.name.replace(/\\/g, '/');
                    return !normalizedPath.includes('.svn/') && 
                           !normalizedPath.startsWith('.svn/') &&
                           normalizedPath !== '.svn';
                });
        
                // 显示过滤后的文件数量信息
                const statsInfo = `(排除 ${extractedFiles.length - filteredFiles.length} 个 .svn 文件)`;
                
                for (let i = 0; i < filteredFiles.length; i++) {
                    const file = filteredFiles[i];
                    zip.file(file.name, file.data);
                    
                    // 更新进度
                    const progress = (i / filteredFiles.length) * 100;
                    unpackProgressFill.style.width = `${progress}%`;
                    unpackProgressText.textContent = `添加文件中... ${i+1}/${filteredFiles.length} ${statsInfo}`;
                }
                
                const blob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
                    if (metadata.percent) {
                        unpackProgressFill.style.width = `${metadata.percent}%`;
                    }
                });
                
                unpackProgressFill.style.width = '100%';
                unpackProgressText.textContent = `创建 zip 文件完成！${statsInfo}`;
                
                // 自动添加下划线前缀
                const originalName = unpackFileInput.files[0]?.name || 'archive';
                const zipName = `_${originalName.replace('.archive', '')}.zip`;
                
                saveAs(blob, zipName);
            } catch (error) {
                showUnpackError('创建 zip 文件失败: ' + error.message);
            }
        });
        
        // 显示错误
        function showUnpackError(message) {
            unpackError.textContent = message;
            unpackError.style.display = 'block';
            unpackProgressText.textContent = '处理失败';
            unpackProgressFill.style.width = '0%';
        }
        
        // ================== 打包功能 ==================
        const packDropZone = document.getElementById('packDropZone');
        const packFileInput = document.getElementById('packFileInput');
        const packBrowseBtn = document.getElementById('packBrowseBtn');
        const packProgress = document.getElementById('packProgress');
        const packProgressFill = document.getElementById('packProgressFill');
        const packProgressText = document.getElementById('packProgressText');
        const packResult = document.getElementById('packResult');
        const packFileCount = document.getElementById('packFileCount');
        const packTotalSize = document.getElementById('packTotalSize');
        const downloadKlfaBtn = document.getElementById('downloadKlfaBtn');
        const packError = document.getElementById('packError');
        
        let packFiles = [];
        let klfaData = null;
        let packOriginalName = 'archive.klfa';
        
        // 浏览按钮点击事件
        packBrowseBtn.addEventListener('click', () => {
            packFileInput.click();
        });
        
        // 文件选择变化事件
        packFileInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                await handlePackFiles(e.target.files[0]);
            }
        });
        
        // 拖放事件处理
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            packDropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            packDropZone.addEventListener(eventName, () => {
                packDropZone.classList.add('drag-over');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            packDropZone.addEventListener(eventName, () => {
                packDropZone.classList.remove('drag-over');
            }, false);
        });
        
        packDropZone.addEventListener('drop', async (e) => {
            const dt = e.dataTransfer;
            if (dt.files.length > 0) {
                const file = dt.files[0];
                if (file.name.endsWith('.zip')) {
                    await handlePackFiles(file);
                } else {
                    showPackError('请上传 zip 文件');
                }
            }
        });
        
        // 处理 zip 文件函数
        async function handlePackFiles(file) {
            packError.style.display = 'none';
            packProgress.style.display = 'block';
            packProgressText.textContent = '正在读取 zip 文件...';
            packProgressFill.style.width = '0%';
            
            try {
                // 读取 zip 文件
                const arrayBuffer = await file.arrayBuffer();
                const zip = await JSZip.loadAsync(arrayBuffer);
                
                // 处理文件名
                let originalName = file.name;
                if (originalName.startsWith('_')) {
                    originalName = originalName.substring(1);
                }
                if (originalName.endsWith('.zip')) {
                    originalName = originalName.replace('.zip', '');
                }
                packOriginalName = originalName + '.archive';
                
                // 准备文件列表
                packFiles = [];
                const fileEntries = Object.keys(zip.files)
                    .filter(name => !zip.files[name].dir); // 过滤掉目录
                
                // 读取 zip 中的文件
                for (let i = 0; i < fileEntries.length; i++) {
                    const fileName = fileEntries[i];
                    const zipEntry = zip.files[fileName];
                    
                    packProgressText.textContent = `处理文件中... ${i+1}/${fileEntries.length}`;
                    packProgressFill.style.width = `${(i / fileEntries.length) * 50}%`;
                    
                    const fileData = await zipEntry.async('uint8array');
                    packFiles.push({
                        name: fileName,
                        size: fileData.length,
                        data: fileData
                    });
                }
                
                if (packFiles.length === 0) {
                    throw new Error('无效的 zip 文件');
                }
                
                packProgressText.textContent = '正在打包...';
                packProgressFill.style.width = '50%';
                
                // 使用KLFA打包
                klfaData = await KLFA.pack(packFiles);
                
                packProgressFill.style.width = '100%';
                packProgressText.textContent = '打包完成！';
                
                // 显示结果
                showPackResults();
            } catch (error) {
                showPackError('打包失败: ' + error.message);
            }
        }
        
        // 显示打包结果
        function showPackResults() {
            const totalSize = packFiles.reduce((sum, file) => sum + file.size, 0);
            
            packFileCount.textContent = packFiles.length;
            packTotalSize.textContent = formatFileSize(totalSize);
            packResult.style.display = 'block';
        }
        
        // 下载KLFA文件
        downloadKlfaBtn.addEventListener('click', () => {
            const blob = new Blob([klfaData], { type: 'application/octet-stream' });
            saveAs(blob, packOriginalName);
        });
        
        // 显示错误
        function showPackError(message) {
            packError.textContent = message;
            packError.style.display = 'block';
            packProgressText.textContent = '处理失败';
            packProgressFill.style.width = '0%';
        }
        
        // ================== 辅助函数 ==================
        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
            else return (bytes / 1048576).toFixed(1) + ' MB';
        }
    });
</script>
