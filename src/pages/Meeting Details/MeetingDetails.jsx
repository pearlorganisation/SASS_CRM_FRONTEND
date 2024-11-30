import { Button, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import UploadCsvModal from "./UploadCsvModal";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteWebinarContacts,
  getAllWebinars,
} from "../../features/actions/webinarContact";
import Delete from "../../components/Webinar/delete";
import UploadXslxModal from "./UploadXslxModal";
import Pagination from "@mui/material/Pagination";
import UpdateCsvXslxModal from "./UpdateCsvXslxModal";
import CreateWebinar from "../../components/Webinar/CreateWebinar";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAddUserActivity from "../../hooks/useAddUserActivity ";

const MeetingDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logUserActivity = useAddUserActivity();

  const { isLoading, isDeleted, webinarData, totalPages } = useSelector(
    (state) => state.webinarContact
  );

  const [showModal, setShowModal] = useState(false);
  const [showXslxModal, setShowXslxModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
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

  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [editWebinarData, setEditWebinarData] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const dummyWebinars = [
    {
      _id: 1,
      name: "React Basics Webinar",
      date: "2024-12-01",
      totalParticipants: 50,
    },
    {
      _id: 2,
      name: "Advanced JavaScript Techniques",
      date: "2024-12-10",
      totalParticipants: 75,
    },
    {
      _id: 3,
      name: "UI/UX Design Principles",
      date: "2024-12-15",
      totalParticipants: 40,
    },
    {
      _id: 4,
      name: "Tailwind CSS Crash Course",
      date: "2024-12-20",
      totalParticipants: 60,
    },
  ];

  const handlePagination = (e, p) => {
    setPage(p);
    setSearchParams({ page: p });
  };

  // useEffect(() => {
  //   dispatch(getAllWebinars(page));
  // }, [page]);

  useEffect(() => {
    if (webinarData?.status) {
      dispatch(getAllWebinars(page));
    }
  }, [webinarData, page]);

  useEffect(() => {
    if (isDeleted) {
      dispatch(getAllWebinars(page));
    }
  }, [isDeleted, page]);

  const handleRowClick = (id) => {
    logUserActivity({
      action: "navigate",
      navigateType: "page",
      detailItem: `/attendees/${id}`,
    });
    navigate(`/attendees/${id}`);
  };

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
              onClick={() => setIsCreateModalOpen(true)}
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
            {/* <a
              onClick={handleXslxModal}
              className="cursor-pointer inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-700 md:text-sm"
            >
              Upload XSLX File
            </a>
            <a
              onClick={handleModal}
              className="cursor-pointer inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-700 md:text-sm"
            >
              Upload CSV File
            </a> */}
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
                {Array.isArray(dummyWebinars) &&
                  dummyWebinars.length > 0 &&
                  dummyWebinars?.map((item, idx) => {
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
                          {item?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item?.date || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item?.totalParticipants}
                        </td>

                        {showUpdateModal &&
                          createPortal(
                            <UpdateCsvXslxModal
                              setModal={setShowUpdateModal}
                              csvId={item?._id}
                            />,
                            document.body
                          )}

                        <td
                          className="px-3 whitespace-nowrap flex gap-2"
                          onClick={(e) => e.stopPropagation()} // Prevent row click event propagation
                        >
                          {/* Update Details */}
                          <Tooltip title="Update Details" arrow>
                            <button
                              onClick={() => {
                                setEditWebinarData(item);
                                setIsCreateModalOpen(true);
                              }}
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
      {showModal &&
        createPortal(<UploadCsvModal setModal={setShowModal} />, document.body)}
      {showXslxModal &&
        createPortal(
          <UploadXslxModal setModal={setShowXslxModal} />,
          document.body
        )}

      {showDeleteModal && (
        <Delete
          setModal={setShowDeleteModal}
          webinarName={webinarName}
          handleDelete={handleDelete}
        />
      )}

      <CreateWebinar
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => console.log(data)}
        webinarData={editWebinarData}
        clearData={() => {
          console.log("clearing data");
          setEditWebinarData(null);
        }}
      />
    </>
  );
};

export default MeetingDetails;
