import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useIssueCount = (day) => {
  const { refetch: refetchPending, data: pendingIssueCount = 0 } = useQuery({
    queryKey: ["pendingIssueCount", day],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/issues/get${day}IssueCount/pending`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });
  const { refetch: refetchResolved, data: resolvedIssueCount = 0 } = useQuery({
    queryKey: ["resolvedIssueCount", day],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/issues/get${day}IssueCount/resolve`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });
  const { refetch: refetchInProgress, data: inProgressIssueCount = 0 } =
    useQuery({
      queryKey: ["inProgressIssueCount", day],
      queryFn: async () => {
        const response = await axios.get(
          `https://techops.sohochor.com/api/issues/get${day}IssueCount/in_progress`
        );
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
    });

  return [
    pendingIssueCount,
    resolvedIssueCount,
    inProgressIssueCount,
    refetchResolved,
    refetchPending,
    refetchInProgress,
  ];
};

export default useIssueCount;
