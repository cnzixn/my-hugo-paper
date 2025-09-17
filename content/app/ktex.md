---
title: 'KTEX 编辑器'
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
  
  .tool-info {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.95rem;
  border: 1px solid #ddd;
  }
  
  .tool-info ul {
  padding-left: 20px;
  margin: 10px 0;
  }
  
  .tool-info li {
  margin-bottom: 8px;
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
  padding: 10px;
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
  padding: 15px;
  background: white;
  border-radius: 8px;
  margin: 15px 0;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  }

  select, .format-selector {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin: 15px 0;
  font-size: 1rem;
  background: white;
  }
  
  #dxtFormatSelect {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 0 0 10px 0;
  }
  
  .option-card {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: calc(50% - 15px);
  box-sizing: border-box;
  background: white;
  text-align: center;
  }
  
  .option-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px #666;
  }
  
  .option-card.selected {
  border: 1px solid #aaa;
  border-radius: 5px;
  }
  
  .option-card h4 {
  margin: 0 0 5px 0;
  font-size: 0.9rem;
  }
  
  .option-card p {
  margin: 0;
  font-size: 0.8rem;
  }
  
  
  
  .option-card-disabled {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: calc(50% - 15px);
  box-sizing: border-box;
  background: white;
  text-align: center;
  }
  .option-card-disabled h4 {
  margin: 0 0 5px 0;
  font-size: 0.9rem;
  color: #999;
  }


  .progress-container {
  margin: 20px 0;
  display: none;
  }
  
  .progress-bar {
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
  }
  
  .progress-fill {
  height: 100%;
  background: #4cd964;
  width: 0%;
  transition: width 0.5s ease;
  border-radius: 4px;
  }
  
  .thumbnail {
  width: 100%;
  height: 200px;
  border-radius: 6px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  display: none;
  border: 1px solid #ddd;
  }
  
  .thumbnail img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  }
  
  .hidden {
  display: none;
  }
  
  .error-message {
  color: red;
  background: rgba(231, 76, 60, 0.1);
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  display: none;
  border: 1px solid rgba(231, 76, 60, 0.2);
  }
  
  #downloadAllBtn, #downloadKlfaBtn {
  display: block;
  margin: 10px auto;
  width: 80%;
  max-width: 300px;
  }
</style>



<div class="section">
<p>特别鸣谢：<a href="https://github.com/LordVonAdel/dxtn" target="_blank">dxtn</a>
& <a href="https://github.com/handsomematt/dont-starve-tools" target="_blank">dont-starve-tools</a>
</p>
不支持“批处理”，仅供临时应急使用
</div>

<!-- TEX转PNG部分 -->
<div class="section">
  <h2><i class="fas fa-file-export"></i> TEX转PNG</h2>
  <div class="tool-info">
  <p>将 TEX 纹理转换为 PNG 图片。支持 ARGB, DXT1, DXT3, DXT5 格式。</p>
  <!-- <ul> -->
  <!-- <li>DXT1 (无Alpha通道压缩)</li> -->
  <!-- <li>DXT3 (带Alpha通道压缩)</li> -->
  <!-- <li>DXT5 (高质量Alpha通道压缩)</li> -->
  <!-- <li>ARGB (未压缩32位格式)</li> -->
  <!-- </ul> -->
  </div>
  
  <div id="texDropZone" class="drop-zone">
  <!-- <i class="fas fa-file-import"></i> -->
  <p>拖放 TEX 文件到这里 或</p>
  <button id="texBrowseBtn">选择 TEX 文件</button>
  <input type="file" id="texFileInput" accept=".tex" style="display: none;">
  </div>
  
  <div class="thumbnail" id="texThumbnail">
  <!-- 预览图将在这里显示 -->
  </div>
  
  <div class="file-info" id="texInfo" style="display: none;">
  <p><strong>文件信息：</strong> <span id="texFileName"></span></p>
  <p><strong>格式：</strong> <span id="texFormat"></span></p>
  <p><strong>尺寸：</strong> <span id="texDimensions"></span></p>
  <p><strong>大小：</strong> <span id="texSize"></span></p>
  <button id="downloadPngBtn" class="btn-success" disabled>
  <i class="fas fa-download"></i> 下载PNG
  </button>
  </div>
  
  <div class="error-message" id="texError"></div>
  
  <div class="btn-group" style="display: none;">
  <button id="convertTexBtn" class="btn-primary" disabled >
  <i class="fas fa-sync-alt"></i> 转换为PNG
  </button>
  </div>
</div>

<!-- PNG转TEX部分 -->
<div class="section">
  <h2><i class="fas fa-file-import"></i> PNG转TEX</h2>
  <div class="tool-info">
  <p>将 PNG 图片转换为 TEX 纹理。选择压缩格式：</p>
  </div>
  
  <div id="dxtFormatSelect">
  <div class="option-card selected" data-format="argb">
  <h4>ARGB</h4>
  <!-- <p>最高质量 - 无压缩</p> -->
  </div>
  <div class="option-card-disabled" data-format="dxt1">
  <!-- <h4>DXT1 (BC1)</h4> -->
  <h4><s>DXT1 (BC1)</s></h4>

  <!-- <p>4:1压缩 - 适合大多数无透明纹理</p> -->
  </div>
  <div class="option-card-disabled" data-format="dxt3">
  <!-- <h4>DXT3 (BC2)</h4> -->
  <h4><s>DXT3 (BC2)</s></h4>
  <!-- <p>4:1压缩 - 带独立Alpha通道</p> -->
  </div>
  <div class="option-card-disabled" data-format="dxt5">
  <!-- <h4>DXT5 (BC3)</h4> -->
  <h4><s>DXT5 (BC3)</s></h4>
  <!-- <p>4:1压缩 - 高质量透明通道</p> -->
  </div>
  </div>
  
  <div id="pngDropZone" class="drop-zone">
  <!-- <i class="fas fa-file-import"></i> -->
  <p>拖放 PNG 文件到这里 或</p>
  <button id="texBrowseBtn">选择 PNG 文件</button>
  <!-- <p class="small">支持PNG格式图像文件</p> -->
  <input type="file" id="pngFileInput" accept=".png" style="display: none;">
  </div>
  
  
  <div class="thumbnail" id="pngThumbnail">
  <!-- 预览图将在这里显示 -->
  </div>
  
  <div class="file-info" id="pngInfo" style="display: none;">
  <p><strong>文件信息：</strong> <span id="pngFileName"></span></p>
  <p><strong>尺寸：</strong> <span id="pngDimensions"></span></p>
  <p><strong>大小：</strong> <span id="pngSize"></span></p>
  <button id="downloadTexBtn" class="btn-success" disabled>
  <i class="fas fa-download"></i> 下载TEX
  </button>
  </div>
  
  <div class="error-message" id="pngError"></div>
  
  <div class="btn-group" style="display: none;">
  <button id="convertPngBtn" class="btn-primary" disabled >
  <i class="fas fa-cogs"></i> 转换为TEX
  </button>
  </div>
</div>

<div class="progress-container" id="progressContainer">
  <div class="progress-bar">
  <div class="progress-fill" id="progressFill"></div>
  </div>
  <p id="progressText">处理中，请稍候...</p>
</div>

<!-- <div class="section"> -->
  <!-- <p><strong>免责声明：</strong> 本工具仅供学习使用，请勿用于任何非法用途。使用本工具即表示您了解并同意承担所有责任。</p> -->
<!-- </div> -->


<!-- <script src="/js/ktex.js"></script> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>

<script>
    // 网页交互功能
    document.addEventListener('DOMContentLoaded', function() {
        // 文件选择器元素
        const texFileInput = document.getElementById('texFileInput');
        const pngFileInput = document.getElementById('pngFileInput');
        
        // 拖放区元素
        const texDropZone = document.getElementById('texDropZone');
        const pngDropZone = document.getElementById('pngDropZone');
        
        // 转换按钮元素
        const convertTexBtn = document.getElementById('convertTexBtn');
        const convertPngBtn = document.getElementById('convertPngBtn');
        
        // 下载按钮元素
        const downloadPngBtn = document.getElementById('downloadPngBtn');
        const downloadTexBtn = document.getElementById('downloadTexBtn');
        
        // 进度条元素
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        // 文件信息元素
        const texInfo = document.getElementById('texInfo');
        const pngInfo = document.getElementById('pngInfo');
        
        // 缩略图元素
        const texThumbnail = document.getElementById('texThumbnail');
        const pngThumbnail = document.getElementById('pngThumbnail');
        
        // 错误信息元素
        const texError = document.getElementById('texError');
        const pngError = document.getElementById('pngError');
        
        // 存储当前处理的文件
        let currentTexFile = null;
        let currentPngFile = null;
        let currentDxtFormat = 'argb';
        let convertedPngData = null;
        let convertedTexData = null;
        
        // 设置当前DXT格式
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', function() {
                document.querySelectorAll('.option-card').forEach(c => 
                    c.classList.remove('selected'));
                
                this.classList.add('selected');
                currentDxtFormat = this.dataset.format;
            });
        });
        
        

        
        // 为拖放区添加事件监听器
        setupDropZone(texDropZone, texFileInput, handleTexFile);
        setupDropZone(pngDropZone, pngFileInput, handlePngFile);
        
        // 设置拖放区功能
        function setupDropZone(dropZone, fileInput, handler) {
            dropZone.addEventListener('click', () => fileInput.click());
            
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, unhighlight, false);
            });
            
            function highlight() {
                dropZone.classList.add('drag-over');
            }
            
            function unhighlight() {
                dropZone.classList.remove('drag-over');
            }
            
            dropZone.addEventListener('drop', handleDrop, false);
            
            fileInput.addEventListener('change', handleInput, false);
            
            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files.length) {
                    handler(files[0]);
                }
            }
            
            function handleInput(e) {
                if (this.files.length) {
                    handler(this.files[0]);
                }
            }
        }
        
        // 处理TEX文件
        function handleTexFile(file) {
            if (!file.name.toLowerCase().endsWith('.tex')) {
                showError(texError, '请上传有效的TEX文件');
                return;
            }
            
            hideError(texError);
            currentTexFile = file;
            
            // 显示文件信息
            document.getElementById('texFileName').textContent = file.name;
            document.getElementById('texDimensions').textContent = "未知";
            document.getElementById('texFormat').textContent = "未知";
            document.getElementById('texSize').textContent = formatFileSize(file.size);
            texInfo.style.display = 'block';
            
            // 启用转换按钮
            convertTexBtn.disabled = false;
            downloadPngBtn.disabled = true;
            
            // 清除之前的转换结果
            convertedPngData = null;
            texThumbnail.innerHTML = '';
            texThumbnail.style.display = 'none';
            
            convertTexFn();
        }
        
        // 处理PNG文件
        function handlePngFile(file) {
            if (!file.name.toLowerCase().endsWith('.png')) {
                showError(pngError, '请上传有效的PNG文件');
                return;
            }
            
            hideError(pngError);
            currentPngFile = file;
            
            // 显示文件信息
            document.getElementById('pngFileName').textContent = file.name;
            document.getElementById('pngSize').textContent = formatFileSize(file.size);
            pngInfo.style.display = 'block';
            downloadTexBtn.disabled = true;
            
            // 清除之前的转换结果
            convertedTexData = null;
            
            // 显示预览图片
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    document.getElementById('pngDimensions').textContent = `${img.width}×${img.height}像素`;
                    pngThumbnail.innerHTML = `<img src="${e.target.result}" alt="预览">`;
                    pngThumbnail.style.display = 'flex';
                    convertPngBtn.disabled = false;
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            
            convertPngFn();
        }
        
        // 转换TEX为PNG
        convertTexBtn.addEventListener('click', convertTexFn);
        
        function convertTexFn() {
            if (!currentTexFile) return;
            
            showProgress(true);
            simulateProgress();
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const texData = new Uint8Array(e.target.result);
                    const texFile = TEXFile.fromArrayBuffer(texData.buffer);
                    
                    // 获取格式和尺寸
                    const format = texFile.getPixelFormat();
                    const width = texFile.mipmaps[0].width;
                    const height = texFile.mipmaps[0].height;
                    
                    // 更新文件信息
                    document.getElementById('texDimensions').textContent = `${width}×${height}像素`;
                    document.getElementById('texFormat').textContent = format.toUpperCase();
                    
                    
                    // 创建compression对象
                    let compression;
                    switch(format) {
                        case 'dxt1':
                            compression = {
                                blockSize: DXT1BlockSize,
                                blockDecompressMethod: decompressBlockDXT1
                            };
                            break;
                        case 'dxt3':
                            compression = {
                                blockSize: DXT3BlockSize,
                                blockDecompressMethod: decompressBlockDXT3
                            };
                            break;
                        case 'dxt5':
                            compression = {
                                blockSize: DXT5BlockSize,
                                blockDecompressMethod: decompressBlockDXT5
                            };
                            break;
                        case 'argb':
                            // 对于ARGB格式，不需要压缩
                            compression = null;
                            break;
                        default:
                            throw new Error("不支持的DXT格式");
                    }
                    
                    
                    let rgbaData;
                    
                    // 处理不同的格式
                    if (format === 'argb') {
                        // ARGB格式直接使用原始数据
                        rgbaData = texFile.mipmaps[0].data;
                    } else {
                        // DXT格式需要解压缩
                        rgbaData = decompress(width, height, texFile.mipmaps[0].data, compression);
                    }
                    
                    
                    // 修复：翻转图像数据（解决上下颠倒问题）
                    const flippedData = new Uint8ClampedArray(rgbaData.length);
                    for (let y = 0; y < height; y++) {
                        for (let x = 0; x < width; x++) {
                            const srcIndex = (y * width + x) * 4;
                            const destIndex = ((height - 1 - y) * width + x) * 4;
                            flippedData[destIndex] = rgbaData[srcIndex];         // R
                            flippedData[destIndex + 1] = rgbaData[srcIndex + 1]; // G
                            flippedData[destIndex + 2] = rgbaData[srcIndex + 2]; // B
                            flippedData[destIndex + 3] = rgbaData[srcIndex + 3]; // A
                        }
                    }
                    
                    // 创建Canvas并绘制图像
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    const imageData = ctx.createImageData(width, height);
                    imageData.data.set(flippedData)
                    ctx.putImageData(imageData, 0, 0);
                    
                    // 转换为PNG数据URL
                    convertedPngData = canvas.toDataURL('image/png');
                    
                    // 显示转换后的图像
                    texThumbnail.innerHTML = `<img src="${convertedPngData}" alt="转换后的PNG">`;
                    texThumbnail.style.display = 'flex';
                    
                    // 启用下载按钮
                    convertTexBtn.disabled = true;
                    downloadPngBtn.disabled = false;
                    showProgress(false);
                } catch (error) {
                    showError(texError, `转换失败: ${error.message}`);
                    showProgress(false);
                }
            };
            reader.readAsArrayBuffer(currentTexFile);
        };
        
        // 转换PNG为TEX
        convertPngBtn.addEventListener('click', convertPngFn);
        
        function convertPngFn() {
            if (!currentPngFile) return;
            
            showProgress(true);
            simulateProgress();
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        // 获取图像数据
                        const imageData = ctx.getImageData(0, 0, img.width, img.height);
                        const rgbaData = imageData.data;
                        
                        // 创建compression对象
                        let compression;
                        switch(currentDxtFormat) {
                            case 'dxt1':
                                compression = {
                                    blockSize: DXT1BlockSize,
                                    blockCompressMethod: compressBlockDXT1
                                };
                                break;
                            case 'dxt3':
                                compression = {
                                    blockSize: DXT3BlockSize,
                                    blockCompressMethod: compressBlockDXT3
                                };
                                break;
                            case 'dxt5':
                                compression = {
                                    blockSize: DXT5BlockSize,
                                    blockCompressMethod: compressBlockDXT5
                                };
                                break;
                            case 'argb':
                                // 对于ARGB格式，不需要压缩
                                compression = null;
                                break;
                            default:
                                throw new Error("不支持的DXT格式");
                        }
                        
                        const width = img.width;
                        const height = img.height;
                        
                        // 修复：翻转图像数据（解决上下颠倒问题）
                        const flippedData = new Uint8ClampedArray(rgbaData.length);
                        for (let y = 0; y < height; y++) {
                            for (let x = 0; x < width; x++) {
                                const srcIndex = (y * width + x) * 4;
                                const destIndex = ((height - 1 - y) * width + x) * 4;
                                flippedData[destIndex] = rgbaData[srcIndex];         // R
                                flippedData[destIndex + 1] = rgbaData[srcIndex + 1]; // G
                                flippedData[destIndex + 2] = rgbaData[srcIndex + 2]; // B
                                flippedData[destIndex + 3] = rgbaData[srcIndex + 3]; // A
                            }
                        }
                        
                        // 创建TEX文件
                        let texData;
                        if (currentDxtFormat === 'argb') {
                            // 对于ARGB格式，直接使用原始数据
                            texData = flippedData;
                        } else {
                            // 使用compress函数压缩数据
                            texData = compress(img.width, img.height, flippedData, compression);
                        }
                        
                        
                        
                        // 创建TEX文件对象
                        const texFile = new TEXFile();
                        texFile.header.pixelFormat = getPixelFormatValue(currentDxtFormat);
                        const mipmap = {
                            width: img.width,
                            height: img.height,
                            pitch: currentDxtFormat === 'argb' ? img.width * 4 : img.width,
                            dataSize: texData.length,
                            data: texData
                        };
                        texFile.mipmaps.push(mipmap);
                        
                        // 转换为ArrayBuffer
                        const texArrayBuffer = texFile.toArrayBuffer();
                        
                        // 存储转换后的数据
                        convertedTexData = new Blob([texArrayBuffer], {type: 'application/octet-stream'});
                        
                        // 更新文件信息
                        document.getElementById('texDimensions').textContent = `${img.width}×${img.height}像素`;
                        document.getElementById('texFormat').textContent = currentDxtFormat.toUpperCase();
                        document.getElementById('texSize').textContent = formatFileSize(convertedTexData.size);
                        
                        // 启用下载按钮
                        convertPngBtn.disabled = true;
                        downloadTexBtn.disabled = false;
                        showProgress(false);
                    } catch (error) {
                        showError(pngError, `转换失败: ${error.message}`);
                        showProgress(false);
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(currentPngFile);
        };
        
        // 辅助函数：获取像素格式的数值表示
        function getPixelFormatValue(format) {
            switch(format) {
                case 'dxt1': return 0;
                case 'dxt3': return 1;
                case 'dxt5': return 2;
                case 'argb': return 4;
                default: return 0; // 默认为DXT1
            }
        }

        
        // 下载转换后的PNG文件
        downloadPngBtn.addEventListener('click', function() {
            if (!convertedPngData) return;
            
            const filename = currentTexFile ? 
                currentTexFile.name.replace('.tex', '.png') : 'converted.png';
            
            // 创建a标签并触发下载
            const link = document.createElement('a');
            link.href = convertedPngData; // 直接使用dataURL作为链接
            link.download = filename; // 文件名（指定后浏览器会下载而非跳转）
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // 清理DOM

        });
        
        // 下载转换后的TEX文件
        downloadTexBtn.addEventListener('click', function() {
            if (!convertedTexData) return;
            
            const blob = URL.createObjectURL(convertedTexData);
            const filename = currentPngFile ? 
                currentPngFile.name.replace('.png', '.tex') : 'converted.tex';
            saveAs(blob, filename);
        });
        
        // 显示/隐藏进度条
        function showProgress(show) {
            progressContainer.style.display = show ? 'block' : 'none';
            if (show) {
                progressFill.style.width = '0%';
                progressText.textContent = '处理中，请稍候...';
            }
        }
        
        // 模拟进度更新
        function simulateProgress() {
            let width = 0;
            const interval = setInterval(() => {
                width += 5 + Math.random() * 15;
                if (width >= 100) {
                    width = 100;
                    clearInterval(interval);
                }
                progressFill.style.width = `${width}%`;
                
                if (width < 30) {
                    progressText.textContent = '读取文件...';
                } else if (width < 60) {
                    progressText.textContent = '解码图像...';
                } else if (width < 90) {
                    progressText.textContent = '应用DXT压缩...';
                } else {
                    progressText.textContent = '完成！';
                }
            }, 200);
        }
        
        // 格式化文件大小
        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
            else return (bytes / 1048576).toFixed(2) + ' MB';
        }
        
        // 显示错误信息
        function showError(element, message) {
            element.textContent = message;
            element.style.display = 'block';
        }
        
        // 隐藏错误信息
        function hideError(element) {
            element.style.display = 'none';
        }
    });
</script>