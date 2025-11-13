# WTWR (What to Wear?): Back-End

The **WTWR (What to Wear?)** back-end is the server-side component of the WTWR web application. It provides a RESTful API that enables users to register, log in, and manage clothing items. The server handles database interactions, validation, and authorization, ensuring a secure and reliable experience.  

## Project Overview

This project builds the back-end for the **WTWR app** — a weather-based clothing recommendation service.  

The API allows users to:  
- Sign up and log in securely with email and password.  
- Create, update, and delete clothing items they own.  
- Like or unlike clothing items.  
- View and update their own user profile and avatar.  
- Connect to a MongoDB database for persistent storage.  

## Technologies and Techniques Used

- **Node.js & Express.js** — server framework and routing.  
- **MongoDB with Mongoose** — database and schema modeling.  
- **JWT (JSON Web Tokens)** — authentication and authorization.  
- **bcryptjs** — password hashing.  
- **Validator** — URL, email, and string validation for data integrity.  
- **ESLint** — code quality and consistency enforcement.  
- **RESTful API design** — clean, resource-based architecture.  
- **Environment-based configuration** — separate production and development modes using `config.js`.  

## Running the Project

- `npm run start` — launch the server  
- `npm run dev` — launch the server with hot reload  

The server runs by default on `localhost:3001` and connects to the local MongoDB instance.  
