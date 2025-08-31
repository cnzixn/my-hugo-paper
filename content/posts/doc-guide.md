---
title: '教程 - 新人指引'
date: 2025-01-20
weight: -9
author: 'Bny'
summary: '此文章为新人教学，包含下载文件、安装框架&模组等内容。'
tags:
- '资料'
aliases:
- 'guide'
comments: false
url: '/p/159/'
---

--- 

## 前言

　现在，是 AI 的时代，要学会使用 AI 解决问题。作为一个普通人，你遇到的那点小麻烦，随便问问“人工智障”就能解决。

- [<i class="bi bi-link-45deg">豆包</i>](https://doubao.com)：回答问题快，推荐日常使用。
- [<i class="bi bi-link-45deg">DeepSeek</i>](https://deepseek.com)：深度思考比较专业(慢)。

- - -

## 教程

{{< details summary="点击查看，教程用到的文件：" openByDefault="true" >}}  
  - <small>MT管理器.APK</small>  
  - <small>BM25.08.20(1.33.5).APK</small>  
  - <small>BM25.09.01.ZIP.XZ</small>  
  - <small>BM000.ZIP.XZ</small>  
  - <small>BM001.ZIP.XZ</small>  
  - <small>BM002.ZIP.XZ</small>  
  - <small>BM003.ZIP.XZ</small>  
  - <small>BM004.ZIP.XZ</small>  
  - <small>BM005.ZIP.XZ</small>  
  - <small>BM035.ZIP.XZ</small>  
{{< /details >}}  

<br>

苹果：请通过 [B.M.安装器](/app/imod/) 安装模组。

安卓：{{< video src="/img/lv_0_20250831174843.mp4" scale="68%" >}}
<!-- {{"{{< bili BV1k8UFYAEjq >}}"}} -->

- - -

## 工具

> 一款功能强大的文件管理软件。  

　文件后缀 `.XZ` 可以删掉，只是为了防止“在线解压”导致文件被和谐。  

**官方网站**: [<i class="bi bi-link-45deg">点击下载</i>](https://mt2.cn)  
{{< pan 工具 >}}  

- - -

## 游戏

> Shipwrecked 是 Klei 和 CAPY Games 联合开发的一款 DLC 扩展包。  

**AppStore**: [<i class="bi bi-link-45deg">付费购买</i>](https://apps.apple.com/us/app/dont-starve-shipwrecked/id1147297267?l=zh)  
**Play商店**: [<i class="bi bi-link-45deg">付费购买</i>](https://play.google.com/store/apps/details?id=com.kleientertainment.doNotStarveShipwrecked)  
{{< pan 游戏 >}}  

<small> **免责**：<br>　目前“国区”无法购买正版手游(单机版)，网盘分享只是提供一个“干净”的版本。<br>　我们尊重版权，请大家去 AppStore 、Play商店 购买正版(可能需要“海外”账号)。如果你不会“科学上网”，可以上 Steam 或 Wegame 购买一份 DST 补票。</small>  


- - -

## 框架

> 框架已适配饥荒 [<i class="bi bi-android2">1.33</i>](https://play.google.com/store/apps/details?id=com.kleientertainment.doNotStarveShipwrecked) 和 [<i class="bi bi-apple">1.84</i>](https://apps.apple.com/us/app/dont-starve-shipwrecked/id1147297267?l=zh)。  

{{< pan "框架" >}}

<br>

{{< details summary="点击查看文件说明" openByDefault="true" >}}

    -- 文件说明，建议从上到下依次安装：
    BM25.09.01.ZIP.XZ     -- (必须)兔人框架
    BM000.ZIP.XZ          -- (推荐)兔人框架-测试包
    BM000.词库.ZIP.XZ     -- (可选)兔人测试包-词库
    BM000.壁纸.ZIP.XZ     -- (可选)兔人测试包-壁纸
    
    后缀 `.XZ` 可以删掉，只是为了防止“在线解压”导致文件被和谐。
{{< /details >}}

- - -

## 模组

> 由大佬从“创意工坊”移植而来。  

　请 [<i class="bi bi-link-45deg">搜索</i>](/search) 你想玩的模组，进入相应页面下载文件。  

　(大佬自制的)未收录的其他模组，需要按照 `_bmmods.lua` 文件里的说明进行添加。  

<!-- {{'  {{<pan"模组">}}  '}} -->

{{< details summary="点击查看 mods/_bmmods.lua" openByDefault="true" >}}  

    -- BM_NO_ENCODE
    
    -- 作者：樂不思蜀	时间：2025.09.01
    
    -- 1. 此文件必须改名为 bmmods.lua 才会生效
    -- 2. 模组名不能用 BM 开头（比如BMXXX），会被屏蔽
    
    -- 【如何找到正确的模组文件夹？】
    -- 解压后可能出现“套娃”（比如A文件夹里还有A文件夹）
    -- 正确的模组文件夹里，一定能看到 modinfo.lua 文件
    
    -- 【添加模组步骤】
    -- 第一步：把正确的模组文件夹，放到 mods 文件夹里
    -- 第二步：记下这个模组文件夹的名字（比如“战斗增强”）
    -- 第三步：按下面的格式添加模组名（二选一即可）
    
    -- 【开发者用】
    -- Set("樂不思蜀")   -- 添加模组，并强制启用
    -- Add("新辅助合集") -- 添加模组
    
    -- 【新手用】格式："模组名，模组名，模组名，..."
    return "用逗号分隔，樂不思蜀，新辅助合集，DST-TMI，"  -- 这是最后一行，下面不能有代码！！！
    
{{< /details >}}

    



- - -

## 网盘

{{< details summary="点击查看下载目录" openByDefault="true" >}}
    夸克网盘：
    /sdcard/download/QuarkDownloads/

    百度网盘：
    /sdcard/Download/BaiduNetdisk/
{{< /details >}}


{{< details summary="临时使用，推荐“百度网盘 SVIP”" openByDefault="true" >}}
- `⚠️警告` 虚拟产品交易，谨防上当受骗！  
- `1元/天` 闲鱼搜“百度网盘”，随便选销量多的卖家(自动发货)。  
{{< /details >}}


{{< details summary="长期使用，推荐“夸克网盘 88VIP”" openByDefault="true" >}}
- `⚠️警告` 虚拟产品交易，谨防上当受骗！  
- `0元/年` 淘宝开通88VIP，闲鱼39卖掉“年费-视频权益”，49卖掉“年费-音乐权益”，一共回血88元。  
- `10元/年` 闲鱼搜“夸克88VIP”，推荐选择24小时内发布的商品。  

![88vip下载速度](/img/1000205033.jpg)
{{< /details >}}


- - -



