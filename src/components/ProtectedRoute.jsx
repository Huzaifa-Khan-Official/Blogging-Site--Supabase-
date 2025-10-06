import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
    const { authUser } = useAuthStore();

    if (!authUser) {
        return <Navigate to="/login" replace />;
    } else if (authUser.isVerified === false) {
        return <Navigate to="/verify" replace />;
    }

    return children;
};

export default ProtectedRoute;