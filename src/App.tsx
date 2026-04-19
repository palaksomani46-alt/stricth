/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { AlertCircle, Lock } from 'lucide-react';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CourseDetails from './pages/CourseDetails';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import SuccessStories from './pages/SuccessStories';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, isAdmin, profile, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  
  // Admins are never blocked in this logic (safeguard)
  if (profile?.isBlocked && !isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 p-8 rounded-[2rem] border border-red-100 text-center shadow-xl shadow-red-100/50">
          <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold font-display text-red-900 mb-4">Account Restricted</h2>
          <p className="text-red-700 leading-relaxed">
            Your account has been blocked by the administrator. You no longer have access to the dashboard or internal features.
          </p>
          <p className="mt-6 text-sm text-red-500 font-medium">Please contact Stitch Toppers support for more information.</p>
        </div>
      </div>
    );
  }

  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const { hasQuotaError } = useAuth();
  
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen font-sans">
        {hasQuotaError && (
          <div className="bg-amber-600 text-white py-2 px-4 text-center text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-500 z-[100] sticky top-0">
            ⚠️ Database Quota Exhausted! New enrollments or updates may not show until tomorrow (07:00 UTC).
          </div>
        )}
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-center" />
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
