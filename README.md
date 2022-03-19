# CodeSupport API

## About
This repository contains the code for the CodeSupport API. The project is written in TypeScript using the [NestJS](https://nestjs.com/) framework with a postgreSQL database.

## **Any Questions?**
 Feel free to mention @LamboCreeper#6510 in the [CodeSupport Discord](https://codesupport.dev/discord).

## **Getting started**

### **With Docker**
For development purposes, this project is configured to make use of Docker for easily running the API and a local postgresql instance with no configuration required. In order to make use of this, [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) must be installed on the machine. The easiest way to get these components on MacOS, Windows and Linux is to install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

With docker installed, the application can be started by running the *start:docker* npm script with no further configuration required.

`npm run start:docker`

This will automatically set up docker images for postgresql and the nestJS API with hot reloading, meaning the docker container will automatically update when a file is changed.

If any NPM dependencies are installed or uninstalled, docker might not pick up the changes to the NPM dependencies. To fix this, run `docker:rebuild`. This will rebuild the image and refresh any cached NPM packages.

### **Without Docker**
The application can also be ran without Docker. In this case, Node.js version 12 or later (tested with 16.13) and a PostgreSQL server instance is required.

Copy *.env.example* and rename it to *.env*, then fill out the required PostgreSQL login details for your PostgreSQL server. Start the app by running the *start:debug* npm script.

`npm run start:debug`

### **Attaching a debugger**
With both the docker and non-docker approach, the application is automatically set to debug mode. If you're using visual studio code, you can easily attach a debugger by going to the 'Run and Debug' tab and selecting either the `debug-docker` or `debug-local` profile. 

![](https://i.imgur.com/WyFg7D0.png)

