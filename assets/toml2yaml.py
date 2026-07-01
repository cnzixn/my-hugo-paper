#!/data/data/com.termux/files/usr/bin/python3

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
    weight = float('inf')
    date_timestamp = 0

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    toml_pattern = re.compile(r'^\+\+\+\n(.*?)\n\+\+\+', re.DOTALL)
    toml_match = toml_pattern.search(content)
    if toml_match:
        try:
            data = toml.loads(toml_match.group(1))
            if 'weight' in data:
                weight = data['weight']
            if 'date' in data:
                date_val = data['date']
                if isinstance(date_val, str):
                    date_obj = datetime.fromisoformat(date_val.replace('Z', '+00:00'))
                elif isinstance(date_val, date) and not isinstance(date_val, datetime):
                    date_obj = datetime.combine(date_val, datetime.min.time(), tzinfo=timezone.utc)
                else:
                    date_obj = date_val
                if date_obj.tzinfo is None or date_obj.tzinfo.utcoffset(date_obj) is None:
                    date_obj = date_obj.replace(tzinfo=timezone.utc)
                date_timestamp = date_obj.timestamp()
        except (toml.TomlDecodeError, ValueError):
            pass
    
    yaml_pattern = re.compile(r'^---\n(.*?)\n---', re.DOTALL)
    yaml_match = yaml_pattern.search(content)
    if yaml_match:
        try:
            data = yaml.safe_load(yaml_match.group(1)) or {}
            if 'weight' in data:
                weight = data['weight']
            if 'date' in data:
                date_val = data['date']
                if isinstance(date_val, str):
                    date_obj = datetime.fromisoformat(date_val.replace('Z', '+00:00'))
                elif isinstance(date_val, date) and not isinstance(date_val, datetime):
                    date_obj = datetime.combine(date_val, datetime.min.time(), tzinfo=timezone.utc)
                else:
                    date_obj = date_val
                if date_obj.tzinfo is None or date_obj.tzinfo.utcoffset(date_obj) is None:
                    date_obj = date_obj.replace(tzinfo=timezone.utc)
                date_timestamp = date_obj.timestamp()
        except (yaml.YAMLError, ValueError):
            pass

    return (weight, -date_timestamp)

# ===== 自定义YAML处理器 =====
def str_presenter(dumper, data):
    if '\n' in data:
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|')
    return dumper.represent_scalar('tag:yaml.org,2002:str', data, style="'")

yaml.add_representer(str, str_presenter)

# ===== 处理文件 =====
def process_file(file_path, article_id):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_url = f"{URL_PREFIX}{article_id}/"

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

    new_front = f"---\nurl: '{new_url}'\n---\n"
    new_content = new_front + content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"✅ 新增Front Matter: {file_path} (ID: {article_id})")

# ===== 获取新文件可用最小空闲ID =====
def get_next_free_id(mapping):
    used_ids = set(int(v) for v in mapping.values())
    next_id = 1
    while next_id in used_ids:
        next_id += 1
    return str(next_id)

# ===== 主函数 =====
def main():
    ensure_mapping_file_exists()
    mapping = load_mapping()

    # 筛选md文件
    md_files = []
    for file in Path(CONTENT_DIR).glob("**/*.md"):
        if (file.parent.resolve() != Path(CONTENT_DIR).resolve() 
            and file.name != "_index.md" 
            and "content/app" not in str(file.parent.resolve())):
            md_files.append(file)

    if not md_files:
        print("⚠️  未找到任何符合条件的md文件（需在子目录且非_index.md）")
        return

    # 按规则排序，仅用于新文件分配ID顺序
    sorted_files = sorted(md_files, key=lambda x: get_file_sort_keys(x))

    # 分离旧文件、新文件
    old_files = []
    new_files = []
    file_id_map = {}
    for f in sorted_files:
        fid = get_file_identifier(f)
        if fid in mapping:
            old_files.append(f)
            file_id_map[fid] = mapping[fid]
        else:
            new_files.append(f)

    # 旧文件直接沿用原有ID，不修改
    for f in old_files:
        fid = get_file_identifier(f)
        aid = file_id_map[fid]
        process_file(f, aid)

    # 新文件按排序顺序依次分配最小空闲ID
    for f in new_files:
        new_aid = get_next_free_id(mapping)
        fid = get_file_identifier(f)
        mapping[fid] = new_aid
        process_file(f, new_aid)

    # 清理已删除文件的映射记录
    existing_identifiers = [get_file_identifier(f) for f in md_files]
    cleaned_mapping = {k: v for k, v in mapping.items() if k in existing_identifiers}
    mapping = cleaned_mapping

    save_mapping(mapping)
    print(f"🎉 处理完成！旧文件{len(old_files)}个(保留原有ID)，新文件{len(new_files)}个，总计{len(md_files)}个")

if __name__ == "__main__":
    main()
