'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from 'components/navbar';
import { FaUsers } from 'react-icons/fa'	
import { FaCalendarAlt } from 'react-icons/fa'	
import { FaDollarSign } from 'react-icons/fa'	

export default function SubmitRentalForm() {
  const router = useRouter();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt");
    if (!jwtToken) {
      console.log("User is not logged in");
      router.push("/login");
    }
  }, [router]);

  const defaultStartDate = '2025-04-12T21:00';
  const defaultEndDate = '2025-04-12T22:00';
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [showCars, setShowCars] = useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      alert('Please log in first.');
      return;
    }

    if (!startDate || !endDate) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('https://localhost:5022/api/Request/GetAvailableCars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setCars(data);
      setShowCars(true);
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.message || 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (carId) => {
    const token = localStorage.getItem('jwt');
    const requestBody = { startDate, endDate, carId };
    
    try {
      const res = await fetch("https://localhost:5022/api/Request/SubmitRentialRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
  
      const responseData = await res.text();;
  
      if (res.ok) {
        alert(responseData);
      } else {
        console.error("Error response:", responseData);
        alert(`Failed to submit rental request: ${responseData.message || responseData || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      <div className="main">
        <div className="overlay" />
        <Navbar />

        {/* Header section - logo, title, tagline */}
        <div className="home-header text-center py-8">
          <img src="/assets/logo.png" className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold">Mammoth Rental</h1>
          <span className="text-lg text-gray-200">Rent a Car for Every Journey</span>
        </div>

        {/* Form Section */}
          <div className="form-container w-full max-w-6xl mx-auto px-4 py-8">
            <div className="form-grid">
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
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </div>
      </div>

      {showCars && (
        <div className="w-full bg-slate-200 py-12">
          <div className="available-cars-section max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Available Cars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <img
                  src={car.imageUrl}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-1 text-blue-500">{car.brand} {car.model}</h2>
                  <p className="text-sm text-gray-500 mb-1">{car.category}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span><FaCalendarAlt/> {car.year}</span>
                    <span><FaUsers/> {car.seats} seats</span>
                  </div>
                  <div className="flex items-center justify-center mt-6 gap-6">
                  <button
                    onClick={() => handleSubmitRequest(car.id)}
                    className=" bg-blue-500 text-white py-2 px-4 rounded-full cursor-pointer"
                  >
                    Submit for this car
                  </button>
                  <p className="text-lg font-bold text-gray-600">
                    ${Number(car.pricePerDay).toLocaleString()} / day
                  </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      )} 
    </>
  );
}
