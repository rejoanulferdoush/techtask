import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useIssues = () => {
  const { refetch, data: issues = [] } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/issues/allIssues`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      return response.data;
    },
  });
  return [issues, refetch];
};

export default useIssues;
