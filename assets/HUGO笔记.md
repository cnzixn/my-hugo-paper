# 网站 my-hugo-paper 创建流程

## 初始化
```
cd /sdcard/acode
hugo new site my-hugo-paper
cd my-hugo-paper
git init

```

## 切换分支(可选)
```
git config --global --add safe.directory /sdcard/acode/my-hugo-paper
git branch -m main
```

## 安装主题


```
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git submodule update --init --recursive # needed when you reclone your repo (submodules may not get cloned automatically)
echo theme = "PaperMod" >> hugo.toml
```
'72615b6d49ab8b102e92e2e487ab420f41ba9223'

## 本地部署
```
hugo --gc server -D --noBuildLock
```

## 本地访问

访问 http://localhost:1313/ ，可以看到 My New Hugo Site ，建站成功。


## 生成静态网站文件(可选)

```
hugo --minify
```

生成的文件在 /pubulic 目录，直接上传服务器就能访问。


## 上传 Github 仓库

在Github创建仓库后，
在本地仓库目录下运行：

git remote add origin https://github.com/xxxxxx/my-hugo-paper.git
git branch -M main
git push -u origin main









本地自用命令(备忘)

cd /sdcard/acode/*paper/

hugo --gc server -D --noBuildLock


# 1. 先获取远程更新（不合并）
git fetch origin

# 2. 对比本地分支与远程分支的差异
git diff HEAD..origin/main    # 查看当前分支与远程main分支的差异
git diff origin/main          # 查看远程分支具体改动内容

# 3. 确认无误后再合并
git merge origin/main


# 提交更新
git add . ; git commit -m "Update main at $(date '+%Y-%m-%d %H:%M:%S')" ; git push -u origin main

