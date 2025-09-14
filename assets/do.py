#!/usr/bin/env python3

# cd /sdcard/acode/my-hugo-paper/assets/ ; python do.py


import os
import re
import shutil

def batch_modify_articles(target_dir, backup=True, file_suffix=".md"):
    """
    批量修改文章下载模块（彻底修复短代码 {{ 缺失问题）
    """
    # 1. 校验目录
    if not os.path.isdir(target_dir):
        print(f"错误：目录 {target_dir} 不存在")
        return

    # 2. 匹配原格式（## 文件下载 + > [BMxxx] + {{< pan "BMxxx" >}}）
    pattern = re.compile(
        r'(## 文件下载)\n+'
        r'>\s*\[(BM\d+)\]\s*[^\n]*?\n+'
        r'\s*{{<\s*pan\s*"(\2)"\s*>}}\s*',
        re.DOTALL
    )

    modified_count = 0
    for root, _, files in os.walk(target_dir):
        for filename in files:
            if not filename.endswith(file_suffix):
                continue

            file_path = os.path.join(root, filename)
            print(f"\n处理：{file_path}")

            # 3. 读取内容
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                print(f"警告：读取失败 -> {e}")
                continue

            # 4. 替换逻辑（核心：用 {{{ 转义输出 {{）
            def replace_func(match):
                bm_id = match.group(2) if len(match.groups()) >=2 else "未知编号"
                # 关键修复：Python 中用 {{{ 表示输出 {{，}} 无需额外转义
                new_format = f"## 文件下载  \n\n> {{{{< mod \"{bm_id}\" >}}}}  \n\n{{{{< pan \"{bm_id}\" >}}}}  \n\n"
                return new_format

            # 执行替换
            new_content, replace_times = pattern.subn(replace_func, content)

            # 5. 写入修改
            if replace_times > 0:
                # 备份原文件
                if backup:
                    bak_path = f"{file_path}.bak"
                    shutil.copy2(file_path, bak_path)
                    print(f"已备份至：{bak_path}")

                # 写入正确内容
                try:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    modified_count += 1
                    print(f"修改成功（{replace_times} 处）")
                except Exception as e:
                    print(f"警告：写入失败 -> {e}")
            else:
                print("无匹配内容，无需修改")

    # 统计结果
    total_files = sum(1 for _, _, fs in os.walk(target_dir) for f in fs if f.endswith(file_suffix))
    print(f"\n=== 完成 ===")
    print(f"扫描 {total_files} 个文件 | 修改 {modified_count} 个文件")

if __name__ == "__main__":
    # 配置区（无需改动）
    TARGET_DIRECTORY = "/sdcard/acode/my-hugo-paper/content/bms"
    NEED_BACKUP = True
    FILE_SUFFIX = ".md"

    batch_modify_articles(
        target_dir=TARGET_DIRECTORY,
        backup=NEED_BACKUP,
        file_suffix=FILE_SUFFIX
    )
