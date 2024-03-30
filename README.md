<p align="center">
  <img src="https://www.uit.edu.vn/sites/vi/files/banner_uit.png" style="display: block; margin: 0 auto">
</p>

<h1 align="center"><b>Bếp UIT Backend</b> </h1>

## Overview

-   **Bếp UIT** is a website used for managing a small restaurant at UIT.
-   This repository is the API for the website.
-   Technology in use: NestJS, Mongoose - MongoDB, Cloudinary.

## Installation

### Prepare the database

-   A mongo DB Atlas database
-   A Cloudiary storage

### Clone this repository

```bash
git clone https://github.com/trungpd0911/ie204.ie213_be.git
```

### Create .env file

-   Create a .env file with the following content:

```
DB_URL = <YOUR DB CONNECTION STRING>
port = <YOUR APP PORT>
JWT_SECRET = <YOUR JWT SECRET>
JWT_EXPIRES_IN = <YOUR JWT EXPIRING TIME>
```

### Install dependencies

```bash
npm intall
```

### Start the server

```bash
npm run start:dev
```

Now the API is available with host: `http:/localhost:3000`

## Folder Structure

### This project is base on module structure:

```java
+-- src
|   +-- auth // Authentication
|   +-- guards // Nest Guards
|   +-- schemas // Mongoose data schemas
|   +-- helper // Some helper class used in the project
|   +-- global // Global components that used in whole project
|   +-- examples // An example module (users, posts, comments, ...)
|       +-- dto // Dto models
|       +-- examples.controller.ts // Controller Layer File
|       +-- examples.controller.spec.ts // Controller Layer Testing File
|       +-- examples.service.ts  // Service Layer File
|       +-- examples.service.spec.ts // Service Layer Testing File
|       +-- examples.module.ts
+-- app.module.ts
+-- main.ts

```

## Documentation

-   Swagger UI is available at: `http://localhost:3000/api/#/`

## Deployment

-   The deployment version is available at host: <span style='color:red'>TODO</span>
