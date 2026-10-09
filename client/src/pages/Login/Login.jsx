import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaAmbulance,
} from "react-icons/fa";

import { supabase } from "../../lib/supabaseClient";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // Login using Supabase Auth
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

      if (loginError) {
        throw loginError;
      }

      if (!data.user) {
        throw new Error("Unable to login.");
      }

      /*
       * Get the user's profile.
       *
       * The profile contains the application role:
       * driver / hospital / admin
       */

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", data.user.id)
          .single();

      if (profileError) {
        throw profileError;
      }

      // Redirect according to role
      if (profile.role === "driver") {
        navigate("/driver");
      } else if (profile.role === "hospital") {
        navigate("/hospital");
      } else if (profile.role === "admin") {
        navigate("/admin");
      } else {
        throw new Error("Invalid user role.");
      }

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message || "Login failed. Please check your credentials."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-10">

          <FaAmbulance className="text-7xl mb-6" />

          <h1 className="text-4xl font-bold mb-4">
            SmartAmbulance
          </h1>

          <p className="text-center text-lg leading-8 max-w-md">
            Intelligent ambulance tracking and
            traffic signal management for faster
            emergency response.
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
              Faster hospital arrival
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="p-8 md:p-12">

          <h2 className="text-3xl font-bold text-slate-800">
            Welcome Back
          </h2>

          <p className="text-slate-500 mt-2 mb-8">
            Login to your SmartAmbulance account.
          </p>

          {/* ERROR */}

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <label className="font-semibold text-slate-700">
              Email
            </label>

            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 mt-2 mb-6 focus-within:border-blue-500">

              <FaEnvelope className="text-slate-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="ml-3 w-full outline-none text-slate-700"
              />

            </div>

            {/* PASSWORD */}

            <label className="font-semibold text-slate-700">
              Password
            </label>

            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 mt-2 mb-3 focus-within:border-blue-500">

              <FaLock className="text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="ml-3 w-full outline-none text-slate-700"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <FaEyeSlash className="text-slate-500" />
                ) : (
                  <FaEye className="text-slate-500" />
                )}
              </button>

            </div>

            {/* FORGOT PASSWORD */}

            <div className="text-right mb-7">

              <button
                type="button"
                className="text-blue-600 text-sm hover:underline"
                onClick={() => {
                  // We will implement password reset later.
                  alert("Password reset will be added next.");
                }}
              >
                Forgot Password?
              </button>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold transition shadow-md"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* REGISTER */}

          <p className="text-center mt-7 text-slate-600">

            Don't have an account?

            <Link
              to="/register"
              className="text-blue-600 font-semibold ml-2 hover:underline"
            >
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;