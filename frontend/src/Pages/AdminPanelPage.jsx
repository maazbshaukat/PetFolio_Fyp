import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminPanelPage = () => {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({});
  const [userSearch, setUserSearch] = useState('');
  const [listingSearch, setListingSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal state: { type, id, message } or null
  const [confirmModal, setConfirmModal] = useState(null);

  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : {};

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersRes = await axios.get(`http://localhost:5000/api/admin/users?search=${userSearch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const listingsRes = await axios.get(`http://localhost:5000/api/admin/listings?search=${listingSearch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data);
      setListings(listingsRes.data);
    } catch (error) {
      toast.error('Error fetching data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const openConfirmModal = (type, id, message) => {
    setConfirmModal({ type, id, message });
  };

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    const { type, id } = confirmModal;

    try {
      setLoading(true);
      if (type === 'deleteUser') {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('User Deleted');
      } else if (type === 'deleteListing') {
        await axios.delete(`http://localhost:5000/api/admin/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Listing Deleted');
      }
      fetchData();
      fetchStats();
    } catch (error) {
      toast.error('Error processing action');
      console.error(error);
    } finally {
      setLoading(false);
      closeConfirmModal();
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👋 Welcome, Admin {user?.email}</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow">
          Total Users: <strong>{stats.totalUsers}</strong>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          Deleted Users: <strong>{stats.deletedUsers}</strong>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          Total Listings: <strong>{stats.totalListings}</strong>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          Deleted Listings: <strong>{stats.deletedListings}</strong>
        </div>
      </div>

      {/* User Filter */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search Users by Email..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="border px-2 py-1 flex-grow"
          disabled={loading}
        />
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          Search Users
        </button>
      </div>

      {/* Users List */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <ul className="bg-white p-4 rounded shadow space-y-2">
          {users.map((user) => (
            <li key={user._id} className="flex justify-between items-center border-b py-2">
              <span>{user.email}</span>
              <div>
                <button
                  onClick={() =>
                    openConfirmModal(
                      'deleteUser',
                      user._id,
                      'Are you sure you want to delete this user? This action cannot be undone.'
                    )
                  }
                  className="text-red-600 hover:text-red-800"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Listing Filter */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search Listings by Name or Breed..."
          value={listingSearch}
          onChange={(e) => setListingSearch(e.target.value)}
          className="border px-2 py-1 flex-grow"
          disabled={loading}
        />
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          Search Listings
        </button>
      </div>

      {/* Listings List */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Listings</h2>
        <ul className="bg-white p-4 rounded shadow space-y-2">
          {listings.map((listing) => (
            <li key={listing._id} className="flex justify-between items-center border-b py-2">
              <span>
                {listing.name} - {listing.breed}
              </span>
              <div>
                <button
                  onClick={() => window.open(`/pet/${listing._id}`, '_blank')}
                  className="mr-4 text-blue-600 hover:text-blue-800"
                >
                  View
                </button>
                <button
                  onClick={() =>
                    openConfirmModal(
                      'deleteListing',
                      listing._id,
                      'Are you sure you want to delete this listing? This action cannot be undone.'
                    )
                  }
                  className="text-red-600 hover:text-red-800"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
            <p className="mb-4">{confirmModal.message}</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closeConfirmModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleConfirmAction}
                disabled={loading}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
