+++
date = '2007-05-31T17:48:00-05:00'
title = 'Easier way to page Linq queries.'
slug = 'easier-way-to-page-linq-queries'
tags = ['snippets', 'linq', 'paging']
categories = ['Examples']
author = 'Paul Welter'
aliases = ['/Easier-way-to-page-Linq-queries']
description = 'Query extension to make paging LINQ queries more natural than using Skip and Take.'
+++

The following query extension will make paging a query more natural then skip and take. Simply append Paginate(page, pageSize) to your query.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace System.Linq
{
    public static class PageQuery
    {
         public static IQueryable<T> Paginate<T>(
            this IQueryable<T> query, int page, int pageSize)
        {
            int skip = Math.Max(pageSize * (page - 1), 0);
            return query.Skip(skip).Take(pageSize);
        }
    }
} 
```
