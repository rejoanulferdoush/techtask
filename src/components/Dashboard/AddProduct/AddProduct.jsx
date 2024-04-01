import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import useUsers from "../../../hooks/useUsers";

const AddProduct = ({ setLoading, closeModal }) => {
  const [uploadFiles, setUploadFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFileUpload = (e) => {
    setUploadFiles(e.target.files);
  };

  const createProduct = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("createdBy", 1);

    // Append each file to formData
    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append(`files`, uploadFiles[i]);
    }

    formData.append("status", data.productStatus);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://techops.sohochor.com/api/products/addProduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Task Added!",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
        setLoading(false);
        closeModal();
      }
    } catch (error) {
      console.error("Error uploading task:", error);
    }
  };

  return (
    <form className="pt-5" onSubmit={handleSubmit(createProduct)}>
      <div className="relative flex flex-wrap items-center -mx-[15px] px-15 space-y-5">
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Product Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("title")}
              placeholder="Product Title"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Product Description
          </label>
          <div className="mt-2">
            <textarea
              {...register("desc")}
              placeholder="Product Description"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Product Status
          </label>
          <div className="mt-2">
            <select
              {...register("productStatus")}
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Upload File
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
            value="Add Product"
            className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white block w-full"
          />
        </div>
      </div>
    </form>
  );
};

export default AddProduct;
