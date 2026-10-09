import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import DriverDashboard from "../pages/Driver/DriverDashboard";
import HospitalDashboard from "../pages/Hospital/HospitalDashboard";
import LiveTracking from "../pages/Tracking/LiveTracking";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/driver" element={<DriverDashboard />} />
      <Route path="/hospital" element={<HospitalDashboard />} />
      <Route path="/tracking" element={<LiveTracking />} />
    </Routes>
  );
};

export default AppRoutes;