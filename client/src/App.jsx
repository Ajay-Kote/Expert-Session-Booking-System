import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import ExpertListingPage from './pages/ExpertListingPage';
import ExpertDetailPage from './pages/ExpertDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ExpertListingPage />} />
              <Route path="/experts/:id" element={<ExpertDetailPage />} />
              <Route path="/book/:id" element={<BookingPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
