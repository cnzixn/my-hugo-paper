---
title: 'YN359-修复游戏Mods按钮（解决按Mods按钮卡住问题）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN359'
comments: false
url: '/p/377/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

三五九.修复游戏Mods按钮（解决按Mods按钮卡住问题）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/screens/modsscreen.lua文件，

	1.在self.modlinkbutton:SetOnClick( function() self:MoreMods() end )的下一行插入self.cb(true)


	2.将下列内容：

function ModsScreen:StartWorkshopUpdate()
	if TheSim:UpdateWorkshopMods( function() self:WorkshopUpdateComplete() end ) then
		self.updatetask = scheduler:ExecutePeriodic(0, self.ShowWorkshopStatus, nil, 0, self )
	else
		self:WorkshopUpdateComplete()
	end
end

	替换为：

function ModsScreen:StartWorkshopUpdate()
		self:WorkshopUpdateComplete()
end

	即可在主菜单点Mods按钮，直接显示mod信息，如果没有安装mod，则不会进入mod模式

```  

