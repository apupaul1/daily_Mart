import React from "react";
import useAuth from "../../../hooks/useAuth";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
} from "react-icons/fa";
import UseUserRole from "../../../hooks/UseUserRole";

const MyProfile = () => {
  const { user } = useAuth();
  const {role} = UseUserRole()



  // Convert last login to readable format (if available)
  const lastLogin = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleString()
    : "Not Available";

  return (
    <div className="flex justify-center items-center p-6">
      <div className="max-w-6xl p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <img
            src={user?.photoURL || "https://via.placeholder.com/150"}
            alt="User"
            className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-md"
          />
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {user?.displayName || "User Name"}
          </h2>
          <p className="text-gray-500">{user?.email || "No Email Provided"}</p>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-blue-500 w-5 h-5" />
            <span className="text-gray-700">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-green-500 w-5 h-5" />
            <span className="text-gray-700">
              {user?.phoneNumber || "Not Added"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-red-500 w-5 h-5" />
            <span className="text-gray-700">
              {user?.address || "No Address Provided"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FaUser className="text-purple-500 w-5 h-5" />
            <span className="text-gray-700">
              Role: {role || "User"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FaClock className="text-orange-500 w-5 h-5" />
            <span className="text-gray-700">
              Last Login: {lastLogin}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
