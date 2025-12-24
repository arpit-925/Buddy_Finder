import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/common/Loader";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // ✅ Show loader instead of blank page
  if (loading) {
    return <Loader fullScreen />;
  }

  // ✅ Redirect WITHOUT replace (keeps back button working)
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }} // preserve previous page
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
