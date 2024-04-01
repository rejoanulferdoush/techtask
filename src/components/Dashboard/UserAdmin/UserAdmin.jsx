import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import Datepicker from "react-tailwindcss-datepicker";
import { CiTrash } from "react-icons/ci";
import { TbEdit } from "react-icons/tb";
import { FaTimes } from "react-icons/fa";
import useTask from "../../../hooks/useTasks";
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
import AddUser from "../AddUser/AddUser";
import UpdateUser from "../UpdateUser/UpdateUser";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import Loader from "../../Loader";
import { useLocation, useNavigate } from "react-router-dom";

const UserAdmin = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const { user, userRoles } = useAuth();
  const [userRole] = useRole();
  const role = userRole && user ? userRole.role : null;
  const userID = userRole && user ? userRole.id : null;
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roleStat, setRoleStat] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  let from = location?.state?.from?.pathname || "/";

  if (userRole) {
    if (userRole.role !== "super_admin" && userRole.role !== "admin") {
      Swal.fire({
        title: "Restricted",
        text: "You don't have the required permissions.",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
      });
      // Redirect to the previous page
      navigate(from);
      return null;
    }
  }
  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const getAllUsers = await axios.get(
          `https://techops.sohochor.com/api/users/allUser`
        );
        if (getAllUsers.status === 200) {
          // Check if the logged-in user is "super_admin"
          if (role === "super_admin") {
            setUsers(getAllUsers.data);
          } else {
            // If not "super_admin", filter out users with the role "super_admin"
            const filteredUsers = getAllUsers.data.filter(
              (user) => user.role !== "super_admin"
            );
            setUsers(filteredUsers);
          }
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        // Handle the error if needed
      }
    };

    fetchAllUser(); // Invoke the asynchronous function
  }, [loading, isAddModalOpen, isEditModalOpen]);

  // const [tasks, refetchAllUsers] = useTask(currentPage, pageLimit);
  // const [task, refetch] = userID === 0 ? [null, null] : useGetTask(userID);
  let allUsers = users === undefined ? [] : users;

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  function closeAddModal() {
    setIsAddModalOpen(false);
  }
  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  function openTaskEditModal(e, user) {
    e.preventDefault();
    setCurrentUser(user);
    setIsEditModalOpen(true);
  }

  function openAddTaskModal(e) {
    e.preventDefault();
    setIsAddModalOpen(true);
  }

  const baseURI = "https://techops.sohochor.com/";

  const handleDeleteUser = (user) => {
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
          .delete(`${baseURI}api/users/deleteUser/${user.id}`)
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

  const handleRole = async (role, user) => {
    setLoading(true);
    user.role = role;
    const res = await axios.put(
      `${import.meta.env.VITE_BASEURI}users/updateUser/${user.id}`,
      JSON.stringify(user)
    );
    setLoading(false);

    console.log(role);
  };

  return (
    <div>
      <div className="flex justify-between items-center my-8">
        <h2 className="text-3xl uppercase font-semibold">User Table</h2>
      </div>

      <div className="overflow-y-auto block w-full shadow-sm">
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b-2 border-green-500">
              <th className="px-4 py-3 text-left border-green-500 border-r-2 w-56">
                User Name
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                User Email
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                User Role
              </th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading ? (
              allUsers.length > 0 ? (
                allUsers.map((user, index) => (
                  <tr className="border-b-2 border-green-500" key={index}>
                    <td className="px-4 py-3 text-left border-green-500 border-r-2 ">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-left border-green-500 border-r-2 ">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-left border-green-500 border-r-2 ">
                      <div className="flex flex-wrap item-center justify-start ">
                        {userRoles.map((role, num) => (
                          <div
                            className={`flex items-center rounded-md shadow-md border border-green-400 mb-2 mr-3 last:mr-0 px-2 py-1 transition-colors cursor-pointer ${
                              user.role === role
                                ? "bg-green-200"
                                : "hover:bg-green-200 "
                            }`}
                            key={num}
                          >
                            <input
                              id={`radio-${num}-${user.id}`}
                              type="radio"
                              name={`role-${user.id}`}
                              className="w-5 h-5 hidden peer"
                              defaultChecked={user.role === role ? true : false}
                              value={role}
                              onChange={(e) => handleRole(e.target.value, user)}
                            />
                            <label
                              htmlFor={`radio-${num}-${user.id}`}
                              className="relative flex items-center justify-center p-1 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 border-2 border-green-500 rounded-full overflow-hidden "
                            >
                              <span className="bg-green-500 rounded-full w-2 h-2"></span>
                            </label>
                            <span className="capitalize ms-1">
                              {role.replace(/_/g, " ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center ">
                      <div className="flex justify-center items-center space-x-3">
                        <button
                          className="p-1 text-xl shadow-md rounded-sm bg-slate-200 transition-colors hover:bg-amber-500 hover:text-white"
                          onClick={(e) => openTaskEditModal(e, user)}
                        >
                          <TbEdit />
                        </button>
                        <button
                          className="p-2 text-sm shadow-md rounded-sm bg-slate-200 transition-colors hover:bg-rose-300 hover:text-white"
                          onClick={() => {
                            handleDeleteUser(user);
                          }}
                        >
                          <CiTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-2 text-xl border-green-500 border-2 border-t-0"
                  >
                    No User Yet
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan="4">
                  <Loader className="w-full h-full"></Loader>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {userID !== 0 && (
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
                    <UpdateUser
                      setLoading={setLoading}
                      closeModal={closeEditModal}
                      user={currentUser}
                    ></UpdateUser>

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

export default UserAdmin;
