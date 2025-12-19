---
title: 'YN226-遁形术（按键盘I键主角变身随机小动物，敌人会失去攻击目标，再按I键变回人）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN226'
comments: false
url: '/p/326/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

二二六.遁形术（按键盘I键主角变身随机小动物，敌人会失去攻击目标，再按I键变回人）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("playercontroller")的下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_I, function()
	if not inst:HasTag("chameleon") then
	   inst.components.locomotor:Stop()
	   inst.components.talker:ShutUp()
	   inst.components.playercontroller:Enable(false)
	   local head = GetPlayer().components.inventory:GetEquippedItem(EQUIPSLOTS.HEAD)
	   GetPlayer().components.inventory:DropItem(head)
	   local hands = GetPlayer().components.inventory:GetEquippedItem(EQUIPSLOTS.HANDS)
	   GetPlayer().components.inventory:DropItem(hands)
	   local body = GetPlayer().components.inventory:GetEquippedItem(EQUIPSLOTS.BODY)
	   GetPlayer().components.inventory:DropItem(body)
	   inst.components.health:SetInvincible(true)
	   inst.components.hunger:Pause()
	   inst.components.sanity.ignore = true
	   inst.components.temperature:SetTemp(20)
	   SpawnPrefab("collapse_small").Transform:SetPosition(inst.Transform:GetWorldPosition())
	   inst:DoTaskInTime(0.3, function() 
		   inst:AddTag("chameleon")
		   inst.chameleon = inst:DoPeriodicTask(.5, function()
			   local pos = Vector3(inst.Transform:GetWorldPosition())
			   local ents = TheSim:FindEntities(pos.x,pos.y,pos.z, 25)
			   for k,v in pairs(ents) do
				   if v.components.combat and v.components.combat.target and v.components.combat.target == inst then
					  v.components.combat:SetTarget(nil)
				   end
			   end
		   end )
		   if math.random()<.18 then
			  inst.AnimState:SetBank("rabbit")
			  inst.AnimState:SetBuild("rabbit_build")
			  inst.AnimState:PlayAnimation("idle")
			  local rabbitsounds = { scream = "dontstarve/rabbit/scream", hurt = "dontstarve/rabbit/scream_short", }
			  inst.sounds = rabbitsounds
			  inst.data = {}
			  inst:SetStateGraph("SGrabbit")
			  shadow:SetSize( 1, .75 )
		   elseif math.random()<.36 then
			  inst.AnimState:SetBank("perd")
			  inst.AnimState:SetBuild("perd")
			  inst.AnimState:PlayAnimation("idle_loop")
			  inst:SetStateGraph("SGperd")
			  shadow:SetSize( 1.5, .75 )
		   elseif math.random()<.54 then
			  inst.AnimState:SetBank("frog")
			  inst.AnimState:SetBuild("frog")
			  inst.AnimState:PlayAnimation("idle")
			  inst:SetStateGraph("SGfrog")
			  shadow:SetSize( 1.5, .75 )
		   elseif math.random()<.72 then
			  inst.AnimState:SetBank("butterfly")
			  inst.AnimState:SetBuild("butterfly_basic")
			  inst.AnimState:PlayAnimation("idle")
			  inst:SetStateGraph("SGbutterfly")
			  shadow:SetSize( .8, .5 )
		   else
			  inst.AnimState:SetBank("bee")
			  inst.AnimState:SetBuild("bee_build")
			  inst.AnimState:PlayAnimation("idle")
			  local workersounds = { takeoff = "dontstarve/bee/bee_takeoff", attack = "dontstarve/bee/bee_attack", buzz = "dontstarve/bee/bee_fly_LP", hit = "dontstarve/bee/bee_hurt", death = "dontstarve/bee/bee_death", }
			  inst.sounds = workersounds
			  inst:SetStateGraph("SGbee")
			  shadow:SetSize( .8, .5 )
		   end
		   inst.components.playercontroller:Enable(true)
	   end )
	else
		inst.components.locomotor:Stop()
		inst.components.talker:ShutUp()
		inst.components.playercontroller:Enable(false)
		SpawnPrefab("collapse_small").Transform:SetPosition(inst.Transform:GetWorldPosition())
		inst:DoTaskInTime(0.3, function()
			inst:RemoveTag("chameleon")
			if inst.chameleon then inst.chameleon:Cancel() inst.chameleon = nil end
			inst.AnimState:SetBank("wilson")
			inst.AnimState:SetBuild(name)
			inst.AnimState:PlayAnimation("idle")
			inst:SetStateGraph("SGwilson")
			shadow:SetSize( 1.3, .6 )
			inst.components.health:SetInvincible(false)
			inst.components.hunger:Resume()
			inst.components.sanity.ignore = false
			inst.components.temperature:SetTemp(nil)
			inst.components.playercontroller:Enable(true)
		end )
	end
end )

	即可在被敌人追得穷途末路时，大声喊出咒语“哎呀妈呀”（请使用东北口音），并按键盘I键，主角随机变身为兔子、火鸡、青蛙、蝴蝶、蜜蜂等小动物，敌人会被迷惑，从而失去攻击目标，让你可以成功脱身。每种小动物各有特色，火鸡可以快速采摘植物、蜜蜂可以蛰敌人等，体验一下作小动物的感觉吧。运用遁形术变身时，血、饥饿、脑会锁死，穿戴的装备会掉在地上，不想让其掉落，就提前卸下。再次按键盘I键，可变回主角

```  

