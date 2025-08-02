import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (requiredRole && decoded.role !== requiredRole) {
      return <Navigate to="/" />;
    }
    return children;
  } catch (err) {
    console.error("JWT parsing failed", err);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;



// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
//   return token ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;
