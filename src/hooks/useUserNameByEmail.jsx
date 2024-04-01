import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useUserNameByEmail = (email) => {
  const { refetch, data: userbyemail = [] } = useQuery({
    queryKey: ["userbyemail"],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/users/user/${email}`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });
  return [userbyemail, refetch];
};

export default useUserNameByEmail;
