---
layout: post
dateCreated: 3/31/2006 3:15:00 PM
title: MSBuild Community Tasks Project releases new version
tags:
- MSBuild
---

### Announcement

The MSBuild Community Tasks Project releases version v1.1.0.145. There are many new tasks in this release. Special thanks to all the contributors to the project.

### Current Community Tasks

<table width="90%" cellspacing="0" cellpadding="3" border="0" id="tasksTable">
    <tbody>
        <tr>
            <th width="190" align="left">Task</th>
            <th align="left">Description</th>
        </tr>
        <tr>
            <td>AppPoolController</td>
            <td>Allows control for an application pool on a local or remote machine with IIS installed.</td>
        </tr>
        <tr>
            <td>AppPoolCreate</td>
            <td>Creates a new application pool on a local or remote machine.</td>
        </tr>
        <tr>
            <td>AppPoolDelete</td>
            <td>Deletes an existing application pool on a local or remote machine.</td>
        </tr>
        <tr>
            <td>AssemblyInfo</td>
            <td>Generates an AssemblyInfo file using the attributes given.</td>
        </tr>
        <tr>
            <td>Attrib</td>
            <td>Changes the attributes of files and/or directories</td>
        </tr>
        <tr>
            <td>FileUpdate</td>
            <td>Replace text in file(s) using a Regular Expression.</td>
        </tr>
        <tr>
            <td>FtpUpload</td>
            <td>Uploads a file using File Transfer Protocol (FTP).</td>
        </tr>
        <tr>
            <td>FxCop</td>
            <td>Uses FxCop to analyze managed code assemblies and reports on their design best-practice compliance.</td>
        </tr>
        <tr>
            <td>Mail</td>
            <td>Sends an email message.</td>
        </tr>
        <tr>
            <td>Math.Add</td>
            <td>Add numbers.</td>
        </tr>
        <tr>
            <td>Math.Divide</td>
            <td>Divide numbers.</td>
        </tr>
        <tr>
            <td>Math.Multiple</td>
            <td>Multiple numbers.</td>
        </tr>
        <tr>
            <td>Math.Subtract</td>
            <td>Subtract numbers.</td>
        </tr>
        <tr>
            <td>Move</td>
            <td>Moves files on the filesystem to a new location.</td>
        </tr>
        <tr>
            <td>NDoc</td>
            <td>Runs NDoc to create documentation.</td>
        </tr>
        <tr>
            <td>NUnit</td>
            <td>Runs tests using the NUnit.</td>
        </tr>
        <tr>
            <td>RegistryRead</td>
            <td>Reads a value from the Registry.</td>
        </tr>
        <tr>
            <td>RegistryWrite</td>
            <td>Writes a value to the Registry.</td>
        </tr>
        <tr>
            <td>Script</td>
            <td>Executes code contained within the task.</td>
        </tr>
        <tr>
            <td>ServiceController</td>
            <td>Task that can control a Windows service.</td>
        </tr>
        <tr>
            <td>ServiceQuery</td>
            <td>Task that can determine the status of a service.</td>
        </tr>
        <tr>
            <td>Sleep</td>
            <td>A task for sleeping for a specified period of time.</td>
        </tr>
        <tr>
            <td>SqlExecute</td>
            <td>Executes a SQL command</td>
        </tr>
        <tr>
            <td>SvnCheckout</td>
            <td>Checkout files from Subversion</td>
        </tr>
        <tr>
            <td>SvnClient</td>
            <td>Subversion Client</td>
        </tr>
        <tr>
            <td>SvnCommit</td>
            <td>Commit files to Subversion</td>
        </tr>
        <tr>
            <td>SvnExport</td>
            <td>Export files from Subversion</td>
        </tr>
        <tr>
            <td>SvnInfo</td>
            <td>Get Subversion information for a file or directory.</td>
        </tr>
        <tr>
            <td>SvnUpdate</td>
            <td>Update files from Subversion</td>
        </tr>
        <tr>
            <td>SvnVersion</td>
            <td>Get Subversion revision number of a local copy</td>
        </tr>
        <tr>
            <td>TaskSchema</td>
            <td>Generates a XSD schema of the MSBuild tasks in an assembly.</td>
        </tr>
        <tr>
            <td>Time</td>
            <td>Gets the current date and time.</td>
        </tr>
        <tr>
            <td>Unzip</td>
            <td>Unzip a file to a target directory.</td>
        </tr>
        <tr>
            <td>Version</td>
            <td>Increments a four-part version number stored in a text file</td>
        </tr>
        <tr>
            <td>VssAdd</td>
            <td>Adds files to a Visual SourceSafe database.</td>
        </tr>
        <tr>
            <td>VssCheckin</td>
            <td>Checks in files to a Visual SourceSafe database.</td>
        </tr>
        <tr>
            <td>VssCheckout</td>
            <td>Checks out files from a Visual SourceSafe database.</td>
        </tr>
        <tr>
            <td>VssClean</td>
            <td>Removes Visual SourceSafe binding information and status files from a Visual Studio solution tree.</td>
        </tr>
        <tr>
            <td>VssDiff</td>
            <td>Generates a diff between two versions of an item in a Visual SourceSafe database.</td>
        </tr>
        <tr>
            <td>VssGet</td>
            <td>Gets the latest version of a file or project from a Visual SourceSafe database.</td>
        </tr>
        <tr>
            <td>VssHistory</td>
            <td>Generates an XML file containing the history of an item in a Visual SourceSafe database between two dates or labels.</td>
        </tr>
        <tr>
            <td>VssLabel</td>
            <td>Labels an item in a Visual SourceSafe database.</td>
        </tr>
        <tr>
            <td>VssUndoCheckout</td>
            <td>Cancels a checkout of an item from a Visual SourceSafe database.</td>
        </tr>
        <tr>
            <td>WebDirectoryCreate</td>
            <td>Creates a new web directory on a local or remote machine.</td>
        </tr>
        <tr>
            <td>WebDirectoryDelete</td>
            <td>Deletes a web directory on a local or remote machine</td>
        </tr>
        <tr>
            <td>WebDownload</td>
            <td>Downloads a resource with the specified URI to a local file.</td>
        </tr>
        <tr>
            <td>XmlRead</td>
            <td>Reads a value from a XML document using a XPath.</td>
        </tr>
        <tr>
            <td>XmlWrite</td>
            <td>Updates a XML document using a XPath.</td>
        </tr>
        <tr>
            <td>Xslt</td>
            <td>Merge and transform a set of xml files.</td>
        </tr>
        <tr>
            <td>Zip</td>
            <td>Create a zip file with the files specified.</td>
        </tr>
    </tbody>
</table>

### Join Project

Please join the MSBuild Community Tasks Project and help contribute in building the tasks.&nbsp;

[http://msbuildtasks.tigris.org/](http://msbuildtasks.tigris.org/)

### Download The Latest Release

The latest binaries, source and installer for Windows can be found in [this directory](http://msbuildtasks.tigris.org/servlets/ProjectDocumentList) of the Tigris file-sharing area.

*   [ MSBuild.Community.Tasks.msi](http://msbuildtasks.tigris.org/files/documents/3383/28296/MSBuild.Community.Tasks.msi) - MSBuild Community Tasks Setup
*   [ MSBuild.Community.Tasks.v1.1.0.145.zip](http://msbuildtasks.tigris.org/files/documents/3383/30904/MSBuild.Community.Tasks.v1.1.0.145.zip) - MSBuild Community Tasks v1.1.0.145 Source