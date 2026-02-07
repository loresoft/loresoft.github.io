+++
date = '2026-02-07T08:53:47-06:00'
title = 'Docker in WSL Without Docker Desktop'
slug = 'Docker-in-WSL-without-Docker-Desktop'
tags = ['Docker', 'WSL', 'Windows', 'Linux', 'PowerShell']
categories = ['Development', 'Projects']
author = 'Paul Welter'
description = 'A lightweight alternative to Docker Desktop: Install and run Docker natively in WSL using an automated PowerShell script'
+++

## The Challenge with Docker Desktop

Docker Desktop has been the solution for running Docker on Windows, but it comes with some considerations:

- Licensing requirements for commercial use
- Resource overhead from running a full Docker Desktop
- Complexity for users who just need basic Docker functionality

For developers looking for a lightweight alternative, running Docker directly in Windows Subsystem for Linux 2 (WSL) is a practical option.

## Introducing docker-wsl

I've created [docker-wsl](https://github.com/loresoft/docker-wsl), an automated PowerShell script that installs and configures Docker within WSL without requiring Docker Desktop. This project enables you to run Docker natively in WSL's Ubuntu environment while maintaining full compatibility with Windows PowerShell.

## Key Features

The automated installation script provides:

- **WSL Configuration**: Sets up WSL with mirrored networking mode for seamless connectivity
- **Ubuntu Distribution**: Installs a fresh Ubuntu instance within WSL
- **Docker Engine**: Deploys Docker natively within the Ubuntu environment
- **Systemd Integration**: Configures Docker as a systemd service for reliable daemon management
- **Windows Docker CLI**: Installs the Docker CLI tools for Windows
- **Automatic Configuration**: Detects WSL IP and configures DOCKER_HOST environment variable
- **Auto-Startup**: Creates a Windows Task Scheduler job to start Docker at user logon
- **Cross-Platform Access**: Run Docker commands from both Windows PowerShell and WSL

## How It Works

The architecture is straightforward:

1. The Docker daemon runs as a systemd service within the WSL Ubuntu instance
2. WSL's mirrored networking mode exposes the daemon on localhost (127.0.0.1:2375)
3. Windows PowerShell communicates with the daemon through this local connection
4. A scheduled task keeps the Ubuntu distribution active, ensuring Docker remains accessible

This approach eliminates the need for Docker Desktop's overhead while maintaining full Docker functionality.

## Installation

Getting started is straightforward:

1. **Run as Administrator**: Execute the PowerShell script with administrator privileges
2. **Ubuntu Setup**: Complete the Ubuntu user setup when prompted
3. **Restart**: Reboot your computer to complete WSL configuration
4. **Start Using Docker**: Docker commands work from both Windows and WSL terminals

The script handles all eight installation steps automatically:

- WSL feature enablement
- Ubuntu distribution installation
- Docker Engine deployment
- Networking configuration
- CLI tool installation
- Environment variable setup
- Task Scheduler configuration

## Usage

Once installed, Docker works seamlessly across environments:

```powershell
# From Windows PowerShell
docker ps
docker run hello-world
docker compose up
```

```bash
# From WSL Ubuntu
docker ps
docker run hello-world
docker compose up
```

## Security Considerations

**Important**: This configuration exposes Docker on port 2375 without TLS encryption. This is suitable for local development environments but **should not be used in production systems**. The setup is designed for single-user development machines where the security trade-off enables simplicity and performance.

## Benefits

Compared to Docker Desktop, this approach offers:

- **Lightweight**: No Docker Desktop overhead
- **Native Performance**: Docker runs directly in Linux
- **Free**: No licensing considerations for commercial use
- **Flexible**: Full control over Docker configuration
- **Integrated**: Works seamlessly with Windows and WSL workflows
- **IDE Support**: Compatible with Visual Studio and VS Code Docker extensions

## Get Started

Visit the [docker-wsl GitHub repository](https://github.com/loresoft/docker-wsl) to download the installation script and view detailed documentation. The entire setup takes just a few minutes and provides a lightweight Docker development environment on Windows.
