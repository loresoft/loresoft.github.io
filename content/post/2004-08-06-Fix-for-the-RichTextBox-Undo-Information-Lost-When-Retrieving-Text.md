+++
date = '2004-08-06T18:20:00-05:00'
title = 'Fix for the RichTextBox Undo Information Lost When Retrieving Text'
slug = 'fix-for-the-richtextbox-undo-information-lost-when-retrieving-text'
tags = ['snippets']
categories = ['Examples']
author = 'Paul Welter'
aliases = ['/Fix-for-the-RichTextBox-Undo-Information-Lost-When-Retrieving-Text']
description = 'Workaround for RichTextBox undo information lost issue.'
+++


In my work with the RichTextBox control, I've often run into this bug in the RichEdit control. You can read more about this bug by looking at Microsoft's knowledge base article - [812943](http://support.microsoft.com/default.aspx?scid=kb;en-us;812943). If you are unable to get the latest Riched20.dll then you can get around the problem using the following code …

```csharp
using System;  
using System.Runtime.InteropServices;  
using System.Text;  
using System.Windows.Forms;  
  
namespace TextUndoBuffer  
{  
    /// <summary>    
    /// Work around for KB 812943, The RichEdit Control Undo    
    /// Information May Be Lost When the Control Retrieves Text.   
    /// </summary>    
    public class RichTextBoxEx : RichTextBox  
    {  
        // RichEdit messages (Richedit.h)   
        private const int EM_GETTEXTEX = (WM_USER + 94);  
        private const int EM_GETTEXTLENGTHEX = (WM_USER + 95);  
        // Flags for the GETEXTEX data structure   
        private const int GT_DEFAULT = 0;  
        // Flags for the GETTEXTLENGTHEX data structure   
        // Fast computation of a "close" answer   
        private const int GTL_CLOSE = 4;  
        // Do default (return # of chars)   
        private const int GTL_DEFAULT = 0;   
        private const int WM_USER = 0x0400;  
  
        public override string Text  
        {  
            get  
            {  
                GETTEXTLENGTHEX getLength = new GETTEXTLENGTHEX();  
                getLength.flags = GTL_CLOSE; //get buffer size   
                getLength.codepage = 1200; //Unicode   
                  
                int textLength = SendMessage(  
                    base.Handle, EM_GETTEXTLENGTHEX,   
                    ref getLength, 0);  
  
                GETTEXTEX getText = new GETTEXTEX();  
                //add space for null terminator   
                getText.cb = textLength + 2;   
                getText.flags = GT_DEFAULT;  
                getText.codepage = 1200; //Unicode   
                  
                StringBuilder sb = new StringBuilder(getText.cb);  
                  
                SendMessage(base.Handle, EM_GETTEXTEX, ref getText, sb);  
                  
                return sb.ToString();  
            }  
            set  
            {  
                base.Text = value;  
            }  
        }  
  
        public override int TextLength  
        {  
            get  
            {  
                GETTEXTLENGTHEX getLength = new GETTEXTLENGTHEX();  
                //Returns the number of characters   
                getLength.flags = GTL_DEFAULT;   
                getLength.codepage = 1200; //Unicode   
                return SendMessage(base.Handle, EM_GETTEXTLENGTHEX, ref getLength, 0);  
            }  
        }  
  
        [DllImport("user32.dll", EntryPoint = "SendMessage", CharSet = CharSet.Auto)]  
        private static extern int SendMessage(IntPtr hWnd, int msg,  
                                              ref GETTEXTEX wParam, StringBuilder lParam);  
  
        [DllImport("user32.dll", EntryPoint = "SendMessage", CharSet = CharSet.Auto)]  
        private static extern int SendMessage(IntPtr hWnd, int msg,  
                                              ref GETTEXTLENGTHEX wParam, int lParam);  
 
        #region Nested type: GETTEXTEX  
  
        [StructLayout(LayoutKind.Sequential)]  
        private struct GETTEXTEX  
        {  
            public Int32 cb;  
            public Int32 flags;  
            public Int32 codepage;  
            public IntPtr lpDefaultChar;  
            public IntPtr lpUsedDefChar;  
        }  
 
        #endregion  
 
        #region Nested type: GETTEXTLENGTHEX  
  
        [StructLayout(LayoutKind.Sequential)]  
        private struct GETTEXTLENGTHEX  
        {  
            public Int32 flags;  
            public Int32 codepage;  
        }  
 
        #endregion  
    }  
}
```
