+++
title = 'Injectio - Source Generator for Dependency Injection'
url = 'Injectio-Source-Generator-for-Dependency-Injection'
date = '2022-11-01T12:00:00-05:00'
categories = ['Development', 'Tools']
tags = ['dependency-injection', 'source-generator', 'csharp', 'dotnet']
description = "A source generator that simplifies service registration in the dependency injection container with various strategies."
author = 'LoreSoft'
+++


Source generator that helps register discovered services in the dependency injection container

* <https://github.com/loresoft/Injectio>
* <https://www.nuget.org/packages/Injectio>

## Features

* Transient, Singleton, Scoped service registration
* Factory registration
* Module method registration
* Duplicate Strategy - Skip,Replace,Append
* Registration Strategy - Self, Implemented Interfaces, Self With Interfaces

### Usage

#### Add package

Add the nuget package project to your projects.

`dotnet add package Injectio`

Prevent dependances from including Injectio

```xml
<PackageReference Include="Injectio" PrivateAssets="all" />
```

### Registration Attributes

Place registration attribute on class.  The class will be discovered and registered.

* `[RegisterSingleton]` Marks the class as a singleton service
* `[RegisterScoped]` Marks the class as a scoped service
* `[RegisterTransient]` Marks the class as a transient service
* `[RegisterServices]` Marks the method to be called to register services

#### Attribute Properties

| Property           | Description                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| ImplementationType | The type that implements the service.  If not set, the class the interface is on will be used.       |
| ServiceType        | The type of the service. If not set, the Registration property used to determine what is registered. |
| Factory            | Name of a factory method to create new instances of the service implementation.                      |
| Duplicate          | How the generator handles duplicate registrations. See Duplicate Strategy                            |
| Registration       | How the generator determines what to register. See Registration Strategy                             |

#### Duplicate Strategy

| Value   | Description                                          |
| ------- | ---------------------------------------------------- |
| Skip    | Skips registrations for services that already exists |
| Replace | Replaces existing service registrations              |
| Append  | Appends a new registration for existing services     |

#### Registration Strategy

| Value                 | Description                                                                           |
| --------------------- | ------------------------------------------------------------------------------------- |
| Self                  | Registers each matching concrete type as itself                                       |
| ImplementedInterfaces | Registers each matching concrete type as all of its implemented interfaces            |
| SelfWithInterfaces    | Registers each matching concrete type as all of its implemented interfaces and itself |

#### Singleton services

```c#
[RegisterSingleton]
public class SingletonService : IService { }
```

Explicit service type

```c#
[RegisterSingleton(ServiceType = typeof(IService))]
public class SingletonService : IService { }
```

#### Scoped Services

```c#
[RegisterScoped]
public class ScopedService : IService { }
```

#### Transient Services

```c#
[RegisterTransient]
public class TransientService : IService { }
```

#### Factories

```c#
[RegisterTransient(Factory = nameof(ServiceFactory))]
public class FactoryService : IFactoryService
{
    private readonly IService _service;

    public FactoryService(IService service)
    { 
        _service = service;
    }

    public static IFactoryService ServiceFactory(IServiceProvider serviceProvider)
    {
        return new FactoryService(serviceProvider.GetService<IService>());
    }
}
```

#### Open Generic

```c#
[RegisterSingleton(ImplementationType = typeof(OpenGeneric<>), ServiceType = typeof(IOpenGeneric<>))]
public class OpenGeneric<T> : IOpenGeneric<T> { }
```

#### Register Method

When the service registration is complex, use the `RegisterServices` attribute on a method that has a parameter of `IServiceCollection` or `ServiceCollection`

```c#
public class RegistrationModule
{
    [RegisterServices]
    public static void Register(IServiceCollection services)
    {
        services.TryAddTransient<IModuleService, ModuleService>();
    }
}
```

#### Add to container

The source generator creates an extension method with all the discovered services registered.  Call the generated extension method to add the services to the container.  The method will be called `Add[AssemblyName]`.  The assembly name will have the dots removed.

```c#
var services = new ServiceCollection();
services.AddInjectioTestsConsole();
```

Override the extension method name by using the `InjectioName` MSBuild property.

```xml
<PropertyGroup>
  <InjectioName>Library</InjectioName>
</PropertyGroup>
```

```c#
var services = new ServiceCollection();
services.AddLibrary();
```
