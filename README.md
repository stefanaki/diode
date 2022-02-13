# Diode - softeng21-08

## Introduction

Semestrial student project for the course "Software Engineering" taught at ECE NTUA 2022. The project deals with the problem of interoperability between different toll stations and manages the debts of every partner operator to all the others, as well as pass events at every toll booth and deposit settlements. It consists of a RESTful API, a CLI application and a frontend web application.

## Functionality

The user may use the API to:

-   Manage information about the pass events of vehicles regarding a specific station or a specific operator
-   Get logistic data regarding the debts of each operator to the rest
-   Manage deposit settlements between operators that have been scheduled or have been completed

The CLI application also has the functionality described above, in addition with user management operations and new data insertion.

The frontend web application presents logistic data and statistics for the user in the form of tables, barcharts, piecharts and other types of diagrams.

A user authentication system using jwt is also utilized for different types of users such as admins, operators and payment service providers.

## Stack

-   API / Backend
    -   MySQL
    -   Redis
    -   Node.js & Express
-   CLI
    -   Node.js & Commander.js
-   Frontend
    -   Node.js & EJS Template Engine

Other libraries and tools:

-   [Docker](#deployment-instructions-on-localhost)
-   Moment.js for date parsing and formatting
-   Axios for executing HTTP requests
-   JSON Web Token for user authentication
-   bcryptjs for password encryption
-   Chart.js for data visualization in the frontend
-   Bootstrap CSS
-   jQuery Datatables

## Deployment Instructions on localhost

In order to get the all the components of the application up and running on your machine quickly, Docker is required.

1. Get Docker, Node.js
2. Clone the codebase  
   ```
   $ git clone https://github.com/ntua/TL21-08.git
   ```
3. In the main directory of the repository, `TL21-08`, type the following command:
    ```
    $ sudo ./install.sh
    ```
4. On success, the following paths should be exposed to the user:
    - API: https://localhost:9103/interoperability/api
    - Frontend: http://localhost:8000

## Documentation

The directory [`doc`](doc/) consists of the documentation files of the project.

-   Visual Paradigm UML diagrams
-   Postman API documentation
-   SRS & StRS documents

## Testing

In the API Postman documentation, as well as in the [`test-backend`](test-backend/) directory, there are available unit and functional testing scripts for the backend service. Furthermore, in the [`test-cli`](test-cli/) directory, there is a command line application that automatically generates and runs functional tests for the CLI.

## Partners

-   Giorgos Stefanakis
-   Odysseas Boufalis
-   Giannis Palaios
-   Fragiskos Kondilis
-   Odysseas Liodakis
