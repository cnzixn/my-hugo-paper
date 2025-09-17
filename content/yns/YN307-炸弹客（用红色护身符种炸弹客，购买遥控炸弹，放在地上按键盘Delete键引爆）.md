---
title: 'YN307-炸弹客（用红色护身符种炸弹客，购买遥控炸弹，放在地上按键盘Delete键引爆）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN307'
comments: false
url: '/p/333/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

三０七.炸弹客（用红色护身符种炸弹客，购买遥控炸弹，放在地上按键盘Delete键引爆）

	1.用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("playeractionpicker")的下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_DELETE, function()
	GetPlayer().SoundEmitter:PlaySound("dontstarve/wilson/equip_item_gold")
	inst:DoTaskInTime(0.1, function() 
		local pos = Vector3(inst.Transform:GetWorldPosition())
		local ents = TheSim:FindEntities(pos.x,pos.y,pos.z, 100)
		for k,v in pairs(ents) do
			if v:HasTag("bomballright") and v.components.inventoryitem and not v.components.inventoryitem:IsHeld() then
			   local pos1 = Vector3(v.Transform:GetWorldPosition())
			   local ents1 = TheSim:FindEntities(pos1.x,pos1.y,pos1.z, 15)
			   for k,i in pairs(ents1) do
				   if i.components.combat and i.components.health and not i.components.health:IsDead() and not i:HasTag("player") then
					  SpawnPrefab("ground_chunks_breaking").Transform:SetPosition(i.Transform:GetWorldPosition())
					  i.components.health:Kill()
				   end
				   if i.components.workable and i.components.workable.workleft > 0 and not i.components.inventoryitem then
					  SpawnPrefab("ground_chunks_breaking").Transform:SetPosition(i.Transform:GetWorldPosition())
					  i.components.workable:Destroy(v)
				   end
			   end
			   GetPlayer().SoundEmitter:PlaySound("dontstarve_DLC001/creatures/glommer/foot_ground")
			   SpawnPrefab("collapse_big").Transform:SetPosition(v.Transform:GetWorldPosition())
			   SpawnPrefab("explode_small").Transform:SetPosition(v.Transform:GetWorldPosition())
			   SpawnPrefab("groundpoundring_fx").Transform:SetPosition(v.Transform:GetWorldPosition())
			   GetClock():DoLightningLighting()
			   GetPlayer().components.playercontroller:ShakeCamera(v, "FULL", 0.7, 0.02, .5, 40)
			   v:Remove()
			end
		end
	end )
end )


	2.用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/amulet.lua文件，在inst.AnimState:PlayAnimation("redamulet")的下一行插入以下内容：

local function makebomber(inst)
	local pt = inst:GetPosition()
	local bomber = SpawnPrefab("amulet")
	bomber.Transform:SetPosition(pt.x, pt.y, pt.z)
	bomber.AnimState:SetBank("wilson")
	bomber.AnimState:SetBuild("wx78")
	bomber.AnimState:OverrideSymbol("swap_hat", "hat_catcoon", "swap_hat")
	bomber.AnimState:OverrideSymbol("swap_body", "swap_krampus_sack", "backpack")
	bomber.AnimState:OverrideSymbol("swap_body", "swap_krampus_sack", "swap_body")
	bomber.AnimState:Show("HAT")
	bomber.AnimState:Show("HAT_HAIR")
	bomber.AnimState:Hide("HAIR_NOHAT")
	bomber.AnimState:Hide("HAIR")
	bomber.AnimState:Hide("ARM_carry")
	bomber.AnimState:Show("ARM_normal")
	bomber.Transform:SetFourFaced()
	bomber.AnimState:PlayAnimation("idle")
	bomber:RemoveComponent("equippable")
	bomber:RemoveComponent("inventoryitem")
	bomber:RemoveComponent("finiteuses")
	bomber:RemoveComponent("deployable")
	MakeLargeBurnable(bomber)
	MakeLargePropagator(bomber)
	bomber:AddComponent("trader")
	bomber.components.trader:SetAcceptTest(function(bomber, item) 
		if GetPlayer().components.inventory:Has("goldnugget", 10) then
		   if item.prefab == "goldnugget" then
			  return true
		   end
		end
		return false
	end )
	bomber.components.trader.onaccept = function(bomber, giver, item)
		GetPlayer().components.inventory:ConsumeByName("goldnugget", 9)
		GetPlayer().SoundEmitter:PlaySound("dontstarve/HUD/research_available")
		bomber.AnimState:PlayAnimation("give")
		local bomb = SpawnPrefab("amulet")
		bomb.AnimState:SetBank("bee_mine_maxwell")
		bomb.AnimState:SetBuild("bee_mine_maxwell")
		bomb.AnimState:PlayAnimation("idle")
		bomb.Transform:SetScale(0.8, 0.8, 0.8)
		bomb.AnimState:SetMultColour(255/255,255/255,0/255,1)
		bomb.AnimState:SetBloomEffectHandle("shaders/anim.ksh")
		bomb:AddComponent("named")
		bomb.components.named:SetName("Bomb")
		local minimap = bomb.entity:AddMiniMapEntity()
		minimap:SetIcon( "beemine.png" )
		bomb:RemoveComponent("equippable")
		bomb:RemoveComponent("inventoryitem")
		bomb:RemoveComponent("finiteuses")
		bomb:RemoveComponent("deployable")
		bomb:AddComponent("inventoryitem")
		bomb.components.inventoryitem:ChangeImageName("beemine")
		bomb.components.inventoryitem:SetOnDroppedFn(function()
			bomb:AddTag("bomballright")
		end )
		bomb.components.inventoryitem:SetOnPickupFn(function()
			bomb:RemoveTag("bomballright")
		end )
		bomb.components.inventoryitem:SetOnPutInInventoryFn(function()
			bomb:RemoveTag("bomballright")
		end )
		bomb:AddTag("bomb")
		GetPlayer().components.inventory:GiveItem(bomb)
	end
	bomber:AddTag("bomber")
	for k = 1, 11 do
		local result_offset = FindValidPositionByFan(1 * 2 * PI, 2, 11, function(offset)
			local x,y,z = (pt + offset):Get()
			local ents = TheSim:FindEntities(x,y,z , 1)
			return not next(ents) 
		end)
		if result_offset then
		   local bombbye = SpawnPrefab("amulet")
		   bombbye.Transform:SetPosition((pt + result_offset):Get())
		   bombbye.AnimState:SetBank("bee_mine_maxwell")
		   bombbye.AnimState:SetBuild("bee_mine_maxwell")
		   bombbye.AnimState:PlayAnimation("idle")
		   bombbye.Transform:SetScale(0.8, 0.8, 0.8)
		   bombbye.AnimState:SetMultColour(255/255,255/255,0/255,1)
		   bombbye.AnimState:SetBloomEffectHandle("shaders/anim.ksh")
		   bombbye:RemoveComponent("equippable")
		   bombbye:RemoveComponent("inventoryitem")
		   bombbye:RemoveComponent("finiteuses")
		   bombbye:RemoveComponent("deployable")
		   MakeLargeBurnable(bombbye)
		   MakeLargePropagator(bombbye)
		   bombbye:AddTag("NOCLICK")
		   bombbye:AddTag("bombbye")
		end
	end
end
local function OnDeploy (inst, pt)
	makebomber(inst)
	inst:Remove()
end
	inst:AddComponent("deployable")
	inst.components.deployable.ondeploy = OnDeploy
local function onsave(inst, data)
	if inst:HasTag("bomber") then
	   data.bomber = true
	end
	if inst:HasTag("bombbye") then
	   data.bombbye = true
	end
	if inst:HasTag("bomb") then
	   data.bomb = true
	end
	if inst:HasTag("bomballright") then
	   data.bomballright = true
	end
end
local function onload(inst, data)
  if data and data.bomber then
	makebomber(inst)
	inst:Remove()
  end
  if data and data.bombbye then
	inst:Remove()
  end
  if data and data.bomb then
	inst.AnimState:SetBank("bee_mine_maxwell")
	inst.AnimState:SetBuild("bee_mine_maxwell")
	inst.AnimState:PlayAnimation("idle")
	inst.Transform:SetScale(0.8, 0.8, 0.8)
	inst.AnimState:SetMultColour(255/255,255/255,0/255,1)
	inst.AnimState:SetBloomEffectHandle("shaders/anim.ksh")
	inst:AddComponent("named")
	inst.components.named:SetName("Bomb")
	local minimap = inst.entity:AddMiniMapEntity()
	minimap:SetIcon( "beemine.png" )
	inst:RemoveComponent("equippable")
	inst:RemoveComponent("inventoryitem")
	inst:RemoveComponent("finiteuses")
	inst:RemoveComponent("deployable")
	inst:AddComponent("inventoryitem")
	inst.components.inventoryitem:ChangeImageName("beemine")
	inst.components.inventoryitem:SetOnDroppedFn(function()
		inst:AddTag("bomballright")
	end )
	inst.components.inventoryitem:SetOnPickupFn(function()
		inst:RemoveTag("bomballright")
	end )
	inst.components.inventoryitem:SetOnPutInInventoryFn(function()
		inst:RemoveTag("bomballright")
	end )
	inst:AddTag("bomb")
  end
  if data and data.bomballright then
	inst:AddTag("bomballright")
  end
end
	inst.OnSave = onsave
	inst.OnLoad = onload

	即可用红色护身符种炸弹客，给炸弹客10个黄金（拿着黄金对炸弹客点鼠标左键），可购买遥控炸弹，将炸弹放在地上，按键盘Delete键可遥控引爆，能炸死除主角外的任何生物，炸毁建筑、树木等。遥控炸弹在小地图上显示为炸弹图标，引爆时不要让同伴靠近。不想要炸弹客了，烧掉即可（拿着火炬对其点鼠标右键）。红色护身符在魔法选项（画着红骷髅）下，用3个黄金、2个噩梦燃料、1个红宝石制造

```  

