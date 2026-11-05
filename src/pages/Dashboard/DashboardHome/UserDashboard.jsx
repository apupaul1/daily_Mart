import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaShoppingCart, FaEye, FaChartLine } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, error } = useQuery({
    queryKey: ["userDashboard", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/user/${user.email}`);
      return res.data;
    },
  });

  if (loading || !data) {
    return <Loading />;
  }

  if (error)
    return (
      <p className="text-red-500 text-center text-lg mt-10">
        Error loading data
      </p>
    );

  const { recentOrders, watchlist } = data;

  const priceTrendData = recentOrders.map((order) => ({
    name: order.productName,
    price: order.price,
  }));

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <div className="p-6 rounded-2xl lg:p-12 bg-gradient-to-r from-purple-50 via-white to-indigo-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-purple-700">
        Welcome, {user.displayName}!
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <section className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-purple-500">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-purple-700">
            <FaShoppingCart /> Recent Orders
          </h2>
          {recentOrders.length ? (
            <ul className="space-y-2">
              {recentOrders.map((order, idx) => (
                <li key={idx} className="bg-purple-100 rounded p-3">
                  <strong>{order.productName}</strong> — {order.quantity} pcs —
                  ৳{order.totalAmount.toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent orders</p>
          )}
        </section>

        {/* Watchlist */}
        <section className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-indigo-700">
            <FaEye /> Watchlist
          </h2>
          {watchlist.length ? (
            <ul className="space-y-2">
              {watchlist.map((item, idx) => (
                <li key={idx} className="bg-indigo-100 rounded p-3">
                  <strong>{item.productName}</strong> — Current Price: ৳
                  {item.currentPrice}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No items in watchlist</p>
          )}
        </section>
      </div>

      {/* Price Trend */}
      <section className="mt-12 bg-white shadow-lg rounded-lg p-6 border-l-4 border-pink-500">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-pink-600">
          <FaChartLine /> Price Trend
        </h2>
        {priceTrendData.length ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={priceTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#ec4899"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No price trend data available</p>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
