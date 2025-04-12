'use client';

import { useEffect, useState } from "react";

export default function AvailableCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this with real dates or props
  const requestPayload = {
    startDate: "2025-04-15",
    endDate: "2025-04-20"
  };

  useEffect(() => {
    const fetchAvailableCars = async () => {
      try {
        const res = await fetch("https://localhost:5022/api/Request/GetAvailableCars", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestPayload)
        });

        if (res.ok) {
          const data = await res.json();
          setCars(data);
        } else {
          console.error("Failed to fetch cars");
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCars();
  }, []);

  // Function to handle submitting a rental request for a car
  const handleSubmitRequest = async (carId) => {
    const requestBody = {
      startDate: requestPayload.startDate,
      endDate: requestPayload.endDate,
      carId: carId
    };
  
    console.log("Sending request:", requestBody);  // Log the request payload
  
    try {
      const res = await fetch("https://localhost:5022/api/Request/SubmitRentalRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
  
      const response = await res.json();
      
      if (res.ok) {
        alert("Rental request submitted successfully!");
      } else {
        console.error("Error response:", response);  // Log the error response from the server
        alert(`Failed to submit rental request: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error:", error);  // Log any fetch errors
      alert("Something went wrong.");
    }
  };
  

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Available Cars</h1>
      {loading ? (
        <p>Loading cars...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">{car.name}</h2>
                <p className="text-sm text-gray-500 mb-1">{car.category}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>⚖️ {car.gearboxType}</span>
                  <span>🚗 {car.seats} seats</span>
                  <span>⭐ {car.rating?.toFixed(1) || "N/A"}</span>
                </div>
                <p className="text-lg font-bold">From ${car.pricePerDay} / day</p>
                <button
                  onClick={() => handleSubmitRequest(car.carId)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full"
                >
                  Submit for this car
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
