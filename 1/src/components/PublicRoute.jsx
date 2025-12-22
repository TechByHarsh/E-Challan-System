import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";


export default function PublicRoute({ children, redirectTo = "/dashboard" }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || redirectTo;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }



  if (user) {
    return <Navigate to={from} state={location.state} replace />;
  }

  return children || <Outlet />;
}

