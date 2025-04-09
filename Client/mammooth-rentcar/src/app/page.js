'use client';

import { useState } from 'react';

export default function SubmitRentalForm() {
  const [carId, setCarId] = useState('');
  const defaultStartDate = '2025-04-07T21:00';
  const defaultEndDate = '2025-04-07T22:00';
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      alert('Please log in first.');
      return;
    }

    if (!carId || !startDate || !endDate) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://localhost:5022/api/Request/SubmitRentialRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ carId, startDate, endDate }),
      });

      const contentType = res.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.log(text);
      }

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      alert('Rental request submitted!');
      setCarId('');
      setLoading(false);
    } catch (err) {
      console.error('Submission failed:', err);
      alert(err.message || 'Unexpected error occurred.');
    }
  };

  return (
    <div className="main">
      <div className="overlay" />

      {/* Nav Bar */}
      <header className="navbar">
      <div className="logo">
         <img src="/assets/logo.png" alt="CarRental Logo" />
      </div>
        <nav className="nav-links">
          <a href="#">Prices</a>
          <a href="#">Car Fleet</a>
          <a href="#">Locations</a>
          <a href="#">Services</a>
          <a href="#">About</a>
          <a href="#">Contacts</a>
        </nav>
        <div className="login-link">
          <a href="#">Log in</a>
        </div>
      </header>

      <div className="form-container">
        <h1>Rent a Car for Every Journey</h1>
        <div className="form-grid">
          <div className="form-group">
            <label>Car ID</label>
            <input
              type="text"
              value={carId}
              onChange={(e) => setCarId(e.target.value)}
              placeholder="Enter Car ID"
            />
          </div>
          <div className="form-group">
            <label>Pick Up Date & Time</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Return Date & Time</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Search'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .main {
          position: relative;
          height: 100vh;
          background-image: url("/assets/porsche.png");
          background-size: cover;
          background-position: center;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          padding-top: 80px; /* prevent nav bar overlap */
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 0;
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
          z-index: 10;
        }

       
          .logo img {
  height: 40px;
  object-fit: contain;
}

        .nav-links a {
          margin: 0 10px;
          text-decoration: none;
          color: #333;
          font-weight: 500;
        }

        .login-link a {
          text-decoration: none;
          font-weight: bold;
          color: #0070f3;
        }

        .form-container {
          position: absolute;
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1200px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          padding: 20px 30px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          z-index: 2;
        }

        .form-container h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .form-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .form-group {
          flex: 1;
          min-width: 220px;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 6px;
          font-weight: 600;
        }

        .form-group input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        button {
          align-self: flex-end;
          padding: 12px 24px;
          background-color: #1f2937;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #111827;
        }

        button:disabled {
          background-color: #888;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-grid {
            flex-direction: column;
          }

          button {
            width: 100%;
            align-self: stretch;
          }

          .nav-links {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
