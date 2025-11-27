---
date: '2025-02-28T12:50:06Z'
title: '壁纸 - 制作教程'
author: 'Bny'
summary: '本文介绍如何新增壁纸文件，需要安装 BM000 模组。'
tags:
- '资料'
aliases:
- 'wallpaper'
comments: false
url: '/p/810/'
---



### 主界面

左下角，新增两个按钮，用于切换壁纸。
![图片](/img/P4fBhA3wmieFr7R.webp)

---

### 下载壁纸

> 用这个下载壁纸：[[王者荣耀壁纸]](https://pvp.qq.com/web201605/wallpaper.shtml)

选一个喜欢的壁纸，选择 1920*1080 ，我下载的是虞姬，命名为“yuji.png”。(图片可能需要根据手机屏幕比例剪裁一下，否则会有拉伸变形)  

原图
![图片](/img/v4MHC3xUAr8FyWt.webp)

游戏内壁纸预览  
![图片](/img/tBLPGvNRxAsuQlq.webp)

---

### 贴图转换

> 用这个制作贴图：[[饥荒动画工具]](https://dont-starve-anim-tool.pages.dev/src/TexTool/)  

将下载的壁纸图片转换为“游戏贴图”，这里保存为“yuji.xml”和“yuji.tex”。
![图片](/img/mB69v8zgZonOEkG.webp)

---

### 文件目录

``` shell
BM000  
├─ wallpaper     # 壁纸  
│      ├─ ...  
│      ├─ yuji.xml    # 自制静态壁纸  
│      ├─ yuji.tex     # 自制静态壁纸  
│      ├─ dst_menu_meta5.zip  
│      ├─ bg_loading_loading_charlie.xml  
│      └─ bg_loading_loading_charlie.tex  
├─ scripts  
│  └─ wallpaper.lua  # 配置文件  
```

---

### 配置文件

``` lua
-- scripts/wallpaper.lua

local wallpaper = {

	{ anim="wallpaper/dst_menu_meta5.zip", build="dst_menu_meta5", bank="dst_menu_meta5", fn=function(anim) anim:SetPosition(75, 0) anim:SetScale(0.85) anim:GetAnimState():Hide("winter") end }, -- 温蒂小恶魔沃尔特(隐藏冬季特效)

	{ atlas="wallpaper/bg_loading_loading_charlie.xml", image="loading_charlie.tex" },

	{ atlas="wallpaper/yuji.xml", image="yuji.tex" }, -- 自制静态壁纸

}

return wallpaper

```

---


### 动态壁纸

动态壁纸，需要制作动画，代码可以参考官方的。(自行搜索教程)

``` lua
-- scripts/screens/redux/multiplayermainscreen.lua
-- 25.02.28，联机版的主页动画，官方代码片段：

local function MakeMeta5Banner(self, banner_root, anim)
    anim:GetAnimState():SetBuild("dst_menu_meta5")
    anim:GetAnimState():SetBank("dst_menu_meta5")
    anim:GetAnimState():PlayAnimation("loop", true)
    anim:SetScale(.667)
    anim:SetPosition(75, 50)

    if not IsSpecialEventActive(SPECIAL_EVENTS.WINTERS_FEAST) then
        anim:GetAnimState():Hide("winter")
    end
end


```

---


