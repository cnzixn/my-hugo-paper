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

<!-- 1. 引入IP属地JS -->
<script src="https://c.bxq.me/js/ipsd.js"></script>
<!-- 2. FP5指纹库 -->
<script src="https://openfpcdn.io/fingerprintjs/v5/iife.min.js"></script>

<script>
/** MD5计算 */
async function computeMD5(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuf = await crypto.subtle.digest('MD5', data);
    return Array.from(new Uint8Array(hashBuf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// 固定加盐（防彩虹表，可自行修改）
const SALT = "WebFp@2026LocKey";

async function getFingerprint(){
    // 1.获取指纹
    const fp = await FingerprintJS.load();
    const resFp = await fp.get();
    const fpId = resFp.visitorId;

    // 2.调用ipsd内置方法拿省份
    let province = '';
    try{
        province = await getProvince();
    }catch(e){
        province = "unknown";
    }

    // 核心拼接规则：省份+指纹+盐
    const rawSource = `${province}|${fpId}|${SALT}`;
    const md5Val = await computeMD5(rawSource);
    const deviceId = 'web_' + md5Val;

    // 页面回填
    document.getElementById('fpId').innerText = fpId;
    document.getElementById('provTxt').innerText = province;
    document.getElementById('rawStr').innerText = rawSource;
    document.getElementById('deviceId').innerText = deviceId;

    console.log('省份:', province);
    console.log('完整位置信息:', await getLocationInfo?.()??'无详细数据');
}

// 初始化执行
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
