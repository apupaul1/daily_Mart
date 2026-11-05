import React from 'react';
import UseUserRole from '../../../hooks/UseUserRole';
import AdminDashboard from './AdminDashboard';
import VendorDashboard from './VendorDashboard';
import UserDashboard from './UserDashboard';
import Forbidden from '../../Forbidden/Forbidden';
import Loading from '../../../Shared/Loading/Loading';

const Dashboard = () => {

    const { role, roleLoading } = UseUserRole();


    if (roleLoading) {
        return <Loading></Loading>
    }

    if (role === 'admin') {
        return <AdminDashboard></AdminDashboard>
    }
    else if (role === 'vendor') {
        return <VendorDashboard></VendorDashboard>
    }
    else if (role === 'user') {
        return <UserDashboard></UserDashboard>
    }
    else {
        return <Forbidden></Forbidden>
    }

};

export default Dashboard;