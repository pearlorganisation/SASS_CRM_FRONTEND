import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserNotifications } from "../../features/actions/notification";
import PageLimitEditor from "../../components/PageLimitEditor";
import { Pagination } from "@mui/material";
import { formatDateAsNumberWithTime, formatFileSize, NotifActionType } from "../../utils/extra";
import useRoles from "../../hooks/useRoles";
import ScrollControls from "../../components/ScrollControls";
import {
    deleteUserDocument,
  getUserDocument,
  getUserDocuments,
} from "../../features/actions/export-excel";

const UserDownloads = () => {
  const dispatch = useDispatch();

  const roles = useRoles();
  const { userData } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const LIMIT = useSelector(
    (state) => state.pageLimits["userDownloadsPage"] || 10
  );

  const { userDocumentsForPage, pagination, isLoading, isSuccess } =
    useSelector((state) => state.export);
  const { totalPages = 1 } = pagination;

  useEffect(() => {
    dispatch(getUserDocuments({ page, limit: LIMIT }));
  }, [page, LIMIT]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(getUserDocuments({ page: 1, limit: LIMIT }));
    }
  }, [isSuccess]);

  return (
    <div className=" w-full pt-14 p-6">
      <div className="lg:p-6 bg-gray-50  rounded-lg">
        <div className="flex gap-4 mb-8 justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">Downloads</h2>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          {userDocumentsForPage.map((notif) => (
            <div
              key={notif._id}
              className="p-4 hover:bg-gray-50 shadow-lg rounded-md border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Document Icon */}
                <div className="flex-shrink-0 text-blue-500">
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
                </div>

                {/* Document Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div
                      title={notif?.fileName}
                      className="font-medium text-gray-900  "
                    >
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
                        {formatDateAsNumberWithTime(notif?.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col flex-shrink-0 gap-2">
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

                      dispatch(deleteUserDocument({id: notif?._id}))
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

          {userDocumentsForPage.length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-lg font-bold text-gray-700">
                No Downloads found
              </p>
            </div>
          )}
        </div>
        {userDocumentsForPage.length !== 0 && (
          <div className="flex gap-4 md:flex-row flex-col flex-wrap items-center justify-between py-4">
            <Pagination
              onChange={(e, page) => {
                setPage(page);
                // logUserActivity({
                //   action: "Page changed",
                //   details: `User changed page For ${tableHeader} to ${page} `,
                // });
              }}
              count={totalPages}
              page={Number(page) || 1}
              variant="outlined"
              shape="rounded"
            />
            <PageLimitEditor setPage={setPage} pageId={"userDownloadsPage"} />
          </div>
        )}
        <ScrollControls />
      </div>
    </div>
  );
};

export default UserDownloads;
