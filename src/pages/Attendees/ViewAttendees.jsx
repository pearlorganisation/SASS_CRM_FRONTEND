import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllAttendees } from "../../features/actions/webinarContact";
import Pagination from "@mui/material/Pagination";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import AssignmentTable from "../../components/AssignmentTable";
import EmployeeAssignModal from "./Modal/EmployeeAssignModal";
import TableWithStickyActions from "../Test/TableWithStickyActions";

const ViewAttendees = () => {
  const { webinarId } = useParams();
  const dispatch = useDispatch();

  const [tabValue, setTabValue] = useState("EMPLOYEE_SALES");
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [pageLimit, setPageLimit] = useState(10);
  const [assignedButton, setAssignedButton] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const checkboxRefs = useRef([]);
  const { attendeeData, isLoading } = useSelector(
    (state) => state.webinarContact
  );
  const { employeeData } = useSelector((state) => state.employee);

  const pageCount = attendeeData?.totalPages;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1); // Reset to the first page when switching tabs
    setSearchParams({ page: 1 });
  };

  const handlePagination = (e, p) => {
    setPage(p);
    setSearchParams({ page: p });
    // Fetch attendees for the current page
    dispatch(
      getAllAttendees({
        page: p,
        filters: "",
        recordType: "",
        limit: pageLimit,
      })
    );
  };

  useEffect(() => {
    if (assigned?.length > 0) {
      setAssignedButton(true);
    } else {
      setAssignedButton(false);
    }
  }, [assigned]);

  const handleAssignNow = (selectedEmployee) => {
    dispatch(
      addAssign({
        userId: selectedEmployee,
        attendees: assigned,
      })
    ).then(() => {
      setShowModal(false);
      setAssigned([]);
      clearCheckboxes();
    });
  };

  const clearCheckboxes = () => {
    checkboxRefs.current.forEach((checkbox) => {
      if (checkbox) checkbox.checked = false;
    });
  };

  return (
    <div className="px-6 md:px-10 pt-10  space-y-6">
      {/* Tabs for 'Sales' and 'Reminder' */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        className="border-b border-gray-200"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Sales" value="EMPLOYEE_SALES" className="text-gray-600" />
        <Tab label="Reminder" value="EMPLOYEE_REMINDER" className="text-gray-600" />
      </Tabs>

      {/* <TableWithStickyActions/> */}

      {/* Employee Assign Modal */}
      {showModal && (
        <EmployeeAssignModal
          employeeData={employeeData}
          selectedType={tabValue}
          onClose={() => setShowModal(false)}
          onAssign={handleAssignNow}
        />
      )}
    </div>
  );
};

export default ViewAttendees;
