import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Components/Loaders/Loader";

const PrivateRoutes = () => {
  const { user, userLoading } = useSelector((state) => state?.user);

  if (userLoading) return <Loader />;

  return user ? <Outlet /> : <Navigate to="/authentication?tab=login" replace />;
};

export default PrivateRoutes;
