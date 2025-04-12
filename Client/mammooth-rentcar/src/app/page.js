'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from 'components/navbar';

export default function SubmitRentalForm() {

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const jwtToken = localStorage.getItem("jwt");
  
      if (!jwtToken) {
        console.log("User is not logged in");
        router.push("/login");
        return;
      }
    };
  
    checkAuth();
  }, [router]);

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
      <Navbar/>
      <div className="home-header">
      <img src="/assets/logo.png"/>
      <h1>Mammoth Rental</h1>
      <span>Rent a Car for Every Journey</span>
      </div>
      <div className="form-container">
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
    </div>
  );
}