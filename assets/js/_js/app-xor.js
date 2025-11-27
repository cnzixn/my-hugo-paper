// <script>
  // 核心配置（完全保留原需求，不改动任何后缀定义）
  const MAX_FILE_COUNT = 100;
  const FIXED_XOR_PASSWORD = "d.bxq.me"; // 内置密码不变
  const XOR_SUFFIX = '.xor'; // 仅处理此后缀，不干扰其他格式
  let selectedFiles = [];

  // DOM元素（完全不变）
  const fileDropZone = document.getElementById('fileDropZone');
  const fileBrowseBtn = document.getElementById('fileBrowseBtn');
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');
  const fileCount = document.getElementById('fileCount');
  const fileError = document.getElementById('fileError');
  const processBtn = document.getElementById('processBtn');
  const processProgress = document.getElementById('processProgress');
  const processProgressFill = document.getElementById('processProgressFill');
  const processProgressText = document.getElementById('processProgressText');
  const processError = document.getElementById('processError');
  const processResult = document.getElementById('processResult');
  const downloadBtn = document.getElementById('downloadBtn');
  const resultHint = document.getElementById('resultHint');

  // 1. 文件选择与拖拽逻辑（完全不变）
  fileBrowseBtn.addEventListener('click', () => fileInput.click());
  
  fileInput.addEventListener('change', (e) => {
    handleFileSelect(Array.from(e.target.files));
    fileInput.value = ''; // 重置，允许重复选择同一文件
  });
  
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileDropZone.addEventListener(eventName, preventDefaults, false);
  });
  function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    fileDropZone.addEventListener(eventName, () => fileDropZone.classList.add('drag-over'), false);
  });
  ['dragleave', 'drop'].forEach(eventName => {
    fileDropZone.addEventListener(eventName, () => fileDropZone.classList.remove('drag-over'), false);
  });
  
  fileDropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    handleFileSelect(Array.from(dt.files));
  });

  // 2. 文件选择统一处理（完全不变）
  function handleFileSelect(newFiles) {
    if (newFiles.length === 0) return;
    
    // 去重（按文件名+大小，文件名忽略大小写）
    const uniqueNewFiles = newFiles.filter(newFile => 
      !selectedFiles.some(existFile => 
        existFile.name.toLowerCase() === newFile.name.toLowerCase() && existFile.size === newFile.size
      )
    );
    
    // 数量校验
    const totalAfterAdd = selectedFiles.length + uniqueNewFiles.length;
    if (totalAfterAdd > MAX_FILE_COUNT) {
      showError(fileError, `文件数量超限！最多选择${MAX_FILE_COUNT}个，当前已选${selectedFiles.length}个，本次可再选${MAX_FILE_COUNT - selectedFiles.length}个`);
      return;
    }
    
    // 更新选中列表
    selectedFiles = [...selectedFiles, ...uniqueNewFiles];
    updateFileList();
    updateProcessBtnStatus();
    hideError(fileError);
  }

  // 3. 更新文件列表UI（精准处理.xor后缀，保留所有原始格式）
  function updateFileList() {
    fileCount.textContent = selectedFiles.length;
    
    if (selectedFiles.length === 0) {
      fileList.style.display = 'none';
      return;
    }
    
    fileList.style.display = 'block';
    fileList.innerHTML = selectedFiles.map((file, index) => {
      const fileNameLower = file.name.toLowerCase();
      // 仅判断文件名是否以.xor结尾（忽略大小写），不碰其他后缀
      const isXorFile = fileNameLower.endsWith(XOR_SUFFIX);
      const XOR_SUFFIX_UPPER = XOR_SUFFIX.toUpperCase();
      // 精准生成目标名：有.xor则移除，无则添加（保留所有原始后缀）
      const targetName = isXorFile 
        ? file.name.slice(0, file.name.length - XOR_SUFFIX.length) // 移除.xor
        : `${file.name}${XOR_SUFFIX_UPPER}`; // 添加.XOR
      
      // 获取原始文件格式（不改动，仅展示）
      const fileExt = file.name.lastIndexOf('.') > -1 
        ? file.name.slice(file.name.lastIndexOf('.')) 
        : '无后缀';
      
      return `
        <div class="file-item">
          <span>
            ${index + 1}. ${file.name} 
            <span class="pill">${formatFileSize(file.size)}${isXorFile ? ' | 已加密' : ''}</span>
            → <small style="color:var(--primary);">${targetName}</small>
          </span>
          <span class="file-remove" data-index="${index}">×</span>
        </div>
      `;
    }).join('');
    
    // 绑定删除事件（完全不变）
    document.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        selectedFiles.splice(index, 1);
        updateFileList();
        updateProcessBtnStatus();
      });
    });
  }

  // 4. 更新处理按钮状态（完全不变）
  function updateProcessBtnStatus() {
    processBtn.disabled = selectedFiles.length === 0;
  }

  // 5. 核心XOR处理逻辑（关键修复：文件名+文件类型，杜绝多余后缀）
  processBtn.addEventListener('click', async () => {
    if (selectedFiles.length === 0) return;
    
    // 初始化状态（完全不变）
    processBtn.disabled = true;
    processProgress.style.display = 'block';
    processProgressFill.style.width = '0%';
    processProgressText.textContent = '开始处理...';
    hideError(processError);
    processResult.style.display = 'none';

    try {
      const processedFiles = [];
      const total = selectedFiles.length;

      // 逐个处理文件（核心修复：精准控制文件名）
      for (let i = 0; i < total; i++) {
        const file = selectedFiles[i];
        const progress = Math.round(((i + 1) / total) * 100);
        const fileNameLower = file.name.toLowerCase();
        const isXorFile = fileNameLower.endsWith(XOR_SUFFIX);
        
        // 读取文件（完全不变）
        const fileData = await readFileAsUint8Array(file);
        // 密码转ASCII（完全不变）
        const passwordAscii = stringToAsciiArray(FIXED_XOR_PASSWORD);
        // XOR运算（完全不变）
        const processedData = xorCalculate(fileData, passwordAscii);
        
        // 修复1：精准生成目标文件名（与列表UI完全一致，无任何额外修改）
        const XOR_SUFFIX_UPPER = XOR_SUFFIX.toUpperCase();
        const targetName = isXorFile 
          ? file.name.slice(0, file.name.length - XOR_SUFFIX.length) 
          : `${file.name}${XOR_SUFFIX_UPPER}`;
        
        // 修复2：强制文件类型为"无关联后缀"类型，彻底避免系统自动加后缀
        processedFiles.push({
          name: targetName, // 最终名：如BM003.ZIP.XZ.XOR（无多余后缀）
          data: processedData,
          type: 'application/x-octet-stream' // 关键：此类型无任何默认后缀关联
        });

        // 更新进度（完全不变）
        processProgressFill.style.width = `${progress}%`;
        processProgressText.textContent = `处理中（${i + 1}/${total}）：${file.name}`;
      }

      // 准备下载（修复3：单文件不依赖Blob类型，直接用目标名）
      let zipBlob = null;
      if (processedFiles.length === 1) {
        const { name, data } = processedFiles[0];
        // 单文件：强制用"无关联后缀"类型，避免类型导致的后缀追加
        zipBlob = new Blob([data], { type: 'application/x-octet-stream' });
        resultHint.textContent = `处理完成，共生成1个文件：${name}`;
      } else {
        // 多文件打包ZIP（完全不变，ZIP内文件名精准）
        const zip = new JSZip();
        processedFiles.forEach(file => zip.file(file.name, file.data));
        zipBlob = await zip.generateAsync({ type: 'blob' });
        resultHint.textContent = `处理完成，共生成${processedFiles.length}个文件，已打包为ZIP`;
      }

      // 显示结果（修复4：下载时强制用目标名，不允许系统修改）
      processProgressText.textContent = '处理完成';
      processResult.style.display = 'block';
      downloadBtn.onclick = () => {
        // 直接用processedFiles中的目标名，杜绝任何自动后缀
        const finalName = processedFiles.length === 1 
          ? processedFiles[0].name 
          : `XOR处理结果_${Date.now()}.ZIP`;
        // 强制保存为目标名，避免浏览器自动加后缀
        saveAs(zipBlob, finalName);
      };

    } catch (error) {
      showError(processError, `处理失败：${error.message}`);
      processProgressText.textContent = '处理失败';
    }
  });

  // 工具函数（全部完全不变）
  function readFileAsUint8Array(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(new Uint8Array(e.target.result));
      reader.onerror = () => reject(new Error(`读取文件失败：${file.name}`));
      reader.readAsArrayBuffer(file);
    });
  }

  function stringToAsciiArray(str) {
    if (!str) throw new Error("请在JS中设置FIXED_XOR_PASSWORD内置密码");
    const arr = [];
    for (let i = 0; i < str.length; i++) arr.push(str.charCodeAt(i));
    return arr;
  }

  function xorCalculate(data, passwordAscii) {
    const result = new Uint8Array(data.length);
    const pwdLen = passwordAscii.length;
    for (let i = 0; i < data.length; i++) result[i] = data[i] ^ passwordAscii[i % pwdLen];
    return result;
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function showError(el, text) {
    el.textContent = text;
    el.style.display = 'block';
  }

  function hideError(el) {
    el.style.display = 'none';
  }
// </script>
