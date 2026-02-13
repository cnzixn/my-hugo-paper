---
title: 'YN018-地图全开（游戏中按Ctrl+1）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN018'
comments: false
url: '/p/46/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

十八.地图全开（游戏中按Ctrl+1）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("resurrectable")下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_1, function()
	if TheInput:IsKeyDown(KEY_CTRL) then
	   local map = TheSim:FindFirstEntityWithTag("minimap")
	   local x,y,z = GetPlayer().Transform:GetWorldPosition()
	   map.MiniMap:ShowArea(x, y, z, 10000)
	end
end)

	即可在游戏中按Ctrl + 1使地图全开

```  

