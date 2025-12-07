---
title: 'YN222-我是巨鹿（按键盘HOME键主角变身巨鹿，按END键还原）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN222'
comments: false
url: '/p/283/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

二二二.我是巨鹿（按键盘HOME键主角变身巨鹿，按END键还原）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("playercontroller")的下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_HOME, function()
  if inst.components.inventory:Has("goldnugget", 30) then
	inst.components.inventory:ConsumeByName("goldnugget", 30)
	inst.components.locomotor:Stop()
	inst.components.playercontroller:Enable(false)
	inst.AnimState:PlayAnimation("idle_shiver_pre")
	inst.AnimState:PushAnimation("idle_shiver_loop")
	inst.AnimState:PushAnimation("idle_shiver_pst", false)
	inst:DoTaskInTime(1, function() 
		inst.AnimState:SetBank("deerclops")
		inst.AnimState:SetBuild("deerclops_build")
		inst:SetStateGraph("SGdeerclops")
		inst.AnimState:PlayAnimation("idle_loop", true)
		inst.Transform:SetScale(1.5,1.5,1.5)
		shadow:SetSize( 6, 3.5 )
		local pos = GetPlayer():GetPosition()
		GetSeasonManager():DoLightningStrike(pos)
		inst.components.health:SetInvincible(true)
		inst.components.hunger:Pause()
		inst.components.combat:SetDefaultDamage(500)
		inst.components.combat.hiteffectsymbol = "deerclops_body"
		inst.components.combat.onhitotherfn = function()
			 inst.SoundEmitter:PlaySound("dontstarve/creatures/deerclops/attack")
			 inst.components.playercontroller:ShakeCamera(inst, "FULL", 0.5, 0.05, 2, 40)
		end
		inst.components.combat.playerdamagepercent = 0
		inst.components.combat:SetAreaDamage(10, 1)
		inst.components.temperature:SetTemp(20)
		inst.components.playercontroller:Enable(true)
	end )
  end
end )
TheInput:AddKeyUpHandler(KEY_END, function()
	inst.components.locomotor:Stop()
	inst.components.playercontroller:Enable(false)
	inst.AnimState:PlayAnimation("taunt")
	inst:DoTaskInTime(1, function() 
		inst.AnimState:SetBank("wilson")
		inst.AnimState:SetBuild(name)
		inst:SetStateGraph("SGwilson")
		inst.AnimState:PlayAnimation("idle")
		inst.Transform:SetScale(1,1,1)
		shadow:SetSize( 1.3, .6 )
		local pos = GetPlayer():GetPosition()
		GetSeasonManager():DoLightningStrike(pos)
		inst.components.health:SetInvincible(false)
		inst.components.hunger:Resume()
		inst.components.combat:SetDefaultDamage(TUNING.UNARMED_DAMAGE)
		inst.components.combat.hiteffectsymbol = "torso"
		inst.components.combat.onhitotherfn = nil
		inst.components.combat:SetAreaDamage(0, 0)
		inst.components.temperature:SetTemp(nil)
		inst.components.playercontroller:Enable(true)
	end )
end )

	即可在你深陷绝境之时，对电脑屏幕大喊“我是巨鹿”，并同时按下键盘HOME键，主角将变身无敌巨鹿（锁血、锁饥饿、不怕冷），对敌人展开恐怖的报复吧（按Ctrl + 鼠标左键攻击）。每次变身将消耗30个黄金，身上黄金数不足时不会变身。想要变回主角时，按键盘END键即可。注意，由于巨鹿变身时会招来闪电，并且本身具备大面积杀伤的能力，所以请远离基地变身，且尽量不要带同伴。修改过“神奇跳跃”的话，不要在变身巨鹿时跳跃

```  

