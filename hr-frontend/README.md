# HR-app Frontend – React + Redux Toolkit + Material UI 🇭🇺

Ez a frontend egy modern HR alkalmazás React, Redux Toolkit és Material UI stackkel.

## Fő funkciók

- Regisztráció, bejelentkezés, JWT token kezelés
- Saját profil szerkesztése (név, avatar, jelszó)
- Publikus user lista (keresés, lapozás)
- Admin funkciók: user szerkesztés, törlés, role váltás (ha admin vagy)
- Jelszó visszaállítás (email + új jelszó 2x)
- Responsív, dark/light mód, mobilbarát UI

## Indítás

1. `cd hr-frontend && npm install && npm start`
2. A backendnek futnia kell (alapértelmezett: http://localhost:5000, proxy beállítva)

## Környezeti változók

- `.env` (általában nem szükséges, proxy a package.json-ban)

## Build

- `npm run build` – production build a build/ mappába

## Tech stack

- React, Redux Toolkit, Material UI, axios, react-router-dom

---

# HR-app Frontend – React + Redux Toolkit + Material UI 🇬🇧

This frontend is a modern HR application built with React, Redux Toolkit, and Material UI.

## Main features

- Registration, login, JWT token management
- Edit own profile (name, avatar, password)
- Public user list (search, pagination)
- Admin features: edit/delete user, change role (if admin)
- Password reset (email + new password twice)
- Responsive, dark/light mode, mobile-friendly UI

## Getting started

1. `cd hr-frontend && npm install && npm start`
2. Backend must be running (default: http://localhost:5000, proxy set)

## Environment variables

- `.env` (usually not needed, proxy in package.json)

## Build

- `npm run build` – production build to build/ folder

## Tech stack

- React, Redux Toolkit, Material UI, axios, react-router-dom
