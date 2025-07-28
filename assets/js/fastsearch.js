import * as params from '@params';

let fuse; // 搜索引擎实例
let resList = document.getElementById('searchResults');
let sInput = document.getElementById('searchInput');
let tagsList = document.getElementById('tagsList'); // 获取标签列表元素
let first, last, current_elem = null;
let resultsAvailable = false;
let searchInProgress = false; // 搜索进行中状态标志

// 显示搜索状态提示
function showSearchStatus(message) {
    // 移除现有的状态提示（如果有）
    const existingStatus = document.getElementById('searchStatus');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // 创建新的状态提示元素
    const statusElement = document.createElement('div');
    statusElement.id = 'searchStatus';
    statusElement.textContent = message;
    statusElement.style.marginTop = '8px';
    statusElement.style.color = '#666';
    statusElement.style.fontSize = '14px';
    
    // 将状态提示插入到搜索结果列表之前
    resList.parentNode.insertBefore(statusElement, resList);
}

// 加载搜索索引
window.onload = function () {
    // 初始化显示状态：隐藏结果，显示标签
    searchResults.style.display = 'none';
    tagsList.style.display = 'block';

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                if (data) {
                    // Fuse.js 配置项
                    let options = {
                        distance: 100,
                        threshold: 0.4,
                        ignoreLocation: true,
                        keys: [
                            'title',
                            'permalink',
                            'summary',
                            'content',
                            'tags'
                        ]
                    };
                    if (params.fuseOpts) {
                        options = {
                            isCaseSensitive: params.fuseOpts.iscasesensitive ?? false,
                            includeScore: params.fuseOpts.includescore ?? false,
                            includeMatches: params.fuseOpts.includematches ?? false,
                            minMatchCharLength: params.fuseOpts.minmatchcharlength ?? 1,
                            shouldSort: params.fuseOpts.shouldsort ?? true,
                            findAllMatches: params.fuseOpts.findallmatches ?? false,
                            keys: params.fuseOpts.keys ?? ['title', 'permalink', 'summary', 'content'],
                            location: params.fuseOpts.location ?? 0,
                            threshold: params.fuseOpts.threshold ?? 0.4,
                            distance: params.fuseOpts.distance ?? 100,
                            ignoreLocation: params.fuseOpts.ignorelocation ?? true
                        }
                    }
                    fuse = new Fuse(data, options); // 构建索引
                }
            } else {
                console.log(xhr.responseText);
            }
        }
    };
    xhr.open('GET', "../index.json");
    xhr.send();
    reset()
}

function activeToggle(ae) {
    // 使用更高效的方式移除所有focus类
    const focusElements = document.querySelectorAll('.focus');
    for (let i = 0; i < focusElements.length; i++) {
        focusElements[i].classList.remove("focus");
    }
    
    if (ae) {
        ae.focus();
        document.activeElement = current_elem = ae;
        // 直接操作父元素，避免多次查询DOM
        ae.parentElement.classList.add("focus");
    } else {
        if (document.activeElement && document.activeElement.parentElement) {
            document.activeElement.parentElement.classList.add("focus");
        }
    }
}

function reset() {
    resultsAvailable = false;
    resList.innerHTML = '';
    sInput.value = '';
    sInput.focus();
    // 重置当前元素引用
    current_elem = null;
    searchInProgress = false; // 重置搜索状态
    showSearchStatus('数据加载成功');
    // 重置显示状态：显示标签，隐藏结果
    tagsList.style.display = 'block';
    searchResults.style.display = 'none';
}

// 使用文档片段减少DOM操作
function createResultItem(item) {
    const li = document.createElement('li');
    li.className = 'post-entry';
    
    const header = document.createElement('header');
    header.className = 'entry-header';
    header.textContent = item.item.title + ' »';
    
    const a = document.createElement('a');
    a.href = item.item.permalink;
    a.setAttribute('aria-label', item.item.title);
    
    li.appendChild(header);
    li.appendChild(a);
    
    return li;
}

// 执行搜索的函数
function performSearch() {
    if (fuse && !searchInProgress) { // 确保没有正在进行的搜索
        searchInProgress = true; // 设置搜索状态为进行中
        
        // 清空上次搜索的结果
        resList.innerHTML = '';
        // 隐藏标签列表，显示搜索结果区域
        tagsList.style.display = 'none';
        searchResults.style.display = 'block';
        
        // 显示"搜索中..."提示
        showSearchStatus('搜索中...');
        
        // 使用setTimeout让UI有时间更新提示信息
        setTimeout(() => {
            let results;
            if (params.fuseOpts) {
                results = fuse.search(sInput.value.trim(), {limit: params.fuseOpts.limit});
            } else {
                results = fuse.search(sInput.value.trim());
            }
            
            if (results.length !== 0) {
                // 基于 permalink 去重，避免重复结果
                const uniqueResults = [];
                const seenPermalinks = new Set(); // 存储已出现的链接

                results.forEach(result => {
                    const permalink = result.item.permalink;
                    if (!seenPermalinks.has(permalink)) {
                        seenPermalinks.add(permalink);
                        uniqueResults.push(result);
                    }
                });

                // 使用文档片段减少DOM操作
                const fragment = document.createDocumentFragment();
                uniqueResults.forEach(item => {
                    fragment.appendChild(createResultItem(item));
                });

                resList.innerHTML = '';
                resList.appendChild(fragment);
                resultsAvailable = true;
                first = resList.firstChild;
                last = resList.lastChild;
                
                // 搜索完成，移除状态提示(如果有)
                const statusElement = document.getElementById('searchStatus');
                if (statusElement) {
                    statusElement.remove();
                }
                
            } else {
                resultsAvailable = false;
                // 没有找到结果时显示提示信息
                showSearchStatus('没有找到匹配的结果');
            }
            
            searchInProgress = false; // 重置搜索状态
        }, 50); // 短暂延迟确保UI更新
    } else if (searchInProgress) {
        // 如果已经在搜索中，显示提示
        showSearchStatus('正在搜索，请稍候...');
    }
}

// 监听输入事件，控制标签显示/隐藏
sInput.addEventListener('input', () => {
    if (sInput.value.trim() === '') {
        // 输入为空时显示标签，隐藏结果
        tagsList.style.display = 'block';
        searchResults.style.display = 'none';
    } else {
        // 有输入时隐藏标签，显示结果区域
        tagsList.style.display = 'none';
        searchResults.style.display = 'block';
        performSearch(); // 触发搜索
    }
});

// 回车键搜索
sInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // 防止重复触发
        performSearch();
    }
});

// 搜索框清空事件
sInput.addEventListener('search', function (e) {
    if (!this.value) reset();
});
