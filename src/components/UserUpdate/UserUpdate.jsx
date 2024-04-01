import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const UserUpdate = () => {
  const { user, changePassword, changeEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  let from = location?.state?.from?.pathname || "/";
  const [disableBtn, setDisableBtn] = useState("disabled");
  const [regDisableBtn, setRegDisableBtn] = useState("disabled");
  const {
    register: passChangeRegister,
    handleSubmit: handlePassChangeSubmit,
    reset: resetPassword,
    formState: { errors: passChangeErrors, isValid: isPassChangeFormValid },
  } = useForm({
    mode: "onBlur", // Specify the mode for login form
  });

  const [passShow, setPassShow] = useState(false);
  const [currentPassShow, setCurrentPassShow] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [passwordReg, setPasswordReg] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getFirebaseErrorMessage = (errorCode) => {
    // Map Firebase error codes to custom error messages
    switch (errorCode) {
      case "auth/user-not-found":
        return "User not found. Please check your email and try again.";
      case "auth/wrong-password":
        return "Invalid password. Please try again.";
      // Add more cases for other error codes as needed
      default:
        return "Authentication failed. Please try again later.";
    }
  };

  const getFirebaseRegErrorMessage = (errorCode) => {
    // Map Firebase error codes to custom error messages
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email address is already in use. Please use a different email.";
      case "auth/invalid-email":
        return "Invalid email address. Please enter a valid email.";
      case "auth/weak-password":
        return "Weak password. Please choose a stronger password.";
      // Add more cases for other error codes as needed
      default:
        return "Sign-up failed. Please try again later.";
    }
  };

  const updatePass = async (data) => {
    const password = data.pass;
    const currentPassword = data.currentPass;
    const email = data.email;
    try {
      // Create user without signing in
      if (email && email.length > 0) {
        await changeEmail(currentPassword, email, navigate, from)
          .then(() => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Email Updated!",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            // An error occurred
            // ...
          });
      }
      if (password && password.length > 0) {
        console.log(password);
        await changePassword(currentPassword, password)
          .then((res) => {
            console.log(res);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Password Updated!",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            console.error("Error updating password:", error.message);
            // Handle the error, e.g., show an error message to the user
          });
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

  const recapChaValue = (value) => {
    setDisableBtn(false);
  };

  const registerRecapChaValue = (value) => {
    setRegDisableBtn(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordReg(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div>
      <form className="pt-0" onSubmit={handlePassChangeSubmit(updatePass)}>
        <div className="w-full mb-5">
          <label className="block text-md leading-6 text-black">Email</label>
          <div className="mt-2">
            <input
              type="email"
              {...passChangeRegister("email", {
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Please input a valid email address",
                },
              })}
              placeholder="Email"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-black shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6 lowercase"
              defaultValue={user.email}
            />
          </div>
          {passChangeErrors.email && (
            <span className="text-rose-500 block my-2 py-1 px-3 rounded-md text-md font-medium bg-slate-100">
              {passChangeErrors.email.message}
            </span>
          )}
        </div>

        <div className="w-full">
          <label className="block text-md leading-6 text-black">Password</label>
          <div className="mt-2 relative">
            <input
              {...passChangeRegister("pass")}
              placeholder="password"
              type={passShow ? "text" : "password"}
              className="block w-full rounded-md border-0 px-3 py-1.5 text-black shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700 text-xl"
              onClick={() => {
                setPassShow(!passShow);
              }}
            >
              {passShow ? <IoIosEye /> : <IoIosEyeOff />}
            </button>
          </div>
          {passChangeErrors.password && (
            <span className="text-rose-500 block my-2 py-1 px-3 rounded-md text-md font-medium bg-slate-100">
              {passChangeErrors.password.message}
            </span>
          )}
        </div>

        <hr className="my-10 w-full h-[2px] bg-slate-400" />

        <div className="w-full">
          <label className="block text-md leading-6 text-black">
            Enter Current Password
          </label>
          <div className="mt-2 relative">
            <input
              {...passChangeRegister("currentPass", { required: true })}
              placeholder="Current Password"
              type={currentPassShow ? "text" : "password"}
              className="block w-full rounded-md border-0 px-3 py-1.5 text-black shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700 text-xl"
              onClick={() => {
                setCurrentPassShow(!currentPassShow);
              }}
            >
              {currentPassShow ? <IoIosEye /> : <IoIosEyeOff />}
            </button>
          </div>
          {passChangeErrors.currentPass && (
            <span className="text-rose-500 block my-2 py-1 px-3 rounded-md text-md font-medium bg-slate-100">
              {passChangeErrors.currentPass.message}
            </span>
          )}
        </div>
        <div className="mt-5">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_SITE_KEY}
            onChange={recapChaValue}
          />
        </div>
        <div className="w-full text-center mt-5">
          <input
            type="submit"
            value="Update"
            className="text-sm uppercase px-4 py-2 shadow-sm  bg-green-700 text-black rounded-md  cursor-pointer transition-all duration-150 w-full block hover:bg-green-500 hover:text-black disabled:pointer-events-none disabled:opacity-30"
            disabled={disableBtn}
          />
        </div>
      </form>
    </div>
  );
};

export default UserUpdate;
