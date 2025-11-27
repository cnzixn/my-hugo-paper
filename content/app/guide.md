---
title: 'B.M.小卡片'
layout: 'aapp'
searchHidden: true
hideTitlt: true
weight: -250000
summary: '一组教学小卡片，引导新人学习安装模组。'
aliases:
- 'guide'
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

<!-- 任务1 -->
<div class="task-card active" id="task-1">
<h2>卡片1：开始</h2>
<div class="task-content">
　这是一组教学小卡片，教你如何安装模组。

　现在，是 AI 的时代，要学会使用它解决学习过程中的小问题：  

- _[豆包](https://doubao.com)_：回答问题快，推荐日常使用。  
- _[DeepSeek](https://deepseek.com)_：深度思考比较专业(慢)。  


</div>
<div class="task-nav">
  <button class="btn" onclick="jumpToTask(1)" disabled>上一步</button>
  <button class="btn" onclick="jumpToTask(2)">下一步</button>
</div>
</div>

<!-- 任务2 -->
<div class="task-card" id="task-2">
<h2>卡片2：获取安装包</h2>
<div class="task-content">
　你需要购买正版游戏，然后再提取安装包：
  <div class="btn-group">
   <button class="btn" onclick="window.open('https://apps.apple.com/us/app/dont-starve-shipwrecked/id1147297267?l=zh', '_blank')">苹果版</button>
   <button class="btn" onclick="window.open('https://play.google.com/store/apps/details?id=com.kleientertainment.doNotStarveShipwrecked', '_blank')">安卓版</button>
  </div>

　如果无法购买，你可以通过网盘下载：

  {{< pan 游戏 >}}  

  <small> **免责声明**：<br>　目前，国内“应用商店”未上架手游单机版，网盘分享仅供试玩。<br>　如果你不会“科学上网”，可以上 Steam 购买一份 DST 补票。</small>  
</div>
<div class="task-nav">
  <button class="btn" onclick="jumpToTask(1)">上一步</button>
  <button class="btn" onclick="jumpToTask(3)">下一步</button>
</div>
</div>

<!-- 任务3 -->
<div class="task-card" id="task-3">
<h2>卡片3：获取兔人框架</h2>
<div class="task-content">

　兔人框架`BM25.10.20.ZIP`，已适配 _[苹果1.84](https://apps.apple.com/us/app/dont-starve-shipwrecked/id1147297267?l=zh)_ 和 _[安卓1.33](https://play.google.com/store/apps/details?id=com.kleientertainment.doNotStarveShipwrecked)_ 版本。

  {{< pan "框架" >}}

　备注：文件`BM000(词库+壁纸)`是扩展内容，新人玩家不用了解。  
</div>
<div class="task-nav">
  <button class="btn" onclick="jumpToTask(2)">上一步</button>
  <button class="btn" onclick="jumpToTask(4)">下一步</button>
</div>
</div>

<!-- 任务4 -->
<div class="task-card" id="task-4">
<h2>卡片4：获取兔人模组</h2>
<div class="task-content">
　兔人模组`BMXXX.ZIP`，来源于创意工坊，由各位大佬移植，我们只是收集整理并分享：
  <div class="btn-group">
   <button class="btn" onclick="window.open('/mods', '_blank')">📋模组列表</button>
   <button class="btn" onclick="window.open('/search', '_blank')">🔍搜索模组</button>
  </div>
  
　如果你移植了“新的”模组，欢迎投稿：_[admin@bxq.me](mailto:admin@bxq.me)_
  
</div>
<div class="task-nav">
  <button class="btn" onclick="jumpToTask(3)">上一步</button>
  <button class="btn" onclick="jumpToTask(5)">下一步</button>
</div>
</div>

<!-- 任务5 -->
<div class="task-card" id="task-5">
<h2>卡片5：安装兔人框架/模组</h2>
<div class="task-content">
  工具：
  <div class="btn-group">
    <button class="btn" onclick="window.open('/app/imod', '_blank')">(通用)B.M.安装器</button>
    <button class="btn" onclick="window.open('https://mt2.cn', '_blank')">(安卓)MT管理器</button>
  </div>

  演示：  
  <small>(提示：视频暂停，可退出视频播放浮窗)</small>
  <div class="btn-group">
    <button class="btn" onclick="installMethod('auto')">(通用)B.M.安装器</button>
    <button class="btn" onclick="installMethod('manual')">(安卓)MT管理器</button>
  </div>
  <div id="install-guide-auto" style="margin-top:15px; display:none;">
    {{< video src="/img/lv_0_20250901210841.mp4" poster="/img/lv_0_20250901210841.webp" scale="90%" >}}  
  </div>
  <div id="install-guide-manual" style="margin-top:15px; display:none;">
    {{< video src="/img/lv_0_20250831182656.mp4" poster="/img/lv_0_20250831182656.webp" scale="90%" >}}  
  </div>

  <small>备注：若使用MT管理器，则需要使用 _[B.M.解密器](/app/xor)_ 处理`.XOR`的文件。</small>  
</div>
<div class="task-nav">
    <button class="btn" onclick="jumpToTask(4)">上一步</button>
    <button class="btn" onclick="jumpToTask(6)">下一步</button>
</div>
</div>

<!-- 任务6 -->
<div class="task-card" id="task-6">
<h2>卡片6：签名并安装</h2>
<div class="task-content">
　苹果：请自行搜索相关教程，关键词：自签、巨魔。

　安卓：MT管理器，长按安装包，点击选项中的“签名”。

  <p style="color:#2ecc71; font-size:16px; font-weight:bold;">　恭喜，已完成全部学习！</p>

</div>
<div class="task-nav">
  <button class="btn" onclick="jumpToTask(5)">上一步</button>
  <button class="btn" onclick="jumpToTask(1)" disabled>下一步</button>
</div>
</div>

</div>


<script>
// 全局变量
let currentTaskId = 1;
const totalTasks = 6;

// 初始化函数
function init() {
  // 显示第一个任务
  jumpToTask(1);
  // 更新进度条
  updateProgressBar();
}

// 核心跳转函数
function jumpToTask(targetId) {
  // 参数验证
  if (targetId < 1 || targetId > totalTasks) {
    console.error('无效的任务ID:', targetId);
    return;
  }

  // 隐藏所有任务
  document.querySelectorAll('.task-card').forEach(card => {
    card.classList.remove('active');
  });

  // 显示目标任务
  document.getElementById(`task-${targetId}`).classList.add('active');

  // 更新当前任务ID
  currentTaskId = targetId;

  // 更新进度条
  updateProgressBar();

  // 滚动到任务位置
  document.getElementById(`task-${targetId}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 更新进度条
function updateProgressBar() {
  const progressBar = document.getElementById('task-progress');
  const taskInfo = document.getElementById('current-task');
  
  // 计算进度百分比
  const progress = ((currentTaskId - 1) / (totalTasks - 1)) * 100;
  progressBar.style.width = `${progress}%`;
  taskInfo.textContent = `任务 ${currentTaskId}/${totalTasks}`;
}


// 初始化
init();
</script>

<style>

/* 基础重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

body {
  line-height: 1.7;
  background: var(--theme);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 标题 */
h1 {
  text-align: center; 
  margin-bottom: 16px; 
  color: var(--primary); /* 标题用主色 */
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
  border: 1px solid var(--tertiary);;
  border-radius: 6px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: none;
  height: 500px;
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
  overflow-y: auto; /* 仅允许垂直滚动 */
  overflow-x: hidden; /* 禁止水平滚动 */
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

/* 滚动条样式 - 隐藏式设计 */
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
  padding: 0.3rem 0.6rem;
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

.btn:hover {
  background: var(--tertiary);
}

/* 输入框 */
.input-field {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid var(--tertiary);
  border-radius: 4px;
  font-size: 0.875rem;
  margin: 0.75rem 0;
}

.input-field:focus {
  outline: none;
  border-color: var(--secondary);
}

/* 文件路径 */
.file-path {
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: var(--theme);
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.8125rem;
}

/* 任务导航（底部固定） */
.task-nav {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  gap: 1rem;
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
  transform: scale(0.8);
  transform-origin: top left;
  margin-bottom: -1rem;
  width: 125%; /* 因缩放导致容器变窄，宽度补偿为125%（1/0.8） */
}
</style>