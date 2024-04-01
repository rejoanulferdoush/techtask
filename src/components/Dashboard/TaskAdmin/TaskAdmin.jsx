import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import Datepicker from "react-tailwindcss-datepicker";
import { TbEdit, TbChecklist, TbTrashX } from "react-icons/tb";
import { HiOutlineMagnifyingGlassPlus } from "react-icons/hi2";
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
import AddTask from "../AddTask/AddTask";
import Pagination from "../../Utils/Pagination";
import StatusBadge from "../../Utils/StatusBadge";
import axios from "axios";
import useGetTask from "../../../hooks/useGetTask";
import useUsers from "../../../hooks/useUsers";
import useProduct from "../../../hooks/useProduct";
import Swal from "sweetalert2";
import UpdateTask from "../UpdateTask/UpdateTask";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useIssueCount from "../../../hooks/useIssueCount";
import FileIcon from "../../Utils/FileIcon";

const TaskAdmin = () => {
  const { user } = useAuth();
  const [userRole] = useRole();
  const role = userRole && user ? userRole.role : null;
  const userID = userRole && user ? userRole.id : null;
  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    files: null,
    images: null,
  });
  const [users] = useUsers();
  const [products] = useProduct();
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState([]);
  const [status, setStatus] = useState([]);
  const [name, setName] = useState("");
  const [against, setAgainst] = useState("");
  const [assigned, setAssigned] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [dataTime, setDataTime] = useState("today");

  useEffect(() => {
    const fetchAllTask = async () => {
      try {
        const getAllTasks = await axios.get(
          `https://techops.sohochor.com/api/tasks/allTasks?name=${name}&status=${status}&assignedBy=${assigned}&assignedAgainst=${against}&startDate=${value.startDate}&endDate=${value.endDate}&page=${currentPage}&pageLimit=${pageLimit}`
        );
        if (getAllTasks.status === 200) {
          setTasks(getAllTasks.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        // Handle the error if needed
      }
    };

    fetchAllTask(); // Invoke the asynchronous function
  }, [
    currentPage,
    pageLimit,
    loading,
    status,
    against,
    isAddModalOpen,
    isEditModalOpen,
    name,
    value,
  ]);

  let allTasks = tasks.allTasks === undefined ? [] : tasks.allTasks;

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

  const onNameInput = (e) => {
    setName(e.target.value);
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

  const handleValueChange = (newValue) => {
    setValue(newValue);
    console.log(value);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openTaskModal = (e, task) => {
    const taskFiles = JSON.parse(task.files);
    e.preventDefault();
    setTask(task);
    setIsOpen(true);
    const imageFiles = taskFiles.filter((file) => isImageFile(file));
    const documentFiles = taskFiles.filter((file) => isDocumentFile(file));
    setUploadedFiles({ files: documentFiles, images: imageFiles });
  };
  const openTaskEditModal = (e, task) => {
    const taskFiles = JSON.parse(task.files);
    e.preventDefault();
    setTask(task);
    setIsEditModalOpen(true);
    const imageFiles = taskFiles.filter((file) => isImageFile(file));
    const documentFiles = taskFiles.filter((file) => isDocumentFile(file));
    setUploadedFiles({ files: documentFiles, images: imageFiles });
  };

  const openAddTaskModal = (e) => {
    e.preventDefault();
    setIsAddModalOpen(true);
  };

  const onInit = () => {
    console.log("lightGallery has been initialized");
  };
  const baseURI = "https://techops.sohochor.com/";

  const handleDeleteTask = (id) => {
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
          .delete(`${baseURI}api/tasks/deleteTask/${id}`)
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

  return (
    <div>
      <div className="flex justify-between items-center my-8">
        <h2 className="text-3xl uppercase font-semibold">Task Table</h2>
        {user && (
          <button
            className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white"
            onClick={openAddTaskModal}
          >
            Add New Task
          </button>
        )}
      </div>
      <div className="relative flex items-center justify-center -mx-[15px] mb-8 px-15 py-4 border-2 border-green-500 rounded-md shadow-lg before:content-['Filter_Table'] before:text-black before:absolute before:left-2 before:-top-2.5 before:bg-white before:text-xs before:px-1 before:rounded before:border-green-500 before:border-2">
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="projectName"
              placeholder="Project Name"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              onInput={onNameInput}
            />
          </div>
        </div>
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Assigned By
          </label>
          <div className="mt-2">
            <select
              name="Assigned By"
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              onChange={(e) => setAssigned(e.target.value)}
            >
              <option value="">Assigned By</option>
              {users.map(
                (user) =>
                  user.role !== "team_member" && (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  )
              )}
            </select>
          </div>
        </div>
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Task Against
          </label>
          <div className="mt-2">
            <select
              name="Task Against"
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              onChange={(e) => setAgainst(e.target.value)}
            >
              <option value="">Select Product</option>
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
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Status
          </label>
          <div className="mt-2">
            <select
              name="Status Sort"
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Sort by Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In-Progress</option>
              <option value="overdue">Overdue</option>
              <option value="not_started">Not Started</option>
            </select>
          </div>
        </div>
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Date Range
          </label>
          <div className="mt-2 date-range">
            <Datepicker
              primaryColor={"sky"}
              value={value}
              onChange={handleValueChange}
            />
          </div>
        </div>
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Data Show
          </label>
          <div className="mt-2 date-range">
            <select
              name="Show Data"
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              onChange={(e) => setPageLimit(e.target.value)}
            >
              <option value="">No. of task</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto block w-full shadow-sm">
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b-2 border-green-500">
              <th className="px-4 py-3 text-left border-green-500 border-r-2 w-36">
                Task Name
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                Task Against
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                Assigned By
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                Assigned To
              </th>
              <th className="px-4 py-3 text-center border-green-500 border-r-2">
                Start Date
              </th>
              <th className="px-4 py-3 text-center border-green-500 border-r-2">
                Due Date
              </th>
              <th className="px-4 py-3 text-center border-green-500 border-r-2">
                End Date
              </th>
              <th className="px-4 py-3 text-center border-green-500 border-r-2 last:border-r-0">
                Status
              </th>
              {role != null && role !== "team_member" && (
                <th className="px-4 py-3 text-center">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {!loading && allTasks.length > 0 ? (
              allTasks.map((task, index) => (
                <tr className="border-b-2 border-green-500" key={index}>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2 ">
                    <a
                      href="#"
                      onClick={(e) => openTaskModal(e, task)}
                      className="text-black hover:text-green-500 transition-colors"
                    >
                      {" "}
                      {task.title}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2 ">
                    {task.assignedAgainstTitle}
                  </td>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2 ">
                    {task.assignedByName}
                  </td>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2 ">
                    {task.assignedToName}
                  </td>
                  <td className="px-4 py-3 text-center border-green-500 border-r-2 ">
                    {moment(task.startDate).format("DD MMM, YY")}
                  </td>
                  <td className="px-4 py-3 text-center border-green-500 border-r-2 ">
                    {moment(task.dueDate).format("DD MMM, YY")}
                  </td>
                  <td className="px-4 py-3 text-center border-green-500 border-r-2 ">
                    {task.completed === 0
                      ? "Not Finished"
                      : task.endDate === null
                      ? "Not Finished"
                      : moment(task.endDate).format("DD MMM, YY")}
                  </td>
                  <td className="px-4 py-3 text-center border-green-500 border-r-2 last:border-r-0">
                    <StatusBadge status={task.status}></StatusBadge>
                  </td>
                  {role != null && role !== "team_member" && (
                    <td className="px-4 py-3 text-center ">
                      <div className="flex justify-center items-center space-x-3">
                        <button
                          className="p-1 text-xl shadow-md rounded-sm bg-slate-200 transition-colors hover:bg-amber-500 hover:text-white"
                          onClick={(e) => openTaskEditModal(e, task)}
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Edit Task"
                        >
                          <TbEdit />
                        </button>
                        <button
                          className="p-1 text-xl shadow-md rounded-sm bg-slate-200 transition-colors hover:bg-rose-500 hover:text-white"
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Delete Task"
                          onClick={() => {
                            handleDeleteTask(task.id);
                          }}
                        >
                          <TbTrashX />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-2 text-xl border-green-500 border-2 border-t-0"
                >
                  No Task Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {tasks.totalPages > 1 && (
          <Pagination
            totalPages={tasks.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          ></Pagination>
        )}
      </div>
      {task && (
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
                  <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-xl text-center mb-4 font-medium leading-6 text-gray-900"
                    >
                      {task.title}
                    </Dialog.Title>
                    <Tab.Group>
                      <Tab.List className="flex space-x-1 rounded-xl bg-green-500 p-1">
                        <Tab
                          key="overview"
                          className={({ selected }) =>
                            classNames(
                              "w-full rounded-lg py-2.5 text-md font-medium leading-5",
                              "ring-white/60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2",
                              selected
                                ? "bg-white text-black shadow"
                                : "text-white hover:bg-white/[0.12]"
                            )
                          }
                        >
                          Overview
                        </Tab>
                        {task.files !== undefined &&
                          Object.keys(JSON.parse(task.files)).length !== 0 && (
                            <Tab
                              key="file"
                              className={({ selected }) =>
                                classNames(
                                  "w-full rounded-lg py-2.5 text-md font-medium leading-5",
                                  "ring-white/60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2",
                                  selected
                                    ? "bg-white text-black shadow"
                                    : "text-white hover:bg-white/[0.12]"
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
                            <h4 className="mb-1">Task Description</h4>
                            <p className="text-sm text-gray-500">{task.desc}</p>
                          </div>
                          <div className="my-2">
                            <ul>
                              <li>
                                <span className="font-bold">
                                  Task Creator:{" "}
                                </span>
                                {task.taskCreator}
                              </li>
                              <li>
                                <span className="font-bold">
                                  Task Assigned To:{" "}
                                </span>
                                {task.assignedToName}
                              </li>
                              <li>
                                <span className="font-bold">
                                  Task Assigned By:{" "}
                                </span>
                                {task.assignedByName}
                              </li>
                            </ul>
                          </div>
                        </Tab.Panel>
                        {task.files !== undefined &&
                          Object.keys(JSON.parse(task.files)).length !== 0 && (
                            <Tab.Panel
                              key="file"
                              className={classNames(
                                "rounded-xl bg-white p-3",
                                "ring-white/60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2"
                              )}
                            >
                              {uploadedFiles.images !== null &&
                                uploadedFiles.images.length > 0 && (
                                  <div className="w-full mb-6">
                                    <h3 className="text-lg font-semibold uppercase mb-3 text-start">
                                      Images:{" "}
                                    </h3>
                                    <div>
                                      <LightGallery
                                        onInit={onInit}
                                        speed={500}
                                        plugins={[lgThumbnail, lgZoom]}
                                        elementClassNames="flex flex-wrap -mx-[5px] items-center justify-start"
                                      >
                                        {uploadedFiles.images.map(
                                          (img, index) => (
                                            <a
                                              href={`${baseURI}${img}`}
                                              key={index}
                                              className="mb-[10px] px-[5px] w-1/4 h-32 block"
                                            >
                                              <div className="block w-full h-full shadow-md bg-gray-200 rounded-md p-2 relative group overflow-hidden">
                                                <img
                                                  src={`${baseURI}${img}`}
                                                  className="w-full h-full object-cover rounded-md"
                                                />
                                                <div className="absolute w-full h-full flex items-center justify-center text-white text-3xl bg-black/50 left-0 top-0 transition-transform scale-0 group-hover:scale-100 rounded-md">
                                                  <HiOutlineMagnifyingGlassPlus />
                                                </div>
                                              </div>
                                            </a>
                                          )
                                        )}
                                      </LightGallery>
                                    </div>
                                  </div>
                                )}
                              {uploadedFiles.files !== null &&
                                uploadedFiles.files.length > 0 && (
                                  <div className="w-full mb-4">
                                    <h3 className="text-lg font-semibold uppercase mb-3 text-start ">
                                      Files:{" "}
                                    </h3>
                                    <ul className="flex flex-wrap -mx-[15px]">
                                      {uploadedFiles.files.map(
                                        (file, index) => (
                                          <li
                                            key={index}
                                            className="w-1/2 px-[15px] mb-[15px]"
                                          >
                                            <a
                                              href={`${baseURI}${file}`}
                                              className="p-2 relative mb-1 shadow-lg rounded-md flex items-center justify-between border-2 transition-colors border-green-500 hover:bg-green-500 hover:text-white"
                                            >
                                              <FileIcon
                                                file={file}
                                                fileName={getFileName}
                                              ></FileIcon>
                                            </a>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
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
                <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl text-center mb-4 font-medium leading-6 text-gray-900"
                  >
                    New Task
                  </Dialog.Title>
                  <AddTask
                    setLoading={setLoading}
                    closeModal={closeAddModal}
                    userID={userID}
                  ></AddTask>

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
      {task && (
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
                  <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-xl text-center mb-4 font-medium leading-6 text-gray-900"
                    >
                      Update Task
                    </Dialog.Title>
                    <UpdateTask
                      setLoading={setLoading}
                      closeModal={closeEditModal}
                      task={task}
                      assignedBy={userID}
                      createdBy={task.createdBy}
                      uploadedFiles={uploadedFiles}
                      getFileName={getFileName}
                    ></UpdateTask>

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
    </div>
  );
};

export default TaskAdmin;
