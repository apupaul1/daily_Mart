import React from 'react';
import { NavLink } from 'react-router';
import {
  FaUsers, FaClipboardList, FaBullhorn, FaShoppingCart, FaPlus,
  FaChartLine, FaTools
} from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { BsCardChecklist } from 'react-icons/bs';
import { CgProfile } from "react-icons/cg";
import useAuth from '../../hooks/useAuth';
import UseUserRole from '../../hooks/UseUserRole';
import Loading from '../Loading/Loading';


const Sidebar = () => {

  const { user } = useAuth()
  const { role, roleLoading } = UseUserRole();


  if (roleLoading) {
    return <Loading></Loading>
  }

  return (
    <div className="p-4 flex flex-col min-h-screen h-full overflow-y-auto">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center mb-6">
        <img
          src={'/logo.png'}
          alt="Logo"
          className="w-12 mr-2"
        />
        <h1 className="text-lg font-bold text-gray-900">DailyMart</h1>
      </div>

      {/* Profile */}
      <div className="text-center mb-6">
        <img
          src={user.photoURL}
          alt="Avatar"
          className="w-20 h-20 rounded-full mx-auto mb-2"
        />
        <h2 className="text-sm font-semibold text-gray-800">{user.email}</h2>
        <p className="text-xs text-gray-500">{user.displayName}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <p className="text-xs text-gray-400 uppercase mb-2">Navigation</p>
        <ul className="space-y-2 text-sm">
          <li>
            <NavLink
              className=
              'flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 hover:bg-purple-100 hover:text-purple-700'
              to={'/dashboard'}>
              <FaUsers />
              Overview</NavLink>
          </li>

          {!roleLoading && role === 'admin' &&
            <>
              <li>
                <NavLink
                  to="all-users"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
                  }
                >
                  <FaUsers />
                  All Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="all-products"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
                  }
                >
                  <FaClipboardList />
                  All Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="all-ads"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
                  }
                >
                  <FaBullhorn />
                  All Advertisements
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="all-orders"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
                  }
                >
                  <FaShoppingCart />
                  All Orders
                </NavLink>
              </li>
            </>
          }

          {/* Vendor Only Links */}
          {!roleLoading && role === 'vendor' && (
            <>
              <li>
                <NavLink to="addproduct" className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
                }>
                  <FaPlus />
                  Add Product
                </NavLink>
              </li>
              <li>
                <NavLink to="my-products" className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
                }>
                  <MdOutlineProductionQuantityLimits />
                  My Products
                </NavLink>
              </li>
              <li>
                <NavLink to="postadvertisement" className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
                }>
                  <FaBullhorn />
                  Add Advertisement
                </NavLink>
              </li>
              <li>
                <NavLink to="my-ads" className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
                }>
                  <FaChartLine />
                  My Advertisements
                </NavLink>
              </li>
            </>
          )}

          {/* Buyer Only Links */}

          {
            !roleLoading && role === 'user' && <>
              <li>
                <NavLink to="watchlist" className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
                }>
                  <FaTools />
                  Manage Watchlist
                </NavLink>
              </li>
              <li>
                <NavLink to="myorder" className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
                }>
                  <FaShoppingCart />
                  My Order List
                </NavLink>
              </li>
              <li>
                <NavLink to="price-trends" className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
                }>
                  <BsCardChecklist />
                  View Price Trends
                </NavLink>
              </li>
            </>
          }

          <li>
            <NavLink to="myprofile" className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-100 hover:text-purple-700 ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`
            }>
              <CgProfile />
              My Profile
            </NavLink>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
