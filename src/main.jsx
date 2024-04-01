import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Dashboard from "./components/Dashboard/Dashboard";
import NotFound from "./components/NotFound/NotFound";
import Home from "./components/Home/Home";
import AddTask from "./components/Dashboard/AddTask/AddTask";
import AddIssue from "./components/Dashboard/AddIssue/AddIssue";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProviders from "./providers/AuthProviders";
import AddUser from "./components/Dashboard/AddUser/AddUser";
import Login from "./components/Login/Login";
import AddProduct from "./components/Dashboard/AddProduct/AddProduct";
import TaskAdmin from "./components/Dashboard/TaskAdmin/TaskAdmin";
import UserAdmin from "./components/Dashboard/UserAdmin/UserAdmin";
import ProductAdmin from "./components/Dashboard/ProductAdmin/ProductAdmin";
import PublicSummaryTab from "./components/PublicSummaryTab/PublicSummaryTab";
import IssuesAdmin from "./components/Dashboard/IssuesAdmin/IssuesAdmin";
import PrivateRoute from "./components/Dashboard/PrivateRoute/PrivateRoute";
import UpdateUser from "./components/Dashboard/UpdateUser/UpdateUser";
import UserUpdate from "./components/UserUpdate/UserUpdate";
import Histories from "./components/Dashboard/Histories/Histories";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <PublicSummaryTab></PublicSummaryTab>
          </PrivateRoute>
        ),
      },
      {
        path: "task",
        element: (
          <PrivateRoute>
            <TaskAdmin></TaskAdmin>
          </PrivateRoute>
        ),
      },
      {
        path: "issues",
        element: (
          <PrivateRoute>
            <IssuesAdmin></IssuesAdmin>
          </PrivateRoute>
        ),
      },
      {
        path: "user",
        element: (
          <PrivateRoute>
            <UserAdmin></UserAdmin>
          </PrivateRoute>
        ),
      },
      {
        path: "product",
        element: (
          <PrivateRoute>
            <ProductAdmin></ProductAdmin>
          </PrivateRoute>
        ),
      },
      {
        path: "history",
        element: (
          <PrivateRoute>
            <Histories></Histories>
          </PrivateRoute>
        ),
      },
    ],
  },

  {
    path: "login",
    element: <Login></Login>,
  },

  {
    path: "*",
    element: <NotFound></NotFound>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProviders>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProviders>
  </React.StrictMode>
);
