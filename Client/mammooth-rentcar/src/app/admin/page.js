'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', year: '', seats: '', pricePerDay: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://localhost:5022/api/Admin/GetAllCarEnquieries');
      const result = await res.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://localhost:5022/api/Admin/DeleteCar/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (result.success) {
      setOrders((prev) => prev.filter((order) => order.carId !== id));
    }
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setEditForm({
      name: order.carName,
      year: order.year || '',
      seats: order.seats || '',
      pricePerDay: order.pricePerDay || '',
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://localhost:5022/api/Admin/UpdateCar/${editingOrder.carId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        carName: editForm.name,
        year: editForm.year,
        seats: editForm.seats,
        pricePerDay: editForm.pricePerDay,
      }),
    });
    const result = await res.json();

    if (result.success) {
      setOrders((prev) =>
        prev.map((order) =>
          order.carId === editingOrder.carId
            ? { ...order, ...editForm, carName: editForm.name }
            : order
        )
      );
      setEditingOrder(null);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Коли</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Year</th>
                <th className="p-3">Seats</th>
                <th className="p-3">Price per day</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{order.carId}</td>
                  <td className="p-3 text-gray-500">{order.carName}</td>
                  <td className="p-3 text-gray-500">{order.year}</td>
                  <td className="p-3 text-gray-500">{order.seats}</td>
                  <td className="p-3 text-gray-500">{order.pricePerDay} лв.</td>
                  <td className="p-3 text-gray-500 flex items-center gap-3">
                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <button onClick={() => openEditModal(order)} className="text-blue-500 hover:text-blue-700">
                          <Pencil size={14} />
                        </button>
                      </Dialog.Trigger>

                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
                          <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-lg font-semibold text-gray-500">Edit Car</Dialog.Title>
                            <Dialog.Close asChild>
                              <button className="text-gray-500 hover:text-gray-800">
                                <X size={18} />
                              </button>
                            </Dialog.Close>
                          </div>
                          <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                              <label className="block text-sm mb-1 text-gray-500">Name</label>
                              <input
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1 text-gray-500">Year</label>
                              <input
                                name="year"
                                value={editForm.year}
                                onChange={handleEditChange}
                                type="number"
                                className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1 text-gray-500">Seats</label>
                              <input
                                name="seats"
                                value={editForm.seats}
                                onChange={handleEditChange}
                                type="number"
                                className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1 text-gray-500">Price per day</label>
                              <input
                                name="pricePerDay"
                                value={editForm.pricePerDay}
                                onChange={handleEditChange}
                                type="number"
                                className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Dialog.Close asChild>
                                <button type="button" className="text-gray-600 hover:text-gray-800 text-sm">
                                  Cancel
                                </button>
                              </Dialog.Close>
                              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                                Save
                              </button>
                            </div>
                          </form>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>

                    <button onClick={() => handleDelete(order.carId)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
