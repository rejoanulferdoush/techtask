import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";
import useIssues from "../../../hooks/useIssues";

const IssuesData = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const [issues] = useIssues();

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  return (
    <div>
      <div className="relative flex items-center justify-center -mx-[15px] mb-8 px-15 py-4 border-2 border-sky-500 rounded-md shadow-lg before:content-['Filter_Table'] before:text-black before:absolute before:left-2 before:-top-2.5 before:bg-white before:text-xs before:px-1 before:rounded before:border-sky-500 before:border-2">
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Issue Title
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
            Complained By
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="projectName"
              placeholder="Complainer"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Resolved By
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="projectName"
              placeholder="Resolved By"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            />
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
              <option>Not Resolved</option>
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
                Issue Title
              </th>
              <th className="px-4 py-3 text-left border-sky-500 border-r-2">
                Complained By
              </th>
              <th className="px-4 py-3 text-left border-sky-500 border-r-2">
                Date Of Request
              </th>
              <th className="px-4 py-3 text-left border-sky-500 border-r-2">
                Resolved By
              </th>
              <th className="px-4 py-3 text-center border-sky-500 border-r-2">
                Resolved Date
              </th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr className="border-b-2 border-sky-500">
                <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                  {issue.title}
                </td>
                <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                  {issue.complainedBy}
                </td>
                <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                  {moment(issue.dateOfRequest).format("DD MMM, YY")}
                </td>
                <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                  {issue.resolvedBy}
                </td>
                <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                  {issue.resolvedDate
                    ? moment(issue.resolvedDate).format("DD MMM, YY")
                    : "---"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm bg-green-500 px-2 py-1 rounded-md text-white">
                    {issue.status}
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

export default IssuesData;
