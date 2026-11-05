import React from "react";
import useAuth from "../../../hooks/useAuth";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaEdit,
} from "react-icons/fa";
import UseUserRole from "../../../hooks/UseUserRole";

const MyProfile = () => {
  const { user } = useAuth();
  const { role } = UseUserRole();

  const lastLogin = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleString()
    : "Not Available";

  const infoItems = [
    {
      icon: FaEnvelope,
      label: "Email",
      value: user?.email || "No Email Provided",
      color: "text-blue-500 bg-blue-50",
    },
    {
      icon: FaPhoneAlt,
      label: "Phone",
      value: user?.phoneNumber || "Not Added",
      color: "text-emerald-500 bg-emerald-50",
    },
    {
      icon: FaMapMarkerAlt,
      label: "Address",
      value: user?.address || "No Address Provided",
      color: "text-rose-500 bg-rose-50",
    },
    {
      icon: FaUser,
      label: "Role",
      value: role || "User",
      color: "text-purple-500 bg-purple-50",
    },
    {
      icon: FaClock,
      label: "Last Login",
      value: lastLogin,
      color: "text-orange-500 bg-orange-50",
    },
  ];

  return (
    <div className="bg-gray-50 flex justify-center items-start sm:items-center">
      <div className="w-full bg-white rounded-2xl overflow-hidden">
        {/* Cover / Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative ">
          <button className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-lg backdrop-blur-sm transition">
            <FaEdit className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>

        {/* Profile Header */}
        <div className="relative z-10 flex flex-col items-center -mt-14 sm:-mt-16 px-6 ">
          <img
            src={user?.photoURL || "https://via.placeholder.com/150"}
            alt="User"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">
            {user?.displayName || "User Name"}
          </h2>
          <p className="text-gray-500 mt-1">{user?.email || "No Email Provided"}</p>

          <span className="mt-3 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium capitalize">
            <FaUser className="w-3 h-3" />
            {role || "User"}
          </span>
        </div>

        {/* Divider */}
        <div className="mt-8 px-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Account Information
          </h3>
        </div>

        {/* Profile Details Grid */}
        <div className="px-6 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 hover:shadow-sm transition"
              >
                <div className={`p-3 rounded-lg ${item.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-800 font-medium truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;