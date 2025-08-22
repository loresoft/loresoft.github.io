+++
title = "Exploring the Arbiter Project: A Modern Take on the Mediator Pattern in .NET"
date = '2025-08-04T12:00:00-05:00'
url = 'The-Arbiter-Project-Mediator'
categories = ['Development', 'Architecture']
tags = ['dotnet', 'csharp', 'mediator', 'cqrs', 'clean-architecture', 'arbiter', 'vertical-slice']
author = 'LoreSoft'
description = "Discover the Arbiter project - a modern implementation of the Mediator pattern for .NET applications embracing clean architecture and CQRS principles."
+++

Discover the Arbiter project - a modern implementation of the Mediator pattern for .NET applications embracing clean architecture and CQRS principles.

* [https://github.com/loresoft/Arbiter](https://github.com/loresoft/Arbiter)
* [https://www.nuget.org/packages/Arbiter](https://www.nuget.org/packages/Arbiter)

## What is the Arbiter Project?

The Arbiter project is a comprehensive suite of libraries that implements the Mediator pattern and Command Query Responsibility Segregation (CQRS) in .NET. At its core lies the **Arbiter.Mediation** library, which serves as the foundation for building loosely coupled, testable applications using clean architectural patterns like Vertical Slice Architecture and CQRS.

## Why Another Mediator Library?

While libraries like MediatR have dominated the .NET mediator space, Arbiter.Mediation brings several distinctive features to the table:

* **Lightweight and Extensible**: Designed with performance and extensibility in mind
* **Modern .NET Support**: Built specifically for contemporary .NET applications
* **Clean Architecture Focus**: Explicitly designed for Vertical Slice Architecture and CQRS patterns
* **Comprehensive Ecosystem**: Part of a larger suite that includes Entity Framework, MongoDB, and communication libraries

## Key Features of Arbiter.Mediation

### Request/Response Pattern

The library supports the classic request/response pattern using `IRequest<TResponse>` and `IRequestHandler<TRequest, TResponse>` interfaces:

```csharp
public class Ping : IRequest<Pong>
{
    public string? Message { get; set; }
}

public class PingHandler : IRequestHandler<Ping, Pong>
{
    public async ValueTask<Pong> Handle(
        Ping request,
        CancellationToken cancellationToken = default)
    {
        // Simulate some work
        await Task.Delay(100, cancellationToken);
        return new Pong { Message = $"{request.Message} Pong" };
    }
}
```

### Event Notifications

For scenarios requiring event-driven architecture, Arbiter.Mediation provides notification support through `INotification` and `INotificationHandler<TNotification>`:

```csharp
public class OrderCreatedEvent : INotification
{
    public int OrderId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class OrderCreatedHandler : INotificationHandler<OrderCreatedEvent>
{
    public async ValueTask Handle(
        OrderCreatedEvent notification,
        CancellationToken cancellationToken = default)
    {
        // Handle the order created event
        // Send email, update inventory, etc.
    }
}
```

### Pipeline Behaviors

One of the most powerful features is the pipeline behavior system, which acts like middleware for your requests:

```csharp
public class PingBehavior : IPipelineBehavior<Ping, Pong>
{
    public async ValueTask<Pong> Handle(
        Ping request,
        RequestHandlerDelegate<Pong> next,
        CancellationToken cancellationToken = default)
    {
        // Pre-processing logic
        Console.WriteLine($"Before handling: {request.Message}");
        
        var response = await next(cancellationToken);
        
        // Post-processing logic
        Console.WriteLine($"After handling: {response.Message}");
        
        return response;
    }
}
```

This pattern enables cross-cutting concerns like logging, validation, caching, and performance monitoring without cluttering your business logic.

## Setting Up Arbiter.Mediation

Getting started is straightforward. Install the NuGet package:

```bash
dotnet add package Arbiter.Mediation
```

Register the services in your dependency injection container:

```csharp
// Register Mediator services
services.AddMediator();

// Register handlers
services.TryAddTransient<IRequestHandler<Ping, Pong>, PingHandler>();

// Optionally register pipeline behaviors
services.AddTransient<IPipelineBehavior<Ping, Pong>, PingBehavior>();
```

Then inject and use the mediator in your controllers or services:

```csharp
public class PingController : ControllerBase
{
    private readonly IMediator _mediator;

    public PingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        string? message = null,
        CancellationToken cancellationToken = default)
    {
        var request = new Ping { Message = message };
        var response = await _mediator.Send<Ping, Pong>(request, cancellationToken);
        return Ok(response);
    }
}
```

## Observability with OpenTelemetry

Modern applications require comprehensive observability. Arbiter.Mediation addresses this with the `Arbiter.Mediation.OpenTelemetry` package, providing built-in tracing and metrics:

```csharp
// Install: dotnet add package Arbiter.Mediation.OpenTelemetry

services.AddMediatorDiagnostics();
services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddMediatorInstrumentation()
        .AddConsoleExporter()
    )
    .WithMetrics(metrics => metrics
        .AddMediatorInstrumentation()
        .AddConsoleExporter()
    );
```

This integration allows you to monitor request performance, track handler execution, and identify bottlenecks in your application.

## The Broader Arbiter Ecosystem

While Arbiter.Mediation forms the core, the Arbiter project extends far beyond basic mediation:

* **Arbiter.CommandQuery**: CQRS framework with base commands and queries for CRUD operations
* **Arbiter.CommandQuery.EntityFramework**: Entity Framework Core handlers for database operations
* **Arbiter.CommandQuery.MongoDB**: MongoDB handlers for document-based storage
* **Arbiter.CommandQuery.Endpoints**: Minimal API endpoints for your commands and queries
* **Arbiter.Communication**: Message template communication for email and SMS services

This comprehensive ecosystem enables you to build complete applications using consistent patterns across different layers and technologies.

## When to Choose Arbiter.Mediation

Arbiter.Mediation is particularly well-suited for:

* **Clean Architecture Applications**: When you're implementing Vertical Slice Architecture or onion architecture patterns
* **CQRS Systems**: Applications that benefit from command-query separation
* **Microservices**: Services that need clear request/response boundaries and event handling
* **Modern .NET Applications**: Projects targeting recent .NET versions that want to leverage contemporary patterns

## Performance Considerations

While specific benchmarks aren't publicly available, Arbiter.Mediation is designed with performance in mind. The use of `ValueTask<T>` instead of `Task<T>` in handler interfaces suggests attention to allocation efficiency, particularly for synchronous operations that complete immediately.

The dependency injection-based resolution and pipeline behavior system provide flexibility without sacrificing performance, making it suitable for high-throughput applications.

## Conclusion

The Arbiter project, with Arbiter.Mediation at its core, represents a modern, thoughtful approach to implementing the Mediator pattern in .NET applications. Its focus on clean architecture, comprehensive ecosystem, and built-in observability support make it a compelling choice for developers building maintainable, scalable applications.

Whether you're starting a new project or looking to refactor existing code toward cleaner architecture patterns, Arbiter.Mediation provides the tools and structure to implement robust, loosely coupled systems that are easy to test and maintain.

For teams already familiar with MediatR, the transition to Arbiter.Mediation should be relatively smooth, while offering additional features and a more comprehensive ecosystem for building complete applications.

---

*Learn more about the Arbiter project and explore the source code on [GitHub](https://github.com/loresoft/Arbiter).*
