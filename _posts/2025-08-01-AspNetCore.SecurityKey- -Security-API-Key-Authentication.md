---
layout: post
title: "AspNetCore.SecurityKey - Security API Key Authentication Implementation for ASP.NET Core"
dateCreated: 2025-08-01 12:00:00 -0500
categories: [Development, Security]
tags: [asp-net-core, authentication, api-key, security, nuget]
description: "A flexible and lightweight API key authentication library for ASP.NET Core applications that supports multiple authentication patterns and integrates seamlessly with ASP.NET Core's authentication and authorization infrastructure."
author: LoreSoft
---

A flexible and lightweight API key authentication library for ASP.NET Core applications that supports multiple authentication patterns and integrates seamlessly with ASP.NET Core's authentication and authorization infrastructure.

* [https://github.com/loresoft/AspNetCore.SecurityKey](https://github.com/loresoft/AspNetCore.SecurityKey)
* [https://www.nuget.org/packages/AspNetCore.SecurityKey](https://www.nuget.org/packages/AspNetCore.SecurityKey)

## Overview

AspNetCore.SecurityKey provides a complete API key authentication solution for ASP.NET Core applications with support for modern development patterns and best practices.

**Key Features:**

* **Multiple Input Sources** - API keys via headers, query parameters, or cookies
* **Flexible Authentication** - Works with ASP.NET Core's built-in authentication or as standalone middleware
* **Extensible Design** - Custom validation and extraction logic support
* **Rich Integration** - Controller attributes, middleware, and minimal API support
* **OpenAPI Support** - Automatic Swagger/OpenAPI documentation generation (.NET 9+)
* **High Performance** - Minimal overhead with optional caching
* **Multiple Deployment Patterns** - Attribute-based, middleware, or endpoint filters

## Quick Start

1. **Install the package**:

   ```shell
   dotnet add package AspNetCore.SecurityKey
   ```

2. **Configure your API key** in `appsettings.json`:

   ```json
   {
     "SecurityKey": "your-secret-api-key-here"
   }
   ```

3. **Register services** and secure endpoints:

   ```csharp
   builder.Services.AddSecurityKey();
   app.UseSecurityKey(); // Secures all endpoints
   ```

4. **Call your API** with the key:

   ```shell
   curl -H "X-API-KEY: your-secret-api-key-here" https://yourapi.com/endpoint
   ```

## Installation

The library is available on [nuget.org](https://www.nuget.org/packages/AspNetCore.SecurityKey/) via package name `AspNetCore.SecurityKey`.

### Package Manager Console

```powershell
Install-Package AspNetCore.SecurityKey
```

### .NET CLI

```shell
dotnet add package AspNetCore.SecurityKey
```

### PackageReference

```xml
<PackageReference Include="AspNetCore.SecurityKey" />
```

## How to Pass API Keys

AspNetCore.SecurityKey supports multiple ways to pass API keys in requests, providing flexibility for different client scenarios:

### Request Headers (Recommended)

The most common and secure approach for API-to-API communication:

```http
GET https://api.example.com/users
Accept: application/json
X-API-KEY: 01HSGVBSF99SK6XMJQJYF0X3WQ
```

### Query Parameters

Useful for simple integrations or when headers cannot be easily modified:

```http
GET https://api.example.com/users?X-API-KEY=01HSGVBSF99SK6XMJQJYF0X3WQ
Accept: application/json
```

> **Security Note**: When using query parameters, be aware that API keys may appear in server logs, browser history, and referrer headers. Headers are generally preferred for production use.

### Cookies

Ideal for browser-based applications or when API keys need persistence:

```http
GET https://api.example.com/users
Accept: application/json
Cookie: X-API-KEY=01HSGVBSF99SK6XMJQJYF0X3WQ
```

## Configuration

### Basic Setup

Configure your API keys in `appsettings.json`:

```json
{
  "SecurityKey": "01HSGVBSF99SK6XMJQJYF0X3WQ"
}
```

### Multiple API Keys

Support multiple valid API keys using semicolon separation:

```json
{
  "SecurityKey": "01HSGVBGWXWDWTFGTJSYFXXDXQ;01HSGVBSF99SK6XMJQJYF0X3WQ;01HSGVAH2M5WVQYG4YPT7FNK4K8"
}
```

## Usage Patterns

AspNetCore.SecurityKey supports multiple integration patterns to fit different application architectures and security requirements.

### 1. Middleware Pattern (Global Protection)

Apply API key requirement to all endpoints in your application:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddAuthorization();
builder.Services.AddSecurityKey();

var app = builder.Build();

// Apply security to ALL endpoints
app.UseSecurityKey();
app.UseAuthorization();

// All these endpoints require valid API keys
app.MapGet("/weather", () => WeatherService.GetForecast());
app.MapGet("/users", () => UserService.GetUsers()); 
app.MapGet("/products", () => ProductService.GetProducts());

app.Run();
```

### 2. Attribute Pattern (Selective Protection)

Apply API key requirement to specific controllers or actions:

```csharp
[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    // This action requires API key
    [SecurityKey]
    [HttpGet]
    public IEnumerable<User> GetUsers()
    {
        return UserService.GetUsers();
    }
    
    // This action is public (no API key required)
    [HttpGet("public")]
    public IEnumerable<User> GetPublicUsers()
    {
        return UserService.GetPublicUsers();
    }
}

// Or apply to entire controller
[SecurityKey]
[ApiController]  
[Route("[controller]")]
public class SecureController : ControllerBase
{
    // All actions in this controller require API key
    [HttpGet]
    public IActionResult Get() => Ok();
}
```

### 3. Endpoint Filter Pattern (Minimal APIs)

Secure specific minimal API endpoints:

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthorization();
builder.Services.AddSecurityKey();

var app = builder.Build();

app.UseAuthorization();

// Public endpoint (no API key required)
app.MapGet("/health", () => "Healthy");

// Secured endpoint using filter
app.MapGet("/users", () => UserService.GetUsers())
   .RequireSecurityKey();

// Multiple endpoints can be grouped
var securedGroup = app.MapGroup("/api/secure")
                     .RequireSecurityKey();

securedGroup.MapGet("/data", () => "Secured data");
securedGroup.MapPost("/action", () => "Secured action");

app.Run();
```

### 4. Authentication Scheme Pattern (Full Integration)

Integrate with ASP.NET Core's authentication system:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Register authentication with SecurityKey scheme
builder.Services
    .AddAuthentication()
    .AddSecurityKey();

builder.Services.AddAuthorization();
builder.Services.AddSecurityKey();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

// Use standard authorization attributes
app.MapGet("/users", () => UserService.GetUsers())
   .RequireAuthorization();

// Can also be combined with role-based authorization
app.MapGet("/admin", () => "Admin data")
   .RequireAuthorization("AdminPolicy");

app.Run();
```

## Advanced Customization

### Custom Security Key Validation

Implement custom validation logic by creating a class that implements `ISecurityKeyValidator`:

```csharp
public class DatabaseSecurityKeyValidator : ISecurityKeyValidator
{
    private readonly IApiKeyRepository _repository;
    private readonly ILogger<DatabaseSecurityKeyValidator> _logger;

    public DatabaseSecurityKeyValidator(
        IApiKeyRepository repository, 
        ILogger<DatabaseSecurityKeyValidator> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async ValueTask<bool> Validate(string? value, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(value))
            return false;

        try
        {
            var apiKey = await _repository.GetApiKeyAsync(value, cancellationToken);
            
            if (apiKey == null)
            {
                _logger.LogWarning("Invalid API key attempted: {Key}", value);
                return false;
            }

            if (apiKey.IsExpired)
            {
                _logger.LogWarning("Expired API key used: {Key}", value);
                return false;
            }

            // Update last used timestamp
            await _repository.UpdateLastUsedAsync(value, DateTime.UtcNow, cancellationToken);
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating API key");
            return false;
        }
    }

    public async ValueTask<ClaimsIdentity> Authenticate(string? value, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(value))
            return new ClaimsIdentity();

        var apiKey = await _repository.GetApiKeyAsync(value, cancellationToken);
        if (apiKey?.User == null)
            return new ClaimsIdentity();

        var identity = new ClaimsIdentity(SecurityKeyAuthenticationDefaults.AuthenticationScheme);        
        identity.AddClaim(new Claim(ClaimTypes.Name, apiKey.User.Name));
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, apiKey.User.Id));
        
        // Add role claims
        foreach (var role in apiKey.User.Roles)
        {
            identity.AddClaim(new Claim(ClaimTypes.Role, role));
        }

        return identity;
    }
}

// Register custom validator
builder.Services.AddScoped<IApiKeyRepository, ApiKeyRepository>();
builder.Services.AddSecurityKey<DatabaseSecurityKeyValidator>();
```

## License

This project is licensed under the MIT License
