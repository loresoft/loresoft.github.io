+++
date = '2005-08-13T19:54:00-05:00'
title = 'Generics at Runtime'
slug = 'generics-at-runtime'
tags = ['snippets', 'dotnet', 'generics']
categories = ['Examples']
author = 'Paul Welter'
aliases = ['/Generics-at-Runtime']
description = 'Demonstration of how to use .NET Generics at runtime with reflection.'
+++


Here is a little test code that demonstrates how to use Generics at runtime. The code has two tests. The first test shows how to create a Generic Class at runtime. The second shows how to call a Generic method. Keep in mind that when using generics at runtime, there will be a reflection performance hit.

```csharp
using System;  
using System.Collections.ObjectModel;  
using Microsoft.VisualStudio.QualityTools.UnitTesting.Framework;  
using System.Reflection;  
using System.Diagnostics;  
  
namespace GenericTest  
{  
    [TestClass]  
    public class GenericTest  
    {  
        [TestMethod]  
        public void CreateGenericAtRuntime()  
        {  
            Stopwatch watch = Stopwatch.StartNew();  
            // define the generic class at runtime  
            Type genericType = typeof(Collection<>).MakeGenericType(typeof(DateTime));  
            // create an instance of the generic type  
            object instance = Activator.CreateInstance(genericType);  
            watch.Stop();  
  
            Console.WriteLine("Dynamic Create Time: {0} ms", watch.Elapsed.TotalMilliseconds);  
  
            Assert.IsNotNull(instance, "instance is Null");  
            Assert.IsTrue(instance is Collection<DateTime>);  
  
            Collection<DateTime> dates = instance as Collection<DateTime>;  
  
            Assert.IsNotNull(dates, "dates is Null");  
  
            watch = Stopwatch.StartNew();  
            Collection<DateTime> d = new Collection<DateTime>();  
            watch.Stop();  
  
            Console.WriteLine("Normal Create Time: {0} ms", watch.Elapsed.TotalMilliseconds);  
        }  
  
        public Collection<T> GetCollection<T>()  
        {   
            return new Collection<T>();   
        }  
  
        [TestMethod()]  
        public void CallGenericMethodAtRuntime()  
        {  
            Stopwatch watch = Stopwatch.StartNew();  
            MethodInfo methodInfo = typeof(GenericTest).GetMethod("GetCollection");  
            MethodInfo genericInfo = methodInfo.MakeGenericMethod(typeof(DateTime));  
              
            object instance = genericInfo.Invoke(this, null);  
            watch.Stop();  
  
            Console.WriteLine("Dynamic Invoke Time: {0} ms", watch.Elapsed.TotalMilliseconds);  
  
            Assert.IsNotNull(instance, "instance is Null");  
            Assert.IsTrue(instance is Collection<DateTime>);  
  
            Collection<DateTime> dates = instance as Collection<DateTime>;  
  
            Assert.IsNotNull(dates, "dates is Null");  
  
            watch = Stopwatch.StartNew();  
            Collection<DateTime> d = this.GetCollection<DateTime>();  
            watch.Stop();  
  
            Console.WriteLine("Normal Invoke Time: {0} ms", watch.Elapsed.TotalMilliseconds);  
        }  
    }  
}
```
