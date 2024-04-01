import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const Login = () => {
  const { signIn, createUser } = useAuth();
  const [disableBtn, setDisableBtn] = useState("disabled");
  const [regDisableBtn, setRegDisableBtn] = useState("disabled");
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
    formState: { errors: loginErrors, isValid: isLoginFormValid },
  } = useForm({
    mode: "onBlur", // Specify the mode for login form
  });
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegister,
    formState: { errors: registerErrors, isValid: isRegisterFormValid },
  } = useForm({
    mode: "onBlur", // Specify the mode for register form
  });
  const [passShow, setPassShow] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [passwordReg, setPasswordReg] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  let from = location?.state?.from?.pathname || "/";

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

  const onLogin = (data) => {
    const email = data.email;
    const password = data.password;
    signIn(email, password)
      .then((result) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Welcome Back!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(from);
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = getFirebaseErrorMessage(errorCode);
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: errorMessage,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  const addUser = async (data) => {
    const username = data.username;
    const email = data.email_reg;
    const password = data.password_reg;
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
        navigate("/");
        resetRegister();
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
    <div className="min-h-screen flex justify-center items-center bg-gradient-primary">
      <div className="px-12 py-12 w-1/4 space-y-5 shadow-xl bg-[rgba(88, 130, 193, 0.28)] rounded-[40px] bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border-0 ring-2 ring-gray-300 ring-opacity-10 ring-inset">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-green-500 p-1">
            <Tab
              key="overview"
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-green-300 focus:outline-none focus:ring-2 focus:ring-inset",
                  selected
                    ? "bg-white text-green-700 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Login
            </Tab>

            <Tab
              key="file"
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-green-300 focus:outline-none focus:ring-2 focus:ring-inset",
                  selected
                    ? "bg-white text-green-700 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Register
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel key="overview" className={classNames("rounded-xl", "")}>
              <form className="pt-0" onSubmit={handleLoginSubmit(onLogin)}>
                <div className="w-full mb-5">
                  <label className="block text-md leading-6 text-white">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      {...loginRegister("email", {
                        required: "Email field can't be empty",
                        pattern: {
                          value:
                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Please input a valid email address",
                        },
                      })}
                      placeholder="Email"
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-black shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6 lowercase"
                    />
                  </div>
                  {loginErrors.email && (
                    <span className="text-rose-500 block my-2 py-1 px-3 rounded-md text-md font-medium bg-slate-100">
                      {loginErrors.email.message}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-md leading-6 text-white">
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      {...loginRegister("password", {
                        required: "Password field can not be empty",
                      })}
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
                  {loginErrors.password && (
                    <span className="text-rose-500 block my-2 py-1 px-3 rounded-md text-md font-medium bg-slate-100">
                      {loginErrors.password.message}
                    </span>
                  )}
                  <a
                    href="#"
                    className="text-xs text-white font-light mt-2 block transition-all hover:underline"
                  >
                    Forgot password?
                  </a>
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
                    value="Login"
                    className="text-sm uppercase px-4 py-2 shadow-sm  bg-green-700 text-white rounded-md  cursor-pointer transition-all duration-150 w-full block hover:bg-green-500 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                    disabled={disableBtn}
                  />
                </div>
                <div className="text-sm font-thin text-gray-100 mt-3">
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    className="font-semibold hover:underline transition-colors"
                    onClick={() => {
                      setSelectedIndex(1);
                    }}
                  >
                    Register here
                  </button>
                </div>
              </form>
            </Tab.Panel>

            <Tab.Panel key="file" className={classNames("rounded-xl", "")}>
              <form className="pt-0" onSubmit={handleRegisterSubmit(addUser)}>
                <div className="relative flex flex-wrap items-center -mx-[15px] px-15 space-y-5">
                  <div className="w-full px-[15px]">
                    <label className="block text-md font-medium leading-6 text-white">
                      Username
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...registerRegister("username", {
                          required: "Username field can't be empty",
                        })}
                        placeholder="Username"
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-black shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {registerErrors.username && (
                      <span className="text-rose-500 block my-2 py-1 px-3 rounded-md text-md font-medium bg-slate-100">
                        {registerErrors.username.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full px-[15px]">
                    <label className="block text-md font-medium leading-6 text-white">
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        {...registerRegister("email_reg", {
                          required: "Email field can't be empty",
                          pattern: {
                            value:
                              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Please input a valid email address",
                          },
                        })}
                        placeholder="Email"
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-black shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {registerErrors.email_reg && (
                      <span className="text-rose-500 block my-2 py-1 px-3 rounded-md text-md font-medium bg-slate-100">
                        {registerErrors.email_reg.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full px-[15px]">
                    <label className="block text-md font-medium leading-6 text-white">
                      Password
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type={passShow ? "text" : "password"}
                        {...registerRegister("password_reg", {
                          required: "Password field can not be empty",
                          minLength: {
                            value: 8,
                            message: "Password length must be 8 minimum",
                          },
                          maxLength: {
                            value: 20,
                            message: "Password length can be 20 at most",
                          },
                        })}
                        placeholder="Password"
                        onBlur={handlePasswordChange}
                        className="block w-full rounded-md border-0 ps-3 pe-10 py-1.5 text-black shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
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
                      {registerErrors.password_reg && (
                        <span className="text-rose-500 block my-2 py-1 px-3 rounded-md text-md font-medium bg-slate-100">
                          {registerErrors.password_reg.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full px-[15px]">
                    <label className="block text-md leading-6 text-white">
                      Confirm Password
                    </label>
                    <div className="mt-2 relative">
                      <input
                        {...registerRegister("confirmPassword", {
                          required: "Confirm Password field can not be empty",
                          validate: (value) =>
                            value === passwordReg || "Passwords do not match",
                        })}
                        onInput={handleConfirmPasswordChange}
                        placeholder="Confirm Password"
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
                    {registerErrors.confirmPassword && (
                      <span className="text-rose-500 block my-2 py-1 px-3 rounded-md text-md font-medium bg-slate-100">
                        {registerErrors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full px-[15px] mt-5">
                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_SITE_KEY}
                      onChange={registerRecapChaValue}
                    />
                  </div>
                  <div className="w-full text-start px-[15px] mt-16">
                    <input
                      type="submit"
                      value="Register"
                      className="text-sm uppercase px-4 py-2 shadow-sm  bg-green-700 text-white rounded-md  cursor-pointer transition-all duration-150 w-full block hover:bg-green-500 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                      disabled={regDisableBtn}
                    />
                  </div>
                </div>
                <div className="text-sm font-thin text-gray-100 mt-3">
                  Already have an account yet?{" "}
                  <button
                    type="button"
                    className="font-semibold hover:underline transition-colors"
                    onClick={() => {
                      setSelectedIndex(0);
                    }}
                  >
                    Login here
                  </button>
                </div>
              </form>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Login;
