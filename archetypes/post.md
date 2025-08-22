+++
date = '{{ .Date }}'
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
url = '{{ .File.ContentBaseName }}'
tags = []
categories = []
author = '{{ site.Params.author }}'
description = '{{ site.Params.description }}'
+++

{{ replace .File.ContentBaseName "-" " " | title }}
