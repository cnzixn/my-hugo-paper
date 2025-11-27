// 从URL参数中提取data（用户码）
function getUserIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('data') || null;
}

// 获取当前日期并格式化为“251007”样式（年取后两位+月+日）
function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + month + day;
}

// 生成bmuser.lua文件并打包成补丁包（文件名格式：BM251007(UID).ZIP）
async function generateZipPackage(userId) {
  try {
    const zip = new JSZip();
    zip.file("ADD_TO_OBB/mods/bmuser.lua", `-- 用户码文件 - 自动生成\nreturn "${userId}"`);
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    const formattedDate = getFormattedDate();
    const zipFileName = `BM${formattedDate}(UID).ZIP`;
    
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('生成补丁包失败：', error);
    return false;
  }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 所有id均添加app-buid-前缀，与HTML对应
  const dataContainer = document.getElementById('app-buid-data-container');
  const generateBtn = document.getElementById('app-buid-generate-btn');
  const successNotice = document.getElementById('app-buid-success-notice');
  const errorMsg = document.getElementById('app-buid-error-msg');
  
  // 1. 提取并显示用户码
  const userId = getUserIdFromUrl();
  if (userId) {
    dataContainer.textContent = `用户码：${userId}`;
  } else {
    dataContainer.textContent = '错误：未从URL中获取到用户码';
    // 用class切换禁用样式，移除行内样式
    generateBtn.disabled = true;
    generateBtn.classList.remove('btn-default');
    generateBtn.classList.add('btn-disabled');
  }

  // 2. 生成按钮点击事件
  generateBtn.addEventListener('click', async () => {
    if (!userId) return;
    
    // 切换为加载中样式
    generateBtn.disabled = true;
    generateBtn.classList.remove('btn-default');
    generateBtn.classList.add('btn-loading');
    generateBtn.textContent = '正在生成...';
    errorMsg.style.display = 'none';

    // 生成补丁包
    const isSuccess = await generateZipPackage(userId);
    if (isSuccess) {
      successNotice.style.display = 'block';
      setTimeout(() => successNotice.style.display = 'none', 3000);
    } else {
      errorMsg.textContent = '补丁包生成失败，请刷新页面重试';
      errorMsg.style.display = 'block';
    }

    // 恢复默认样式
    generateBtn.classList.remove('btn-loading');
    generateBtn.classList.add('btn-default');
    generateBtn.textContent = '生成补丁包';
    generateBtn.disabled = false;
  });
});
