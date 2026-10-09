import { Link } from "react-router-dom";
import { FaAmbulance } from "react-icons/fa";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl shadow-lg">
            <FaAmbulance />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              SmartAmbulance
            </h1>

            <p className="text-xs text-slate-500">
              Priority Traffic System
            </p>
          </div>
        </Link>

        {/* Navigation */}

        <nav className="hidden md:flex gap-10 text-slate-700 font-medium">

          <a href="#" className="hover:text-blue-600 duration-300">
            Home
          </a>

          <a href="#" className="hover:text-blue-600 duration-300">
            Features
          </a>

          <a href="#" className="hover:text-blue-600 duration-300">
            About
          </a>

          <a href="#" className="hover:text-blue-600 duration-300">
            Contact
          </a>

        </nav>

        {/* Buttons */}

        <div className="flex gap-4">

          <Link to="/login">

            <button className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition">
              Login
            </button>

          </Link>

          <Link to="/register">

            <button className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-md">
              Register
            </button>

          </Link>

        </div>

      </div>
    </header>
  );
};

export default Navbar;