---
title: "指纹"
layout: 'aapp'
searchHidden: true
appHidden: true
url: "/fingerprint"
---

<title>设备指纹稳定性测试</title>

<div class="box">
    <h2>设备指纹｜IP属地+FP混合DeviceID算法</h2>
    <div class="item">
        <label>FingerprintJS原生visitorId：</label>
        <div class="hash" id="fpId">加载中...</div>
    </div>
    <div class="item">
        <label>IP解析省份：</label>
        <div class="hash" id="provTxt">加载中...</div>
    </div>
    <div class="item">
        <label>MD5原始拼接串：</label>
        <div class="hash" id="rawStr" style="font-size:12px;">加载中...</div>
    </div>
    <div class="item">
        <label>最终 Web DeviceId：</label>
        <div class="hash" id="deviceId">加载中...</div>
    </div>
    <button class="btn" onclick="getFingerprint()">重新生成ID</button>
    <p class="tip">算法：省份 + FP指纹 + 固定盐 → MD5 → web_xxxx</p>
</div>

<script src="https://c.bxq.me/js/ipsd.js/1.0.0/ipsd.min.js"></script>
<script src="https://openfpcdn.io/fingerprintjs/v5/iife.min.js"></script>
<!-- 备用MD5，解决http环境WebCrypto不可用 -->
<script src="https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js"></script>

<script>
const SALT = "WebFp@2026LocKey";

// 统一MD5，兼容http/https全环境
function computeMD5(str) {
    return md5(str);
}

// 包装ipsd同步方法为Promise，加3秒超时，防止卡死
function getProvinceAsync() {
    return new Promise((resolve) => {
        // 超时兜底
        const timer = setTimeout(() => resolve('unknown'), 3000);
        try {
            // ipsd是同步返回，非await
            const p = getProvince();
            clearTimeout(timer);
            resolve(p || 'unknown');
        } catch (err) {
            clearTimeout(timer);
            resolve('unknown');
        }
    });
}
function getLocAsync() {
    return new Promise(res => {
        setTimeout(()=>{
            try{res(getLocationInfo()||{})}catch{res({})}
        },3000)
    })
}

async function getFingerprint(){
    // 并行获取
    const [fpLoader, province] = await Promise.all([
        FingerprintJS.load(),
        getProvinceAsync()
    ])
    const resFp = await fpLoader.get();
    const fpId = resFp.visitorId;

    const rawSource = `${province}|${fpId}|${SALT}`;
    const md5Val = computeMD5(rawSource);
    const deviceId = 'web_' + md5Val;

    // 回填DOM
    document.getElementById('fpId').innerText = fpId;
    document.getElementById('provTxt').innerText = province;
    document.getElementById('rawStr').innerText = rawSource;
    document.getElementById('deviceId').innerText = deviceId;

    const loc = await getLocAsync();
    console.log('省份:', province);
    console.log('完整位置信息:', loc);
}

// 页面初始化
getFingerprint();
</script>

<style>
  *{margin:0;padding:0;box-sizing:border-box;font-family:system-ui,sans-serif;}
  body{padding:30px;background:#f5f7fa;color:#333;}
  .box{max-width:800px;margin:0 auto;background:#fff;padding:25px;border-radius:12px;box-shadow:0 2px 12px #0001;}
  h2{margin-bottom:20px;color:#222;}
  .item{margin:15px 0;}
  label{display:block;margin-bottom:6px;font-weight:500;}
  .hash{word-break:break-all;padding:12px;background:#f1f3f6;border-radius:6px;font-family:monospace;}
  .btn{padding:10px 20px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:15px;}
  .btn:hover{background:#1d4ed8;}
  .tip{margin-top:10px;color:#666;font-size:14px;}
</style>
