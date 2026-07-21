import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ permission }) => {
    const { user } = useAppContext();

    // If user is not logged in, redirect to login
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If user is not SUB_ADMIN (e.g. Institute Admin or Super Admin), they have access
    if (user.role !== "SUB_ADMIN") {
        return <Outlet />;
    }

    // If user is SUB_ADMIN, check specific permission
    // If permission is not provided, we just check if they are logged in (allowed)
    if (!permission) {
        return <Outlet />;
    }

    // Check the specific permission
    if (user.permissions?.[permission]) {
        return <Outlet />;
    }

    // If unauthorized, redirect to a dashboard or show default view
    return <Navigate to="/admin/dashboard" replace />;
};

export default ProtectedRoute;
