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
  /* 仅卡片相关样式，无多余代码 */
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
   /* 三重保障强制居中 */
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
  }
  .kook-btn:hover {
   opacity: 0.9;
  }
  /* 复制提示 */
  .copied-toast {
   position: fixed;
   top: 20px;
   left: 50%;
   transform: translateX(-50%);
   padding: 0.8rem 1.5rem;
   border-radius: 6px;
   font-size: 0.9rem;
   z-index: 9999;
   display: none;
   animation: fade 2s forwards;
  }
  @keyframes fade {
   0% { opacity: 0; }
   10% { opacity: 1; }
   90% { opacity: 1; }
   100% { opacity: 0; }
  }
 </style>
</head>
<body>
 <div id="kook-invite-card">
  <img src="/img/ic_launcher.webp" class="kook-avatar" alt="服务器头像">
  <h2 class="kook-name">兔人框架交流区（试运行）</h2>
  <button class="kook-btn" id="acceptBtn">接受邀请</button>
 </div>

 <!-- <div class="copied-toast" id="copiedToast">已复制服务器链接</div> -->

 <script>
  // 核心配置
  const COPY_URL = "https://kook.vip/DCWH7f";
  const KOOK_SCHEME = "kook://join?guild_id=DCWH7f";
  const DOWNLOAD_URL = "https://kookapp.cn";

  const acceptBtn = document.getElementById('acceptBtn');
  // const copiedToast = document.getElementById('copiedToast');

  // 复制链接函数
  function copyUrl() {
   const textarea = document.createElement('textarea');
   textarea.value = COPY_URL;
   textarea.style.position = 'absolute';
   textarea.style.left = '-9999px';
   document.body.appendChild(textarea);
   textarea.select();
   document.execCommand('copy');
   document.body.removeChild(textarea);
   
   // copiedToast.style.display = 'block';
   // setTimeout(() => copiedToast.style.display = 'none', 2000);
  }

  // 按钮点击事件
  acceptBtn.addEventListener('click', () => {
   copyUrl();
   window.location.href = KOOK_SCHEME;
   setTimeout(() => window.location.href = DOWNLOAD_URL, 3000);
  });
 </script>
</body>
</html>
