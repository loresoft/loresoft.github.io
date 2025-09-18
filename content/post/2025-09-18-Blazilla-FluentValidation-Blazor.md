+++
date = '2025-09-17T12:00:00-05:00'
title = 'Blazilla: Seamless FluentValidation Integration for Blazor Forms'
slug = 'blazilla-fluentValidation-blazor'
tags = ['blazor', 'fluentvalidation', 'aspnetcore', 'validation', 'forms', 'csharp', 'dotnet']
categories = ['Development', 'Blazor']
author = 'Paul Welter'
description = 'Discover Blazilla, a powerful library that provides seamless integration between FluentValidation and Blazor EditForm components, enabling real-time validation, async support, and nested object validation.'
+++

Form validation is a critical aspect of any web application, and Blazor developers have long sought a clean, powerful way to integrate FluentValidation with Blazor's `EditForm` component. Enter **Blazilla** - a library that bridges this gap perfectly, providing seamless integration between [FluentValidation](https://fluentvalidation.net/) and Blazor forms.

## What is Blazilla?

Blazilla is a lightweight .NET library designed specifically to integrate FluentValidation's robust validation capabilities with Blazor's `EditForm` component. Whether you're building Blazor Server or Blazor WebAssembly applications, Blazilla provides a clean, efficient way to implement client-side validation using FluentValidation's expressive syntax.

## Why Another FluentValidation for Blazor Library?

You might be wondering: "There are already FluentValidation integrations for Blazor out there, so why create another one?" The answer lies in the complex integration challenges that existing solutions don't fully address. Blazilla was built to solve specific technical problems that arise when bridging FluentValidation with Blazor's component model.

### The FieldIdentifier Challenge

One of the most significant hurdles in integrating FluentValidation with Blazor is the mismatch between how Blazor identifies form fields and how FluentValidation references properties. Blazor uses `FieldIdentifier` objects to track form fields, while FluentValidation uses string-based property paths.

Blazilla automatically handles this conversion through sophisticated object tree analysis:

- **Simple Properties**: `{ Model = person, FieldName = "FirstName" }` → `"FirstName"`
- **Nested Properties**: `{ Model = address, FieldName = "Street" }` → `"Address.Street"`
- **Collection Items**: `{ Model = phoneNumber, FieldName = "Number" }` → `"PhoneNumbers[0].Number"`

This automatic path conversion ensures that validation messages from FluentValidation rules are correctly associated with their corresponding Blazor input components, regardless of object complexity.

### Blazor's Async Validation Limitations

Blazor's built-in validation system has fundamental limitations when it comes to asynchronous validation:

1. **OnValidSubmit Timing Issue**: The `OnValidSubmit` event fires immediately after synchronous validation passes, without waiting for async validation operations to complete. This means forms can prematurely submit while async validation is still running, potentially allowing invalid data through.

2. **EditContext.Validate() Limitations**: The standard `EditContext.Validate()` method only performs synchronous validation and doesn't trigger or wait for async validation rules.

These limitations affect **all** validation libraries attempting to integrate with Blazor, not just FluentValidation. Many existing solutions simply don't address these issues properly, leading to forms that can submit with incomplete validation results.

Blazilla solves this by:

- Providing an opt-in `AsyncMode` parameter that allows proper async validation handling when needed
- Extending `EditContext` with a `ValidateAsync()` method that properly waits for all async operations
- Offering clear guidance on when to use `OnSubmit` vs `OnValidSubmit`

### Performance Optimization Through Expression Trees

Form validation can be a performance bottleneck, especially in complex applications. Blazilla addresses this through:

- **Compiled Expression Trees**: Validation contexts are created using compiled expressions for optimal performance
- **Singleton Validator Pattern**: Proper DI registration guidance ensures validators are stateless and cached
- **Smart Async Handling**: Only enables async overhead when actually needed

### Real-World Integration Complexity

Existing FluentValidation integrations often work well for simple scenarios but fall short when dealing with:

- **Complex nested object hierarchies**
- **Dynamic form scenarios with rule sets**
- **Mixed sync/async validation requirements**  
- **Custom validator selector needs**
- **Performance-critical applications**

Blazilla was designed from the ground up to handle these real-world complexities while maintaining a clean, intuitive API.

### Developer Experience Focus

Rather than just providing basic FluentValidation integration, Blazilla prioritizes developer experience by:

- **Seamless Integration**: Works with existing Blazor validation patterns without breaking changes
- **Clear Error Messages**: Provides helpful guidance when configuration issues arise
- **Comprehensive Documentation**: Includes detailed examples for complex scenarios
- **Best Practice Guidance**: Built-in patterns that encourage proper architecture
- **Extensive Unit Tests**: The library includes comprehensive unit test coverage ensuring reliability and stability across different scenarios
- **Sample Complex Forms**: Real-world examples demonstrate advanced features like nested validation, async rules, and rule sets in action

Blazilla isn't just another validation library—it's a comprehensive solution to the real integration challenges developers face when building production Blazor applications with FluentValidation.

### Try It Live

Want to see Blazilla in action before diving into the code? The library includes live interactive sample forms that showcase all the key features in a real Blazor application. Visit [https://loresoft.com/Blazilla/](https://loresoft.com/Blazilla/) to explore:

- **Basic Form Validation**: Simple examples showing real-time validation in action
- **Async Validation Demos**: See how async validation rules work with database lookups and API calls
- **Nested Object Forms**: Complex forms with nested properties and collection validation
- **Rule Set Examples**: Dynamic validation scenarios using different rule sets
- **Performance Benchmarks**: Live examples demonstrating the performance optimizations

These interactive samples are not just demos—they're fully functional examples with complete source code that you can reference when implementing similar features in your own applications. Each sample includes detailed explanations of the validation rules and implementation patterns used.

## Key Features

Blazilla brings a comprehensive set of features that make form validation in Blazor applications both powerful and developer-friendly:

- **Real-time Validation**: Fields are validated as users type or change values, providing immediate feedback without requiring form submission.
- **Form-level Validation**: Complete model validation occurs on form submission, ensuring data integrity before processing.
- **Nested Object Validation**: Full support for complex object hierarchies, allowing validation of deeply nested properties.
- **Asynchronous Validation**: Built-in support for async validation rules, perfect for database lookups or API calls during validation.
- **Rule Sets**: Execute specific groups of validation rules based on context (e.g., "Create" vs "Update" scenarios).
- **Custom Validator Selectors**: Fine-grained control over which validation rules execute in different situations.
- **Dependency Injection Integration**: Automatic validator resolution from the DI container, following .NET best practices.
- **Performance Optimized**: Uses compiled expression trees for fast validation context creation, ensuring minimal performance overhead.

## Installation

Getting started with Blazilla is straightforward. Install the package via NuGet:

```bash
dotnet add package Blazilla
```

Or via Package Manager Console:

```powershell
Install-Package Blazilla
```

## Quick Start Guide

Let's walk through a complete example to see how easy it is to get started with Blazilla.

### 1. Create Your Model

```csharp
public class Person
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int Age { get; set; }
    public string? EmailAddress { get; set; }
}
```

### 2. Create a FluentValidation Validator

```csharp
using FluentValidation;

public class PersonValidator : AbstractValidator<Person>
{
    public PersonValidator()
    {
        RuleFor(p => p.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(50).WithMessage("First name cannot exceed 50 characters");

        RuleFor(p => p.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters");

        RuleFor(p => p.Age)
            .GreaterThanOrEqualTo(0).WithMessage("Age must be greater than or equal to 0")
            .LessThan(150).WithMessage("Age must be less than 150");

        RuleFor(p => p.EmailAddress)
            .NotEmpty().WithMessage("Email address is required")
            .EmailAddress().WithMessage("Please provide a valid email address");
    }
}
```

### 3. Register the Validator

#### Blazor Server (`Program.cs`)

```csharp
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

// Register FluentValidation validators as singletons for better performance
builder.Services.AddSingleton<IValidator<Person>, PersonValidator>();

var app = builder.Build();
// ... rest of configuration
```

#### Blazor WebAssembly (`Program.cs`)

```csharp
using FluentValidation;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Register FluentValidation validators as singletons for better performance
builder.Services.AddSingleton<IValidator<Person>, PersonValidator>();

await builder.Build().RunAsync();
```

### 4. Use in Your Blazor Component

```razor
@page "/person-form"

<h3>Person Form</h3>

<EditForm Model="@person" OnValidSubmit="@HandleValidSubmit">
    <FluentValidator />
    <ValidationSummary />

    <div class="mb-3">
        <label for="firstName" class="form-label">First Name</label>
        <InputText id="firstName" class="form-control" @bind-Value="person.FirstName" />
        <ValidationMessage For="@(() => person.FirstName)" />
    </div>

    <div class="mb-3">
        <label for="lastName" class="form-label">Last Name</label>
        <InputText id="lastName" class="form-control" @bind-Value="person.LastName" />
        <ValidationMessage For="@(() => person.LastName)" />
    </div>

    <div class="mb-3">
        <label for="age" class="form-label">Age</label>
        <InputNumber id="age" class="form-control" @bind-Value="person.Age" />
        <ValidationMessage For="@(() => person.Age)" />
    </div>

    <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <InputText id="email" class="form-control" @bind-Value="person.EmailAddress" />
        <ValidationMessage For="@(() => person.EmailAddress)" />
    </div>

    <button type="submit" class="btn btn-primary">Submit</button>
</EditForm>

@code {
    private Person person = new();

    private async Task HandleValidSubmit()
    {
        // Handle successful form submission
        Console.WriteLine("Form submitted successfully!");
    }
}
```

That's it! With just a few lines of code, you have a fully functional form with real-time validation powered by FluentValidation.

## Advanced Features

### Asynchronous Validation

One of Blazilla's standout features is its support for asynchronous validation. This is particularly useful for scenarios like checking username availability or validating data against external APIs.

```csharp
public class PersonValidator : AbstractValidator<Person>
{
    public PersonValidator()
    {
        RuleFor(p => p.EmailAddress)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Please provide a valid email address")
            .MustAsync(async (email, cancellation) => 
            {
                // Simulate async validation (e.g., database check)
                await Task.Delay(500, cancellation);
                return !email?.Equals("admin@example.com", StringComparison.OrdinalIgnoreCase) ?? true;
            }).WithMessage("This email address is not available");
    }
}
```

When using async validation, you'll need to handle form submission differently:

```razor
<EditForm Model="@person" OnSubmit="@HandleSubmit">
    <FluentValidator AsyncMode="true" />
    <ValidationSummary />
    
    <!-- form fields -->
    
    <button type="submit" class="btn btn-primary" disabled="@isSubmitting">
        @(isSubmitting ? "Validating..." : "Submit")
    </button>
</EditForm>

@code {
    private Person person = new();
    private bool isSubmitting = false;

    private async Task HandleSubmit(EditContext editContext)
    {
        isSubmitting = true;
        StateHasChanged();
        
        try
        {
            // Use ValidateAsync to ensure all async validation completes
            var isValid = await editContext.ValidateAsync();
            
            if (isValid)
            {
                // Form is valid, proceed with submission
                await ProcessValidForm();
            }
        }
        finally
        {
            isSubmitting = false;
            StateHasChanged();
        }
    }
    
    private async Task ProcessValidForm()
    {
        Console.WriteLine("Form submitted successfully!");
        await Task.Delay(1000); // Simulate form processing
    }
}
```

### Rule Sets

Rule sets allow you to execute specific groups of validation rules based on context:

```csharp
public class PersonValidator : AbstractValidator<Person>
{
    public PersonValidator()
    {
        // Default rules (always executed)
        RuleFor(p => p.FirstName).NotEmpty();

        // Rules in specific rule sets
        RuleSet("Create", () =>
        {
            RuleFor(p => p.EmailAddress)
                .NotEmpty()
                .EmailAddress();
        });

        RuleSet("Update", () =>
        {
            RuleFor(p => p.LastName).NotEmpty();
        });
    }
}
```

Then use specific rule sets in your component:

```razor
<!-- Execute only the "Create" rule set -->
<FluentValidator RuleSets="@(new[] { "Create" })" />

<!-- Execute all rules including those in rule sets -->
<FluentValidator AllRules="true" />
```

### Nested Object Validation

Blazilla excels at validating complex objects with nested properties:

```csharp
public class Person
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public Address? Address { get; set; }
}

public class Address
{
    public string? Street { get; set; }
    public string? City { get; set; }
    public string? PostalCode { get; set; }
}

public class AddressValidator : AbstractValidator<Address>
{
    public AddressValidator()
    {
        RuleFor(a => a.Street).NotEmpty().WithMessage("Street is required");
        RuleFor(a => a.City).NotEmpty().WithMessage("City is required");
        RuleFor(a => a.PostalCode).NotEmpty().WithMessage("Postal code is required");
    }
}

public class PersonValidator : AbstractValidator<Person>
{
    public PersonValidator()
    {
        RuleFor(p => p.FirstName).NotEmpty();
        RuleFor(p => p.LastName).NotEmpty();
        
        // Validate nested Address object
        RuleFor(p => p.Address!)
            .SetValidator(new AddressValidator())
            .When(p => p.Address is not null);
    }
}
```

## Component Parameters

The `FluentValidator` component provides several parameters for customization:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Validator` | `IValidator?` | null | Custom validator instance to use instead of DI resolution |
| `RuleSets` | `IEnumerable<string>?` | null | Specific rule sets to execute |
| `AllRules` | `bool` | false | Execute all rules including those in rule sets |
| `AsyncMode` | `bool` | false | Enable asynchronous validation mode |
| `Selector` | `IValidatorSelector?` | null | Custom validator selector for advanced scenarios |

## Performance Considerations

Blazilla is designed with performance in mind:

- **Singleton Registration**: Validators should be registered as singletons in the DI container since they are stateless
- **Expression Tree Compilation**: Validation contexts are created using compiled expression trees for optimal performance
- **Async Optimization**: Only enable `AsyncMode` when you have actual async validation rules to avoid unnecessary overhead

## Conclusion

Blazilla represents a significant step forward for Blazor form validation. By bridging the gap between FluentValidation's powerful rule system and Blazor's component model, it provides developers with a clean, efficient, and feature-rich solution for form validation.

Whether you're building simple forms or complex multi-step wizards with nested validation, Blazilla provides the tools you need to create robust, user-friendly forms in your Blazor applications.

The library is actively maintained, well-documented, and designed with real-world usage in mind. If you're working with Blazor forms and want to leverage FluentValidation's capabilities, Blazilla is definitely worth adding to your toolkit.

## Resources

- **Live Demo**: [https://loresoft.com/Blazilla/](https://loresoft.com/Blazilla/)
- **GitHub Repository**: [https://github.com/loresoft/Blazilla](https://github.com/loresoft/Blazilla)
- **NuGet Package**: [https://www.nuget.org/packages/Blazilla/](https://www.nuget.org/packages/Blazilla/)
- **FluentValidation**: [https://fluentvalidation.net/](https://fluentvalidation.net/)
- **License**: MIT License

Ready to get started? Install Blazilla today and experience the power of seamless FluentValidation integration in your Blazor applications!
