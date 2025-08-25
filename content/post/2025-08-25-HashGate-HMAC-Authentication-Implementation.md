+++
date = '2025-08-25T09:07:26-05:00'
title = 'HashGate - HMAC Authentication Implementation'
slug = 'hashgate-hmac-authentication-implementation'
tags = ['security', 'authentication', 'aspnetcore', 'hmac', 'dotnet']
categories = ['Projects', 'Security']
author = 'Paul Welter'
description = 'HashGate - A comprehensive HMAC authentication library for ASP.NET Core applications that provides secure server-to-server communication with built-in replay protection and easy integration.'
+++

In today's microservices landscape, secure server-to-server communication is more critical than ever. While OAuth and JWT tokens are popular choices for user authentication, they often introduce unnecessary complexity and dependencies for service-to-service communication. That's where **HashGate** comes in - a lightweight, powerful HMAC authentication library designed specifically for ASP.NET Core applications.

[https://github.com/loresoft/HashGate](https://github.com/loresoft/HashGate)

## What is HashGate?

HashGate is a comprehensive HMAC (Hash-based Message Authentication Code) authentication system that provides both server-side authentication middleware and client-side HTTP handlers. Inspired by AWS Signature Version 4 and Azure HMAC Authentication, HashGate ensures that every HTTP request is cryptographically signed, providing request integrity and authenticity without the overhead of traditional token-based systems.

## Why Choose HMAC Authentication?

Before diving into HashGate's features, let's explore why HMAC authentication is particularly well-suited for modern distributed systems:

### Enhanced Security

- **No credentials in transit**: Unlike bearer tokens, HMAC signatures are computed from request data, meaning the actual secret never travels over the network
- **Request integrity**: Each request is cryptographically signed, ensuring the payload hasn't been tampered with during transmission
- **Replay attack protection**: Built-in timestamp validation prevents malicious replaying of captured requests

### Microservices Architecture Benefits

- **Stateless authentication**: No need for centralized token stores or session management across services
- **Service-to-service isolation**: Each service can have unique HMAC keys, limiting blast radius if one service is compromised
- **Zero-dependency authentication**: No reliance on external identity providers or token validation services

### Operational Advantages

- **High performance**: HMAC computation is fast and doesn't require network calls to validate authenticity
- **Reduced infrastructure**: No need for token refresh endpoints, session stores, or identity service dependencies
- **Deterministic debugging**: Failed requests can be reproduced locally since signatures are deterministic
- **Language agnostic**: Any programming language can call HMAC-authenticated endpoints - Python, JavaScript, Java, Go, PHP, Ruby, and more can all generate the required HMAC signatures using standard cryptographic libraries

## Key Features

HashGate brings enterprise-grade HMAC authentication to your .NET applications with these features:

- **Secure HMAC-SHA256 authentication** with timestamp validation
- **Easy integration** with ASP.NET Core authentication system
- **Client library included** for .NET HttpClient integration
- **Request replay protection** with configurable time windows
- **Highly configurable** key providers and validation options

## Getting Started

Getting HashGate up and running is straightforward. The library provides separate NuGet packages for server and client implementations:

### Installation

For your ASP.NET Core server:

```bash
dotnet add package HashGate.AspNetCore
```

For your .NET client applications:

```bash
dotnet add package HashGate.HttpClient
```

### Server Setup

Setting up HMAC authentication on your ASP.NET Core server:

```csharp
using HashGate.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add HMAC authentication
builder.Services
    .AddAuthentication()
    .AddHmacAuthentication();

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

// Your protected endpoints
app.MapGet("/api/secure", () => "Hello, authenticated user!")
    .RequireAuthorization();

app.Run();
```

Configure your HMAC secrets in `appsettings.json`:

```json
{
    "HmacSecrets": {
        "MyClientId": "your-secret-key-here",
        "AnotherClient": "another-secret-key"
    }
}
```

> **Note**: For advanced scenarios requiring custom key storage or validation logic (such as database-backed keys, key rotation, or custom claims), implement the `IHmacKeyProvider` interface. This allows you to control how keys are retrieved and what claims are generated for authenticated clients. See the Advanced Features section for detailed implementation examples.

### Client Setup

The client side is equally straightforward:

```csharp
using HashGate.HttpClient;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateApplicationBuilder(args);

// Add HMAC authentication services
builder.Services.AddHmacAuthentication();

// Configure HttpClient with HMAC authentication
builder.Services
    .AddHttpClient("SecureApi", client => client.BaseAddress = new Uri("https://api.example.com"))
    .AddHttpMessageHandler<HmacAuthenticationHttpHandler>();

var app = builder.Build();

// Make authenticated requests
var httpClientFactory = app.Services.GetRequiredService<IHttpClientFactory>();
var httpClient = httpClientFactory.CreateClient("SecureApi");
var response = await httpClient.GetAsync("/api/secure");
```

Client configuration in `appsettings.json`:

```json
{
    "HmacAuthentication": {
        "Client": "MyClientId",
        "Secret": "your-secret-key-here"
    }
}
```

## How It Works

HashGate implements a straightforward authentication flow that ensures request integrity and authenticity:

### Authentication Flow Overview

1. **Client Credentials**: Each client has a unique identifier and secret key
2. **Request Signing**: Client calculates HMAC signature of request details
3. **Headers Added**: Authentication headers are added to the request
4. **Server Validation**: Server validates the signature using the shared secret

### Required Headers

Every authenticated request must include these four essential headers:

- **Host**: Internet host and port number (e.g., `api.example.com`)
- **x-timestamp**: Unix timestamp in seconds when the request was created (must be within server's time tolerance window, typically 5 minutes)
- **x-content-sha256**: Base64-encoded SHA256 hash of the request body (required even for requests with empty bodies)
- **Authorization**: HMAC authentication information containing client ID, signed headers, and signature

### String-to-Sign Construction

The heart of HMAC authentication is the canonical string-to-sign format, which must be constructed precisely:

```text
{HTTP_METHOD_UPPERCASE}\n{PATH_WITH_QUERY}\n{SEMICOLON_SEPARATED_HEADER_VALUES}
```

#### Construction Rules

- **HTTP Method**: Must be uppercase (GET, POST, PUT, DELETE, etc.)
- **Path with Query**: Full path including query string parameters in their original order
- **Header Values**: Semicolon-separated values in the exact order specified by the `SignedHeaders` parameter
- **Encoding**: Use UTF-8 encoding and consistent newline characters (`\n`, not `\r\n`)

#### Examples

GET request with query parameters:

```text
GET\n/api/users?page=1&limit=10\napi.example.com;1640995200;47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=
```

POST request with body:

```text
POST\n/api/users\napi.example.com;1640995201;jZKwqY8QqKqzQe7xJKwqY8QqKqzQe7xKwqY8QqKqzQe=
```

### Authorization Header Format

The authorization header follows a specific structure:

```text
HMAC Client={CLIENT_ID}&SignedHeaders={HEADER_NAMES}&Signature={BASE64_SIGNATURE}
```

#### Component Breakdown

- **Scheme Name**: Always starts with `HMAC` (case-sensitive)
- **Client Parameter**: Your unique client identifier (e.g., `demo-client`)
- **SignedHeaders Parameter**: Semicolon-separated list of header names included in the signature (e.g., `host;x-timestamp;x-content-sha256`)
- **Signature Parameter**: Base64-encoded HMAC-SHA256 signature of the string-to-sign

#### Example Authorization Headers

Basic authorization header:

```text
HMAC Client=demo-client&SignedHeaders=host;x-timestamp;x-content-sha256&Signature=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890=
```

With custom headers:

```text
HMAC Client=mobile-app&SignedHeaders=host;x-timestamp;x-content-sha256;content-type&Signature=xyz789abc123def456ghi789jkl012mno345pqr678stu901vwx234yz=
```

### Cryptographic Operations

HashGate performs two key cryptographic operations:

1. **Content Hash**: SHA256 hash of UTF-8 encoded request body, then Base64 encode (required even for empty bodies)
2. **Signature Generation**: HMAC-SHA256 of the string-to-sign using UTF-8 encoded secret key, then Base64 encode

### Implementation Algorithm

The complete algorithm follows these steps:

1. Extract host from request URL
2. Generate current Unix timestamp
3. Calculate SHA256 hash of request body (use empty content hash constant for empty bodies)
4. Create header values array in order: `[host, timestamp, content_hash]`
5. Create string-to-sign: `"METHOD\nPATH\nheader_values_joined_by_semicolon"`
6. Generate HMAC-SHA256 signature of string-to-sign using secret key
7. Base64 encode the signature
8. Create authorization header with client ID, signed headers, and signature
9. Add all required headers to request

### Validation on Server

The server performs these validation steps:

- **Timestamp**: Must be within server's time tolerance window
- **Content Hash**: Must match actual request body hash
- **Signature**: Must match server's calculated signature using the same algorithm
- **Headers**: All signed headers must be present and match signed values

This comprehensive approach ensures that any tampering with the request will be detected, and only clients with valid credentials can successfully authenticate.

## Advanced Features

### Custom Key Providers

HashGate allows you to implement custom key providers for advanced scenarios:

```csharp
public class DatabaseKeyProvider : IHmacKeyProvider
{
    private readonly IKeyRepository _keyRepository;

    public DatabaseKeyProvider(IKeyRepository keyRepository)
    {
        _keyRepository = keyRepository;
    }

    public async ValueTask<string?> GetSecretAsync(string client, CancellationToken cancellationToken = default)
    {
        var key = await _keyRepository.GetKeyAsync(client, cancellationToken);
        return key?.Secret;
    }

    public async ValueTask<ClaimsIdentity> GenerateClaimsAsync(string client, string? scheme = null, CancellationToken cancellationToken = default)
    {
        var identity = new ClaimsIdentity(scheme);
        identity.AddClaim(new Claim(ClaimTypes.Name, client));
        
        // Add additional claims based on your requirements
        var model = await _keyRepository.GetClientAsync(client, cancellationToken);
        if (model != null)
        {
            identity.AddClaim(new Claim("display_name", model.DisplayName));
            // Add role claims, permissions, etc. as needed
        }
        
        return identity;
    }
}

// Register the custom key provider
builder.Services
    .AddAuthentication()
    .AddHmacAuthentication<DatabaseKeyProvider>();
```

### Configuration Options

HashGate provides extensive configuration options:

```csharp
// Server configuration with custom options
builder.Services
    .AddAuthentication()
    .AddHmacAuthentication(options =>
    {
        options.ToleranceWindow = 10; // 10 minutes timestamp tolerance
        options.SecretSectionName = "MyHmacSecrets"; // Custom config section
    });

// Client configuration with custom options
services.AddHmacAuthentication(options =>
{
    options.Client = "MyClientId";
    options.Secret = "my-secret-key";
    options.SignedHeaders = ["host", "x-timestamp", "x-content-sha256", "content-type"];
});
```

## Sample Implementations

HashGate includes comprehensive sample implementations to help you get started quickly:

- **Sample.MinimalApi**: ASP.NET Core minimal API with protected endpoints
- **Sample.Client**: .NET client using HttpClient with HMAC authentication
- **Sample.Bruno**: Bruno API collection for testing HMAC endpoints
- **Sample.JavaScript**: JavaScript/Node.js client implementation
- **Sample.Python**: Python client implementation demonstrating HMAC authentication

## Security Considerations

When implementing HashGate in production, keep these security best practices in mind:

- Always use HTTPS in production environments
- Protect HMAC secret keys - never expose them in client-side code
- Monitor timestamp tolerance - shorter windows provide better security
- Rotate keys regularly with proper key rotation policies
- Log authentication failures to monitor for potential attacks
- Validate all inputs, especially timestamp and signature formats

## Use Cases Where HashGate Excels

HashGate is particularly well-suited for:

- Internal API gateways communicating with backend services
- Microservice mesh where services need to authenticate each other
- Webhook validation from external systems
- Background job services accessing protected APIs
- IoT device communication where OAuth flows are impractical

## Conclusion

HashGate represents a modern approach to service-to-service authentication that prioritizes security, performance, and simplicity. By implementing proven HMAC authentication patterns used by major cloud providers, HashGate provides a robust foundation for securing your distributed applications.

Whether you're building a microservices architecture, need secure webhook validation, or want to eliminate dependencies on external identity providers, HashGate offers a compelling solution that's both powerful and easy to implement.

The library is open source and available on GitHub at [https://github.com/loresoft/HashGate](https://github.com/loresoft/HashGate), with comprehensive documentation and sample implementations to help you get started quickly.
