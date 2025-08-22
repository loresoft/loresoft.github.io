---
layout: post
dateCreated: 12/10/2018 12:00:00 PM
title: Generate ASP.NET Core WebAPI model with Entity Framework Core Generator
tags:
- Entity Framework
- EntityFramework
- EntityFrameworkCore
- ASP.NET
- WebAPI
---

## Overview

In this tutorial, you'll learn how to use the [Entity Framework Core Generator](https://github.com/loresoft/EntityFrameworkCore.Generator) to create an Entity Framework Core data model for an ASP.NET WebAPI.  Entity Framework Core Generator (efg) is .NET Core command-line (CLI) tool to generate Entity Framework Core model from an existing database.

- NuGet: [https://nuget.org/packages/EntityFrameworkCore.Generator](https://nuget.org/packages/EntityFrameworkCore.Generator "NuGet Package")
- Source: [http://github.com/loresoft/EntityFrameworkCore.Generator](https://github.com/loresoft/EntityFrameworkCore.Generator "Project Source")
- Documentation: [https://efg.loresoft.com](https://efg.loresoft.com)

The code for this tutorial is available at <https://github.com/pwelter34/EntityFrameworkCore.Generator.Demo>

## Tracker Database

This tutorial will be a database first model.  The database is a simple task tracking database.  

![Tracker Schema Diagram](/assets/TrackerDiagram.png)

The DDL script can be downloaded [here](https://github.com/pwelter34/EntityFrameworkCore.Generator.Demo/blob/master/database/Tracker.sql).  To create the database on your local SQL Server, run the following command.

```shell
sqlcmd -S localhost -i Tracker.sql -E
```

## ASP.NET Core Web API Project

To get started, create a new ASP.NET Core Web API project.  You can either use Visual Studio or a command line.  In this demo, you'll use the command line

```shell
dotnet new webapi
```

You'll need a few nuget packages for the [mapper](http://efg.loresoft.com/en/latest/md/mapper/) and [validation](http://efg.loresoft.com/en/latest/md/validation/) classes.

```shell
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package FluentValidation.AspNetCore
dotnet add package Swashbuckle.AspNetCore
```

![Tracker Project](/assets/TrackerProject-New.png)

## Entity Framework Core Generator

To use Entity Framework Core Generator, you need to install the .NET Core Global Tool.

```shell
dotnet tool install --global EntityFrameworkCore.Generator
```

After the tool has been install, the `efg` command line will be available.  Run `efg --help` for command line options

## Initialize Configuration

Entity Framework Core Generator has many options available to customize the generated output.  The `initialize` command is used to create the configuration yaml file and optionally set the database [connection string](https://efg.loresoft.com/en/latest/connectionString/). Update the [configuration file](https://efg.loresoft.com/en/latest/configuration/) to configure the generated output.

The following command will create an initial `generation.yaml` configuration file as well as setting a user secret to store the connection string.

```Shell
efg initialize -c "Data Source=(local);Initial Catalog=Tracker;Integrated Security=True" ^
  --id "984ef0cf-2b22-4fd1-876d-e01499da4c1f" ^
  --name "ConnectionStrings:Tracker"
```

The following is the yaml file created by default

```yaml
project:
  namespace: '{Database.Name}'
  directory: .\
database:
  connectionName: ConnectionStrings:Tracker
  userSecretsId: 984ef0cf-2b22-4fd1-876d-e01499da4c1f
data:
  context:
    name: '{Database.Name}Context'
    baseClass: DbContext
    namespace: '{Project.Namespace}.Data'
    directory: '{Project.Directory}\Data'
  entity:
    namespace: '{Project.Namespace}.Data.Entities'
    directory: '{Project.Directory}\Data\Entities'
  mapping:
    namespace: '{Project.Namespace}.Data.Mapping'
    directory: '{Project.Directory}\Data\Mapping'
  query:
    generate: true
    indexPrefix: By
    uniquePrefix: GetBy
    namespace: '{Project.Namespace}.Data.Queries'
    directory: '{Project.Directory}\Data\Queries'
model:
  shared:
    namespace: '{Project.Namespace}.Domain.Models'
    directory: '{Project.Directory}\Domain\Models'
  read:
    generate: true
    name: '{Entity.Name}ReadModel'
  create:
    generate: true
    name: '{Entity.Name}CreateModel'
  update:
    generate: true
    name: '{Entity.Name}UpdateModel'
  mapper:
    generate: true
    name: '{Entity.Name}Profile'
    baseClass: AutoMapper.Profile
    namespace: '{Project.Namespace}.Domain.Mapping'
    directory: '{Project.Directory}\Domain\Mapping'
  validator:
    generate: true
    name: '{Model.Name}Validator'
    baseClass: AbstractValidator<{Model.Name}>
    namespace: '{Project.Namespace}.Domain.Validation'
    directory: '{Project.Directory}\Domain\Validation'
```

## Generate Entity Framework Core Model

In order to use Entity Framework Core, you need a DbContext, entity classes and mapping from a table to those entities.  Entity Framework Core Generator creates these for you from the database. To generate the files, run the `generate` command

```Shell
efg generate
```

![Tracker Project](/assets/TrackerProject-After.png)

### Generation Output

The `generate` command will create the follow files and directory structure by default.  The root directory defaults to the current working directory.  Most of the output names and locations can be customized in the [configuration file](https://efg.loresoft.com/en/latest/configuration/)

#### Data Context Output

The EntityFramework DbContext file will be created in the Data directory.

#### Entities Output

The Entities directory will contain the generated source file for entity class representing each table.

#### Mapping Output

The Mapping directory contains a fluent mapping class to map each entity to its table.

#### Model Output

Entity Framework Core Generator has an option to create view models for each entity.  The output will go in the Domain directory by default.  

## Generated Model Cleanup

Entity Framework Core Generator supports safe regeneration via region replacement and source code parsing.  A typical workflow for a project requires many database changes and updates.  Being able to regenerate the entities and associated files is a huge time saver.

### Rename Property

The code generator makes its best attempt to convert names to there plural form using the `Humanizer` library.  In some cases it fails.  The first cleanup to do is to rename the TrackerContext.TaskExtendeds property to TrackerContext.TaskExtended.

![Rename Refactor](/assets/TrackerContext-Rename.png)

When the `generate` command is re-run, this refactor will be saved.

### Identifier Interface

In order to handle entities in a generic way, we'll need to add some interfaces to them.  We'll add the `IHaveIdentifier` to all entities and models.

Interface definition

```c#
namespace Tracker.Definitions
{
    public interface IHaveIdentifier
    {
        Guid Id { get; set; }
    }
}
```

Add the interface to all entities that have an Id primary key.  Below is an example entity class with the interface added.

```c#
public partial class Priority : IHaveIdentifier
{
    public Priority()
    {
        #region Generated Constructor
        Tasks = new HashSet<Task>();
        #endregion
    }

    #region Generated Properties
    public Guid Id { get; set; }

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

Notice the file has some regions like `#region Generated ...`.  These regions are what get replace the next time `efg generate` is called.  Since the interface was added outside of those regions, it will not get overwritten. 

Read more about [regeneration](https://efg.loresoft.com/en/latest/regeneration/) in the documentation.

## Web API

You'll need to add a few more things to your Web API project to get things going.

### Application Startup

You'll need to change the application startup to register the Entity Framework context as well as register the AutoMapper profiles.

```c#
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;
using Tracker.Data;

namespace Tracker
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // sharing the user secret configuration file
            var connectionString = Configuration.GetConnectionString("Tracker");

            services.AddDbContext<TrackerContext>(options => options.UseSqlServer(connectionString));

            // register AutoMapper profiles
            services.AddAutoMapper();

            services
                .AddMvc()
                .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<Startup>()) // register validators
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // Register the Swagger generator
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Tracker API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui, specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Tracker API");
            });

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
```

### Base Controller

To make the basic read, create and update endpoints easier, create a base controller class like the following.

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tracker.Data;
using Tracker.Definitions;

namespace Tracker.Controllers
{
    [ApiController]
    [Produces("application/json")]
    public abstract class EntityControllerBase<TEntity, TReadModel, TCreateModel, TUpdateModel> : ControllerBase
        where TEntity : class, IHaveIdentifier
    {

        protected EntityControllerBase(TrackerContext dataContext, IMapper mapper)
        {
            DataContext = dataContext;
            Mapper = mapper;
        }


        protected TrackerContext DataContext { get; }

        protected IMapper Mapper { get; }


        protected virtual async Task<TReadModel> ReadModel(Guid id, CancellationToken cancellationToken = default(CancellationToken))
        {
            var model = await DataContext
                .Set<TEntity>()
                .AsNoTracking()
                .Where(p => p.Id == id)
                .ProjectTo<TReadModel>(Mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken);

            return model;
        }

        protected virtual async Task<TReadModel> CreateModel(TCreateModel createModel, CancellationToken cancellationToken = default(CancellationToken))
        {
            // create new entity from model
            var entity = Mapper.Map<TEntity>(createModel);

            // add to data set, id should be generated
            await DataContext
                .Set<TEntity>()
                .AddAsync(entity, cancellationToken);

            // save to database
            await DataContext
                .SaveChangesAsync(cancellationToken);

            // convert to read model
            var readModel = await ReadModel(entity.Id, cancellationToken);

            return readModel;
        }

        protected virtual async Task<TReadModel> UpdateModel(Guid id, TUpdateModel updateModel, CancellationToken cancellationToken = default(CancellationToken))
        {
            var keyValue = new object[] { id };

            // find entity to update by id, not model id
            var entity = await DataContext
                .Set<TEntity>()
                .FindAsync(keyValue, cancellationToken);

            if (entity == null)
                return default(TReadModel);

            // copy updates from model to entity
            Mapper.Map(updateModel, entity);

            // save updates
            await DataContext
                .SaveChangesAsync(cancellationToken);

            // return read model
            var readModel = await ReadModel(id, cancellationToken);
            return readModel;
        }

        protected virtual async Task<TReadModel> DeleteModel(Guid id, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbSet = DataContext
                .Set<TEntity>();

            var keyValue = new object[] { id };

            // find entity to delete by id
            var entity = await dbSet
                .FindAsync(keyValue, cancellationToken);

            if (entity == null)
                return default(TReadModel);

            // return read model
            var readModel = await ReadModel(id, cancellationToken);

            // delete entry
            dbSet.Remove(entity);

            // save 
            await DataContext
                .SaveChangesAsync(cancellationToken);

            return readModel;
        }

        protected virtual async Task<IReadOnlyList<TReadModel>> QueryModel(Expression<Func<TEntity, bool>> predicate = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbSet = DataContext
                .Set<TEntity>();

            var query = dbSet.AsNoTracking();
            if (predicate != null)
                query = query.Where(predicate);

            var results = await query
                .ProjectTo<TReadModel>(Mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            return results;
        }
    }
}
```

### Task Controller

Create a TaskController to Create, Update, Read and Delete tasks.

```c#
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Tracker.Data;
using Tracker.Domain.Models;

namespace Tracker.Controllers
{
    [Route("api/Task")]
    public class TaskController : EntityControllerBase<Data.Entities.Task, TaskReadModel, TaskCreateModel, TaskUpdateModel>
    {
        public TaskController(TrackerContext dataContext, IMapper mapper) : base(dataContext, mapper)
        {
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskReadModel>> Get(CancellationToken cancellationToken, Guid id)
        {
            var readModel = await ReadModel(id, cancellationToken);

            if (readModel == null)
                return NotFound();

            return readModel;
        }

        [HttpGet("")]
        public async Task<ActionResult<IReadOnlyList<TaskReadModel>>> List(CancellationToken cancellationToken)
        {
            var listResult = await QueryModel(null, cancellationToken);
            return Ok(listResult);
        }

        [HttpPost("")]
        public async Task<ActionResult<TaskReadModel>> Create(CancellationToken cancellationToken, TaskCreateModel createModel)
        {
            var readModel = await CreateModel(createModel, cancellationToken);

            return readModel;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TaskReadModel>> Update(CancellationToken cancellationToken, Guid id, TaskUpdateModel updateModel)
        {
            var readModel = await UpdateModel(id, updateModel, cancellationToken);
            if (readModel == null)
                return NotFound();

            return readModel;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<TaskReadModel>> Delete(CancellationToken cancellationToken, Guid id)
        {
            var readModel = await DeleteModel(id, cancellationToken);
            if (readModel == null)
                return NotFound();

            return readModel;
        }
    }
}
```

### Test Endpoint

You can use the Swagger UI to test the end points

![Swagger Task Post Request](/assets/Tracker-TaskPost-Request.png)

![Swagger Task Post Response](/assets/Tracker-TaskPost-Response.png)

## Database Change / Regenerate

Now that you have the basic Web API project setup, you can run `efg generate` after any database change to keep all your entity and view models in sync with the database.  