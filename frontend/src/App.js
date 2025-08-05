// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Global CSS Imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css'
import 'bootstrap-icons/font/bootstrap-icons.css';



// Page Components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import UpdateTask from './pages/UpdateTask';

// Private Route Protection
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/create-task" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
        <Route path="/edit-task/:id" element={<PrivateRoute><UpdateTask /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
