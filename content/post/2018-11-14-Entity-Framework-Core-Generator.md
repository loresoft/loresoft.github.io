+++
date = '2018-11-14T12:00:00-06:00'
title = 'Entity Framework Core Generator - Generating a model from an existing database'
slug = 'entity-framework-core-generator'
tags = ['entity-framework', 'entity-framework-core']
categories = ['Tools']
author = 'Paul Welter'
aliases = ['/Entity-Framework-Core-Generator']
description = 'Powerful .NET Core CLI tool for database-first development that generates Entity Framework Core models, DbContext, mappings, view models, validators, and AutoMapper profiles from existing databases with safe regeneration and customizable templates.'
+++


## Overview

.NET Core command-line (CLI) tool to generate Entity Framework Core model from an existing database.

* NuGet: [https://nuget.org/packages/EntityFrameworkCore.Generator](https://nuget.org/packages/EntityFrameworkCore.Generator "NuGet Package")
* Source: [http://github.com/loresoft/EntityFrameworkCore.Generator](https://github.com/loresoft/EntityFrameworkCore.Generator "Project Source")
* Documentation: [https://efg.loresoft.com](https://efg.loresoft.com)
  
## Features

* Entity Framework Core database first model generation
* Safe regeneration via region replacement
* Safe Renaming via mapping file parsing
* Optionally generate read, create and update models from entity
* Optionally generate validation and object mapper classes

## Documentation

Entity Framework Core Generator documentation is available via [Read the Docs](https://efg.loresoft.com)

## Installation

To install EntityFrameworkCore.Generator tool, run the following command in the console

```Shell
dotnet tool install --global EntityFrameworkCore.Generator
```

After the tool has been install, the `efg` command line will be available.  Run `efg --help` for command line options

## Generate Command

Entity Framework Core Generator (efg) creates source code files from a database schema. To generate the files with no configuration, run the following

```Shell
efg generate -c <ConnectionString>
```

Replace `<ConnectionString>` with a valid database connection string.

### Generation Output

The `generate` command will create the follow files and directory structure by default.  The root directory defaults to the current working directory.  Most of the output names and locations can be customized in the [configuration file](https://efg.loresoft.com/en/latest/configuration/)

#### Data Context Output

The EntityFramework DbContext file will be created in the root directory.

#### Entities Output

The entities directory will contain the generated source file for entity class representing each table.

#### Mapping Output

The mapping directory contains a fluent mapping class to map each entity to its table.

## Initialize Command

The `initialize` command is used to create the configuration yaml file and optionally set the [connection string](https://efg.loresoft.com/en/latest/connectionString/). The configuration file has many options to configure the generated output.  See the [configuration file](https://efg.loresoft.com/en/latest/configuration/) documentation for more details.

The following command will create an initial `generation.yaml` configuration file as well as setting a user secret to store the connection string.

```Shell
efg initialize -c <ConnectionString>
```

When a `generation.yaml` configuration file exists, you can run `efg generate` in the same directory to generate the source using that configuration file.

## Regeneration

Entity Framework Core Generator supports safe regeneration via region replacement and source code parsing.  A typical workflow for a project requires many database changes and updates.  Being able to regenerate the entities and associated files is a huge time saver.

### Region Replacement

All the templates output a region on first generation.  On future regeneration, only the regions are replaced.  This keeps any other changes you've made to the source file.

Example of a generated entity class

```C#
public partial class Status
{
    public Status()
    {
        #region Generated Constructor
        Tasks = new HashSet<Task>();
        #endregion
    }

    #region Generated Properties
    public int Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; }

    public DateTimeOffset Created { get; set; }

    public string CreatedBy { get; set; }

    public DateTimeOffset Updated { get; set; }

    public string UpdatedBy { get; set; }

    public Byte[] RowVersion { get; set; }
    #endregion

    #region Generated Relationships
    public virtual ICollection<Task> Tasks { get; set; }
    #endregion
}
```

When the `generate` command is re-run, the `Generated Constructor`, `Generated Properties` and `Generated Relationships` regions will be replace with the current output of the template.  Any other changes outside those regions will be safe.

### Source Parsing

In order to capture and preserve Entity, Property and DbContext renames, the `generate` command parses any existing mapping and DbContext class to capture how things are named.  This allows you to use the full extend of Visual Studio's refactoring tools to rename things as you like.  Then, when regenerating, those changes won't be lost.

## Database Providers

Entity Framework Core Generator supports the following databases.

* SQL Server
* PostgreSQL *Coming Soon*
* MySQL *Coming Soon*
* Sqlite *Coming Soon*

The provider can be set via command line or via the [configuration file](https://efg.loresoft.com/en/latest/configuration/).

Set via command line

```Shell
efg generate -c <ConnectionString> -p <Provider>
```

Set in configuration file

```YAML
database:
  connectionString: 'Data Source=(local);Initial Catalog=Tracker;Integrated Security=True'
  provider: SqlServer
```

## Database Schema

The database schema is loaded from the metadata model factory implementation of `IDatabaseModelFactory`.  Entity Framework Core Generator uses the implemented interface from each of the supported providers similar to how `ef dbcontext scaffold` works.

## View Models

Entity Framework Core Generator supports generating [Read](https://efg.loresoft.com/en/latest/md/read/), [Create](https://efg.loresoft.com/en/latest/md/create/) and [Update](https://efg.loresoft.com/en/latest/md/update/) view models from an entity.  Many projects rely on view models to shape data.  The model templates can be used to quickly get the basic view models created.  The model templates also support regeneration so any database change can easily be sync'd to the view models.
