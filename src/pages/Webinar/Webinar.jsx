import { Button, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteWebinarContacts,
  getAllWebinars,
} from "../../features/actions/webinarContact";
import Delete from "../../components/Webinar/delete";
import Pagination from "@mui/material/Pagination";
import CreateWebinar from "../../components/Webinar/CreateWebinar";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import { openModal } from "../../features/slices/modalSlice";
import { formatDateAsNumber } from "../../utils/extra";
import { resetWebinarSuccess } from "../../features/slices/webinarContact";

const MeetingDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logUserActivity = useAddUserActivity();
  const { isLoading, isSuccess, webinarData, totalPages } = useSelector(
    (state) => state.webinarContact
  );
  
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [id, setId] = useState();
  const [webinarName, setWebinarName] = useState(null);

  const handleDeleteModal = (ID, name) => {
    setShowDeleteModal(true);
    setId(ID);
    setWebinarName(name);
  };

  const handleDelete = () => {
    dispatch(deleteWebinarContacts(id));
    setShowDeleteModal(false);
    setId("");
  };

  const handlePagination = (e, p) => {
    setPage(p);
    setSearchParams({ page: p });
  };

  useEffect(() => {
    console.log("soemtsdf");
    dispatch(getAllWebinars({ page, limit: 10 }));
  }, [page]);

  const handleRowClick = (id) => {
    logUserActivity({
      action: "navigate",
      navigateType: "page",
      detailItem: `/webinarDetails/${id}`,
    });
    navigate(`/webinarDetails/${id}`);
  };

  useEffect(() => {
    if (isSuccess) {
      setShowDeleteModal(false)
      dispatch(getAllWebinars({ page: 1, limit: 10 }));
      dispatch(resetWebinarSuccess());
    }
  }, [isSuccess]);

  const createWebinarModalName = "createWebinarModal";
  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10">
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
              Manage Webinar Details
            </h3>
            {/* <p className="text-gray-600 text-[15px] font-medium mt-2">
              This page is for parsing CSV and XLSX file here.
            </p> */}
          </div>
          <div className="mt-3 md:mt-0 space-x-5">
            <Button
              onClick={() => dispatch(openModal(createWebinarModalName))}
              variant="contained"
              color="primary"
              className="cursor-pointer inline-block px-4 py-2 duration-150 font-medium rounded-lg md:text-sm"
              sx={{
                backgroundColor: "#6366f1", // Tailwind color equivalent for bg-indigo-600
                textTransform: "none", // Keeps text normal (not uppercase)
                fontWeight: 500, // Match font weight to Tailwind's 'font-medium'
                fontSize: { xs: "0.875rem", md: "1rem" }, // Responsive font size
                "&:hover": {
                  backgroundColor: "#4f46e5", // Tailwind's hover:bg-indigo-700 color
                },
                "&:active": {
                  backgroundColor: "#4338ca", // Tailwind's active:bg-indigo-700 color
                },
              }}
            >
              Create Webinar
            </Button>
          </div>
        </div>
        <div className="mt-5 shadow-lg rounded-lg overflow-x-auto">
          {isLoading ? (
            <Stack spacing={4}>
              <Skeleton variant="rounded" height={35} />
              <Skeleton variant="rounded" height={25} />
              <Skeleton variant="rounded" height={25} />
              <Skeleton variant="rounded" height={25} />
              <Skeleton variant="rounded" height={25} />
            </Stack>
          ) : (
            <table className="w-full table-auto text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b justify-between">
                <tr>
                  <th className="py-3 px-6">S No.</th>
                  <th className="py-3 px-6">Webinar Name</th>
                  <th className="py-3 px-6">Webinar Date</th>
                  <th className="py-3 px-6">Total Participants</th>
                  <th className="py-3 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {Array.isArray(webinarData) &&
                  webinarData.length > 0 &&
                  webinarData.map((item, idx) => {
                    const serialNumber = (page - 1) * 8 + idx + 1;
                    return (
                      <tr
                        key={idx}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleRowClick(item?._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {serialNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item?.webinarName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDateAsNumber(item?.webinarDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item?.totalParticipants || 0}
                        </td>

                        <td
                          className="px-3 whitespace-nowrap flex gap-2"
                          onClick={(e) => e.stopPropagation()} // Prevent row click event propagation
                        >
                          {/* Update Details */}
                          <Tooltip title="Update Details" arrow>
                            <button
                              onClick={() =>
                                dispatch(
                                  openModal({
                                    modalName: createWebinarModalName,
                                    data: item,
                                  })
                                )
                              }
                              className="p-2 rounded-lg text-[#006A67] hover:text-[#1b3d3c] duration-150 hover:bg-gray-50"
                            >
                              <EditIcon />
                            </button>
                          </Tooltip>

                          {/* Delete */}
                          <Tooltip title="Delete" arrow>
                            <button
                              onClick={() =>
                                handleDeleteModal(item?._id, item?.name)
                              }
                              className="p-2 rounded-lg text-red-400 hover:text-red-600 duration-150 hover:bg-gray-50"
                            >
                              <DeleteIcon />
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <Pagination
          count={1}
          page={Number(page)}
          color="primary"
          onChange={handlePagination}
        />
      </div>

      {showDeleteModal && (
        <Delete
          setModal={setShowDeleteModal}
          webinarName={webinarName}
          id={id}
        />
      )}

      <CreateWebinar
        modalName={createWebinarModalName}
      />
    </>
  );
};

export default MeetingDetails;
