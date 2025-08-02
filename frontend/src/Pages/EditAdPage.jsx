import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPetById, editPet, clearPetState } from '../redux/slices/petSlice';
import { toast, ToastContainer } from 'react-toastify';

const EditAdPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedPet, success, error, loading } = useSelector((state) => state.pet);

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
  });

  const [formError, setFormError] = useState('');

  // Load pet data
  useEffect(() => {
    dispatch(getPetById(id));
  }, [dispatch, id]);

  // Populate form once pet is loaded
  useEffect(() => {
    if (selectedPet) {
      const { type, name, description, age, breed, price, location, gender, vaccinated } = selectedPet;
      setFormData({ type, name, description, age, breed, price, location, gender, vaccinated });
    }
  }, [selectedPet]);

  // Handle success/error feedback
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearPetState());
      navigate('/my-ads');
    }

    if (error) {
      toast.error(error);
      dispatch(clearPetState());
    }
  }, [success, error, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    const requiredFields = ['type', 'name', 'description', 'age', 'breed', 'price', 'location', 'gender'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setFormError('Please fill in all required fields.');
        return;
      }
    }

    if (formData.age <= 0) {
      setFormError('Age must be greater than 0.');
      return;
    }

    if (formData.price <= 0) {
      setFormError('Price must be greater than 0.');
      return;
    }

    setFormError('');

    // Dispatch update
    dispatch(editPet({ id, data: formData }));
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <section className="text-center py-12 bg-[#f9f6ff] px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Edit Pet Ad</h1>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          {formError && <p className="text-red-600 mb-4">{formError}</p>}

          {/* Fields */}
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
            <textarea name="description" placeholder="Add details"
              value={formData.description} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Age (Years)</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Breed</label>
            <input type="text" name="breed" value={formData.breed} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded px-4 py-2">
              <option value="">Select One</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Price (PKR)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div className="mb-4">
            <label className="block text-left mb-1 font-semibold">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div className="mb-6 flex items-center">
            <input type="checkbox" name="vaccinated" checked={formData.vaccinated}
              onChange={handleChange} className="mr-2" />
            <label>Vaccinated</label>
          </div>

          <button type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-purple-700 hover:bg-purple-600'} text-white py-2 rounded-full font-semibold`}>
            {loading ? 'Updating...' : 'Update Pet'}
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default EditAdPage;
