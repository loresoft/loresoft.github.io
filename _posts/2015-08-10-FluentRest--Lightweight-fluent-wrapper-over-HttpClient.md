---
layout: post
dateCreated: 08/10/2015 12:00:00 PM
title: FluentRest - Lightweight fluent wrapper over HttpClient
tags:
- Fluent
- HttpClient
- Http
- REST
---
## Features

* Fluent request building
* Fluent form building
* Automatic deserialization of response
* Plugin different serialization 
* Fake HTTP responses

## Download

The FluentRest library is available on nuget.org via package name `FluentRest`.

To install FluentRest, run the following command in the Package Manager Console

    PM> Install-Package FluentRest
    
* NuGet: [https://nuget.org/packages/FluentRest](https://nuget.org/packages/FluentRest "NuGet Package")
* Source: [http://github.com/loresoft/FluentRest](https://github.com/loresoft/FluentRest "Project Source")

[![NuGet Version](https://img.shields.io/nuget/v/FluentRest.svg?style=flat-square)](https://www.nuget.org/packages/FluentRest/)

[![NuGet Version](https://img.shields.io/nuget/dt/FluentRest.svg?style=flat-square)](https://www.nuget.org/packages/FluentRest/)

## Fluent Request

Create a form post request

```csharp
var client = new FluentClient();
client.BaseUri = new Uri("http://echo.jpillora.com/", UriKind.Absolute);

var result = await client.PostAsync<EchoResult>(b => b
    .AppendPath("Project")
    .AppendPath("123")
    .FormValue("Test", "Value")
    .FormValue("key", "value")
    .QueryString("page", 10)
);
```

Custom authorization header

```csharp
var client = new FluentClient();
client.BaseUri = new Uri("https://api.github.com/", UriKind.Absolute);

var result = await client.GetAsync<Repository>(b => b
    .AppendPath("repos")
    .AppendPath("loresoft")
    .AppendPath("FluentRest")
    .Header(h => h.Authorization("token", "7ca62d97436f382253c6b9648d40b4b59630b778"))
);
```

## Fake Response

FluentRest has the ability to fake a HTTP responses by loading the response from disk.  You can first capture the response, then use it for unit tests.

Configure the FluentRest to capture response.

```csharp
var serializer = new JsonContentSerializer();

var fakeHttp = new FakeMessageHandler();
fakeHttp.Mode = FakeResponseMode.Capture;
fakeHttp.StorePath = @".\GitHub\Responses";

var client = new FluentClient(serializer, fakeHttp);
client.BaseUri = new Uri("https://api.github.com/", UriKind.Absolute);

var result = await client.GetAsync<Repository>(b => b
    .AppendPath("repos")
    .AppendPath("loresoft")
    .AppendPath("FluentRest")
    .Header(h => h.Authorization("token", "7ca62d97436f382253c6b9648d40b4b59630b778"))
);
```

Use captured response

```csharp
var serializer = new JsonContentSerializer();

var fakeHttp = new FakeMessageHandler();
fakeHttp.Mode = FakeResponseMode.Fake;
fakeHttp.StorePath = @".\GitHub\Responses";

var client = new FluentClient(serializer, fakeHttp);
client.BaseUri = new Uri("https://api.github.com/", UriKind.Absolute);

var result = await client.GetAsync<Repository>(b => b
    .AppendPath("repos")
    .AppendPath("loresoft")
    .AppendPath("FluentRest")
    .Header(h => h.Authorization("token", "7ca62d97436f382253c6b9648d40b4b59630b778"))
);
```