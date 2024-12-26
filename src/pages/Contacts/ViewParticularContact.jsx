import React, { useEffect, useState } from "react";
import ViewFullDetailsModal from "./Modal/ViewFullDetailModal";
import ViewTimerModal from "./Modal/ViewTimerModal";
import { useDispatch, useSelector } from "react-redux";
import AddNoteForm from "./AddNoteForm";
import { FaRegEdit } from "react-icons/fa";
import {
  getLeadType,
  getNotes,
} from "../../features/actions/assign";
import EditModal from "./Modal/EditModal";
import { addUserActivity } from "../../features/actions/userActivity";
import NoteItem from "../../components/NoteItem";
import {
  getAttendee,
  getAttendeeLeadTypeByEmail,
  updateAttendee,
  updateAttendeeLeadType,
} from "../../features/actions/attendees";
import {
  Badge,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import { clearLeadType } from "../../features/slices/attendees";

const ViewParticularContact = () => {
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");

  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [uniquePhones, setUniquePhones] = useState([]);
  const [uniquePhonesCount, setUniquePhonesCount] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [noteModalData, setNoteModalData] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  const [leadTypeOptions, setLeadTypeOptions] = useState([]);

  const { attendeeContactDetails } = useSelector(
    (state) => state.webinarContact
  );

  const { selectedAttendee, attendeeLeadType } = useSelector(
    (state) => state.attendee
  );

  const { noteData, isFormLoading, leadTypeData } = useSelector(
    (state) => state.assign
  );

  useEffect(() => {
    return () => {
      dispatch(clearLeadType());
    };
  }, []);
  console.log("attendeeLeadType", attendeeLeadType);

  useEffect(() => {
    console.log("attendeeLeadType in", attendeeLeadType);
    setSelectedOption(attendeeLeadType);
  }, [attendeeLeadType]);

  useEffect(() => {
    if (!Array.isArray(selectedAttendee) || selectedAttendee.length === 0)
      return;
    const [attendee] = selectedAttendee;
    if (
      !attendee ||
      !attendee?.data ||
      !Array.isArray(attendee?.data) ||
      !attendee?.data.length
    )
      return;

    // const tempLead = attendee?.data[0]?.leadType;

    // if (tempLead) {
    //   const leadType = leadTypeOptions.find((item) => item?.value === tempLead);
    //   setSelectedOption(leadType || null);
    // } else {
    //   setSelectedOption(null);
    // }

    const uniquePhonesArr = Array.from(
      new Set(attendee?.data?.map((item) => item?.phone).filter(Boolean))
    );
    setUniquePhones(uniquePhonesArr);

    const namesArr = attendee?.data
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
  }, [selectedAttendee]);

  useEffect(() => {
    if (!leadTypeData) return;
    const options = leadTypeData.map((item) => ({
      value: item._id,
      label: item.label,
      color: item.color,
    }));
    setLeadTypeOptions(options);
  }, [leadTypeData]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    dispatch(
      updateAttendeeLeadType({ email: email, leadType: event.target.value })
    );
  };

  useEffect(() => {
    if (!isFormLoading) {
      dispatch(getNotes({ email }));
    }
  }, [isFormLoading]);

  useEffect(() => {
    dispatch(getAttendee({ email }));
    dispatch(getLeadType());
    dispatch(getAttendeeLeadTypeByEmail(email));
  }, [email]);

  const handleTimerModal = () => {
    setShowTimerModal(true);
  };

  const onConfirmEdit = (data) => {
    dispatch(updateAttendee(data)).then(() => {
      setEditModalData(null);
      addUserActivityLog({
        action: "update",
        details: `User updated information of Attendee with Email: ${email}`,
      });
      dispatch(getAttendee({ email }));
    });
  };

  const addUserActivityLog = (data) => {
    dispatch(addUserActivity(data));
  };

  useEffect(() => {
    const badgeCount = uniquePhones.map((phone) => ({
      label: phone,
      count: noteData.filter((note) => note.phone === phone).length,
    }));
    setUniquePhonesCount(badgeCount);
  }, [noteData, uniquePhones]);

  return (
    <div className="px-4 pt-14 space-y-6">
      <div className="md:p-6 p-3 bg-gray-50 rounded-lg ">
        <div className="flex gap-4 justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Attendee Contact Details
          </h2>
        </div>
        <div className=" grid lg:grid-cols-2 mb-6 gap-4 w-full">
          <div className="space-y-2">
            <div className="border rounded-lg py-2 px-3 shadow-md">
              <p>
                Email :{" "}
                <span className="ms-2 bg-slate-100 rounded-md px-3 py-1">
                  {selectedAttendee && selectedAttendee[0]?._id}
                </span>
              </p>
            </div>

            <div className="border rounded-lg py-2 px-3 shadow-md">
              <p>
                Name :{" "}
                {selectedAttendee &&
                  selectedAttendee.length > 0 &&
                  selectedAttendee[0]?.data?.map(
                    (item, index) =>
                      item?.firstName && (
                        <span
                          key={index}
                          className="ms-2 bg-slate-100 rounded-md px-3 py-1"
                        >
                          {`${item.firstName} ${item.lastName}`}
                        </span>
                      )
                  )}
              </p>
            </div>

            <div className="border rounded-lg py-1 px-3 shadow-md flex">
              <span className=" mr-3">Phone :</span>
              <div className="flex gap-3">
                {uniquePhonesCount.map((item, index) => (
                  <Badge key={index} badgeContent={item.count} color="primary">
                    <Chip label={item.label} variant="outlined" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border rounded-lg shadow-md w-full h-80 pb-3 flex flex-col">
              <div className="border-b-4 items-center px-3   flex justify-between">
                <span className="font-semibold ">Notes</span>
                <IconButton
                  onClick={() => {
                    {
                      /*TODO: Navigate to Notes Page*/
                    }
                  }}
                >
                  <OpenInNew className="text-neutral-800" />
                </IconButton>
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
                <Button
                  variant="contained"
                  className="h-10"
                  onClick={handleTimerModal}
                >
                  Set Alarm
                </Button>
              </div>
              <div className="flex items-center w-fit min-w-40 px-2 gap-3">
                <FormControl fullWidth>
                  <Select
                    labelId="lead-type-select-label"
                    value={selectedOption || ""}
                    onChange={handleChange}
                    className="shadow h-10 font-semibold"
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <span style={{ color: "#888" }}>
                            Select Lead Type
                          </span> // Placeholder style
                        );
                      }
                      const selectedOption = leadTypeOptions.find(
                        (option) => option.value === selected
                      );
                      return (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: selectedOption?.color || "#000",
                            }}
                          />
                          <span>{selectedOption?.label}</span>
                        </div>
                      );
                    }}
                  >
                    {leadTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <ListItemIcon>
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: option.color,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="border rounded-lg space-y-3 shadow-md  ">
              <div className="border-b-4 py-2">
                <span className="font-semibold px-5 ">Add Note</span>
              </div>
              <AddNoteForm
                uniquePhones={uniquePhones}
                email={email}
                addUserActivityLog={addUserActivityLog}
              />
              <div></div>
            </div>
          </div>
        </div>
        <div className="mt-12 shadow-lg rounded-lg overflow-x-auto">
          {!selectedAttendee &&
          selectedAttendee.length <= 0 &&
          selectedAttendee[0]?.data?.length <= 0 ? (
            <div className="text-lg p-2 flex justify-center w-full">
              No record found
            </div>
          ) : (
            <div className="p-2 bg-neutral-100 rounded-lg shadow-md">
              <div className=" items-center px-3 text-neutral-800  flex justify-between">
                <span className="font-semibold text-xl  ">
                  Attendee History
                </span>
                <IconButton
                  onClick={() => {
                    {
                      /*TODO: Navigate to Attendee History Page*/
                    }
                  }}
                >
                  <OpenInNew />
                </IconButton>
              </div>
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
                    selectedAttendee[0]?.data?.map((item, idx) => {
                      return (
                        <tr key={idx}>
                          <td className={`px-3 py-4 whitespace-nowrap `}>
                            {idx + 1}
                          </td>

                          <td className="px-2 py-4 whitespace-nowrap ">
                            {Array.isArray(item?.webinar) &&
                            item.webinar.length > 0
                              ? item?.webinar[0].webinarName
                              : "-"}
                          </td>

                          <td className="px-2 py-4 whitespace-nowrap ">
                            {item?.firstName || "-"}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap">
                            {item?.lastName?.match(/:-\)/)
                              ? "--"
                              : item?.lastName || "-"}
                          </td>

                          <td className=" py-4 text-center whitespace-nowrap">
                            {item?.timeInSession}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            {Array.isArray(item?.webinar) &&
                            item.webinar.length > 0
                              ? new Date(
                                  item?.webinar[0].webinarDate
                                ).toDateString()
                              : "-"}
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
            </div>
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
