---
layout: post
dateCreated: 5/31/2007 5:48:00 PM
title: Easier way to page Linq queries.
tags:
- Snippets
- Linq
---
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