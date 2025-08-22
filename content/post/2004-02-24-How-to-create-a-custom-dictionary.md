+++
date = '2004-02-24T23:42:00-06:00'
title = 'How to create a custom dictionary'
url = 'How-to-create-a-custom-dictionary'
tags = ['dictionary']
categories = ['Tutorials']
author = 'LoreSoft'
description = 'Steps to create a custom dictionary for spell checking.'
+++


The following are some simple steps to create a custom dictionary.

**Step 1**

Create a text file with all the words you would like to use in the dictionary.  The text file should have one word per line like so ...

    apple
    banana
    grape
    orange
    peach
    pineapple

**Step 2**

Run the Dictionary Build tool.  Create a new dictionary.

**Step 3**

Load the text file into the new dictionary by using the Dictionary > Add OpenOffice Word List.  

**Step 4**

Open the en-US.dic dictionary in the dictionary build tool.  Copy everything in the Near Miss Data tab for the en-US.dic to the new dictionary's Near Miss Data tab.  Also, copy the data from the Phonetic Rules tab to the new dictionary.

**Step 5**

Generate the phonetic code cache for the new dictionary by use the Dictionary > Generate Phonetic Cache.

You should now be able to use the new dictionary in NetSpell to check words and generate suggestions from the new word list.
