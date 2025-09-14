#!/data/data/com.termux/files/usr/bin/python3

# cd /sdcard/acode/my-hugo-paper/assets/ ; python pan.py


import re
import yaml
from pathlib import Path

def extract_pan_info(file_path, is_baidu=False):
    """
    从网盘信息文本文件中提取BM编号、文件大小和分享链接
    
    Parameters:
    file_path: 文件路径 (Path对象或字符串)
    is_baidu: 是否为百度网盘文件（包含文件大小信息）
    
    Returns:
    包含提取信息的字典
    """
    info_dict = {}
    
    # 将 file_path 转换为字符串以便后续字符串操作
    file_path_str = str(file_path)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                
                # 提取BM编号（匹配BM后跟数字的格式）
                bm_match = re.search(r'文件名称:([^\s]+)', line)
                if bm_match:
                    bm_id = bm_match.group(1)
                else:
                    continue
                
                # 提取分享链接
                url_match = re.search(r'分享链接:(https?://[^\s]+)', line)
                url = url_match.group(1) if url_match else ''
                
                # 如果是百度网盘，提取文件大小
                size = ''
                if is_baidu:
                    size_match = re.search(r'文件大小:([\d\.]+[A-Za-z]+)', line)
                    size = size_match.group(1) if size_match else ''
                
                # 存储信息
                if bm_id not in info_dict:
                    info_dict[bm_id] = {}
                
                if is_baidu:
                    info_dict[bm_id]['size'] = size
                    info_dict[bm_id]['baidu_url'] = url
                else:
                    # 判断是迅雷还是夸克 (使用转换为字符串的路径)
                    if 'xunlei' in file_path_str.lower():
                        info_dict[bm_id]['xunlei_url'] = url
                    else:
                        info_dict[bm_id]['quark_url'] = url
                        
    except FileNotFoundError:
        print(f"错误：文件 {file_path} 未找到")
        return {}
    except Exception as e:
        print(f"读取文件 {file_path} 时发生错误：{e}")
        return {}
    
    return info_dict


def main():
    """主函数：整合三个网盘信息并生成YAML文件"""
    # 定义文件路径
    base_dir = Path('/sdcard/acode/my-hugo-paper/assets/')
    baidu_file = base_dir / 'pan_baidu.txt'
    xunlei_file = base_dir / 'pan_xunlei.txt'
    quark_file = base_dir / 'pan_quark.txt'
    output_file = base_dir / 'pan.yml'
    
    # 提取三个平台的信息
    print("正在提取百度网盘信息...")
    baidu_info = extract_pan_info(baidu_file, is_baidu=True)
    
    print("正在提取迅雷网盘信息...")
    xunlei_info = extract_pan_info(xunlei_file)
    
    print("正在提取夸克网盘信息...")
    quark_info = extract_pan_info(quark_file)
    
    # 整合所有BM编号（合并三个字典的键）
    all_bm_ids = set(baidu_info.keys()) | set(xunlei_info.keys()) | set(quark_info.keys())
    
    # 构建最终数据结构
    final_data = {}
    for bm_id in sorted(all_bm_ids):  # 按BM编号排序
        final_data[bm_id] = [
            {'size': baidu_info.get(bm_id, {}).get('size', '未知大小')},
            {'url1': baidu_info.get(bm_id, {}).get('baidu_url', '')},
            {'url2': xunlei_info.get(bm_id, {}).get('xunlei_url', '')},
            {'url3': quark_info.get(bm_id, {}).get('quark_url', '')}
        ]
    
    # 写入YAML文件
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            yaml.dump(final_data, f, allow_unicode=True, sort_keys=False, default_flow_style=False)
        print(f"成功生成YAML文件：{output_file}")
    except Exception as e:
        print(f"写入YAML文件时发生错误：{e}")

if __name__ == "__main__":
    main()
