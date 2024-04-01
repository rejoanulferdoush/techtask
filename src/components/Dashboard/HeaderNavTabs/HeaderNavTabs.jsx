import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AddTask from "../AddTask/AddTask";
import { UserContext } from "../../../providers/AuthProviders";
import { Fragment, useContext, useEffect, useState } from "react";
import { FaTimes, FaUserCircle } from "react-icons/fa";

// import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useAllowed from "../../../hooks/useAllowed";
import useUserNameByEmail from "../../../hooks/useUserNameByEmail";
import { Tooltip } from "react-tooltip";
import UserUpdate from "../../UserUpdate/UserUpdate";
import { Dialog, Transition } from "@headlessui/react";
import MenuNavs from "../../Utils/MenuNavs";

const HeaderNavTabs = () => {
  // const history = useHistory();
  const { user, logout } = useAuth();
  const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false);

  // const [userRole] = useRole();
  // const [currentRole, setCurrentRole] = useState("");
  const [
    allowedTask,
    allowedProduct,
    allowedUser,
    allowedSummary,
    currentRole,
  ] = useAllowed();
  const navigate = useNavigate();
  const location = useLocation();
  let from = location?.state?.from?.pathname || "/";
  const handleLogout = async () => {
    try {
      await logout(); // Call your logout method
      // history.push("/"); // Redirect to the home page
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Come Back Soon!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const [userbyemail] = useUserNameByEmail(user.email);
  const closeUpdateUserModal = () => {
    setIsUpdateUserOpen(false);
  };

  // useEffect(() => {
  //   if (userRole) {
  //     setCurrentRole(userRole.role);
  //   }
  // }, [userRole]);

  return (
    <div>
      <ul className="flex justify-center items-center space-x-3 capitalize">
        {user ? (
          <>
            <li>
              <MenuNavs to="/" text="Home" />
            </li>
            <li>
              <MenuNavs to="/history" text="History" />
            </li>

            <li>
              <MenuNavs to="/issues" text="Issues" />
            </li>

            {allowedTask && (
              <li>
                <MenuNavs to="/task" text="Tasks" />
              </li>
            )}

            {allowedUser && (
              <li>
                <MenuNavs to="/user" text="Users" />
              </li>
            )}
            {allowedProduct && (
              <li>
                <MenuNavs to="/product" text="Product" />
              </li>
            )}
            <li>
              <div className="group relative">
                <div className="text-4xl py-5 shadow-sm  cursor-pointer transition-all duration-150 ">
                  <FaUserCircle />
                </div>
                <ul className="absolute top-full right-0 text-xl shadow-sm border-2 rounded-md transition-all duration-150  opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto min-w-52 text-right overflow-hidden flex flex-col z-[9999999] bg-white">
                  <li>
                    <button
                      className=" px-4 pt-2 pb-1 text-right text-lg font-semibold  block w-full pointer-events-none"
                      type="button"
                    >
                      {userbyemail.username}
                    </button>
                  </li>
                  <li>
                    <button
                      className=" px-4 pb-1 text-right text-lg font-semibold  block w-full pointer-events-none"
                      type="button"
                    >
                      role:{userbyemail.role}
                    </button>
                  </li>
                  <li>
                    <button
                      className=" px-4 pt-0 pb-2 text-right text-lg font-semibold  block w-full pointer-events-none border-b-2"
                      type="button"
                    >
                      {user.email}
                    </button>
                  </li>
                  <li>
                    <button
                      className="hover:bg-green-500 px-4 py-2 text-right text-lg border-b-2 hover:text-white block w-full"
                      type="button"
                      onClick={() => setIsUpdateUserOpen(true)}
                    >
                      Update User
                    </button>
                  </li>
                  <li>
                    <button
                      className="hover:bg-green-500 px-4 py-2 text-right text-lg hover:text-white block w-full"
                      type="button"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </>
        ) : (
          <li>
            <NavLink
              to="/login"
              className={({ isActive, isPending }) =>
                [
                  isActive
                    ? "text-xl px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150 bg-green-500 text-white"
                    : "text-xl px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150 hover:bg-green-500 hover:text-white",
                ].join(" ")
              }
            >
              Login/Register
            </NavLink>
          </li>
        )}
      </ul>
      <Tooltip id="my-tooltip" />
      <Transition appear show={isUpdateUserOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeUpdateUserModal}
        >
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
                    Update User
                  </Dialog.Title>
                  <UserUpdate></UserUpdate>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-rose-300 p-1 text-md text-white hover:bg-rose-500 transition-color focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 absolute right-3 top-3"
                      onClick={closeUpdateUserModal}
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

export default HeaderNavTabs;
