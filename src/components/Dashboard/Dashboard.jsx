import { useState } from "react";
import HeaderNavTabs from "./HeaderNavTabs/HeaderNavTabs";
import AddTask from "./AddTask/AddTask";
import { Outlet } from "react-router-dom";
import app from "./../../firebase/firebase.config.js";

const Dashboard = () => {
  const [addTask, setAddTask] = useState(true);
  console.log(app);
  return (
    <div className="w-full">
      <div className="shadow-md w-full py-5 mb-16">
        <div className="max-w-screen-xl mx-auto px-[15px]">
          <div className=" flex flex-wrap justify-between -mx-[15px] items-center ">
            <h1 className="text-4xl text-center font-semibold uppercase logo-font">
              Tech Ops Task Tracker
            </h1>
            <HeaderNavTabs
              addTask={addTask}
              setAddTask={setAddTask}
            ></HeaderNavTabs>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-[15px] pb-10 pt-5">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Dashboard;
