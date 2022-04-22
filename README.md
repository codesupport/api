# CodeSupport API

## About
This repository contains the code for the CodeSupport API. The project is written in TypeScript using the [NestJS](https://nestjs.com/) framework with a postgreSQL database.

## **Getting started**

The project uses a `.env` file for configuration. Copy `.env.example` and rename it to `.env`. If you're going to run the application in docker, no changes to the configuration are required. If running without docker, change the settings to match your own environment.

### **With Docker**
For development purposes, this project is configured to make use of Docker for easily running the API and a local postgresql instance with no configuration required. In order to make use of this, [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) must be installed on the machine. The easiest way to get these components on MacOS, Windows and Linux is to install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

With docker installed, the application can be started by running the *start:docker* npm script with no further configuration required.

`npm run start:docker`

This will automatically set up docker images for postgresql and the NestJS API with hot reloading, meaning the docker container will automatically update when a file is changed.

If any NPM dependencies are installed or uninstalled, docker might not pick up the changes to the NPM dependencies. To fix this, run `docker:rebuild`. This will rebuild the image and refresh any cached NPM packages.

### **Without Docker**
The application can also be ran without Docker. In this case, Node.js version 12 or later (tested with 16.13) and a PostgreSQL server instance is required. Make sure you've set the correct settings in the `.env` file, then start the app by running the `start:debug` script.

`npm run start:debug`

### **Attaching a debugger**
### Visual Studio Code
With both the docker and non-docker approach, the application is automatically set to debug mode. If you're using visual studio code, you can easily attach a debugger by going to the 'Run and Debug' tab and selecting either the `debug-docker` or `debug-local` profile. 

![](https://i.imgur.com/WyFg7D0.png)

## **Any Questions?**
 Feel free to mention @LamboCreeper#6510 in the [CodeSupport Discord](https://codesupport.dev/discord).