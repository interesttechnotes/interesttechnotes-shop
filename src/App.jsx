import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // import the new Signup page
import Products from "./pages/Products";
import Navbar from "./components/Navbar";
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
      {/* Navbar only when logged in */}
      {isLoggedIn && <Navbar />}

      <Routes>
        <Route path="/google/callback" element={<GoogleCallbackHandler />} />

        {/* Public routes */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/products" replace /> : <Login />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/products" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/products" replace /> : <Signup />}
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
