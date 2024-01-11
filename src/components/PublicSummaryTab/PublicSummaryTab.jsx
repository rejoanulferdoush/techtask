import Chart from "react-google-charts";

const taskStatusData = [
  ["Task", "Project"],
  ["Completed", 11],
  ["In-Progress", 5],
  ["Overdue", 3],
  ["Not Started", 2],
];

const taskStatusOptions = {
  is3D: true,
  chartArea: { left: 150, top: 0, right: 150, bottom: 0 },
  legend: { alignment: "center" },
};

const individualTaskData = [
  ["Workload", "Completed", "In-Progress", "Overdue", "Not Started"],
  ["John Doe", 5, 2, 3, 4],
  ["John Samuel Doe", 4, 2, 5, 1],
  ["John Doe", 4, 0, 3, 0],
  ["John Doe", 8, 0, 0, 0],
  ["John Doe", 4, 8, 4, 1],
];

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

const taskData = [
  [
    "Tasks",
    "John Doe Cloud",
    "John Doe Network",
    "John Doe Cloud",
    "John Doe Cloud",
    "John Doe Cloud",
    "John Doe Cloud",
    "John Doe Cloud",
    "John Doe Cloud",
  ],
  [" ", 8, 2, 5, 10, 3, 4, 7, 3],
];

const taskDataOptions = {
  chart: {
    title: " ",
  },

  legend: { position: "right", alignment: "center" },
};

const PublicSummaryTab = () => {
  return (
    <div className=" flex flex-wrap items-center justify-center space-y-10">
      {
        //
        //     <div className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col border-2 border-l-0 border-sky-500 text-lg z-[99999] bg-white">
        //     <a
        //       href="#taskStatus"
        //       className="border-b-2 border-sky-500 py-1 px-2 transition-all hover:bg-sky-500 hover:text-white"
        //     >
        //       Tasks Status
        //     </a>
        //     <a
        //       href="#workload"
        //       className="border-b-2 border-sky-500 py-1 px-2 transition-all hover:bg-sky-500 hover:text-white"
        //     >
        //       Workload
        //     </a>
        //     <a
        //       href="#taskLength"
        //       className="py-1 px-2 transition-all hover:bg-sky-500 hover:text-white"
        //     >
        //       Task Length
        //     </a>
        //   </div>
        //
      }
      <div className="w-full" id="taskStatus">
        <h3 className="text-2xl text-center font-semibold uppercase mb-10">
          Tasks Status
        </h3>
        <Chart
          chartType="PieChart"
          data={taskStatusData}
          options={taskStatusOptions}
          width={"100%"}
          height={"400px"}
        />
      </div>
      <div className="w-1/2" id="workload">
        <h3 className="text-2xl text-center font-semibold uppercase">
          Workload
        </h3>
        <Chart
          chartType="BarChart"
          width="100%"
          height="500px"
          data={individualTaskData}
          options={individualTaskOptions}
        />
      </div>
      <div className="w-1/2" id="taskLength">
        <h3 className="text-2xl text-center font-semibold uppercase">
          Task Lengths
        </h3>
        <Chart
          chartType="Bar"
          width="100%"
          height="500px"
          data={taskData}
          options={taskDataOptions}
        />
      </div>
    </div>
  );
};

export default PublicSummaryTab;
