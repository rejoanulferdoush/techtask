import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useHistories = () => {
  const { refetch, data: histories = [] } = useQuery({
    queryKey: ["histories"],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/histories/allHistory`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });
  return [histories, refetch];
};

export default useHistories;
