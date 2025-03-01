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
import { getAllEmployees } from "../../features/actions/employee";
import ConfirmActionModal from "./modal/ConfirmActionModal";
import {
  clearSuccess,
  setEmployeeModeId,
} from "../../features/slices/employee";
import { openModal } from "../../features/slices/modalSlice";
import { getUserSubscription } from "../../features/actions/auth";
import DataTable from "../../components/Table/DataTable";
import { employeeTableColumns } from "../../utils/columnData";
import useRoles from "../../hooks/useRoles";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import EmployeeFilterModal from "../../components/Filter/EmployeeFilterModal";
import ExportModal from "../../components/Export/ExportModal";
import { exportEmployeesExcel } from "../../features/actions/export-excel";

const tableCellStyles = {
  paddingTop: "8px",
  paddingBottom: "8px",
  textWrap: "nowrap",
};

const Employees = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const activeInactiveModalName = "activeInactiveModal";
  const employeeExportModalName = "EmployeeExportModal";
  const employeeFilterModalName = "EmployeeFilterModal";
  const tableHeader = "Employee Table";

  // ----------------------- Constants -----------------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roles = useRoles();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const { employeeData, isLoading, isSuccess, totalPages } = useSelector(
    (state) => state.employee
  );
  const { userData, subscription } = useSelector((state) => state.auth);
  const employeeInactivity = subscription?.plan?.employeeInactivity;

  useEffect(() => {
    dispatch(
      getAllEmployees({
        page: page,
        limit: LIMIT,
        filters: filters,
      })
    );
  }, [page, LIMIT, filters]);

  const navigateToAdd = () => navigate("/createEmployee");

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        getAllEmployees({
          page: 1,
          limit: LIMIT,
          filters: filters,
        })
      );
      dispatch(getUserSubscription());
      dispatch(clearSuccess());
    }
  }, [isSuccess]);

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
        navigate(`/employee/view/${item?._id}`);
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
              dispatch(
                openModal({
                  modalName: activeInactiveModalName,
                  data: item,
                })
              );
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="pt-14 sm:px-5 px-2">
        {/* Add Employee Button */}
        <div className="flex justify-end items-center pb-4">
          <ComponentGuard conditions={[userData?.isActive]}>
            <Button variant="contained" onClick={navigateToAdd}>
              Add Employee
            </Button>
          </ComponentGuard>
        </div>

        <DataTable
          tableHeader={tableHeader}
          tableUniqueKey="employeeListingTable"
          filters={filters}
          setFilters={setFilters}
          tableData={{
            columns: employeeTableColumns.filter((column) => {
              if(column.key === "inactivityTime"){
                return employeeInactivity
              }
              return true;
            }),
            rows: employeeData || [],
          }}
          actions={actionIcons}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          limit={LIMIT}
          filterModalName={employeeFilterModalName}
          exportModalName={employeeExportModalName}
          isLoading={isLoading}
        />
      </div>

      <ConfirmActionModal modalName={activeInactiveModalName} />
      <EmployeeFilterModal
        modalName={employeeFilterModalName}
        filters={filters}
        setFilters={setFilters}
      />
      <ExportModal
        modalName={employeeExportModalName}
        defaultColumns={employeeTableColumns}
        handleExport={({ limit, columns }) => {
          dispatch(exportEmployeesExcel({ limit, columns, filters }));
        }}
      />
    </>
  );
};

export default Employees;
