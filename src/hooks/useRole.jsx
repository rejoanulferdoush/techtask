import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axios from "axios";

const useRole = () => {
  const { user } = useAuth();
  const { data: userRole } = useQuery({
    queryKey: ["role", user?.email],
    queryFn: async () => {
      if (user) {
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURI}users/role/${user.email}`
        );
        return res.data;
      }
      return null; // or handle the case when user is null
    },
  });
  return [userRole];
};

export default useRole;
