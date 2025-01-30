import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import {
  Edit,
  Visibility,
  ToggleOn,
  ToggleOff,
  Dashboard,
  CheckBox,
  DisabledByDefault,
} from "@mui/icons-material";
// import ConfirmActionModal from "./modal/ConfirmActionModal";
import {
  clearSuccess,
  setEmployeeModeId,
} from "../../features/slices/employee";
import { openModal } from "../../features/slices/modalSlice";
import DataTable from "../../components/Table/DataTable";
import useRoles from "../../hooks/useRoles";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import {
  getLocationRequests,
  getLocations,
} from "../../features/actions/location";
import { locationTableColumns } from "../../utils/columnData";
import RequestApprovalDisapprovalModal from "./Modal/RequestApprovalDisapprovalModal";
import AddRequestLocation from "./Modal/AddRequestLocation";
// import ConfirmActionModal from "../Employees/modal/ConfirmActionModal";
// import ExportModal from "../../components/Export/ExportModal";

const tableCellStyles = {
  paddingTop: "8px",
  paddingBottom: "8px",
  textWrap: "nowrap",
};

const Locations = () => {
  const [selectedModalName, setSelectedModalName] = useState(null);
  const [addRequestModal, setAddRequestModal] = useState(false);
  const location = useLocation();
  // ----------------------- ModalNames for Redux -----------------------
  // const activeInactiveModalName = "activeInactiveModal";
  //   const employeeExportModalName = "EmployeeExportModal";
  //   const employeeFilterModalName = "EmployeeFilterModal";
  if (location.pathname === "/locations/requests") {
    var tableHeader = "Location Requests";
  } else {
    var tableHeader = "Locations";
  }
  // ----------------------- Constants -----------------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roles = useRoles();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const { locationsData, locationRequests, isLoading, isSuccess, totalPages } =
    useSelector((state) => state.location);
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (location.pathname === "/locations/requests") {
      dispatch(
        getLocationRequests({
          page: page,
          limit: LIMIT,
          filters: filters,
        })
      );
    } else {
      dispatch(
        getLocations({
          page: page,
          limit: LIMIT,
          filters: filters,
        })
      );
    }
  }, [page, LIMIT, filters]);

  const navigateToAdd = () => navigate("/requestLocation");

  //   useEffect(() => {
  //     if (isSuccess) {
  //       dispatch(
  //         getAllEmployees({
  //           page: 1,
  //           limit: LIMIT,
  //           filters: filters,
  //         })
  //       );
  //       dispatch(getUserSubscription());
  //       dispatch(clearSuccess());
  //     }
  //   }, [isSuccess]);

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  // useEffect(() => {
  //   console.log(userData?.role);
  //   console.log(roles.isSuperAdmin(userData?.role));
  // }, [userData?.role]);

  // ------------------- Action Icons -------------------
  const actionIcons = [
    ...(userData?.isActive && location.pathname === "/locations/requests"
      ? [
          {
            icon: (item) =>
              !item?.deactivated &&
              (roles.isSuperAdmin(userData?.role)
                ? !item?.isVerified
                : !item?.isAdminVerified) && (
                <CheckBox
                  fontSize="large"
                  className="text-green-500 group-hover:text-green-600"
                />
              ),
            tooltip: "Checkbox",
            onClick: (item) => {
              if (
                !item?.deactivated && roles.isSuperAdmin(userData.role)
                  ? !item?.isVerified
                  : !item?.isAdminVerified
              ) {
                setSelectedModalName("requestApprovalModal");
                dispatch(
                  openModal({
                    modalName: "requestApprovalModal",
                    data: item,
                  })
                );
              }
            },
          },
          {
            icon: (item) =>
              !item?.deactivated &&
              (roles.isSuperAdmin(userData?.role)
                ? !item?.isVerified
                : !item?.isAdminVerified) && (
                <DisabledByDefault
                  fontSize="large"
                  className="text-red-500 group-hover:text-red-600"
                />
              ),
            tooltip: "DisabledByDefault",
            onClick: (item) => {
              if (
                !item?.deactivated && roles.isSuperAdmin(userData.role)
                  ? !item?.isVerified
                  : !item?.isAdminVerified
              ) {
                setSelectedModalName("requestDisapprovalModal");
                dispatch(
                  openModal({
                    modalName: "requestDisapprovalModal",
                    data: item,
                  })
                );
              }
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="pt-14 sm:px-5 px-2">
        {/* Add location Button */}
        <div className="flex justify-between gap-2 items-center pb-4">
          <div className="flex gap-2">
            <Button variant="outlined" onClick={() => navigate("/locations")}>
              Locations
            </Button>

            <ComponentGuard
              conditions={[userData?.isActive]}
              allowedRoles={[roles.SUPER_ADMIN, roles.ADMIN]}
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/locations/requests")}
              >
                Requests
              </Button>
            </ComponentGuard>
          </div>
          {/* <ComponentGuard
            conditions={[userData?.isActive]}
            allowedRoles={[roles.SUPER_ADMIN, roles.ADMIN]}
          > */}
          <Button variant="contained" onClick={() =>  setAddRequestModal(() => !addRequestModal)}>
            {roles.SUPER_ADMIN === userData.role ? "Add" : "Request"} Location
          </Button>
          {/* </ComponentGuard> */}
        </div>

        <DataTable
          tableHeader={tableHeader}
          tableUniqueKey="locationRequestsTable"
          filters={filters}
          setFilters={setFilters}
          tableData={{
            columns: locationTableColumns,
            rows:
              location.pathname === "/locations/requests"
                ? locationRequests
                : locationsData || [],
          }}
          actions={actionIcons}
          // totalPages={totalPages}
          // page={page}
          // setPage={setPage}
          limit={LIMIT}
          //   filterModalName={}
          //   exportModalName={}
          isLoading={isLoading}
        />
      </div>

      <RequestApprovalDisapprovalModal modalName={selectedModalName} />
      {addRequestModal && (
        <AddRequestLocation setModal={setAddRequestModal}  />
      )}
    </>
  );
};

export default Locations;
