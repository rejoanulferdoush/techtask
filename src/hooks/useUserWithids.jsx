import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useUserWithids = () => {
  const { refetch, data: userswid = [] } = useQuery({
    queryKey: ["userswid"],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/users/getUserWithID`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });
  return [userswid, refetch];
};

export default useUserWithids;
