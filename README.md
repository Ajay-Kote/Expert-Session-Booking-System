# Real-Time Expert Session Booking System

![Project Banner]([https://via.placeholder.com/1200x400?text=Expert+Session+Booking+System](https://expert-session-booking-system-frontend-wo1f.onrender.com/))

A comprehensive, full-stack web application designed to connect users with industry experts. This platform enables users to seamlessly discover experts, view their real-time availability, and securely book 1-on-1 sessions.

The system is built with a focus on **concurrency**, **real-time synchronization**, and **robust data integrity** to ensure that double-booking scenarios are structurally impossible.

---

## 🌟 Key Features

### 1. Dynamic Expert Discovery
- **Rich Profiles**: View detailed expert profiles including their name, category, years of experience, rating, and bio.
- **Search & Filter**: Instantly search for experts by name and filter them by category (e.g., Software Engineering, UX/UI Design, Product Management).
- **Pagination**: Efficiently loads expert data in chunks to optimize performance and reduce server load.

### 2. Real-Time Availability & Booking
- **Live Slot Updates**: Powered by **Socket.io**, the system broadcasts booking events in real-time. If a user is viewing an expert's calendar and another user books a slot, that slot instantly disables itself on the first user's screen without requiring a page refresh.
- **Timezone-Agnostic Grouping**: Available time slots are intelligently grouped by date for a seamless user experience.

### 3. Bulletproof Double-Booking Prevention
- **Database Level Constraint**: Uses MongoDB Compound Indexing (`expertId`, `date`, `slot`) to enforce absolute uniqueness.
- **Race Condition Handling**: Even if two users bypass the frontend and hit the API at the exact same millisecond, the database throws a duplicate key error (`11000`), which the backend catches and translates into a graceful `409 Conflict` error to the user.

### 4. Booking Management Dashboard
- **My Bookings**: Users can fetch all their booked sessions using their email address.
- **Status Tracking**: Easily track whether a session is `Pending`, `Confirmed`, `Completed`, or `Cancelled`.

---

## 💻 Tech Stack

### Frontend
- **React.js (Vite)**: Lightning-fast development environment and optimized production builds.
- **Tailwind CSS**: Utility-first styling for a beautiful, responsive, and modern user interface.
- **Lucide React**: Clean and crisp SVG icons.
- **Axios**: Promise-based HTTP client for seamless API interactions.
- **Socket.io-client**: For listening to real-time WebSocket events.

### Backend
- **Node.js & Express.js**: High-performance, unopinionated routing and middleware architecture.
- **MongoDB & Mongoose**: NoSQL database for flexible schema design and powerful indexing capabilities.
- **Socket.io**: Enabling bi-directional communication between web clients and the server.
- **Joi**: Object schema validation to ensure clean data is written to the database.

---

## 📁 Project Structure

```text
Expert-Session-Booking-System/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, ExpertCard)
│   │   ├── context/            # Global state (SocketContext)
│   │   ├── pages/              # Page components (Listing, Detail, Booking, MyBookings)
│   │   ├── App.jsx             # Main application router
│   │   └── main.jsx            # React entry point
│   ├── tailwind.config.js      # Tailwind configuration
│   └── vite.config.js          # Vite configuration
│
└── server/                     # Node.js + Express Backend
    ├── config/                 # Database connection logic
    ├── controllers/            # Business logic for routes
    ├── middleware/             # Custom error handlers and validation
    ├── models/                 # Mongoose schemas (Expert, Booking)
    ├── routes/                 # API route definitions
    ├── seed.js                 # Script to populate database with mock data
    └── server.js               # Express app setup and Socket.io initialization
```

---

## 🚀 Setup and Installation

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Ajay-Kote/Expert-Session-Booking-System.git
cd Expert-Session-Booking-System
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the root of the `server` directory and add the following variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string_here
```

Start the backend development server:
```bash
npm run dev
```
*(The server will run on `http://localhost:5000`)*

### 3. Frontend Setup
Open a new terminal window, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*(The client will run on `http://localhost:5173`)*

---

## 📡 API Documentation

### Experts
- `GET /api/experts`
  - Fetches a paginated list of experts.
  - Query Params: `search` (string), `category` (string), `page` (number), `limit` (number).
- `GET /api/experts/:id`
  - Fetches a single expert's details and their currently booked slots.

### Bookings
- `POST /api/bookings`
  - Creates a new booking.
  - Body: `{ expertId, userName, userEmail, userPhone, date, slot, notes }`
- `GET /api/bookings?email={userEmail}`
  - Fetches all bookings associated with a specific user email (Case-insensitive).
- `PATCH /api/bookings/:id/status`
  - Updates the status of a specific booking.

---

## 🛠️ Error Handling Mechanisms

1. **Joi Validation**: Before any booking is processed, the incoming payload is sanitized and validated.
2. **Duplicate Key Catching**: If a user tries to book a slot that was taken milliseconds prior, MongoDB throws an `E11000` error. The global error handler catches this and returns a user-friendly message: *"This time slot is already booked. Please choose another one."*
3. **Graceful Fallbacks**: The frontend handles loading states (`Loader2`), empty states (no experts found, no bookings found), and API failures seamlessly.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/Ajay-Kote/Expert-Session-Booking-System/issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License.
