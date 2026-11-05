import React from "react";
import { useNavigate } from "react-router";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const ProductCard = ({ card }) => {
  const { loading, user } = useAuth();
  const navigate = useNavigate();

  const handleDetails = (id) => {
    if (!user?.email) {
      navigate("/login");
    } else {
      navigate(`/details/${id}`);
    }
  };

  return (
    <div
      data-aos="fade-down"
      // data-aos-offset="400"
      data-aos-easing="ease-in-sine"
      key={card._id}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <img
          src={card.imageUrl}
          alt={card.itemName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />

        {/* Price badge */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold px-3 py-1 rounded-full shadow">
          ৳{card.pricePerUnit}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
          <MapPin size={12} />
          <span className="truncate">{card.marketName}</span>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-2 truncate">
          {card.itemName}
        </h2>

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Calendar size={12} />
          <span>{card.date.slice(0, 10)}</span>
        </div>

        <button
          onClick={() => handleDetails(card._id)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 disabled:opacity-60"
        >
          View Details
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;