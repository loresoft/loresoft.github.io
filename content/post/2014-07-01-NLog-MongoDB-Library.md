+++
date = '2014-07-01T12:00:00-05:00'
title = 'NLog MongoDB Library'
url = 'NLog-MongoDB-Library'
tags = ['nlog', 'mongodb', 'logging']
categories = ['Libraries']
author = 'Paul Welter'
description = 'NLog.Mongo library for writing NLog messages to MongoDB databases.'
+++


Writes NLog messages to MongoDB.

## Download

The NLog.Mongo library is available on nuget.org via package name `NLog.Mongo`.

To install NLog.Mongo, run the following command in the Package Manager Console

```powershell
Install-Package NLog.Mongo
```

* NuGet: [http://www.nuget.org/packages/NLog.Mongo](http://www.nuget.org/packages/NLog.Mongo "NuGet Package")
* Source: [http://github.com/loresoft/NLog.Mongo](https://github.com/loresoft/NLog.Mongo "Project Source")

## Configuration Syntax

```xml
<extensions>
    <add assembly="NLog.Mongo"/>
</extensions>

<targets>
    <target xsi:type="Mongo"
            name="String"
            connectionName="String"
            connectionString="String"
            collectionName="String"
            cappedCollectionSize="Long"
            cappedCollectionMaxItems="Long"
            includeDefaults="Boolean">
    
    <!-- repeated --> 
    <field name="String" Layout="Layout" />
    
    <!-- repeated --> 
    <property name="String" Layout="Layout" />
    </target>
</targets>
```

## Parameters

### General Options

_name_ - Name of the target.

### Connection Options

_connectionName_ - The name of the connection string to get from the config file. 

_connectionString_ - Connection string. When provided, it overrides the values specified in connectionName. 

### Collection Options

_collectionName_ - The name of the MongoDB collection to write logs to.  

_cappedCollectionSize_ - If the collection doesn't exist, it will be create as a capped collection with this max size.

_cappedCollectionMaxItems_ - If the collection doesn't exist, it will be create as a capped collection with this max number of items.  _cappedCollectionSize_ must also be set when using this setting.

### Document Options

_includeDefaults_ - Specifies if the default document is created when writing to the collection.  Defaults to true.

_field_ - Specifies a root level document field. There can be multiple fields specified.

_property_ - Specifies a dictionary property on the Properties field. There can be multiple properties specified.

## Examples

### Default Configuration with Extra Properties

#### NLog.config target

```xml
<target xsi:type="Mongo"
        name="mongoDefault"
        connectionString="mongodb://localhost/Logging"
        collectionName="DefaultLog"
        cappedCollectionSize="26214400">
    <property name="ThreadID" layout="${threadid}" />
    <property name="ThreadName" layout="${threadname}" />
    <property name="ProcessID" layout="${processid}" />
    <property name="ProcessName" layout="${processname:fullName=true}" />
    <property name="UserName" layout="${windows-identity}" />
</target>
```

#### Default Output JSON

```json
{
    "_id" : ObjectId("5184219b545eb455aca34390"),
    "Date" : ISODate("2013-05-03T20:44:11Z"),
    "Level" : "Error",
    "Logger" : "NLog.Mongo.ConsoleTest.Program",
    "Message" : "Error reading file 'blah.txt'.",
    "Exception" : {
        "Message" : "Could not find file 'C:\\Projects\\github\\NLog.Mongo\\Source\\NLog.Mongo.ConsoleTest\\bin\\Debug\\blah.txt'.",
        "Text" : "System.IO.FileNotFoundException: Could not find file 'C:\\Projects\\github\\NLog.Mongo\\Source\\NLog.Mongo.ConsoleTest\\bin\\Debug\\blah.txt' ...",
        "Type" : "System.IO.FileNotFoundException",
        "Source" : "mscorlib",
        "MethodName" : "WinIOError",
        "ModuleName" : "mscorlib",
        "ModuleVersion" : "4.0.0.0"
    },
    "Properties" : {
        "ThreadID" : "10",
        "ProcessID" : "21932",
        "ProcessName" : "C:\\Projects\\github\\NLog.Mongo\\Source\\NLog.Mongo.ConsoleTest\\bin\\Debug\\NLog.Mongo.ConsoleTest.exe",
        "UserName" : "pwelter",
        "Test" : "ErrorWrite",
        "CallerMemberName" : "Main",
        "CallerFilePath" : "c:\\Projects\\github\\NLog.Mongo\\Source\\NLog.Mongo.ConsoleTest\\Program.cs",
        "CallerLineNumber" : "43"
    }
}
```

### Complete Custom Document

#### Complete NLog.config target

```xml
<target xsi:type="Mongo"
        name="mongoCustom"
        includeDefaults="false"
        connectionString="mongodb://localhost/Logging"
        collectionName="CustomLog"
        cappedCollectionSize="26214400">
    <field name="Date" layout="${longdate}" />
    <field name="Level" layout="${level}"/>
    <field name="Message" layout="${message}" />
    <field name="Logger" layout="${logger}"/>
    <field name="Exception" layout="${exception:format=tostring}" />
    <field name="ThreadID" layout="${threadid}" />
    <field name="ThreadName" layout="${threadname}" />
    <field name="ProcessID" layout="${processid}" />
    <field name="ProcessName" layout="${processname:fullName=true}" />
    <field name="UserName" layout="${windows-identity}" />
</target>
```

#### Custom Output JSON

```json
{
    "_id" : ObjectId("5187abc2545eb467ecce9184"),
    "Date" : "2013-05-06 08:10:26.5019",
    "Level" : "Debug",
    "Message" : "Sample debug message",
    "Logger" : "NLog.Mongo.ConsoleTest.Program",
    "ThreadID" : "9",
    "ProcessID" : "26604",
    "ProcessName" : "C:\\Projects\\github\\NLog.Mongo\\Source\\NLog.Mongo.ConsoleTest\\bin\\Debug\\v4.5\\NLog.Mongo.ConsoleTest.exe",
    "UserName" : "pwelter"
}
```
