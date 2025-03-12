import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UploadCsvModal from "./UploadCsvModal";
import UploadXslxModal from "./UploadXslxModal";
import { createPortal } from "react-dom";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

const UpdateCsvXslxModal = ({ setModal, csvId, tabValue }) => {
  const [showModal, setShowModal] = useState(false);
  const [showXslxModal, setShowXslxModal] = useState(false);
  const handleModal = () => setShowModal(true);
  const handleXslxModal = () => setShowXslxModal(true);

  const { isImporting } = useSelector((state) => state.attendee);

  useEffect(() => {
    if (isImporting) {
      setModal(false);
    }
  }, [isImporting]);

  return (
    <div
      className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm"
      aria-labelledby="header-3a content-3a"
      aria-modal="true"
      tabIndex="-1"
      role="dialog"
    >
      {/*    <!-- Modal --> */}
      <div
        className="flex flex-col items-center rounded bg-white py-6 shadow-xl "
        id="modal"
        role="document"
      >
        <div className="m-10 space-x-5">
          {/* <div className="pb-4">Choose File for updation of the webinar details</div> */}
          <Button variant="contained" onClick={handleXslxModal}>
            Upload XSLX File
          </Button>
          <Button variant="contained" onClick={handleModal}>
            Upload CSV File
          </Button>
        </div>
        <Button
          variant="outlined"
          onClick={() => setModal(false)}
          className=" hover:text-red-600"
          aria-label="close dialog"
        >
          Close
        </Button>
      </div>
      {showModal &&
        createPortal(
          <UploadCsvModal tabValue={tabValue} setModal={setShowModal} update={csvId} />,
          document.body
        )}
      {showXslxModal &&
        createPortal(
          <UploadXslxModal tabValue={tabValue} setModal={setShowXslxModal} update={csvId} />,
          document.body
        )}
    </div>
  );
};

export default UpdateCsvXslxModal;
