import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosIntercept from "../../../hooks/useAxiosIntercept";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
const AddUser = ({ closeModal, setLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { auth, createUser, setUserName } = useAuth();
  const [axiosIntercept] = useAxiosIntercept();
  const addUser = async (data) => {
    const username = data.username;
    const email = data.email;
    const password = data.password;
    const role = data.role;
    const team = data.team;

    try {
      // Create user without signing in
      const newUser = await createUser(email, password);

      console.log("New user created:", newUser);

      await setUserName(username);

      const res = await axios.post(
        `https://techops.sohochor.com/api/users/addUser`,
        {
          username: username,
          email: email,
          role: role,
          team: team,
        }
      );

      if (res.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "User Registered!",
          showConfirmButton: false,
          timer: 1500,
        });

        setLoading(false);
        // Reset the form
        reset();
        // Close the modal if needed
        closeModal();
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <form className="pt-5" onSubmit={handleSubmit(addUser)}>
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
            />
          </div>
        </div>
        <div className="w-1/2 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Password
          </label>
          <div className="mt-2">
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="w-1/2 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Role
          </label>
          <div className="mt-2">
            <select
              {...register("role")}
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
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
            >
              <option value="techops">Tech Ops Team</option>
            </select>
          </div>
        </div>
        <div className="w-full text-start px-[15px] mt-5">
          <input
            type="submit"
            value="Add User"
            className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white block w-full"
          />
        </div>
      </div>
    </form>
  );
};

export default AddUser;
