#!/data/data/com.termux/files/usr/bin/python3

# cd /sdcard/acode/my-hugo-paper/assets/ ; python pan.py


import re
import yaml
from pathlib import Path

def extract_pan_info(file_path, is_baidu=False):
    """
    提取网盘信息：BM文件用BM编号作键，非BM文件用纯文件名作键
    """
    info_dict = {}
    file_path_str = str(file_path)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                
                # 1. 提取文件名
                name_match = re.search(r'文件名称:([^\s]+)', line)
                if not name_match:
                    print(f"警告：第{line_num}行 [{line}] 未找到文件名，跳过")
                    continue
                full_filename = name_match.group(1).strip()
                
                # 2. 确定键值
                bm_match = re.search(r'(BM\d+)', full_filename)
                if bm_match:
                    key = bm_match.group(1).upper()
                else:
                    key = full_filename
                    print(f"提示：第{line_num}行 非BM文件 → 键值/名称：{key}")
                
                # 3. 提取分享链接
                url_match = re.search(r'分享链接:(https?://[^\s]+)', line)
                url = url_match.group(1) if url_match else ''
                
                # 4. 提取有效文件大小
                size = "0B"  # 按你的要求默认设为0B
                if is_baidu:
                    size_match = re.search(r'文件大小:([\d\.]+[A-Za-z]+)', line)
                    if size_match:
                        extracted_size = size_match.group(1).strip()
                        if extracted_size.upper() != "0B":
                            size = extracted_size
                
                # 5. 存储信息
                if key not in info_dict:
                    info_dict[key] = {
                        'full_filename': full_filename
                    }
                if is_baidu:
                    info_dict[key]['size'] = size
                    info_dict[key]['baidu_url'] = url
                else:
                    if 'xunlei' in file_path_str.lower():
                        info_dict[key]['xunlei_url'] = url
                    else:
                        info_dict[key]['quark_url'] = url
                        
    except FileNotFoundError:
        print(f"错误：文件 {file_path} 未找到")
        return {}
    except Exception as e:
        print(f"读取文件 {file_path} 时发生错误：{e}")
        return {}
    
    return info_dict

def extract_names_from_txt(name_file_path):
    """从 pan_name.txt 提取BM编号→名称的映射"""
    name_dict = {}
    if not Path(name_file_path).exists():
        print(f"警告：名称文件 {name_file_path} 未找到，跳过BM名称提取")
        return name_dict
    
    bm_file_pattern = re.compile(r'^(BM\d+)\.(.*)', re.IGNORECASE)
    
    try:
        with open(name_file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                
                file_match = bm_file_pattern.match(line)
                if not file_match:
                    continue
                
                bm_id = file_match.group(1).upper()
                rest_part = file_match.group(2)
                last_dot_index = rest_part.rfind('.')
                name = rest_part[:last_dot_index].strip() if last_dot_index != -1 else rest_part.strip()
                
                if name:
                    name_dict[bm_id] = name
                    print(f"已匹配BM名称：{bm_id} → {name}")
    
    except Exception as e:
        print(f"读取名称文件 {name_file_path} 时发生错误：{e}")
    return name_dict

def main():
    """主函数：按你的指定格式组装final_data"""
    # 定义文件路径
    base_dir = Path('/sdcard/acode/my-hugo-paper/assets/')
    baidu_file = base_dir / 'pan_baidu.txt'
    xunlei_file = base_dir / 'pan_xunlei.txt'
    quark_file = base_dir / 'pan_quark.txt'
    name_file = base_dir / 'pan_name.txt'
    output_file = base_dir / 'pan.yml'
    
    # 1. 提取BM名称映射
    print("=== 开始提取BM名称映射 ===")
    name_info = extract_names_from_txt(name_file)
    print(f"BM名称映射提取完成，共匹配 {len(name_info)} 个BM编号\n")
    
    # 2. 提取网盘信息
    print("=== 开始提取网盘信息 ===")
    baidu_info = extract_pan_info(baidu_file, is_baidu=True)
    xunlei_info = extract_pan_info(xunlei_file)
    quark_info = extract_pan_info(quark_file)
    
    # 3. 合并所有键值
    all_keys = sorted(set(baidu_info.keys()) | set(xunlei_info.keys()) | set(quark_info.keys()))
    print(f"网盘信息提取完成，共涉及 {len(all_keys)} 个文件（含BM和非BM）\n")
    
    # 4. 整合数据（严格按你指定的格式：name、size、url1、url2、url3独立字典项）
    print("=== 开始整合数据 ===")
    final_data = {}
    for key in all_keys:
        # 确定name字段
        if key.startswith('BM'):
            # BM文件：优先匹配名称，无则用键值
            current_name = name_info.get(key, key)
        else:
            # 非BM文件：键值=名称
            current_name = key
        
        # 【核心】按你的要求组装数据结构，修正bm_id为key
        final_data[key] = [
            {'name': current_name},  # 独立name项
            {'size': baidu_info.get(key, {}).get('size', "0B")},  # 独立size项，修正变量为key
            {'url1': baidu_info.get(key, {}).get('baidu_url', '')},
            {'url2': xunlei_info.get(key, {}).get('xunlei_url', '')},
            {'url3': quark_info.get(key, {}).get('quark_url', '')}
        ]
        print(f"整合完成 → 键值：{key} | 名称：{current_name}")
    
    # 5. 写入YAML
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            yaml.dump(final_data, f, allow_unicode=True, sort_keys=False, default_flow_style=False)
        print(f"\n✅ 整合完成！YAML文件已生成：{output_file}")
    except Exception as e:
        print(f"\n❌ 写入YAML失败：{e}")

if __name__ == "__main__":
    main()
