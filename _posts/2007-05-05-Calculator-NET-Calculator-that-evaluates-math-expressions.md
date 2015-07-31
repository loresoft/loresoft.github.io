---
layout: post
dateCreated: 5/5/2007 4:38:00 PM
title: Calculator.NET - Calculator that evaluates math expressions
tags:
- Calculator
redirect_from:
- "/Applications/Calculator/index.html"
- "/Applications/Calculator/Download/default.aspx/index.html"
---

I'd like to announce the release of a little project I've been working on.  I call it Calculator.NET.  I started this project for a couple reasons.  First, I was annoyed that Windows Vista doesn't come with a better calculator.  Windows XP has Power Calculator, but that doesn't work on Vista.  Next, I was reading a blog about [DynCalc](http://community.bartdesmet.net/blogs/bart/archive/2006/10/11/4513.aspx) by [Bart De Smet](http://community.bartdesmet.net/blogs/bart/default.aspx) on how to do mathematical calculations. That gave me the starting point on how to create Calculator.NET.

As part of the project, I created a MathExpressions library that does the bulk of work.  The library supports math expressions, functions unit conversion and variables. Below are some examples of using the library directly.

```csharp
MathEvaluator eval = new MathEvaluator();
//basic math
double result = eval.Evaluate("(2 + 1) * (1 + 2)");
//calling a function
result = eval.Evaluate("sqrt(4)");
//evaluate trigonometric 
result = eval.Evaluate("cos(pi * 45 / 180.0)");
//convert inches to feet
result = eval.Evaluate("12 [in->ft]");
//use variable
result = eval.Evaluate("answer * 10");
//add variable
eval.Variables.Add("x", 10);
result = eval.Evaluate("x * 10");
```

Calculator that evaluates math expressions. 

![Calculator.NET](http://www.loresoft.com/assets/Calculator.png)

**Calculator.NET Features**

*   Evaluate math expressions including grouping
*   Support trigonometry and other function
*   Common unit conversion of the following types
    *   Length
    *   Mass
    *   Speed
    *   Temperature
    *   Time
    *   Volume
*   Variable support including last answer

**Download**

[https://github.com/loresoft/Calculator/releases](https://github.com/loresoft/Calculator/releases "Calculator Releases")