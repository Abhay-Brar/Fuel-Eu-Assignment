# FuelEU Maritime Compliance Platform

## Overview

This project is a full-stack implementation of a FuelEU Maritime compliance system. It allows users to track ship emissions, compare routes, calculate compliance balance (CB), and manage flexibility mechanisms such as banking and pooling.

The application includes both backend APIs and a frontend dashboard for interacting with the system.

---

## Tech Stack

- Backend: Node.js + TypeScript + Express
- Frontend: React + TypeScript + TailwindCSS
- Database: In-memory (PostgreSQL planned)

---

## Features

### Core Features

- Fetch routes data (`/routes`)
- Set a baseline route for comparison
- Compare routes based on GHG intensity
- Calculate Compliance Balance (CB)
- Banking system (store and apply credits)
- Pooling system (shared credit pool)

### UI Features

- Dashboard view of all routes
- Interactive controls for comparison and compliance
- Banking and pooling actions via UI
- Activity/History section showing all past actions

---

## Architecture

The project follows a **modular architecture inspired by Hexagonal Architecture (Ports & Adapters)**:

- `core/` → business logic and domain rules  
- `adapters/` → API routes and controllers  
- `infrastructure/` → server setup  
- `frontend/` → React dashboard  

The backend handles all business logic, while the frontend is responsible for user interaction and visualization.

---

## Workflow

User Action → API Call → Backend Logic → State Update → UI Render

Example:
- User clicks "Bank"
- Frontend sends POST request
- Backend updates balance
- Response is returned
- UI updates accordingly

---

## Setup Instructions

### Backend

```bash
cd backend
npm install
npx ts-node-dev src/index.ts