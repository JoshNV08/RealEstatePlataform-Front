import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  const location = useLocation();

  if (!user) {
    // Si no está logueado, redirigir a login conservando la ruta de origen
    return <Navigate to="/ingreso" state={{ from: location }} replace />;
  }

  // Si está logueado, renderiza los hijos o el Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;