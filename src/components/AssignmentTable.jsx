import { Skeleton, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { getColor } from "../utils/LeadType";
import { useDispatch, useSelector } from "react-redux";
import { addUserActivity } from "../features/actions/userActivity";

const AssignmentTable = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isEmployee} = useSelector(state => state.userActivity)
  const {
    isLoading,
    assignmentData = [],
    page = 1,
    LIMIT = 10,
    setAssigned = null,
    checkboxRefs,
  } = props;

  const handleViewFullDetails = (item) => {
    navigate(
      `/particularContact?email=${encodeURIComponent(
        item?._id
      )}&recordType=${encodeURIComponent(item?.records[0]?.recordType)}`
    );
    if(isEmployee){
      dispatch(addUserActivity({
        action: "viewDetails",
        details: `User viewed details of Attendee with Email: ${item?._id} and Record Type: ${item?.records[0]?.recordType}`
      }))
    }

  };

  console.log(assignmentData,'daa');

  return (
    <div className="mt-7 shadow-lg rounded-lg overflow-x-auto">
      { assignmentData.length <= 0 ? (
        <div className="text-lg p-2 flex justify-center w-full">
          No record found
        </div>
      ) : (
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b justify-between">
            <tr className="stickyRow">
              <th className=""></th>
              {setAssigned && <th className=""></th>}
              <th className="py-3 px-6 text-center">S No.</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">First Name</th>
              <th className="py-3 px-6">Phone Number</th>
              {/* <th className="py-3 px-6">Last Name</th> */}
              <th className="py-3 text-center px-6">Webinar Minutes</th>
              <th className="py-3 text-center px-6">Record Type</th>
              <th className="py-3 text-center px-6">Total Records</th>
              <th className="py-3 px-6 stickyFieldRight">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {isLoading ? (
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
            ) : Array.isArray(assignmentData) && assignmentData?.length > 0 && assignmentData[0]?.records ? (
              assignmentData.map((item, index) => {
                const serialNumber = ((page - 1) * LIMIT) + ( index + 1);
                return (
                  <tr key={index}>
                    <td className="text-center whitespace-nowrap relative">
                      <div
                        className="w-[7px] h-full inset-0 absolute"
                        style={{
                          backgroundColor: getColor(item?.records[0]?.leadType),
                        }}
                      ></div>
                    </td>
                    {setAssigned && (
                      <td className="ps-4 py-4 whitespace-nowrap">
                        <input
                          ref={(el) => (checkboxRefs.current[index] = el)}
                          onClick={(e) => {
                            if (e.target.checked) {
                              setAssigned((prev) => [
                                ...prev,
                                { attendeeId: item?._id, email: item?.email },
                              ]);
                            } else {
                              setAssigned((prev) =>
                                prev.filter(
                                  (attendeeObj) =>
                                    attendeeObj.attendeeId !== item?._id
                                )
                              );
                            }
                          }}
                          type="checkbox"
                          className="scale-125"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item?.records[0]?.firstName || "--"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item?.records[0]?.phone || "--"}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {item?.records?.reduce(
                        (acc, time) => acc + time?.timeInSession,
                        0
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize text-center whitespace-nowrap">
                      {item?.records[0]?.recordType}
                    </td>
                    <td className="px-6 py-4  text-center whitespace-nowrap">
                      {item?.records?.length}
                    </td>
                    <td className="px-3 whitespace-nowrap stickyFieldRight">
                      <Link
                        onClick={() => {
                          handleViewFullDetails(item);
                        }}
                        className="cursor-pointer py-2 px-3 font-semibold text-indigo-500 hover:text-indigo-600 duration-150 hover:bg-gray-50 rounded-lg
                      "
                      >
                        View full details
                      </Link>
                      {setAssigned && (
                        <button className="py-2 px-3 leading-none font-semibold text-red-500 hover:text-red-600 duration-150 hover:bg-gray-50 rounded-lg">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <div className="text-gray-700 p-3">No Data Found</div>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignmentTable;
