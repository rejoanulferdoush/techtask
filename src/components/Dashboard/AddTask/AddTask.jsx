import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import useUsers from "../../../hooks/useUsers";
import useProduct from "../../../hooks/useProduct";
import useAuth from "../../../hooks/useAuth";

const AddTask = ({ refetch, setLoading, closeModal, userID }) => {
  const { user } = useAuth();

  const [taskStartDate, setTaskStartDate] = useState({
    startDate: null,
  });
  const [taskDueDate, setTaskDueDate] = useState({
    startDate: null,
  });
  const [uploadFiles, setUploadFiles] = useState([]);
  // const [getStatus, setGetStatus] = useState("");
  const [users] = useUsers();
  const [products] = useProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // function getTaskStatus(startday, dueday, completed = 0) {
  //   const today = new Date();
  //   const oneDayMilliseconds = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  //   startday.setHours(0, 0, 0, 0);
  //   dueday.setHours(0, 0, 0, 0);
  //   today.setHours(0, 0, 0, 0);

  //   const differenceInMilliseconds = dueday.getTime() - startday.getTime();
  //   const differenceInMillisecondsForStartDay =
  //     startday.getTime() - today.getTime();

  //   const differenceInDays = Math.floor(
  //     differenceInMilliseconds / oneDayMilliseconds
  //   );
  //   const differenceInDaysForStartDay = Math.floor(
  //     differenceInMillisecondsForStartDay / oneDayMilliseconds
  //   );

  //   if (
  //     differenceInDays < 0 &&
  //     differenceInDaysForStartDay <= 0 &&
  //     completed === 0
  //   )
  //     setGetStatus("overdue");
  //   if (
  //     differenceInDays > 0 &&
  //     differenceInDaysForStartDay <= 0 &&
  //     completed === 0
  //   )
  //     setGetStatus("in_progress");
  //   if (
  //     differenceInDaysForStartDay > 0 &&
  //     differenceInDays > 0 &&
  //     completed === 0
  //   )
  //     setGetStatus("not_started");
  //   if (completed === 1) setGetStatus("completed");
  // }
  const handleStartDateChange = (newStartDate) => {
    setTaskStartDate(newStartDate);
    // getTaskStatus(
    //   new Date(newStartDate.startDate),
    //   new Date(taskDueDate.startDate)
    // );
  };

  const handleDueDateChange = (newDueDate) => {
    setTaskDueDate(newDueDate);

    // getTaskStatus(
    //   new Date(taskStartDate.startDate),
    //   new Date(newDueDate.startDate)
    // );
  };

  const handleFileUpload = (e) => {
    setUploadFiles(e.target.files);
  };

  const createTask = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("assignedAgainst", data.assignedAgainst);
    formData.append("createdBy", userID);
    formData.append("assignedBy", userID);
    formData.append("assignedTo", parseInt(data.assignedTo));
    formData.append("startDate", taskStartDate.startDate);
    formData.append("dueDate", taskDueDate.startDate);
    formData.append("endDate", null);

    // Append each file to formData
    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append(`files`, uploadFiles[i]);
    }

    formData.append("status", data.status);

    try {
      const res = await axios.post(
        "https://techops.sohochor.com/api/tasks/addTask",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        const userEmail = user.email;
        const historyData = `${userEmail} created ${data.title}`;
        const history = { userEmail, historyData };
        const hisRes = axios.post(
          "https://techops.sohochor.com/api/histories/addHistory",
          history
        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Task Added!",
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
        reset();
        closeModal();
      }
    } catch (error) {
      console.error("Error uploading task:", error);
    }
  };

  return (
    <form className="pt-5" onSubmit={handleSubmit(createTask)}>
      <div className="relative flex flex-wrap items-center -mx-[15px] px-15 space-y-5">
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("title")}
              placeholder="Task Name"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="w-1/2 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Assigned To
          </label>
          <div className="mt-2">
            <select
              {...register("assignedTo")}
              className="block w-full rounded-md border-0 px-3 py-2 capitalize text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            >
              {users.map(
                (user) =>
                  user.role !== "super_admin" &&
                  user.role !== "normal_user" && (
                    <option value={user.id} key={user.id}>
                      {user.username}
                    </option>
                  )
              )}
            </select>
          </div>
        </div>
        <div className="w-1/2 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Against
          </label>
          <div className="mt-2">
            <select
              {...register("assignedAgainst")}
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-1/2 px-[15px]">
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
        <div className="w-1/2 px-[15px]">
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
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Description
          </label>
          <div className="mt-2">
            <textarea
              {...register("desc")}
              placeholder="Task Description"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Status
          </label>
          <div className="mt-2">
            <select
              {...register("status")}
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Upload Fie
          </label>
          <div className="mt-2 date-range">
            <input
              {...register("files")}
              type="file"
              onChange={handleFileUpload}
              multiple="multiple"
            />
          </div>
        </div>
        <div className="w-full text-start px-[15px] mt-5">
          <input
            type="submit"
            value="Add Task"
            className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white block w-full"
          />
        </div>
      </div>
    </form>
  );
};

export default AddTask;
