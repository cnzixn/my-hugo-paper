---
title: 'YN309-度假营地（按键盘B键租赁度假营地，各种设施一应俱全，再按B键退房）'
date: '2025-04-23'
author: 'Bny'
tags:
- '易宁'
aliases:
- 'YN309'
comments: false
url: '/p/349/'
---

> 代码来源于“易宁”大佬的分享，仅供学习，不要直接复制粘贴。

原帖链接：[http://bbs.3dmgame.com/thread-3859071-1-1.html](http://bbs.3dmgame.com/thread-3859071-1-1.html)

---

```lua  

三０九.度假营地（按键盘B键租赁度假营地，各种设施一应俱全，再按B键退房）

	用MT管理器打开游戏目录/assets/DLC0002/scripts/prefabs/player_common.lua文件，在inst:AddComponent("playeractionpicker")的下一行插入以下内容：

TheInput:AddKeyUpHandler(KEY_B, function()
	if not inst:HasTag("campsite") then
	   if inst.components.inventory:Has("goldnugget", 50) then
		  inst.components.inventory:ConsumeByName("goldnugget", 50)
		  GetPlayer().SoundEmitter:PlaySound("dontstarve/HUD/research_available")
		  inst:AddTag("campsite")
		  local pt = inst:GetPosition()
		  local pt0 = Vector3(inst.Transform:GetWorldPosition())
		  for k = 1, 50 do
			  local result_offset = FindValidPositionByFan(1 * 2 * PI, 8.5, 50, function(offset)
				  local x,y,z = (pt0 + offset):Get()
				  local ents = TheSim:FindEntities(x,y,z , 1)
				  return not next(ents) 
			  end )
			  if result_offset then
				 local wall = SpawnPrefab("wall_wood")
				 wall.Transform:SetScale(0.65,0.65,0.65)
				 MakeObstaclePhysics(wall, .25)
				 wall:RemoveComponent("workable")
				 wall.components.health:SetInvincible(true)
				 wall.persists = false
				 wall:AddTag("tempbuilding")
				 wall.Transform:SetPosition((pt0 + result_offset):Get())
				 wall.components.inspectable.getstatus = function(wall)
					 wall.Transform:SetScale(0.65, 0.1, 0.65)
					 wall.Physics:SetActive(false)
					 GetPlayer().SoundEmitter:PlaySound("dontstarve/common/destroy_wood")
					 wall:DoTaskInTime(5, function(wall)
						 wall.Transform:SetScale(0.65, 0.65, 0.65)
						 wall.Physics:SetActive(true)
						 GetPlayer().SoundEmitter:PlaySound("dontstarve/common/destroy_wood")
					 end )
				 end
			  end
		  end
		  local building1 = SpawnPrefab("tent")
		  building1.Transform:SetPosition(pt.x-4, 0, pt.z-4)
		  building1.AnimState:SetMultColour(255/255,105/255,0/255,1)
		  building1.persists = false
		  building1:AddTag("tempbuilding")
		  local building2 = SpawnPrefab("ancient_altar")
		  building2.Transform:SetPosition(pt.x-4+2.5, 0, pt.z-4-2.5)
		  building2.Transform:SetScale(0.45,0.45,0.45)
		  building2.persists = false
		  building2:AddTag("NOCLICK")
		  building2:AddTag("tempbuilding")
		  local building3 = SpawnPrefab("lightning_rod")
		  building3.Transform:SetPosition(pt.x-4-2.4, 0, pt.z-4+2.4)
		  building3.Transform:SetScale(0.7,0.7,0.7)
		  building3.persists = false
		  building3:AddTag("NOCLICK")
		  building3:AddTag("tempbuilding")
		  local building4 = SpawnPrefab("ruins_table")
		  building4.Transform:SetPosition(pt.x+3.3, 0, pt.z-3.3)
		  building4.persists = false
		  building4:AddTag("NOCLICK")
		  building4:AddTag("tempbuilding")
		  local building5 = SpawnPrefab("ruins_chair")
		  building5.Transform:SetPosition(pt.x+4.9, 0, pt.z-4.9)
		  building5.persists = false
		  building5:AddTag("NOCLICK")
		  building5:AddTag("tempbuilding")
		  local building6 = SpawnPrefab("cookpot")
		  building6.Transform:SetPosition(pt.x+4.3, 0, pt.z+4.3)
		  building6.Transform:SetScale(0.7,0.7,0.7)
		  building6.persists = false
		  building6:AddTag("tempbuilding")
		  local building7 = SpawnPrefab("icebox")
		  building7.Transform:SetPosition(pt.x+4.5-1.3, 0, pt.z+4.5+1.3)
		  building7.persists = false
		  building7:AddTag("tempbuilding")
		  for k = 1, 3 do
			  local foodnames = {"butterflymuffin","frogglebunwich","taffy","pumpkincookie","stuffedeggplant","fishsticks","honeynuggets","honeyham","dragonpie","kabobs","mandrakesoup","baconeggs","meatballs","bonestew","perogies","turkeydinner","ratatouille","jammypreserves","fruitmedley","fishtacos","waffles","unagi","flowersalad","icecream","watermelonicle","trailmix","hotchili","guacamole"}
			  local foodname = foodnames[math.random(#foodnames)]
			  local food = SpawnPrefab(foodname)
			  building7.components.container:GiveItem(food)
		  end
		  local building8 = SpawnPrefab("dragonflychest")
		  building8.Transform:SetPosition(pt.x+3.8+3, 0, pt.z-3.8+3)
		  building8.persists = false
		  building8:AddTag("tempbuilding")
		  local lantern = SpawnPrefab("lantern")
		  building8.components.container:GiveItem(lantern)
		  if not GetSeasonManager():IsSummer() then
			 local building9 = SpawnPrefab("firepit")
			 building9.Transform:SetPosition(pt.x, 0, pt.z)
			 building9:RemoveAllEventCallbacks()
			 building9:ListenForEvent("onextinguish", function(building9)
				 if building9.components.cooker then
					building9:RemoveComponent("cooker")
				 end
				 if building9.components.fueled then
					building9.components.fueled:InitializeFuelLevel(0)
				 end
			 end )
			 building9:ListenForEvent("onignite", function(building9)
				 if not building9.components.cooker then
					building9:AddComponent("cooker")
				 end
			 end )
			 building9.persists = false
			 building9:AddTag("tempbuilding")
			 for k = 1, 10 do
				 local log = SpawnPrefab("log")
				 building8.components.container:GiveItem(log)
			 end
		  else
			 local building9 = SpawnPrefab("coldfirepit")
			 building9.Transform:SetPosition(pt.x, 0, pt.z)
			 building9.persists = false
			 building9:AddTag("tempbuilding")
			 for k = 1, 10 do
				 local nitre = SpawnPrefab("nitre")
				 building8.components.container:GiveItem(nitre)
			 end
		  end
		  local building10 = SpawnPrefab("firesuppressor")
		  building10.Transform:SetPosition(pt.x-4+3, 0, pt.z+4+3)
		  building10.Transform:SetScale(0.8,0.8,0.8)
		  building10.persists = false
		  building10:AddTag("tempbuilding")
		  local building11 = SpawnPrefab("eyeturret")
		  building11.Transform:SetPosition(pt.x-4+1, 0, pt.z+4+1)
		  building11.components.combat:SetAttackPeriod(0.5)
		  if building11.components.machine then building11:RemoveComponent("machine") end
		  building11.persists = false
		  building11:AddTag("tempbuilding")
		  local building12 = SpawnPrefab("pumpkin_lantern")
		  building12.Transform:SetPosition(pt.x-4-2, 0, pt.z+4-2)
		  building12.Transform:SetScale(1.5,1.5,1.5)
		  building12.components.inventoryitem.canbepickedup = false
		  building12.persists = false
		  building12:AddTag("NOCLICK")
		  building12:AddTag("tempbuilding")
	   end
	else
	   GetPlayer().SoundEmitter:PlaySound("dontstarve/HUD/research_available")
	   inst:RemoveTag("campsite")
	   local pos = Vector3(inst.Transform:GetWorldPosition())
	   local ents = TheSim:FindEntities(pos.x,pos.y,pos.z, 3000)
	   for k,v in pairs(ents) do
		   if v:HasTag("tempbuilding") then
			  v:Remove()
		   end
	   end
	end
end )

	即可在身上有50个黄金时，在空旷的地方，按键盘B键租赁度假营地（身上黄金不足时无法租赁），再次按B键退房。度假营地外有围墙保护（鼠标左键点围墙可开门，5秒后自动关门），内有火堆、帐篷、锅、箱子、冰箱、南瓜灯等生活设施，还配有眼睛炮塔、灭火器、避雷针等安全设备，其中箱子里有火堆燃料（夏天为硝石，其余季节为木头），还提供一盏提灯供你外出使用，冰箱里有3份料理（品种随机），让你在野外也可以品尝新鲜美味。由于环保原因，度假营地为临时设施，存档退出后再读档，度假营地将消失，记得之前取出箱子中的私人物品哦

```  

