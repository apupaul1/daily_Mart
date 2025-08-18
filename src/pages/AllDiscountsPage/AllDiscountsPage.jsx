import React from "react";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Shared/Loading/Loading";

const AllDiscountsPage = () => {
    const axiosSecure = useAxios();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["allProducts"],
        queryFn: async () => {
            const res = await axiosSecure.get("/all-products");
            return res.data.data;
        },
        keepPreviousData: true,
    });

    if (isLoading) {
        return <Loading></Loading>
    }

    // Hardcoded discount (20%)
    const DISCOUNT_PERCENT = 20;

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            {/* Page Header */}
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                All Discounts
            </h1>

            {/* Product Cards */}
            <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {products.map((product, index) => {
                    // old price from API
                    const oldPrice = product.latestPrice || 0;
                    // apply hardcoded discount
                    const newPrice = (oldPrice - (oldPrice * DISCOUNT_PERCENT) / 100).toFixed(0);

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden"
                        >
                            {/* Product Image */}
                            <img
                                src={product.imageUrl || "https://via.placeholder.com/400x300"}
                                alt={product.itemName}
                                className="w-full h-48 object-cover"
                            />

                            {/* Product Details */}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">
                                    {product.itemName}
                                </h2>
                                <p className="text-gray-600 mb-2">
                                    Market: {product.marketName}
                                </p>
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-gray-400 line-through">
                                        ৳{oldPrice}
                                    </span>
                                    <span className="text-red-500 font-bold text-lg">
                                        ৳{newPrice}
                                    </span>
                                </div>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AllDiscountsPage;
