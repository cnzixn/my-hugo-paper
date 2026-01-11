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
  .kook-avatar {
   width: 80px;
   height: 80px;
   border-radius: 16px;
   display: block;
   margin: 0 auto 1.5rem;
   position: relative;
   left: 50%;
   transform: translateX(-50%);
   object-fit: cover;
  }
  .kook-name {
   font-size: 1.5rem;
   font-weight: 600;
   margin-bottom: 2rem;
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
 </style>
</head>
<body>
 <div id="kook-invite-card">
  <img src="/img/ic_launcher.webp" class="kook-avatar" alt="服务器头像">
  <h2 class="kook-name">兔人框架交流区（试运行）</h2>
  <button class="kook-btn" id="acceptBtn">接受邀请</button>
  <p class="tip-text" id="jumpTip" style="display:none;">未能打开KOOK?<br>3秒后进入下载页面</p>
 </div>

 <script>
  const COPY_URL = "https://kook.vip/DCWH7f";
  const KOOK_SCHEME = "kook://join?guild_id=DCWH7f";
  const DOWNLOAD_URL = "https://kookapp.cn";

  const acceptBtn = document.getElementById('acceptBtn');
  const jumpTip = document.getElementById('jumpTip');
  let countdownTimer = null;

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

  acceptBtn.addEventListener('click', () => {
   acceptBtn.disabled = true;
   acceptBtn.innerText = '已复制邀请链接';
   jumpTip.style.display = 'block';
   copyUrl();
   window.location.href = KOOK_SCHEME;
   
   let sec = 3;
   countdownTimer = setInterval(() => {
     sec--;
     if(sec <= 0){
       clearInterval(countdownTimer);
     }
     jumpTip.innerText = `未能打开KOOK?\n${sec}秒后进入下载页面`;
   },1000);

   setTimeout(() => {
     window.location.href = DOWNLOAD_URL;
     clearInterval(countdownTimer);
     acceptBtn.disabled = false;
     acceptBtn.innerText = '接受邀请';
     jumpTip.style.display = 'none';
     jumpTip.innerText = '未能打开KOOK?\n3秒后进入下载页面';
   }, 3000);
  });
 </script>
</body>
</html>
