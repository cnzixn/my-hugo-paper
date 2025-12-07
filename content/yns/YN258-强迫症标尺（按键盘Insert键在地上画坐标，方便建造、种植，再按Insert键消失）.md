---
title: 'YN258-强迫症标尺（按键盘Insert键在地上画坐标，方便建造、种植，再按Insert键消失）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN258'
comments: false
url: '/p/251/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

二五八.强迫症标尺（按键盘Insert键在地上画坐标，方便建造、种植，再按Insert键消失）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("playeractionpicker")的下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_INSERT, function()
	if not inst:HasTag("ruler") then
	   inst:AddTag("ruler")
	   local pt = inst:GetPosition()
	   for y = 10, 0, -1 do
		   for x = 0, 10 do
			   local coordinate = SpawnPrefab("gridplacer")
			   coordinate.AnimState:SetOrientation( ANIM_ORIENTATION.OnGround )
			   coordinate.AnimState:SetLayer( LAYER_BACKGROUND )
			   coordinate.AnimState:SetSortOrder( 1 )
			   coordinate.Transform:SetRotation( 45 )
			   coordinate.Transform:SetPosition(pt.x-14.1+x*2.82, 0, pt.z-14.1+y*2.82)
			   local light = coordinate.entity:AddLight()
			   light:SetIntensity(.6)
			   light:SetRadius(.5)
			   light:SetFalloff(.6)
			   light:Enable(true)
			   light:SetColour(180/255, 195/255, 225/255)
			   coordinate:AddTag("NOCLICK")
			   coordinate:AddTag("coordinate")
		   end
	   end
	else
	   inst:RemoveTag("ruler")
	   local pos = Vector3(inst.Transform:GetWorldPosition())
	   local ents = TheSim:FindEntities(pos.x,pos.y,pos.z, 3000)
	   for k,v in pairs(ents) do
		   if v:HasTag("coordinate") then
			  v:Remove()
		   end
	   end
	end
end )

	即可按键盘Insert键，以主角为中心在地上画出白色坐标，可作为建造或种植的参照线，也可测量你现有的建筑、植物是不是歪了，强迫症必备，还有夜光效果哦，再按一次Insert键坐标消失

```  

