#!/data/data/com.termux/files/usr/bin/python3

# cd /sdcard/acode/my-hugo-paper/assets/ ; python pan.py


# 百度网盘(网页)脚本批量分享
# 查找  文件名称: (.*?) 文件大小: (.*?) 分享链接:(.*?) 提取码:(.*?) .*
# 替换  文件名称:$1 文件大小:$2 分享链接:$3?pwd=$4 提取码:$4

# 夸克网盘(客户端)直接批量分享
# 查找  .*?「(.*?)」.*\n链接：(.*?)\n提取码：(.*)
# 替换  文件名称:$1 分享链接:$2?pwd=$3 提取码:$3



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
    """从 pan_list.txt 提取BM编号→名称的映射（适配格式：BMxxx  类型.名称）"""
    name_dict = {}
    if not Path(name_file_path).exists():
        print(f"⚠️  警告：名称文件 {name_file_path} 未找到，跳过BM名称提取")
        return name_dict
    
    # 精准匹配：开头BM+3位数字， followed by 至少2个空格，再跟名称（兼容多空格）
    bm_pattern = re.compile(r'^(BM\d{3})\s{2,}(.*)$', re.IGNORECASE)
    
    try:
        with open(name_file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:  # 跳过空行
                    continue
                
                match = bm_pattern.match(line)
                if not match:
                    print(f"❌ 第{line_num}行格式异常，跳过：{line}")
                    continue
                
                bm_id = match.group(1).upper()  # BM编号统一转大写（防小写输入）
                full_name = match.group(2).strip()  # 名称去除首尾空格（防冗余空格）
                
                # 核心修复：之前误用未定义变量name，改为full_name
                name_dict[bm_id] = full_name
                print(f"✅ 第{line_num}行匹配成功：{bm_id} → {full_name}")
    
    except Exception as e:
        print(f"💥 读取名称文件 {name_file_path} 时发生错误：{str(e)}")
    
    print(f"\n📊 名称提取完成，共匹配 {len(name_dict)} 个BM模组\n")
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
