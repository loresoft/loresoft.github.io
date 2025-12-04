+++
date = '2025-12-03T12:00:00-05:00'
title = 'Serilog.Sinks.SqlServer: High-Performance Serilog sink for Microsoft SQL Server'
slug = 'serilog-sql-server'
tags = ['serilog', 'logging', 'sqlserver', 'dotnet', 'csharp', 'aspnetcore', 'performance']
categories = ['Development', 'Projects']
author = 'Paul Welter'
description = 'Discover a high-performance Serilog sink for SQL Server that delivers 22% faster execution and 92% fewer allocations through streamlined architecture and efficient bulk operations.'
+++

Application logging is the foundation of observability in production systems, yet many logging solutions suffer from performance overhead that can impact application throughput. When logging to SQL Server, developers need a solution that's both fast and memory-efficient. Enter **Serilog.Sinks.SqlServer** - a high-performance sink that writes log events to Microsoft SQL Server using optimized bulk insert operations, delivering significant performance improvements over existing alternatives.

[https://github.com/loresoft/serilog-sinks-sqlserver](https://github.com/loresoft/serilog-sinks-sqlserver)

## What is Serilog.Sinks.SqlServer?

Serilog.Sinks.SqlServer is a lightweight, high-performance .NET library designed specifically to integrate Serilog's powerful structured logging capabilities with Microsoft SQL Server. Whether you're building ASP.NET Core web applications, microservices, or console applications, this sink provides an efficient way to persist your logs to SQL Server with minimal performance overhead.

## Why Another SQL Server Sink?

You might wonder why create another SQL Server sink when `Serilog.Sinks.MSSqlServer` already exists. The answer lies in performance optimization and architectural simplification. This sink was built from the ground up with a singular focus: delivering the fastest, most memory-efficient SQL Server logging possible.

### Performance Comparison

Based on comprehensive benchmarks (100 log events per batch), the results are compelling:

| Method                    | Mean Time | Rank | Gen0     | Gen1    | Allocated Memory |
| ------------------------- | --------- | ---- | -------- | ------- | ---------------- |
| Serilog.Sinks.SqlServer   | 2.082 ms  | 1    | 7.8125   | -       | 438.31 KB        |
| Serilog.Sinks.MSSqlServer | 2.666 ms  | 2    | 117.1875 | 27.3438 | 5,773.93 KB      |

**Key Performance Benefits:**

- **22% faster execution time** (2.082 ms vs 2.666 ms)
- **92% fewer allocations** (438 KB vs 5,774 KB per batch)
- **Significantly reduced GC pressure** from 13x lower memory allocations
- **Optimized bulk copy operations** with minimal overhead

### Architectural Advantages

The performance gains come from several architectural decisions:

#### Streamlined Architecture

- Focused solely on high-performance SQL Server logging without legacy compatibility layers
- Single-purpose design makes the codebase easier to understand and maintain

#### Efficient Memory Usage

- Minimal allocations through careful use of `ArrayBufferWriter<T>`, `Span<T>`, and modern .NET APIs
- Custom `JsonWriter` implementation using `Utf8JsonWriter` for zero-copy serialization

#### Optimized Data Pipeline

- Direct bulk copy approach using lightweight `IDataReader` implementation
- Avoids DataTable overhead and intermediate transformations
- Pre-defined mappings with delegate-based value extraction eliminate reflection overhead

#### Simplified Codebase

- Fewer dependencies (only Serilog, Microsoft.Data.SqlClient, and polyfills)
- Smaller footprint without legacy features
- Clear, modern C# code using latest language features

## Key Features

Serilog.Sinks.SqlServer brings enterprise-grade logging capabilities that make SQL Server logging both powerful and developer-friendly:

- **High Performance**: Uses `SqlBulkCopy` for efficient bulk insert operations
- **Flexible Column Mapping**: Customize which log event properties map to which database columns
- **Configurable Batching**: Control batch size and timeout for optimal performance
- **Standard Mappings**: Includes default mappings for common log properties (Timestamp, Level, Message, Exception, etc.)
- **Custom Properties**: Easily add custom property mappings for application-specific data
- **Rich Data Types**: Support for various data types including structured properties as JSON
- **Distributed Tracing**: Built-in support for TraceId and SpanId for correlation
- **Auto Truncation**: Automatically truncates string values to match column size constraints, preventing insert errors

## Installation

Getting started with Serilog.Sinks.SqlServer is straightforward. Install the package via NuGet:

```bash
dotnet add package Serilog.Sinks.SqlServer
```

Or via Package Manager Console:

```powershell
Install-Package Serilog.Sinks.SqlServer
```

## Quick Start Guide

Let's walk through a complete example to see how easy it is to get started with Serilog.Sinks.SqlServer.

### 1. Create the Database Table

First, create a table in your SQL Server database to store log events:

```sql
CREATE TABLE [dbo].[LogEvent]
(
    [Id] BIGINT IDENTITY(1,1) NOT NULL,
    [Timestamp] DATETIMEOFFSET NOT NULL,
    [Level] NVARCHAR(50) NOT NULL,
    [Message] NVARCHAR(MAX) NULL,
    [TraceId] NVARCHAR(100) NULL,
    [SpanId] NVARCHAR(100) NULL,
    [Exception] NVARCHAR(MAX) NULL,
    [Properties] NVARCHAR(MAX) NULL,
    [SourceContext] NVARCHAR(1000) NULL,
    CONSTRAINT [PK_LogEvent] PRIMARY KEY CLUSTERED ([Id] ASC),
    INDEX [IX_LogEvent_TimeStamp] NONCLUSTERED ([Timestamp] DESC),
    INDEX [IX_LogEvent_Level] NONCLUSTERED ([Level] ASC),
    INDEX [IX_LogEvent_TraceId] NONCLUSTERED ([TraceId] ASC)
)
WITH (DATA_COMPRESSION = PAGE);
```

> **Note**: The library does not automatically create tables. This design decision gives you full control over table structure, indexing strategy, partitioning, and other optimizations based on your specific requirements.

### 2. Configure Serilog

#### Simple Configuration

```csharp
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.SqlServer(
        connectionString: "Data Source=(local);Initial Catalog=Serilog;Integrated Security=True;TrustServerCertificate=True;",
        tableName: "LogEvent",
        tableSchema: "dbo"
    )
    .CreateLogger();

Log.Information("Hello, SQL Server!");
Log.CloseAndFlush();
```

#### Advanced Configuration with Options

```csharp
using Serilog;
using Serilog.Sinks.SqlServer;

Log.Logger = new LoggerConfiguration()
    .WriteTo.SqlServer(config =>
    {
        config.ConnectionString = "Data Source=(local);Initial Catalog=Serilog;Integrated Security=True;TrustServerCertificate=True;";
        config.TableName = "LogEvent";
        config.TableSchema = "dbo";
        config.MinimumLevel = LogEventLevel.Information;
        config.BatchSizeLimit = 100;
        config.BufferingTimeLimit = TimeSpan.FromSeconds(5);
    })
    .CreateLogger();
```

#### Configuration from appsettings.json

For ASP.NET Core applications, configure the sink using `appsettings.json` with the `Serilog.Settings.Configuration` package:

**appsettings.json:**

```json
{
  "ConnectionStrings": {
    "Serilog": "Data Source=(local);Initial Catalog=Serilog;Integrated Security=True;TrustServerCertificate=True;"
  },
  "Serilog": {
    "Using": [ "Serilog.Sinks.SqlServer" ],
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    },
    "WriteTo": [
      {
        "Name": "SqlServer",
        "Args": {
          "connectionString": "Data Source=(local);Initial Catalog=Serilog;Integrated Security=True;TrustServerCertificate=True;",
          "tableName": "LogEvent",
          "tableSchema": "dbo"
        }
      }
    ],
    "Enrich": [ "FromLogContext" ]
  }
}
```

**Program.cs:**

```csharp
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host
    .UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
    );

var app = builder.Build();
app.UseSerilogRequestLogging();
app.Run();
```

That's it! With just a few lines of configuration, you have high-performance structured logging to SQL Server.

## Configuration Options

The `SqlServerSinkOptions` class provides extensive configuration capabilities:

| Property           | Default Value              | Description                                    |
| ------------------ | -------------------------- | ---------------------------------------------- |
| ConnectionString   | -                          | SQL Server connection string (required)        |
| TableName          | "LogEvent"                 | Name of the table to write logs to             |
| TableSchema        | "dbo"                      | Schema of the table                            |
| MinimumLevel       | LevelAlias.Minimum         | Minimum log event level                        |
| BulkCopyOptions    | SqlBulkCopyOptions.Default | SqlBulkCopy options for bulk insert operations |
| Mappings           | StandardMappings           | Column mappings for log event properties       |
| BatchSizeLimit     | 1000                       | Number of log events to batch before writing   |
| BufferingTimeLimit | 2 seconds                  | Maximum time to wait before flushing a batch   |

## Column Mappings

### Standard Mappings

The sink includes the following standard column mappings out of the box:

| Column Name   | Data Type      | Description                              | Nullable | Max Size |
| ------------- | -------------- | ---------------------------------------- | -------- | -------- |
| Timestamp     | DateTimeOffset | UTC timestamp of the log event           | No       | -        |
| Level         | string         | Log level (e.g., "Information", "Error") | No       | 50       |
| Message       | string         | Rendered log message                     | Yes      | MAX      |
| TraceId       | string         | Distributed tracing trace ID             | Yes      | 100      |
| SpanId        | string         | Distributed tracing span ID              | Yes      | 100      |
| Exception     | string         | Exception details as JSON                | Yes      | MAX      |
| Properties    | string         | Additional properties as JSON            | Yes      | MAX      |
| SourceContext | string         | Source context (typically class name)    | Yes      | 1000     |

### JSON Structure for Exception and Properties

#### Exception Column

The `Exception` column stores exception details as a comprehensive JSON object:

```json
{
  "Message": "The error message",
  "BaseMessage": "Inner exception message (if present)",
  "Type": "System.InvalidOperationException",
  "Text": "Full exception text including stack trace",
  "HResult": -2146233079,
  "ErrorCode": -2147467259,
  "Source": "MyApplication",
  "MethodName": "MyMethod",
  "ModuleName": "MyAssembly",
  "ModuleVersion": "1.0.0.0"
}
```

This structured format makes it easy to query and analyze exceptions in your logs.

#### Properties Column

The `Properties` column stores log event properties as JSON, preserving type information:

**Scalar values:**

```json
{
  "UserId": 123,
  "UserName": "John Doe",
  "IsActive": true,
  "Amount": 99.99,
  "RequestId": "550e8400-e29b-41d4-a716-446655440000",
  "Timestamp": "2024-01-15T10:30:45Z"
}
```

**Structured values:**

```json
{
  "User": {
    "Id": 123,
    "Name": "John Doe",
    "Email": "john@example.com"
  }
}
```

**Arrays/Sequences:**

```json
{
  "Roles": ["Admin", "User", "Manager"],
  "Numbers": [1, 2, 3, 4, 5]
}
```

### Custom Property Mappings

Add custom property mappings to extract specific properties to dedicated columns:

```csharp
Log.Logger = new LoggerConfiguration()
    .Enrich.WithProperty("ApplicationName", "MyApp")
    .Enrich.WithProperty("ApplicationVersion", "1.0.0")
    .Enrich.WithProperty("EnvironmentName", "Production")
    .WriteTo.SqlServer(config =>
    {
        config.ConnectionString = connectionString;
        config.TableName = "LogExtended";
        
        // Add custom property mappings
        config.AddPropertyMapping("ApplicationName");
        config.AddPropertyMapping("ApplicationVersion");
        config.AddPropertyMapping("EnvironmentName");
    })
    .CreateLogger();
```

**Corresponding table structure:**

```sql
CREATE TABLE [dbo].[LogExtended]
(
    [Id] BIGINT IDENTITY(1,1) NOT NULL,
    [Timestamp] DATETIMEOFFSET NOT NULL,
    [Level] NVARCHAR(50) NOT NULL,
    [Message] NVARCHAR(MAX) NULL,
    [TraceId] NVARCHAR(100) NULL,
    [SpanId] NVARCHAR(100) NULL,
    [Exception] NVARCHAR(MAX) NULL,
    [Properties] NVARCHAR(MAX) NULL,
    [SourceContext] NVARCHAR(1000) NULL,
    [ApplicationName] NVARCHAR(500) NULL,
    [ApplicationVersion] NVARCHAR(500) NULL,
    [EnvironmentName] NVARCHAR(500) NULL,
    CONSTRAINT [PK_LogExtended] PRIMARY KEY CLUSTERED ([Id] ASC)
);
```

### Advanced Custom Mappings

For complete control, define custom mappings with lambda expressions:

```csharp
config.Mappings.Add(
    new ColumnMapping<LogEvent>(
        ColumnName: "MachineName",
        ColumnType: typeof(string),
        GetValue: logEvent => Environment.MachineName,
        Nullable: true,
        Size: 100
    )
);
```

> **Note**: When you specify a `Size` for string columns, the sink automatically truncates values that exceed the specified length to prevent SQL insert errors. Columns without a `Size` specified will not be truncated.

## Integration with ASP.NET Core

Serilog.Sinks.SqlServer integrates seamlessly with ASP.NET Core applications:

### Program.cs Configuration

```csharp
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSerilog(loggerConfiguration =>
{
    loggerConfiguration
        .ReadFrom.Configuration(builder.Configuration)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.SqlServer(config =>
        {
            config.ConnectionString = builder.Configuration.GetConnectionString("Serilog");
            config.TableName = "LogEvent";
        });
});

var app = builder.Build();
app.UseSerilogRequestLogging();
app.Run();
```

This configuration captures HTTP request logs, enriches them with contextual data, and writes them to both console and SQL Server for comprehensive observability.

## Resources

- **GitHub Repository**: [https://github.com/loresoft/serilog-sinks-sqlserver](https://github.com/loresoft/serilog-sinks-sqlserver)
- **NuGet Package**: [https://www.nuget.org/packages/Serilog.Sinks.SqlServer/](https://www.nuget.org/packages/Serilog.Sinks.SqlServer/)
- **Serilog Documentation**: [https://serilog.net/](https://serilog.net/)
- **License**: MIT License
