---
title: 'YN355-隐藏地图图标（按键盘M键隐藏地图图标，再按M键恢复）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN355'
comments: false
url: '/p/379/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

三五五.隐藏地图图标（按键盘M键隐藏地图图标，再按M键恢复）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("resurrectable")的下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_M, function()
	if not inst:HasTag("nomap") then
	   inst:AddTag("nomap")
	   inst.HUD.controls.mapcontrols.minimapBtn:Hide()
	   inst.HUD.controls.mapcontrols.rotleft:Hide()
	   inst.HUD.controls.mapcontrols.rotright:Hide()
	else
	   inst:RemoveTag("nomap")
	   inst.HUD.controls.mapcontrols.minimapBtn:Show()
	   inst.HUD.controls.mapcontrols.rotleft:Show()
	   inst.HUD.controls.mapcontrols.rotright:Show()
	end
end )

	即可按键盘M键隐藏地图、左右方向图标，以免遮挡视线，再按M键恢复

```  

