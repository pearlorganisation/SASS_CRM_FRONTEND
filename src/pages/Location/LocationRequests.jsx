import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import {
  Edit,
  Visibility,
  ToggleOn,
  ToggleOff,
  Dashboard,
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
} from "../../features/actions/location";
import { locationTableColumns } from "../../utils/columnData";
// import ConfirmActionModal from "../Employees/modal/ConfirmActionModal";
// import ExportModal from "../../components/Export/ExportModal";

const tableCellStyles = {
  paddingTop: "8px",
  paddingBottom: "8px",
  textWrap: "nowrap",
};

const LocationRequests = () => {
  // ----------------------- ModalNames for Redux -----------------------
  // const activeInactiveModalName = "activeInactiveModal";
  //   const employeeExportModalName = "EmployeeExportModal";
  //   const employeeFilterModalName = "EmployeeFilterModal";
  const tableHeader = "Location Requests Table";

  // ----------------------- Constants -----------------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roles = useRoles();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const { locationRequests, isLoading, isSuccess, totalPages } = useSelector(
    (state) => state.location
  );
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      getLocationRequests({
        page: page,
        limit: LIMIT,
        filters: filters,
      })
    );
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

  // ------------------- Action Icons -------------------
  const actionIcons = [
    {
      icon: () => (
        <Visibility className="text-indigo-500 group-hover:text-indigo-600" />
      ),
      tooltip: "View Employee Info",
      onClick: (item) => {
        navigate(``);
      },
      readOnly: true,
    },
    ,
    ...(userData?.isActive
      ? [
          {
            icon: () => (
              <Dashboard className="text-neutral-500 group-hover:text-neutral-600" />
            ),
            tooltip: "Visit Dashboard",
            onClick: (item) => {
              dispatch(setEmployeeModeId(item));
              navigate("/employee/dashboard/" + item?._id);
            },
          },
          {
            icon: () => (
              <Edit className="text-blue-500 group-hover:text-blue-600" />
            ),
            tooltip: "Edit Employee Data",
            onClick: (item) => {
              navigate(`/employee/edit/${item?._id}`);
            },
          },
          {
            icon: (item) => (
              <>
                {item?.isActive ? (
                  <ToggleOff
                    fontSize="large"
                    className="text-red-500 group-hover:text-red-600"
                  />
                ) : (
                  <ToggleOn
                    fontSize="large"
                    className="text-green-500 group-hover:text-green-600"
                  />
                )}
              </>
            ),
            tooltip: "Toggle Status",
            onClick: (item) => {
              // dispatch(
              //   openModal({
              //     modalName: activeInactiveModalName,
              //     data: item,
              //   })
              // );
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="pt-14 sm:px-5 px-2">
        {/* Add location Button */}
        <div className="flex justify-end items-center pb-4">
          <ComponentGuard
            conditions={[userData?.isActive]}
            allowedRoles={[roles.SUPER_ADMIN, roles.ADMIN]}
          >
            <Button variant="contained" onClick={navigateToAdd}>
              Add/Request Location
            </Button>
          </ComponentGuard>
        </div>

        <DataTable
          tableHeader={tableHeader}
          tableUniqueKey="locationRequestsTable"
          filters={filters}
          setFilters={setFilters}
          tableData={{
            columns: locationTableColumns,
            rows: locationRequests || [],
          }}
          actions={actionIcons}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          limit={LIMIT}
          //   filterModalName={}
          //   exportModalName={}
          isLoading={isLoading}
        />
      </div>

      {/* <ConfirmActionModal modalName={activeInactiveModalName} /> */}
    </>
  );
};

export default LocationRequests;
