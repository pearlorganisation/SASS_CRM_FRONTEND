import { Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import EditModal from "./Modal/EditModal";
import { getAttendee, updateAttendee } from "../../features/actions/attendees";
import { useParams } from "react-router-dom";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";

const AttendeeHistory = () => {
  const addUserActivityLog = useAddUserActivity();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const { selectedAttendee } = useSelector((state) => state.attendee);
  const { userData } = useSelector((state) => state.auth);
  const { employeeModeData } = useSelector((state) => state.employee);

  useEffect(() => {
    setIsDataVisible(false);
    console.log("selectedAttendee", selectedAttendee);

    if (
      Array.isArray(selectedAttendee) &&
      selectedAttendee.length > 0 &&
      Array.isArray(selectedAttendee[0]?.data) &&
      selectedAttendee[0]?.data.length > 0
    ) {
      setIsDataVisible(true);
    }
  }, [selectedAttendee]);

  const onConfirmEdit = (data) => {
    dispatch(updateAttendee(data)).then(() => {
      setEditModalData(null);
      addUserActivityLog({
        action: "update",
        details: `User updated information of Attendee with Email: ${email}`,
      });
      setIsDataVisible(false);
      dispatch(getAttendee({ email }));
    });
  };

  useEffect(() => {
    console.log("email", email);
    setIsDataVisible(false);
    dispatch(getAttendee({ email }));
  }, [email]);

  return (
    <div className="px-6 md:px-10 pt-14 space-y-6">
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="flex gap-4 justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Attendee History</h2>
        </div>

        <div className="mt-12 shadow-lg rounded-lg overflow-x-auto">
          {!isDataVisible ? (
            <div className="text-lg p-2 flex justify-center w-full">
              No record found
            </div>
          ) : (
            <div className="p-2 bg-neutral-100 rounded-lg shadow-md">
              <table className="w-full table-auto text-sm text-left ">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b justify-between">
                  <tr>
                    <th className="py-3 px-2">S No.</th>
                    <th className="py-3 px-2">Webinar</th>
                    <th className="py-3 px-2">First Name</th>
                    <th className="py-3 px-2">Last Name</th>
                    <th className="py-3  text-center">Webinar Minutes</th>
                    <th className="py-3 px-2">Webinar Date</th>
                    <ComponentGuard
                      conditions={[
                        employeeModeData ? false : true,
                        userData?.isActive,
                      ]}
                    >
                      <th className="py-3 px-2">Action</th>
                    </ComponentGuard>
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
                    selectedAttendee[0].data.map((item, idx) => {
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
                          <ComponentGuard
                            conditions={[
                              employeeModeData ? false : true,
                              userData?.isActive,
                            ]}
                          >
                            <td className="px-3 py-4 h-full">
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
          )}
        </div>
      </div>
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

export default AttendeeHistory;
