import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import Sidebar from "../Shared/DashboardComponent/Sidebar";
import { FaBars } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const { user, logOut } = useAuth();

  const handleLogout = () => {
    logOut()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="drawer ">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-300">
        {/* Navbar */}
        <div className="navbar bg-green-400  w-full">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 text-xl font-bold flex items-center relative">
            <img className="w-12" src={"/logo.png"} alt="" />
            <NavLink to={"/"}>
              {" "}
              <p className="btn btn-ghost text-xl absolute top-1 left-8">
                DailyMart
              </p>
            </NavLink>
          </div>
          <ul className="flex-1 flex gap-4">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/blogs"}>Blog</Link>
            </li>
            <li>
              <Link to={"/discount-product"}>Discount Items</Link>
            </li>
          </ul>
          <div className="">
            <ul className="menu menu-horizontal flex items-center">
              <button onClick={handleLogout} className="btn btn-sm btn-primary">
                Logout
              </button>
            </ul>
          </div>
        </div>
        <div className="flex gap-10 m-4">
          <div className="hidden lg:block w-64 flex-1 bg-base-100">
            <Sidebar></Sidebar>
          </div>
          <div className="flex-5 p-4 bg-white rounded-2xl">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="bg-white">
          <Sidebar></Sidebar>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
