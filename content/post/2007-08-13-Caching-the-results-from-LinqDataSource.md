+++
date = '2007-08-13T15:24:00-05:00'
title = 'Caching the results from LinqDataSource'
url = 'Caching-the-results-from-LinqDataSource'
tags = ['snippets', 'linq', 'caching']
categories = ['Examples']
author = 'LoreSoft'
description = 'LinqCacheDataSource class for caching LINQ query results in ASP.NET applications.'
+++


I wanted to be able to cache the results of a query from the LinqDataSource that was used in multiple places on the page. I whipped up this little class to do the work of caching for me. The class, LinqCacheDataSource, handles the Selecting and Selected events. The Selected handler inserts the result of the query into cache. The Selecting handler gets the result from the cache. If it doesn't find the result, the query runs as normal. The caching will only work for selecting data. It works great for dropdowns and other fairly static data.

The Code ...

```csharp
/// <summary>
/// A LinqDataSource that provides caching for Linq queries.
/// </summary>
public class LinqCacheDataSource : LinqDataSource
{
    /// <summary>
    /// Initializes a new instance of the <see cref="LinqCacheDataSource"/> class.
    /// </summary>
    public LinqCacheDataSource()
        : base()
    {
        this.Selecting += new EventHandler<LinqDataSourceSelectEventArgs>(OnSelecting);
        this.Selected += new EventHandler<LinqDataSourceStatusEventArgs>(OnSelected);
    }
 
    private void OnSelecting(object sender, LinqDataSourceSelectEventArgs e)
    {
        if (!EnableCache)
            return;
 
        string key = GetKey();
        object source = Context.Cache[key];
        if (source == null)
            return;
 
        Debug.WriteLine("Cache Hit: " + key);
        e.Result = source;
    }
 
    private void OnSelected(object sender, LinqDataSourceStatusEventArgs e)
    {
        if (!EnableCache)
            return;
 
        if (e.Exception != null || e.Result == null)
            return;
 
        string key = GetKey();
        object source = Context.Cache[key];
        if (source != null)
            return;
 
        Debug.WriteLine("Cache Insert: " + key);
        Context.Cache.Insert(key, e.Result, null,
            DateTime.Now.AddSeconds(Duration), Cache.NoSlidingExpiration);
    }
 
    private string GetKey()
    {
        StringBuilder sb = new StringBuilder();
        sb.Append(this.ContextTypeName);
        sb.Append(" from ");
        sb.Append(this.TableName);
 
        if (!string.IsNullOrEmpty(this.Select))
        {
            sb.Append(" select ");
            sb.Append(this.Select);
        }
        if (!string.IsNullOrEmpty(this.Where))
        {
            sb.Append(" where ");
            sb.Append(this.Where);
        }
        if (!string.IsNullOrEmpty(this.OrderBy))
        {
            sb.Append(" OrderBy ");
            sb.Append(this.OrderBy);
        }
        return sb.ToString();
    }
 
    /// <summary>
    /// Gets or sets a value indicating whether query caching is enabled.
    /// </summary>
    [DefaultValue(true)]
    [Category("Cache")]
    [Description("Enable caching the linq query result.")]
    public bool EnableCache
    {
        get
        {
            object result = this.ViewState["EnableCache"];
            if (result != null)
                return (bool)result;
 
            return true;
        }
        set
        {
            this.ViewState["EnableCache"] = value;
        }
    }
 
    /// <summary>
    /// Gets or sets the time, in seconds, that the query is cached.
    /// </summary>
    [DefaultValue(30)]
    [Category("Cache")]
    [Description("The time, in seconds, that the query is cached.")]
    public int Duration
    {
        get
        {
            object result = this.ViewState["Duration"];
            if (result != null)
                return (int)result;
 
            return 30;
        }
        set
        {
            this.ViewState["Duration"] = value;
        }
    }
} 
```
