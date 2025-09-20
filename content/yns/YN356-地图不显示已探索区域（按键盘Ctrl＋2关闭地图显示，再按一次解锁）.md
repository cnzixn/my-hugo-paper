---
title: 'YN356-地图不显示已探索区域（按键盘Ctrl+2关闭地图显示，再按一次解锁）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN356'
comments: false
url: '/p/370/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

三五六.地图不显示已探索区域（按键盘Ctrl+2关闭地图显示，再按一次解锁）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("resurrectable")下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_2, function()
	if TheInput:IsKeyDown(KEY_CTRL) then
	   local map = TheSim:FindFirstEntityWithTag("minimap")
	   if not inst:HasTag("mapoff") then
		  inst:AddTag("mapoff")
		  map.MiniMap:ClearRevealedAreas(true)
	   else
		  inst:RemoveTag("mapoff")
		  map.MiniMap:ClearRevealedAreas(false)
	   end
	end
end )

	即可按键盘Ctrl+2，让小地图全黑，并且不再显示已探索区域，增加探险的难度。再次按Ctrl+2，可解锁小地图显示已探索区域

```  

