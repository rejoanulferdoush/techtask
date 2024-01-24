import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useTask = () => {
  const { refetch, data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/tasks/allTasks`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      return response.data;
    },
  });
  return [tasks, refetch];
};

export default useTask;
