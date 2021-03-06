---
layout: post
dateCreated: 07/23/2014 12:00:00 PM
title: NLog Fluent Library
tags:
- NLog
---

Fluent API for NLog

## Download

The NLog.Fluent library is available on nuget.org via package name `NLog.Fluent`.

To install NLog.Fluent, run the following command in the Package Manager Console

    PM> Install-Package NLog.Fluent

    
* NuGet: [http://www.nuget.org/packages/NLog.Fluent](http://www.nuget.org/packages/NLog.Fluent "NuGet Package")
* Source: [http://github.com/loresoft/NLog.Fluent](https://github.com/loresoft/NLog.Fluent "Project Source")

## Examples

Writing info message via fluent API.

```csharp
_logger.Info()
    .Message("This is a test fluent message '{0}'.", DateTime.Now.Ticks)
    .Property("Test", "InfoWrite")
    .Write();
```

Writing error message.

```csharp
try
{
    string text = File.ReadAllText(path);
}
catch (Exception ex)
{
    _logger.Error()
        .Message("Error reading file '{0}'.", path)
        .Exception(ex)
        .Property("Test", "ErrorWrite")
        .Write();
}
```

## Caller Info

Use the static Log class so you don't have to include loggers in all of classes.  The static Log class using .net 4.5 caller info to get the logger from the file name. 

Writing info message via static Log class with fluent API.

```csharp
Log.Info()
    .Message("This is a test fluent message.")
    .Property("Test", "InfoWrite")
    .Write();
```

Writing error message.

```csharp
try
{
    string text = File.ReadAllText(path);
}
catch (Exception ex)
{
    Log.Error()
        .Message("Error reading file '{0}'.", path)
        .Exception(ex)
        .Property("Test", "ErrorWrite")
        .Write();
}
```