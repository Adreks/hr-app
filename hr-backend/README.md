# HR-app Backend – Node.js + Express + MongoDB 🇭🇺

Ez a backend egy modern HR alkalmazás Node.js, Express és MongoDB stackkel.

## Fő funkciók

- Regisztráció, bejelentkezés, JWT tokenes autentikáció
- Saját profil szerkesztése (név, avatar, jelszó)
- Publikus user lista (keresés, lapozás)
- Admin funkciók: user szerkesztés, törlés, role váltás
- Jelszó visszaállítás (email + új jelszó 2x)

## Indítás

1. `cd hr-backend && npm install && npm start`
2. MongoDB-nek futnia kell (alapértelmezett: `mongodb://127.0.0.1:27017/hr_app`)
3. Állítsd be a titkos kulcsokat a `config/config-eles.env` fájlban:
   - MONGO_URI
   - PORT
   - JWT_SECRET

## Build

- Nincs külön build, a szerver futtatható: `npm start`

## Tech stack

- Node.js, Express, MongoDB, JWT, bcrypt, dotenv

---

# HR-app Backend – Node.js + Express + MongoDB 🇬🇧

This backend is a modern HR application built with Node.js, Express, and MongoDB.

## Main features

- Registration, login, JWT authentication
- Edit own profile (name, avatar, password)
- Public user list (search, pagination)
- Admin features: edit/delete user, change role
- Password reset (email + new password twice)

## Getting started

1. `cd hr-backend && npm install && npm start`
2. MongoDB must be running (default: `mongodb://127.0.0.1:27017/hr_app`)
3. Set secrets in `config/config-eles.env`:
   - MONGO_URI
   - PORT
   - JWT_SECRET

## Build

- No separate build, just run: `npm start`

## Tech stack

- Node.js, Express, MongoDB, JWT, bcrypt, dotenv
