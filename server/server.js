const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const seedDataIfNeeded = require('./seed');

// Load env vars
dotenv.config();

// Connect to database and seed if using in-memory
connectDB().then(() => {
  seedDataIfNeeded();
});

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow frontend domain in production
    methods: ['GET', 'POST', 'PATCH']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible to routers
app.set('io', io);

// Socket.io Connection
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Routes
const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
