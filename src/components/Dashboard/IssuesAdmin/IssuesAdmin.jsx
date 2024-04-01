import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import Datepicker from "react-tailwindcss-datepicker";
import { TbEdit, TbChecklist, TbTrashX } from "react-icons/tb";
import { FaTimes } from "react-icons/fa";
import { BsReply } from "react-icons/bs";
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
import useUsers from "../../../hooks/useUsers";
import useProduct from "../../../hooks/useProduct";
import Swal from "sweetalert2";

import useIssues from "../../../hooks/useIssues";
import AddIssue from "../AddIssue/AddIssue";
import useGetUser from "../../../hooks/useGetUser";
import useUserWithids from "../../../hooks/useUserWithids";
import useAuth from "../../../hooks/useAuth";
import IssueRes from "../IssueRes/IssueRes";
import useRole from "../../../hooks/useRole";
import useUser from "../../../hooks/useUsers";
import useUserNameByEmail from "../../../hooks/useUserNameByEmail";

const IssuesAdmin = () => {
  const { user } = useAuth();
  const [userbyemail] = useUserNameByEmail(user.email);

  const [userRole] = useRole();
  const role = userRole && user ? userRole.role : null;
  const userID = userRole && user ? userRole.id : null;
  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState([]);
  const [currentIssue, setCurrentIssue] = useState([]);
  const [status, setStatus] = useState([]);
  const [name, setName] = useState("");
  const [complainedBy, setComplainedBy] = useState("");
  const [resolvedBy, setResolvedBy] = useState("");
  const [issueStatus, setIssueStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userIDs, setUserIDs] = useState([]);
  // const [userswid, load] = useUserWithids();
  useEffect(() => {
    const fetchAllIssue = async () => {
      try {
        const getAllIssues = await axios.get(
          `https://techops.sohochor.com/api/issues/allIssues?userId=${userbyemail.id}&$name=${name}&status=${status}&complainedBy=${complainedBy}&resolvedBy=${resolvedBy}&startDate=${value.startDate}&endDate=${value.endDate}&page=${currentPage}&pageLimit=${pageLimit}`
        );
        if (getAllIssues.status === 200) {
          setIssues(getAllIssues.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        // Handle the error if needed
      }
    };

    fetchAllIssue(); // Invoke the asynchronous function
  }, [
    currentPage,
    pageLimit,
    loading,
    status,
    resolvedBy,
    complainedBy,
    isAddModalOpen,
    isEditModalOpen,
    name,
    value,
    issueStatus,
    currentIssue,
    issues,
  ]);

  // console.log(issueStatus);

  useEffect(() => {
    const updateStatus = async () => {
      const res = await axios.put(
        `https://techops.sohochor.com/api/issues/updateIssueStatus/${currentIssue.id}`,
        issueStatus
      );
      console.log(res.status);
    };
    updateStatus();
  }, [issueStatus]);

  const handleStatusUpdate = async (e, issue) => {
    setLoading(true);

    console.log(JSON.stringify(issue));
    let updatedIssue = {};
    updatedIssue = JSON.stringify({ ...issue, status: e.target.value });

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASEURI}issues/updateIssue/${issue.id}`,
        updatedIssue
      );

      if (res.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Issue is ${e.target.value}`,
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error uploading issue:", error);
    }
  };

  let allIssues = issues.issues === undefined ? [] : issues.issues;

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  function closeModal() {
    setIsOpen(false);
  }
  function closeAddModal() {
    setIsAddModalOpen(false);
  }
  function closeEditModal() {
    setIsEditModalOpen(false);
  }
  function openAddIssuesModal(e) {
    e.preventDefault();
    setIsAddModalOpen(true);
  }
  const handleResponseModal = (issue) => {
    setIsEditModalOpen(true);
    setCurrentIssue(issue);
  };

  useEffect(() => {
    const getUID = async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/users/getUserWithID`
      );
      setUid(response.data);
    };
    getUID();
  }, [issues]);

  const [users] = useUser();

  return (
    <div>
      <div className="flex justify-between items-center my-8">
        <h2 className="text-3xl uppercase font-semibold">Issues Table</h2>
        <button
          className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white"
          onClick={openAddIssuesModal}
        >
          New Ticket
        </button>
      </div>
      <div className="relative flex items-center justify-center -mx-[15px] mb-8 px-15 py-4 border-2 border-green-500 rounded-md shadow-lg before:content-['Filter_Table'] before:text-black before:absolute before:left-2 before:-top-2.5 before:bg-white before:text-xs before:px-1 before:rounded before:border-green-500 before:border-2">
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Issue Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="projectName"
              placeholder="Project Name"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              onInput={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Complained By
          </label>
          <div className="mt-2">
            <select
              name="Resolved By"
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              onChange={(e) => setComplainedBy(e.target.value)}
            >
              <option value="">Complained By</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Resolved By
          </label>
          <div className="mt-2">
            <select
              name="Resolved By"
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              onChange={(e) => setResolvedBy(e.target.value)}
            >
              <option value="">Resolved By</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-1/6 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Status
          </label>
          <div className="mt-2">
            <select
              name="Task Against"
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            >
              <option value="">Select Status</option>
              <option value="resolved">Resolved</option>
              <option value="in_progress">In-Progress</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="w-2/6 px-[15px]">
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
      </div>
      <div className="overflow-y-auto block w-full shadow-sm">
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b-2 border-green-500 text-nowrap">
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                Issue Title
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                Complained By
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                Complain Against
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                Date Of Request
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                Resolved By
              </th>
              <th className="px-4 py-3 text-center border-green-500 border-r-2">
                Resolved Date
              </th>
              <th className="px-4 py-3 text-center border-green-500 border-r-2 last:border-r-0">
                Status
              </th>
              <th className="px-4 py-3 text-center border-green-500 border-r-2 last:border-r-0">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {allIssues.length > 0 ? (
              allIssues.map((issue, index) => (
                <tr className="border-b-2 border-green-500" key={index}>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2">
                    {issue.title}
                  </td>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2">
                    {uid[issue.complainedBy]}
                  </td>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2">
                    <ul>
                      {JSON.parse(issue.complainAgainst)
                        .split(",")
                        .map((val, index) => (
                          <li key={index}>{uid[val]}</li>
                        ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2">
                    {moment(issue.dateOfRequest).format("DD MMM, YY")}
                  </td>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2">
                    {issue.resolvedBy
                      ? moment(issue.resolvedBy).format("DD MMM, YY")
                      : "---"}
                  </td>
                  <td className="px-4 py-3 text-center border-green-500 border-r-2">
                    {issue.resolvedDate
                      ? moment(issue.resolvedDate).format("DD MMM, YY")
                      : "---"}
                  </td>
                  <td className="px-4 py-3 text-center border-green-500 border-r-2">
                    <StatusBadge status={issue.status}></StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-center flex space-x-2">
                    <button
                      type="button"
                      className="text-xl uppercase px-1 py-1 shadow-sm border-2 rounded-md text-green-500 border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white"
                      onClick={() => {
                        handleResponseModal(issue);
                      }}
                    >
                      <BsReply />
                    </button>
                    <select
                      className=" rounded-md border-0 px-2 py-1 text-gray-900 shadow-sm ring-2 ring-inset outline-none transition-all ring-green-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                      onChange={(e) => {
                        handleStatusUpdate(e, issue);
                      }}
                      defaultValue={issue.status}
                    >
                      <option value="resolved">Resolved</option>
                      <option value="in_progress">In-Progressed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-2 text-xl border-green-500 border-2 border-t-0"
                >
                  No Tickets Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
                    Add New Ticket
                  </Dialog.Title>
                  <AddIssue
                    setLoading={setLoading}
                    closeModal={closeAddModal}
                  ></AddIssue>

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
      {user && (
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
                      Give Response
                    </Dialog.Title>
                    <IssueRes
                      setLoading={setLoading}
                      closeModal={closeEditModal}
                      issue={currentIssue}
                      user={user}
                    ></IssueRes>

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

export default IssuesAdmin;
