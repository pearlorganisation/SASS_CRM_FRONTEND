import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useNavigate } from "react-router-dom";
import LinearProgressWithLabel from "../Export/LinearProgressWithLabel";
import { socket } from "../../socket";

const ImportExportNotifications = ({ userData, roles }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const {} = useSelector((state) => state.notification);

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

  useEffect(() => {}, []);

  const { isImporting } = useSelector((state) => state.attendee);
  useEffect(() => {
    setProgress(0)
    if (isImporting) {
      setIsOpen(true);
    }
  }, [isImporting]);

  useEffect(() => {
    function onImport(data) {
      console.log(data);
      if (data.actionType === "import") {
        if (data.value > 0) {
          setProgress(data.value);
        }
      }
    }
    socket.on("import-export", onImport);
    return () => {
      socket.off("import-export", onImport);
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
              <h3 className="text-lg font-bold">Notifications</h3>
              <button className="text-gray-500 hover:text-gray-900 hover:underline">
                View All
              </button>
            </div>
            <hr className="my-2 border-gray-200" />
            <div className="divide-y">
              {isImporting && (
                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium">Data Import Progress</div>
                  <p className="text-gray-600 text-sm">
                    some text describing what happening on the backend
                  </p>
                  <div className="text-xs text-gray-500 text-right mt-1">
                    <LinearProgressWithLabel value={progress} />
                  </div>
                </div>
              )}
              {[].map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleClick(notif)}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="font-medium">{notif?.title}</div>
                  <p className="text-gray-600 text-sm">{notif?.message}</p>
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {new Date(notif?.createdAt).toLocaleDateString()} •{" "}
                    {new Date(notif?.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}

              {false && (
                <div className="p-4 text-center text-gray-700">
                  No notifications found
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
