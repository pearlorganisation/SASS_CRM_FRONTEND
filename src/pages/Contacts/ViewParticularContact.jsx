import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { BiSolidCopy } from "react-icons/bi";

import Select from "react-select";
import ViewFullDetailsModal from "./Modal/ViewFullDetailModal";
import ViewTimerModal from "./Modal/ViewTimerModal";
import { useLocation } from "react-router-dom";
import { getAttendeeContactDetails } from "../../features/actions/webinarContact";
import { useDispatch, useSelector } from "react-redux";
import AddNoteForm from "./AddNoteForm";
import { FaRegEdit } from "react-icons/fa";
import { getNotes } from "../../features/actions/assign";

const ViewParticularContact = () => {
  const dispatch = useDispatch();
  const { attendeeContactDetails } = useSelector(
    (state) => state.webinarContact
  );
  const { noteData, isFormLoading } = useSelector((state) => state.assign);

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const recordType = searchParams.get("recordType");

  useEffect(() => {
    dispatch(getAttendeeContactDetails({ email, recordType }));
    console.log(email, recordType);
  }, []);

  useEffect(() => {
    if (!isFormLoading) {
      dispatch(getNotes({ email, recordType }));
    }
  }, [isFormLoading]);

  const [showModal, setShowModal] = useState(false);

  const handleModal = () => {
    setShowModal(true);
  };

  const [showTimerModal, setShowTimerModal] = useState(false);

  const handleTimerModal = () => {
    setShowTimerModal(true);
  };

  // PHONE NUMBER SECTION

  const handleCopyClick = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast("Text copied to clipboard!", { position: "top-center" });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  //  LEAD TYPE SECTION

  const [selectedOption, setSelectedOption] = useState(null);

  const getColor = (option) => {
    switch (option?.value) {
      case "Hot":
        return "#ef4444"; // Orange
      case "Mild":
        return "#ffab00"; // Yellow
      case "Cold":
        return "#3b82f6"; // Blue
      default:
        return "white";
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "-";
    }
  
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " " + date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #CBD5E1", // Custom border style
      borderRadius: "7px",
      backgroundColor: getColor(selectedOption),
      boxShadow: "none", // Remove the default box shadow
      "&:hover": {
        borderColor: "none", // Keep the border color consistent on hover
      },
      "&:focus": {
        outline: "none", // Remove the focus outline
        borderColor: "#CBD5E1", // Ensure the border color remains the same
      }, // Change background color based on the selected option
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF", // Custom placeholder color
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#FFFFFF", // Default text color for the selected option
    }),
  };

  if (!attendeeContactDetails) return null;

  return (
    <>
      <div className=" max-w-screen-xl mx-auto px-4 md:px-2 pt-12 space-y-7">
        <div className="flex justify-between  ">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            Attendee Contact Details
          </h3>
          <p className=" rounded-lg bg-slate-100  text-sm px-2 py-1">
            Call Timer is scheduled at{" "}
            <span className="text-green-600">5:00 PM</span> by James{" "}
          </p>
        </div>
        <div className="grid grid-cols-[47%_auto]  max-h-fit gap-10 ">
          <div className=" flex-col space-y-3 h-full ">
            <div className="border rounded-lg py-2  px-3 shadow-md">
              <p>
                Email :{" "}
                <span className="ms-2 bg-slate-100 rounded-md px-3 py-1">
                  {attendeeContactDetails?._id}
                </span>
              </p>
            </div>
            <div className="flex justify-between border rounded-lg py-2 px-3 shadow-md">
              <p>
                Name :{" "}
                {attendeeContactDetails?.data.map(
                  (item) =>
                    item?.firstName && (
                      <span className="ms-2 bg-slate-100 rounded-md px-3 py-1">
                        {`${item?.firstName} ${
                          item?.lastName?.match(/:-\)/) ? "" : item?.lastName
                        }`}{" "}
                      </span>
                    )
                )}
              </p>
            </div>

            <div className="border rounded-lg py-1  px-3  shadow-md">
              <p className="flex items-center">
                {" "}
                Phone Number :
                <span className="ms-2 grid lg:grid-cols-2 gap-3">
                  {attendeeContactDetails?.data.map(
                    (item) =>
                      item?.phone && (
                        <span
                          onClick={() => handleCopyClick(item.phone)}
                          className="flex justify-center items-center gap-1 bg-red-500 ms-2 p-1 text-white cursor-pointer rounded-md px-2 py-1"
                        >
                          {item.phone}
                          {/* 9876543210 */}
                          <BiSolidCopy color="#050A30" size={12} />
                        </span>
                      )
                  )}
                </span>
              </p>
            </div>

            <div className="flex justify-between gap-20 min-h-[73%] ">
              <div className="border rounded-lg  shadow-md  w-full ">
                <div className="border-b-4 py-2">
                  {" "}
                  <span className="font-semibold  px-3 ">Notes</span>{" "}
                </div>
                <div className="overflow-auto h-96 scrollbar-thin w-full">
                  {noteData &&
                    noteData.map((item, index) => (
                      <div
                        className="border-b-2 bg-white hover:bg-gray-100 relative cursor-pointer transition duration-300 text-black"
                        onClick={handleModal}
                      >
                        {/* <div className="bg-red-500 w-[7px] h-full absolute"></div> */}
                        <div className="flex  pl-4 pr-2 pt-2 justify-between ">
                          <div className="text-xs font-semibold ">
                            Note {index + 1} :{" "}
                          </div>
                          <div className="flex gap-2">
                            <p className="text-xs">
                              Date :{" "}
                              <span className="  rounded-md px-2 ">
                                {formatDate(item?.updatedAt)}{" "}
                              </span>
                            </p>
                            <p className="text-xs">
                              Call Duration:{" "}
                              <span className="rounded-md px-2">
                                {`${item?.callDuration?.hr} hr ${item?.callDuration?.min} min ${item?.callDuration?.sec} sec`}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex pt-3 px-3">
                          <p className="text-sm  rounded-md px-2 py-2 bg-slate-100 ">
                            {item?.note}
                          </p>
                        </div>
                        <div className="px-2 py-2 flex justify-end">
                          {/* <button onClick={handleModal} className='text-sm rounded-md px-2 text-white bg-blue-600 hover:bg-blue-700'>View Full Details</button> */}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3  h-full">
            <div className="flex  justify-between gap-10  items-center">
              <div className="flex items-center gap-3">
                <div>
                  <span className="font-semibold">Set Alarm :</span>
                </div>
                <button
                  onClick={handleTimerModal}
                  className=" font-semibold shadow rounded-md py-2 bg-blue-600 hover:bg-blue-700 text-white min-w-36"
                >
                  Set Alarm
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">Lead Type :</span>
                <div className="outline-none">
                  <Select
                    isClearable="true"
                    options={[
                      { value: "Hot", label: "Hot" },
                      { value: "Mild", label: "Mild" },
                      { value: "Cold", label: "Cold" },
                    ]}
                    onChange={(selectedOption) =>
                      setSelectedOption(selectedOption)
                    }
                    className=" font-semibold shadow  min-w-36"
                    placeholder="Lead Type "
                    styles={customStyles}
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg space-y-3 shadow-md min-h-[91%] ">
              <div className="border-b-4 py-2">
                <span className="font-semibold px-5 ">Add Note</span>
              </div>
              <AddNoteForm email={email} recordType={recordType} />
              <div></div>
            </div>
          </div>
        </div>
        <div className="mt-12 shadow-lg rounded-lg overflow-x-auto">
          {attendeeContactDetails?.data?.length <= 0 ? (
            <div className="text-lg p-2 flex justify-center w-full">
              No record found
            </div>
          ) : (
            <table className="w-full table-auto text-sm text-left ">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b justify-between">
                <tr>
                  <th className="py-3 px-2">S No.</th>
                  <th className="py-3 px-2">Webinar</th>
                  <th className="py-3 px-2">First Name</th>
                  <th className="py-3 px-2">Last Name</th>
                  <th className="py-3  text-center">Webinar Minutes</th>
                  <th className="py-3 px-2">Webinar Date</th>
                  <th className="py-3 px-2">Action</th>
                </tr>
              </thead>

              <tbody className="text-gray-600 divide-y">
                {false ? (
                  <tr>
                    <td colSpan="8" className="text-center px-6 py-8">
                      <Stack spacing={4}>
                        <Skeleton variant="rounded" height={30} />
                        <Skeleton variant="rounded" height={25} />
                        <Skeleton variant="rounded" height={20} />
                        <Skeleton variant="rounded" height={20} />
                        <Skeleton variant="rounded" height={20} />
                      </Stack>
                    </td>
                  </tr>
                ) : (
                  Array.isArray(attendeeContactDetails?.data) &&
                  attendeeContactDetails?.data?.length > 0 &&
                  attendeeContactDetails?.data?.map((item, idx) => {
                    // const serialNumber = (page - 1) * 25 + idx + 1;

                    return (
                      <tr>
                        <td className={`px-3 py-4 whitespace-nowrap `}>
                          {idx + 1}
                        </td>

                        <td className="px-2 py-4 whitespace-nowrap ">
                          {item?.csvName}
                        </td>

                        <td className="px-2 py-4 whitespace-nowrap ">
                          {item?.firstName || "N/A"}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item?.lastName?.match(/:-\)/)
                            ? "--"
                            : item?.lastName || "N/A"}
                        </td>

                        <td className=" py-4 text-center whitespace-nowrap">
                          {item?.timeInSession}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {item?.date}
                        </td>

                        <td className="px-3 py-4 h-full">
                          <FaRegEdit className="text-xl cursor-pointer" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showModal && <ViewFullDetailsModal setModal={setShowModal} />}
      {showTimerModal && <ViewTimerModal setModal={setShowTimerModal} />}
    </>
  );
};

export default ViewParticularContact;
