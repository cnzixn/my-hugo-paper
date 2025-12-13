---
title: 'CDK管理系统'
layout: 'aapp'
searchHidden: true
appHidden: true
weight: 250011
summary: 'CDK统一管理系统，包含生成、查看、删除功能'
---

<h1>CDK管理系统</h1>

<div class="reminder">
 <small class="note">
  管理员功能：<br>
  1. 生成新的CDK兑换码<br>
  2. 查看CDK列表和状态<br>
  3. 删除CDK<br>
 </small>
</div>

<div class="cdk-admin-container">
<!-- 登录表单 -->
<div id="loginSection" class="section login-section">
<h2>管理员登录</h2>
<div class="form-group">
<label for="username">用户名</label>
<input type="text" id="username" class="form-input" value="admin">
</div>
<div class="form-group">
<label for="password">密码</label>
<input type="text" id="password" class="form-input" value="admin123">
</div>
<div class="button-group">
<button class="search-btn" onclick="login()">登录</button>
</div>
<div id="loginResult" class="result hidden"></div>
</div>

<!-- 管理功能区域 -->
<div id="adminSection" class="hidden">
<!-- 标签导航 -->
<div class="tab-navigation">
<button class="tab-btn active" data-tab="generate">生成CDK</button>
<button class="tab-btn" data-tab="list">CDK列表</button>
</div>

<!-- 生成CDK区域 -->
<div class="tab-content active" id="generate-tab">
<div class="section">
<h2>生成新CDK</h2>

<div class="form-group">
<label for="cdk-count">生成数量:</label>
<input type="number" id="cdk-count" class="form-input" value="10" min="1" max="1000">
</div>

<div class="button-group">
<button class="generate-btn" id="generate-cdk-btn" onclick="generateCDK()">生成CDK</button>
<button class="clear-btn" id="clear-generate-btn" onclick="clearGenerateResult()">清空</button>
</div>

<div class="generated-result" id="generated-result-container">
<h3>生成结果：</h3>
<div id="generateResult"></div>
</div>
</div>
</div>

<!-- CDK列表区域 -->
<div class="tab-content" id="list-tab">
<div class="section">
<h2>CDK列表</h2>

<div class="list-controls">
<button class="refresh-btn" id="refresh-list-btn" onclick="listCDK()">刷新列表</button>
</div>

<div class="list-container" id="cdk-list-container">
加载中...
</div>
</div>
</div>
</div>
</div>

<style>
/* 保持原剪贴板风格 */
h1, h2 {
text-align: center;
margin-bottom: 20px;
}

.reminder {
margin-bottom: 30px;
padding: 20px;
border: 1px solid #ddd;
border-radius: 3px;
}

.cdk-admin-container {
max-width: 1200px;
margin: 0 auto;
}

/* 标签导航 */
.tab-navigation {
display: flex;
border-bottom: 2px solid #ddd;
margin-bottom: 20px;
}

.tab-btn {
padding: 12px 24px;
border: none;
background: none;
cursor: pointer;
font-size: 16px;
font-weight: bold;
color: #666;
position: relative;
}

.tab-btn.active {
color: #2196F3;
}

.tab-btn.active::after {
content: '';
position: absolute;
bottom: -2px;
left: 0;
right: 0;
height: 2px;
background-color: #2196F3;
}

.tab-btn:hover:not(.active) {
background-color: #f5f5f5;
}

/* 标签内容 */
.tab-content {
display: none;
}

.tab-content.active {
display: block;
}

/* 通用样式 */
.section {
background: white;
border: 1px solid #ddd;
border-radius: 3px;
padding: 20px;
}

.form-group {
margin-bottom: 15px;
}

.form-group.inline {
display: inline-block;
margin-right: 15px;
margin-bottom: 0;
}

.form-group label {
display: block;
margin-bottom: 5px;
font-weight: bold;
}

.form-input {
width: 100%;
padding: 8px 10px;
border: 1px solid #ddd;
border-radius: 3px;
font-size: 14px;
box-sizing: border-box;
}

.form-input.small {
width: 80px;
}

.form-select {
padding: 8px 10px;
border: 1px solid #ddd;
border-radius: 3px;
font-size: 14px;
background: white;
}

.button-group {
display: flex;
gap: 10px;
margin: 20px 0;
}

button {
border-radius: 8px;
padding: 10px 20px;
cursor: pointer;
border: none;
font-weight: bold;
font-size: 14px;
}

button:hover {
transform: translateY(-1px);
box-shadow: 0 2px 8px #666;
}

.generate-btn {
background-color: #4CAF50;
color: white;
}

.clear-btn {
background-color: #f44336;
color: white;
}

.refresh-btn {
background-color: #2196F3;
color: white;
}

.search-btn {
background-color: #2196F3;
color: white;
}

.ban-btn {
background-color: #f44336;
color: white;
}

.unban-btn {
background-color: #4CAF50;
color: white;
}

.copy-btn {
background-color: #2196F3;
color: white;
}

.delete-btn {
background-color: #f44336;
color: white;
}

.generated-result {
margin: 20px 0;
padding: 15px;
border: 1px solid #ddd;
border-radius: 3px;
background-color: #f8f9fa;
display: none;
}

.generated-result.show {
display: block;
}

.list-controls {
margin-bottom: 20px;
padding-bottom: 20px;
border-bottom: 1px solid #eee;
}

.list-container {
min-height: 200px;
}

.cdk-list {
overflow-x: auto;
}

.cdk-item {
padding: 10px;
border-bottom: 1px solid #eee;
}

.cdk-item:last-child {
border-bottom: none;
}

.cdk-item:hover {
background-color: #f5f5f5;
}

.cdk-code {
font-family: monospace;
font-weight: bold;
color: #333;
}

.cdk-days {
color: #2196F3;
font-size: 0.9em;
}

.cdk-status {
display: inline-block;
padding: 2px 8px;
border-radius: 3px;
font-size: 0.8em;
font-weight: bold;
}

.status-active {
background-color: #e8f5e8;
color: #2e7d32;
}

.status-used {
background-color: #ffebee;
color: #c62828;
}

.status-expired {
background-color: #fff3e0;
color: #ef6c00;
}

.cdk-actions {
margin-top: 5px;
}

.action-btn {
padding: 3px 8px;
font-size: 12px;
margin-right: 5px;
border-radius: 4px;
cursor: pointer;
}

.pagination {
display: flex;
justify-content: center;
gap: 5px;
margin-top: 20px;
}

.pagination button {
padding: 5px 10px;
border: 1px solid #ddd;
background: white;
color: #333;
}

.pagination button.active {
background-color: #2196F3;
color: white;
border-color: #2196F3;
}

.pagination button:hover:not(.active) {
background-color: #f5f5f5;
}

.empty-state {
text-align: center;
padding: 40px 20px;
color: #666;
}

.account-info {
margin: 20px 0;
padding: 15px;
border: 1px solid #ddd;
border-radius: 3px;
background-color: #f8f9fa;
min-height: 100px;
}

.account-info.error {
border-color: #f44336;
background-color: #ffebee;
color: #c62828;
}

.account-info.success {
border-color: #4CAF50;
background-color: #e8f5e8;
color: #2e7d32;
}

/* 登录表单样式 */
.login-section {
max-width: 400px;
margin: 50px auto;
}

.result {
margin-top: 15px;
padding: 10px;
border-radius: 3px;
}

.result.success {
background-color: #e8f5e8;
border: 1px solid #4CAF50;
color: #2e7d32;
}

.result.error {
background-color: #ffebee;
border: 1px solid #f44336;
color: #c62828;
}

.hidden {
display: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
.tab-navigation {
flex-wrap: wrap;
}

.tab-btn {
flex: 1;
min-width: 120px;
text-align: center;
}

.form-group.inline {
display: block;
margin-right: 0;
margin-bottom: 10px;
}

.list-controls {
display: block;
}
}
</style>

<script>
let apiUrl = 'https://ck.bxq.me'; // 请替换为你的API地址
let authHeader = '';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
// 标签页切换
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
btn.addEventListener('click', function() {
const tab = this.getAttribute('data-tab');

// 移除所有活跃状态
document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

// 添加当前活跃状态
this.classList.add('active');
document.getElementById(`${tab}-tab`).classList.add('active');
});
});
});

// 登录功能
function login() {
const username = document.getElementById('username').value;
const password = document.getElementById('password').value;
const resultDiv = document.getElementById('loginResult');

// 简单的基本认证
authHeader = `Basic ${btoa(`${username}:${password}`)}`;

// 测试登录是否成功
fetch(`${apiUrl}/api/admin/list`, {
method: 'GET',
headers: {
'Authorization': authHeader,
'Content-Type': 'application/json'
}
})
.then(response => {
if (response.ok) {
document.getElementById('loginSection').classList.add('hidden');
document.getElementById('adminSection').classList.remove('hidden');
resultDiv.textContent = '';
resultDiv.classList.add('hidden');

// 自动查询CDK列表
listCDK();
} else {
resultDiv.textContent = '登录失败，请检查用户名和密码';
resultDiv.classList.remove('hidden');
resultDiv.classList.remove('success');
resultDiv.classList.add('error');
}
})
.catch(error => {
resultDiv.textContent = '登录失败：' + error.message;
resultDiv.classList.remove('hidden');
resultDiv.classList.remove('success');
resultDiv.classList.add('error');
});
}

// 生成CDK
function generateCDK() {
const count = document.getElementById('cdk-count').value;
const resultContainer = document.getElementById('generated-result-container');
const resultDiv = document.getElementById('generateResult');

fetch(`${apiUrl}/api/admin/generate`, {
method: 'POST',
headers: {
'Authorization': authHeader,
'Content-Type': 'application/json'
},
body: JSON.stringify({ count: parseInt(count) })
})
.then(response => response.json())
.then(data => {
if (data.success) {
// 显示生成结果
let resultHtml = `<p>成功生成 ${data.count} 个CDK：</p>`;
resultHtml += '<div style="margin: 10px 0;">';
data.cdks.forEach(cdk => {
resultHtml += `<div class="cdk-item">
<span class="cdk-code">${cdk.code}</span>
<span class="cdk-status status-active">未绑定</span>
<div class="cdk-actions">
<button class="action-btn copy-btn" onclick="copyToClipboard('${cdk.code}')">复制</button>
<button class="action-btn delete-btn" onclick="deleteCDKByCode('${cdk.code}')">删除</button>
</div>
</div>`;
});
resultHtml += '</div>';

resultDiv.innerHTML = resultHtml;
resultContainer.classList.add('show');

// 刷新CDK列表
listCDK();
} else {
resultDiv.innerHTML = `<div class="account-info error">生成失败：${data.error}</div>`;
resultContainer.classList.add('show');
}
})
.catch(error => {
resultDiv.innerHTML = `<div class="account-info error">生成失败：${error.message}</div>`;
resultContainer.classList.add('show');
});
}

// 清空生成结果
function clearGenerateResult() {
document.getElementById('generated-result-container').classList.remove('show');
document.getElementById('generateResult').innerHTML = '';
}

// 查询CDK列表
function listCDK() {
const container = document.getElementById('cdk-list-container');

fetch(`${apiUrl}/api/admin/list`, {
method: 'GET',
headers: {
'Authorization': authHeader,
'Content-Type': 'application/json'
}
})
.then(response => response.json())
.then(data => {
if (data.success) {
if (data.cdks.length === 0) {
container.innerHTML = '<div class="empty-state">暂无CDK数据</div>';
return;
}

// 生成CDK列表
let listHtml = '<div class="cdk-list">';
data.cdks.forEach(cdk => {
const statusClass = cdk.uid ? 'status-used' : 'status-active';
const statusText = cdk.uid ? '已绑定' : '未绑定';

listHtml += `<div class="cdk-item">
<div>
<span class="cdk-code">${cdk.code}</span>
<span class="cdk-status ${statusClass}">${statusText}</span>
</div>
<div style="margin: 5px 0;">
<strong>绑定UID:</strong> ${cdk.uid || '未绑定'}
</div>
<div style="font-size: 0.8em; color: #666;">
<strong>创建时间:</strong> ${new Date(cdk.createdAt).toLocaleString()}
${cdk.boundAt ? `<br><strong>绑定时间:</strong> ${new Date(cdk.boundAt).toLocaleString()}` : ''}
</div>
<div class="cdk-actions">
<button class="action-btn copy-btn" onclick="copyToClipboard('${cdk.code}')">复制</button>
<button class="action-btn delete-btn" onclick="deleteCDKByCode('${cdk.code}')">删除</button>
</div>
</div>`;
});
listHtml += '</div>';

container.innerHTML = listHtml;
} else {
container.innerHTML = `<div class="account-info error">查询失败：${data.error}</div>`;
}
})
.catch(error => {
container.innerHTML = `<div class="account-info error">查询失败：${error.message}</div>`;
});
}

// 删除CDK
function deleteCDKByCode(cdk) {
if (confirm(`确定要删除CDK ${cdk} 吗？`)) {
fetch(`${apiUrl}/api/admin/delete`, {
method: 'POST',
headers: {
'Authorization': authHeader,
'Content-Type': 'application/json'
},
body: JSON.stringify({ cdk: cdk })
})
.then(response => response.json())
.then(data => {
if (data.success) {
// 刷新CDK列表
listCDK();
} else {
alert('删除失败：' + data.error);
}
})
.catch(error => {
alert('删除失败：' + error.message);
});
}
}

// 复制到剪贴板
function copyToClipboard(text) {
navigator.clipboard.writeText(text).then(() => {
alert('CDK已复制到剪贴板');
}).catch(err => {
console.error('复制失败：', err);
alert('复制失败，请手动复制');
});
}
</script>