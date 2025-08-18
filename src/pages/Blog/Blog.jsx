import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faAppleAlt, faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";

const blogs = [
  {
    title: "Top 10 Grocery Tips for Busy People",
    excerpt: "Learn how to save time and money while shopping for your daily groceries...",
    image: "https://i.ibb.co/39HTJg3c/grunge-black-concrete-textured-background.jpg",
    icon: faCartShopping,
    link: "#",
  },
  {
    title: "How to Find Fresh Produce in Local Markets",
    excerpt: "Discover the best ways to select fresh fruits and vegetables in your area...",
    image: "https://i.ibb.co/hQqXHPJ/abstract-blur-beautiful-luxury-shopping-mall-center.jpg",
    icon: faLeaf,
    link: "#",
  },
  {
    title: "Healthy Eating on a Budget",
    excerpt: "Simple strategies to eat healthy without breaking the bank...",
    image: "https://i.ibb.co/qL5QMCNF/Cooking.jpg",
    icon: faHeart,
    link: "#",
  },
  {
    title: "Seasonal Fruits You Should Try",
    excerpt: "Explore the seasonal fruits available in your local markets and their benefits...",
    image: "https://i.ibb.co/dJjL6Swn/ella-olsson-KPDb-Ry-FOTn-E-unsplash.jpg",
    icon: faAppleAlt,
    link: "#",
  },
  {
    title: "5 Easy Recipes for Busy Weeknights",
    excerpt: "Quick, healthy, and delicious recipes you can cook in under 30 minutes...",
    image: "https://i.ibb.co/93mSnJrH/vintage-old-rustic-cutlery-dark.jpg",
    icon: faHeart,
    link: "#",
  },
  {
    title: "Why Local Markets Are Better Than Superstores",
    excerpt: "Discover the unique benefits of buying fresh from your neighborhood markets...",
    image: "https://i.ibb.co/nNGLksbK/jed-owen-OGZon8f-Mkp0-unsplash.jpg",
    icon: faCartShopping,
    link: "#",
  },
];


const Blog = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Our Blog
      </h1>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden"
          >
            
            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />

            
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={blog.icon} className="text-blue-500 text-xl" />
                <h2 className="text-xl font-semibold">{blog.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">{blog.excerpt}</p>
              <a
                href={blog.link}
                className="text-blue-500 font-semibold hover:underline"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
