import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

const AddIssue = () => {
  const [uploadFiles, setUploadFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFileUpload = (e) => {
    setUploadFiles(e.target.files[0]);
  };

  const createTask = async (data) => {
    const title = data.title;
    const desc = data.desc;
    const complainedBy = "Jane Doe";
    const resolvedBy = "John Doe";
    const dateOfRequest = moment();
    const resolvedDate = null;
    const files = uploadFiles;
    const status = data.taskStatus;
    const taskData = {
      title,
      desc,
      complainedBy,
      resolvedBy,
      dateOfRequest,
      resolvedDate,
      files,
      status,
    };
    const res = await axios.post(
      "http://localhost:3000/api/issues/addIssue",
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
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Issue Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("title")}
              placeholder="Issue Title"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Issue Description
          </label>
          <div className="mt-2">
            <textarea
              {...register("desc")}
              placeholder="Issue Description"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            />
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
            />
          </div>
        </div>
        <div className="w-full text-start px-[15px] mt-5">
          <input
            type="submit"
            value="Add Issue"
            className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150  hover:bg-sky-500 hover:text-white"
          />
        </div>
      </div>
    </form>
  );
};

export default AddIssue;
