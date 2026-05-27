# API Am I Cooked ?

A RESTful API built with Node.js and Express to power a cooking application. Handles users, recipes, ingredients, favorites, and image uploads with JWT-based authentication and MySQL persistence.

## Features

- User registration, login, and profile management
- Full CRUD for recipes, including linked ingredients and pictures
- Image uploads stored as blobs (via Multer)
- JWT authentication and authorization
- Centralized error handling

## Tech Stack

Node.js · Express · MySQL/MariaDB · mysql2 · JWT · Bcrypt · Multer

## Getting Started

### 1. Clone & install

```bash
git clone <repository-url>
cd API-AmICooked
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```env
# Environment variables for Amicooked application
## Database configuration
MYSQL_ROOT_PASSWORD=my_root_password
MYSQL_DATABASE=my_database
MYSQL_USER=mysql_user
MYSQL_PASSWORD=mysql_password
## Application configuration
DB_HOST=db_host
DB_USER=db_user
DB_PASSWORD=db_password
DB_NAME=db_name
PORT=3001

# JWT configuration
JWT_SECRET=change_me_access_secret
JWT_REFRESH_SECRET=change_me_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Start the docker compose

```bash
docker compose up --build -d
```

The API runs at `http://localhost:3000` by default.

## Project Structure

```
API-AmICooked/
├── config/         # DB connection & SQL schema
├── controllers/    # Business logic
├── middleware/     # Auth & error handling
├── routes/         # Route definitions
├── public/         # Static assets
└── server.js       # Entry point
```

## Authors 

* Noah CHARRIN--BOURRAT
* Mathieu BERIAC
* Raphaël BONNET
* Loïc ANDRIANARIVONY