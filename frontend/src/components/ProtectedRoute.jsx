import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUser, isRouteAllowed, getDefaultRoute } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
    const user = getUser();
    const location = useLocation();

    if (!user) {
        // Not logged in, redirect to login page
        return <Navigate to="/auth" replace />;
    }

    if (!isRouteAllowed(user, location.pathname)) {
        // Logged in but not allowed to view this page, redirect to their default route
        const defaultRoute = getDefaultRoute(user.role);
        return <Navigate to={defaultRoute} replace />;
    }

    return children;
};

export default ProtectedRoute;
