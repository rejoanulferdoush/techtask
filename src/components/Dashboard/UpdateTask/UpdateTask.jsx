import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import useUsers from "../../../hooks/useUsers";
import useProduct from "../../../hooks/useProduct";
import { TbTrashX } from "react-icons/tb";
import FileIcon from "../../Utils/FileIcon";
import UploadedFileIcon from "../../Utils/UploadedFileIcon";
import { Tooltip } from "react-tooltip";
import moment from "moment";
import useAuth from "../../../hooks/useAuth";
const UpdateTask = ({
  setLoading,
  closeModal,
  task,
  uploadedFiles,
  getFileName,
  createdBy,
  assignedBy,
}) => {
  const { user } = useAuth();

  const [taskStartDate, setTaskStartDate] = useState({
    startDate: task.startDate,
    endDate: task.startDate,
  });

  const [chosenFiles, setChosenFiles] = useState([]);
  const [showUploadFiles, setShowUploadFiles] = useState(false);

  const [taskDueDate, setTaskDueDate] = useState({
    startDate: task.dueDate,
    endDate: task.dueDate,
  });
  const today = new Date();

  const [uploadFiles, setUploadFiles] = useState([]);
  const [selectedUploadFiles, setSelectedUploadFiles] = useState([]);
  const [users] = useUsers();
  const [products] = useProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleStartDateChange = (newStartDate) => {
    setTaskStartDate(newStartDate);
  };

  const handleDueDateChange = (newDueDate) => {
    setTaskDueDate(newDueDate);
  };

  const handleFileUpload = (e) => {
    setUploadFiles(e.target.files);
    setSelectedUploadFiles(Array.from(e.target.files || []));
    console.log(typeof uploadFiles);
    console.log(typeof selectedUploadFiles);
    setShowUploadFiles(true);
  };

  const [uid, setUid] = useState([]);

  useEffect(() => {
    const getUID = async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/users/getUserWithID`
      );
      setUid(response.data);
    };
    getUID();
  }, [task]);

  const updateTask = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("assignedAgainst", data.assignedAgainst);
    formData.append("createdBy", createdBy);
    formData.append("assignedBy", assignedBy);
    formData.append("assignedTo", parseInt(data.assignedTo));
    formData.append("startDate", taskStartDate.startDate);
    formData.append("dueDate", taskDueDate.startDate);
    formData.append("completed", task.completed);

    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append(`files`, uploadFiles[i]);
    }

    formData.append("status", data.status);

    data.status === "completed"
      ? formData.append("endDate", moment())
      : formData.append("endDate", null);

    try {
      const res = await axios.put(
        `https://techops.sohochor.com/api/tasks/updateTask/${task.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        const userEmail = user.email;

        const changedFields = [];

        if (task.title !== data.title) {
          changedFields.push(
            `Title changed from "${task.title}" to "${data.title}"`
          );
        }

        if (task.desc !== data.desc) {
          changedFields.push(
            `Description changed from "${task.desc}" to "${data.desc}"`
          );
        }

        if (task.assignedAgainst !== data.assignedAgainst) {
          changedFields.push(
            `Assigned Against changed from "${uid[task.assignedAgainst]}" to "${
              uid[data.assignedAgainst]
            }"`
          );
        }

        if (task.assignedBy !== assignedBy) {
          changedFields.push(
            `Assigned By changed from "${uid[task.assignedBy]}" to "${
              uid[assignedBy]
            }"`
          );
        }

        if (task.assignedTo !== parseInt(data.assignedTo)) {
          changedFields.push(
            `Assigned To changed from "${uid[task.assignedTo]}" to "${
              uid[parseInt(data.assignedTo)]
            }"`
          );
        }

        if (task.startDate !== taskStartDate.startDate) {
          changedFields.push(
            `Start Date changed from "${moment(task.startDate).format(
              "DD MMM, YY"
            )}" to "${moment(taskStartDate.startDate).format("DD MMM, YY")}"`
          );
        }

        if (task.dueDate !== taskDueDate.startDate) {
          changedFields.push(
            `Due Date changed from "${moment(task.dueDate).format(
              "DD MMM, YY"
            )}" to "${moment(taskDueDate.startDate).format("DD MMM, YY")}"`
          );
        }

        if (task.status !== data.status) {
          changedFields.push(
            `Status changed from "${task.status}" to "${data.status}"`
          );
        }

        // Now changedFields array contains all the changes as strings
        console.log(changedFields);

        // You can then use this array to create history or perform other actions
        for (const change of changedFields) {
          const historyData = { userEmail: user.email, historyData: change };
          const historyResponse = await axios.post(
            "https://techops.sohochor.com/api/histories/addHistory",
            historyData
          );
          console.log(historyResponse.status);
        }

        if (chosenFiles && chosenFiles.length > 0) {
          handleRemoveFile(chosenFiles, task.id);
        }
        setChosenFiles([]);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Task Edited!",
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
        reset();
        closeModal();
      }
    } catch (error) {
      console.error("Error uploading task:", error.response);
    }
  };

  const handleRemoveFile = async (files, id) => {
    try {
      // Iterate through each file and send a request to delete it
      for (let i = 0; i < files.length; i++) {
        const selectedFile = files[i];
        const res = await axios.put(
          `https://techops.sohochor.com/api/tasks/deleteFile/${id}`,
          { selectedFile }
        );

        if (res.status === 200) {
          console.log(`File ${i + 1} deleted successfully`);
        }
      }
    } catch (error) {
      console.error("Error removing files:", error);
    }
  };

  const handleSelectedFiles = (file, parentID) => {
    // Assuming chosenFiles is your state variable
    setChosenFiles((prevFiles) => [...prevFiles, file]);
    document.getElementById(parentID).remove();
  };

  return (
    <form className="pt-5" onSubmit={handleSubmit(updateTask)}>
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
              defaultValue={task.title}
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
              defaultValue={task.assignedTo}
            >
              {users.map((user) => (
                <option value={user.id} key={user.id}>
                  {user.username}
                </option>
              ))}
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
              defaultValue={task.assignedAgainst}
            >
              {products.map(
                (product) =>
                  product.status === "active" && (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  )
              )}
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
              defaultValue={task.desc}
            ></textarea>
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
              defaultValue={task.status}
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
          <label className="block text-sm font-medium leading-6 text-gray-900 mb-3">
            Uploaded Files{}
          </label>
          {task.files !== null && task.files.length > 0 && (
            <div className="w-full mb-6">
              <h3 className="text-lg capitalize mb-3 text-left">Files: </h3>
              <div>
                <ul className="flex flex-wrap -mx-[15px]">
                  {JSON.parse(task.files).map((file, index) => (
                    <li
                      key={index}
                      className="w-1/2 px-[15px] mb-[15px]"
                      id={`file-${index}-${task.id}`}
                    >
                      <div className="p-2 relative mb-1 shadow-lg rounded-md flex items-center justify-between border-2 border-green-500">
                        <FileIcon file={file} fileName={getFileName}></FileIcon>
                        <button
                          type="button"
                          className=" text-red-500 text-2xl block"
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Remove File"
                          onClick={() =>
                            handleSelectedFiles(
                              file,
                              `file-${index}-${task.id}`
                            )
                          }
                        >
                          <TbTrashX />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Upload File
          </label>
          <div className="mt-2 date-range">
            <div className="border border-dashed border-green-500 relative rounded-lg">
              <input
                {...register("files")}
                type="file"
                onChange={handleFileUpload}
                multiple="multiple"
                className="cursor-pointer relative block opacity-0 w-full h-full p-10 z-50"
              />

              <div className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <h4>
                  Drop files anywhere to upload
                  <br />
                  or
                </h4>
                <p className="">Select Files</p>
              </div>
            </div>
          </div>
          {showUploadFiles && selectedUploadFiles.length > 0 && (
            <ul className="flex flex-wrap -mx-[15px] pt-10">
              {selectedUploadFiles.map((file, index) => (
                <li
                  key={index}
                  className="w-1/2 px-[15px] mb-[15px]"
                  id={`file-${index}-${task.id}`}
                >
                  <div className="p-2 relative mb-1 shadow-lg rounded-md flex items-center justify-between border-2 border-green-500">
                    <UploadedFileIcon fileName={file.name}></UploadedFileIcon>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-full text-start px-[15px] mt-5">
          <input
            type="submit"
            value="Update Task"
            className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white block w-full"
          />
        </div>
      </div>
    </form>
  );
};

export default UpdateTask;
