---
title: 'KLFA - 解包/打包'
date: 2025-08-01
author: 'Bny'
draft: true
summary: '本文介绍饥荒 ios 版本中的 data.archive 解包/打包。'
tags:
- '资料'
aliases:
- 'klfa'
url: '/p/431/'
---

![图片](/img/Image_1752847449499.jpg)

- - -

## 文件下载

> BM KLFA 25.07.18  
{{< pan "KLFA" >}}  

## 操作流程
- 购买并安装[<i class="bi bi-link-45deg">ShipWrecked </i><i class="bi bi-apple"></i>](https://apps.apple.com/us/app/dont-starve-shipwrecked/id1147297267?l=zh)
- 提取 IPA 文件，解压找到 .archive 文件
- 用 KLFA 工具 >> 解包 .archive 文件
- 将“框架”和“模组”添加到“资源文件”
- 用 KLFA 工具 >> 打包 .archive 文件
- 将 .archive 文件添加到 IPA 文件
- 安装 IPA 文件 [<i class="bi bi-link-45deg">查看教程</i>](https://ipa.store/install)，推荐 [<i class="bi bi-link-45deg">巨魔商店</i>](/p/trollstore)。

## 完整文档

``` md

BM KLFA_LUA 25.07.21

作者：樂卟嘶屬 | 交流群：QQ 614255348

功能：
  处理饥荒 iOS 版本的 .archive 格式资源文件

环境：
- Android
  - 安装 [Termux](https://www.termux.com)
  - Termux 执行 `pkg update && pkg upgrade -y`
  - Termux 执行 `pkg install -y luarocks lua51`
  - Termux 执行 `luarocks install luafilesystem`

- Linux
  - Android 的 Termux 是一个 Linux 环境
  - 请参考上述步骤

- Windows
  - 安装 [LuaForWindow](https://soft.3dmgame.com/down/206787.html)
  - CMD 执行 `luarocks install luafilesystem`

- 其他
  - 请参考 QuickBMS [dont_starve.bms](https://aluigi.altervista.org/bms/dont_starve.bms) ，自行编写解包/打包工具。

命令：

  unpack <输入文件路径> <输出目录路径>
    说明：将指定 .archive 格式文件解包至目标目录
    示例：lua klfa.lua unpack data.archive _data
    示例：lua klfa.lua unpack dlc0002.archive _dlc0002

  pack <输入目录路径> <输出文件路径>
    说明：将指定源目录下的资源文件打包为 .archive 格式输出文件
    示例：lua klfa.lua pack _data data.archive
    示例：lua klfa.lua pack _dlc0002 dlc0002.archive


```



---



