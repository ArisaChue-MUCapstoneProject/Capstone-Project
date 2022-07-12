import React from "react"
import { Route, Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();
    // redirects user to login page if they are not logged in
    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    return children;
};
export default PrivateRoute;