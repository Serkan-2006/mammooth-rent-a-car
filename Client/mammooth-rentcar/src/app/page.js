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
        body: JSON.stringify({
          carId,
          startDate,
          endDate,
        }),
      });
    
      const contentType = res.headers.get('content-type');
      let data;
    
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.log(text)
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
