import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosIntercept from "../../../hooks/useAxiosIntercept";
import axios from "axios";
import { useState } from "react";
import moment from "moment";
import useGetResponseByIssue from "../../../hooks/useGetResponseByIssue";
import useUserNameByEmail from "../../../hooks/useUserNameByEmail";
import ResponseCard from "../../Utils/ResponseCard";
const IssueRes = ({ issue, closeModal, setLoading, user }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [userbyemail] = useUserNameByEmail(user.email);

  const [responses, responseRefetch] = useGetResponseByIssue(issue.id);

  const [resp, setResp] = useState({});
  const [axiosIntercept] = useAxiosIntercept();
  const [resFiles, setResFiles] = useState([]);

  const handleResFileUpload = (e) => {
    setResFiles(e.target.files);
  };

  const handleIssueRes = async (data) => {
    // let oldRes =
    //   issue.response.latestResponse && issue.response.latestResponse.length > 0
    //     ? issue.response.latestResponse
    //     : [];
    const formData = new FormData();
    formData.append("responseByEmail", user.email);
    formData.append("responseByRole", userbyemail.role);
    formData.append("responseText", data.response);
    formData.append("responseToIssue", issue.id);
    formData.append("responseToIssueTitle", issue.title);
    // Append each file to formData
    for (let i = 0; i < resFiles.length; i++) {
      formData.append(`files`, resFiles[i]);
    }

    try {
      // setLoading(true);
      const res = await axios.post(
        `https://techops.sohochor.com/api/responses/respond`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Response Successful!",
          showConfirmButton: false,
          timer: 1500,
        });

        setLoading(false);
        responseRefetch();
        reset();
      }
    } catch (error) {
      console.error("Error in response:", error);
    }
  };

  return (
    <form className="pt-5" onSubmit={handleSubmit(handleIssueRes)}>
      <div className="relative flex flex-wrap items-center -mx-[15px] px-15 space-y-5">
        <div className="w-full px-[15px]">
          {responses.length > 0 &&
            responses.map((response) => (
              <ResponseCard response={response}></ResponseCard>
            ))}
        </div>
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Response
          </label>
          <div className="mt-2">
            <textarea
              {...register("response")}
              placeholder="Enter response"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              rows={4}
            />
          </div>
        </div>

        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Upload Fie
          </label>
          <div className="mt-2">
            <input
              {...register("files")}
              type="file"
              onChange={handleResFileUpload}
              multiple="multiple"
            />
          </div>
        </div>

        <div className="w-full text-start px-[15px] mt-5">
          <input
            type="submit"
            value="Send"
            className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white block w-full"
          />
        </div>
      </div>
    </form>
  );
};

export default IssueRes;
