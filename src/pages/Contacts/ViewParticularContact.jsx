import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { BiSolidCopy } from "react-icons/bi";

import Select from "react-select";
import ViewFullDetailsModal from "./Modal/ViewFullDetailModal";
import ViewTimerModal from "./Modal/ViewTimerModal";
import { useLocation } from "react-router-dom";
import {
  getAttendeeContactDetails,
  updateAttendeeDetails,
  updateAttendeeLeadType,
} from "../../features/actions/webinarContact";
import { useDispatch, useSelector } from "react-redux";
import AddNoteForm from "./AddNoteForm";
import { FaRegEdit } from "react-icons/fa";
import { getNotes } from "../../features/actions/assign";
import EditModal from "./Modal/EditModal";
import { formatDate } from "../../utils/extra";
import { getColor, LeadTypeOptions } from "../../utils/LeadType";
import { resetAttendeeContactDetails } from "../../features/slices/webinarContact";
import { addUserActivity } from "../../features/actions/userActivity";
import { getCustomOptions } from "../../features/actions/globalData";
import NoteItem from "../../components/NoteItem";

const ViewParticularContact = () => {
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const recordType = searchParams.get("recordType");

  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [uniquePhones, setUniquePhones] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [noteModalData, setNoteModalData] = useState(null);
  const [editModalData, setEditModalData] = useState(null);

  const { attendeeContactDetails } = useSelector(
    (state) => state.webinarContact
  );
  const { noteData, isFormLoading } = useSelector((state) => state.assign);
  useEffect(() => {
    dispatch(getAttendeeContactDetails({ email, recordType }));
    dispatch(getCustomOptions());

    return () => {
      dispatch(resetAttendeeContactDetails());
    };
  }, []);

  useEffect(() => {
    if (
      !attendeeContactDetails ||
      !attendeeContactDetails?.data ||
      !Array.isArray(attendeeContactDetails?.data) ||
      !attendeeContactDetails?.data.length
    )
      return;

    const tempLead = attendeeContactDetails?.data[0]?.leadType;

    if (tempLead) {
      const leadType = LeadTypeOptions.find((item) => item?.value === tempLead);
      setSelectedOption(leadType || null);
    } else {
      setSelectedOption(null);
    }

    const uniquePhonesArr = Array.from(
      new Set(
        attendeeContactDetails?.data?.map((item) => item?.phone).filter(Boolean)
      )
    );
    setUniquePhones(uniquePhonesArr);

    const namesArr = attendeeContactDetails?.data
      .map((item) => {
        if (item?.firstName) {
          const lastName = item?.lastName?.match(/:-\)/) ? "" : item?.lastName;
          return `${item.firstName} ${lastName || ""}`.trim();
        }
        return null;
      })
      .filter(Boolean);

    const uniqueNamesArr = Array.from(new Set(namesArr));

    setUniqueNames(uniqueNamesArr);
  }, [attendeeContactDetails]);

  useEffect(() => {
    if (!isFormLoading) {
      dispatch(getNotes({ email, recordType }));
    }
  }, [isFormLoading]);

  const handleTimerModal = () => {
    setShowTimerModal(true);
  };

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

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #CBD5E1", // Custom border style
      borderRadius: "7px",
      backgroundColor: getColor(selectedOption?.value),
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

  const onConfirmEdit = (data) => {
    dispatch(updateAttendeeDetails(data)).then(() => {
      setEditModalData(null);

      addUserActivityLog({
        action: "update",
        details: `User updated information of Attendee with Email: ${email}`,
      });
      dispatch(getAttendeeContactDetails({ email, recordType }));
    });
  };

  const handleLeadChange = (option) => {
    setSelectedOption(option);
    dispatch(
      updateAttendeeLeadType({ email, recordType, leadType: option?.value })
    ).then(() => {
      addUserActivityLog({
        action: "update",
        details: `User updated the Lead Type to '${option?.label}' for the Attendee with Email: ${email}`,
      });
    });
  };

  const addUserActivityLog = (data) => {
      dispatch(addUserActivity(data));
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
        <div className="grid grid-cols-2  gap-10 ">
          <div className="flex flex-col h-full relative overflow-hidden">
            <div className="space-y-3 relative top-0 left-0 right-0 z-10">
              <div className="border rounded-lg py-2 px-3 shadow-md">
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
                  {uniqueNames.map(
                    (item, index) =>
                      item && (
                        <span
                          key={index}
                          className="ms-2 bg-slate-100 rounded-md px-3 py-1"
                        >
                          {item}
                        </span>
                      )
                  )}
                </p>
              </div>

              <div className="border rounded-lg py-1 px-3 shadow-md">
                <p className="flex items-center">
                  Phone Number :
                  <span className="ms-2 grid lg:grid-cols-2 gap-3">
                    {uniquePhones.map(
                      (item, index) =>
                        item && (
                          <span
                            key={index}
                            onClick={() => handleCopyClick(item)}
                            className="flex justify-center items-center gap-1 bg-red-500 ms-2 p-1 text-white cursor-pointer rounded-md px-2 py-1"
                          >
                            {item}
                            <BiSolidCopy color="#050A30" size={12} />
                          </span>
                        )
                    )}
                  </span>
                </p>
              </div>
            </div>
            <div className="h-full flex-1 relative">
              <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden mt-2">
                <div className="border rounded-lg shadow-md w-full h-full">
                  <div className="border-b-4 py-2">
                    <span className="font-semibold px-3">Notes</span>
                  </div>
                  <div className="overflow-y-auto pb-10 max-h-full scrollbar-thin w-full px-3">
                    {noteData &&
                      noteData.map((item, index) => (
                        <NoteItem
                          key={index}
                          index={index}
                          item={item}
                          setNoteModalData={setNoteModalData}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 flex-col h-full">
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
                    options={LeadTypeOptions}
                    onChange={handleLeadChange}
                    value={selectedOption}
                    className=" font-semibold shadow  min-w-36"
                    placeholder="Lead Type "
                    styles={customStyles}
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg space-y-3 shadow-md  ">
              <div className="border-b-4 py-2">
                <span className="font-semibold px-5 ">Add Note</span>
              </div>
              <AddNoteForm
                uniquePhones={uniquePhones}
                email={email}
                recordType={recordType}
                addUserActivityLog={addUserActivityLog}
              />
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
                      <tr key={idx}>
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
                          <FaRegEdit
                            onClick={() => setEditModalData(item)}
                            className="text-xl cursor-pointer"
                          />
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
      {noteModalData && (
        <ViewFullDetailsModal
          modalData={noteModalData}
          setModalData={setNoteModalData}
        />
      )}
      {showTimerModal && <ViewTimerModal setModal={setShowTimerModal} />}
      {editModalData && (
        <EditModal
          setModal={setEditModalData}
          initialData={editModalData}
          onConfirmEdit={onConfirmEdit}
        />
      )}
    </>
  );
};

export default ViewParticularContact;
