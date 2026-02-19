import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseDetails from './pages/CourseDetails';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['administrateur']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:id"
              element={
                <ProtectedRoute>
                  <CourseDetails />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                minHeight: 'calc(100vh - 70px)',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
              }}>
                <h1>Accès refusé</h1>
                <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
              </div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
