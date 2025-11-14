import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import { GoogleCallbackHandler } from "./components/GoogleCallbackHandler";

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <>

      <Routes>
        {/* Google OAuth callback */}
        <Route path="/google/callback" element={<GoogleCallbackHandler />} />

        {/* Auth routes */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/products" replace /> : <Login />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/products" replace /> : <Login />}
        />

        {/* Protected routes */}
        <Route
          path="/products"
          element={isLoggedIn ? <Products /> : <Navigate to="/login" replace />}
        />
    
      </Routes>
    </>
  );
}
