import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../Service/AuthService';

const AdminRoute = ({ children }) => {
	if (!AuthService.isAuthenticated()) {
		return <Navigate to="/login" replace />;
	}

	if (!AuthService.isAdmin()) {
		return <Navigate to="/sneakers" replace />;
	}

	return children;
};

export default AdminRoute;
