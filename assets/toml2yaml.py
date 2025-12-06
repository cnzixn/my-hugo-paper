#!/data/data/com.termux/files/usr/bin/python3


# cd /sdcard/acode/my-hugo-paper/assets/ ; python toml2yaml.py

import os
import re
import json
import toml
import yaml
from pathlib import Path
from datetime import datetime, date, timezone

# ===== 配置 =====
CONTENT_DIR = "/sdcard/acode/my-hugo-paper/content"
MAPPING_FILE = "/sdcard/acode/my-hugo-paper/assets/toml2yaml_data.json"
URL_PREFIX = "/p/"

# ===== 映射文件处理 =====
def ensure_mapping_file_exists():
    mapping_path = Path(MAPPING_FILE)
    if not mapping_path.exists():
        with open(mapping_path, 'w', encoding='utf-8') as f:
            json.dump({}, f, ensure_ascii=False, indent=4)
        print(f"📄 创建映射文件: {MAPPING_FILE}")

def load_mapping():
    with open(MAPPING_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_mapping(mapping):
    with open(MAPPING_FILE, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, ensure_ascii=False, indent=4)

# ===== 文件唯一标识 =====
def get_file_identifier(file_path):
    content_dir = Path(CONTENT_DIR).resolve()
    file_path_abs = Path(file_path).resolve()
    return str(file_path_abs.relative_to(content_dir))

# ===== 读取文件的weight和date值 =====
def get_file_sort_keys(file_path):
    """
    读取单个md文件的排序键：(weight, -date_timestamp)
    weight默认无穷大，date默认最早时间（timestamp=0）
    """
    weight = float('inf')
    date_timestamp = 0  # 默认为最早时间（1970-01-01），确保无date的排最后

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 先试TOML格式
    toml_pattern = re.compile(r'^\+\+\+\n(.*?)\n\+\+\+', re.DOTALL)
    toml_match = toml_pattern.search(content)
    if toml_match:
        try:
            data = toml.loads(toml_match.group(1))
            if 'weight' in data:
                weight = data['weight']
            if 'date' in data:
                # 解析date为时间戳（兼容date、datetime、字符串）
                date_val = data['date']
                if isinstance(date_val, str):
                    # 字符串转datetime（处理Z时区）
                    date_obj = datetime.fromisoformat(date_val.replace('Z', '+00:00'))
                elif isinstance(date_val, date) and not isinstance(date_val, datetime):
                    # date对象转datetime（默认UTC 0点）
                    date_obj = datetime.combine(date_val, datetime.min.time(), tzinfo=timezone.utc)
                else:
                    # datetime对象直接使用
                    date_obj = date_val
                # 确保datetime有时区，无则默认UTC
                if date_obj.tzinfo is None or date_obj.tzinfo.utcoffset(date_obj) is None:
                    date_obj = date_obj.replace(tzinfo=timezone.utc)
                date_timestamp = date_obj.timestamp()
        except (toml.TomlDecodeError, ValueError):
            pass  # 解析失败保持默认值
    
    # 再试YAML格式
    else:
        yaml_pattern = re.compile(r'^---\n(.*?)\n---', re.DOTALL)
        yaml_match = yaml_pattern.search(content)
        if yaml_match:
            try:
                data = yaml.safe_load(yaml_match.group(1)) or {}
                if 'weight' in data:
                    weight = data['weight']
                if 'date' in data:
                    # 解析date为时间戳（兼容date、datetime、字符串）
                    date_val = data['date']
                    if isinstance(date_val, str):
                        # 字符串转datetime（处理Z时区）
                        date_obj = datetime.fromisoformat(date_val.replace('Z', '+00:00'))
                    elif isinstance(date_val, date) and not isinstance(date_val, datetime):
                        # date对象转datetime（默认UTC 0点）
                        date_obj = datetime.combine(date_val, datetime.min.time(), tzinfo=timezone.utc)
                    else:
                        # datetime对象直接使用
                        date_obj = date_val
                    # 确保datetime有时区，无则默认UTC
                    if date_obj.tzinfo is None or date_obj.tzinfo.utcoffset(date_obj) is None:
                        date_obj = date_obj.replace(tzinfo=timezone.utc)
                    date_timestamp = date_obj.timestamp()
            except (yaml.YAMLError, ValueError):
                pass  # 解析失败保持默认值

    # 返回排序键：先按weight升序，再按-date_timestamp升序（即date降序）
    return (weight, -date_timestamp)

# ===== 自定义YAML处理器（键无引号，字符串值单引号）=====
def str_presenter(dumper, data):
    """仅对字符串值添加单引号，键保持无引号"""
    if '\n' in data:
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|')
    return dumper.represent_scalar('tag:yaml.org,2002:str', data, style="'")

yaml.add_representer(str, str_presenter)

# ===== 处理文件 =====
def process_file(file_path, article_id):
    """根据排序后的ID处理文件，生成对应url"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_url = f"{URL_PREFIX}{article_id}/"

    # 1. 处理TOML格式
    toml_pattern = re.compile(r'^\+\+\+\n(.*?)\n\+\+\+', re.DOTALL)
    toml_match = toml_pattern.search(content)
    if toml_match:
        try:
            data = toml.loads(toml_match.group(1))
            data['url'] = new_url
            yaml_str = yaml.dump(
                data,
                allow_unicode=True,
                sort_keys=False,
                default_flow_style=False
            )
            yaml_str = re.sub(r"'(.*?)':", r"\1:", yaml_str)
            new_front = f"---\n{yaml_str}---"
            new_content = toml_pattern.sub(new_front, content)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ 处理完成: {file_path} (ID: {article_id})")
            return
        except toml.TomlDecodeError as e:
            print(f"❌ TOML错误 {file_path}: {e}")
            return

    # 2. 处理YAML格式
    yaml_pattern = re.compile(r'^---\n(.*?)\n---', re.DOTALL)
    yaml_match = yaml_pattern.search(content)
    if yaml_match:
        try:
            data = yaml.safe_load(yaml_match.group(1)) or {}
            data['url'] = new_url
            yaml_str = yaml.dump(
                data,
                allow_unicode=True,
                sort_keys=False,
                default_flow_style=False
            )
            yaml_str = re.sub(r"'(.*?)':", r"\1:", yaml_str)
            new_front = f"---\n{yaml_str}---"
            new_content = yaml_pattern.sub(new_front, content)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ 处理完成: {file_path} (ID: {article_id})")
            return
        except yaml.YAMLError as e:
            print(f"❌ YAML错误 {file_path}: {e}")
            return

    # 3. 无Front Matter时添加
    new_front = f"---\nurl: '{new_url}'\n---\n"
    new_content = new_front + content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"✅ 新增Front Matter: {file_path} (ID: {article_id})")

# ===== 主函数 =====
def main():
    ensure_mapping_file_exists()
    mapping = load_mapping()

    # 1. 不在content根目录 2. 文件名不是_index.md 3. 不在content/app目录下
    md_files = []
    for file in Path(CONTENT_DIR).glob("**/*.md"):
        if (file.parent.resolve() != Path(CONTENT_DIR).resolve() 
            and file.name != "_index.md" 
            and "content/app" not in str(file.parent.resolve())):
            md_files.append(file)

    if not md_files:
        print("⚠️  未找到任何符合条件的md文件（需在子目录且非_index.md）")
        return

    # 2. 排序：先按weight升序，weight相同则按date降序
    sorted_files = sorted(md_files, key=lambda x: get_file_sort_keys(x))

    # 3. 按排序结果分配ID并处理文件，更新映射
    for idx, file_path in enumerate(sorted_files, start=1):
        file_identifier = get_file_identifier(file_path)
        mapping[file_identifier] = str(idx)  # 用排序索引作为ID
        process_file(file_path, str(idx))

    # 4. 清理映射中已删除的文件（可选，保持映射文件干净）
    existing_identifiers = [get_file_identifier(f) for f in md_files]
    cleaned_mapping = {k: v for k, v in mapping.items() if k in existing_identifiers}
    mapping = cleaned_mapping

    # 5. 保存更新后的映射
    save_mapping(mapping)
    print(f"🎉 处理完成！共处理 {len(md_files)} 个文件（仅子目录，排除根目录及_index.md）")

if __name__ == "__main__":
    main()