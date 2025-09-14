---
title: '存档 - Android'
date: 2025-02-01
author: 'Bny'
summary: '本文介绍 Android 如何导入、导出存档文件。'
tags:
- '资料'
aliases:
- 'slots'
comments: false
url: '/p/808/'
---


### 〇、设置存档目录  
存档默认保存在“内部”，建议设置为“外部”，设置后请“修复存档”、“导出存档”。  

卸载游戏时，“内部”、“外部”文件夹都会被自动删除。如需“备份”导出的存档文件，请将 files 文件夹复制到其他文件夹(例：/sdcard/download)。  
![图片](/img/lAWBvaZj526UESR.webp)  

---

### 一、“内部”与“外部”目录  

框架支持添加到“不同”版本，请注意这里`包名`有变化。

内部：`/data/data/<package>/`
```lua
/data/data/hei.kleientertainment.doNotStarveShipwrecked/
```

![图片](/img/o7ElukfGOHILdMa.webp)  

外部：`/sdcard/Android/data/<package>/`  
```lua
/sdcard/Android/data/hei.kleientertainment.doNotStarveShipwrecked/
```

![图片](/img/6NeRqFsbrIfmX7u.webp)  

>获取权限
- “外部”文件夹可能“无权访问、无权操作”，推荐使用“MT管理器”+“Shizuku”获取操作权限。  
- 手机QQ下载的文件，大家应该都会弄。这里的存档文件与之类似，简单说一下流程：MT管理器->设置->安装Shiziku->打开Shiziku(内部自带教程)。  

![图片](/img/tAOYdK1EyqxDl28.webp)  


---


### 二、“导入”与“导出”存档  

游戏主页->秘技，打开以下菜单  

![图片](/img/Im86xKTC2EDN3fF.webp)  

修复存档：修复“内部”的存档文件“命名错误”。  

导出存档：将“内部”的存档文件复制到“外部”。  

导入存档：将“外部”的存档文件复制到“内部”。  

---

### 三、导入别人分享的存档  

0. 存档1：主世界的文件为“xxxxx_1”，洞穴文件为“cave_n_l_1”，火山文件为volcano_1。

1. 如果你的“存档目录”设置为“外部”，那么直接将下载的别人的存档改名，去“替换”相应的存档就行。  

![图片](/img/FEqSObe31tQ48f2.webp)  
![图片](/img/iSTtxPCaj3Yq9ZX.webp)  


2. 如果你将“存档目录”设置为“默认”，那么先“导出存档”，再按上述操作“替换”存档，最后再“导入存档”。  

注：文件的解压、改名、复制、粘贴等操作，可能对于某些人有难度。请向你身边的人求助，他们可以手把手教你。  

---

### 四、替换存档内的人物  

0. 假设模组错误导致：存档1(xxxxx_1)的“千年狐”变成了“威尔逊”。

1. 选择人物“千年狐”，创建新存档5(xxxxx_5)，进入游戏，保存退出。

2. 按照 [[导入别人分享的存档]](#三导入别人分享的存档) 的步骤去替换 xxxxx_5 文件。

---



