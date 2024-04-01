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
import useHistories from "../../../hooks/useHistories";

const Histories = () => {
  const { user } = useAuth();
  const [userbyemail] = useUserNameByEmail(user.email);

  const [userRole] = useRole();
  const role = userRole && user ? userRole.role : null;
  const userID = userRole && user ? userRole.id : null;
  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });
  const [histories, refetch] = useHistories();
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

  // console.log(issueStatus);

  // useEffect(() => {
  //   const updateStatus = async () => {
  //     const res = await axios.put(
  //       `https://techops.sohochor.com/api/issues/updateIssueStatus/${currentIssue.id}`,
  //       issueStatus
  //     );
  //     console.log(res.status);
  //   };
  //   updateStatus();
  // }, [issueStatus]);

  const handleDeleteHistory = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axios.delete(
          `https://techops.sohochor.com/api/histories/deleteHistory/${id}`
        );

        if (res.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `History Removed`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        }
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center my-8">
        <h2 className="text-3xl uppercase font-semibold">History</h2>
      </div>

      <div className="overflow-y-auto block w-full shadow-sm">
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b-2 border-green-500 text-nowrap">
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                Email
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                History
              </th>
              <th className="px-4 py-3 text-left border-green-500 border-r-2">
                Time
              </th>
              <th className="px-4 py-3 text-center border-green-500 border-r-2 last:border-r-0">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {histories && histories.length > 0 ? (
              histories.map((history, index) => (
                <tr className="border-b-2 border-green-500" key={index}>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2">
                    {history.userEmail}
                  </td>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2">
                    {history.historyData}
                  </td>
                  <td className="px-4 py-3 text-left border-green-500 border-r-2 text-nowrap">
                    {moment(history.createdAt).format("DD MMM, YY, h:mm:ss a")}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Remove History"
                      type="button"
                      className="text-xl uppercase px-1 py-1 shadow-sm border-2 rounded-md text-red-500 border-red-500 cursor-pointer transition-all duration-150  hover:bg-red-500 hover:text-white"
                      onClick={() => {
                        handleDeleteHistory(history.id);
                      }}
                    >
                      <TbTrashX />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-2 text-xl border-green-500 border-2 border-t-0"
                >
                  No Histories Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Histories;
