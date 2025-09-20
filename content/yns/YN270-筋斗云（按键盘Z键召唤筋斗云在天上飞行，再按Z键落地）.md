---
title: 'YN270-筋斗云（按键盘Z键召唤筋斗云在天上飞行，再按Z键落地）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN270'
comments: false
url: '/p/248/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

二七０.筋斗云（按键盘Z键召唤筋斗云在天上飞行，再按Z键落地）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("resurrectable")的下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_Z, function()
	 if not inst:HasTag("flycloud") then
		inst:AddTag("flycloud")
		inst.components.locomotor:Stop()
		inst.components.talker:ShutUp()
		SpawnPrefab("collapse_small").Transform:SetPosition(inst.Transform:GetWorldPosition())
		inst.AnimState:PlayAnimation("give")
		inst:DoTaskInTime(0.3, function()
			inst.cloud = SpawnPrefab("corn_cooked")
			inst.cloud.Physics:SetActive(false)
			inst.cloud.Transform:SetScale(1.8, 1.8, 1.8)
			inst.cloud.AnimState:SetMultColour(255/255,255/255,255/255,0.6)
			inst.cloud.AnimState:SetBloomEffectHandle("shaders/anim.ksh")
			inst.cloud:RemoveComponent("perishable")
			inst.cloud:RemoveComponent("edible")
			inst.cloud:RemoveComponent("stackable")
			inst.cloud:RemoveComponent("inventoryitem")
			inst.cloud:RemoveComponent("bait")
			inst.cloud:RemoveComponent("tradable")
			inst.cloud:RemoveComponent("burnable")
			inst.cloud:RemoveComponent("propagator")
			inst.cloud.persists = false
			inst.cloud:AddTag("NOCLICK")
			local follower = inst.cloud.entity:AddFollower()
			follower:FollowSymbol( inst.GUID, "swap_body", 0, 60, 0 )
			local pt = inst:GetPosition()
			inst.Transform:SetPosition(pt.x, 10, pt.z)
			local shadow = inst.entity:AddDynamicShadow()
			shadow:SetSize( 0, 0 )
			inst.gogogo = inst:DoPeriodicTask(.01, function() inst.Physics:SetMotorVelOverride(25,1.5,0) end)
		end )
	 else
		inst:RemoveTag("flycloud")
		inst.components.locomotor:Stop()
		inst.components.talker:ShutUp()
		SpawnPrefab("collapse_small").Transform:SetPosition(inst.Transform:GetWorldPosition())
		inst.AnimState:PlayAnimation("give")
		inst:DoTaskInTime(0.3, function()
			if inst.cloud then inst.cloud:Remove() inst.cloud = nil end
			if inst.gogogo then inst.gogogo:Cancel() inst.gogogo = nil end
			local pt = inst:GetPosition()
			inst.Transform:SetPosition(pt.x, 0, pt.z)
			local shadow = inst.entity:AddDynamicShadow()
			shadow:SetSize( 1.3, .6 )
			inst.Physics:ClearMotorVelOverride()
			inst.Physics:ClearMotorVelOverride()
		end )
	 end
end )

	即可口中默念咒语——“走你”，并按下键盘Z键，召唤筋斗云在天上飞行，用键盘W、S、A、D键控制方向，再次按Z键可落地

```  

