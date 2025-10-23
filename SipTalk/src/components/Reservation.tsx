import React, { useState, useEffect } from 'react';
import '../styles/Reservation.css';
import { getCurrentUser, isLoggedIn } from '../utils/auth';

interface ReservationProps {
  onBack?: () => void;
  onReservationSuccess?: () => void;
  onLoginRequired?: () => void;
}

interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
}

// Toggle this to use PHP backend or localStorage
const USE_BACKEND_API = false;
const API_ENDPOINT = '/reservation.php'; // Your PHP backend endpoint

const Reservation: React.FC<ReservationProps> = ({ onBack, onReservationSuccess, onLoginRequired }) => {
  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1
  });
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const loggedIn = isLoggedIn();
    setUserLoggedIn(loggedIn);

    // Pre-fill form with user data if logged in
    if (loggedIn) {
      const user = getCurrentUser();
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.fullname || '',
          email: user.email || ''
        }));
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in (required for backend)
    if (USE_BACKEND_API && !userLoggedIn) {
      alert('❌ Please login first before making a reservation.');
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }

    setShowModal(true);
  };

  const submitReservationToBackend = async () => {
    // Submit reservation to PHP backend (requires login)
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('guests', formData.guests.toString());

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formDataToSend,
      credentials: 'include' // Include session cookies
    });

    const text = await response.text();

    // PHP returns HTML with script tags, extract the message
    if (text.includes('Please login first')) {
      alert('❌ Please login first before making a reservation.');
      if (onLoginRequired) {
        onLoginRequired();
      }
      throw new Error('Login required');
    } else if (text.includes('Reservation successful')) {
      // Extract date and time from response if needed
      return text;
    } else {
      throw new Error('Failed to submit reservation');
    }
  };

  const submitReservationToLocalStorage = () => {
    // For localStorage mode, we still recommend login but don't enforce it
    const user = getCurrentUser();
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    const newReservation = {
      id: Date.now(),
      user_id: user ? user.user_id : null,
      user_email: user ? user.email : formData.email,
      ...formData,
      created_at: new Date().toISOString(),
      status: 'pending'
    };

    reservations.push(newReservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
  };

  const confirmReservation = async () => {
    setShowModal(false);
    setLoading(true);

    try {
      if (USE_BACKEND_API) {
        await submitReservationToBackend();
      } else {
        submitReservationToLocalStorage();
      }

      const successMessage = `✅ Reservation successful! See you on ${formData.date} at ${formData.time}.`;
      displayToast(successMessage);
      
      // Reset form (keep name and email if user is logged in)
      const user = getCurrentUser();
      setFormData({
        name: user ? user.fullname : '',
        email: user ? user.email : '',
        phone: '',
        date: '',
        time: '',
        guests: 1
      });

      if (onReservationSuccess) {
        setTimeout(() => {
          onReservationSuccess();
        }, 2000);
      }

    } catch (error) {
      console.error('Reservation error:', error);
      displayToast('✗ Failed to submit reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = () => {
    setShowModal(false);
    displayToast('✗ Reservation cancelled.');
  };

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <h2>Reserve a Table</h2>
        <form onSubmit={handleSubmit} id="reservationForm">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your Phone Number"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={today}
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
            max="20"
            placeholder="Number of Guests"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Reserving...' : 'Reserve Now'}
          </button>
        </form>
        {onBack && (
          <button onClick={onBack} className="back-button">
            ← Back to Home
          </button>
        )}
      </div>

      {/* Custom Modal */}
      {showModal && (
        <div className="custom-alert show">
          <h3>Confirm Reservation</h3>
          <p>Do you want to confirm your reservation?</p>
          <button onClick={confirmReservation}>Yes</button>
          <button onClick={cancelReservation}>Cancel</button>
        </div>
      )}

      {/* Toast */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
};

export default Reservation;

