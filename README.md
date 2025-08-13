# HR-app – Teljes Stack HR Portfólió Projekt 🇭🇺

Ez a projekt egy modern HR alkalmazás, amely Node.js + Express + MongoDB backendből és React + Redux Toolkit + Material UI frontendből áll.
A cél: bemutatni a teljes stack fejlesztési tudást, jogosultságkezelést, reszponzív UI-t, keresést, admin funkciókat, jelszó resetet, és best practice-eket.

## Fő funkciók

- Felhasználói regisztráció, bejelentkezés, JWT tokenes autentikáció
- Saját profil szerkesztése (név, avatar, jelszó)
- Publikus user lista (keresés, lapozás)
- Admin funkciók: user szerkesztés, törlés, role váltás (adminként a publikus listában)
- Jelszó visszaállítás (email + új jelszó 2x)
- Responsív, dark/light mód, mobilbarát UI

## Indítás

1. Klónozd a repót, futtasd a backendet (`cd hr-backend && npm install && npm start`)
2. Futtasd a frontendet (`cd hr-frontend && npm install && npm start`)
3. MongoDB-nek futnia kell (alapértelmezett: `mongodb://127.0.0.1:27017/hr_app`)
4. `.env`/`config-eles.env`-ben állítsd be a titkos kulcsokat!

## Tech stack

- Backend: Node.js, Express, MongoDB, JWT, bcrypt, dotenv
- Frontend: React, Redux Toolkit, Material UI, axios, react-router-dom

## Biztonság

- Minden érzékeny adat .env-ben, .gitignore-ban kizárva
- Jelszavak hash-elve, JWT tokenek, role alapú jogosultság

---

# HR-app – Full Stack HR Portfolio Project 🇬🇧

This project is a modern HR application with a Node.js + Express + MongoDB backend and a React + Redux Toolkit + Material UI frontend.
Goal: demonstrate full stack skills, authentication, responsive UI, search, admin features, password reset, and best practices.

## Main features

- User registration, login, JWT authentication
- Edit own profile (name, avatar, password)
- Public user list (search, pagination)
- Admin features: edit/delete user, change role (in public list as admin)
- Password reset (email + new password twice)
- Responsive, dark/light mode, mobile-friendly UI

## Getting started

1. Clone the repo, start backend (`cd hr-backend && npm install && npm start`)
2. Start frontend (`cd hr-frontend && npm install && npm start`)
3. MongoDB must be running (default: `mongodb://127.0.0.1:27017/hr_app`)
4. Set secrets in `.env`/`config-eles.env`!

## Tech stack

- Backend: Node.js, Express, MongoDB, JWT, bcrypt, dotenv
- Frontend: React, Redux Toolkit, Material UI, axios, react-router-dom

## Security

- All secrets in .env, excluded by .gitignore
- Passwords hashed, JWT tokens, role-based authorization
