+++
date = '2005-12-05T12:27:00-06:00'
title = 'Sample build file using MSBuild Community Tasks'
url = 'Sample-build-file-using-MSBuild-Community-Tasks'
tags = ['msbuild', 'build']
categories = ['Examples']
author = 'Paul Welter'
description = 'Sample build project demonstrating the use of MSBuild Community Tasks for creating releases.'
+++


The [MSBuild Community Tasks Project](http://msbuildtasks.tigris.org/) has released the first version of tasks. The following is a sample build project that uses the SvnVersion, AssemblyInfo, NDoc and Zip tasks to create a release.

**Import Targets**

The first thing that needs to be done in the build file is to import the MSBuild.Community.Tasks.Targets file that defines the available tasks. If you use the msi installer to install the MSBuild Community Tasks, you can use the path "$(MSBuildExtensionsPath)\MSBuildCommunityTasks\MSBuild.Community.Tasks.Targets".

**Version Target**

The first target in the sample file is the Version target. The version target is used to update the latest version number. First the SvnVersion task is used to get the latest Revision number from the local working subversion repository. SvnVersion outputs the Revision to the Revision property.

Next the target uses the AssemblyInfo task to generate an AssemblyInfo.cs file with the attributes specified.

**Compile Target**

The compile target calls msbuild to compile the solution in release mode. The MSBuild target will compile the solution the exact same way Visual Studio will.

**Documentation Target**

To create help for the project, there is the documentation target. In the documentation target, the NDoc task is used to compile a HTML Help project. To use the NDoc task, you must have NDoc 1.3.1 installed.

The generated HTML Help file is then moved to the documentation folder and the temp files are cleaned up.

**Zip Target**

The zip target is used to package up the whole project into a zip file. Zip target uses the Zip task to create the zip. The files included in the zip are selected by the ItemGroup ZipFiles.

**Sample Master.proj File**

```xml
<?xml version="1.0" encoding="utf-8"?>  
  
<Project DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">  
  <Import Project="$(MSBuildExtensionsPath)\MSBuildCommunityTasks\MSBuild.Community.Tasks.Targets"/>  
   
  <PropertyGroup>  
   <Major>1</Major>  
    <Minor>0</Minor>  
    <Build>0</Build>  
    <Revision>0</Revision>  
  </PropertyGroup>  
  
  <ItemGroup>  
    <DefaultExclude Include="**\.svn\**" />  
    <DefaultExclude Include="**\bin\**" />  
    <DefaultExclude Include="**\obj\**" />  
    <DefaultExclude Include="**\Release\**" />  
    <DefaultExclude Include="**\Debug\**" />  
    <DefaultExclude Include="**\Test\**" />  
    <DefaultExclude Include="**\TestResults\**" />  
    <DefaultExclude Include="**\doc\**" />  
    <DefaultExclude Include="**\www\**" />  
    <DefaultExclude Include="**\*.user" />  
    <DefaultExclude Include="**\*.suo" />  
    <DefaultExclude Include="**\*.zip" />  
    <DefaultExclude Include="**\*.txt" />  
  </ItemGroup>  
   
  <ItemGroup>  
    <ZipFiles Include="**\*.*" Exclude="@(DefaultExclude)" />  
  </ItemGroup>  
   
  <Target Name="Version">  
    <SvnVersion LocalPath="$(MSBuildProjectDirectory)">  
      <Output TaskParameter="Revision" PropertyName="Revision" />  
    </SvnVersion>  
   
    <Message Text="Version: $(Major).$(Minor).$(Build).$(Revision)"/>  
   
    <AssemblyInfo CodeLanguage="CS"   
      OutputFile="Source\MSBuild.Community.Tasks\Properties\AssemblyInfo.cs"  
      AssemblyTitle="MSBuild Community Tasks"  
      AssemblyDescription="Collection MSBuild Tasks"  
      AssemblyCompany="http://msbuildtasks.tigris.org/"  
      AssemblyProduct="MSBuild.Community.Tasks"  
      AssemblyCopyright="Copyright © Paul Welter 2005"       
      ComVisible="false"  
      CLSCompliant="true"  
      Guid="d038566a-1937-478a-b5c5-b79c4afb253d"  
      AssemblyVersion="$(Major).$(Minor).$(Build).$(Revision)"  
      AssemblyFileVersion="$(Major).$(Minor).$(Build).$(Revision)"  
      Condition="$(Revision) != '0' "/>  
   
  </Target>  
   
  <Target Name="Compile" DependsOnTargets="Version">  
    <MSBuild Projects="Source\MSBuild.Community.Tasks.sln"  
             Properties="Configuration=Release" />  
  </Target>  
   
  <Target Name="Documentation" DependsOnTargets="Compile">  
    <NDoc Documenter="MSDN"  
          ProjectFilePath="Documentation\MSBuild.Community.Tasks.ndoc" />  
   
    <Copy SourceFiles="doc\MSBuild Community Tasks.chm"  
          DestinationFiles="Documentation\MSBuild.Community.Tasks.chm" />  
   
    <RemoveDir Directories="doc" />  
   
  </Target>  
   
  <Target Name="Zip" DependsOnTargets="Documentation">  
    <Zip Files="@(ZipFiles)"  
         ZipFileName="MSBuild.Community.Tasks.v$(Major).$(Minor).$(Build).$(Revision).zip" />  
  </Target>  
   
  <Target Name="Build" DependsOnTargets="Zip">  
    <Message Text="CodeSmith Build Complete"/>  
  </Target>  
   
</Project>
```

I hope this sample will help in creating build files for your project.

~ Paul
