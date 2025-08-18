import React from 'react';
import { Links, NavLink } from 'react-router';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {

    const { user, logOut } = useAuth();

    const handleLogout = () => {
        logOut()
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const navLinks = <>
        <li><NavLink to={'/'}> Home</NavLink> </li>
        <li><NavLink to={'/allproducts'}>All Products</NavLink></li>
        <li><NavLink to={'/blogs'}>Blog</NavLink></li>
        <li><NavLink to={'/discount-product'}>Discount Items</NavLink></li>
        {
            user && <>
                <li><NavLink to={'/dashboard'}>Dashboard</NavLink></li>
            </>
        }
    </>

    return (
        <div className='sticky top-0 z-90'>
            <div className="navbar bg-green-400 shadow-sm ">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost pl-0 pr-3 lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {navLinks}
                        </ul>
                    </div>
                    <div className='flex items-center relative gap-2'>
                        <img
                            className='w-9 md:w-12'
                            src={'/logo.png'} alt="" />
                        <NavLink to={'/'}> <p className="text-lg lg:text-2xl font-bold absolute md:top-2 md:left-12 top-1 left-9">DailyMart</p></NavLink>
                    </div>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navLinks}
                    </ul>
                </div>
                <div className="navbar-end flex gap-5">
                    {
                        user ? <>
                            <div className="avatar">
                                <div className="w-11 rounded-full">
                                    <img src={user.photoURL} />
                                </div>
                            </div>
                            <button onClick={handleLogout} className='btn btn-primary'>Logout</button>

                        </>
                            :
                            <>
                                <button className='btn btn-sm btn-primary'><NavLink to={'/login'}>Login</NavLink></button>
                                <button className='btn btn-sm btn-primary'><NavLink to={'/register'}>Signup</NavLink></button>
                            </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;