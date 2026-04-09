# FuelEU Maritime Compliance Platform

## Overview

This project is a minimal full-stack implementation of a FuelEU Maritime compliance system. It helps track ship emissions, calculate compliance balance (CB), and manage mechanisms like banking and pooling.

## Tech Stack

* Backend: Node.js + TypeScript + Express
* Frontend: React + TypeScript + TailwindCSS (to be implemented)
* Database: PostgreSQL (planned, currently using in-memory data)

## Architecture

The project follows a **Hexagonal Architecture (Ports & Adapters)** approach:

* `core/` → business logic (domain + use cases)
* `adapters/` → UI and infrastructure implementations
* `infrastructure/` → server and database setup
* `shared/` → reusable utilities

(Current implementation focuses on backend setup and API development.)

## Features

* Fetch routes data (`/routes`)
* Baseline selection (planned)
* Route comparison (planned)
* Compliance Balance (CB) calculation (planned)
* Banking system (planned)
* Pooling system (planned)

## Setup Instructions

### Backend

```bash
cd backend
npm install
npx ts-node-dev src/index.ts
```

Server runs on:
http://localhost:3000

## Testing

* APIs can be tested via browser or Postman

## Current Progress

* Backend server setup completed
* Express + TypeScript configured
* Initial API development started

## Future Improvements

* Add PostgreSQL database
* Implement full hexagonal architecture
* Build frontend dashboard
* Add validation and testing
