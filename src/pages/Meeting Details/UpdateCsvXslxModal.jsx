import React, { useState } from "react";
import { Link } from "react-router-dom";
import UploadCsvModal from "./UploadCsvModal";
import UploadXslxModal from "./UploadXslxModal";
import { createPortal } from "react-dom";

const UpdateCsvXslxModal = ({ setModal,csvId }) => {
    const [showModal, setShowModal] = useState(false);
    const [showXslxModal, setShowXslxModal] = useState(false);

    const handleModal = () => setShowModal(true);
  
    const handleXslxModal = () => setShowXslxModal(true);

  return (
    <div
      className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm"
      aria-labelledby="header-3a content-3a"
      aria-modal="true"
      tabindex="-1"
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
            <Link
              onClick={handleXslxModal}
              className="cursor-pointer inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-700 md:text-sm"
            >
              Upload XSLX File
            </Link>
            <Link
              onClick={handleModal}
              className="cursor-pointer inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-700 md:text-sm"
            >
              Upload CSV File
            </Link>

          </div>
          <button
          onClick={() => setModal(false)}
          className="me-3 inline-flex h-10 items-center justify-center justify-self-center whitespace-nowrap rounded-full px-5 text-sm font-medium tracking-wide text-red-600 transition duration-300 hover:bg-red-100 hover:text-red-600 focus:bg-red-200 focus:text-red-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-red-300 disabled:shadow-none disabled:hover:bg-transparent"
          aria-label="close dialog"
        >
          <span className="relative only:-mx-5">
           Close
          </span>
        </button>
      </div>
      {showModal &&
        createPortal(<UploadCsvModal setModal={setShowModal} update={csvId}/>, document.body)}
      {showXslxModal &&
        createPortal(
          <UploadXslxModal setModal={setShowXslxModal} update={csvId}/>,
          document.body
        )}
    </div>
  );
};

export default UpdateCsvXslxModal;
