#!/data/data/com.termux/files/usr/bin/python3

# cd /sdcard/acode/my-hugo-paper/assets/ ; python baidu.py

import re
import yaml

# 读取baidu.txt文件内容
with open('baidu.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# 正则匹配文件名称、链接和提取码
pattern = r'通过百度网盘分享的文件：(.*?)\n链接：(.*?)\n提取码：(.*?)\s'
matches = re.findall(pattern, content, re.DOTALL)

# 构建YAML数据结构
yaml_data = {}
for name, url, pwd in matches:
    yaml_data[name] = {
        'url': url,
        'pwd': pwd
    }

# 将数据写入output.yml文件
with open('pan_baidu.yml', 'w', encoding='utf-8') as f:
    yaml.dump(yaml_data, f, allow_unicode=True, sort_keys=False)

print("转换完成，结果已保存至 output.yml")
