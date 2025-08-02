import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAds, deleteAd } from '../redux/slices/petSlice';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

const MyAdsPage = () => {
  const dispatch = useDispatch();
  const { ads, loading, error, success } = useSelector((state) => state.pet);
  const [adToDelete, setAdToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchMyAds());
  }, [dispatch]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, [success, error]);

  const confirmDelete = () => {
    if (adToDelete?._id) {
      dispatch(deleteAd(adToDelete._id));
      setAdToDelete(null);
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <section className="px-4 md:px-20 py-12 bg-[#f9f6ff] min-h-screen">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">My Ads</h2>

        {loading ? (
          <p>Loading ads...</p>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ads.map((ad) => (
              <div
                key={ad._id}
                className="bg-white border rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 relative"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={ad.images?.[0] || '/no-image.jpg'}
                    alt={ad.name}
                    className="w-full h-48 object-cover"
                  />
                  {ad.featured && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-xs text-white font-bold px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="font-semibold text-lg text-[#014D4E] mb-1">
                    Rs {ad.price.toLocaleString()}
                  </p>
                  <p className="text-gray-800 font-medium leading-tight mb-2">{ad.name}</p>
                  <p className="text-sm text-gray-600">{ad.location}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(ad.createdAt).toLocaleString()}
                  </p>

                  {/* Actions */}
                  <div className="flex justify-end mt-4 space-x-3">
                    <Link
                      to={`/edit-ad/${ad._id}`}
                      className="text-purple-700 hover:text-purple-500"
                      title="Edit Ad"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => setAdToDelete(ad)}
                      className="text-red-600 hover:text-red-400"
                      title="Delete Ad"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">You haven't posted any ads yet.</p>
        )}
      </section>
      <Footer />

      {/* Confirmation Modal */}
      {adToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete <strong>{adToDelete.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setAdToDelete(null)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAdsPage;
