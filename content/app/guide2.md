---
title: "B.M.小卡片2"
layout: "aapp"
searchHidden: true
appHidden: true
weight: 250000
summary: "一组教学小卡片，教你如何使用Shizuku。"
---

<h1>B.M.小卡片2</h1>

<!-- 进度条容器 -->
<div class="progress-container">
  <div class="progress-bar">
    <div class="progress-fill" id="task-progress"></div>
  </div>
</div>

<!-- 任务容器 -->
<div class="task-container">

<div class="task-card active" data-task>
  <h2>卡片<span class="card-number">1</span>：下载Shizuku</h2>
  <div class="task-content">
  
  从官网或网盘下载安装包：  

  Shizuku：[https://shizuku.rikka.app](https://shizuku.rikka.app/zh-hans/)  

  {{< pan "工具" >}}  


  <small>Tip：安卓用户，需要进行此流程授权，让 MT管理器 可以访问`Android/data`目录。</small>

  </div>
  <div class="task-nav">
    <button class="btn prev-btn" disabled>上一个</button>
    <button class="btn next-btn">下一个</button>
  </div>
</div>


<div class="task-card" data-task>
  <h2>卡片<span class="card-number">2</span>：开始配对</h2>
  <div class="task-content">

　安装并打开 Shizuku，手机连上任意Wifi(热点)，点击“配对”

{{< figure src="/img/Screenshot_20260111_01.webp" align=center attr="" link="" >}}

  </div>
  <div class="task-nav">
    <button class="btn prev-btn">上一个</button>
    <button class="btn next-btn">下一个</button>
  </div>
</div>

<div class="task-card" data-task>
  <h2>卡片<span class="card-number">2</span>：开始配对</h2>
  <div class="task-content">

　按照下面步骤操作即可，特别注意红字：打开无线调试的开关后，再点击“无线调试”这几个字。

  {{< figure src="/img/Screenshot_20260111_02.webp" align=center attr="" link="" >}}

  <small>Tip：手机没有开发者选项？开启流程：设置，关于本机，版本号(快速点击)。</small>

  </div>
  <div class="task-nav">
    <button class="btn prev-btn">上一个</button>
    <button class="btn next-btn">下一个</button>
  </div>
</div>

<div class="task-card" data-task>
  <h2>卡片<span class="card-number">2</span>：输入配对码</h2>
  <div class="task-content">

　在 Shizuku 的输入框输入配对码，点击右侧小飞机

{{< figure src="/img/Screenshot_20260111_03.webp" align=center attr="" link="" >}}

  </div>
  <div class="task-nav">
    <button class="btn prev-btn">上一个</button>
    <button class="btn next-btn">下一个</button>
  </div>
</div>

<div class="task-card" data-task>
  <h2>卡片<span class="card-number">2</span>：启动</h2>
  <div class="task-content">

　配对完成后，再次打开 Shizuku，点击“启动”

{{< figure src="/img/Screenshot_20260111_01.webp" align=center attr="" link="" >}}

  </div>
  <div class="task-nav">
    <button class="btn prev-btn">上一个</button>
    <button class="btn next-btn">下一个</button>
  </div>
</div>


<div class="task-card" data-task>
  <h2>卡片<span class="card-number">6</span>：授权</h2>
  <div class="task-content">
　
  打开 MT管理器 ，它就会提醒你授权，点击“始终允许”

{{< figure src="/img/Screenshot_20260111_04.webp" align=center attr="" link="" >}}

  </div>
  <div class="task-nav">
    <button class="btn prev-btn">上一个</button>
    <button class="btn next-btn" disabled>下一个</button>
  </div>
</div>


</div>

<script>
// 全局变量
// 全局变量
let currentTaskIndex = 0;
let taskCards = [];
let totalTasks = 0;

// 初始化函数（删了安卓卡片无效代码，直接适配现有所有卡片）
function init() {
  // 直接获取所有卡片，不用过滤，适配你现在的布局
  taskCards = Array.from(document.querySelectorAll('[data-task]'));
  totalTasks = taskCards.length;

  // 初始化卡片编号+ID，自动排序
  taskCards.forEach((card, index) => {
    card.querySelector('.card-number').textContent = index + 1;
    card.id = `task-${index + 1}`;
  });

  // 初始化显示+绑定按钮，必执行
  showTask(0);
  updateProgressBar();
  bindAllNavButtons();
}

// 切换卡片核心函数，确保激活样式生效
function showTask(index) {
  // 先清空所有激活态，再给当前卡片加active
  taskCards.forEach(card => card.classList.remove('active'));
  taskCards[index].classList.add('active');
  currentTaskIndex = index;
  // 切换后更新按钮禁用状态
  updateNavButtons();
  updateProgressBar();
  // 顺滑滚动到当前卡片
  taskCards[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 按钮点击事件只绑定1次，彻底解决点不动
function bindAllNavButtons() {
  taskCards.forEach((card, index) => {
    const prevBtn = card.querySelector('.prev-btn');
    const nextBtn = card.querySelector('.next-btn');
    // 绑定点击逻辑，直接对应索引，不跑偏
    prevBtn.onclick = () => {
      if(index > 0) showTask(index - 1);
    };
    nextBtn.onclick = () => {
      if(index < totalTasks - 1) showTask(index + 1);
    };
  });
}

// 只更新当前卡片的按钮禁用状态，精准不失效
function updateNavButtons() {
  const currCard = taskCards[currentTaskIndex];
  currCard.querySelector('.prev-btn').disabled = currentTaskIndex === 0;
  currCard.querySelector('.next-btn').disabled = currentTaskIndex === totalTasks - 1;
}

// 进度条跟随卡片切换，无报错
function updateProgressBar() {
  const bar = document.getElementById('task-progress');
  const progress = totalTasks > 1 ? (currentTaskIndex / (totalTasks - 1)) * 100 : 100;
  bar.style.width = `${progress}%`;
}

// 视频相关代码原样保留，不影响使用
let currentPlayingVideoId = null;
function stopAllVideos() {
  if (currentPlayingVideoId) {
    const oldVideo = document.getElementById(`video-${currentPlayingVideoId}`);
    const oldFloat = document.getElementById(`float-${currentPlayingVideoId}`);
    if (oldVideo) {oldVideo.pause();oldVideo.currentTime=0;}
    if (oldFloat) oldFloat.style.display='none';
    if (currentPlayingVideoId === 'install-guide-auto-video') {
      document.getElementById('install-guide-auto').style.display='none';
    } else {document.getElementById('install-guide-manual').style.display='none';}
    currentPlayingVideoId = null;
  }
}
function installMethod(type) {
  stopAllVideos();
  const guideAuto = document.getElementById('install-guide-auto');
  const guideManual = document.getElementById('install-guide-manual');
  const videoCustomId = type === 'auto' ? 'install-guide-auto-video' : 'install-guide-manual-video';
  if (type === 'auto') {guideAuto.style.display='block';guideManual.style.display='none';} 
  else {guideManual.style.display='block';guideAuto.style.display='none';}
  const videoEl = document.getElementById(`video-${videoCustomId}`);
  const floatEl = document.getElementById(`float-${videoCustomId}`);
  if (!videoEl || !floatEl) return;
  floatEl.style.display='block';
  currentPlayingVideoId = videoCustomId;
  videoEl.play().catch(err => alert('自动播放被阻止，请手动点击播放'));
  videoEl.onended = function() {
    floatEl.style.display='none';
    (type==='auto'?guideAuto:guideManual).style.display='none';
    currentPlayingVideoId=null;
  };
}
function triggerVideoPlay(customId) {
  installMethod(customId === 'install-guide-auto-video' ? 'auto' : 'manual');
}

// 初始化启动，必须最后执行
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

/* 卡片 */
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

.android-card{display:none;} /* 强制默认隐藏，关键修复 */

</style>

