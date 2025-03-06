import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useNavigate } from "react-router-dom";
import LinearProgressWithLabel from "../Export/LinearProgressWithLabel";
import { socket } from "../../socket";
import { deleteUserDocument, getUserDocument, getUserDocuments } from "../../features/actions/export-excel";
import { formatDateAsNumber, formatDateAsNumberWithTime, formatFileSize } from "../../utils/extra";
import { setNewDownload } from "../../features/slices/export-excel";

const ImportExportNotifications = ({ userData, roles }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const { userDocuments, isLoading, isExportLoading} = useSelector((state) => state.export);

  const handleBellClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      bellRef.current &&
      !bellRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    dispatch(getUserDocuments({bell: true}));
  }, []);

  const { isImporting } = useSelector((state) => state.attendee);
  useEffect(() => {
    setProgress(0)
    if (isExportLoading || isImporting) {
      setIsOpen(true);
    }
    else{
      setIsOpen(false);
    }
    
  }, [isExportLoading,isImporting]);

  useEffect(() => {
    function onImport(data) {
      console.log(data);
      if (data.actionType === "import") {
        if (data.value > 0) {
          setProgress(data.value);
        }
      }
    }

    function newDownload(data){
      console.log(data);
      dispatch(setNewDownload(data));
    }
    socket.on("import-export", onImport);
    socket.on("new-download", newDownload);
    return () => {
      socket.off("import-export", onImport);
      socket.off("new-download", newDownload);
    };
  }, []);

  return (
    <div className="sm:relative">
      <button
        ref={bellRef}
        onClick={handleBellClick}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <div className="relative">
          <CloudDownloadIcon className="text-gray-600" />
          {false && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              2
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">Downloads</h3>
              <button 
              onClick={() => {
                setIsOpen(false)
                navigate("/user-downloads")
              }}
              className="text-gray-500 hover:text-gray-900 hover:underline">
                View All
              </button>
            </div>
            <hr className="my-2 border-gray-200" />
            <div className="divide-y">
              {(isExportLoading || isImporting) && (
                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium">Data Import Progress</div>
                  <p className="text-gray-600 text-sm">
                    some text describing what's happening on the backend
                  </p>
                  <div className="text-xs text-gray-500 text-right mt-1">
                    <LinearProgressWithLabel value={progress} />
                  </div>
                </div>
              )}
              {userDocuments.map((notif) => (
                <div
                key={notif._id}
                className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Document Icon */}
                  {/* <div className="flex-shrink-0 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div> */}
  
                  {/* Document Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 truncate max-w-56">
                        {notif?.fileName}
                      </div>
                    </div>
  
                    <div className="mt-1 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {formatFileSize(notif?.fileSize)}
                        </span>
                        <span>•</span>
                        <span>
                          {formatDateAsNumber(notif?.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                    disabled={isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                          getUserDocument({
                            id: notif._id,
                            fileName: notif?.fileName,
                          })
                        );
                      }}
                      className="p-2 hover:bg-blue-50 rounded-full text-blue-600 hover:text-blue-800 transition-colors"
                      title="Redownload"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
  
                    <button
                    disabled={isLoading}
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add delete handler here
                        dispatch(deleteUserDocument({id:notif?._id}))
                      }}
                      className="p-2 hover:bg-red-50 rounded-full text-red-600 hover:text-red-800 transition-colors"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
  
                {/* Status Indicator */}
                {notif.status === "EXPIRED" && (
                  <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Link expired
                  </div>
                )}
              </div>
              ))}

              {false && (
                <div className="p-4 text-center text-gray-700">
                  No Downloads found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportExportNotifications;
