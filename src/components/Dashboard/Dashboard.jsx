import { useState } from "react";
import HeaderNavTabs from "./HeaderNavTabs/HeaderNavTabs";
import AddTask from "./AddTask/AddTask";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [addTask, setAddTask] = useState(true);
  return (
    <div className="max-w-screen-xl mx-auto px-[15px]">
      <div className="py-10 flex flex-wrap justify-between -mx-[15px] items-center mb-10 ">
        <h1 className="text-4xl text-center font-semibold uppercase logo-font">
          Tech Ops Task Tracker
        </h1>
        <HeaderNavTabs
          addTask={addTask}
          setAddTask={setAddTask}
        ></HeaderNavTabs>
      </div>
      <Outlet></Outlet>
    </div>
  );
};

export default Dashboard;
