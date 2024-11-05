import { Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import UploadCsvModal from "./UploadCsvModal";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteWebinarContacts,
  getAllWebinars,
} from "../../features/actions/webinarContact";
import Delete from "../../components/delete";
import UploadXslxModal from "./UploadXslxModal";
import Pagination from "@mui/material/Pagination";

const MeetingDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isDeleted, webinarData ,totalPages} = useSelector(
    (state) => state.webinarContact
  );

  const [showModal, setShowModal] = useState(false);
  const [showXslxModal, setShowXslxModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [id, setId] = useState();
  const [webinarName,setWebinarName] = useState(null);

  const handleModal = () => setShowModal(true);
  const handleXslxModal = () => setShowXslxModal(true);
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

  const handlePagination = (e, p) => {
    setPage(p);
    setSearchParams({ page: p });
  };

  useEffect(() => {
    dispatch(getAllWebinars(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (webinarData?.status) {
      dispatch(getAllWebinars(page));
    }
  }, [webinarData, dispatch, page]);

  useEffect(() => {
    if (isDeleted) {
      dispatch(getAllWebinars(page));
    }
  }, [isDeleted, dispatch, page]);

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10">
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
              Manage Webinar Details
            </h3>
            <p className="text-gray-600 text-[15px] font-medium mt-2">
              This page is for parsing CSV and XLSX file here.
            </p>
          </div>
          <div className="mt-3 md:mt-0 space-x-5">
            <a
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
            </a>
          </div>
        </div>
        <div className="mt-5 shadow-lg rounded-lg overflow-x-auto">
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
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center px-6 py-8">
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
                Array.isArray(webinarData) &&
                webinarData.length > 0 &&
                webinarData?.map((item, idx) => {
                  const serialNumber = (page - 1) * 8 + idx + 1;
                  return (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item?.csvName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item?.date || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item?.count}
                      </td>
                      <td className="px-3 whitespace-nowrap">
                        <a
                          onClick={() => navigate(`/contacts/${item?._id}`)}
                          className="cursor-pointer py-2 px-3 font-semibold text-indigo-500 hover:text-indigo-600 duration-150 hover:bg-gray-50 rounded-lg"
                        >
                          View Attendees
                        </a>
                        <button
                          onClick={() => handleDeleteModal(item?._id, item?.csvName)}
                          className="py-2 px-3 leading-none font-semibold text-red-500 hover:text-red-600 duration-150 hover:bg-gray-50 rounded-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <Pagination
          count={totalPages}
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
        <Delete setModal={setShowDeleteModal} webinarName={webinarName} handleDelete={handleDelete} />
      )}
    </>
  );
};

export default MeetingDetails;
