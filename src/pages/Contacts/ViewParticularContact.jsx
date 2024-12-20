import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { BiSolidCopy } from "react-icons/bi";

import Select from "react-select";
import ViewFullDetailsModal from "./Modal/ViewFullDetailModal";
import ViewTimerModal from "./Modal/ViewTimerModal";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddNoteForm from "./AddNoteForm";
import { FaRegEdit } from "react-icons/fa";
import { getNotes } from "../../features/actions/assign";
import EditModal from "./Modal/EditModal";
import { formatDate } from "../../utils/extra";
import { getColor, LeadTypeOptions } from "../../utils/LeadType";
import { addUserActivity } from "../../features/actions/userActivity";
import { getCustomOptions } from "../../features/actions/globalData";
import NoteItem from "../../components/NoteItem";
const dummyNotes = [
  {
    updatedAt: "2024-12-10T10:30:00Z",
    callDuration: { hr: 0, min: 15, sec: 30 },
    status: "Completed",
    note: "Discussed the project requirements and next steps.",
  },
  {
    updatedAt: "2024-12-11T14:45:00Z",
    callDuration: { hr: 1, min: 5, sec: 0 },
    status: "In Progress",
    note: "Reviewed the initial design draft with the client.",
  },
  {
    updatedAt: "2024-12-12T09:20:00Z",
    callDuration: { hr: 0, min: 30, sec: 0 },
    status: "Pending",
    note: "Scheduled a follow-up meeting to finalize the design.",
  },
  {
    updatedAt: "2024-12-13T16:00:00Z",
    callDuration: { hr: 0, min: 45, sec: 10 },
    status: "Completed",
    note: "Confirmed the delivery timeline and shared the project plan.",
  },
  {
    updatedAt: "2024-12-14T11:15:00Z",
    callDuration: { hr: 0, min: 20, sec: 0 },
    status: "Pending",
    note: "Waiting for client feedback on the updated draft.",
  },
];

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
  console.log(noteData);

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
    // dispatch(updateAttendeeDetails(data)).then(() => {
    //   setEditModalData(null);
    //   addUserActivityLog({
    //     action: "update",
    //     details: `User updated information of Attendee with Email: ${email}`,
    //   });
    //   dispatch(getAttendeeContactDetails({ email, recordType }));
    // });
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

  return (
    <div className="px-4 pt-14 space-y-6">
      <div className="md:p-6 p-3 bg-gray-50 rounded-lg ">
        <div className="flex gap-4 justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Attendee Contact Details</h2>
        </div>
        <div className=" grid lg:grid-cols-2 mb-6 gap-4 w-full">
          <div className="space-y-2">
            <div className="border rounded-lg py-2 px-3 shadow-md">
              <p>
                Email :{" "}
                <span className="ms-2 bg-slate-100 rounded-md px-3 py-1">
                  someemail@glsd.com
                </span>
              </p>
            </div>
            <div className="flex justify-between border rounded-lg py-2 px-3 shadow-md">
              <p>Name : some name</p>
            </div>

            <div className="border rounded-lg py-1 px-3 shadow-md">
              <p className="flex items-center">
                Phone Number :
                <span className="ms-2 grid lg:grid-cols-2 gap-3">
                  2342342343
                </span>
              </p>
            </div>

            <div className="border rounded-lg shadow-md w-full h-80 pb-3 flex flex-col">
              <div className="border-b-4 py-2">
                <span className="font-semibold px-3">Notes</span>
              </div>
              <div className="overflow-y-auto space-y-2 pb-10 scrollbar-thin w-full px-3">
                {Array.isArray(noteData) &&
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

          <div className="space-y-3 flex-col h-full">
            <div className="flex  justify-between gap-10  items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTimerModal}
                  className=" font-semibold shadow rounded-md py-2 bg-blue-600 hover:bg-blue-700 text-white min-w-36"
                >
                  Set Alarm
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="outline-none">
                  <Select
                    isClearable="true"
                    options={LeadTypeOptions}
                    onChange={handleLeadChange}
                    value={selectedOption}
                    className=" font-semibold shadow  min-w-36"
                    placeholder="Lead Type "
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
          {!attendeeContactDetails?.data ||
          attendeeContactDetails?.data?.length <= 0 ? (
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
    </div>
  );
};

export default ViewParticularContact;
