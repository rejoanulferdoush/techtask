import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import {
  MdOutlineSentimentSatisfied,
  MdOutlineSentimentDissatisfied,
  MdOutlineSentimentNeutral,
} from "react-icons/md";
import useTask from "../../hooks/useTasks";
import moment from "moment";

const PublicDataTab = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const [tasks] = useTask();

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  const [todayCount, setTodayCount] = useState(true);
  const [yesterdayCount, setYesterdayCount] = useState(false);
  const [weeklyCount, setWeeklyCount] = useState(false);
  const [monthlyCount, setMonthlyCount] = useState(false);

  console.log(tasks);

  return (
    <div>
      <div className="relative flex items-center justify-center -mx-[15px] mb-8 px-15 pt-14 pb-5 border-2 border-sky-500 rounded-md shadow-lg before:content-['Troubleshooting_Count'] before:text-black before:absolute before:left-2 before:-top-2.5 before:bg-white before:text-xs before:px-1 before:rounded before:border-sky-500 before:border-2">
        <ul className="flex justify-center items-center space-x-3 absolute left-1/2 -top-6 -translate-x-1/2 z-10">
          <li
            className={`text-lg text-nowrap uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 ${
              todayCount
                ? "bg-sky-500 text-white"
                : "hover:bg-sky-500 hover:text-white bg-white"
            }`}
            onClick={() => {
              (todayCount === false) & setTodayCount(true);
            }}
          >
            Today's Count
          </li>
          <li
            className={`text-lg text-nowrap uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 ${
              yesterdayCount
                ? "bg-sky-500 text-white"
                : "hover:bg-sky-500 hover:text-white bg-white"
            }`}
            onClick={() => {
              (yesterdayCount === false) & setYesterdayCount(true);
            }}
          >
            Yesterday's Count
          </li>
          <li
            className={`text-lg text-nowrap uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 ${
              weeklyCount
                ? "bg-sky-500 text-white"
                : "hover:bg-sky-500 hover:text-white bg-white"
            }`}
            onClick={() => {
              (weeklyCount === false) & setWeeklyCount(true);
            }}
          >
            Weekly Count
          </li>
          <li
            className={`text-lg text-nowrap uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 ${
              monthlyCount
                ? "bg-sky-500 text-white"
                : "hover:bg-sky-500 hover:text-white bg-white"
            }`}
            onClick={() => {
              (monthlyCount === false) & setMonthlyCount(true);
            }}
          >
            Monthly Count
          </li>
        </ul>
        <div className="w-1/3 px-[15px]">
          <div className="shadow-lg rounded-lg p-8 bg-lime-400 relative z-auto transition-all hover:scale-105">
            <MdOutlineSentimentSatisfied className="absolute left-3 text-[10rem] top-1/2 -translate-y-1/2 text-[rgba(0,0,0,.3)]" />
            <h3 className="absolute right-5 top-3 uppercase text-lg font-bold text-shadow-inner text-[rgba(0,0,0,.5)]">
              Resolved Issues
            </h3>
            <div className="text-[5rem] text-right z-1">110</div>
          </div>
        </div>
        <div className="w-1/3 px-[15px]">
          <div className="shadow-lg rounded-lg p-8 bg-rose-500 relative z-auto transition-all hover:scale-105">
            <MdOutlineSentimentDissatisfied className="absolute left-3 text-[10rem] top-1/2 -translate-y-1/2 text-[rgba(0,0,0,.3)]" />
            <h3 className="absolute right-5 top-3 uppercase text-lg font-bold text-shadow-inner text-[rgba(0,0,0,.5)]">
              Pending Issues
            </h3>
            <div className="text-[5rem] text-right z-1">110</div>
          </div>
        </div>
        <div className="w-1/3 px-[15px]">
          <div className="shadow-lg rounded-lg p-8 bg-amber-200 relative z-auto transition-all hover:scale-105">
            <MdOutlineSentimentNeutral className="absolute left-3 text-[10rem] top-1/2 -translate-y-1/2 text-[rgba(0,0,0,.3)]" />
            <h3 className="absolute right-5 top-3 uppercase text-lg font-bold text-shadow-inner text-[rgba(0,0,0,.5)]">
              In-Progress
            </h3>
            <div className="text-[5rem] text-right z-1">110</div>
          </div>
        </div>
      </div>
      <div className="relative flex items-center justify-center -mx-[15px] mb-8 px-15 py-4 border-2 border-sky-500 rounded-md shadow-lg before:content-['Filter_Table'] before:text-black before:absolute before:left-2 before:-top-2.5 before:bg-white before:text-xs before:px-1 before:rounded before:border-sky-500 before:border-2">
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="projectName"
              placeholder="Project Name"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Assigned By
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="projectName"
              placeholder="Assigned By"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Against
          </label>
          <div className="mt-2">
            <select
              name="Task Against"
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            >
              <option>Cloud</option>
              <option>Network</option>
              <option>Administration</option>
            </select>
          </div>
        </div>
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Status
          </label>
          <div className="mt-2">
            <select
              name="Task Against"
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            >
              <option>Completed</option>
              <option>In-Progress</option>
              <option>Overdue</option>
              <option>Not Started</option>
            </select>
          </div>
        </div>
        <div className="w-2/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Date Range
          </label>
          <div className="mt-2 date-range">
            <Datepicker
              primaryColor={"sky"}
              value={value}
              onChange={handleValueChange}
            />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto block w-full shadow-sm">
        <table className="table-fixed w-[1200px]">
          <thead>
            <tr className="border-b-2 border-sky-500">
              <th className="px-4 py-3 text-left border-sky-500 border-r-2 w-56">
                Task Name
              </th>
              <th className="px-4 py-3 text-left border-sky-500 border-r-2">
                Task Against
              </th>
              <th className="px-4 py-3 text-left border-sky-500 border-r-2">
                Assigned By
              </th>
              <th className="px-4 py-3 text-left border-sky-500 border-r-2">
                Assigned To
              </th>
              <th className="px-4 py-3 text-center border-sky-500 border-r-2">
                Start Date
              </th>
              <th className="px-4 py-3 text-center border-sky-500 border-r-2">
                Due Date
              </th>
              <th className="px-4 py-3 text-center border-sky-500 border-r-2">
                End Date
              </th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr className="border-b-2 border-sky-500">
                <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                  {task.title}
                </td>
                <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                  {task.assignedAgainst}
                </td>
                <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                  {task.assignedBy}
                </td>
                <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                  {task.assignedTo}
                </td>
                <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                  {moment(task.startDate).format("DD MMM, YY")}
                </td>
                <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                  {moment(task.endDate).format("DD MMM, YY")}
                </td>
                <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                  {moment(task.dueDate).format("DD MMM, YY")}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm bg-green-500 px-2 py-1 rounded-md text-white">
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublicDataTab;
