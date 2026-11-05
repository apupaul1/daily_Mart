import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const UseUserRole = () => {

    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: role = 'user', isLoading: roleLoading, refetch, } = useQuery({
        queryKey: ['UserRole', user?.email],
        enabled: !authLoading && !!user.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data.role;
        }
    })

    return { role, roleLoading: authLoading || roleLoading, refetch };

};

export default UseUserRole;