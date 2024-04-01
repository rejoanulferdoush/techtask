import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import Datepicker from "react-tailwindcss-datepicker";
import { TbEdit, TbChecklist, TbTrashX } from "react-icons/tb";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import moment from "moment";
import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
// import plugins if you need
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import Pagination from "../../Utils/Pagination";
import axios from "axios";
import Swal from "sweetalert2";
import AddProduct from "../AddProduct/AddProduct";
import StatusBadge from "../../Utils/StatusBadge";
import UpdateProduct from "../UpdateProduct/UpdateProduct";
const onInit = () => {
  console.log("lightGallery has been initialized");
};
const ProductAdmin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({
    files: null,
    images: null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const getAllProducts = await axios.get(
          `https://techops.sohochor.com/api/products/allProducts?page=${currentPage}&pageLimit=${pageLimit}`
        );
        setLoading(true);
        if (getAllProducts.status === 200) {
          setProducts(getAllProducts.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        // Handle the error if needed
      }
    };

    fetchAllProducts(); // Invoke the asynchronous function
  }, [
    currentPage,
    pageLimit,
    loading,
    isOpen,
    isAddModalOpen,
    isEditModalOpen,
  ]);

  function closeModal() {
    setIsOpen(false);
  }
  function closeAddModal() {
    setIsAddModalOpen(false);
  }
  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  function openProductModal(e, product) {
    e.preventDefault();
    setProduct(product);
    setIsOpen(true);
  }
  function openProductEditModal(e, product) {
    const taskFiles = JSON.parse(product.files);
    e.preventDefault();
    setProduct(product);
    setIsEditModalOpen(true);
    const imageFiles = taskFiles.filter((file) => isImageFile(file));
    const documentFiles = taskFiles.filter((file) => isDocumentFile(file));
    setUploadedFiles({ files: documentFiles, images: imageFiles });
  }

  function openAddProductModal(e) {
    e.preventDefault();
    setIsAddModalOpen(true);
  }

  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        axios
          .delete(`${import.meta.env.VITE_BASEURI}products/deleteproduct/${id}`)
          .then(async (data) => {
            setLoading(false);
            Swal.fire({
              title: "Task Deleted",
              text: "Your file has been deleted.",
              icon: "success",
              showConfirmButton: false,
              timer: 1000,
            });
          });
      }
    });
  };

  const handleActive = async (product) => {
    setLoading(true);

    let updatedProduct = {};
    product.status === "active"
      ? (updatedProduct = { ...product, status: "inactive" })
      : (updatedProduct = { ...product, status: "active" });

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASEURI}products/updateproduct/${product.id}`,
        updatedProduct,
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
          title: `Product ${
            product.status === "inactive" ? "Activated!" : "Deactivated!"
          }`,
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error uploading task:", error);
    }
  };

  // Function to get the file extension from a filename
  const getFileExtension = (filename) => {
    const parts = filename.split(".");
    return parts[parts.length - 1].toLowerCase();
  };
  const getFileName = (filePath) => {
    const parts = filePath.split("\\");
    const fileName = parts[parts.length - 1];
    return fileName;
  };

  // Function to check if a file has an image extension
  const isImageFile = (file) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
    const fileExtension = getFileExtension(file);
    return imageExtensions.includes(fileExtension);
  };

  // Function to check if a file has a document extension
  const isDocumentFile = (file) => {
    const documentExtensions = ["doc", "docx", "pdf", "txt"];
    const fileExtension = getFileExtension(file);
    return documentExtensions.includes(fileExtension);
  };
  return (
    <div>
      <div className="flex justify-between items-center my-8">
        <h2 className="text-3xl uppercase font-semibold">Product Table</h2>
        <button
          className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white"
          onClick={openAddProductModal}
        >
          Add New Product
        </button>
      </div>
      <div className="overflow-y-auto block w-full shadow-sm">
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b-2 border-green-500">
              <th className="px-4 py-3 text-left border-green-500 border-r-2 w-56">
                Product Name
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                Created By
              </th>
              <th className="px-4 py-3 text-center border-green-500 border-r-2">
                Status
              </th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading ? (
              products.productsWithNames.map((product, index) => (
                <tr className="border-b-2 border-green-500" key={index}>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2 ">
                    <a href="#" onClick={(e) => openProductModal(e, product)}>
                      {" "}
                      {product.title}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2 ">
                    {product.creator}
                  </td>

                  <td className="px-4 py-3 text-center border-green-500 border-r-2">
                    <StatusBadge status={product.status}></StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-center ">
                    <div className="flex justify-center items-center space-x-3">
                      <button
                        className="p-1 text-xl shadow-md rounded-sm bg-slate-200 transition-colors hover:bg-amber-500 hover:text-white"
                        onClick={(e) => openProductEditModal(e, product)}
                      >
                        <TbEdit />
                      </button>
                      {
                        // <button
                        //   className="p-1 text-xl shadow-md rounded-sm bg-slate-200 transition-colors hover:bg-rose-500 hover:text-white"
                        //   onClick={() => {
                        //     handleDeleteProduct(product.id);
                        //   }}
                        // >
                        //   <TbTrashX />
                        // </button>
                      }
                      <button
                        className={`p-1 text-xl shadow-md rounded-sm bg-slate-200 transition-colors ${
                          product.status === "active"
                            ? "hover:bg-rose-400 hover:text-black"
                            : "hover:bg-green-500 hover:text-white"
                        }`}
                        onClick={() => {
                          handleActive(product);
                        }}
                      >
                        {product.status === "active" ? (
                          <IoIosEye />
                        ) : (
                          <IoIosEyeOff />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-2 text-xl border-green-500 border-2 border-t-0"
                >
                  No Products Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {products.totalPages > 1 && (
          <Pagination
            totalPages={products.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          ></Pagination>
        )}
      </div>
      {product && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                    <Dialog.Title
                      as="h3"
                      className="text-xl text-center mb-4 font-medium leading-6 text-gray-900"
                    >
                      {product.title}
                    </Dialog.Title>
                    <Tab.Group>
                      <Tab.List className="flex space-x-1 rounded-xl bg-green-500 p-1">
                        <Tab
                          key="overview"
                          className={({ selected }) =>
                            classNames(
                              "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                              "ring-white/60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2",
                              selected
                                ? "bg-white text-green-700 shadow"
                                : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                            )
                          }
                        >
                          Overview
                        </Tab>
                        {product.files !== undefined &&
                          Object.keys(JSON.parse(product.files)).length !==
                            0 && (
                            <Tab
                              key="file"
                              className={({ selected }) =>
                                classNames(
                                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                                  "ring-white/60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2",
                                  selected
                                    ? "bg-white text-green-700 shadow"
                                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                                )
                              }
                            >
                              Files
                            </Tab>
                          )}
                      </Tab.List>
                      <Tab.Panels className="mt-2">
                        <Tab.Panel
                          key="overview"
                          className={classNames(
                            "rounded-xl bg-white p-3",
                            "ring-white/60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2"
                          )}
                        >
                          <div className="my-2">
                            <h4 className="mb-1">Product Description</h4>
                            <p className="text-sm text-gray-500">
                              {product.desc}
                            </p>
                          </div>
                          <div className="my-2">
                            <ul>
                              <li>
                                <span className="font-bold">
                                  Product Creator:{" "}
                                </span>
                                {product.taskCreator}
                              </li>
                            </ul>
                          </div>
                        </Tab.Panel>
                        {product.files !== undefined &&
                          Object.keys(JSON.parse(product.files)).length !==
                            0 && (
                            <Tab.Panel
                              key="file"
                              className={classNames(
                                "rounded-xl bg-white p-3",
                                "ring-white/60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2"
                              )}
                            >
                              <LightGallery
                                onInit={onInit}
                                speed={500}
                                plugins={[lgThumbnail, lgZoom]}
                              >
                                {JSON.parse(product.files).map((file, i) => (
                                  <a
                                    href={`${
                                      import.meta.env.VITE_BASEURL
                                    }${file}`}
                                    key={i}
                                  >
                                    <img
                                      src={`${
                                        import.meta.env.VITE_BASEURL
                                      }${file}`}
                                    />
                                  </a>
                                ))}
                              </LightGallery>
                            </Tab.Panel>
                          )}
                      </Tab.Panels>
                    </Tab.Group>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-rose-300 p-1 text-md text-white hover:bg-rose-500 transition-color focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 absolute right-3 top-3"
                        onClick={closeModal}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
      {product && (
        <Transition appear show={isEditModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeEditModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                    <Dialog.Title
                      as="h3"
                      className="text-xl text-center mb-4 font-medium leading-6 text-gray-900"
                    >
                      Update Task
                    </Dialog.Title>
                    <UpdateProduct
                      setLoading={setLoading}
                      closeModal={closeEditModal}
                      product={product}
                      uploadedFiles={uploadedFiles}
                      getFileName={getFileName}
                    ></UpdateProduct>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-rose-300 p-1 text-md text-white hover:bg-rose-500 transition-color focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 absolute right-3 top-3"
                        onClick={closeEditModal}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeAddModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                  <Dialog.Title
                    as="h3"
                    className="text-xl text-center mb-4 font-medium leading-6 text-gray-900"
                  >
                    Add New Product
                  </Dialog.Title>
                  <AddProduct
                    setLoading={setLoading}
                    closeModal={closeAddModal}
                  ></AddProduct>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-rose-300 p-1 text-md text-white hover:bg-rose-500 transition-color focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 absolute right-3 top-3"
                      onClick={closeAddModal}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProductAdmin;
