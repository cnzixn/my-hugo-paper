---
title: "B.M.小卡片"
layout: "aapp"
searchHidden: true
hideTitlt: true
weight: 250000
summary: "一组教学小卡片，教你如何安装模组。"
---

<h1>B.M.小卡片</h1>

<!-- 进度条容器 -->
<div class="progress-container">
  <div class="progress-bar">
    <div class="progress-fill" id="task-progress"></div>
  </div>
</div>

<!-- 任务容器 -->
<div class="task-container">

<div class="task-card active" data-task>
  <h2>卡片<span class="card-number">1</span>：开始</h2>
  <div class="task-content">
　这是一组教学小卡片，教你如何安装模组。

　现在是 AI 的时代，要学会使用 AI 解决一些小问题：  

　- _[豆包](https://doubao.com)_：回答问题快，推荐日常使用。  
　- _[DeepSeek](https://deepseek.com)_：深度思考比较专业(慢)。  

　

  </div>
  <div class="task-nav">
    <button class="btn prev-btn" disabled>上一个</button>
    <button class="btn next-btn">下一个</button>
  </div>
</div>


<div class="task-card" data-task>
  <h2>卡片<span class="card-number">2</span>：网盘&文件</h2>
  <div class="task-content">

　经常有反馈文件失效的，还有“在线解压”交智商税的，所以网盘分享：

　`.XZ` 是 ZIP 压缩文件(仅改名)，可直接用 _[MT管理器](https://mt2.cn)_ 打开。

　`.XOR` 是加密文件，通过 _[B.M.解密器](/app/xor)_ 可以还原为 ZIP 压缩文件。

　夸克浏览器：点击链接后，如果需要提取码，请更新一下版本再试。

  </div>
  <div class="task-nav">
    <button class="btn prev-btn">上一个</button>
    <button class="btn next-btn">下一个</button>
  </div>
</div>

<div class="task-card" data-task>
  <h2>卡片<span class="card-number">2</span>：获取安装包</h2>
  <div class="task-content">
　你需要购买正版游戏，然后提取安装包：
  <div class="btn-group">
   <button class="btn" onclick="window.open('https://apps.apple.com/us/app/dont-starve-shipwrecked/id1147297267?l=zh', '_blank')">苹果版</button>
   <button class="btn" onclick="window.open('https://play.google.com/store/apps/details?id=com.kleientertainment.doNotStarveShipwrecked', '_blank')">安卓版</button>
  </div>
  
  

　如果无法购买，你可以通过网盘下载试玩：

  {{< pan 游戏 >}}  

  <small> **免责声明**：<br> 目前，国内“应用商店”未上架手游单机版，网盘分享仅供试玩。<br> 如果你不会“科学上网”，可以上 Steam 购买一份 DST 补票。</small>  
  </div>
  <div class="task-nav">
    <button class="btn prev-btn">上一个</button>
    <button class="btn next-btn">下一个</button>
  </div>
</div>

<div class="task-card" data-task>
  <h2>卡片<span class="card-number">3</span>：获取兔人框架</h2>
  <div class="task-content">

　兔人框架 `BM25.10.20.ZIP` ，已适配 _[苹果1.84](https://apps.apple.com/us/app/dont-starve-shipwrecked/id1147297267?l=zh)_ 和 _[安卓1.33](https://play.google.com/store/apps/details?id=com.kleientertainment.doNotStarveShipwrecked)_ 版本。

  {{< pan "框架" >}}

  <small>备注：文件`BM000(词库+壁纸)`是扩展内容，新人玩家不用了解。</small>  
  </div>
  <div class="task-nav">
    <button class="btn prev-btn">上一个</button>
    <button class="btn next-btn">下一个</button>
  </div>
</div>

<div class="task-card" data-task>
  <h2>卡片<span class="card-number">4</span>：获取兔人模组</h2>
  <div class="task-content">

　兔人模组 `BMXXX.ZIP` ，来源于创意工坊，由各位大佬移植，我们只是收集整理并分享：
  <div class="btn-group">
   <button class="btn" onclick="window.open('/mods', '_blank')">📋模组列表</button>
   <button class="btn" onclick="window.open('/search', '_blank')">🔍搜索模组</button>
  </div>
  
　如果你有新的模组，欢迎投稿分享：_[admin@bxq.me](mailto:admin@bxq.me)_（请用网盘分享文件）。
      
  </div>
  <div class="task-nav">
    <button class="btn prev-btn">上一个</button>
    <button class="btn next-btn">下一个</button>
  </div>
</div>

<div class="task-card" data-task>
  <h2>卡片<span class="card-number">5</span>：安装兔人框架/模组</h2>
  <div class="task-content">
  根据需要，选择模组安装工具：
  <div class="btn-group">
    <button class="btn" onclick="window.open('/app/imod', '_blank')">🧰B.M.安装器</button>
    <button class="btn" onclick="window.open('https://mt2.cn', '_blank')">🧰MT管理器</button>
  </div>

  查看相应的视频演示：  
  <small>(Tip：拖动进度条到结尾，可直接退出播放)</small>
  <div class="btn-group">
    <button class="btn" onclick="installMethod('auto')">📽B.M.安装器</button>
    <button class="btn" onclick="installMethod('manual')">📽MT管理器</button>
  </div>
  <div id="install-guide-auto" style="margin-top:15px; display:none;">
    {{< video id="install-guide-auto-video" src="/img/lv_0_20250901210841.mp4" poster="/img/lv_0_20250901210841.webp" crop="true" cropHeight="85%" >}}  
  </div>
  <div id="install-guide-manual" style="margin-top:15px; display:none;">
    {{< video id="install-guide-manual-video" src="/img/lv_0_20250831182656.mp4" poster="/img/lv_0_20250831182656.webp" crop="true" cropHeight="75%" >}}  
  </div>

  <small>备注：使用(安卓)MT管理器，需通过 _[B.M.解密器](/app/xor)_ 处理`.XOR`的文件。</small>  
  </div>
  <div class="task-nav">
    <button class="btn prev-btn">上一个</button>
    <button class="btn next-btn">下一个</button>
  </div>
</div>

<div class="task-card" data-task>
  <h2>卡片<span class="card-number">6</span>：签名并安装</h2>
  <div class="task-content">
　苹果：请自行搜索相关教程，关键词：自签、巨魔。

　安卓：MT管理器，长按安装包，点击选项中的“签名”。

  <p style="color:#2ecc71; font-size:16px; font-weight:bold;"> 恭喜，已完成全部学习！</p>
  </div>
  <div class="task-nav">
    <button class="btn prev-btn">上一个</button>
    <button class="btn next-btn" disabled>下一个</button>
  </div>
</div>

</div>

<script>
// 全局变量
let currentTaskIndex = 0; // 当前卡片索引（从0开始）
let taskCards = []; // 存储所有卡片元素
let totalTasks = 0; // 总卡片数

// 初始化函数
function init() {
  // 获取所有卡片并排序
  taskCards = Array.from(document.querySelectorAll('[data-task]'));
  totalTasks = taskCards.length;

  // 初始化卡片编号和ID
  taskCards.forEach((card, index) => {
    // 设置卡片编号
    card.querySelector('.card-number').textContent = index + 1;
    // 设置唯一ID（可选，用于锚点等）
    card.id = `task-${index + 1}`;
  });

  // 显示第一个卡片
  showTask(0);
  // 更新进度条
  updateProgressBar();
}

// 显示指定索引的卡片
function showTask(index) {
  // 隐藏所有卡片
  taskCards.forEach(card => card.classList.remove('active'));
  // 显示目标卡片
  taskCards[index].classList.add('active');
  // 更新当前索引
  currentTaskIndex = index;
  // 更新导航按钮状态
  updateNavButtons();
  // 更新进度条
  updateProgressBar();
  // 滚动到当前卡片
  taskCards[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 更新导航按钮状态
function updateNavButtons() {
  // 获取所有导航按钮并更新状态
  taskCards.forEach((card, index) => {
    const prevBtn = card.querySelector('.prev-btn');
    const nextBtn = card.querySelector('.next-btn');

    // 第一个卡片禁用上一个
    prevBtn.disabled = index === 0;
    // 最后一个卡片禁用下一个
    nextBtn.disabled = index === totalTasks - 1;

    // 绑定按钮点击事件
    prevBtn.onclick = () => showTask(index - 1);
    nextBtn.onclick = () => showTask(index + 1);
  });
}

// 更新进度条
function updateProgressBar() {
  const progressBar = document.getElementById('task-progress');
  // 计算进度百分比
  const progress = ((currentTaskIndex) / (totalTasks - 1)) * 100;
  progressBar.style.width = `${progress}%`;
}

let currentPlayingVideoId = null;
 // 停止所有视频+隐藏浮窗
 function stopAllVideos() {
   if (currentPlayingVideoId) {
     const oldVideo = document.getElementById(`video-${currentPlayingVideoId}`);
     const oldFloat = document.getElementById(`float-${currentPlayingVideoId}`);
     if (oldVideo) {
       oldVideo.pause();
       oldVideo.currentTime = 0;
       oldVideo.onpause = null;
       oldVideo.onended = null;
     }
     if (oldFloat) oldFloat.style.display = 'none';
     // 隐藏旧视频的父容器
     if (currentPlayingVideoId === 'install-guide-auto-video') {
       document.getElementById('install-guide-auto').style.display = 'none';
     } else {
       document.getElementById('install-guide-manual').style.display = 'none';
     }
     currentPlayingVideoId = null;
   }
 }
 function installMethod(type) {
   stopAllVideos(); // 先停旧视频
   const guideAuto = document.getElementById('install-guide-auto');
   const guideManual = document.getElementById('install-guide-manual');
   const videoCustomId = type === 'auto' ? 'install-guide-auto-video' : 'install-guide-manual-video';
   const videoElId = `video-${videoCustomId}`;
   const floatElId = `float-${videoCustomId}`;
   // 显示当前视频的父容器（关键修复！），但设置height:0隐藏封面
   if (type === 'auto') {
     guideAuto.style.display = 'block';
     guideManual.style.display = 'none';
   } else {
     guideManual.style.display = 'block';
     guideAuto.style.display = 'none';
   }
   // 获取元素并播放
   const videoEl = document.getElementById(videoElId);
   const floatEl = document.getElementById(floatElId);
   if (!videoEl || !floatEl) {
     console.log('元素未找到：', videoElId, floatElId);
     return;
   }
   // 强制显示浮窗（双重保障）
   floatEl.style.display = 'block';
   currentPlayingVideoId = videoCustomId;
   // 播放视频
   videoEl.play().catch(err => {
     alert('自动播放被浏览器阻止，请点击视频内播放按钮');
     console.log('播放失败：', err);
   });
   videoEl.onended = function() {
     floatEl.style.display = 'none';
     if (type === 'auto') guideAuto.style.display = 'none';
     else guideManual.style.display = 'none';
     currentPlayingVideoId = null;
   };
 }
 // 覆盖模板函数
 function triggerVideoPlay(customId) {
   installMethod(customId === 'install-guide-auto-video' ? 'auto' : 'manual');
 }

// 初始化
init();
</script>

<style>

/* 标题 */
h1 {
  text-align: center;
  margin-bottom: 16px;
  color: var(--primary);
}

/* 进度条 */
.progress-container {
  max-width: 100%;
  margin: 0 0 1.5rem;
}

.progress-bar {
  height: 6px;
  background: var(--tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--secondary);
  transition: width 0.3s ease;
}

/* 任务卡片 */
.task-container {
  max-width: 100%;
}

.task-card {
  background: var(--theme);
  border: 1px solid var(--tertiary);
  border-radius: 6px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: none;
  height: 600px;
  flex-direction: column;
  overflow: hidden;
}

.task-card.active {
  display: flex;
}

.task-card h2 {
  color: var(--secondary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem;
  border-left: 3px solid var(--secondary);
  padding-left: 0.75rem;
}

/* 任务内容（可滚动） */
.task-content {
  flex: 1;
  font-size: 0.985rem;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
}

.task-content ul, .task-content ol {
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.task-content p {
  margin: 0.75rem 0;
}

/* 滚动条样式 */
.task-content::-webkit-scrollbar {
  width: 1.5px;
}

.task-content::-webkit-scrollbar-track {
  border-radius: 2px;
  border: 0.6px solid var(--border);
  background-color: var(--secondary);
}

.task-content::-webkit-scrollbar-thumb {
  border-radius: 3px;
}

.task-content::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}

/* 按钮组 */
.btn-group {
  margin: 1rem 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 0.75rem;
}

/* 按钮基础样式 */
.btn {
  padding: 0.3rem 1.8rem;
  border-radius: 4px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn {
  background: var(--secondary);
  color: var(--theme);
}

.btn:hover:not(:disabled) {
  background: var(--tertiary);
}

.btn:disabled {
  background: var(--tertiary);
  cursor: not-allowed;
  opacity: 0.7;
}


/* 任务导航 */
.task-nav {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  gap: 0.75rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .task-card {
    height: 420px;
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin: 1.5rem 0 1rem;
  }
}

/* 网盘卡片 */
.pan-actions {
  transform: scale(90%);
  transform-origin: top left;
  margin-bottom: -0.5rem;
}
</style>
