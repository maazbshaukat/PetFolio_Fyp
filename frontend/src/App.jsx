import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import DiscoverPetsPage from './Pages/DiscoverPetsPage';
import PetDetailsPage from './Pages/PetDetailsPage';
import HelpPage from './Pages/HelpPage';
import NotFoundPage from './Pages/NotFoundPage';

// Protected Pages
import PostAnAdPage from './Pages/PostAnAdPage';
import FavoritesPage from './Pages/FavoritesPage';
import MyAdsPage from './Pages/MyAdsPage';
import ProfilePage from './Pages/ProfilePage';
import EditAdPage from './Pages/EditAdPage';
import ChatsPage from './Pages/ChatsPage';
import AdminPanelPage from './Pages/AdminPanelPage';
import FaqEditor from './Pages/FaqEditor';
import UserReviewsPage from './Pages/UserReviewsPage';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/discover-pets" element={<DiscoverPetsPage />} />
        <Route path="/pet/:id" element={<PetDetailsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<NotFoundPage />} />


        {/* Protected Routes */}
        <Route path="/post-an-ad" element={<PrivateRoute><PostAnAdPage /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
        <Route path="/my-ads" element={<PrivateRoute><MyAdsPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/edit-ad/:id" element={<PrivateRoute><EditAdPage /></PrivateRoute>}/>
        <Route path="/chats" element={<PrivateRoute><ChatsPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPanelPage /></PrivateRoute>} />
        <Route path="/admin/faqs" element={
        <PrivateRoute requiredRole="Admin"> <FaqEditor /></PrivateRoute>} />
        <Route path="/user-reviews/:sellerId" element={<PrivateRoute><UserReviewsPage /></PrivateRoute>} />


        {/* Future */}
        {/* <Route path="/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} /> */}
      </Routes>

      {/* ✅ Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={2500} pauseOnHover theme="light" />
    </Router>
  );
};

export default App;
