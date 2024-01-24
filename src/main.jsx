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
import IssuesData from "./components/Dashboard/IssuesData/IssuesData";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "/dashboard",
        element: <IssuesData></IssuesData>,
      },
      {
        path: "addTask",
        element: <AddTask></AddTask>,
      },
      {
        path: "addIssue",
        element: <AddIssue></AddIssue>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound></NotFound>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
