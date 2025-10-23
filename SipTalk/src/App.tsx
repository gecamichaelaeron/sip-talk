import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FeedbackPage from './pages/FeedbackPage';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReservationPage from './pages/ReservationPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Routes without Navbar and Footer (Login/Register) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Routes with Navbar and Footer */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main className="main-content">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    
                    {/* Menu Routes with Nested/Dynamic Routes */}
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/menu/:category" element={<MenuPage />} />
                    
                    {/* Protected Route - Requires Authentication */}
                    <Route
                      path="/reservation"
                      element={
                        <ProtectedRoute>
                          <ReservationPage />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* 404 Page - Catch all undefined routes */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
