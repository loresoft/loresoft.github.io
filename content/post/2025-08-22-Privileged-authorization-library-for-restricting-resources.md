+++
date = '2025-08-22T23:17:45-05:00'
title = 'Privileged: A Powerful Authorization Library for .NET'
slug = 'privileged-authorization-library-for-restricting-resources'
tags = ['dotnet', 'csharp', 'authorization', 'security', 'aspnetcore', 'blazor', 'permissions', 'nuget']
categories = ['Code']
author = 'Paul Welter'
description = 'Privileged, a versatile .NET authorization library that provides rule-based permissions with support for actions, subjects, and field-level qualifiers. Perfect for ASP.NET Core and Blazor applications.'
+++

**Privileged**, a .NET authorization library that makes implementing rule-based permissions both simple and powerful. Whether you're building a basic web application or a complex enterprise system, Privileged provides the flexibility to scale from simple claim-based authorization to a fully-featured subject and attribute-based authorization system.

[https://github.com/loresoft/Privileged](https://github.com/loresoft/Privileged)

## What is Privileged?

Privileged is an authorization library that operates on rules defining what a user can actually do in your application. It's designed to be incrementally adoptable - you can start simple and add complexity as your authorization requirements grow.

The library is built around three core concepts:

1. **Action** - What the user wants to do (e.g., `read`, `write`, `delete`)
2. **Subject** - The resource being accessed (e.g., `Post`, `User`, `Document`)  
3. **Qualifiers** - Field-level restrictions for fine-grained control (e.g., `title`, `content`)

## Key Features

* **Versatile**: Incrementally adoptable and easily scales between simple claim-based and fully-featured authorization
* **Isomorphic**: Works on both frontend and backend with complementary packages
* **Declarative**: Serializable rules that can be shared between UI and API
* **Rule-based**: Support for both allow and forbid rules with precedence
* **Aliases**: Create reusable aliases for actions, subjects, and qualifiers
* **Field-level permissions**: Fine-grained control with qualifier support
* **ASP.NET Core Integration**: Seamless integration with attribute-based policies
* **Blazor Integration**: Ready-to-use components for conditional rendering
* **Performance Optimized**: Efficient rule evaluation and matching algorithms

## Getting Started

Install the core package via NuGet:

```bash
dotnet add package Privileged
```

For ASP.NET Core applications, also install the authorization package:

```bash
dotnet add package Privileged.Authorization
```

For Blazor applications, add the components package:

```bash
dotnet add package Privileged.Components
```

## Basic Usage

Here's how to create and use basic authorization rules:

```csharp
var context = new PrivilegeBuilder()
    .Allow("read", "Post")
    .Allow("write", "User")
    .Forbid("delete", "User")
    .Build();

// Check permissions
bool canReadPost = context.Allowed("read", "Post");      // true
bool canWriteUser = context.Allowed("write", "User");    // true
bool canDeleteUser = context.Allowed("delete", "User");  // false
bool canReadUser = context.Allowed("read", "User");      // false (not explicitly allowed)
```

### Wildcard Rules

Use wildcards for broader permissions:

```csharp
var context = new PrivilegeBuilder()
    .Allow("test", PrivilegeRule.Any)     // Allow 'test' action on any subject
    .Allow(PrivilegeRule.Any, "Post")     // Allow any action on 'Post'
    .Forbid("publish", "Post")            // Forbid overrides allow
    .Build();
```

### Field-Level Permissions

Use qualifiers for fine-grained, field-level control:

```csharp
var context = new PrivilegeBuilder()
    .Allow("read", "Post", ["title", "id"])   // Only allow reading specific fields
    .Allow("read", "User")                    // Allow reading all User fields
    .Build();

// Check field-specific permissions
context.Allowed("read", "Post", "title").Should().BeTrue();   // Allowed
context.Allowed("read", "Post", "content").Should().BeFalse(); // Not allowed
```

## ASP.NET Core Integration

The `Privileged.Authorization` package provides seamless integration with ASP.NET Core's authorization system.

### Setup

Configure the authorization services in your `Program.cs`:

```csharp
using Privileged.Authorization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(/* your auth setup */);
builder.Services.AddAuthorization();

// Register privilege services
builder.Services.AddPrivilegeAuthorization();
builder.Services.AddScoped<IPrivilegeContextProvider, YourPrivilegeContextProvider>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
```

### Using the Privilege Attribute

Use the `[Privilege]` attribute to declaratively specify authorization requirements:

```csharp
[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    [HttpGet]
    [Privilege("read", "Post")]
    public IActionResult GetPosts() => Ok();

    [HttpPost]
    [Privilege("create", "Post")]
    public IActionResult CreatePost([FromBody] CreatePostRequest request) => Ok();

    [HttpPut("{id}/title")]
    [Privilege("update", "Post", "title")]  // Field-level permission
    public IActionResult UpdatePostTitle(int id, [FromBody] string title) => Ok();
}
```

### Minimal API Support

The library also works great with minimal APIs:

```csharp
// Simple attribute usage
app.MapGet("/api/posts", [Privilege("read", "Post")] () => 
    Results.Ok(new[] { new { Id = 1, Title = "Hello" } }));

// Using RequirePrivilege extension
app.MapPut("/api/posts/{id}/title", (int id, string title) =>
{
    return Results.Ok();
}).RequirePrivilege("update", "Post", "title");
```

## Blazor Integration

The `Privileged.Components` package provides components for building privilege-aware UIs.

### Conditional Rendering

Use the `PrivilegeView` component to conditionally show content:

```html
<PrivilegeView Action="read" Subject="Post">
    <p>You can read posts!</p>
</PrivilegeView>

<PrivilegeView Action="delete" Subject="Post">
    <Allowed>
        <button class="btn btn-danger">Delete Post</button>
    </Allowed>
    <Forbidden>
        <span class="text-muted">Delete not allowed</span>
    </Forbidden>
</PrivilegeView>
```

### Privilege-Aware Navigation

The `PrivilegeLink` component extends `NavLink` with privilege checking:

```html
<nav class="navbar">
    <PrivilegeLink Subject="Post" Action="read" href="/posts" class="nav-link">
        Posts
    </PrivilegeLink>
    <PrivilegeLink Subject="User" Action="manage" href="/users" class="nav-link">
        Users
    </PrivilegeLink>
</nav>
```

### Smart Input Components

Privilege-aware input components automatically handle read/write permissions:

```html
@* Becomes read-only if user can't update *@
<PrivilegeInputText @bind-Value="@model.Title"
                    Subject="Post"
                    Field="title" />

@* Disables if user can't update *@
<PrivilegeInputSelect @bind-Value="@model.Status"
                      Subject="Post"
                      Field="status">
    <option value="draft">Draft</option>
    <option value="published">Published</option>
</PrivilegeInputSelect>
```

## Advanced Features

### Aliases

Create reusable aliases for common permission groups:

```csharp
var context = new PrivilegeBuilder()
    .Alias("Manage", ["Create", "Update", "Delete"], PrivilegeMatch.Action)
    .Allow("Manage", "Project")  // Allows all actions in the "Manage" alias
    .Build();
```

### Multiple Actions and Subjects

Use extension methods for bulk rule creation:

```csharp
var context = new PrivilegeBuilder()
    .Allow(["read", "update"], "Post")              // Multiple actions, single subject
    .Allow("read", ["Post", "User"])                // Single action, multiple subjects
    .Allow(["create", "read"], ["Post", "Comment"]) // Multiple actions and subjects
    .Build();
```

## Implementation Strategy

### IPrivilegeContextProvider

Implement `IPrivilegeContextProvider` to load permissions from your data source:

```csharp
public class DatabasePrivilegeContextProvider : IPrivilegeContextProvider
{
    public async ValueTask<PrivilegeContext> GetContextAsync(ClaimsPrincipal? claimsPrincipal = null)
    {
        var user = claimsPrincipal;
        
        if (user?.Identity?.IsAuthenticated != true)
            return PrivilegeContext.Empty;

        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var permissions = await _permissionService.GetUserPermissionsAsync(userId);
        
        return new PrivilegeContext(permissions);
    }
}
```

## Why Choose Privileged?

1. **Simple to Start**: Begin with basic allow/forbid rules and grow complexity as needed
2. **Framework Integration**: First-class support for ASP.NET Core and Blazor
3. **Declarative**: Rules can be serialized and shared between services
4. **Performance**: Optimized for efficient rule evaluation
5. **Flexible**: Supports everything from simple permissions to complex field-level authorization
6. **Type Safe**: Strongly-typed APIs with comprehensive IntelliSense support

## Conclusion

Privileged provides a clean, powerful approach to authorization that grows with your application. Whether you need simple role-based permissions or complex field-level authorization, the library provides the tools to implement it elegantly.

The combination of declarative rules, seamless framework integration, and incremental adoption makes it an excellent choice for .NET applications that need robust authorization capabilities.

## Resources

* **GitHub**: [https://github.com/loresoft/Privileged](https://github.com/loresoft/Privileged)
* **NuGet Packages**:
  * [Privileged](https://www.nuget.org/packages/Privileged/) (Core library)
  * [Privileged.Authorization](https://www.nuget.org/packages/Privileged.Authorization/) (ASP.NET Core integration)
  * [Privileged.Components](https://www.nuget.org/packages/Privileged.Components/) (Blazor components)
  * [Privileged.Endpoint](https://www.nuget.org/packages/Privileged.Endpoint/) (Minimal API extensions)
