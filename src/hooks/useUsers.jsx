import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/users/allUser`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });
  return [users, refetch];
};

export default useUser;
