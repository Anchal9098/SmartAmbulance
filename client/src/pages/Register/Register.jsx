import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaAmbulance,
  FaHospital,
  FaUserShield,
} from "react-icons/fa";

import { supabase } from "../../lib/supabaseClient";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("driver");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // -------------------------
    // VALIDATION
    // -------------------------

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // -------------------------
      // CREATE SUPABASE AUTH USER
      // -------------------------

      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,

          options: {
            data: {
              full_name: formData.fullName.trim(),
              phone: formData.phone,
              role: role,
            },
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.user) {
        throw new Error(
          "User account could not be created."
        );
      }

      // -------------------------
      // SUCCESS
      // -------------------------

      setMessage(
        "Registration successful! Please check your email to verify your account."
      );

      // Clear form

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
      });

      // Go to login

      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* ================================
            LEFT SIDE
        ================================= */}

        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-10">

          <FaAmbulance className="text-7xl mb-6" />

          <h1 className="text-4xl font-bold mb-4 text-center">
            Join SmartAmbulance
          </h1>

          <p className="text-center text-lg leading-8 max-w-md">
            Become part of an intelligent emergency
            response system designed to improve
            ambulance travel through smart traffic
            management.
          </p>

          <div className="mt-10 space-y-4 text-sm">

            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Real-time ambulance tracking
            </div>

            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Smart traffic signal priority
            </div>

            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Faster emergency response
            </div>

          </div>

        </div>

        {/* ================================
            RIGHT SIDE
        ================================= */}

        <div className="p-8 md:p-10">

          <h2 className="text-3xl font-bold text-slate-800">
            Create Account
          </h2>

          <p className="text-slate-500 mt-2 mb-7">
            Register to access the SmartAmbulance system.
          </p>

          {/* ERROR */}

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {message && (
            <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleRegister}>

            {/* ================================
                ROLE
            ================================= */}

            <label className="font-semibold text-slate-700">
              Select Role
            </label>

            <div className="grid grid-cols-3 gap-3 mt-3 mb-7">

              {/* DRIVER */}

              <button
                type="button"
                onClick={() => setRole("driver")}
                className={`rounded-xl border p-3 transition ${
                  role === "driver"
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
                }`}
              >
                <FaAmbulance className="mx-auto text-xl mb-2" />

                <span className="text-sm">
                  Driver
                </span>
              </button>

              {/* HOSPITAL */}

              <button
                type="button"
                onClick={() => setRole("hospital")}
                className={`rounded-xl border p-3 transition ${
                  role === "hospital"
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
                }`}
              >
                <FaHospital className="mx-auto text-xl mb-2" />

                <span className="text-sm">
                  Hospital
                </span>
              </button>

              {/* ADMIN */}

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`rounded-xl border p-3 transition ${
                  role === "admin"
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
                }`}
              >
                <FaUserShield className="mx-auto text-xl mb-2" />

                <span className="text-sm">
                  Admin
                </span>
              </button>

            </div>

            {/* ================================
                FULL NAME
            ================================= */}

            <label className="font-semibold text-slate-700">
              Full Name
            </label>

            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 mt-2 mb-5 focus-within:border-blue-500">

              <FaUser className="text-slate-400" />

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="ml-3 w-full outline-none text-slate-700"
              />

            </div>

            {/* ================================
                EMAIL
            ================================= */}

            <label className="font-semibold text-slate-700">
              Email
            </label>

            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 mt-2 mb-5 focus-within:border-blue-500">

              <FaEnvelope className="text-slate-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="ml-3 w-full outline-none text-slate-700"
              />

            </div>

            {/* ================================
                PHONE
            ================================= */}

            <label className="font-semibold text-slate-700">
              Phone Number
            </label>

            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 mt-2 mb-5 focus-within:border-blue-500">

              <FaPhone className="text-slate-400" />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength="10"
                className="ml-3 w-full outline-none text-slate-700"
              />

            </div>

            {/* ================================
                PASSWORD
            ================================= */}

            <label className="font-semibold text-slate-700">
              Password
            </label>

            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 mt-2 mb-7 focus-within:border-blue-500">

              <FaLock className="text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="ml-3 w-full outline-none text-slate-700"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="ml-2"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-slate-500" />
                ) : (
                  <FaEye className="text-slate-500" />
                )}
              </button>

            </div>

            {/* ================================
                REGISTER BUTTON
            ================================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold transition shadow-md"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* ================================
              LOGIN LINK
          ================================= */}

          <p className="text-center mt-7 text-slate-600">

            Already have an account?

            <Link
              to="/login"
              className="text-blue-600 font-semibold ml-2 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;