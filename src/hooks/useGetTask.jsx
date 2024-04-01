import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetTask = (id) => {
  const { refetch, data: task = [] } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/tasks/getTask/${id}`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      console.log(response);
      return response.data;
    },
  });
  return [task, refetch];
};

export default useGetTask;
