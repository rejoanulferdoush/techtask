import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosIntercept from "../../../hooks/useAxiosIntercept";
import axios from "axios";
import { useState } from "react";
const UpdateUser = ({ user, closeModal, setLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { createUser, changePassword } = useAuth();
  const [userRole, setUserRole] = useState([]);
  const [userPermission, setUserPermission] = useState(user.permissions);
  const [axiosIntercept] = useAxiosIntercept();
  const handleRole = (e) => {
    setUserRole(e.target.value);
  };

  const handleCheckboxChange = (permission) => {
    if (userPermission.includes(permission)) {
      setUserPermission((prevPermissions) =>
        prevPermissions.filter((item) => item !== permission)
      );
    } else {
      setUserPermission((prevPermissions) => [...prevPermissions, permission]);
    }
  };

  const updateUser = async (data) => {
    const username = data.username;
    const email = data.email;
    // const password = data.password;
    const role = data.role;
    const team = data.team;

    const userData = {
      username: username,
      email: email,
      role: role,
      permissions: data.permissions.length > 0 ? data.permissions : [],
      team: team,
    };

    try {
      setLoading(true);
      const res = await axios.put(
        `https://techops.sohochor.com/api/users/updateUser/${user.id}`,
        userData
      );

      if (res.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "User Updated!",
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

    //   reset();
  };

  const permissions = [
    "can_edit_task",
    "can_add_task",
    "can_deleted_task",
    "can_edit_product",
    "can_add_product",
    "can_add_product",
  ];

  return (
    <form className="pt-5" onSubmit={handleSubmit(updateUser)}>
      <div className="relative flex flex-wrap items-center -mx-[15px] px-15 space-y-5">
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Username
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("username")}
              placeholder="Username"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              defaultValue={user.username}
            />
          </div>
        </div>
        <div className="w-1/2 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Email
          </label>
          <div className="mt-2">
            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              defaultValue={user.email}
            />
          </div>
        </div>
        {
          // <div className="w-1/2 px-[15px]">
          //   <label className="block text-sm font-medium leading-6 text-gray-900">
          //     Password
          //   </label>
          //   <div className="mt-2">
          //     <input
          //       type="password"
          //       {...register("password")}
          //       placeholder="Password"
          //       className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
          //     />
          //   </div>
          // </div>
        }

        <div className="w-1/2 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Role
          </label>
          <div className="mt-2">
            <select
              {...register("role")}
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              defaultValue={user.role}
              onChange={handleRole}
            >
              <option value="admin">Admin</option>
              <option value="team_member">Team Member</option>
            </select>
          </div>
        </div>
        <div className="w-1/2 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Team
          </label>
          <div className="mt-2">
            <select
              {...register("team")}
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              defaultValue={user.team}
            >
              <option value="techops">Tech Ops Team</option>
            </select>
          </div>
        </div>
        {userRole !== "admin" && (
          <div className="w-full px-[15px]">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Permission
            </label>
            <div className="mt-2">
              {permissions.map((permission, index) => (
                <label key={index} htmlFor={"#checkbox" + index}>
                  <input
                    type="checkbox"
                    value={permission}
                    defaultChecked={userPermission.includes(permission)}
                    {...register("permissions", {
                      required: { value: true },
                    })}
                    className="ms-4 me-2"
                    id={"checkbox" + index}
                    onChange={handleCheckboxChange}
                  />
                  {permission}
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="w-full text-start px-[15px] mt-5">
          <input
            type="submit"
            value="Update User"
            className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white block w-full"
          />
        </div>
      </div>
    </form>
  );
};

export default UpdateUser;
