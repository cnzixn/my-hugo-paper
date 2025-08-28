#!/data/data/com.termux/files/usr/bin/python3

# cd /sdcard/acode/my-hugo-paper/assets/ ; python quark.py

import re
import yaml

# 读取quark.txt文件内容
with open('quark.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# 正则匹配文件名称和链接
pattern = r'我用夸克网盘分享了「(.*?)」.*?链接：(.*?)\s'
matches = re.findall(pattern, content, re.DOTALL)

# 构建YAML数据结构（补充psw字段）
yaml_data = {}
for name, url in matches:
    yaml_data[name] = {
        'url': url.strip(),
        'psw': '????'  # 无密码时固定填充????
    }

# 写入转换后的YAML文件
with open('pan_quark.yml', 'w', encoding='utf-8') as f:
    yaml.dump(yaml_data, f, allow_unicode=True, sort_keys=False)

print("转换完成，结果已保存至 quark_output.yml，格式包含psw字段")
