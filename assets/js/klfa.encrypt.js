document.addEventListener('DOMContentLoaded', () => {
    // ================== 通用功能 ==================
    // 标签切换
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有active类
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 添加active类到当前标签
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // 黑暗模式切换
    const modeToggle = document.getElementById('modeToggle');
    modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        modeToggle.innerHTML = isDark ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
        
        // 保存用户偏好
        localStorage.setItem('darkMode', isDark);
    });
    
    // 初始化黑暗模式
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // 格式化文件大小函数
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    // ================== 解包功能 ==================
    const unpackDropZone = document.getElementById('unpack-dropZone');
    const unpackFileInput = document.getElementById('unpack-fileInput');
    const unpackBrowseBtn = document.getElementById('unpack-browseBtn');
    const unpackProgressContainer = document.getElementById('unpack-progressContainer');
    const unpackProgressFill = document.getElementById('unpack-progressFill');
    const unpackProgressText = document.getElementById('unpack-progressText');
    const unpackResultArea = document.getElementById('unpack-resultArea');
    const unpackFileCount = document.getElementById('unpack-fileCount');
    const unpackTotalSize = document.getElementById('unpack-totalSize');
    const unpackArchiveSize = document.getElementById('unpack-archiveSize');
    const unpackFileList = document.getElementById('unpack-fileList');
    const unpackDownloadBtn = document.getElementById('unpack-downloadBtn');
    const unpackResetBtn = document.getElementById('unpack-resetBtn');
    const unpackFilenamePreview = document.getElementById('unpack-filenamePreview');
    const unpackDownloadFilename = document.getElementById('unpack-downloadFilename');
    const unpackErrorMessage = document.getElementById('unpack-errorMessage');
    
    let unpackArchiveData = null;
    let unpackExtractedFiles = [];
    let unpackOriginalFilename = '';
    let unpackBlobData = null;
    
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
        if (dt.files.length > 0) {
            handleUnpackFile(dt.files[0]);
        }
    });
    
    // 处理文件函数
    function handleUnpackFile(file) {
        if (!file.name.endsWith('.archive')) {
            showUnpackError('请选择 .archive 文件');
            return;
        }
        
        // 隐藏错误信息
        unpackErrorMessage.style.display = 'none';
        
        // 保存原始文件名
        unpackOriginalFilename = file.name.replace('.archive', '');
        // 更新下载文件名预览
        unpackDownloadFilename.textContent = `_${unpackOriginalFilename}.zip`;
        unpackFilenamePreview.style.display = 'block';
        
        unpackProgressContainer.style.display = 'block';
        unpackProgressText.textContent = '正在读取文件...';
        unpackProgressFill.style.width = '0%';
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                unpackArchiveData = new Uint8Array(e.target.result);
                unpackProgressText.textContent = '验证文件格式...';
                unpackProgressFill.style.width = '10%';
                
                setTimeout(() => {
                    extractArchive(file);
                }, 500);
            } catch (error) {
                showUnpackError('文件读取失败: ' + error.message);
            }
        };
        
        reader.onerror = () => {
            showUnpackError('文件读取失败');
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    // 解包资源文件函数（修复中文名乱码）
    function extractArchive(file) {
        try {
            unpackProgressText.textContent = '解析文件头...';
            unpackProgressFill.style.width = '20%';
            
            // 检查文件头
            const header = String.fromCharCode.apply(null, unpackArchiveData.slice(0, 4));
            if (header !== 'KLFA') {
                showUnpackError('无效的资源文件格式: 文件头应为KLFA');
                return;
            }
            
            // 创建DataView
            const dataView = new DataView(unpackArchiveData.buffer);
            
            // 读取文件数量
            const fileCountValue = dataView.getUint32(4, true);
            
            let offset = 8; // 跳过文件头和文件数量
            unpackExtractedFiles = [];
            
            setTimeout(() => {
                unpackProgressText.textContent = `正在解包${fileCountValue}个文件...`;
                unpackProgressFill.style.width = '30%';
                
                // 解包每个文件
                for (let i = 0; i < fileCountValue; i++) {
                    // 更新进度
                    const progress = 30 + (i / fileCountValue) * 60;
                    unpackProgressFill.style.width = `${progress}%`;
                    unpackProgressText.textContent = `正在解包文件 ${i+1}/${fileCountValue}...`;
                    
                    // 读取文件名长度
                    const nameSize = dataView.getUint32(offset, true);
                    offset += 4;
                    
                    // 读取文件名（使用UTF-8解码）
                    const nameArray = unpackArchiveData.slice(offset, offset + nameSize);
                    const fileName = new TextDecoder('utf-8').decode(nameArray); // 修复中文乱码
                    offset += nameSize;
                    
                    // 读取文件偏移量
                    const fileOffset = dataView.getUint32(offset, true);
                    offset += 4;
                    
                    // 读取文件大小
                    const fileSize = dataView.getUint32(offset, true);
                    offset += 4;
                    
                    // 跳过dummy字节
                    offset += 1;
                    
                    // 提取文件数据
                    const fileData = unpackArchiveData.slice(fileOffset, fileOffset + fileSize);
                    
                    // 添加到文件列表
                    unpackExtractedFiles.push({
                        name: fileName,
                        size: fileSize,
                        data: fileData
                    });
                }
                
                // 更新UI
                unpackProgressFill.style.width = '100%';
                unpackProgressText.textContent = '解包完成！';
                
                setTimeout(() => {
                    showUnpackResults(file, unpackExtractedFiles);
                }, 800);
                
            }, 500);
        } catch (error) {
            showUnpackError('解包过程中出错: ' + error.message);
        }
    }
    
    // 显示解包结果函数
    function showUnpackResults(file, files) {
        // 更新统计信息
        unpackFileCount.textContent = files.length;
        
        const totalSizeBytes = files.reduce((sum, file) => sum + file.size, 0);
        unpackTotalSize.textContent = formatFileSize(totalSizeBytes);
        
        unpackArchiveSize.textContent = formatFileSize(file.size);
        
        // 显示文件列表
        unpackFileList.innerHTML = '';
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            `;
            unpackFileList.appendChild(fileItem);
        });
        
        // 显示结果区域
        unpackResultArea.style.display = 'block';
        
        // 滚动到结果区域
        unpackResultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // 解包下载按钮事件（修复中文名乱码）
// 解包下载按钮事件（修复中文名乱码 + 改用a.download）
unpackDownloadBtn.addEventListener('click', () => {
    // 重置进度条
    unpackProgressText.textContent = '正在创建ZIP文件...';
    unpackProgressFill.style.width = '0%';
    
    // 延迟开始以避免UI阻塞
    setTimeout(async () => {
        try {
            const zip = new JSZip();
            let hasError = false;

            // 添加文件到ZIP（带进度更新）
            for (let i = 0; i < unpackExtractedFiles.length; i++) {
                try {
                    const file = unpackExtractedFiles[i];
                    zip.file(file.name, file.data, {
                        createFolders: true,
                        comment: "UTF-8"
                    });

                    // 更新进度（改用requestAnimationFrame平滑渲染）
                    const progress = (i / unpackExtractedFiles.length) * 100;
                    requestAnimationFrame(() => {
                        unpackProgressFill.style.width = `${progress}%`;
                        unpackProgressText.textContent = `添加文件中... ${i+1}/${unpackExtractedFiles.length}`;
                    });
                    
                    // 每处理10个文件让出主线程（防止卡顿）
                    if (i % 10 === 0) await new Promise(resolve => setTimeout(resolve, 0));
                } catch (error) {
                    hasError = true;
                    showUnpackError(`添加文件失败: ${error.message}`);
                    break;
                }
            }

            if (hasError) return;

            // 生成ZIP（带双重进度：生成+下载）
            zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 },
                encodeFileName: str => str // 保持UTF-8编码
            }, metadata => {
                // 生成阶段进度（0-90%）
                const generateProgress = metadata.percent * 0.5;
                unpackProgressFill.style.width = `${generateProgress}%`;
                unpackProgressText.textContent = `生成ZIP中... ${Math.round(metadata.percent)}%`;
            }).then(blob => {
                // 生成完成（90%）
                unpackProgressFill.style.width = '50%';
                unpackProgressText.textContent = '准备下载...';

                // 使用a.download触发下载（替代saveAs）
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = unpackDownloadFilename.textContent || 'archive.zip';
                a.style.display = 'none';
                document.body.appendChild(a);
                
                // 添加下载完成监听（进度100%）
                a.addEventListener('click', () => {
                    setTimeout(() => {
                        unpackProgressFill.style.width = '100%';
                        unpackProgressText.textContent = '下载完成！';
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url); // 释放内存
                    }, 1000); // 留出时间确保下载触发
                });
                
                a.click();
            }).catch(error => {
                showUnpackError('生成ZIP失败: ' + error.message);
            });

        } catch (error) {
            showUnpackError('创建ZIP失败: ' + error.message);
        }
    }, 100); // 缩短延迟时间
});

    
    // 解包重置按钮事件
    unpackResetBtn.addEventListener('click', () => {
        unpackFileInput.value = '';
        unpackResultArea.style.display = 'none';
        unpackProgressContainer.style.display = 'none';
        unpackFilenamePreview.style.display = 'none';
        unpackExtractedFiles = [];
        unpackOriginalFilename = '';
        unpackProgressFill.style.width = '0%';
        unpackProgressText.textContent = '准备就绪';
    });
    
    // 解包错误处理函数
    function showUnpackError(message) {
        unpackErrorMessage.textContent = message;
        unpackErrorMessage.style.display = 'block';
        unpackProgressText.textContent = '处理失败';
        unpackProgressFill.style.width = '0%';
        
        // 滚动到错误信息
        unpackErrorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // ================== 打包功能 ==================
    const packDropZone = document.getElementById('pack-dropZone');
    const packFileInput = document.getElementById('pack-fileInput');
    const packBrowseBtn = document.getElementById('pack-browseBtn');
    const packProgressContainer = document.getElementById('pack-progressContainer');
    const packProgressFill = document.getElementById('pack-progressFill');
    const packProgressText = document.getElementById('pack-progressText');
    const packResultArea = document.getElementById('pack-resultArea');
    const packFileCount = document.getElementById('pack-fileCount');
    const packTotalSize = document.getElementById('pack-totalSize');
    const packArchiveSize = document.getElementById('pack-archiveSize');
    const packDownloadBtn = document.getElementById('pack-downloadBtn');
    const packResetBtn = document.getElementById('pack-resetBtn');
    const packErrorMessage = document.getElementById('pack-errorMessage');
    const packBtn = document.getElementById('pack-btn');
    const packFilenamePreview = document.getElementById('pack-filenamePreview');
    const packDownloadFilename = document.getElementById('pack-downloadFilename');
    
    let packFiles = [];
    let packArchiveBlob = null;
    let packArchiveSizeValue = 0;
    let packOriginalFilename = '';
    
    // 浏览按钮点击事件
    packBrowseBtn.addEventListener('click', () => {
        packFileInput.click();
    });
    
    // 文件选择变化事件
    packFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handlePackFile(e.target.files[0]);
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
    
    packDropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt.files.length > 0) {
            handlePackFile(dt.files[0]);
        }
    });
    
    // 处理选择的文件
    function handlePackFile(file) {
        if (!file.name.endsWith('.zip')) {
            showPackError('请选择 .zip 文件');
            return;
        }
        
        // 隐藏错误信息
        packErrorMessage.style.display = 'none';
        
        // 设置资源文件名称
        let archiveName = file.name;
        if (archiveName.startsWith('_')) {
            archiveName = archiveName.substring(1);
        }
        if (archiveName.endsWith('.zip')) {
            archiveName = archiveName.replace('.zip', '.archive');
        }
        
        packDownloadFilename.textContent = archiveName;
        packFilenamePreview.style.display = 'block';
        packOriginalFilename = archiveName;
        
        // 启用打包按钮
        packBtn.disabled = false;
        
        // 保存文件引用
        packFiles = [file];
    }
    
    // 打包按钮事件
    packBtn.addEventListener('click', () => {
        if (packFiles.length === 0) {
            showPackError('请上传ZIP文件');
            return;
        }
        
        packProgressContainer.style.display = 'block';
        packProgressText.textContent = '开始打包...';
        packProgressFill.style.width = '0%';
        
        setTimeout(() => {
            createArchive();
        }, 500);
    });
    
    // 工具函数：验证文件名
    function isValidFileName(name) {
        if (!name || name.length === 0) return false;
        // 禁止控制字符和特殊字符
        if (/[\x00-\x1F\x7F<>:"|?*]/.test(name)) return false;
        // 禁止以点开头（隐藏文件）
        if (/^\./.test(name)) return false;
        return true;
    }
    
    // 工具函数：标准化文件名（修复中文名乱码）
    function normalizeFileName(name) {
        // 确保UTF-8编码
        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder('utf-8', { fatal: true });
            const bytes = encoder.encode(name);
            decoder.decode(bytes);
        } catch (e) {
            console.warn('文件名包含非UTF-8字符:', name);
        }
        
        return name.replace(/\\/g, '/')          // 统一使用正斜杠
                   .replace(/^\.+\//, '')       // 移除开头的相对路径
                   .replace(/\/\.+\//g, '/')    // 移除中间的相对路径
                   .replace(/\/+/g, '/');       // 合并连续斜杠
    }
    
    // 创建资源文件（修复中文名乱码）
    async function createArchive() {
        try {
            const file = packFiles[0];
            if (!file) {
                showPackError('请先选择ZIP文件');
                return;
            }
    
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    // 使用JSZip读取ZIP文件（明确使用UTF-8解码文件名）
                    const zip = new JSZip();
                    const zipData = await zip.loadAsync(e.target.result, {
                        decodeFileName: (bytes) => new TextDecoder('utf-8').decode(bytes)
                    });
                    
                    // 获取所有文件
                    const fileNames = Object.keys(zipData.files);
                    const files = [];
                    let totalSize = 0;
                    
                    packProgressText.textContent = '读取ZIP内容...';
                    packProgressFill.style.width = '20%';
                    
                    // 提取所有文件
                    for (let i = 0; i < fileNames.length; i++) {
                        const fileName = fileNames[i];
                        const zipEntry = zipData.files[fileName];
                        
                        // 跳过目录
                        if (zipEntry.dir) continue;
                        
                        // 验证文件名
                        if (!isValidFileName(fileName)) {
                            console.warn(`跳过无效文件名: ${fileName}`);
                            continue;
                        }
                        
                        // 获取文件内容
                        const fileContent = await zipEntry.async('uint8array');
                        files.push({
                            name: fileName,
                            size: fileContent.length,
                            data: fileContent
                        });
                        
                        totalSize += fileContent.length;
                        
                        // 更新进度
                        const progress = 20 + (i / fileNames.length) * 30;
                        packProgressFill.style.width = `${progress}%`;
                        packProgressText.textContent = `读取文件 ${i+1}/${fileNames.length}...`;
                    }
                    
                    if (files.length === 0) {
                        showPackError('ZIP文件中没有有效的可打包文件');
                        return;
                    }
                    
                    // 计算文件头长度
                    let headerSize = 8; // KLFA + 文件数量
                    const encoder = new TextEncoder();
                    
                    for (const file of files) {
                        const normalizedName = normalizeFileName(file.name);
                        const nameBytes = encoder.encode(normalizedName);
                        headerSize += 4 + nameBytes.length + 8 + 1;
                    }
                    
                    // 创建ArrayBuffer
                    let totalArchiveSize = headerSize + totalSize;
                    const buffer = new ArrayBuffer(totalArchiveSize);
                    const dataView = new DataView(buffer);
                    const headerArray = new Uint8Array(buffer, 0, headerSize);
                    const dataArray = new Uint8Array(buffer, headerSize);
                    
                    // 写入文件头
                    // KLFA
                    headerArray[0] = 'K'.charCodeAt(0);
                    headerArray[1] = 'L'.charCodeAt(0);
                    headerArray[2] = 'F'.charCodeAt(0);
                    headerArray[3] = 'A'.charCodeAt(0);
                    
                    // 文件数量
                    dataView.setUint32(4, files.length, true);
                    
                    let headerOffset = 8;
                    let dataOffset = 0;
                    
                    // 写入文件信息（确保UTF-8编码）
                    for (let i = 0; i < files.length; i++) {
                        try {
                            const file = files[i];
                            const normalizedName = normalizeFileName(file.name);
                            const encoder = new TextEncoder();
                            const nameBytes = encoder.encode(normalizedName);
                            
                            // 文件名长度
                            dataView.setUint32(headerOffset, nameBytes.length, true);
                            headerOffset += 4;
                            
                            // 文件名（UTF-8编码）
                            for (let j = 0; j < nameBytes.length; j++) {
                                headerArray[headerOffset++] = nameBytes[j];
                            }
                            
                            // 文件偏移量
                            dataView.setUint32(headerOffset, headerSize + dataOffset, true);
                            headerOffset += 4;
                            
                            // 文件大小
                            dataView.setUint32(headerOffset, file.size, true);
                            headerOffset += 4;

                            // dummy字节
                            headerArray[headerOffset++] = 0;
                            
                            // 复制文件数据
                            dataArray.set(file.data, dataOffset);
                            dataOffset += file.size;
                            
                            // 更新进度
                            const progress = 50 + (i / files.length) * 50;
                            packProgressFill.style.width = `${progress}%`;
                            packProgressText.textContent = `打包文件 ${i+1}/${files.length}...`;
                        } catch (error) {
                            console.error(`处理文件 ${files[i] && files[i].name || '未知'} 时出错:`, error);
                            throw error;
                        }
                    }
                    
                    // 创建Blob
                    packArchiveBlob = new Blob([buffer], {type: 'application/octet-stream'});
                    packArchiveSizeValue = packArchiveBlob.size;
                    
                    packProgressFill.style.width = '100%';
                    packProgressText.textContent = '打包完成！';
                    
                    setTimeout(() => {
                        showPackResults(files);
                    }, 800);
                    
                } catch (error) {
                    showPackError('打包过程中出错: ' + error.message);
                    console.error('打包错误详情:', error);
                }
            };
            
            reader.onerror = () => {
                showPackError('文件读取失败');
            };
            
            reader.readAsArrayBuffer(file);
            
        } catch (error) {
            showPackError('打包过程中出错: ' + error.message);
            console.error('初始化错误详情:', error);
        }
    }

    // 显示打包结果
    function showPackResults(files) {
        packFileCount.textContent = files.length;
        
        const totalSizeBytes = files.reduce((sum, file) => sum + file.size, 0);
        packTotalSize.textContent = formatFileSize(totalSizeBytes);
        
        packArchiveSize.textContent = formatFileSize(packArchiveSizeValue);
        
        packResultArea.style.display = 'block';
        packResultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // 打包下载按钮事件
    packDownloadBtn.addEventListener('click', () => {
        saveAs(packArchiveBlob, packOriginalFilename);
    });
    
    // 打包重置按钮事件
    packResetBtn.addEventListener('click', () => {
        packFileInput.value = '';
        packFiles = [];
        packArchiveBlob = null;
        packArchiveSizeValue = 0;
        packFilenamePreview.style.display = 'none';
        packResultArea.style.display = 'none';
        packProgressContainer.style.display = 'none';
        packBtn.disabled = true;
    });
    
    // 打包错误处理函数
    function showPackError(message) {
        packErrorMessage.textContent = message;
        packErrorMessage.style.display = 'block';
        packProgressText.textContent = '处理失败';
        packProgressFill.style.width = '0%';
        
        // 滚动到错误信息
        packErrorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});