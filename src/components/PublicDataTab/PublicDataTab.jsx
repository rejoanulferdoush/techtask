import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

const PublicDataTab = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  return (
    <div>
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
            <tr className="border-b-2 border-sky-500">
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                John Doe Cloud
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                Cloud
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                John Doe
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                Jane Doe
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                10 Jan, 24
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                15 Jan, 24
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                14 Jan, 24
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm bg-green-500 px-2 py-1 rounded-md text-white">
                  Completed
                </span>
              </td>
            </tr>
            <tr className="border-b-2 border-sky-500">
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                John Doe Network Management
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                Network
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                John Doe
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                Jane Doe
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                10 Jan, 24
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                15 Jan, 24
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                14 Jan, 24
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm bg-amber-500 px-2 py-1 rounded-md text-black">
                  In-Progress
                </span>
              </td>
            </tr>
            <tr className="border-b-2 border-sky-500">
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                John Doe Cloud
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                Cloud
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                John Doe
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                Jane Doe
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                10 Jan, 24
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                15 Jan, 24
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                14 Jan, 24
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm bg-slate-400 px-2 py-1 rounded-md text-black">
                  Not Started
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                John Doe Cloud
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                Cloud
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                John Doe
              </td>
              <td className="px-4 py-3 text-left border-sky-500 border-r-2">
                Jane Doe
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                10 Jan, 24
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                15 Jan, 24
              </td>
              <td className="px-4 py-3 text-center border-sky-500 border-r-2">
                14 Jan, 24
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm bg-red-500 px-2 py-1 rounded-md text-white">
                  Overdue
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublicDataTab;
