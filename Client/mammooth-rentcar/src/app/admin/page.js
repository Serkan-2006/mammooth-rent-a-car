'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Pencil, Trash2, X, User, Car, Home, LogOut  } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [carLoading, setCarLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [editingCar, setEditingCar] = useState(null);
  const [editCarForm, setEditCarForm] = useState({ brand: '', model: '', year: '', seats: '', pricePerDay: '', imageUrl: '' });
  const [newCarForm, setNewCarForm] = useState({ brand: '', model: '', year: '', seats: '', description: '', pricePerDay: '', imageUrl: '' });

  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ firstName: '', lastName: '', citizenId: '', phoneNumber: '', userName: '', email: '' });
  const [newUserForm, setNewUserForm] = useState({ firstName: '', lastName: '', citizenId: '', phoneNumber: '', userName: '', email: '', password: '' });

  const [rentalRequests, setRentalRequests] = useState([]);
  const [rentalLoading, setRentalLoading] = useState(true);

  const fetchRentalRequests = async () => {
    try {
      const res = await fetch('https://localhost:5022/api/Admin/GetAllRentalRequests');
      const result = await res.json();
      if (result.success) setRentalRequests(result.data);
    } catch (err) {
      console.error('Failed to fetch rental requests:', err);
    } finally {
      setRentalLoading(false);
    }
  };

  const handleApproveRental = async (id) => {
    const res = await fetch(`https://localhost:5022/api/Admin/ApproveRentalRequest/${id}`, {
      method: 'PUT',
    });
    const result = await res.json();
    if (result.success) {
      fetchRentalRequests(); // Refresh the list
    }
  };
  
  const admin = { name: 'Alex Ivanov' };

  const getInitials = (name) => name.split(' ').map(part => part[0]).join('').toUpperCase();

  useEffect(() => {
    const checkAdminRole = async () => {
      const jwtToken = localStorage.getItem("jwt");
      if (!jwtToken) return router.push("/");

      try {
        const response = await fetch("https://localhost:5022/api/Auth/GetUser", {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        if (!response.ok || !(await response.json()).roles.includes("Admin")) {
          localStorage.clear();
          router.push("/");
        }
      } catch {
        router.push("/");
      }
    };
    checkAdminRole();
  }, [router]);

  useEffect(() => {
    if (activeTab === 'cars') fetchCars();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'rental') fetchRentalRequests();
  }, [activeTab]);

  const fetchCars = async () => {
    try {
      const res = await fetch('https://localhost:5022/api/Admin/GetAllCarEnquieries');
      const result = await res.json();
      if (result.success) setCars(result.data);
      console.log(result.data)
    } catch (err) {
      console.error('Failed to fetch cars:', err);
    } finally {
      setCarLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://localhost:5022/api/Admin/GetAllUserEnquieries');
      const result = await res.json();
      if (result.success) setUsers(result.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setUserLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("https://localhost:5022/api/Auth/Logout", { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        localStorage.clear();
        router.push("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
  };

  const handleCarEditChange = (e) => setEditCarForm({ ...editCarForm, [e.target.name]: e.target.value });
  const handleUserEditChange = (e) => setEditUserForm({ ...editUserForm, [e.target.name]: e.target.value });
  const handleNewCarChange = (e) => setNewCarForm({ ...newCarForm, [e.target.name]: e.target.value });
  const handleNewUserChange = (e) => setNewUserForm({ ...newUserForm, [e.target.name]: e.target.value });

  const handleCarDelete = async (id) => {
    const res = await fetch(`https://localhost:5022/api/Admin/DeleteCar/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) setCars(prev => prev.filter(car => car.carId !== id));
  };

  const handleUserDelete = async (id) => {
    const res = await fetch(`https://localhost:5022/api/Admin/DeleteUser/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) setUsers(prev => prev.filter(user => user.id !== id));
  };

  const handleCarEditSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://localhost:5022/api/Admin/UpdateCar/${editingCar.carId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editCarForm),
    });
    const result = await res.json();
    if (result.success) {
      setCars(prev => prev.map(car => car.carId === editingCar.carId ? { ...car, ...editCarForm } : car));
      setIsEditOpen(false);
    }
  };

  const handleUserEditSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://localhost:5022/api/Admin/UpdateUser/${editingUser.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editUserForm),
    });
    const result = await res.json();
    if (result.success) {
      setUsers(prev => prev.map(user => user.id === editingUser.id ? { ...user, ...editUserForm } : user));
      setIsEditOpen(false);
    }
  };

  const handleNewCarSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...newCarForm,
      year: parseInt(newCarForm.year),
      seats: parseInt(newCarForm.seats),
      pricePerDay: parseFloat(newCarForm.pricePerDay),
    };
    const res = await fetch(`https://localhost:5022/api/Admin/AddCar`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.success) {
      fetchCars();
      setNewCarForm({ brand: '', model: '', year: '', seats: '', description: '', pricePerDay: '', imageUrl: '' });
      setIsAddCarOpen(false);
    }
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://localhost:5022/api/Admin/AddUser`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUserForm),
    });
    const result = await res.json();
    if (result.success) {
      fetchUsers();
      setNewUserForm({ firstName: '', lastName: '', citizenId: '', phoneNumber: '', userName: '', email: '', password: '' });
      setIsAddUserOpen(false);
    }
  };

  const openCarEditModal = (car) => {
    setEditingCar(car);
    setEditCarForm({ brand: car.brand, model: car.model, year: car.year, seats: car.seats, pricePerDay: car.pricePerDay, imageUrl: car.imageUrl });
    setIsEditOpen(true);
  };

  const openUserEditModal = (user) => {
    setEditingUser(user);
    setEditUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      citizenId: user.citizenId,
      phoneNumber: user.phoneNumber,
      userName: user.userName,
      email: user.email
    });
    setIsEditOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Mammoth Panel</h1>
        </div>
        <nav className="space-y-3 text-gray-600 text-sm">
          <button
            onClick={() => router.push('/')}
            className={`flex items-center gap-3 w-full text-left hover:text-blue-600`}
          >
            <Home size={24} /> Home Page
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={`flex items-center gap-3 w-full text-left ${
              activeTab === 'cars' ? 'text-blue-600 font-medium' : 'hover:text-blue-600'
            }`}
          >
            <Car size={24} /> Manage Cars
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 w-full text-left ${
              activeTab === 'users' ? 'text-blue-600 font-medium' : 'hover:text-blue-600'
            }`}
          >
            <User size={24} /> Manage Users
          </button>
          <button
  onClick={() => setActiveTab('rental')}
  className={`flex items-center gap-3 w-full text-left ${
    activeTab === 'rental' ? 'text-blue-600 font-medium' : 'hover:text-blue-600'
  }`}
>
  <Car size={24} /> Rental Requests
</button>
        </nav>
        <div className="absolute bottom-6 left-6 flex items-center gap-3">
  <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 shadow">
    {getInitials(admin.name)}
  </div>
  <div className="text-sm text-gray-600">{admin.name}</div>
  <button
    onClick={() => handleLogoutClick()}
    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 text-red-500 hover:text-red-700 flex items-center justify-center shadow transition-colors"
    title="Logout"
  >
    <LogOut size={18} />
  </button>
</div>
      </aside>

      <main className="flex-1 p-6">
        {activeTab === 'cars' ? (
          <div className="bg-white shadow-md rounded p-6">
<div className="flex justify-between items-center mb-4">
  <h2 className="text-lg font-semibold text-gray-800">Cars</h2>

  <Dialog.Root open={isAddCarOpen} onOpenChange={setIsAddCarOpen}>
    <Dialog.Trigger asChild>
      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer">Add Car</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <Dialog.Title className="text-lg font-semibold text-gray-500">Add Car</Dialog.Title>
          <Dialog.Close asChild>
            <button className="text-gray-500 hover:text-gray-800">
              <X size={18} />
            </button>
          </Dialog.Close>
        </div>
        <form onSubmit={handleNewCarSubmit} className="space-y-4">
          {[
            { label: "Brand", name: "brand" },
            { label: "Model", name: "model" },
            { label: "Year", name: "year", type: "number" },
            { label: "Seats", name: "seats", type: "number" },
            { label: "Description", name: "description", type: "textarea" },
            { label: "Price Per Day", name: "pricePerDay", type: "number" },
            { label: "Image URL", name: "imageUrl" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm mb-1 text-gray-500">{label}</label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={newCarForm[name]}
                  onChange={handleNewCarChange}
                  className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                  required
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={newCarForm[name]}
                  onChange={handleNewCarChange}
                  className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                  required
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <button type="button" className="text-gray-600 hover:text-gray-800 text-sm">
                Cancel
              </button>
            </Dialog.Close>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
              Create
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</div>


            {carLoading ? (
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
                    {cars.map((order, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-500">{order.carId}</td>
                        <td className="p-3 text-gray-500">{order.brand} {order.model}</td>
                        <td className="p-3 text-gray-500">{order.year}</td>
                        <td className="p-3 text-gray-500">{order.seats}</td>
                        <td className="p-3 text-gray-500">{order.pricePerDay} лв.</td>
                        <td className="p-3 text-gray-500 flex items-center gap-3">
                          <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <Dialog.Trigger asChild>
                              <button onClick={() => { openCarEditModal(order); setIsEditOpen(true); }} className="text-blue-500 hover:text-blue-700">
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
                                <form onSubmit={handleCarEditSubmit} className="space-y-4">
                                  <div>
                                    <label className="block text-sm mb-1 text-gray-500">Brand</label>
                                    <input
                                      name="brand"
                                      value={editCarForm.brand}
                                      onChange={handleCarEditChange}
                                      className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm mb-1 text-gray-500">Model</label>
                                    <input
                                      name="model"
                                      value={editCarForm.model}
                                      onChange={handleCarEditChange}
                                      className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm mb-1 text-gray-500">Year</label>
                                    <input
                                      name="year"
                                      value={editCarForm.year}
                                      onChange={handleCarEditChange}
                                      type="number"
                                      className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm mb-1 text-gray-500">Seats</label>
                                    <input
                                      name="seats"
                                      value={editCarForm.seats}
                                      onChange={handleCarEditChange}
                                      type="number"
                                      className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm mb-1 text-gray-500">Price per day</label>
                                    <input
                                      name="pricePerDay"
                                      value={editCarForm.pricePerDay}
                                      onChange={handleCarEditChange}
                                      type="number"
                                      className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm mb-1 text-gray-500">Image URL</label>
                                    <input
                                      name="imageUrl"
                                      value={editCarForm.imageUrl}
                                      onChange={handleCarEditChange}
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

                          <button onClick={() => handleCarDelete(order.carId)} className="text-red-500 hover:text-red-700">
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
        ) : activeTab === 'users' ? (
          <div className="bg-white shadow-md rounded p-6">
            <div className='flex justify-between items-center'>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Users</h2>
            <Dialog.Root open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <Dialog.Trigger asChild>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer">Add User</button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-semibold text-gray-500">Add User</Dialog.Title>
                    <Dialog.Close asChild>
                      <button className="text-gray-500 hover:text-gray-800">
                        <X size={18} />
                      </button>
                    </Dialog.Close>
                  </div>
                  <form onSubmit={handleNewUserSubmit} className="space-y-4">
                    {[
                      { label: "Citizen ID", name: "citizenId" },
                      { label: "Username", name: "userName" },
                      { label: "First Name", name: "firstName" },
                      { label: "Last Name", name: "lastName" },
                      { label: "Phone Number", name: "phoneNumber" },
                      { label: "Email", name: "email" },
                      { label: "Password", name: "password", type: "password" },
                    ].map(({ label, name, type = "text" }) => (
                      <div key={name}>
                        <label className="block text-sm mb-1 text-gray-500">{label}</label>
                        <input
                          type={type}
                          name={name}
                          value={newUserForm[name]}
                          onChange={handleNewUserChange}
                          className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                          required
                        />
                      </div>
                    ))}

                    <div className="flex justify-end gap-2">
                      <Dialog.Close asChild>
                        <button type="button" className="text-gray-600 hover:text-gray-800 text-sm">
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                        Create
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            </div>
            {userLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="text-gray-500 border-b">
                      <tr>
                        <th className="p-3">Citizen ID</th>
                        <th className="p-3">Username</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Phone Number</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((order, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-gray-500">{order.citizenId}</td>
                          <td className="p-3 text-gray-500">{order.userName}</td>
                          <td className="p-3 text-gray-500">{order.firstName} {order.lastName}</td>
                          <td className="p-3 text-gray-500">{order.phoneNumber}</td>
                          <td className="p-3 text-gray-500">{order.email}</td>
                          <td className="p-3 text-gray-500 flex items-center gap-3">
                            <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
                              <Dialog.Trigger asChild>
                                <button onClick={() => { openUserEditModal(order); setIsEditOpen(true); }} className="text-blue-500 hover:text-blue-700">
                                  <Pencil size={14} />
                                </button>
                              </Dialog.Trigger>
                              <Dialog.Portal>
                                <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                                <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
                                  <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-lg font-semibold text-gray-500">Edit User</Dialog.Title>
                                    <Dialog.Close asChild>
                                      <button className="text-gray-500 hover:text-gray-800">
                                        <X size={18} />
                                      </button>
                                    </Dialog.Close>
                                  </div>
                                  <form onSubmit={handleUserEditSubmit} className="space-y-4">
                                    <div>
                                      <label className="block text-sm mb-1 text-gray-500">Citizen ID</label>
                                      <input
                                        name="citizenId"
                                        value={editUserForm.citizenId}
                                        onChange={handleUserEditChange}
                                        className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm mb-1 text-gray-500">Username</label>
                                      <input
                                        name="userName"
                                        value={editUserForm.userName}
                                        onChange={handleUserEditChange}
                                        className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm mb-1 text-gray-500">First Name</label>
                                      <input
                                        name="firstName"
                                        value={editUserForm.firstName}
                                        onChange={handleUserEditChange}
                                        className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm mb-1 text-gray-500">Last Name</label>
                                      <input
                                        name="lastName"
                                        value={editUserForm.lastName}
                                        onChange={handleUserEditChange}
                                        className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm mb-1 text-gray-500">Phone Number</label>
                                      <input
                                        name="phoneNumber"
                                        value={editUserForm.phoneNumber}
                                        onChange={handleUserEditChange}
                                        className="w-full border rounded px-3 py-2 text-sm text-gray-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm mb-1 text-gray-500">Email</label>
                                      <input
                                        name="email"
                                        value={editUserForm.email}
                                        onChange={handleUserEditChange}
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

                            <button onClick={() => handleUserDelete(order.id)} className="text-red-500 hover:text-red-700">
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
        ) : (
          <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Rental Requests</h2>
          <table className="min-w-full text-sm text-left">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="p-3">Request ID</th>
              <th className="p-3">Username</th>
              <th className="p-3">Car</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentalRequests.map((request, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3 text-gray-500">{request.id}</td>
                <td className="p-3 text-gray-500">{request.userName}</td>
                <td className="p-3 text-gray-500">{request.carInfo}</td>
                <td className="p-3 text-gray-500">{new Date(request.startDate).toLocaleDateString()}</td>
                <td className="p-3 text-gray-500">{new Date(request.endDate).toLocaleDateString()}</td>
                <td className="p-3 text-gray-500">{request.status}</td>
                <td className="p-3">
                  {request.status === 'Pending' && (
                    <button
                      onClick={() => handleApproveRental(request.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        )}
      </main>
    </div>
  );
}
