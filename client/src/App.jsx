import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import DriverDashboard from "./pages/Driver/DriverDashboard";

const App = () => {
  return (
    <Routes>

      {/* ================= LOGIN ================= */}

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/login"
        element={<Login />}
      />


      {/* ================= REGISTER ================= */}

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ================= DRIVER DASHBOARD ================= */}

      <Route
        path="/driver"
        element={<DriverDashboard />}
      />


      {/* ================= HOSPITAL DASHBOARD ================= */}

      <Route
        path="/hospital"
        element={
          <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="text-center">

              <h1 className="text-4xl font-bold text-blue-600">
                Hospital Dashboard
              </h1>

              <p className="mt-3 text-slate-600">
                SmartAmbulance Hospital Panel
              </p>

            </div>
          </div>
        }
      />


      {/* ================= ADMIN DASHBOARD ================= */}

      <Route
        path="/admin"
        element={
          <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="text-center">

              <h1 className="text-4xl font-bold text-blue-600">
                Admin Dashboard
              </h1>

              <p className="mt-3 text-slate-600">
                SmartAmbulance Administration Panel
              </p>

            </div>
          </div>
        }
      />


      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="text-center">

              <h1 className="text-5xl font-bold text-slate-800">
                404
              </h1>

              <p className="mt-3 text-slate-500">
                Page not found
              </p>

            </div>
          </div>
        }
      />

    </Routes>
  );
};

export default App;