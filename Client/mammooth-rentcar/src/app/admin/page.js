'use client';

import { useEffect, useState } from 'react';

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ carName: '', year: '' });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const res = await fetch('https://localhost:5022/api/Admin/GetAllCarEnquieries');
    const result = await res.json();
    if (result.success) {
      setCars(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://localhost:5022/api/Admin/DeleteCar/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (result.success) {
      setCars((prev) => prev.filter((car) => String(car.carId) !== String(id)));
    } else {
      alert(result.message);
    }
  };

  const startEditing = (car) => {
    setEditingId(car.carId);
    setEditForm({
      carName: car.carName,
      year: car.year,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://localhost:5022/api/Admin/UpdateCar/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editForm),
    });
    const result = await res.json();

    if (result.success) {
      setCars((prev) =>
        prev.map((car) =>
          car.carId === editingId ? { ...car, ...editForm } : car
        )
      );
      setEditingId(null);
      setEditForm({ carName: '', year: '' });
    } else {
      alert(result.message || 'Update failed.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Car Inquiries</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cars.map((car) => (
            <li key={car.carId} style={{ marginBottom: 16, padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
              {editingId === car.carId ? (
                <form onSubmit={handleEditSubmit}>
                  <input
                    name="carName"
                    value={editForm.carName}
                    onChange={handleEditChange}
                    placeholder="carName"
                    style={{ marginRight: 8 }}
                  />
                  <input
                    name="year"
                    value={editForm.year}
                    onChange={handleEditChange}
                    placeholder="Year"
                    type="number"
                    style={{ marginRight: 8 }}
                  />
                  <button type="submit" style={{ marginRight: 8 }}>Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <p><strong>{car.carName}</strong> ({car.year})</p>
                  <div style={{ marginTop: 8 }}>
                    <button
                      onClick={() => startEditing(car)}
                      style={{ marginRight: 8 }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(car.carId)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
