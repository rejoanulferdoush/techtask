import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../../../providers/AuthProviders";
import Loader from "../../Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  const location = useLocation();
  let from = location?.state?.from?.pathname || "/";
  if (loading) {
    return <Loader className="fixed w-screen h-screen"></Loader>;
  }

  if (user) {
    return children;
  }
  return <Navigate to="/login" state={{ from: from }} replace></Navigate>;
};

export default PrivateRoute;
