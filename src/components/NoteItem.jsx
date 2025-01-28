import React from "react";
import { formatDate } from "../utils/extra";

const NoteItem = ({ item, index, setNoteModalData }) => {
  return (
    <div
      className="border rounded-lg shadow-md bg-white hover:bg-gray-50 transition transform duration-200 cursor-pointer text-gray-800"
      onClick={() => setNoteModalData(item)}
    >
      {/* Header Section */}
      <div className="border-b px-4 py-1 bg-gray-100 rounded-t-lg">
        <div className="flex justify-between">
          <div className="text-sm font-bold">Note {index}</div>
          <p className="flex items-center gap-1 text-xs">
            <span className="text-gray-500">Date:</span>
            <span className="bg-blue-100 text-blue-800 px-2 rounded-md">
              {formatDate(item?.updatedAt)}
            </span>
          </p>
          
        </div>
        <div className="flex text-xs justify-between">
          <p className=" flex items-center gap-1">
            <span className="font-semibold text-gray-600">Status:</span>
            <span className="bg-purple-100 text-purple-800 px-2 rounded-md">
              {item?.status}
            </span>
          </p>
          <p className="flex items-center gap-1">
            <span className="text-gray-500">Call Duration:</span>
            <span className="bg-green-100 text-green-800 px-2 rounded-md">
              {`${
                item?.callDuration?.min
                  ? item?.callDuration?.min.toString().padStart(2, "0")
                  : "00"
              }:${
                item?.callDuration?.sec
                  ? item?.callDuration?.sec.toString().padStart(2, "0")
                  : "00"
              }`}
            </span>
          </p>
        </div>
      </div>

      {/* Note Content */}
      <div className="px-4 py-2">
      <p className=" flex items-center gap-1 text-xs mb-1">
            <span className="font-semibold text-gray-600">Created By:</span>
            <span className="bg-purple-100 text-neutral-800 px-2 rounded-md">
              {item?.createdBy?.userName || "N/A"}
            </span>
          </p>
        <p className="text-sm bg-slate-100 px-3 py-2 rounded-md text-gray-700">
          {item?.note}
        </p>
      </div>
    </div>
  );
};

export default NoteItem;
