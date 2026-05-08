import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BookingList from './pages/BookingList';
import BookingForm from './pages/BookingForm';
import Profile from './pages/Profile';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Sidebar />
      <main className="pt-14 pl-14">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BookingList />} />
          <Route path="/booking/new" element={<BookingForm />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
