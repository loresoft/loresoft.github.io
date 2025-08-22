+++
date = '{{ .Date }}'
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
slug = '{{ .File.ContentBaseName }}'
tags = []
categories = []
author = '{{ site.Params.author }}'
description = '{{ site.Params.description }}'
+++

{{ replace .File.ContentBaseName "-" " " | title }}
