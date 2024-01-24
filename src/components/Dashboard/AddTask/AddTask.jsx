import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

const AddTask = () => {
  const [taskStartDate, setTaskStartDate] = useState({
    startDate: null,
  });
  const [taskDueDate, setTaskDueDate] = useState({
    startDate: null,
  });
  const [uploadFiles, setUploadFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleStartDateChange = (newStartDate) => {
    console.log("newStartDate:", newStartDate);
    setTaskStartDate(newStartDate);
  };
  const handleDueDateChange = (newDueDate) => {
    console.log("newDueDate:", newDueDate);
    setTaskDueDate(newDueDate);
  };

  const handleFileUpload = (e) => {
    setUploadFiles(e.target.files[0]);
  };

  const createTask = async (data) => {
    const title = data.title;
    const desc = data.desc;
    const assignedAgainst = data.assignedAgainst;
    const assignedBy = "Admin";
    const assignedTo = data.assignedTo;
    const startDate = taskStartDate.startDate;
    const dueDate = taskDueDate.startDate;
    const endDate = taskDueDate.startDate;
    const files = uploadFiles;
    const status = data.taskStatus;
    const taskData = {
      title,
      desc,
      assignedAgainst,
      assignedBy,
      assignedTo,
      startDate,
      dueDate,
      endDate,
      files,
      status,
    };
    const res = await axios.post(
      "https://techops.sohochor.com/api/tasks/addTask",
      taskData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res.status);
    reset();
  };

  return (
    <form className="pt-10" onSubmit={handleSubmit(createTask)}>
      <div className="relative flex flex-wrap items-center -mx-[15px] mb-8 px-15 py-4 space-y-5">
        <div className="w-1/3 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("title")}
              placeholder="Task Name"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="w-1/3 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Assigned To
          </label>
          <div className="mt-2">
            <select
              {...register("assignedTo")}
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            >
              <option>John Doe</option>
              <option>Jane Doe</option>
              <option>Jonathan Doe</option>
            </select>
          </div>
        </div>
        <div className="w-1/3 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Against
          </label>
          <div className="mt-2">
            <select
              {...register("assignedAgainst")}
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            >
              <option>Cloud</option>
              <option>Network</option>
              <option>Administration</option>
            </select>
          </div>
        </div>
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Description
          </label>
          <div className="mt-2">
            <textarea
              {...register("desc")}
              placeholder="Task Description"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="w-1/3 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Starting Date
          </label>
          <div className="mt-2 date-range">
            <Datepicker
              useRange={false}
              asSingle={true}
              value={taskStartDate}
              onChange={handleStartDateChange}
            />
          </div>
        </div>
        <div className="w-1/3 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Due Date
          </label>
          <div className="mt-2 date-range">
            <Datepicker
              useRange={false}
              asSingle={true}
              value={taskDueDate}
              onChange={handleDueDateChange}
            />
          </div>
        </div>
        <div className="w-1/3 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Status
          </label>
          <div className="mt-2">
            <select
              {...register("taskStatus")}
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            >
              <option>Completed</option>
              <option>In-Progress</option>
              <option>Not Started</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>
        <div className="w-1/3 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Upload Fie
          </label>
          <div className="mt-2 date-range">
            <input
              {...register("files")}
              type="file"
              onChange={handleFileUpload}
            />
          </div>
        </div>
        <div className="w-full text-start px-[15px] mt-5">
          <input
            type="submit"
            value="Add Task"
            className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150  hover:bg-sky-500 hover:text-white"
          />
        </div>
      </div>
    </form>
  );
};

export default AddTask;
