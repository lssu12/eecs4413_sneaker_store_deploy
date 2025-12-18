import React from "react";
import {Navigate, useLocation} from "react-dom";
import ApiService from "./ApiService";

export const protectRoute = ({ element: Component }) => {
  const location = useLocation();
  const isAuth = ApiService.isAuthenticated();

  if (isAuth) {
    return Component;
  }

  return (
    <Navigate to="/login" replace state={{ from: location }}/>
  );
};


export const adminRoute = ({ element: Component }) => {
  const location = useLocation();

  if (ApiService.isAdmin()) {
    return Component;
  }

  return (
    <Navigate to="/login" replace state={{ from: location }}/>
  );
};