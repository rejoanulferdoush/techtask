import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import useUsers from "../../../hooks/useUsers";
import { TiTimes } from "react-icons/ti";

const UpdateProduct = ({
  setLoading,
  closeModal,
  product,
  uploadedFiles,
  getFileName,
}) => {
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

  const updateProduct = async (data) => {
    setLoading(true);
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
      const res = await axios.put(
        `https://techops.sohochor.com/api/products/updateProduct/${product.id}`,
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
          title: "Product Added!",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
        setLoading(false);
        closeModal();
      }
    } catch (error) {
      console.error("Error uploading product:", error);
    }
  };

  const handleRemoveFile = async (file, id, parentID) => {
    const selectedFile = file;

    try {
      setLoading(true);
      const res = await axios.put(
        `https://techops.sohochor.com/api/products/deleteFile/${id}`,
        { selectedFile } // Pass selectedFile in the request body
      );

      document.getElementById(parentID).remove();

      if (res.status === 200) setLoading(false);
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };

  return (
    <form className="pt-5" onSubmit={handleSubmit(updateProduct)}>
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
              defaultValue={product.title}
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
              defaultValue={product.desc}
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
              defaultValue={product.status}
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
            Uploaded Files{}
          </label>
          {uploadedFiles.images !== null && uploadedFiles.images.length > 0 && (
            <div className="w-full mb-6">
              <h3 className="text-lg uppercase mb-3 text-center">Images: </h3>
              <div>
                <div className="flex flex-wrap space-x-3 items-center justify-center">
                  {uploadedFiles.images.map((img, index) => (
                    <div
                      className="w-1/6 flex items-stretch justify-center shadow-md p-2 bg-slate-50 rounded-md relative"
                      key={index}
                      id={`img-${index}-${product.id}`}
                    >
                      <button
                        type="button"
                        className="absolute right-4 top-4 bg-rose-400 text-white block shadow-lg rounded-sm"
                        onClick={() =>
                          handleRemoveFile(
                            img,
                            product.id,
                            `img-${index}-${product.id}`
                          )
                        }
                      >
                        <TiTimes />
                      </button>
                      <img
                        src={`${import.meta.env.VITE_BASEURL}${img}`}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {uploadedFiles.files !== null && uploadedFiles.files.length > 0 && (
            <div className="w-full mb-4">
              <h3 className="text-lg uppercase mb-3 text-center">Files: </h3>
              <ul className="list-disc">
                {uploadedFiles.files.map((file, index) => (
                  <li
                    key={index}
                    className="pr-4 relative mb-1"
                    id={`file-${index}-${product.id}`}
                  >
                    {getFileName(file)}
                    <button
                      type="button"
                      className="absolute right-0 top-0 bg-rose-400 text-white block shadow-lg rounded-sm"
                      onClick={() =>
                        handleRemoveFile(
                          file,
                          product.id,
                          `file-${index}-${product.id}`
                        )
                      }
                    >
                      <TiTimes />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
            value="Update Product"
            className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white block w-full"
          />
        </div>
      </div>
    </form>
  );
};

export default UpdateProduct;
