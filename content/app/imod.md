---
title: 'B.M.安装器'
layout: 'aapp'
searchHidden: true
hideTitlt: true
weight: 250001
summary: '支持安装BM框架/BM模组/BM补丁/自制模组。'
---

<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->
<!-- <head> -->
<!-- <meta charset="UTF-8" /> -->
<!-- <meta name="viewport" content="width=device-width,initial-scale=1" /> -->
<!-- <title>模组安装器（安卓/苹果自动识别）</title> -->
<style>
  body { 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC","Hiragino Sans GB","Microsoft YaHei", sans-serif;  
    line-height: 1.6; 
    color: var(--content); /* 适配文本主色 */
  }
  h1 { 
    text-align: center; 
    margin-bottom: 16px; 
    color: var(--primary); /* 标题用主色 */
  }
  .note { color: var(--secondary); } /* 次要文本色 */
  .section { 
    margin: 20px 0 28px; 
    padding: 20px; 
    border: 1px solid var(--border); /* 统一边框色 */
    border-radius: var(--radius); /* 复用全局圆角 */
    background: var(--entry); /* 卡片背景色 */
  }
  .drop-zone { 
    border: 2px dashed var(--tertiary); /*  tertiary色做虚线边框 */
    padding: 20px; 
    text-align: center; 
    margin: 10px 0; 
    cursor: pointer; 
    border-radius: var(--radius); 
    transition: .2s; 
  }
  .drop-zone.drag-over { border-color: var(--secondary); } /* 拖拽时用次要色 */
  .section button { 
    border-radius: 10px; 
    padding: 10px; 
    margin: 10px auto; 
    cursor: pointer; 
    display: block; 
    width: 220px; 
    background-color: var(--secondary); /* 按钮用次要色 */
    color: var(--theme); /* 按钮文字用主题色（亮模式白/暗模式深灰） */
    border: 0; 
    font-size: 16px; 
    transition: .2s; /* 优化过渡效果 */
  }
  .section button:hover { 
    transform: translateY(-1px); 
    box-shadow: 0 2px 8px var(--secondary); /* 阴影色与按钮色一致 */
    opacity: 0.9; /* 增加hover透明度变化 */
  }
  .file-info, .file-list { 
    margin: 10px 0; 
    padding: 10px; 
    border: 1px solid var(--border); 
    border-radius: var(--radius); 
    background: var(--theme); /* 用主题色做背景 */
  }
  .file-info, .file-list { white-space: nowrap; overflow-x: auto; }
  .file-item { 
    padding: 6px 4px; 
    border-bottom: 1px solid var(--border); /* 统一分割线 */
  }
  .file-item:last-child { border-bottom: none; }
  .progress-container { margin: 12px 0; display: none; }
  .progress-bar { 
    height: 6px; 
    border: 1px solid var(--secondary); /* 进度条边框用次要色 */
    border-radius: 6px; 
    overflow: hidden; 
  }
  .progress-fill { 
    height: 100%; 
    width: 0%; 
    transition: width 0.3s; 
    background-color: #4cd964; /* 保留原有成功绿（通用且醒目） */
  }
  .error { 
    color: #d00; /* 保留错误红（警示色无需适配） */
    margin: 10px 0; 
    display: none; 
  }
  small strong { color: var(--primary); } /* 强调文本用主色 */
  .pill { 
    display:inline-block; 
    padding:2px 8px; 
    border-radius:999px; 
    border:1px solid var(--border); 
    margin-left:8px; 
    font-size:12px; 
    color: var(--secondary); /* 标签用次要色 */
  }
  .muted { color: var(--secondary); } /* 弱化文本用次要色 */
    /* 自定义 Safari 提示弹窗样式 */
  .safari-alert {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--theme);
    border: 2px solid #d00;
    border-radius: var(--radius);
    padding: 30px 25px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 9999;
    text-align: center;
    display: none; /* 默认隐藏 */
  }
  .safari-alert h3 {
    color: #d00;
    margin: 0 0 15px 0;
    font-size: 18px;
  }
  .safari-alert p {
    margin: 0 0 20px 0;
    line-height: 1.8;
    color: var(--content);
  }
  .safari-alert .btn {
    background: var(--secondary);
    color: var(--theme);
    border: none;
    padding: 10px 25px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: .2s;
  }
  .safari-alert .btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  /* 遮罩层 */
  .alert-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    z-index: 9998;
    display: none; /* 默认隐藏 */
  }
</style>

<!-- </head> -->
<!-- <body> -->



<h1>B.M.安装器</h1>
<!-- <span class="pill">自动识别 APK / IPA</span> -->

<div class="section">
<h2 style="color: red; margin: 15px 0; font-size: 18px;">暂不提供服务，iOS框架测试结束！</h2>
</div>

