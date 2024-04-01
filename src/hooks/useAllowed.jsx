import { useEffect, useState } from "react";
import useRole from "./useRole";

const useAllowed = () => {
  const [currentRole, setCurrentRole] = useState("");
  const [allowedTask, setAllowedTask] = useState(false);
  const [allowedProduct, setAllowedProduct] = useState(false);
  const [allowedUser, setAllowedUser] = useState(false);
  const [allowedSummary, setAllowedSummary] = useState(false);

  const [userRole] = useRole();

  useEffect(() => {
    if (userRole) {
      setCurrentRole(userRole.role);
    }
    switch (currentRole) {
      case "super_admin":
        setAllowedTask(true);
        setAllowedProduct(true);
        setAllowedUser(true);
        setAllowedSummary(true);
        break;
      case "admin":
        setAllowedTask(true);
        setAllowedProduct(true);
        setAllowedUser(true);
        setAllowedSummary(true);
        break;
      case "team_member":
        setAllowedTask(false);
        setAllowedProduct(false);
        setAllowedUser(false);
        setAllowedSummary(true);
        break;
      case "product_manager":
        setAllowedTask(false);
        setAllowedProduct(true);
        setAllowedUser(false);
        setAllowedSummary(true);
        break;
      case "task_manager":
        setAllowedTask(true);
        setAllowedProduct(false);
        setAllowedUser(false);
        setAllowedSummary(true);
        break;
      case "moderator":
        setAllowedTask(true);
        setAllowedProduct(true);
        setAllowedUser(false);
        setAllowedSummary(true);
        break;

      default:
        setAllowedTask(false);
        setAllowedProduct(false);
        setAllowedUser(false);
        setAllowedSummary(false);
    }
  }, [
    allowedTask,
    allowedProduct,
    allowedUser,
    allowedSummary,
    currentRole,
    userRole,
  ]);

  return [
    allowedTask,
    allowedProduct,
    allowedUser,
    allowedSummary,
    currentRole,
  ];
};

export default useAllowed;
