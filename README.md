# Real-Time Expert Session Booking System

A full-stack web application that allows users to seamlessly book 1-on-1 sessions with industry experts. Built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **Expert Listing**: Browse experts with dynamic search and category filtering.
- **Real-Time Booking**: Live slot updates using Socket.io to prevent double bookings visually.
- **Robust Database Constraints**: MongoDB compound indexing guarantees no double bookings can occur.
- **My Bookings Dashboard**: Track all your confirmed, pending, and completed sessions.
- **Modern UI**: Stunning, responsive frontend built with Tailwind CSS.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios
- **Backend**: Node.js, Express, Socket.io, Mongoose (MongoDB)
- **Validation**: Joi (Server-side)

## Setup and Installation

### 1. Clone the repository
```bash
git clone https://github.com/Ajay-Kote/Expert-Session-Booking-System.git
cd Expert-Session-Booking-System
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## How Real-Time Updates Work
When a user books a slot, the server emits a `slotBooked` event via Socket.io. Any client currently viewing that expert's availability will instantly see that specific time slot grayed out and disabled.

## How Double Booking is Prevented
1. **Frontend**: The selected slot is instantly disabled via Socket.io events.
2. **Backend**: A Mongoose compound index on `{ expertId, date, slot }` enforces uniqueness at the database level. If two users miraculously submit simultaneously, one request will succeed and the other will fail with a `409 Conflict`, gracefully alerting the second user.
