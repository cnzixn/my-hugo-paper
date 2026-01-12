---
title: '兔人框架交流区（试运行）'
layout: 'aapp'
searchHidden: true
appHidden: true
weight: 250009
summary: 'KOOK服务器邀请卡片'
---

<!DOCTYPE html>
<html lang="zh">
<head>
 <meta charset="utf-8"/>
 <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0"/>
 <style>
  #kook-invite-card {
   width: 90%;
   max-width: 500px;
   margin: 50px auto;
   border-radius: 12px;
   padding: 2rem 1.5rem;
   text-align: center;
   box-shadow: 0 4px 12px var(--tertiary);
  }
  .inviter-info {
    margin-bottom: 1.5rem;
    text-align: center; /* 容器强制居中 */
  }
  .inviter-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin: 0 auto 0.5rem;
    object-fit: cover;
    display: block !important; /* 强制块级 必居中 */
  }
  .inviter-nickname {
    font-size: 1rem;
    color: var(--text-primary, #333);
    margin-bottom: 0.1rem;
  }
  .invite-desc {
    font-size: 0.9rem;
    color: var(--text-muted, #666);
  }
  .kook-avatar {
   width: 80px;
   height: 80px;
   border-radius: 16px;
   margin: 0 auto 1rem !important; /* 强制margin居中 */
   object-fit: cover;
   display: block !important; /* 强制块级 优先级拉满 */
   text-align: center;
  }
  .kook-name {
   font-size: 1.5rem;
   font-weight: 600;
   margin-bottom: 1rem;
  }
  .kook-btn {
   width: 100%;
   padding: 1rem;
   border-radius: 8px;
   background: var(--secondary);
   color: var(--theme);
   font-size: 1.1rem;
   cursor: pointer;
   transition: opacity 0.2s;
   border: none;
  }
  .kook-btn:hover {
   opacity: 0.9;
  }
  .kook-btn:disabled {
   background: #ccc;
   cursor: not-allowed;
   opacity: 1;
  }
  .tip-text {
    font-size: 0.9rem;
    color: #666;
    margin-top: 1rem;
    line-height: 1.5;
  }
  .server-status {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin: 1rem 0 2rem;
    font-size: 0.9rem;
    color: var(--text-muted, #666);
  }
  .status-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success, #4caf50);
  }
  .loading {
    display: none !important;
  }
 </style>
</head>
<body>
 <div id="kook-invite-card">
  <div class="loading" id="loading">加载服务器信息中...</div>
  <div id="content">
    <div class="inviter-info">
      <!-- <img src="https://img.kookapp.cn/attachments/2026-01/02/UStFEC5n2W0dw0dw.jpeg?x-oss-process=style/icon" class="inviter-avatar" id="inviterAvatar" alt="邀请人头像"> -->
      <span class="inviter-nickname" id="inviterNickname">我家狗不咬人</span>
      <span class="invite-desc">邀请你加入</span>
    </div>
    <!-- 你的本地头像+双兜底 -->
    <img src="/img/ic_launcher.webp" class="kook-avatar" id="serverAvatar" alt="服务器头像" onerror="this.src='/img/ic_launcher.webp'">
    <h2 class="kook-name" id="serverName">兔人框架交流区</h2>
    <div class="server-status">
      <div class="status-item"><span class="status-dot"></span><span id="onlineCount">0人在线</span></div>
      <!-- <div class="status-item"><span class="status-dot"></span><span id="memberCount">0成员</span></div> -->
    </div>
    <button class="kook-btn" id="acceptBtn">接受邀请</button>
    <p class="tip-text" id="jumpTip" style="display:none;">未能打开KOOK?<br>3秒后进入下载页面</p>
  </div>
 </div>

 <script>
  const API_URL = "https://bot.bxq.me/api/guild-widget";
  const DOWNLOAD_URL = "https://kookapp.cn";
  let COPY_URL = "https://kook.vip/DCWH7f";
  let KOOK_SCHEME = "kook://join?guild_id=12345678912345";
  let countdownTimer = null;

  // 后台静默加载 不影响显示
  async function fetchApiData() {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(API_URL, {
        headers: {'Accept': 'application/json'},
        signal: controller.signal
      });
      
      if (!response.ok) {
        console.error('API响应状态异常:', response.status);
        return;
      }
      
      const result = await response.json();
      
      // 检查API返回的格式 - 你的数据在 result.data 中
      if(!result || result.code !== 0 || !result.data) {
        console.error('API返回数据格式错误:', result);
        return;
      }
      
      const data = result.data;
      
      // 更新邀请链接变量
      COPY_URL = data.invite_link || COPY_URL;
      KOOK_SCHEME = `kook://join?guild_id=${data.open_id || 9879308311606777}`;
      
      // 更新邀请者信息
      const inviterAvatar = document.getElementById('inviterAvatar');
      const inviterNickname = document.getElementById('inviterNickname');
      
      // 查找特定昵称的邀请者（根据你的需求）
      const targetInviter = data.members?.find(m => m.nickname === "我家狗不咬人") || data.members?.[0];
      
      if(targetInviter && inviterAvatar) {
        inviterAvatar.src = targetInviter.avatar;
        inviterAvatar.alt = targetInviter.nickname;
      }
      
      if(targetInviter && inviterNickname) {
        inviterNickname.textContent = targetInviter.nickname;
      }
      
      // 更新服务器头像和名称
      const serverAvatar = document.getElementById('serverAvatar');
      const serverName = document.getElementById('serverName');
      
      if(data.icon && serverAvatar) {
        serverAvatar.src = data.icon;
        serverAvatar.onerror = function() {
          this.src = '/img/ic_launcher.webp';
        };
      }
      
      if(data.name && serverName) {
        serverName.textContent = data.name;
      }
      
      // 更新在线人数和成员数
      const onlineCount = document.getElementById('onlineCount');
      
      if(data.online_count) {
        // online_count 返回的是字符串，确保显示正确
        onlineCount.textContent = `${data.online_count}人在线`;
      }
      
      console.log('API数据加载成功:', data);
      
    } catch (err) {
      console.error('API请求失败:', err);
      // 可以在这里添加降级显示
      if(err.name === 'AbortError') {
        console.warn('API请求超时，使用默认数据');
      }
    }
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(COPY_URL);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = COPY_URL;
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  document.getElementById('acceptBtn').addEventListener('click', () => {
   const btn = document.getElementById('acceptBtn');
   const tip = document.getElementById('jumpTip');
   btn.disabled = true;
   btn.innerText = '已复制邀请链接';
   tip.style.display = 'block';
   copyUrl();
   window.location.href = KOOK_SCHEME;
   
   let sec = 3;
   countdownTimer = setInterval(() => {
     sec--;
     if(sec <= 0) clearInterval(countdownTimer);
     tip.innerHTML = `未能打开KOOK?<br>${sec}秒后进入下载页面`;
   }, 1000);

   setTimeout(() => {
     window.location.href = DOWNLOAD_URL;
     clearInterval(countdownTimer);
     btn.disabled = false;
     btn.innerText = '接受邀请';
     tip.style.display = 'none';
     tip.innerHTML = '未能打开KOOK?<br>3秒后进入下载页面';
   }, 3000);
  });

  window.onload = fetchApiData;
 </script>
</body>
</html>
