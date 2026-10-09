import React from "react";
import { FaAmbulance, FaBell, FaUserCircle } from "react-icons/fa";

const DriverHeader = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6">

      {/* Logo */}
      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
          <FaAmbulance className="text-blue-600 text-xl" />
        </div>

        <div>
          <h1 className="font-bold text-xl text-slate-800">
            SmartAmbulance
          </h1>

          <p className="text-xs text-slate-500">
            Emergency Response System
          </p>
        </div>

      </div>


      {/* Right Side */}

      <div className="flex items-center gap-6">

        <button className="relative text-slate-500 hover:text-blue-600">

          <FaBell className="text-xl" />

          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full">
          </span>

        </button>


        <div className="flex items-center gap-3">

          <FaUserCircle className="text-3xl text-slate-400" />

          <div className="hidden sm:block">

            <p className="font-semibold text-slate-700">
              Driver
            </p>

            <p className="text-xs text-green-600">
              Online
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default DriverHeader;