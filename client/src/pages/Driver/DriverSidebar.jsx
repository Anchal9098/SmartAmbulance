import React from "react";

import {
  FaTachometerAlt,
  FaAmbulance,
  FaMapMarkedAlt,
  FaRoute,
  FaHistory,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const DriverSidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-[calc(100vh-80px)] hidden md:block">

      <div className="p-5">

        <p className="text-xs uppercase tracking-wider text-slate-400 mb-4">
          Driver Menu
        </p>


        <nav className="space-y-2">

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </button>


          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800">
            <FaAmbulance />
            <span>My Ambulance</span>
          </button>


          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800">
            <FaMapMarkedAlt />
            <span>Live Tracking</span>
          </button>


          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800">
            <FaRoute />
            <span>Emergency Trip</span>
          </button>


          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800">
            <FaHistory />
            <span>Trip History</span>
          </button>


          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800">
            <FaCog />
            <span>Settings</span>
          </button>

        </nav>


        <div className="border-t border-slate-700 my-6"></div>


        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-slate-800">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default DriverSidebar;