import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getUserNotifications } from "../../features/actions/notification";
import PageLimitEditor from "../../components/PageLimitEditor";
import { Pagination } from "@mui/material";
import { NotifActionType } from "../../utils/extra";
import useRoles from "../../hooks/useRoles";
import ScrollControls from "../../components/ScrollControls";

const Notifications = () => {
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const roles = useRoles();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);

  const { userId } = useParams();
  const [page, setPage] = useState(1);
  const LIMIT = useSelector(
    (state) => state.pageLimits["notificationsPage"] || 10
  );

  const { employeeModeData } = useSelector((state) => state.employee);
  const { notifications, totalPages, _notifications, _totalPages } =
    useSelector((state) => state.notification);
  const [imp, setImp] = useState(true);

  useEffect(() => {
    const important = searchParams.get("important");
    setImp(important === "true");
    console.log("useEffectin", searchParams, userId, important);
    if (important && userId) {
      dispatch(
        getUserNotifications({
          id: employeeModeData ? employeeModeData?._id : userId,
          important: important === "true",
          page: page,
          limit: LIMIT,
        })
      );
    }
  }, [searchParams, userId, page, LIMIT]);

  function handleClick(notif) {
    console.log(notif);
    const role = userData?.role;
    const isEmployee = roles.isEmployeeId(role);

    if (isEmployee) {
      if (
        notif.actionType === NotifActionType.WEBINAR_ASSIGNMENT ||
        notif.actionType === NotifActionType.ASSIGNMENT ||
        notif.actionType === NotifActionType.REASSIGNMENT
      ) {
        if (notif.metadata?.webinarId) {
          navigate(`/assignments?webinarId=${notif.metadata.webinarId}`);
        }
      }

      return;
    }

    if (notif.actionType === NotifActionType.USER_ACTIVITY) {
      navigate(
        `/employee/view/${notif?.metadata?.userId}?page=1&tabValue=activityLogs`
      );
    }

    if (notif.actionType === NotifActionType.REASSIGNMENT) {
      if (!notif?.metadata?.webinarId) return;
      navigate(
        `/webinarDetails/${notif.metadata.webinarId}?tabValue=preWebinar&page=1&subTabValue=reassignrequested`
      );
    }
  }

  return (
    <div className=" w-full pt-14 p-6">
      <div className="p-6 bg-gray-50  rounded-lg">
        <div className="flex gap-4 mb-8 justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">Notifications</h2>
          <div>
            <button 
              onClick={() => {
                setPage(1)
                setSearchParams({
                  important: !imp 
                })
              }}
              className={`px-4 py-2 rounded transition-colors bg-blue-500 text-white`}
            >
              {!imp 
                ? 'Important' 
                : 'Non Important'}
            </button>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          {(imp ? notifications : _notifications).map((notif) => (
            <div
              key={notif?._id}
              onClick={() => handleClick(notif)}
              className={`p-4 rounded-lg border ${
                notif?.isSeen ? "bg-gray-100" : "bg-white"
              } shadow-md cursor-pointer hover:shadow-lg transition-all`}
            >
              {/* Notif?ication Type */}
              <div
                className={`text-sm font-medium capitalize ${
                  notif?.actionType === "warning"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {notif?.actionType
                  ? notif.actionType.split("_").join(" ")
                  : "Unknown"}
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-900 mt-2">
                {notif?.title}
              </h2>

              {/* Message */}
              <p className="text-sm text-gray-700 mt-1">{notif?.message}</p>

              {/* CreatedAt */}
              <div className="text-xs text-gray-500 mt-2">
                {new Date(notif?.createdAt).toLocaleString()}
              </div>
            </div>
          ))}

          {(imp ? notifications : _notifications).length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-lg font-bold text-gray-700">
                No notifications found
              </p>
            </div>
          )}
        </div>
        {(imp ? notifications : _notifications).length !== 0 && (
          <div className="flex gap-4 md:flex-row flex-col flex-wrap items-center justify-between py-4">
            <Pagination
              onChange={(e, page) => {
                setPage(page);
                // logUserActivity({
                //   action: "Page changed",
                //   details: `User changed page For ${tableHeader} to ${page} `,
                // });
              }}
              count={(imp ? totalPages : _totalPages) || 1}
              page={Number(page) || 1}
              variant="outlined"
              shape="rounded"
            />
            <PageLimitEditor setPage={setPage} pageId={"notificationsPage"} />
          </div>
        )}
        <ScrollControls />
      </div>
    </div>
  );
};

export default Notifications;
