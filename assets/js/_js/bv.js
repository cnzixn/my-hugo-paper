document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-view-counter');
    if (!buttons.length) return;

    buttons.forEach(button => {
        const btnId = getButtonIdentifier(button);
        if (!btnId) return;

        // 找到对应的显示 span（通过类名）
        const displaySpan = document.querySelector(`.${btnId}-count`);
        if (!displaySpan) return;

        const pageUrl = normalizeUrl(window.location.href);
        const buttonHash = generateButtonHash(pageUrl + '_' + btnId);
        const siteIdentifier = window.location.hostname;

        // 初始化查询次数（不增加）
        fetch(`https://pv.bxq.me?site=${encodeURIComponent(siteIdentifier)}&page=${buttonHash}&mode=query&t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                displaySpan.textContent = (data.views || 0).toLocaleString();
            })
            .catch(err => console.warn('Error fetching button count:', err));

        // 点击事件：增加次数 + 60秒禁用 + 倒计时显示
        button.addEventListener('click', function() {
            disableButtonWithCountdown(button, 60);

            fetch(`https://pv.bxq.me?site=${encodeURIComponent(siteIdentifier)}&page=${buttonHash}&t=${Date.now()}`, { keepalive: true })
                .then(res => res.json())
                .then(data => {
                    displaySpan.textContent = (data.views || 0).toLocaleString();
                })
                .catch(err => console.error('Error updating button count:', err));
        });
    });

    // =================== 辅助函数 ===================

    function getButtonIdentifier(button) {
        return button.dataset.id || null;
    }

    function generateButtonHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16).padStart(5, '0').slice(-5);
    }

    function normalizeUrl(url) {
        try {
            const u = new URL(url, window.location.href);
            u.hash = '';
            ['utm_source','utm_medium','utm_campaign','fbclid','gclid'].forEach(p => u.searchParams.delete(p));
            let s = u.toString();
            if(s.endsWith('/') && !/^https?:\/\/[^/]+\/$/.test(s)) s = s.slice(0,-1);
            return s;
        } catch(e) { return window.location.href.split('#')[0]; }
    }

    function disableButtonWithCountdown(button, seconds) {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';

        const originalText = button.textContent;
        let remaining = seconds;

        const timer = setInterval(() => {
            button.textContent = `${originalText} (${remaining}s)`;
            remaining--;
            if (remaining < 0) {
                clearInterval(timer);
                button.textContent = originalText;
                button.disabled = false;
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
            }
        }, 1000);
    }
});