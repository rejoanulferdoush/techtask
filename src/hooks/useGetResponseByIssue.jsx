import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useGetResponseByIssue = (id) => {
  const { refetch: responseRefetch, data: responses = [] } = useQuery({
    queryKey: ["responses"],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/responses/respond/${id}`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });
  return [responses, responseRefetch];
};

export default useGetResponseByIssue;
