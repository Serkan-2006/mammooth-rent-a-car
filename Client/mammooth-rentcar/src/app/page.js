'use client';

import { useState } from 'react';

export default function SubmitRentalForm() {
  const [carId, setCarId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      return;
    }

    if (!carId || !startDate || !endDate) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);

    const res = await fetch('https://localhost:5022/api/Rental/SubmitRentalRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        carId,
        startDate,
        endDate,
      }),
    });

    const result = await res.json();
    setLoading(false);

    if (res.ok && result.success) {
      alert('Rental request submitted!');
      setCarId('');
      setStartDate('');
      setEndDate('');
    } else {
      alert(result.message || 'Something went wrong.');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h2>Submit Rental Request</h2>
      <div>
        <label>Car ID:</label>
        <input
          type="text"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
          placeholder="Enter Car ID"
          style={{ width: '100%', marginBottom: 10 }}
        />
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Rental Request'}
      </button>
    </div>
  );
}
