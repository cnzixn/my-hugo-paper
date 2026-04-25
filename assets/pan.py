#!/data/data/com.termux/files/usr/bin/python3

# cd /sdcard/acode/my-hugo-paper/assets/ ; python pan.py

import re
import yaml
from pathlib import Path

def extract_pan_info_simple(file_path, pan_type):
    """
    适配新格式：BM001 5.71MB https://xxx
    pan_type: 'baidu' / 'xunlei' / 'quark'
    文件不存在时直接返回空字典，不报错
    """
    info_dict = {}
    pattern = re.compile(r'^(BM\d+)\s+([^\s]+)\s+(\S+)', re.IGNORECASE)

    if not Path(file_path).exists():
        return info_dict

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                m = pattern.match(line)
                if not m:
                    print(f"第{line_num}行格式异常: {line}")
                    continue

                bm_id = m.group(1).upper()
                size = m.group(2).strip()
                url = m.group(3).strip()

                if bm_id not in info_dict:
                    info_dict[bm_id] = {}
                info_dict[bm_id]['size'] = size

                if pan_type == 'baidu':
                    info_dict[bm_id]['baidu_url'] = url
                elif pan_type == 'xunlei':
                    info_dict[bm_id]['xunlei_url'] = url
                elif pan_type == 'quark':
                    info_dict[bm_id]['quark_url'] = url

    except Exception as e:
        print(f"读取 {file_path} 出错: {e}")

    return info_dict


def extract_names_from_txt(name_file_path):
    name_dict = {}
    if not Path(name_file_path).exists():
        print(f"⚠️ 名称文件 {name_file_path} 不存在")
        return name_dict

    pattern = re.compile(r'^(BM\d{3})\s{2,}(.*)$', re.IGNORECASE)
    try:
        with open(name_file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                m = pattern.match(line)
                if not m:
                    continue
                bm_id = m.group(1).upper()
                name = m.group(2).strip()
                name_dict[bm_id] = name
    except Exception as e:
        print(f"读取名称文件失败: {e}")
    return name_dict


def main():
    base_dir = Path('/sdcard/acode/my-hugo-paper/assets/')
    baidu_file  = base_dir / 'pan_baidu.txt'
    xunlei_file = base_dir / 'pan_xunlei.txt'
    quark_file  = base_dir / 'pan_quark.txt'
    name_file   = base_dir / 'pan_name.txt'
    output_file = base_dir / 'pan.yml'

    print("=== 读取名称映射 ===")
    name_info = extract_names_from_txt(name_file)

    print("=== 读取网盘链接 ===")
    baidu_info  = extract_pan_info_simple(baidu_file,  'baidu')
    xunlei_info = extract_pan_info_simple(xunlei_file, 'xunlei')
    quark_info  = extract_pan_info_simple(quark_file,  'quark')

    all_keys = sorted(set(baidu_info) | set(xunlei_info) | set(quark_info))
    print(f"共 {len(all_keys)} 个 BM 项目")

    final_data = {}
    for key in all_keys:
        current_name = name_info.get(key, key)
        size = baidu_info.get(key, {}).get('size', '0B')
        url1 = baidu_info.get(key, {}).get('baidu_url',  '')
        url2 = xunlei_info.get(key, {}).get('xunlei_url', '')
        url3 = quark_info.get(key, {}).get('quark_url',  '')

        final_data[key] = [
            {'name': current_name},
            {'size': size},
            {'url1': url1},
            {'url2': url2},
            {'url3': url3}
        ]
        print(f"{key}  {current_name}")

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            yaml.dump(final_data, f, allow_unicode=True, sort_keys=False, default_flow_style=False)
        print(f"\n✅ 完成: {output_file}")
    except Exception as e:
        print(f"\n❌ 写入失败: {e}")


if __name__ == "__main__":
    main()
