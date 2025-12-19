---
title: 'YN301-斗蜘蛛（用啜食者皮种斗蜘蛛场，购买迷你蜘蛛与庄家PK，赢奖金）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN301'
comments: false
url: '/p/260/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

三０一.斗蜘蛛（用啜食者皮种斗蜘蛛场，购买迷你蜘蛛与庄家PK，赢奖金）

	用MT管理器打开游戏目录/assets/scripts/prefabs/slurperpelt.lua文件，在inst:AddComponent("inspectable")的下一行插入以下内容：

local colours=
{
	{198/255,43/255,43/255},
	{79/255,153/255,68/255},
	{35/255,105/255,235/255},
	{233/255,208/255,69/255},
	{109/255,50/255,163/255},
	{222/255,126/255,39/255},
}
local function boxing(inst)
	local pt = inst:GetPosition()
	local boxer = SpawnPrefab("slurper_pelt")
	boxer.Transform:SetPosition(pt.x, pt.y, pt.z)
	boxer.AnimState:SetBank("wilson")
	boxer.AnimState:SetBuild("wes")
	boxer.AnimState:OverrideSymbol("swap_hat", "hat_top", "swap_hat")
	boxer.AnimState:Show("HAT")
	boxer.AnimState:Show("HAT_HAIR")
	boxer.AnimState:Hide("HAIR_NOHAT")
	boxer.AnimState:Hide("HAIR")
	boxer.AnimState:Hide("ARM_carry")
	boxer.AnimState:Show("ARM_normal")
	boxer.Transform:SetFourFaced()
	boxer.AnimState:PlayAnimation("idle")
	boxer:RemoveComponent("stackable")
	boxer:RemoveComponent("tradable")
	boxer:RemoveComponent("inventoryitem")
	boxer:RemoveComponent("edible")
	boxer:RemoveComponent("deployable")
	MakeLargeBurnable(boxer)
	MakeLargePropagator(boxer)
	boxer:AddTag("boxer")
	boxer:AddComponent("trader")
	boxer.components.trader:SetAcceptTest(function(boxer, item) 
		if GetPlayer().components.inventory:Has("goldnugget", 100) then
		   if item.prefab == "goldnugget" then
			  return true
		   end
		end
		return false
	end )
	boxer.components.trader.onaccept = function(boxer, giver, item)
		GetPlayer().components.inventory:ConsumeByName("goldnugget", 99)
		boxer.AnimState:PlayAnimation("give")
		local cricket = SpawnPrefab("slurper_pelt")
		cricket.Transform:SetPosition(pt.x+1.5, 0, pt.z+1.5)
		cricket.AnimState:SetBank("spider_queen")
		cricket.AnimState:SetBuild("spider_queen_build")
		cricket.AnimState:PlayAnimation("idle", true)
		cricket.Transform:SetFourFaced()
		cricket.entity:AddSoundEmitter()
		cricket.Transform:SetScale(0.3, 0.3, 0.3)
		cricket.colour_idx = math.random(#colours)
		cricket.AnimState:SetMultColour(colours[cricket.colour_idx][1],colours[cricket.colour_idx][2],colours[cricket.colour_idx][3],1)
		cricket.components.inventoryitem:ChangeImageName("spidereggsack")
		cricket:RemoveComponent("stackable")
		cricket:RemoveComponent("tradable")
		cricket:RemoveComponent("edible")
		cricket:RemoveComponent("burnable")
		cricket:RemoveComponent("propagator")
		cricket:RemoveComponent("deployable")
		local brain = require "brains/abigailbrain"
		cricket:SetBrain(brain)
		cricket:AddComponent("lootdropper")
		cricket.components.lootdropper:SetLoot({"silk"})
		cricket:AddComponent("locomotor")
		cricket.components.locomotor.walkspeed = 5
		cricket.components.locomotor.runspeed = 8
		cricket:SetStateGraph("SGspiderqueen")
		cricket:AddComponent("follower")
		cricket.components.follower:SetLeader(GetPlayer())
		cricket.health_num = math.random(100,300)
		cricket.damage_num = math.random(20,50)
		cricket:AddComponent("health")
		cricket.components.health:SetMaxHealth(cricket.health_num)
		cricket:AddComponent("trader")
		cricket.components.trader:SetAcceptTest(function(cricket, item) 
			if item.prefab == "smallmeat" then
			   return cricket.components.health:GetPercent() < 1
			end
			return false
		end )
		cricket.components.trader.onaccept = function(cricket, giver, item)
			cricket.components.health:DoDelta(300)
		end
		cricket:AddComponent("combat")
		cricket.components.combat:SetRetargetFunction(1, function(cricket)
			if not cricket.components.health:IsDead() then
				return FindEntity(cricket, 20, function(guy)
					if guy.components.health and not guy.components.health:IsDead() then
					   return guy:HasTag("cricket") or guy:HasTag("cricket0")
					end
				end )
			end
		end )
		cricket.components.combat:SetKeepTargetFunction(function(cricket, target) return target and target:IsValid() end )
		cricket.components.combat:SetAttackPeriod(2)
		cricket.components.combat:SetRange(1, 2)
		cricket.components.combat:SetDefaultDamage(cricket.damage_num)
		cricket:AddTag("cricket")
	end
	boxer.components.inspectable.getstatus = function(boxer)
		if not boxer:HasTag("startgame") then
		   if GetPlayer().components.inventory:Has("goldnugget", 100) then
			  local target0 = FindEntity(boxer, 30, function(guy) 
				  return guy:HasTag("cricket") and guy.components.inventoryitem and not guy.components.inventoryitem:IsHeld()
			  end )
			  if target0 then
				 boxer:AddTag("startgame")
				 boxer.AnimState:PlayAnimation("give")
				 GetPlayer().components.playercontroller:Enable(false)
				 TheCamera:SetTarget(target0)
				 target0:RemoveComponent("inventoryitem")
				 boxer.task = boxer:DoPeriodicTask(1, function(boxer)
					 if target0.components.health:IsDead() then
						if boxer.task then boxer.task:Cancel() boxer.task = nil end
						GetPlayer().components.inventory:ConsumeByName("goldnugget", 100)
						TheCamera:SetTarget(GetPlayer())
						GetPlayer().SoundEmitter:PlaySound("dontstarve/creatures/eyeballturret/shotexplo")
						boxer.AnimState:PlayAnimation("idle_onemanband1_loop",true)
						boxer:DoTaskInTime(2, function()
							boxer.AnimState:PlayAnimation("idle")
							local target1 = FindEntity(boxer, 30, function(guy) 
								return guy:HasTag("cricket0")
							end )
							if target1 then
							   target1:Remove()
							end
							boxer:RemoveTag("startgame")
							GetPlayer().components.playercontroller:Enable(true)
						end )
					 end
				 end )
				 local cricket0 = SpawnPrefab("slurper_pelt")
				 cricket0.Transform:SetPosition(pt.x+1.5, 0, pt.z+1.5)
				 cricket0.AnimState:SetBank("spider_queen")
				 cricket0.AnimState:SetBuild("spider_queen_build")
				 cricket0.AnimState:PlayAnimation("idle", true)
				 cricket0.Transform:SetFourFaced()
				 cricket0.entity:AddSoundEmitter()
				 cricket0.Transform:SetScale(0.3, 0.3, 0.3)
				 cricket0:RemoveComponent("stackable")
				 cricket0:RemoveComponent("tradable")
				 cricket0:RemoveComponent("inventoryitem")
				 cricket0:RemoveComponent("edible")
				 cricket0:RemoveComponent("burnable")
				 cricket0:RemoveComponent("propagator")
				 cricket0:RemoveComponent("deployable")
				 local brain = require "brains/abigailbrain"
				 cricket0:SetBrain(brain)
				 cricket0:AddComponent("lootdropper")
				 cricket0.components.lootdropper:SetLoot({"silk"})
				 cricket0:AddComponent("locomotor")
				 cricket0.components.locomotor.walkspeed = 5
				 cricket0.components.locomotor.runspeed = 8
				 cricket0:SetStateGraph("SGspiderqueen")
				 cricket0:AddComponent("follower")
				 cricket0.components.follower:SetLeader(boxer)
				 cricket0:AddComponent("health")
				 cricket0.components.health:SetMaxHealth(math.random(110,330))
				 cricket0:AddComponent("combat")
				 cricket0.components.combat:SetRetargetFunction(1, function(cricket0)
					 if not cricket0.components.health:IsDead() then
						 return FindEntity(cricket0, 20, function(guy)
							 if guy.components.health and not guy.components.health:IsDead() then
								return guy:HasTag("cricket")
							 end
						 end )
					 end
				 end )
				 cricket0.components.combat:SetKeepTargetFunction(function(cricket0, target) return target and target:IsValid() end )
				 cricket0.components.combat:SetAttackPeriod(2)
				 cricket0.components.combat:SetRange(1, 2)
				 cricket0.components.combat:SetDefaultDamage(math.random(22,55))
				 cricket0:ListenForEvent("death", function()
					 boxer.AnimState:PlayAnimation("give")
					 if boxer.task then boxer.task:Cancel() boxer.task = nil end
					 for k = 1, 100 do
						 local goldnugget = SpawnPrefab("goldnugget")
						 GetPlayer().components.inventory:GiveItem(goldnugget)
					 end
					 boxer:RemoveTag("startgame")
					 GetPlayer().components.playercontroller:Enable(true)
					 TheCamera:SetTarget(GetPlayer())
					 target0:AddComponent("inventoryitem")
					 target0.components.inventoryitem:ChangeImageName("spidereggsack")
				 end )
				 cricket0:AddTag("cricket0")
				 cricket0:AddTag("goodbye")
			  end
		   end
		end
	end
	local advert = SpawnPrefab("slurper_pelt")
	advert.Transform:SetPosition(pt.x-2, 0, pt.z-2)
	advert.AnimState:SetBank("barrel")
	advert.AnimState:SetBuild("monkey_barrel")
	advert.AnimState:PlayAnimation("idle", true)
	advert.Transform:SetScale(1.5, 1.5, 1.5)
	advert:RemoveComponent("stackable")
	advert:RemoveComponent("tradable")
	advert:RemoveComponent("inventoryitem")
	advert:RemoveComponent("edible")
	advert:RemoveComponent("deployable")
	MakeLargeBurnable(advert)
	MakeLargePropagator(advert)
	advert:AddTag("lightningrod")
	local light = advert.entity:AddLight()
	light:SetFalloff(1)
	light:SetIntensity(.8)
	light:SetRadius(10)
	light:SetColour(180/255, 195/255, 50/255)
	light:Enable(true)
	advert:DoPeriodicTask(6, function(advert)
		advert.AnimState:SetBloomEffectHandle("shaders/anim.ksh")
		advert:DoTaskInTime(3, function(advert) advert.AnimState:SetBloomEffectHandle("") end )
	end )
	advert:AddTag("goodbye")
end
local function OnDeploy (inst, pt)
	boxing(inst)
	inst.components.stackable:Get():Remove()
end
	inst:AddComponent("deployable")
	inst.components.deployable.ondeploy = OnDeploy
local function onsave(inst, data)
	if inst:HasTag("goodbye") then
		data.goodbye = true
	end
	if inst:HasTag("boxer") then
		data.boxer = true
	end
	if inst:HasTag("cricket") then
		data.cricket = true
	end
	data.colour_idx = inst.colour_idx
	data.health_num = inst.health_num
	data.damage_num = inst.damage_num
end
local function onload(inst, data)
	if data and data.goodbye then
	   inst:Remove()
	end
	if data and data.boxer then
	   boxing(inst)
	   inst:Remove()
	end
	if data and data.cricket then
		inst.AnimState:SetBank("spider_queen")
		inst.AnimState:SetBuild("spider_queen_build")
		inst.AnimState:PlayAnimation("idle", true)
		inst.Transform:SetFourFaced()
		inst.entity:AddSoundEmitter()
		inst.Transform:SetScale(0.3, 0.3, 0.3)
		inst.colour_idx = math.random(#colours)
		inst.AnimState:SetMultColour(colours[inst.colour_idx][1],colours[inst.colour_idx][2],colours[inst.colour_idx][3],1)
		inst.components.inventoryitem:ChangeImageName("spidereggsack")
		inst:RemoveComponent("stackable")
		inst:RemoveComponent("tradable")
		inst:RemoveComponent("edible")
		inst:RemoveComponent("burnable")
		inst:RemoveComponent("propagator")
		inst:RemoveComponent("deployable")
		local brain = require "brains/abigailbrain"
		inst:SetBrain(brain)
		inst:AddComponent("lootdropper")
		inst.components.lootdropper:SetLoot({"silk"})
		inst:AddComponent("locomotor")
		inst.components.locomotor.walkspeed = 5
		inst.components.locomotor.runspeed = 8
		inst:SetStateGraph("SGspiderqueen")
		inst:AddComponent("follower")
		inst.components.follower:SetLeader(GetPlayer())
		inst.health_num = math.random(100,300)
		inst.damage_num = math.random(20,50)
		inst:AddComponent("health")
		inst.components.health:SetMaxHealth(inst.health_num)
		inst:AddComponent("trader")
		inst.components.trader:SetAcceptTest(function(inst, item) 
			if item.prefab == "smallmeat" then
			   return inst.components.health:GetPercent() < 1
			end
			return false
		end )
		inst.components.trader.onaccept = function(inst, giver, item)
			inst.components.health:DoDelta(300)
		end
		inst:AddComponent("combat")
		inst.components.combat:SetRetargetFunction(1, function(inst)
			if not inst.components.health:IsDead() then
				return FindEntity(inst, 20, function(guy)
					if guy.components.health and not guy.components.health:IsDead() then
					   return guy:HasTag("cricket") or guy:HasTag("cricket0")
					end
				end )
			end
		end )
		inst.components.combat:SetKeepTargetFunction(function(inst, target) return target and target:IsValid() end )
		inst.components.combat:SetAttackPeriod(2)
		inst.components.combat:SetRange(1, 2)
		inst.components.combat:SetDefaultDamage(inst.damage_num)
		inst:AddTag("cricket")
	end
	if data and data.colour_idx then
	   inst.colour_idx = math.min(#colours, data.colour_idx)
	   inst.AnimState:SetMultColour(colours[inst.colour_idx][1],colours[inst.colour_idx][2],colours[inst.colour_idx][3],1)
	end
	if data and data.health_num then
	   inst.health_num = data.health_num
	   inst.components.health:SetMaxHealth(inst.health_num)
	   inst.components.health:DoDelta(inst.components.health.maxhealth)
	end
	if data and data.damage_num then
	   inst.damage_num = data.damage_num
	   inst.components.combat:SetDefaultDamage(inst.damage_num)
	end
end
	inst.OnSave = onsave
	inst.OnLoad = onload

	即可用啜食者皮种斗蜘蛛场（拿着1个啜食者皮对地面点鼠标右键，如果拿着多个啜食者皮，则不会种出来），给庄家100个黄金（拿着黄金对庄家点鼠标左键），可购买迷你蜘蛛，鼠标左键点蜘蛛，可将其放入物品栏，显示为蜘蛛卵的图标。如果想与庄家比赛，主角身上至少有100个黄金，将自己的一只蜘蛛放在庄家面前，鼠标左键点庄家，庄家会拿出另一只蜘蛛与你的蜘蛛PK。如果你赢了，将赢得100个黄金的奖金，如果输了就输掉100个黄金，并损失掉自己的蜘蛛。为防止作弊，比赛中主角操作将暂停，比赛结束后恢复。每只迷你蜘蛛的血量、攻击力都不同，如果你买到厉害的蜘蛛，一定要用心呵护，因为它就是你的摇钱树，给蜘蛛喂一块小肉（拿着小肉对蜘蛛点鼠标左键），可以为其补满血。你也可以多买几只蜘蛛，内部PK，挑选出好的品种，再与庄家对赌，会增大你的胜率。不想要斗蜘蛛场了，烧掉即可。啜食者皮可以打啜食者获得，也可在“巨型超市”中，花1-3个黄金购得

```  

