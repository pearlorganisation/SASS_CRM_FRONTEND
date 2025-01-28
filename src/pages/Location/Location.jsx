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
import { getLocations } from "../../features/actions/location";
import { locationTableColumns } from "../../utils/columnData";
import ConfirmActionModal from "../Employees/modal/ConfirmActionModal";
// import ExportModal from "../../components/Export/ExportModal";

const tableCellStyles = {
  paddingTop: "8px",
  paddingBottom: "8px",
  textWrap: "nowrap",
};

const Location = () => {
  // ----------------------- ModalNames for Redux -----------------------
  // const activeInactiveModalName = "activeInactiveModal";
  //   const employeeExportModalName = "EmployeeExportModal";
  //   const employeeFilterModalName = "EmployeeFilterModal";
  const tableHeader = "Locations";

  // ----------------------- Constants -----------------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roles = useRoles();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const { locationsData, isLoading, isSuccess, totalPages } = useSelector(
    (state) => state.location
  );
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      getLocations({
        page: page,
        limit: LIMIT,
        filters: filters,
      })
    );
  }, [page, LIMIT, filters]);

  // useEffect(() => {
  //   console.log(locationsData);
  // }, []);

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
    ,
    // {
    //   icon: () => (
    //     <Visibility className="text-indigo-500 group-hover:text-indigo-600" />
    //   ),
    //   tooltip: "View Employee Info",
    //   onClick: (item) => {
    //     navigate(``);
    //   },
    //   readOnly: true,
    // },
    ...(userData?.isActive
      ? [
          // {
          //   icon: () => (
          //     <Dashboard className="text-neutral-500 group-hover:text-neutral-600" />
          //   ),
          //   tooltip: "Visit Dashboard",
          //   onClick: (item) => {
          //     dispatch(setEmployeeModeId(item));
          //     navigate("/employee/dashboard/" + item?._id);
          //   },
          // },
          // {
          //   icon: () => (
          //     <Edit className="text-blue-500 group-hover:text-blue-600" />
          //   ),
          //   tooltip: "Edit Employee Data",
          //   onClick: (item) => {
          //     navigate(`/employee/edit/${item?._id}`);
          //   },
          // },
          {
            icon: (item) => (
              <>
                {console.log(
                  userData?.role === roles.SUPER_ADMIN
                    ? item?.isVerified
                    : item?.isAdminVerified
                )}
                {userData?.role === roles.SUPER_ADMIN ? (
                  item?.isVerified
                ) : item?.isAdminVerified ? (
                  <ToggleOn
                    fontSize="large"
                    className="text-green-500 group-hover:text-green-600"
                  />
                ) : (
                  <ToggleOff
                    fontSize="large"
                    className="text-red-500 group-hover:text-red-600"
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
        <div className="flex justify-between gap-2 items-center pb-4">
          <div className="flex gap-2">
            <Button variant="outlined" onClick={() => navigate("/locations")}>
              Locations
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/locations/requests")}
            >
              Requests
            </Button>
          </div>
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
          tableUniqueKey="locationTable"
          filters={filters}
          setFilters={setFilters}
          tableData={{
            columns: locationTableColumns,
            rows: locationsData || [],
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

export default Location;
