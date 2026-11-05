import React from 'react';
import useAuth from '../hooks/useAuth';
import UseUserRole from '../hooks/UseUserRole';
import { Navigate } from 'react-router';
import Loading from '../Shared/Loading/Loading';

const AdminRoute = ({ children }) => {

    const { user, loading } = useAuth();
    const { role, roleLoading } = UseUserRole();

    if (loading || roleLoading) {
        return <Loading></Loading>
    }

    if (!user || role !== 'admin') {
        return <Navigate state={{ from: location.pathname }} to={'/forbidden'}></Navigate>
    }

    return children;
};

export default AdminRoute;