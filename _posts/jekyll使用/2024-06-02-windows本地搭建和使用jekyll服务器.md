---
layout: post
title: windows本地搭建和使用jekyll服务器
date: 2024-06-02 16:14 +0800
categories: jekyll使用
---

在本地搭建jekyll用于测试，测试完没有问题之后再提交到github page。

如何安装和搭建jekyll已经不记得了。今天补充一下启动本地jekyll的命令，防止之后再忘：

``` bash
bundle exec jekyll serve [--port 8080]
```

后面是[]里面是可选内容，用于指定端口。jekyll服务器默认会在localhost:4000打开