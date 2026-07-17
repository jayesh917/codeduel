# CodeDuel

A real-time multiplayer coding trivia and problem-solving game.

## Project Overview

CodeDuel allows developers to challenge each other in real-time matches across various programming languages. Answer technical questions, write code snippets, and compete for the highest score!

## Folder Structure

- `/frontend`: React frontend using Vite, TailwindCSS, and Socket.IO-client.
- `/backend`: Node.js backend using Express and Socket.IO.
- `/backend/src/game`: Contains the core game engines and logic.

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

## Run Production Server

```bash
npm run start
```

## Environment Variables

Check `.env.example` for the required environment variables.
- `FRONTEND_URL`: URL of the frontend for CORS (default: http://localhost:3000)
- `PORT`: Backend port (default: 3000)

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Vite
- **Backend:** Node.js, Express, Socket.IO, TypeScript

## Deployment Notes

CodeDuel is designed to be deployed as a full-stack Node.js application, where the frontend is built into static files and served by the Express backend.
