import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { addPet, clearPetState } from '../redux/slices/petSlice';
import { toast, ToastContainer } from 'react-toastify';

const PostAnAdPage = () => {
  const dispatch = useDispatch();
  const { success, error, loading } = useSelector((state) => state.pet);

  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    age: '',
    breed: '',
    price: '',
    location: '',
    gender: '',
    vaccinated: false,
    images: [],
  });

  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, images: files });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Validation ---
    if (!formData.type || !formData.name || !formData.breed || !formData.description ||
        !formData.age || !formData.price || !formData.location || !formData.gender) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (formData.age <= 0) {
      setFormError('Age must be greater than 0.');
      return;
    }

    if (formData.price <= 0) {
      setFormError('Price must be greater than 0.');
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      setFormError('Please upload at least one image.');
      return;
    }

    setFormError('');

    // --- Prepare FormData ---
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        Array.from(formData.images).forEach((file) => data.append('images', file));
      } else {
        data.append(key, formData[key]);
      }
    });

    await dispatch(addPet(data));
  };

  // --- Reset Form and show toast on success ---
  useEffect(() => {
    if (success) {
      setFormData({
        type: '',
        name: '',
        description: '',
        age: '',
        breed: '',
        price: '',
        location: '',
        gender: '',
        vaccinated: false,
        images: [],
      });

      toast.success(success);
      dispatch(clearPetState());
    }

    if (error) {
      toast.error(error);
      dispatch(clearPetState());
    }
  }, [success, error, dispatch]);

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <section className="text-center py-12 bg-[#f9f6ff] px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Add Pet Details</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          {formError && <p className="text-red-600 mb-4">{formError}</p>}

          {/* FORM FIELDS */}
          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Pet Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded px-4 py-2">
              <option value="">Select One</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Bird</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Pet Name</label>
            <input type="text" name="name" placeholder="Enter Pet Name"
              value={formData.name} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Description</label>
            <textarea name="description" placeholder="Add pet details, health history, vaccination, etc."
              value={formData.description} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Age (in Years)</label>
            <input type="number" name="age" placeholder="Enter Pet's Age"
              value={formData.age} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Breed</label>
            <input type="text" name="breed" placeholder="Enter Breed Name"
              value={formData.breed} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}
              className="w-full border rounded px-4 py-2">
              <option value="">Select One</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Price</label>
            <input type="number" name="price" placeholder="Enter Price in PKR"
              value={formData.price} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Location</label>
            <input type="text" name="location" placeholder="Enter Location"
              value={formData.location} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div className="mb-4 flex items-center">
            <input type="checkbox" name="vaccinated" checked={formData.vaccinated}
              onChange={handleChange} className="mr-2" />
            <label>Vaccinated</label>
          </div>

          <div className="mb-6">
            <label className="block text-left mb-1 font-semibold">Images</label>
            <input type="file" name="images" onChange={handleChange} multiple className="w-full" />
          </div>

          <button type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-purple-700 hover:bg-purple-600'} text-white py-2 rounded-full font-semibold`}>
            {loading ? 'Uploading...' : 'Add Pet'}
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default PostAnAdPage;
