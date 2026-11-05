import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import ProductCard from "./ProductCard";

const ProductSection = () => {
  const { loading, user } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios();

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const res = await axios.get("/marketcards");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div data-aos="zoom-in-up">
      <h1 className="text-center text-2xl md:text-4xl font-bold md:mb-5">
        Product Section
      </h1>
      {cards.length <= 0 ? (
        <p className="text-center mt-10">No cards found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8 max-w-7xl mx-auto">
          {cards.map((card) => (
            <ProductCard key={card._id} card={card}></ProductCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSection;
