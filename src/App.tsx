import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Estimates from './pages/Estimates';
import PublicEstimateView from './pages/estimates/PublicEstimateView';
import Clients from './pages/Clients';
import BusinessDetails from './pages/BusinessDetails';
import Appointments from './pages/appointments/Appointments';
import AppointmentDetails from './pages/appointments/AppointmentDetails';
import NewAppointment from './pages/appointments/NewAppointment';
import EditAppointment from './pages/appointments/EditAppointment';
import FloorPlanGenerator from './pages/FloorPlanGenerator';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
      <Route path="/e/:id" element={<PublicEstimateView />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/estimates/*" element={
        <ProtectedRoute>
          <Estimates />
        </ProtectedRoute>
      } />
      
      <Route path="/clients" element={
        <ProtectedRoute>
          <Clients />
        </ProtectedRoute>
      } />
      
      <Route path="/business" element={
        <ProtectedRoute>
          <BusinessDetails />
        </ProtectedRoute>
      } />

      {/* Floor Plan Generator */}
      <Route path="/floor-plan" element={
        <ProtectedRoute>
          <FloorPlanGenerator />
        </ProtectedRoute>
      } />

      {/* Appointments Routes */}
      <Route path="/appointments" element={
        <ProtectedRoute>
          <Appointments />
        </ProtectedRoute>
      } />
      
      <Route path="/appointments/new" element={
        <ProtectedRoute>
          <NewAppointment />
        </ProtectedRoute>
      } />
      
      <Route path="/appointments/edit/:id" element={
        <ProtectedRoute>
          <EditAppointment />
        </ProtectedRoute>
      } />
      
      <Route path="/appointments/:id" element={
        <ProtectedRoute>
          <AppointmentDetails />
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;