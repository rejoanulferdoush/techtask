import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import useUsers from "../../../hooks/useUsers";
import TruncateText from "../../Utils/TruncateText";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import Select from "react-select";

const AddIssue = ({ closeModal }) => {
  const { user } = useAuth();
  const [userRole] = useRole();
  const [uploadFiles, setUploadFiles] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [users] = useUsers();

  const handleNoteInput = (e) => {
    setNoteInput(e.target.value);
  };

  const handleAddNote = (e) => {
    e.preventDefault();

    setNotes([...notes, noteInput]);

    setNoteInput("");
  };

  const handleRemoveNote = (e, index) => {
    e.preventDefault();
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const handleFileUpload = (e) => {
    setUploadFiles(e.target.files);
  };

  const createTask = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append(
      "complainAgainst",
      selectedUsers.length > 0 ? selectedUsers : []
    );
    formData.append("complainedBy", user ? userRole.id : null);
    formData.append("dateOfRequest", moment());
    if (notes.length > 0) {
      // Append each file to formData
      for (let j = 0; j < notes.length; j++) {
        formData.append(`notes`, notes[j]);
      }
    }

    // Append each file to formData
    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append("files", uploadFiles[i]);
    }

    try {
      const res = await axios.post(
        "https://techops.sohochor.com/api/issues/addIssue",
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
          title: "Issue Added!",
          showConfirmButton: false,
          timer: 1500,
        });
        setNotes([]);
        closeModal();
        reset();
      }
    } catch (error) {
      console.error("Error uploading issue:", error);
    }
  };
  useEffect(() => {
    setUserOptions(
      users
        .filter((user) => user.role !== "normal_user")
        .map((user) => ({ value: user.id, label: user.username }))
    );
  }, [users]);

  return (
    <form className="pt-5" onSubmit={handleSubmit(createTask)}>
      <div className="relative flex flex-wrap items-center -mx-[15px] px-15 space-y-5">
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Issue Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("title")}
              placeholder="Issue Title"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Issue Description
          </label>
          <div className="mt-2">
            <textarea
              {...register("desc")}
              placeholder="Issue Description"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Issue Against
          </label>

          <div className="mt-2">
            <Select
              options={userOptions}
              isMulti
              name="complainAgainst"
              onChange={(e) => setSelectedUsers(e.map((e) => e.value))}
            />
          </div>
        </div>

        <div className="w-full px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Upload File
          </label>
          <div className="mt-2">
            <input
              {...register("files")}
              type="file"
              onChange={handleFileUpload}
              multiple="multiple"
            />
          </div>
        </div>
        <div className="w-1/2 px-[15px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Notes
          </label>
          <div className="mt-2 flex">
            <input
              type="text"
              onChange={handleNoteInput}
              placeholder="Notes Title"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none transition-all ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6 rounded-r-none"
              value={noteInput !== "" ? noteInput : ""}
            />
            <button
              className="text-nowrap py-1.5 border-gray-300 border shadow-sm rounded-md rounded-l-none border-l-0 px-3 hover:border-green-500 hover:bg-green-500 hover:text-white transition-colors"
              onClick={handleAddNote}
            >
              Add Note
            </button>
          </div>
        </div>
        {notes.length > 0 && (
          <div className="w-1/2 px-[15px]">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Notes List
            </label>
            {notes.map((note, index) => (
              <div className="mt-2 flex" key={index}>
                <TruncateText
                  text={note}
                  length="10"
                  className="py-1.5 border-gray-300 border shadow-sm rounded-md rounded-r-none border-r-0 px-3"
                ></TruncateText>
                <button
                  className="text-nowrap py-1.5 border-gray-300 border shadow-sm rounded-md rounded-l-none border-l-0 px-3 hover:border-green-500 hover:bg-green-500 hover:text-white transition-colors"
                  onClick={(e) => {
                    handleRemoveNote(e, index);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="w-full text-start px-[15px] mt-5">
          <input
            type="submit"
            value="Add Issue"
            className="text-lg uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150  hover:bg-green-500 hover:text-white block w-full"
          />
        </div>
      </div>
    </form>
  );
};

export default AddIssue;
