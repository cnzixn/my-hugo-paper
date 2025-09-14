---
title: 'YN223-我是神龙（按键盘L键主角变身神龙，能吐火，再按L键变回人）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN223'
comments: false
url: '/p/272/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

二二三.我是神龙（按键盘L键主角变身神龙，能吐火，再按L键变回人）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("playercontroller")的下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_L, function()
	if not inst:HasTag("dragon") then
	   if inst.components.inventory:Has("goldnugget", 30) then
		  inst.components.inventory:ConsumeByName("goldnugget", 30)
		  inst.components.locomotor:Stop()
		  inst.components.playercontroller:Enable(false)
		  inst.AnimState:PlayAnimation("idle_shiver_pre")
		  inst.AnimState:PushAnimation("idle_shiver_loop")
		  inst.AnimState:PushAnimation("idle_shiver_pst", false)
		  inst:DoTaskInTime(1, function() 
			  inst:AddTag("dragon")
			  inst.AnimState:SetBank("krampus")
			  inst.AnimState:SetBuild("krampus_build")
			  inst:SetStateGraph("SGkrampus")
			  inst.AnimState:PlayAnimation("idle", true)
			  inst.AnimState:Hide("SACK")
			  inst.AnimState:Show("ARM")
			  inst.Transform:SetScale(1.8,1.8,1.8)
			  shadow:SetSize( 6, 3.5 )
			  local light = inst.entity:AddLight()
			  light:SetIntensity(.8)
			  light:SetRadius(20)
			  light:SetFalloff(.6)
			  light:Enable(true)
			  light:SetColour(255/255, 0/255, 0/255)
			  inst.components.locomotor.walkspeed = 10
			  inst.components.locomotor.runspeed = 15
			  local pos = GetPlayer():GetPosition()
			  GetSeasonManager():DoLightningStrike(pos)
			  inst.components.health:SetInvincible(true)
			  inst.components.hunger:Pause()
			  inst.components.combat:SetDefaultDamage(500)
			  inst.components.combat.hiteffectsymbol = "krampus_torso"
			  local pearl = SpawnPrefab("dragonfruit")
			  pearl.entity:AddSoundEmitter()
			  RemovePhysicsColliders(pearl)
			  pearl:AddTag("projectile")
			  pearl:AddTag("pearl")
			  pearl:RemoveComponent("edible")
			  pearl:RemoveComponent("stackable")
			  pearl:RemoveComponent("tradable")
			  pearl:RemoveComponent("perishable")
			  pearl:RemoveComponent("cookable")
			  pearl:RemoveComponent("bait")
			  pearl:RemoveComponent("plantable")
			  pearl:RemoveComponent("burnable")
			  pearl:RemoveComponent("propagator")
			  pearl:AddComponent("burnable")
			  pearl.components.burnable:SetFXLevel(3)
			  pearl.components.burnable:AddBurnFX("character_fire", Vector3(0,0,0) )
			  pearl:AddComponent("weapon")
			  pearl.components.weapon:SetDamage(500)
			  pearl.components.weapon:SetRange(20, 25)
			  pearl:AddComponent("equippable")
			  pearl.components.equippable.equipslot = EQUIPSLOTS.HANDS
			  pearl.components.equippable:SetOnEquip(function(pearl)
				  pearl.components.burnable:Extinguish()
			  end )
			  pearl:AddComponent("projectile")
			  pearl.components.projectile:SetSpeed(50)
			  pearl.components.projectile:SetOnHitFn(function(pearl, owner, target)
				  inst.SoundEmitter:PlaySound("dontstarve/creatures/eyeballturret/shotexplo")
				  SpawnPrefab("collapse_small").Transform:SetPosition(target.Transform:GetWorldPosition())
				  SpawnPrefab("explode_small").Transform:SetPosition(target.Transform:GetWorldPosition())
				  inst.components.playercontroller:ShakeCamera(inst, "FULL", 0.2, 0.02, .5, 40)
				  if target.components.burnable then
					 target.components.burnable:Ignite()
				  end
				  owner.components.inventory:Equip(pearl)
			  end )
			  pearl.components.projectile:SetOnMissFn(function(pearl, owner)
				  owner.components.inventory:Equip(pearl)
			  end )
			  pearl:ListenForEvent("onthrown", function(pearl)
				  local pt = pearl:GetPosition()
				  pearl.Transform:SetPosition(pt.x, 2, pt.z)
				  pearl.SoundEmitter:PlaySound("dontstarve/common/blackpowder_explo")
				  pearl.components.burnable:Ignite(true)
			  end )
			  inst.components.inventory:Equip(pearl)
			  inst.components.temperature:SetTemp(20)
			  inst.components.playercontroller:Enable(true)
		  end )
		end
	else
		inst.components.locomotor:Stop()
		inst.components.playercontroller:Enable(false)
		inst.AnimState:PlayAnimation("taunt")
		inst:DoTaskInTime(1, function()
			inst:RemoveTag("dragon")
			inst.AnimState:SetBank("wilson")
			inst.AnimState:SetBuild(name)
			inst:SetStateGraph("SGwilson")
			inst.AnimState:PlayAnimation("idle")
			inst.Transform:SetScale(1,1,1)
			shadow:SetSize( 1.3, .6 )
			inst.Light:Enable(false)
			inst.components.locomotor.walkspeed = TUNING.WILSON_WALK_SPEED
			inst.components.locomotor.runspeed = TUNING.WILSON_RUN_SPEED
			local pos = GetPlayer():GetPosition()
			GetSeasonManager():DoLightningStrike(pos)
			inst.components.health:SetInvincible(false)
			inst.components.hunger:Resume()
			inst.components.combat:SetDefaultDamage(TUNING.UNARMED_DAMAGE)
			inst.components.combat.hiteffectsymbol = "torso"
			local pos0 = Vector3(inst.Transform:GetWorldPosition())
			local ents = TheSim:FindEntities(pos0.x,pos0.y,pos0.z, 3000)
			for k,v in pairs(ents) do
				if v:HasTag("pearl") then
				   v:Remove()
				end
			end
			inst.components.temperature:SetTemp(nil)
			inst.components.playercontroller:Enable(true)
		end )
	end
end )

	即可在身上有30个黄金时，按键盘L键，主角随即变身神龙，将消耗30个黄金，身上黄金数不足时不会变身。变身神龙后，自动装备龙果，对敌人按鼠标左键，可发射龙果火球，如果卸载龙果，则改为近身格斗（按Ctrl + 鼠标左键攻击，或按住F键反击），防止点燃附近植物。神龙可夜视，不会饥饿，且锁血，对地上的物品点鼠标左键可捡起。想要变回主角时，再次按键盘L键即可，龙果将消失

```  

