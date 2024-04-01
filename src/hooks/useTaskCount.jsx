import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useTaskCount = () => {
  const { refetch: refetchCompletedTask, data: completedTaskStatusCount = 0 } =
    useQuery({
      queryKey: ["completedTaskStatusCount"],
      queryFn: async () => {
        const response = await axios.get(
          `https://techops.sohochor.com/api/tasks/getTaskCount/completed`
        );
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
    });
  const {
    refetch: refetchInProgressTask,
    data: inProgressTaskStatusCount = 0,
  } = useQuery({
    queryKey: ["inProgressTaskStatusCount"],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/tasks/getTaskCount/in_progress`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });
  const {
    refetch: refetchNotStartedTask,
    data: notStartedTaskStatusCount = 0,
  } = useQuery({
    queryKey: ["notStartedTaskStatusCount"],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/tasks/getTaskCount/not_started`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });
  const { refetch: refetchOverdueTask, data: overdueTaskStatusCount = 0 } =
    useQuery({
      queryKey: ["overdueTaskStatusCount"],
      queryFn: async () => {
        const response = await axios.get(
          `https://techops.sohochor.com/api/tasks/getTaskCount/overdue`
        );
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
    });

  const { refetch: refetchTaskByAssignTo, data: assignToTaskStatusCount = 0 } =
    useQuery({
      queryKey: ["assignToTaskStatusCount"],
      queryFn: async () => {
        const response = await axios.get(
          `https://techops.sohochor.com/api/tasks/getTaskCountByAssignedTo`
        );
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
    });

  const { refetch: refetchgetTaskDurations, data: getTaskDurations = 0 } =
    useQuery({
      queryKey: ["getTaskDurations"],
      queryFn: async () => {
        const response = await axios.get(
          `https://techops.sohochor.com/api/tasks/getTaskDurations`
        );
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
    });
  const { refetch: refetchGetTaskStatus, data: getTaskStatus = 0 } = useQuery({
    queryKey: ["getTaskStatus"],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/tasks/getTaskStatus`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });

  return [
    completedTaskStatusCount,
    inProgressTaskStatusCount,
    notStartedTaskStatusCount,
    overdueTaskStatusCount,
    assignToTaskStatusCount,
    getTaskDurations,
    getTaskStatus,
    refetchCompletedTask,
    refetchInProgressTask,
    refetchNotStartedTask,
    refetchOverdueTask,
    refetchTaskByAssignTo,
    refetchgetTaskDurations,
    refetchGetTaskStatus,
  ];
};

export default useTaskCount;
