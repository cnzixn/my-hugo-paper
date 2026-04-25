---
title: 'B.M.剪贴板'
layout: 'aapp'
searchHidden: true
appHidden: true # 自定义实现，App列表隐藏
weight: 250009
summary: '通过访问链接将[数据]导出，方便复制使用。'
---

<h1>B.M.剪贴板</h1>

<!-- 文件列表区域 -->
<div class="file-info" id="app-copy-data-container" style="white-space: normal; max-height: 380px; overflow-y: auto;">
请选择文件以加载列表...
</div>

<div class="section">
<button id="selectFileBtn">选择文件（可多选）</button>
<!-- <input type="file" id="fileInput" style="display: none;" multiple> -->

<input type="file" id="fileInput" multiple style="display: none;" />

<!-- 全选反选 -->
<div style="text-align: center; margin: 10px 0;">
	<label style="margin-right:10px;"><input type="checkbox" id="checkAll"> 全选</label>
	<label><input type="checkbox" id="invertCheck"> 反选</label>
</div>

<button id="app-copy-copy-btn">复制选中文件信息</button>

<div class="copied-notice" id="app-copy-copied-notice">
	已复制到剪贴板！
</div>

<div class="error" id="app-copy-error-msg"></div>
</div>

<style>
	h1 {
		text-align: center;
		margin-bottom: 30px;
	}
	.reminder{
		margin-bottom: 30px;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 3px;
	}
	.drop-zone {
		border: 2px dashed #aaa;
		padding: 20px;
		text-align: center;
		margin: 10px 0;
		cursor: pointer;
		border-radius: 3px;
	}
	.drop-zone.drag-over {
		border-color: #666;
	}
	.section button {
		border-radius: 8px;
		padding: 10px;
		margin: 10px auto;
		cursor: pointer;
		display: block;
		width: 220px;
		background-color: #4CAF50;
		color: white;
		border: none;
		font-weight: bold;
	}
	.section button:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 8px #666;
	}
	#app-copy-data-container {
		margin: 10px 0;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 3px;
		font-family: monospace;
	}
	.progress-container {
		margin: 10px 0;
		display: none;
	}
	.progress-bar {
		height: 5px;
		border: 1px solid #666;
		border-radius: 3px;
		overflow: hidden;
	}
	.progress-fill {
		height: 100%;
		width: 0%;
		transition: width 0.3s;
		background-color: #4cd964;
	}
	#app-copy-error-msg {
		color: red;
		margin: 10px 0;
		display: none;
		text-align: center;
	}
	.file-list {
		margin: 10px 0;
		max-height: 200px;
		overflow-y: auto;
		border: 1px solid #ddd;
		border-radius: 3px;
		padding: 10px;
	}
	.file-item {
		display: flex;
		align-items: center;
		padding: 6px 10px;
		border-bottom: 1px solid #eee;
	}
	.file-item:last-child {
		border-bottom: none;
	}
	.file-item input {
		margin-right: 10px;
	}
	.file-item .name {
		flex: 1;
		word-break: break-all;
	}
	.file-item .size {
		color: #666;
		white-space: nowrap;
	}

	#app-copy-copied-notice {
		display: none;
		position: fixed;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		background-color: #4CAF50;
		color: white;
		padding: 10px 20px;
		border-radius: 5px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.2);
		z-index: 1000;
		animation: fadeOut 2s forwards;
	}
	@keyframes fadeOut {
		0% { opacity: 1; }
		70% { opacity: 1; }
		100% { opacity: 0; visibility: hidden; }
	}
</style>

<script>
document.addEventListener('DOMContentLoaded', function () {
	const container = document.getElementById('app-copy-data-container');
	const fileInput = document.getElementById('fileInput');
	const selectFileBtn = document.getElementById('selectFileBtn');
	const copyBtn = document.getElementById('app-copy-copy-btn');
	const copiedNotice = document.getElementById('app-copy-copied-notice');
	const errorMsg = document.getElementById('app-copy-error-msg');
	const checkAll = document.getElementById('checkAll');
	const invertCheck = document.getElementById('invertCheck');

	let allFiles = [];

	// 选择文件
	selectFileBtn.addEventListener('click', () => {
		fileInput.click();
	});

	fileInput.addEventListener('change', (e) => {
		allFiles = Array.from(e.target.files);
		if (allFiles.length === 0) return;
		renderFileList(allFiles);
		hideError();
	});

	// 渲染列表
	function renderFileList(files) {
		container.innerHTML = '';
		files.forEach((file, index) => {
			const item = document.createElement('div');
			item.className = 'file-item';

			const cb = document.createElement('input');
			cb.type = 'checkbox';
			cb.className = 'file-check';
			cb.dataset.index = index;
			cb.checked = true;

			const name = document.createElement('div');
			name.className = 'name';
			name.textContent = file.name;

			const size = document.createElement('div');
			size.className = 'size';
			size.textContent = formatSize(file.size);

			item.appendChild(cb);
			item.appendChild(name);
			item.appendChild(size);
			container.appendChild(item);
		});
	}

	// 格式化文件大小
	function formatSize(bytes) {
		if (bytes < 1024) return bytes + ' B';
		else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
		else if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB';
		else return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
	}

	// 全选
	checkAll.addEventListener('change', () => {
		document.querySelectorAll('.file-check').forEach(cb => {
			cb.checked = checkAll.checked;
		});
	});

	// 反选
	invertCheck.addEventListener('change', () => {
		document.querySelectorAll('.file-check').forEach(cb => {
			cb.checked = !cb.checked;
		});
	});

	// 复制选中信息
	copyBtn.addEventListener('click', async () => {
		const checks = document.querySelectorAll('.file-check:checked');
		if (checks.length === 0) {
			showError('请至少选择一个文件');
			return;
		}

		let text = '选中文件信息：\n';
		checks.forEach(cb => {
			const f = allFiles[cb.dataset.index];
			text += `${f.name}  ${formatSize(f.size)}\n`;
		});

		try {
			await navigator.clipboard.writeText(text.trim());
			copiedNotice.style.display = 'block';
			setTimeout(() => {
				copiedNotice.style.display = 'none';
			}, 2000);
			hideError();
		} catch (err) {
			showError('复制失败，请手动复制');
		}
	});

	function showError(text) {
		errorMsg.textContent = text;
		errorMsg.style.display = 'block';
	}

	function hideError() {
		errorMsg.style.display = 'none';
	}
});
</script>
