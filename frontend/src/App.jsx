import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import UploadPDF from "./pages/UploadPDF";
import PendingPDFs from "./pages/PendingPDFs";
import ApprovedPDFs from "./pages/ApprovedPDFs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPDFs from "./pages/MyPDFs";
import ManageUsers from "./pages/ManageUsers";
import Profile
from "./pages/Profile";
import ForgotPassword
from "./pages/ForgotPassword";

import VerifyOTP
from "./pages/VerifyOTP";

import ResetPassword
from "./pages/ResetPassword";
import ProtectedRoute
from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
  path="/profile"
  element={<Profile />}
/>

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

        <Route
  path="/upload"
  element={
    <ProtectedRoute>
      <UploadPDF />
    </ProtectedRoute>
  }
/>

        <Route
  path="/pending"
  element={
    <ProtectedRoute>
      <PendingPDFs />
    </ProtectedRoute>
  }
/>

        <Route
  path="/approved"
  element={
    <ProtectedRoute>
      <ApprovedPDFs />
    </ProtectedRoute>
  }
/>
    <Route
  path="/mypdfs"
  element={<MyPDFs />}
/>

<Route
  path="/users"
  element={<ManageUsers />}
/>

<Route
  path="/forgot-password"
  element={
    <ForgotPassword />
  }
/>

<Route
  path="/verify-otp"
  element={
    <VerifyOTP />
  }
/>

<Route
  path="/reset-password"
  element={
    <ResetPassword />
  }
/>

      </Routes>


    </BrowserRouter>
  );
}

export default App;