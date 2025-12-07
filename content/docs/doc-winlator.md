---
date: '2025-11-03T12:00:00Z'
title: '安卓 - PC模拟器'
author: 'Bny'
summary: '本文介绍如何在安卓手机，使用模拟器玩PC游戏。'
tags:
- '资料'
aliases:
- 'winlator'
comments: false
url: '/p/17/'
---

> 手机上玩电脑游戏，还是比较舒服的。

![图片](/img/Screenshot_20251112.webp)

---

# 盖世模拟器

　适合国内宝宝体质的用户，可以登录 Steam 平台，下载并安装你已购买的游戏，也支持订阅模组。

　下载地址：[盖世模拟器](https://gamehub.xiaoji.com/)

---

# Winlator

　这里给出的是 Github 链接，你会下载文件，就说明你会使用它。

　下载地址：[Winlator](https://github.com/brunodev85/winlator/releases)

## 操作流程

- 电脑，在 Steam 购买 Don't Starve 游戏：  
  - [ 购买 Don't Starve Alone Pack Plus 捆绑包 ](https://store.steampowered.com/bundle/9207/Dont_Starve_Alone_Pack_Plus)

- 电脑，获取官方提供的独立版游戏文件(无需Steam可运行)：Steam账户登录[Klei](https://accounts.klei.com/account)，获取[无DRM版游戏](https://accounts.klei.com/account/drmkeys)。
  - 无DRM版游戏：只需要下载 Don't Starve (作为启动器)，下载完成后，你会有一个 `DontStarve_Installer.exe` 的 Win 程序。

- 电脑，在 Steam 安装 Don't Starve，跳转到游戏目录，将 `data` 文件夹压缩为 `data.zip` 文件(包含3个DLC)。

- 电脑，将上述两个文件传输到手机，放到 `/sdcard/download/` 文件夹，备用。

- 手机，安装并启动 Winlator ，创建容器并启动，在 `D:` 找到文件，先安装 `DontStarve_Installer.exe`，默认安装目录 `C:\Program files (x86)\DontStarve` 不要改。

- Winlator，将 `data.zip` 解压出来的 `data` 文件夹放到安装目录。(注意不要套娃)

- Winlator，在 `C:\Program files (x86)\DontStarve\bin` 找到 `dontstarve.exe`，这个是主程序(启动器)，右键，Create Shortcut(创建快捷方式)

---















