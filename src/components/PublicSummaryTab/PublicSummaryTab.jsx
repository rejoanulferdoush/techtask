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

  chartArea: { left: 0, top: 50, right: 0, bottom: 0 },
  legend: { position: "top" },
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
  legend: { position: "top" },
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
    " ",
    "John Doe Cloud",
    "John Doe Network Management",
    "John Doe Cloud",
    "John Doe Cloud",
    "John Doe Cloud",
  ],
  [" ", 8, 2, 5, 10, 3],
];

const taskDataOptions = {
  chart: {
    title: " ",
  },
};

const PublicSummaryTab = () => {
  return (
    <div className=" flex flex-wrap items-center justify-center space-3">
      <div className="w-full mb-4">
        <h3 className="text-2xl text-center font-semibold uppercase">
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
      <div className="w-1/2">
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
      <div className="w-1/2">
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
