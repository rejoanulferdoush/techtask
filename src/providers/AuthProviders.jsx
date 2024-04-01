import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { createContext } from "react";
import app from "../firebase/firebase.config";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosIntercept from "../hooks/useAxiosIntercept";
import axios from "axios";

export const UserContext = createContext(null);

const auth = getAuth(app);
const secondaryApp = app; // Use the main app instance
const secondaryAuth = getAuth(secondaryApp);
const AuthProviders = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const cuser = auth.currentUser;

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
  const createUser = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
    // Create a secondary Firebase app instance
    //Signup without triggering login start
    // try {
    //   // Create a new user using the main app instance
    //   const userCredential = await createUserWithEmailAndPassword(
    //     secondaryAuth,
    //     email,
    //     password
    //   );
    //   const newUser = userCredential.user;
    //   // Log the new user UID
    //   console.log("User " + newUser.uid + " created successfully!");
    //   // Sign out the user from the main app instance
    //   await signOut(secondaryAuth);
    //   // Continue with your logic here
    // } catch (error) {
    //   console.error("Error creating user:", error);
    // }
    //Signup without triggering login end
  };

  const setUserName = (username) => {
    return updateProfile(auth.currentUser, {
      displayName: username,
    });
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const changePassword = (currentPassword, newpass) => {
    if (cuser) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      return reauthenticateWithCredential(cuser, credential)
        .then(() => {
          return updatePassword(cuser, newpass);
        })
        .catch((err) => console.log("Re-auth error", err.message));
    }
  };

  const changeEmail = async (currentPassword, email, navigate, from) => {
    const updatedUserEmail = axios.put(
      `https://techops.sohochor.com/api/users/updateUserEmail/${user.email}`,
      { email: email }
    );
    console.log(updatedUserEmail.status);
    // const credential = EmailAuthProvider.credential(
    //   user.email,
    //   currentPassword
    // );

    // Create a secondary Firebase app instance
    // Signup without triggering login start
    try {
      // Create a new user using the main app instance

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        currentPassword
      );
      const newUser = userCredential.user;
      // Log the new user UID
      console.log("User " + newUser.uid + " created successfully!");

      deleteUser(user)
        .then(() => {
          return signIn(email, currentPassword)
            .then((result) => {
              navigate(from);
            })
            .catch((error) => {
              const errorCode = error.code;
              let errorMessage = getFirebaseErrorMessage(errorCode);
              console.log(errorMessage);
            });
        })
        .catch((error) => {
          // An error ocurred
          // ...
        });
      // Sign out the user from the main app instance
      // await signOut(secondaryAuth);
      // Continue with your logic here
    } catch (error) {
      console.error("Error creating user:", error);
    }
    //Signup without triggering login end
  };

  const logout = () => {
    // localStorage.removeItem("access-token");
    return signOut(auth);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("auth state change", currentUser);
      setUser(currentUser);
      console.log("user", currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const userRoles = [
    "super_admin",
    "admin",
    "team_member",
    "product_manager",
    "task_manager",
    "moderator",
    "normal_user",
  ];

  const authInfo = {
    user,
    createUser,
    signIn,
    logout,
    loading,
    setUserName,
    changePassword,
    changeEmail,
    userRoles,
  };

  return (
    <UserContext.Provider value={authInfo}>{children}</UserContext.Provider>
  );
};

export default AuthProviders;
