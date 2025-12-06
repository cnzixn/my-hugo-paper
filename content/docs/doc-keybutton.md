---
title: '按键 - 使用教程'
date: 2025-04-18
author: 'Bny'
summary: '本文介绍 BM000 模拟“按键操作”的功能，支持组合按键。'
tags:
- '资料'
aliases:
- 'keybutton'
comments: false
url: '/p/404/'
---


### 游戏截图

游戏内，新增一列按钮模拟“按键操作”，支持组合按键。

![](/img/1000225236.webp "第1页｜第2页")



### 文件目录

```shell
BM000  
├─ scripts  
│  └─ keybutton.lua  # 配置文件  
```

---

### 配置文件

```lua

-- BM000/scripts/keybutton.lua

-- 示例 (其他模组中的按键功能)
local fn_key_a_up = function()
    local doer=GetPlayer()
    doer.components.talker:Say("按键 A")
    print("按键 A")
end
local fn_key_b_up = function()
    local doer=GetPlayer()
    doer.components.talker:Say("按键 B")
    print("按键 B")
end
local fn_key_c_up = function()
    local doer=GetPlayer()
    doer.components.talker:Say("按键 C")
    print("按键 C")
end
local fn_key_d_up = function()
    local doer=GetPlayer()
    if TheInput:IsKeyDown(KEY_CTRL) and (not TheInput:IsKeyDown(KEY_SHIFT)) then
        doer.components.talker:Say("按键 Ctrl+D")
        print("按键 Ctrl+D")
    end
end
local fn_key_e_up = function()
    local doer=GetPlayer()
    if TheInput:IsKeyDown(KEY_CTRL) and TheInput:IsKeyDown(KEY_SHIFT) then
        doer.components.talker:Say("按键 Ctrl+Shift+E")
        print("按键 Ctrl+Shift+E")
    end
end
TheInput:AddKeyUpHandler(KEY_A, fn_key_a_up)
TheInput:AddKeyUpHandler(KEY_B, fn_key_b_up)
TheInput:AddKeyUpHandler(KEY_C, fn_key_c_up)
TheInput:AddKeyUpHandler(KEY_D, fn_key_d_up)
TheInput:AddKeyUpHandler(KEY_E, fn_key_e_up)

local keybutton = {

	-- 模拟键盘：key1(按下)，key2(按下)，key(按下)，key(抬起)，key2(抬起)，key1(抬起)
	-- key: 必须，字符/键值，参考 scripts/constants.lua 文件。
	-- str: 可选，设置按钮上显示的“字符串”。
	-- key1: 可选，字符/键值，用于组合按键。
	-- key2: 可选，字符/键值，用于组合按键。

	{key="A"},
	{key="B"},
	{key="C"},
	{key="D", str="D", key1="CTRL"},
	{key=KEY_E, str="E", key1=KEY_CTRL, key2=KEY_SHIFT},

	{key=KEY_T, str="T"},
	{key=KEY_L, str="变身"},
	{key=KEY_R, str="跳跃"},
	{key=KEY_F11, str="查看"},
}

return keybutton

```


### 配置文件 - 进阶版

下面是我自用的配置文件，大佬可以自行更改。小白可以喂给 AI，然后提出修改要求。

```lua

--------------------------------------------------
-- 按键功能：代码建议放到模组的 modmain.lua 文件(否则，代码出错，可能导致按键配置失效)

-- 使用物品
local function useItem(doer, slot)
	local item = nil
	local target = nil
	local pt = doer:GetPosition()
	-- 物品栏 slot 为数字
	-- 装备栏 slot 为字符串
	local is_item_slot = type(0)==type(slot)
	local is_equip_slot = table.contains(EQUIPSLOTS, slot)
	if is_equip_slot then
		item = doer.components.inventory:GetEquippedItem(slot)
	else
		item = doer.components.inventory:GetItemInSlot(slot)
	end
	-- 没有物品，无法“使用”
	if not item then return end
	if is_item_slot and item.components.edible then
		if true then
			local buff = BufferedAction(doer, target, ACTIONS.EAT, item, pt)
			doer.components.locomotor:PushAction(buff, true)
		end
	elseif is_item_slot and item.components.healer then
		if true then
			local buff = BufferedAction(doer, target, ACTIONS.HEAL, item, pt)
			doer.components.locomotor:PushAction(buff, true)
		end
	elseif is_item_slot and item.components.instrument then
		if true then
			local buff = BufferedAction(doer, target, ACTIONS.PLAY, item, pt)
			doer.components.locomotor:PushAction(buff, true)
		end
	elseif is_item_slot and item.components.equippable then
		if true then
			local buff = BufferedAction(doer, target, ACTIONS.EQUIP, item, pt)
			doer.components.locomotor:PushAction(buff, true)
		end
	elseif is_item_slot and item.components.deployable then
		if item.components.deployable:CanDeploy(pt) then
			local buff = BufferedAction(doer, target, ACTIONS.DEPLOY, item, pt)
			doer.components.locomotor:PushAction(buff, true)
		end
	elseif is_equip_slot and item.components.useableitem then
		if item.components.useableitem:CanInteract()  then
			item.components.useableitem:StartUsingItem()
		end
	elseif is_equip_slot and item.components.terraformer then
		if item.components.terraformer:CanTerraformPoint(pt) then
			local buff = BufferedAction(doer, target, ACTIONS.TERRAFORM, item, pt)
			doer.components.locomotor:PushAction(buff, true)
		end
	elseif is_equip_slot and item.components.blinkstaff then
		pt = item.components.blinkstaff:GetBlinkPoint()
		item.components.blinkstaff:Blink(pt, doer)
	elseif is_equip_slot and item.components.throwable then
		pt = item.components.throwable:GetThrowPoint()
		item.components.throwable:Throw(pt, doer)
	else
		-- 其他
		local targ = item
		if targ and targ.components.inspectable then
			local desc = targ.components.inspectable:GetDescription(doer)
			if desc then
				doer.components.locomotor:Stop()
				doer.components.talker:Say(desc, 2.5, targ.components.inspectable.noanim)
			end
		end
	end
end

local fn_key_1_up = function()
    local doer=GetPlayer()
    local slot = 1  -- 物品栏 1
    useItem(doer, slot)
end
local fn_key_2_up = function()
    local doer=GetPlayer()
    local slot = 2  -- 物品栏 2
    useItem(doer, slot)
end
local fn_key_3_up = function()
    local doer=GetPlayer()
    local slot = EQUIPSLOTS.HANDS  -- 装备栏 手
    useItem(doer, slot)
end
local fn_key_4_up = function()
    local doer=GetPlayer()
    local slot = EQUIPSLOTS.BODY  -- 装备栏 身
    useItem(doer, slot)
end
local fn_key_5_up = function()
    local doer=GetPlayer()
    local slot = EQUIPSLOTS.HEAD  -- 装备栏 头
    useItem(doer, slot)
end
TheInput:AddKeyUpHandler(KEY_1, fn_key_1_up)
TheInput:AddKeyUpHandler(KEY_2, fn_key_2_up)
TheInput:AddKeyUpHandler(KEY_3, fn_key_3_up)
TheInput:AddKeyUpHandler(KEY_4, fn_key_4_up)
TheInput:AddKeyUpHandler(KEY_5, fn_key_5_up)

--------------------------------------------------





--------------------------------------------------
-- 按键配置：用于设置“按键”的映射关系，修改按钮显示的文字。

-- 此文件会在进入游戏后加载，可使用 GetPlayer 等函数。
local player = GetPlayer()

local data_keybutton = {

	-- 模拟键盘：key1(按下)，key2(按下)，key(按下)，key(抬起)，key2(抬起)，key1(抬起)
	-- key: 必须，字符/键值，参考 scripts/constants.lua 文件。
	-- str: 可选，设置按钮上显示的“字符串”。
	-- key1: 可选，字符/键值，用于组合按键。
	-- key2: 可选，字符/键值，用于组合按键。

	{key=KEY_5, str="[ 5 ]", },
	{key=KEY_4, str="[ 4 ]", },
	{key=KEY_3, str="[ 3 ]", },
	{key=KEY_2, str="[ 2 ]", },
	{key=KEY_1, str="[ 1 ]", },

	{key=KEY_T, str="T"},
	player.prefab=="wharang" and {key=KEY_L, str="变身"} or nil,
	player.prefab=="wharang" and {key=KEY_R, str="跳跃"} or nil,
	player.prefab=="wharang" and {key=KEY_F11, str="查看"} or nil,
}

return data_keybutton

--------------------------------------------------


```




---


