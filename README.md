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

## Features Implemented

- User registration (`/signup`) with password hashing and duplicate email handling.
- User login (`/signin`) with JWT authentication.
- Authentication middleware to protect routes.
- `GET /users/me` to fetch the currently authenticated user's profile.
- `PATCH /users/me` to update the current user's name and avatar.
- CRUD operations for clothing items:
  - Create, read, delete (owner-only), like, and dislike items.
- Error handling for:
  - Validation errors
  - Not found errors
  - Unauthorized access
  - Forbidden actions
  - Server errors
- Passwords are hidden from responses and database queries unless explicitly needed (like during login).

## Technologies and Techniques Used

- **Node.js** and **Express.js** — server framework and routing.
- **MongoDB** with **Mongoose** — database and schema modeling.
- **Validator** — URL and string validation for data integrity.
- **bcryptjs** — hashing passwords for security.
- **jsonwebtoken (JWT)** — authentication and authorization.
- **ESLint** — code quality and consistency enforcement.
- **RESTful API design** — clean, resource-based architecture.
- **Environment-based configuration** — separate production and development modes (`config.js`).

## Running the Project

- `npm run start` — launch the server  
- `npm run dev` — launch the server with hot reload

## Frontend repo:
https://github.com/Ivan-Kwetey/se_project_react

## Live site:
The live site www.seasonwear.mine.bz.  
