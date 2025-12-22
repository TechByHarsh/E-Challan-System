import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./contexts/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";

import UserDashboard from "./pages/UserDashboard";
import ViewAllRecords from "./pages/ViewAllRecords";
import Profile from "./pages/Profile";
import ViolationsAnalytics from "./pages/ViolationsAnalytics";
import Payment from "./pages/Payment";
import AboutUs from "./pages/AboutUs";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddRecord from "./pages/AdminAddRecord";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  const { loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ PUBLIC ROUTES (Accessible only if NOT logged in) */}
        <Route element={<PublicRoute redirectTo="/dashboard" />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* ✅ PROTECTED ROUTES */}
        <Route element={<PrivateRoute redirectTo="/" />}>
          <Route path="/dashboard" element={<UserDashboard />} />

          <Route path="/view-all-records" element={<ViewAllRecords />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/violations-analytics" element={<ViolationsAnalytics />} />
        </Route>

        {/* ✅ PUBLICLY ACCESSIBLE ROUTES */}
        <Route path="/about-us" element={<AboutUs />} />

        {/* ✅ ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-record" element={<AdminAddRecord />} />

        {/* ❌ INVALID ROUTES */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
