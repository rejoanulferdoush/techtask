import Chart from "react-google-charts";

const data = [
  ["Task", "Project"],
  ["Completed", 11],
  ["In-Progress", 5],
  ["Overdue", 3],
  ["Not Started", 2],
];

const options = {
  is3D: true,
  chartArea: { left: 200, top: 20, right: 0, bottom: 0 },
};

const PublicSummaryTab = () => {
  return (
    <div className=" flex items-center justify-center">
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"500px"}
      />
    </div>
  );
};

export default PublicSummaryTab;
