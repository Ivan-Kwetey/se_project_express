# WTWR (What to Wear?): Back-End
The WTWR (What to Wear?) back-end is the server-side component of the WTWR web application. It provides a RESTful API that enables users to register, log in, and manage clothing items. The server handles database interactions, validation, and authorization, ensuring a secure and reliable experience.
## Project Overview
This project builds the back-end for the WTWR app — a weather-based clothing recommendation service.
The API allows users to:
Create and manage clothing items.
Like or unlike clothing items.
Manage user profiles and avatars.
Connect to a MongoDB database for data persistence.

## Technologies and Techniques Used
Node.js and Express.js — server framework and routing.
MongoDB with Mongoose — database and schema modeling.
Validator — URL and string validation for data integrity.
ESLint — code quality and consistency enforcement.
RESTful API design — clean, resource-based architecture.
Environment-based configuration — separate production and development modes.

## Running the Project
`npm run start` — to launch the server 

`npm run dev` — to launch the server with the hot reload feature
The server runs by default on localhost:3001 and connects to the local MongoDB instance.

### Testing
Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
