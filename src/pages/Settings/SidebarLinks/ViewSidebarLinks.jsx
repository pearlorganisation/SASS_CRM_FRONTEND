import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconButton, Skeleton, Stack, Tooltip } from "@mui/material";
import { deleteSidebarLink, getAllSidebarLinks } from "../../../features/actions/sidebarLink";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
const ViewSidebarLinks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarLinkData, isLoading } = useSelector(
    (state) => state.sidebarLink
  );

  const [selectedLink, setSelectedLink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllSidebarLinks());
  }, []);

  const handleOpenModal = (link) => {
    setSelectedLink(link);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLink(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteSidebarLink(id)).then((res) => {
      if (res?.meta.requestStatus === "fulfilled") {
        dispatch(getAllSidebarLinks());
      }

    });
  };

  return (
    <div>
      <div className="p-10">
        <div className="flex items-center justify-between flex-col md:flex-row space-y-4 md:space-y-0 pb-8 bg-white">
          <button
            onClick={() => navigate("/sidebarLinks/addSidebarLink")}
            className="bg-blue-600 rounded-md text-white px-4 py-2 font-semibold hover:bg-blue-700"
          >
            Add Sidebar Link
          </button>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Link
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="text-center px-6 py-8">
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
                Array.isArray(sidebarLinkData) &&
                sidebarLinkData.map((item, idx) => (
                  <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{item?.title}</td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {item?.link}
                    </td>
                    <td className="px-6 py-4 flex">
                      {/* View Icon */}
                      <Tooltip title="View Sidebar Link Info" arrow>
                        <IconButton
                          color="primary"
                          className=" group"
                          onClick={() => handleOpenModal(item)}
                        >
                          <VisibilityIcon className="text-indigo-500 group-hover:text-indigo-600" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Sidebar Link" arrow>
                      <IconButton
                          color="primary"
                          className=" group"
                          onClick={() => handleDelete(item?._id)}
                        >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Viewing Details */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4 ">Sidebar Link Details</h2>
            {selectedLink && (
              <div className="space-y-2 w-full">
              <p>
                <span className="font-semibold">Title:</span> {selectedLink.title}
              </p>
              <p className="break-words w-full">
                <span className="font-semibold">Link:</span> {selectedLink.link}
              </p>
            </div>
            
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSidebarLinks;
