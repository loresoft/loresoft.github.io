---
layout: post
dateCreated: 3/26/2004 12:44:00 AM
title: How to integrate NetSpell with FreeTextBox
tags:
- Projects > NetSpell
---

The following code snippet show how intergrate NetSpell with FreeTextBox. 

Download the latest version of [FreeTextBox](http://www.freetextbox.com/) and NetSpell. 

Copy NetSpell.SpellChecker.dll to the bin folder and add the following files to the same folder as default.aspx for FreeTextBox.

*   spell.css
*   spell.js
*   SpellCheck.aspx&#160;  

Copy the dic folder to the FreeTextBox folder.&#160; Then modify the web.config file so the path to the dic folder matches.

    <configuration>
        <appSettings>
            <add key="DictionaryFolder" value="dic" />
        </appSettings>
    </configuration>

Modify Default.aspx to look like this

    <script language="JavaScript" src="spell.js" type="text/javascript"></script>
    <FTB:FREETEXTBOX id="FreeTextBox1" runat="Server">
        <TOOLBARS>
            <FTB:TOOLBAR runat="server">
                <FTB:NetSpell runat="server" />
            </FTB:TOOLBAR>
        </TOOLBARS>
    </FTB:FREETEXTBOX>

Now when you run the web site there should be a new toolbar that has a spell check button.  When the spell check button is clicked, NetSpell should load and start checking the text in the FreeTextBox.

You can look in the demo\Demo.Web.FreeTextBox folder of the latest package of NetSpell for an example of how to integrate NetSpell with FreeTextBox.

**3.x UPDATE:**

As of FreeTextBox 3.0, NetSpell is intergrated.&#160; The sample code above has been update to reflect what is needed in 3.0