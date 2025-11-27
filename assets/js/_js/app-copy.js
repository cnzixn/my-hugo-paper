// 测试按钮点击事件（id添加前缀：app-copy-test-btn）
document.getElementById('app-copy-test-btn').addEventListener('click', function() {
    // 替换为你的指定网址（例如带测试数据的链接）
    const testUrl = '/app/copy?data=这是测试数据，用于验证功能';
    // 跳转到指定网址
    window.location.href = testUrl;
});

document.addEventListener('DOMContentLoaded', function() {
    // 1. 获取URL中的data参数
    const getUrlParam = () => {
        try {
            const params = new URLSearchParams(window.location.search);
            return params.get('data') || '';
        } catch (e) {
            console.error('解析URL参数失败:', e);
            return '';
        }
    };

    // 2. 显示获取的数据（id添加前缀：app-copy-data-container、app-copy-error-msg）
    const dataContainer = document.getElementById('app-copy-data-container');
    const errorMsg = document.getElementById('app-copy-error-msg');
    const data = getUrlParam();
    
    if (data) {
        dataContainer.textContent = data;
    } else {
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'URL中未找到data参数，请确保URL格式正确';
        dataContainer.textContent = '无数据';
    }

    // 3. 复制功能实现（id添加前缀：app-copy-copy-btn、app-copy-copied-notice）
    const copyButton = document.getElementById('app-copy-copy-btn');
    const copiedNotice = document.getElementById('app-copy-copied-notice');
    
    copyButton.addEventListener('click', async () => {
        if (!data) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = '无数据可复制';
            return;
        }

        try {
            // 使用Clipboard API复制文本
            await navigator.clipboard.writeText(data);
            
            // 显示复制成功提示
            copiedNotice.style.display = 'block';
            setTimeout(() => {
                copiedNotice.style.display = 'none';
            }, 2000);
            
        } catch (err) {
            console.error('复制失败:', err);
            errorMsg.style.display = 'block';
            errorMsg.textContent = `复制失败: ${err.message || '请手动复制'}`;
            
            // 降级方案：创建临时textarea进行复制
            const textArea = document.createElement('textarea');
            textArea.value = data;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                copiedNotice.textContent = '已使用兼容方式复制';
                copiedNotice.style.display = 'block';
                setTimeout(() => {
                    copiedNotice.style.display = 'none';
                }, 2000);
            } catch (copyErr) {
                console.error('兼容复制失败:', copyErr);
            } finally {
                document.body.removeChild(textArea);
            }
        }
    });

    // 4. 如果数据较长，添加自动滚动条（关联的id已添加前缀）
    if (data.length > 100) {
        dataContainer.style.whiteSpace = 'pre-wrap';
        dataContainer.style.overflowY = 'auto';
        dataContainer.style.maxHeight = '300px';
    }
});
