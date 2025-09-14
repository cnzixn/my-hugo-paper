---
title: 'YN267-蜘蛛座骑（按键盘PageUP键召唤蜘蛛座骑，按PageDown键取消）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN267'
comments: false
url: '/p/343/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

二六七.蜘蛛座骑（按键盘PageUP键召唤蜘蛛座骑，按PageDown键取消）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("inventory")的下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_PAGEUP, function()
	if inst.task then inst.task:Cancel() inst.task = nil end
	if inst.task2 then inst.task2:Cancel() inst.task2 = nil end
	if inst.doll then inst.doll:Remove() inst.doll = nil end
	inst.components.locomotor:Stop()
	inst.components.playercontroller:Enable(false)
	SpawnPrefab("collapse_big").Transform:SetPosition(inst.Transform:GetWorldPosition())
	inst.SoundEmitter:PlaySound("dontstarve/creatures/spiderqueen/scream_short")
	inst:DoTaskInTime(0.1, function() 
		inst.AnimState:SetBank("spider_queen")
		inst.AnimState:SetBuild("spider_queen_build")
		inst.AnimState:PlayAnimation("idle", true)
		inst.AnimState:SetBloomEffectHandle("shaders/anim.ksh")
		inst:SetStateGraph("SGspiderqueen")
		shadow:SetSize( 7, 3 )
		inst.components.locomotor.walkspeed = 15
		inst.components.locomotor.runspeed = 20
		inst.components.health:SetInvincible(true)
		inst.components.hunger:Pause()
		inst.components.combat:SetDefaultDamage(300)
		inst.components.temperature:SetTemp(20)
		inst.components.playercontroller:Enable(true)
		local pt = GetPlayer():GetPosition()
		inst.doll = SpawnPrefab( "beardhair" )
		inst.doll.Transform:SetPosition(pt.x, 3.5, pt.z)
		inst.doll.Physics:SetActive(false)
		inst.doll.AnimState:SetBank("wilson")
		inst.doll.AnimState:SetBuild(name)
		inst.doll.AnimState:OverrideSymbol("swap_object", "swap_spear", "swap_spear")
		inst.doll.AnimState:Hide("ARM_normal")
		inst.doll.AnimState:Show("ARM_carry")
		inst.doll.Transform:SetFourFaced()
		inst.doll.AnimState:PlayAnimation("idle")
		inst.doll:RemoveComponent("burnable")
		inst.doll:RemoveComponent("propagator")
		inst.doll:RemoveComponent("inspectable")
		inst.doll:RemoveComponent("inventoryitem")
		inst.doll:RemoveComponent("stackable")
		inst.doll:RemoveComponent("fuel")
		inst.task = inst:DoPeriodicTask(.05, function()
			local pt1 = GetPlayer():GetPosition()
			inst.doll.Transform:SetPosition(pt1.x, 3.5, pt1.z)
			inst.doll.Transform:SetRotation(GetPlayer().Transform:GetRotation())
		end )
		inst.task2 = inst:DoPeriodicTask(10, function()
			inst.doll.AnimState:PlayAnimation("give",true)
			inst:DoTaskInTime(2.2, function() inst.doll.AnimState:PlayAnimation("idle") end )
		end )
	end )
end )
TheInput:AddKeyUpHandler(KEY_PAGEDOWN, function()
	inst.components.locomotor:Stop()
	inst.components.playercontroller:Enable(false)
	SpawnPrefab("collapse_big").Transform:SetPosition(inst.Transform:GetWorldPosition())
	inst.SoundEmitter:PlaySound("dontstarve/creatures/spiderqueen/scream_short")
	inst:DoTaskInTime(0.1, function() 
		inst.AnimState:SetBank("wilson")
		inst.AnimState:SetBuild(name)
		inst.AnimState:PlayAnimation("idle")
		inst.AnimState:SetBloomEffectHandle("")
		inst:SetStateGraph("SGwilson")
		shadow:SetSize( 1.3, .6 )
		inst.components.locomotor.walkspeed = TUNING.WILSON_WALK_SPEED
		inst.components.locomotor.runspeed = TUNING.WILSON_RUN_SPEED
		inst.components.health:SetInvincible(false)
		inst.components.hunger:Resume()
		inst.components.combat:SetDefaultDamage(TUNING.UNARMED_DAMAGE)
		inst.components.temperature:SetTemp(nil)
		inst.components.playercontroller:Enable(true)
		if inst.task then inst.task:Cancel() inst.task = nil end
		if inst.task2 then inst.task2:Cancel() inst.task2 = nil end
		if inst.doll then inst.doll:Remove() inst.doll = nil end
	end )
end )

	即可按键盘PageUP键召唤蜘蛛座骑（自动骑在蜘蛛身上），按PageDown键取消座骑。攻击时对敌人按Ctrl + 鼠标左键（也可以按住F键连续还击）。骑在蜘蛛身上时，敌人无法打到主角，所以主角不会掉血

```  

