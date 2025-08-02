import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, deleteUserAccount } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Utility: Deep compare objects
const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    dob: { dd: '', mm: '', yyyy: '' },
    gender: '',
    about: '',
    phone: '',
    profilePic: '',
  });

  const [originalData, setOriginalData] = useState(null);
  const [preview, setPreview] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [wasSubmitted, setWasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const incoming = {
        name: profile.name || '',
        dob: profile.dob || { dd: '', mm: '', yyyy: '' },
        gender: profile.gender || '',
        about: profile.about || '',
        phone: profile.phone || '',
        profilePic: profile.profilePic || '',
      };
      setFormData(incoming);
      setOriginalData(incoming);
      setPreview(incoming.profilePic || '/src/assets/images/profile-placeholder.png');
    }
  }, [profile]);

  useEffect(() => {
    if (wasSubmitted && !loading) {
      toast.success('Profile updated successfully!');
      setOriginalData(formData);
      setWasSubmitted(false);
    }
  }, [loading, wasSubmitted, formData]);

  const handleChange = (field, value) => {
    if (['dd', 'mm', 'yyyy'].includes(field)) {
      setFormData((prev) => ({
        ...prev,
        dob: { ...prev.dob, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return alert('Only JPG, JPEG, PNG are allowed.');
    }

    const img = new Image();
    img.onload = () => {
      if (img.width < 400 || img.width > 1024 || img.height < 400 || img.height > 1024) {
        alert('Image dimensions must be between 400px and 1024px.');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, profilePic: reader.result }));
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const validateForm = () => {
    const err = {};
    if (!formData.name.trim()) err.name = 'Name is required';
    const { dd, mm, yyyy } = formData.dob;
    if (!dd || !mm || !yyyy || isNaN(new Date(`${yyyy}-${mm}-${dd}`))) {
      err.dob = 'Invalid date of birth';
    }
    if (!formData.phone.match(/^\+923\d{9}$/)) {
      err.phone = 'Phone format should be +923XXXXXXXXX';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(updateUserProfile(formData));
    setWasSubmitted(true);
  };

  const handleDiscard = () => {
    if (originalData) {
      setFormData(originalData);
      setPreview(originalData.profilePic || '/src/assets/images/profile-placeholder.png');
    }
  };

  const handleDelete = async () => {
    try {
      const message = await dispatch(deleteUserAccount()).unwrap();
      toast.success(message || 'Account deleted successfully');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Account deletion error:', err);
      toast.error(err || 'Failed to delete account');
    }
  };
  

  const isUnchanged = deepEqual(formData, originalData);

  return (
    <div>
      <Navbar />
      <section className="px-4 md:px-20 py-10 bg-[#f9f6ff] min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md space-y-6">
          {/* Upload Photo */}
          <div className="flex items-center space-x-6">
            <img
              src={preview}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <div>
              <label className="bg-black text-white px-4 py-2 rounded cursor-pointer block w-max">
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                JPG, JPEG, PNG. Min: 400px, Max: 1024px
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block font-semibold mb-1">Date of birth</label>
            <div className="flex space-x-3">
              {['dd', 'mm', 'yyyy'].map((part) => (
                <input
                  key={part}
                  type="text"
                  placeholder={part.toUpperCase()}
                  className="w-1/3 border rounded px-3 py-2"
                  value={formData.dob[part]}
                  onChange={(e) => handleChange(part, e.target.value)}
                />
              ))}
            </div>
            {errors.dob && <p className="text-sm text-red-600">{errors.dob}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block font-semibold mb-1">Gender</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* About */}
          <div>
            <label className="block font-semibold mb-1">About me (optional)</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              maxLength="200"
              rows="3"
              value={formData.about}
              onChange={(e) => handleChange('about', e.target.value)}
            ></textarea>
            <p className="text-sm text-gray-500 text-right">{formData.about.length}/200</p>
          </div>

          {/* Contact Info */}
          <div>
            <label className="block font-semibold mb-1">Contact information</label>
            <input
              type="text"
              placeholder="+92 | Phone number"
              className="w-full border rounded px-3 py-2 mb-2"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}

            <input
              type="email"
              placeholder="Email address"
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              value={profile?.email || ''}
              readOnly
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between border-t pt-4 mt-4">
            <button type="button" onClick={handleDiscard} className="text-gray-600 hover:underline">
              Discard
            </button>
            <button
              type="submit"
              disabled={loading || isUnchanged}
              className={`px-5 py-2 rounded ${
                loading || isUnchanged
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>

        {/* Delete Account */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-semibold mb-3 text-red-600">Delete this account</h3>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete your account?
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50"
          >
            Yes, delete my account
          </button>
        </div>
      </section>

      <Footer />

      {/* Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-md text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">This action is irreversible. Are you sure?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
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

export default ProfilePage;
