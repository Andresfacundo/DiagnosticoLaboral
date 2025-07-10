import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../../../Services/authService';

const PrivateRoute = ({ allowedRoles }) => {
    const isAuth = authService.isAuthenticated();
    const userRole = authService.getUserRole();

    if (!isAuth) {
        return <Navigate to="/" />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/no-autorizado" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
