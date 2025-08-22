---
layout: post
dateCreated: 9/3/2004 1:18:00 PM
title: Code Snippet to Convert Word Tense
tags:
- Snippets
---

Here is a useful code snippet to convert the tense of a word from single to plural and vise versa. The code uses a series of regular expression to examine the word and convert it using the correct grammar.

```csharp
public string MakePlural(string name)  
{  
    Regex plural1 = new Regex("(?<keep>[^aeiou])y$");  
    Regex plural2 = new Regex("(?<keep>[aeiou]y)$");  
    Regex plural3 = new Regex("(?<keep>[sxzh])$");  
    Regex plural4 = new Regex("(?<keep>[^sxzhy])$");  
  
    if(plural1.IsMatch(name))  
        return plural1.Replace(name, "${keep}ies");  
    else if(plural2.IsMatch(name))  
        return plural2.Replace(name, "${keep}s");  
    else if(plural3.IsMatch(name))  
        return plural3.Replace(name, "${keep}es");  
    else if(plural4.IsMatch(name))  
        return plural4.Replace(name, "${keep}s");  
  
    return name;  
}  
  
public string MakeSingle(string name)  
{  
    Regex single1 = new Regex("(?<keep>[^aeiou])ies$");  
    Regex single2 = new Regex("(?<keep>[aeiou]y)s$");  
    Regex single3 = new Regex("(?<keep>[sxzh])es$");  
    Regex single4 = new Regex("(?<keep>[^sxzhy])s$");  
  
    if(single1.IsMatch(name))  
        return single1.Replace(name, "${keep}y");  
    else if(single2.IsMatch(name))  
        return single2.Replace(name, "${keep}");  
    else if(single3.IsMatch(name))  
        return single3.Replace(name, "${keep}");  
    else if(single4.IsMatch(name))  
        return single4.Replace(name, "${keep}");  
  
    return name;  
}
```


