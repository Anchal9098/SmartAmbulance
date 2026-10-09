import React from "react";

import {
  FaAmbulance,
  FaMapMarkerAlt,
  FaTrafficLight,
  FaHospital,
} from "react-icons/fa";

const StatusCards = () => {
  const cards = [
    {
      title: "Ambulance Status",
      value: "Ready",
      description: "Available for emergency",
      icon: <FaAmbulance />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Current Location",
      value: "GPS Active",
      description: "Location tracking enabled",
      icon: <FaMapMarkerAlt />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Traffic Priority",
      value: "Inactive",
      description: "No emergency route active",
      icon: <FaTrafficLight />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Destination",
      value: "Not Selected",
      description: "Hospital not selected",
      icon: <FaHospital />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
        >

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-500">
                {card.title}
              </p>

              <h3 className="text-xl font-bold text-slate-800 mt-2">
                {card.value}
              </h3>

            </div>


            <div
              className={`w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center text-lg`}
            >
              {card.icon}
            </div>

          </div>


          <p className="text-xs text-slate-400 mt-4">
            {card.description}
          </p>

        </div>
      ))}

    </div>
  );
};

export default StatusCards;