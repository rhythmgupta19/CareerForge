import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlobalLoader from './GlobalLoader';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <GlobalLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If student hasn't selected a domain, redirect to /domains
  if (user.role === 'student' && !user.activeDomain && location.pathname !== '/domains' && location.pathname !== '/career-guide') {
     return <Navigate to="/domains" replace />;
  }

  // Force profile setup for students
  if (user.role === 'student' && user.activeDomain) {
    const activeSlug = user.activeDomain.slug || user.selectedDomain?.slug || '';
    const isDevOps = activeSlug.toLowerCase() === 'devops';
    const needsOnboarding = isDevOps 
      ? !user.profile?.onboardingCompleted 
      : !user.profile?.isProfileComplete;

    if (needsOnboarding && location.pathname !== '/setup-profile') {
      return <Navigate to="/setup-profile" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
