---
layout: post
dateCreated: 7/19/2005 12:29:00 AM
title: Google Toolbar Spell Check API
tags:
- NetSpell
---

I saw in [this post](http://simon.incutio.com/archive/2005/07/08/toolbar) that the Google toolbar could be extracted and looked at. So, I spend an afternoon reverse engineering the spell checker api. The api ends up to be very easy to use. Checking is done with an HTTP post to [https://www.google.com/tbproxy/spell?lang=en&amp;hl=en](https://www.google.com/tbproxy/spell?lang=en&amp;hl=en). 

The xml structure looks like this...

    <?xml version="1.0" encoding="utf-8" ?>  
    <spellrequest textalreadyclipped="0" ignoredups="0" ignoredigits="1" ignoreallcaps="1">  
        <text>Ths is a tst</text>  
    </spellrequest>  

The response look like ...

    <?xml version="1.0" encoding="UTF-8"?>  
    <spellresult error="0" clipped="0" charschecked="12">  
        <c o="0" l="3" s="1">This Th's Thus Th HS</c>  
        <c o="9" l="3" s="1">test tat ST St st</c>  
    </spellresult>  

<table border="0" cellspacing="0" cellpadding="2" width="392">
  <tbody>
    <tr>
      <td valign="top" width="48"><strong>Tag</strong></td>

      <td valign="top" width="342"><strong>Description</strong></td>
    </tr>

    <tr>
      <td valign="top" width="48">o</td>

      <td valign="top" width="342">The offset from the start of the text of the word</td>
    </tr>

    <tr>
      <td valign="top" width="48">l</td>

      <td valign="top" width="342">Length of misspelled word</td>
    </tr>

    <tr>
      <td valign="top" width="48">s</td>

      <td valign="top" width="342">Confidence of the suggestion</td>
    </tr>

    <tr>
      <td valign="top" width="48">text</td>

      <td valign="top" width="342">Tab delimited list of suggestions</td>
    </tr>
  </tbody>
</table>

I created a complete C# GoogleSpell library as a demo. The library can be download at [http://www.loresoft.com/files/uploads/GoogleSpell.zip](http://www.loresoft.com/files/uploads/GoogleSpell.zip)

Here is an example on how to use GoogleSpell …

    string text = "ths is a tst";  
    SpellRequest request = new SpellRequest(text);  
      
    SpellResult result = SpellCheck.Check(request);  
      
    foreach (SpellCorrection correction in result.Corrections)  
    {  
        Console.WriteLine("Misspelled: {0} ({1}:{2})",   
            text.Substring(correction.Offset, correction.Length),   
            correction.Offset, correction.Length);  
      
        foreach(string suggestion in correction.Suggestions)  
        {  
            Console.WriteLine("    {0}", suggestion);  
        }  
    }  

I plan to develop an ajax web client for the google spell api.  This will be really sweet as it won't require anything to be installed on the sever other then a js file.  I'll post again when I have the web client complete.