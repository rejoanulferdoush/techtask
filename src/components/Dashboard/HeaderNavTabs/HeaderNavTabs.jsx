import { NavLink } from "react-router-dom";
import AddTask from "../AddTask/AddTask";

const HeaderNavTabs = ({ addTask, setAddTask }) => {
  const handleAddTask = () => {
    setAddTask(true);
  };

  return (
    <div>
      <ul className="flex justify-center items-center space-x-3">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive, isPending }) =>
              [
                isActive
                  ? "text-xl uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 bg-sky-500 text-white"
                  : "text-xl uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 hover:bg-sky-500 hover:text-white",
              ].join(" ")
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/addTask"
            className={({ isActive, isPending }) =>
              [
                isActive
                  ? "text-xl uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 bg-sky-500 text-white"
                  : "text-xl uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 hover:bg-sky-500 hover:text-white",
              ].join(" ")
            }
          >
            Add Task
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/addIssue"
            className={({ isActive, isPending }) =>
              [
                isActive
                  ? "text-xl uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 bg-sky-500 text-white"
                  : "text-xl uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 hover:bg-sky-500 hover:text-white",
              ].join(" ")
            }
          >
            Add Issue
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default HeaderNavTabs;
