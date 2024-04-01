import Chart from "react-google-charts";
import useTaskCount from "../../hooks/useTaskCount";
import {
  MdOutlineSentimentSatisfied,
  MdOutlineSentimentDissatisfied,
  MdOutlineSentimentNeutral,
} from "react-icons/md";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import useIssueCount from "../../hooks/useIssueCount";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);
const taskStatusOptions = {
  is3D: true,
  chartArea: { left: 150, top: 0, right: 150, bottom: 0 },
  legend: { alignment: "center" },
};

const individualTaskOptions = {
  title: " ",
  chartArea: { width: "70%" },
  isStacked: true,
  legend: { position: "top", alignment: "center" },
  hAxis: {
    title: " ",
    minValue: 0,
  },
  vAxis: {
    title: " ",
  },
};

const taskDataOptions = {
  chart: {
    title: " ",
  },

  legend: { position: "right", alignment: "center" },
};

const PublicSummaryTab = () => {
  const [dataTime, setDataTime] = useState("today");

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "..."; // Truncate and add ellipsis
    }
    return str; // If the string is already within the limit, return as is
  }
  const [
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
    refetchgetTaskDurations,
    refetchGetTaskStatus,
  ] = useTaskCount();
  const taskStatusData = [
    ["Task", "Project"],
    ["Completed", completedTaskStatusCount],
    ["In-Progress", inProgressTaskStatusCount],
    ["Overdue", overdueTaskStatusCount],
    ["Not Started", notStartedTaskStatusCount],
  ];

  let data = [];

  if (assignToTaskStatusCount.length > 0) {
    assignToTaskStatusCount.map((task) => {
      const taskCounts = JSON.parse(task.taskCount);
      data = [
        ...data,
        [
          task.username,
          taskCounts.completed,
          taskCounts.in_progress,
          taskCounts.not_started,
          taskCounts.overdue,
        ],
      ];
    });
  }
  let taskData = [];
  let taskName = ["Tasks"];
  let taskDuration = [" "];
  const [uid, setUid] = useState([]);
  const [
    pendingIssueCount,
    resolvedIssueCount,
    inProgressIssueCount,
    refetchResolved,
    refetchPending,
    refetchInProgress,
  ] = useIssueCount(dataTime);

  useEffect(() => {
    const getUID = async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/users/getUserWithID`
      );
      setUid(response.data);
    };
    getUID();
  }, [getTaskStatus]);

  //Function to process task name and status datas
  const processData = (data) => {
    const assignmentMap = new Map();
    if (data) {
      data.map((item) => {
        const { assignedTo, status } = item;

        if (!assignmentMap.has(assignedTo)) {
          assignmentMap.set(assignedTo, {
            assignedTo,
            completed: 0,
            in_progress: 0,
            not_started: 0,
            overdue: 0,
          });
        }

        const existingEntry = assignmentMap.get(assignedTo);
        existingEntry[status] += 1;

        return null; // Map function expects a return value
      });
    }

    const result = Array.from(assignmentMap.values());
    return result;
  };
  const processedTask = processData(getTaskStatus);

  if (getTaskDurations.length > 0) {
    getTaskDurations.map((task) => {
      taskName = [...taskName, task.title];
      taskDuration = [...taskDuration, task.days];
    });
    taskData = [[taskName][0], [taskDuration][0]];
  }

  let individualTaskData = [
    ["Workload", "Completed", "In-Progress", "Overdue", "Not Started"],
  ];
  data.map((d) => (individualTaskData = [...individualTaskData, d]));

  console.log(individualTaskData);

  const pieData = {
    labels: ["Completed", "In-Progress", "Overdue", "Not Started"],
    datasets: [
      {
        label: "Tasks:",
        data: [
          completedTaskStatusCount,
          inProgressTaskStatusCount,
          overdueTaskStatusCount,
          notStartedTaskStatusCount,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false, // Set this to false to allow manual control of dimensions
    responsive: true, // Set this to true for the chart to resize with the container
  };

  const barOptions = {
    responsive: true,

    scales: {
      x: {
        // ticks:{
        //     display: false
        // }
        display: false,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: false,
      },
    },
  };

  const bgColors = [
    "rgba(255, 99, 132, 0.5)",
    "rgba(255, 159, 64, 0.5)",
    "rgba(255, 205, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(201, 203, 207, 0.5)",
  ];
  const borderColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(255, 205, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(201, 203, 207, 1)",
  ];

  let barDataSet = [];
  let barDataLabel = [];
  getTaskDurations &&
    getTaskDurations.map((task, index) => {
      barDataLabel = [...barDataLabel, truncateString(task.title, 10)];
      barDataSet = [
        ...barDataSet,
        {
          label: task.title,
          data: [task.days],
          backgroundColor: bgColors[index % bgColors.length],
          borderColor: borderColors[index % borderColors.length],
          borderWidth: 1,
        },
      ];
    });
  const barData = {
    labels: barDataLabel,
    datasets: barDataSet,
  };

  let taskLabels = [];
  let taskCompletedCount = [];
  let taskOverdueCount = [];
  let taskNotStartedCount = [];
  let taskInProgressCount = [];
  processedTask.map((task) => {
    taskLabels = [...taskLabels, uid[task.assignedTo]];
    taskCompletedCount = [...taskCompletedCount, task.completed];
    taskOverdueCount = [...taskOverdueCount, task.overdue];
    taskNotStartedCount = [...taskNotStartedCount, task.not_started];
    taskInProgressCount = [...taskInProgressCount, task.in_progress];
  });

  const stackedBarDataSet = [
    {
      label: "Completed",
      data: taskCompletedCount,
      backgroundColor: "rgba(34, 197, 94, 0.5)",
    },
    {
      label: "In Progress",
      data: taskInProgressCount,
      backgroundColor: "rgba(255, 205, 86, 1)",
    },
    {
      label: "Overdue",
      data: taskOverdueCount,
      backgroundColor: "rgba(255, 99, 132, 1)",
    },
    {
      label: "Not Started",
      data: taskNotStartedCount,
      backgroundColor: "rgba(201, 203, 207, 1)",
    },
  ];

  const stackedOptions = {
    plugins: {
      title: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const stackedBarData = { labels: taskLabels, datasets: stackedBarDataSet };
  console.log("bardata", barData);

  return (
    <div>
      <div className="relative flex items-center justify-center -mx-[15px] mb-8 px-15 pt-14 pb-5 border-2 border-green-500 rounded-md shadow-lg before:content-['Troubleshooting_Count'] before:text-black before:absolute before:left-2 before:-top-2.5 before:bg-white before:text-xs before:px-1 before:rounded before:border-green-500 before:border-2">
        <ul className="flex justify-center items-center space-x-3 absolute left-1/2 -top-6 -translate-x-1/2 z-10">
          <li
            className={`text-lg text-nowrap uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150 ${
              dataTime === "today"
                ? "bg-green-500 text-white"
                : "hover:bg-green-500 hover:text-white bg-white"
            }`}
            onClick={() => {
              setDataTime("today");
            }}
          >
            Today's Count
          </li>
          <li
            className={`text-lg text-nowrap uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150 ${
              dataTime === "yesterday"
                ? "bg-green-500 text-white"
                : "hover:bg-green-500 hover:text-white bg-white"
            }`}
            onClick={() => {
              setDataTime("yesterday");
            }}
          >
            Yesterday's Count
          </li>
          <li
            className={`text-lg text-nowrap uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150 ${
              dataTime === "weekly"
                ? "bg-green-500 text-white"
                : "hover:bg-green-500 hover:text-white bg-white"
            }`}
            onClick={() => {
              setDataTime("weekly");
            }}
          >
            Weekly Count
          </li>
          <li
            className={`text-lg text-nowrap uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150 ${
              dataTime === "monthly"
                ? "bg-green-500 text-white"
                : "hover:bg-green-500 hover:text-white bg-white"
            }`}
            onClick={() => {
              setDataTime("monthly");
            }}
          >
            Monthly Count
          </li>
        </ul>
        <div className="w-1/3 px-[15px]">
          <div className="shadow-lg rounded-lg p-8 bg-lime-200 relative z-auto transition-all hover:scale-105">
            <MdOutlineSentimentSatisfied className="absolute left-3 text-[10rem] top-1/2 -translate-y-1/2 text-[rgba(0,0,0,.3)]" />
            <h3 className="absolute right-5 top-3 uppercase text-lg font-bold text-shadow-inner text-[rgba(0,0,0,.5)]">
              Resolved Issues
            </h3>
            <div className="text-[5rem] text-right z-1">
              {resolvedIssueCount}
            </div>
          </div>
        </div>
        <div className="w-1/3 px-[15px]">
          <div className="shadow-lg rounded-lg p-8 bg-rose-200 relative z-auto transition-all hover:scale-105">
            <MdOutlineSentimentDissatisfied className="absolute left-3 text-[10rem] top-1/2 -translate-y-1/2 text-[rgba(0,0,0,.3)]" />
            <h3 className="absolute right-5 top-3 uppercase text-lg font-bold text-shadow-inner text-[rgba(0,0,0,.5)]">
              Pending Issues
            </h3>
            <div className="text-[5rem] text-right z-1">
              {pendingIssueCount}
            </div>
          </div>
        </div>
        <div className="w-1/3 px-[15px]">
          <div className="shadow-lg rounded-lg p-8 bg-amber-200 relative z-auto transition-all hover:scale-105">
            <MdOutlineSentimentNeutral className="absolute left-3 text-[10rem] top-1/2 -translate-y-1/2 text-[rgba(0,0,0,.3)]" />
            <h3 className="absolute right-5 top-3 uppercase text-lg font-bold text-shadow-inner text-[rgba(0,0,0,.5)]">
              In-Progress
            </h3>
            <div className="text-[5rem] text-right z-1">
              {inProgressIssueCount}
            </div>
          </div>
        </div>
      </div>
      <div className=" flex items-stretch justify-start -mx-[15px] ">
        <div className="w-1/2 px-[15px]" id="taskLength">
          <div className="border-2 border-green-200 rounded-md shadow-lg p-4 flex flex-col h-full">
            <h3 className="text-2xl text-center font-semibold uppercase">
              User Task Count
            </h3>

            <Bar
              options={stackedOptions}
              data={stackedBarData}
              height="370px"
            />
          </div>
        </div>
        <div className="w-1/2 flex flex-col px-[15px] space-y-5">
          <div className="w-full " id="taskStatus">
            <div className="border-2 border-green-200 rounded-md shadow-lg p-4 flex flex-col h-full items-center justify-center">
              <h3 className="text-2xl text-center font-semibold uppercase mb-10">
                Tasks Status
              </h3>
              <div className="w-full h-[300px]">
                <Pie data={pieData} options={pieOptions} height="250px" />
              </div>
            </div>
          </div>

          <div className="w-full " id="taskLength">
            <div className="border-2 border-green-200 rounded-md shadow-lg p-4 flex flex-col justify-center items-center">
              <h3 className="text-2xl text-center font-semibold uppercase">
                Task Lengths
              </h3>
              <Bar options={barOptions} data={barData} height="150px" />
            </div>
          </div>
        </div>
        {
          // <div className="w-1/2" id="workload">
          //   <h3 className="text-2xl text-center font-semibold uppercase">
          //     Workload
          //   </h3>
          //   <Chart
          //     chartType="BarChart"
          //     width="100%"
          //     height="500px"
          //     data={individualTaskData}
          //     options={individualTaskOptions}
          //   />
          // </div>
          // <div className="w-full" id="taskStatus">
          //   <h3 className="text-2xl text-center font-semibold uppercase mb-10">
          //     Tasks Status
          //   </h3>
          //   <Chart
          //     chartType="PieChart"
          //     data={taskStatusData}
          //     options={taskStatusOptions}
          //     width={"100%"}
          //     height={"400px"}
          //   />
          // </div>
          // <div className="w-1/2" id="taskLength">
          //   <h3 className="text-2xl text-center font-semibold uppercase">
          //     Task Lengths
          //   </h3>
          //   <Chart
          //     chartType="Bar"
          //     width="100%"
          //     height="500px"
          //     data={taskData}
          //     options={taskDataOptions}
          //   />
          // </div>
        }
      </div>
    </div>
  );
};

export default PublicSummaryTab;
