import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserActivityByEmail } from "../../../features/actions/userActivity";
import PageLimitEditor from "../../../components/PageLimitEditor";
import Pagination from "@mui/material/Pagination";

const LogsModal = ({ setModal, email }) => {
  const pageId = "attendee-logs";
  const defaultPagination = {
    totalPages: 1,
    totalLogs: 0,
  };
  const dispatch = useDispatch();
  const [logsState, setLogsState] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(defaultPagination);
  const LIMIT = useSelector((state) => state.pageLimits[pageId] || 10);

  useEffect(() => {
    dispatch(getUserActivityByEmail({ email, page, limit:LIMIT })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const { data, pagination } = res?.payload;
        setLogsState(Array.isArray(data) ? data : []);
        setPagination(pagination || defaultPagination);
      }
    });
  }, [email, page, LIMIT]);

  // Helper to format action types
  const formatAction = (action) => {
    return action
      .replace(/([A-Z])/g, " $1")
      .replace(/^set/, "")
      .trim();
  };

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Attendee Logs</h2>
          <button
            onClick={() => setModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="h-96 overflow-y-auto space-y-4">
          {logsState.map((log) => (
            <div
              key={log._id}
              className="p-4 bg-gray-100 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center 
                                        ${
                                          log.action === "setAlarm"
                                            ? "bg-red-100"
                                            : "bg-blue-100"
                                        }`}
                  >
                    {log.action === "setAlarm" ? (
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {log.user.userName}
                    <span
                      className={`ml-2 ${
                        log.action === "setAlarm"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {formatAction(log.action).toUpperCase()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(log.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {logsState?.length > 0 ? (
          <div className="flex gap-4 md:flex-row flex-col flex-wrap items-center justify-between py-4">
            <Pagination
              onChange={(e, page) => {
                setPage(page);
              }}
              count={pagination.totalPages || 1}
              page={Number(page) || 1}
              variant="outlined"
              shape="rounded"
            />
            <PageLimitEditor setPage={setPage} pageId={pageId} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No logs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsModal;
