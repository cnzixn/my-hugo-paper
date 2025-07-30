document.addEventListener('DOMContentLoaded', function() {
    // 获取所有浏览量计数元素
    const counters = document.querySelectorAll('.page-view-counter');
    
    // 如果没有计数器则退出
    if (!counters.length) return;
    
    // 为每个计数器创建请求
    counters.forEach(counter => {
        const displaySpan = counter.querySelector('.view-count');
        if (!displaySpan) return;
        
        // 初始化显示为0
        displaySpan.textContent = '0';
        
        // 获取当前文章URL（从最近的<a>链接获取）
        let pageUrl = getArticleUrl(counter);
        
        // 规范化URL
        pageUrl = normalizeUrl(pageUrl);
        
        // 生成5位哈希值（符合后端要求）
        const pageHash = generatePageHash(pageUrl);
        
        // 站点标识（使用当前域名）
        const siteIdentifier = window.location.hostname;
        
        // 发送请求到Worker（添加时间戳防止缓存）
        fetch(`https://pv.bxq.me?site=${encodeURIComponent(siteIdentifier)}&page=${pageHash}&t=${Date.now()}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                // 格式化数字显示（如1,000）
                displaySpan.textContent = data.views.toLocaleString();
            })
            .catch(error => {
                console.error('Error fetching view count:', error);
                displaySpan.textContent = '0'; // 出错时显示0
            });
    });
    
    // 获取文章URL的函数（保持不变）
    function getArticleUrl(element) {
        // 尝试从最近的容器获取文章链接
        const container = element.closest('article') || 
                         element.closest('.post') || 
                         element.closest('.list-item') || 
                         element.closest('li');
        
        if (container) {
            const link = container.querySelector('a[href]');
            if (link) {
                return link.href;
            }
        }
        
        // 默认使用当前页面URL
        return window.location.href;
    }
    
    // URL规范化函数（保持不变）
    function normalizeUrl(url) {
        // 移除可能的锚点部分
        url = url.split('#')[0];
        
        // 规范化URL（移除末尾斜杠）
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        
        // 移除查询参数中的跟踪标记
        try {
            const urlObj = new URL(url);
            ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'].forEach(param => {
                urlObj.searchParams.delete(param);
            });
            url = urlObj.toString();
        } catch (e) {
            console.warn('URL normalization error', e);
        }
        
        return url;
    }
    
    // 生成5位哈希值（适配后端要求）
    function generatePageHash(url) {
        // 使用简单高效的哈希算法生成5位十六进制值
        let hash = 0;
        for (let i = 0; i < url.length; i++) {
            hash = (hash << 5) - hash + url.charCodeAt(i);
            hash |= 0; // 转换为32位整数
        }
        
        // 确保哈希值为5位十六进制
        return Math.abs(hash).toString(16).padStart(5, '0').slice(-5);
    }
});