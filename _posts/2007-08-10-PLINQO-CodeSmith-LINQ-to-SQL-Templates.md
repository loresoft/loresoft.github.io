---
layout: post
dateCreated: 8/10/2007 12:36:00 PM
title: PLINQO - CodeSmith LINQ to SQL Templates
tags:
- CodeSmith
---

PLINQO, which stands for Professional LINQ to Objects, is a collection of CodeSmith templates that are meant to replace and extend the LINQ to SQL designers that are included with Visual Studio 2008.

**Features**

* Generate or update a LINQ to SQL dbml file from a database schema.
    * Includes all tables, stored procedures, functions, and views with the ability to exclude objects based on regex patterns.
    * Ability to automatically remove object prefix and suffixes (ie. tbl_ and usp_).
    * Dbml file can still be customized with the normal Visual Studio 2008 designer.
    * Dbml file can be refreshed based on the current database schema without losing customizations. (See Safe Attributes)
* Generation of the LINQ to SQL DataContext class.
* Generation of the LINQ to SQL entity classes.
    * Generates one file per entity instead of one massive file.
    * Generates partial classes where custom code can be written and won't be overwritten.
    * Generated entity files are added to the project as code behind files to their corresponding custom entity files.
* Generation of entity manager classes.
    * Adds customizable business rules engine to enforce entity validation, business and security rules.
    * Provides access to common queries based on primary keys, foreign keys, and indexes.
    * Common queries are exposed as IQueryable so they can be extended.
* All templates can be customized to meet your needs.

**Read More**

[http://community.codesmithtools.com/blogs/pwelter/archive/2007/08/08/plinqo.aspx](http://community.codesmithtools.com/blogs/pwelter/archive/2007/08/08/plinqo.aspx)

**Download** 

[http://www.codeplex.com/codesmith/Release/ProjectReleases.aspx](http://www.codeplex.com/codesmith/Release/ProjectReleases.aspx "Download Plinqo")