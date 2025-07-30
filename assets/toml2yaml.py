#!/data/data/com.termux/files/usr/bin/python3

# python /sdcard/acode/my-hugo-paper/assets/toml2yaml.py

import os
import re
import json
import toml
import yaml
from pathlib import Path

# ===== 配置 =====
CONTENT_DIR = "/sdcard/acode/my-hugo-paper/content/posts"
MAPPING_FILE = "/sdcard/acode/my-hugo-paper/assets/article_id_mapping.json"
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

# ===== 生成/获取ID =====
def get_or_assign_id(file_identifier, mapping):
    if file_identifier in mapping:
        return mapping[file_identifier]
    new_id = str(len(mapping) + 1)
    mapping[file_identifier] = new_id
    return new_id

# ===== 自定义YAML处理器（键无引号，字符串值单引号）=====
def str_presenter(dumper, data):
    """仅对字符串值添加单引号，键保持无引号"""
    if '\n' in data:
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|')
    return dumper.represent_scalar('tag:yaml.org,2002:str', data, style="'")

yaml.add_representer(str, str_presenter)

# ===== 处理文件 =====
def process_file(file_path, mapping):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    file_identifier = get_file_identifier(file_path)
    article_id = get_or_assign_id(file_identifier, mapping)
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
            new_front = f"---\n{yaml_str}---"
            new_content = toml_pattern.sub(new_front, content)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ 处理完成: {file_path}")
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
            new_front = f"---\n{yaml_str}---"
            new_content = yaml_pattern.sub(new_front, content)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ 处理完成: {file_path}")
            return
        except yaml.YAMLError as e:
            print(f"❌ YAML错误 {file_path}: {e}")
            return

    # 3. 无Front Matter时添加
    new_front = f"---\nurl: '{new_url}'\n---\n"
    new_content = new_front + content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"✅ 新增Front Matter: {file_path}")

# ===== 主函数 =====
def main():
    ensure_mapping_file_exists()
    mapping = load_mapping()
    for md_file in Path(CONTENT_DIR).glob("*.md"):
        process_file(md_file, mapping)
    save_mapping(mapping)
    print("🎉 所有文件处理完成！")

if __name__ == "__main__":
    main()
