import React from "react";
import { formatDate } from "../../../utils/extra";

const ProductDetailsModal = (props) => {
  const { setModalData, modalData } = props;

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
        className="flex h-auto sm:w-[55%] max-h-[90dvh] overflow-y-auto scrollbar-thin  flex-col gap-6 overflow-hidden rounded bg-white p-6 shadow-xl "
        id="modal"
        role="document"
      >
        <div className="flex gap-5">
          <table className="w-full rounded text-left" cellSpacing="0">
            <tbody className="space-y-1">
              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-12 items-center justify-start bg-slate-100 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Name
                </td>
                <td className="flex h-12 w-full items-center justify-start border-slate-200 bg-slate-50 px-6 text-sm text-slate-500 transition duration-300">
                  {modalData?.name || "-"}
                </td>
              </tr>
              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-12 items-center justify-start bg-slate-100 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Price
                </td>
                <td className="flex h-12 w-full items-center justify-start border-slate-200 bg-slate-50 px-6 text-sm text-slate-500 transition duration-300">
                  {modalData?.price ? `₹ ${modalData.price}` : "-"}
                </td>
              </tr>
              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-12 items-center justify-start bg-slate-100 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Date
                </td>
                <td className="flex h-12 w-full items-center justify-start border-slate-200 bg-slate-50 px-6 text-sm text-slate-500 transition duration-300">
                  {modalData?.updatedAt ? formatDate(modalData.updatedAt) : "-"}
                </td>
              </tr>
              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-12 items-center justify-start bg-slate-100 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Webinar Name
                </td>
                <td className="flex h-12 w-full items-center justify-start border-slate-200 bg-slate-50 px-6 text-sm text-slate-500 transition duration-300">
                  {modalData?.webinarName || "-"}
                </td>
              </tr>
              <tr className="flex ">
                <td
                  scope="col"
                  className="flex h-12 items-center justify-start bg-slate-100 px-6 text-sm font-medium text-slate-700 w-96"
                >
                  Description
                </td>
                <td className="flex h-12 w-full items-center justify-start border-slate-200 bg-slate-50 px-6 text-sm text-slate-500 transition duration-300">
                  {modalData?.description || "-"}
                </td>
              </tr>
            </tbody>
          </table>

          <div>
            <button
              onClick={() => setModalData(null)}
              className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-medium text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700"
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
                  <title id="title-79">Close Icon</title>
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

export default ProductDetailsModal;
