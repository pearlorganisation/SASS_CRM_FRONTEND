import React, { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddNoteForm from "./AddNoteForm";
import { FaRegEdit } from "react-icons/fa";
import { getLeadType, getNotes } from "../../features/actions/assign";
import { addUserActivity, getUserActivityByEmail } from "../../features/actions/userActivity";
import NoteItem from "../../components/NoteItem";
import {
  getAttendee,
  getAttendeeLeadTypeByEmail,
  updateAttendee,
  updateAttendeeLeadType,
} from "../../features/actions/attendees";
import {
  Alert,
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { Add, OpenInNew } from "@mui/icons-material";
import { clearLeadType } from "../../features/slices/attendees";
import { useNavigate } from "react-router-dom";
import { cancelAlarm, getAttendeeAlarm } from "../../features/actions/alarm";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import ProductLevelTable from "./ProductLevelTable";
import { DateFormat, formatDateAsNumber } from "../../utils/extra";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import useRoles from "../../hooks/useRoles";
import ModalFallback from "../../components/Fallback/ModalFallback";
import LogsModal from "./Modal/LogsModal";
import { createPortal } from "react-dom";

// Lazy load modals
const ViewFullDetailsModal = lazy(() => import("./Modal/ViewFullDetailModal"));
const ViewTimerModal = lazy(() => import("./Modal/ViewTimerModal"));
const EditModal = lazy(() => import("./Modal/EditModal"));
const AddEnrollmentModal = lazy(() => import("./Modal/AddEnrollmentModal"));

const ViewParticularContact = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roles = useRoles();
  
  const logUserActivity = useAddUserActivity();

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const attendeeId = searchParams.get("attendeeId");
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [uniquePhones, setUniquePhones] = useState([]);
  const [uniquePhonesCount, setUniquePhonesCount] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [noteModalData, setNoteModalData] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  const [leadTypeOptions, setLeadTypeOptions] = useState([]);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [attendeeHistoryData, setAttendeeHistoryData] = useState([]);

  const { userData } = useSelector((state) => state.auth);
  const dateFormat = userData?.dateFormat || DateFormat.MM_DD_YYYY;
  const { selectedAttendee, attendeeLeadType, attendeeEnrollments } =
    useSelector((state) => state.attendee);

  const { noteData, isFormSuccess, leadTypeData } = useSelector(
    (state) => state.assign
  );
  const { employeeModeData } = useSelector((state) => state.employee);
  const { attendeeAlarm } = useSelector((state) => state.alarm);

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);

  const openCancelAlarmDialog = () => {
    setOpenCancelDialog(true);
  };

  const closeCancelAlarmDialog = () => {
    setOpenCancelDialog(false);
  };

  useEffect(() => {
    dispatch(getNotes({ email }));

    return () => {
      dispatch(clearLeadType());
    };
  }, []);

  useEffect(() => {
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

    setAttendeeHistoryData((prev) => {
      const data = [...selectedAttendee[0]?.data];
      return data.filter((item, idx) => {
        let index = data.findIndex((item2) => {
          return item2.webinar[0].webinarName === item.webinar[0].webinarName;
        });

        if (index >= 0 && index === idx && item.isAttended === true) {
          return item;
        } else if (index >= 0 && index !== idx && item.isAttended === false) {
          return;
        } else {
          return item;
        }
      });
    });
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
    ).then((res) => {
      if(res.meta.requestStatus === "fulfilled"){
        logUserActivity({
          action: "update",
          details: `User updated lead type of Attendee with Email: ${email}`,
          activityItem: email,
        });
      }
    });
  };

  useEffect(() => {
    if (isFormSuccess) {
      dispatch(getNotes({ email }));
    }
  }, [isFormSuccess]);

  useEffect(() => {
    dispatch(getAttendee({ email }));
    dispatch(getLeadType());
    dispatch(getAttendeeLeadTypeByEmail(email));
    dispatch(getAttendeeAlarm({ email }));
  }, [email]);

  const handleTimerModal = () => {
    setShowTimerModal(true);
  };

  const onConfirmEdit = (data) => {
    dispatch(updateAttendee(data)).then((res) => {
      if(res.meta.requestStatus === "fulfilled"){
        logUserActivity({
          action: "update",
          details: `User updated information of Attendee with Email: ${email}`,
          activityItem: email,
        });
        setEditModalData(null);
        dispatch(getAttendee({ email }));
      }
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
    const invalidPhones = noteData.filter((note) => {
      if (typeof note.status === "string") {
        const tempNote = note.status.toLowerCase().trim();
        return tempNote === "wrong no" || tempNote === "invalid no";
      }
      return false;
    });

    setUniquePhonesCount(
      badgeCount.map((item) => ({
        ...item,
        isInvalid: invalidPhones.some((note) => note.phone === item.label),
      }))
    );
  }, [noteData, uniquePhones]);

  const cancelMyAlarm = (id) => {
    dispatch(cancelAlarm({ id }));
  };

  return (
    <div className=" px-4 pt-14 space-y-6">
      <div className="md:p-6 p-3 bg-gray-50 rounded-lg ">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Attendee Contact Details
          </h2>
          {attendeeAlarm && userData?.isActive && (
            <Alert
              className="right-6 top-3 w-full md:max-w-[500px] transition duration-300 "
              severity="info"
              icon={false}
              action={
                <Button
                  color="error"
                  size="small"
                  onClick={() => {
                    openCancelAlarmDialog();
                  }}
                >
                  Cancel Alarm
                </Button>
              }
            >
              <Stack>
                <Box>
                  <strong>Date:</strong>
                  {new Date(attendeeAlarm.date).toLocaleString("en-IN")}
                </Box>
                <Box className="line-clamp-1 hover:line-clamp-none overflow-hidden transition duration-300">
                  <strong>Note:</strong> {attendeeAlarm.note}
                </Box>
              </Stack>
            </Alert>
          )}
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
                {Array.isArray(uniqueNames) &&
                  uniqueNames.map((item, index) => (
                    <span
                      key={index}
                      className="ms-2 bg-slate-100 rounded-md px-3 py-1"
                    >
                      {`${item || ""}`.trim()}
                    </span>
                  ))}
              </p>
            </div>

            <div className="border rounded-lg py-1 px-3 shadow-md flex">
              <span className=" mr-3 whitespace-nowrap">Phone :</span>
              <div className="flex gap-3 flex-wrap">
                {uniquePhonesCount.map((item, index) => (
                  <Badge key={index} badgeContent={item.count} color="primary">
                    <Chip
                      label={item.label}
                      color={item.isInvalid ? "error" : undefined}
                      variant="outlined"
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border rounded-lg shadow-md w-full h-80 pb-3 flex flex-col">
              <div className="border-b-4 items-center px-3   flex justify-between">
                <span className="font-semibold ">Notes</span>
                <IconButton
                  onClick={() =>
                    navigate(`/particularContact/notes?email=${email}`)
                  }
                >
                  <OpenInNew className="text-neutral-800" />
                </IconButton>
              </div>
              <div className="overflow-y-auto space-y-2 pb-10 scrollbar-thin w-full px-3">
                {Array.isArray(noteData) &&
                  noteData.map((item, index) => (
                    <NoteItem
                      key={index}
                      index={noteData.length - index}
                      item={item}
                      setNoteModalData={setNoteModalData}
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 flex-col h-full">
            <ComponentGuard
              conditions={[employeeModeData ? false : true, userData?.isActive]}
            >
              <div className="flex  justify-between gap-10  items-center">
                <div className="flex items-center gap-3">
                  <Button
                    variant="contained"
                    className="h-10"
                    onClick={handleTimerModal}
                  >
                    Set Alarm
                  </Button>
                  <Button
                    variant="contained"
                    className="h-10"
                    onClick={() => setShowLogsModal(true)}
                  >
                    Logs
                  </Button>
                </div>
                <div className="flex items-center w-fit min-w-40 px-1 gap-3">
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
                                backgroundColor:
                                  selectedOption?.color || "#000",
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
            </ComponentGuard>

            <div className="border rounded-lg space-y-3 shadow-md  ">
              <div className="border-b-4 py-2">
                <span className="font-semibold px-5 ">Add Note</span>
              </div>
              <AddNoteForm
                uniquePhones={uniquePhones}
                userData={userData}
                employeeModeData={employeeModeData}
                email={email}
                attendeeId={attendeeId}
                addUserActivityLog={logUserActivity}
              />
              <div></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 ">
          <div className="mt-12 shadow-lg rounded-lg overflow-x-auto">
            {!selectedAttendee &&
            selectedAttendee.length <= 0 &&
            selectedAttendee[0]?.data?.length <= 0 ? (
              <div className="text-lg p-2 flex justify-center w-full">
                No record found
              </div>
            ) : (
              <div className="p-2 bg-neutral-100 rounded-lg shadow-md">
                <div className="w-full items-center px-3 text-neutral-800  flex justify-between">
                  <span className="font-semibold text-xl  ">
                    Attendee History
                  </span>
                  <IconButton
                    onClick={() =>
                      navigate(
                        `/particularContact/attendee-History?email=${email}`
                      )
                    }
                  >
                    <OpenInNew />
                  </IconButton>
                </div>
                <div className="  max-h-96 overflow-y-auto">
                  <div className="w-full overflow-auto ">
                    <table className="w-full table-auto text-sm text-center ">
                      <thead className="bg-gray-50 text-gray-600 font-medium border-b justify-between ">
                        <tr>
                          <th className="py-3 px-1">S No.</th>
                          <th className="py-3 px-1 ">Webinar</th>
                          <th className="py-3 px-1">Type</th>
                          <th className="py-3 px-1 min-w-[150px]">
                            First Name
                          </th>
                          <th className="py-3 px-1 min-w-[150px]">Last Name</th>
                          <th className="py-3 min-w-[200px]">
                            Webinar Minutes
                          </th>
                          <th className="py-3 px-1">Location</th>
                          <th className="py-3 px-1 min-w-[150px]">
                            Webinar Date
                          </th>
                          <th className="py-3 px-1">Tags</th>
                          <th className="py-3 px-1 stickyFieldRight">Action</th>
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
                                <Skeleton variant="rounded" height={20} />
                              </Stack>
                            </td>
                          </tr>
                        ) : (
                          attendeeHistoryData?.map((item, idx) => {
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
                                  {item?.isAttended ? "Sales" : "Reminder"}
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

                                <td className=" py-4 text-center whitespace-nowrap">
                                  {item?.location}
                                </td>

                                <td className="px-3 py-4 whitespace-nowrap">
                                  {Array.isArray(item?.webinar) &&
                                  item.webinar.length > 0
                                    ? formatDateAsNumber(
                                        item?.webinar[0].webinarDate
                                      )
                                    : "-"}
                                </td>
                                <td className="px-3 py-4  whitespace-nowrap">
                                  <div className="flex flex-nowrap gap-2">
                                    {Array.isArray(item?.tags)
                                      ? item?.tags.map((tag, idx) => (
                                          <span
                                            key={idx}
                                            className="px-2 py-1 rounded-full text-xs bg-gray-300 text-gray-800"
                                          >
                                            {tag}
                                          </span>
                                        ))
                                      : "-"}
                                  </div>
                                </td>
                                <ComponentGuard
                                  conditions={[
                                    employeeModeData ? false : true,
                                    userData?.isActive,
                                  ]}
                                >
                                  <td className="px-3 py-4 h-full stickyFieldRight">
                                    <FaRegEdit
                                      onClick={() => setEditModalData(item)}
                                      className="text-xl cursor-pointer"
                                    />
                                  </td>
                                </ComponentGuard>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-12 shadow-lg rounded-lg overflow-x-auto">
            {!attendeeEnrollments && attendeeEnrollments.length <= 0 ? (
              <div className="text-lg p-2 flex justify-center w-full">
                No record found
              </div>
            ) : (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className=" mb-2 items-center px-3 text-neutral-800  flex justify-between">
                  <span className="font-semibold text-xl  ">
                    Enrollments History
                  </span>

                  <ComponentGuard
                    conditions={[
                      employeeModeData ? false : true,
                      userData?.isActive,
                    ]}
                  >
                    <Add
                      className="cursor-pointer hover:bg-gray-200 transition duration-300"
                      onClick={() => setShowEnrollmentModal(true)}
                      fontSize="medium"
                    >
                      <OpenInNew />
                    </Add>
                  </ComponentGuard>
                </div>

                <ProductLevelTable email={email} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Suspense fallback={<ModalFallback />}>
        {noteModalData && (
          <ViewFullDetailsModal
            modalData={noteModalData}
            setModalData={setNoteModalData}
          />
        )}
        {showTimerModal && (
          <ViewTimerModal
            setModal={setShowTimerModal}
            email={email}
            dateFormat={dateFormat}
            attendeeId={attendeeId}
            logUserActivity={logUserActivity}
          />
        )}
        {editModalData && (
          <EditModal
            setModal={setEditModalData}
            initialData={editModalData}
            onConfirmEdit={onConfirmEdit}
          />
        )}
        {showEnrollmentModal && (
          <AddEnrollmentModal
            setModal={setShowEnrollmentModal}
            attendeeEmail={selectedAttendee && selectedAttendee[0]?._id}
            webinarData={attendeeHistoryData}
            logUserActivity={logUserActivity}
          />
        )}
        {showLogsModal && createPortal(
          <LogsModal setModal={setShowLogsModal} email={email} />,
          document.body
        )}
      </Suspense>
      <Dialog
        open={openCancelDialog}
        onClose={closeCancelAlarmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cancel Alarm?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel this alarm?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelAlarmDialog}>Disagree</Button>
          <Button
            onClick={() => {
              cancelMyAlarm(attendeeAlarm._id);
              closeCancelAlarmDialog();
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewParticularContact;
