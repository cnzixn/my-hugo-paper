---
title: 'YN224-我是龙卷风（按键盘U键主角变身龙卷风，掠过之处尽毁，敌人靠近会被冻伤，再按U键变回人）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN224'
comments: false
url: '/p/209/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

二二四.我是龙卷风（按键盘U键主角变身龙卷风，掠过之处尽毁，敌人靠近会被冻伤，再按U键变回人）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("playercontroller")的下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_U, function()
	if not inst:HasTag("windman") then
	   inst.components.locomotor:Stop()
	   inst.components.playercontroller:Enable(false)
	   inst.AnimState:PlayAnimation("idle_shiver_pre")
	   inst.AnimState:PushAnimation("idle_shiver_loop")
	   inst.AnimState:PushAnimation("idle_shiver_pst", false)
	   GetPlayer().SoundEmitter:PlaySound("dontstarve_DLC001/creatures/glommer/foot_ground")
	   inst:DoTaskInTime(0.3, function() 
		   inst:AddTag("windman")
		   inst.AnimState:SetBank("tornado")
		   inst.AnimState:SetBuild("tornado")
		   inst:SetStateGraph("SGtornado")
		   inst.AnimState:PlayAnimation("tornado_pre")
		   inst.AnimState:PushAnimation("tornado_loop")
		   inst.Transform:SetScale(1.8,1.8,1.8)
		   local light = inst.entity:AddLight()
		   light:SetIntensity(.8)
		   light:SetRadius(10)
		   light:SetFalloff(.6)
		   light:Enable(true)
		   light:SetColour(255/255,255/255,255/255)
		   inst.components.locomotor.walkspeed = 20
		   inst.components.locomotor.runspeed = 30
		   inst.components.health:SetInvincible(true)
		   inst.components.hunger:Pause()
		   inst.components.temperature:SetTemp(20)
		   inst.Physics:SetCollisionCallback(function(inst, other)
			   if other and other.components.health and other.components.combat then
				  if other.components.combat.target == GetPlayer() or GetPlayer().components.combat.target == other or other:HasTag("monster") then
					 other.components.health:DoDelta(-100)
					 if other.components.freezable then
						other.components.freezable:AddColdness(10)
						other.components.freezable:SpawnShatterFX()
					 end
				  end
			   end
			   if other and other.components.workable and other.components.workable.workleft > 0 then
				  GetPlayer().SoundEmitter:PlaySound("dontstarve_DLC001/creatures/glommer/foot_ground")
				  other.components.workable:Destroy(inst)
			   end
		   end )
		   inst.components.playercontroller:Enable(true)
	   end )
	else
		inst.components.locomotor:Stop()
		inst.components.playercontroller:Enable(false)
		GetPlayer().SoundEmitter:PlaySound("dontstarve_DLC001/creatures/glommer/foot_ground")
		inst.AnimState:PlayAnimation("tornado_pst")
		inst:DoTaskInTime(0.3, function()
			inst:RemoveTag("windman")
			inst.AnimState:SetBank("wilson")
			inst.AnimState:SetBuild(name)
			inst:SetStateGraph("SGwilson")
			inst.AnimState:PlayAnimation("idle")
			inst.Transform:SetScale(1,1,1)
			inst.Light:Enable(false)
			inst.components.locomotor.walkspeed = TUNING.WILSON_WALK_SPEED
			inst.components.locomotor.runspeed = TUNING.WILSON_RUN_SPEED
			inst.components.health:SetInvincible(false)
			inst.components.hunger:Resume()
			inst.components.temperature:SetTemp(nil)
			inst.Physics:SetCollisionCallback( nil )
			inst.components.playercontroller:Enable(true)
		end )
	end
end )

	即可按键盘U键，主角变身龙卷风，掠过之处一切建筑、植物尽毁，敌人靠近将被冻伤。龙卷风可夜视，不会饥饿，且锁血，去席卷大陆吧。再次按键盘U键可变回人

```  

