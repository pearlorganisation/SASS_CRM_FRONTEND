import React from "react";
import { formatDate } from "../../../utils/extra";

const ViewFullDetailsModal = (props) => {
  const { setModalData, modalData} = props;
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
        className="flex h-auto sm:w-[55%] max-h-[90dvh] overflow-y-auto scrollbar-thin  flex-col gap-6 overflow-hidden rounded bg-white p-6 shadow-xl "
        id="modal"
        role="document"
      >
        <div className="flex gap-5">
          <table
            className=" w-full rounded text-left"
            cellspacing="0"
          >
            <tbody className="space-y-1">
              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-12 items-center justify-start bg-slate-100 stroke-slate-700 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Date
                </td>
                <td className="flex h-12 w-full items-center justify-start border-slate-200 bg-slate-50 stroke-slate-500 px-6 text-sm text-slate-500 transition duration-300">
                  {formatDate(modalData?.updatedAt)}
                </td>
              </tr>
              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-auto items-center justify-start bg-slate-100 stroke-slate-700 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Phone Number
                </td>
                <td className="flex h-auto w-full items-center justify-start border-slate-200 bg-slate-50 stroke-slate-500 px-6 py-3 text-sm text-slate-500 transition duration-300">
                  {modalData?.phone}
                </td>
              </tr>
              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-12 items-center justify-start bg-slate-100 stroke-slate-700 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Call Duration
                </td>
                <td className="flex h-12 w-full items-center justify-start border-slate-200 bg-slate-50 stroke-slate-500 px-6 text-sm text-slate-500 transition duration-300">
                  {`${modalData?.callDuration?.hr} hr ${modalData?.callDuration?.min} min ${modalData?.callDuration?.sec} sec`}
                </td>
              </tr>

              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-auto items-center justify-start bg-slate-100 stroke-slate-700 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Status
                </td>
                <td className="flex h-auto w-full items-center justify-start border-slate-200 bg-slate-50 stroke-slate-500 px-6 py-3 text-sm text-slate-500 transition duration-300">
                  {modalData?.status}
                </td>
              </tr>
              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-auto items-center justify-start bg-slate-100 stroke-slate-700 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Product
                </td>
                <td className="flex h-auto w-full items-center justify-start border-slate-200 bg-slate-50 stroke-slate-500 px-6 py-3 text-sm text-slate-500 transition duration-300">
                  {modalData?.product || "-"}
                </td>
              </tr>
              {/* <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-auto items-center justify-start bg-slate-100 stroke-slate-700 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Record Type
                </td>
                <td className="flex h-auto w-full items-center justify-start border-slate-200 bg-slate-50 stroke-slate-500 px-6 py-3 text-sm text-slate-500 transition duration-300">
                  {modalData?.recordType}
                </td>
              </tr> */}
              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-auto items-center justify-start bg-slate-100 stroke-slate-700 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Image
                </td>
                <td className="flex h-auto w-full items-center justify-start border-slate-200 bg-slate-50 stroke-slate-500 px-6 py-3 text-sm text-slate-500 transition duration-300">
                  {Array.isArray(modalData?.image) &&
                  modalData.image.length > 0 &&
                  modalData.image[0].url ? (
                    <a href={modalData.image[0].url} target="_blank" rel="noopener noreferrer">
                    <img src={modalData.image[0].url} className="max-h-52" alt="Image" />
                    </a>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-auto items-center justify-start bg-slate-100 stroke-slate-700 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Note
                </td>
                <td className="flex h-auto w-full items-center justify-start border-slate-200 bg-slate-50 stroke-slate-500 px-6 py-3 text-sm text-slate-500 transition duration-300">
                  {modalData?.note}
                </td>
              </tr>
            </tbody>
          </table>

          <div>
            <button
              onClick={() => setModalData(null)}
              className="inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent"
              aria-label="close dialog"
            >
              <span className="relative only:-mx-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  role="graphics-symbol"
                  aria-labelledby="title-79 desc-79"
                >
                  <title id="title-79">Icon title</title>
                  <desc id="desc-79">
                    A more detailed description of the icon
                  </desc>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFullDetailsModal;
