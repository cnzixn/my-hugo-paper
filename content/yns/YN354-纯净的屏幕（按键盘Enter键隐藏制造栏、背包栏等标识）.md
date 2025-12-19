---
title: 'YN354-纯净的屏幕（按键盘Enter键隐藏制造栏、背包栏等标识）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN354'
comments: false
url: '/p/361/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

三五四.纯净的屏幕（按键盘Enter键隐藏制造栏、背包栏等标识）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("playercontroller")的下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_ENTER, function() GetPlayer().HUD:Toggle() end )

	即可按键盘Enter键隐藏制造栏、物品栏、表、背包栏等所有标识，让你的视野更宽阔，更加投入饥荒的世界，再次按Enter键显示标识

```  

