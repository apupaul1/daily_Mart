import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import fallbackImage from "../../../assets/background.jpg";
import useAxios from "../../../hooks/useAxios";
import Loading from "../../../Shared/Loading/Loading";

const AddHighlights = () => {
  const axiosSecure = useAxios();

  const {
    data: ads = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["highlight-ads", { status: "approved" }],
    queryFn: async () => {
      const res = await axiosSecure.get("/ads", {
        params: { status: "approved" },
      });
      return res.data;
    },
  });

  console.log(ads);

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        Error loading ads: {error.message}
      </p>
    );
  }

  if (!ads.length) {
    return (
      <p className="text-center text-gray-500">
        No approved advertisements available.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-xl md:text-3xl font-bold text-center my-6 md:my-12 text-neutral">
        Advertisement Highlights
      </h2>

      <Carousel
        autoPlay
        infiniteLoop
        showIndicators={false}
        showThumbs={false}
        showStatus={false}
        interval={3000}
      >
        {ads.map((ad, idx) => (
          <div key={idx}>
            <img
              className="h-[140px] md:h-[520px] w-full object-cover"
              src={ad.banner || fallbackImage}
              alt={`Ad ${idx + 1}`}
            />
            {ad.title && (
              <p className="legend text-lg hidden md:flex">{ad.title}</p>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default AddHighlights;
