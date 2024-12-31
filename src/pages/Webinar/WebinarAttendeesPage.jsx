import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  IconButton,
  Menu,
  ListItemIcon,
  Typography,
  ButtonGroup,
  Button,
} from "@mui/material"; 
import {
  clearSuccess,
  setTabValue as setTab,
} from "../../features/slices/attendees";
import { getAttendees } from "../../features/actions/attendees";
import { attendeeTableColumns } from "../../utils/columnData";
import { 
  Visibility, 
} from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable"; 
import AttendeesFilterModal from "../../components/Attendees/AttendeesFilterModal";
import ExportWebinarAttendeesModal from "../../components/Export/ExportWebinarAttendeesModal";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import { resetReAssignSuccess } from "../../features/slices/reAssign.slice";
import { resetAssignSuccess } from "../../features/slices/assign";
import FilterPresetModal from "../../components/Filter/FilterPresetModal";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import useAddUserActivity from "../../hooks/useAddUserActivity";

const WebinarAttendeesPage = (props) => {
    const {
      tabValue,
      page,
      setPage,
      subTabValue,
      selectedRows,
      setSelectedRows,
      isSelectVisible,
      setIsSelectVisible,
      setSelectedAssignmentType,
      selectedAssignmentType,
    } = props;
  
    const tableHeader = "Attendees Table";
    const exportExcelModalName = "ExportWebinarAttendeesExcel";
    const AttendeesFilterModalName = "AttendeesFilterModal";
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
  
    const { attendeeData, isLoading, isSuccess, totalPages } = useSelector(
      (state) => state.attendee
    );
    console.log("isssucess",isLoading, isSuccess);

    const { isSuccess: isSuccessReAssign } = useSelector(
      (state) => state.reAssign
    );
    const { leadTypeData, isSuccess: assignSuccess } = useSelector(
      (state) => state.assign
    );
    const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
    const {userData} = useSelector((state) => state.auth);
  
    const [filters, setFilters] = useState({});
    const [selected, setSelected] = useState("All");
  
    useEffect(() => {
      if (tabValue !== "enrollments" && subTabValue === "attendees") {
        dispatch(
          getAttendees({
            id,
            isAttended: tabValue === "postWebinar",
            page,
            limit: LIMIT,
            filters,
            validCall: selected === "All" ? undefined : selected,
            assignmentType:
              selectedAssignmentType === "All"
                ? undefined
                : selectedAssignmentType,
          })
        );
      }
    }, [page, tabValue, LIMIT, filters, selected, selectedAssignmentType]);
  
    useEffect(() => {
      if (isSuccess || assignSuccess || isSuccessReAssign) {
        console.log("isssucess", isSuccess, assignSuccess, isSuccessReAssign);
        dispatch(
          getAttendees({
            id,
            isAttended: tabValue === "postWebinar",
            page: 1,
            limit: LIMIT,
            filters,
            validCall: selected === "All" ? undefined : selected,
            assignmentType:
              selectedAssignmentType === "All"
                ? undefined
                : selectedAssignmentType,
          })
        );
        dispatch(clearSuccess());
        dispatch(resetReAssignSuccess());
        dispatch(resetAssignSuccess());
        setSelectedRows([]);
      }
    }, [isSuccess, assignSuccess, isSuccessReAssign]);
  
    const actionIcons = [
      {
        icon: () => (
          <Visibility className="text-indigo-500 group-hover:text-indigo-600" />
        ),
        tooltip: "View Attendee Info",
        onClick: (item) => {
          navigate(
            `/particularContact?email=${item?.email}&attendeeId=${item?._id}`
          );
        },
        readOnly: true,
      },
    ];

      const filterPresetModalName = "FilterPresetModal";
      const [anchorEl, setAnchorEl] = useState(null);
      const open = Boolean(anchorEl);
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
  
    const AttendeeDropdown = () => {
      const handleChange = (event) => {
        const label = event.target.value;
        setSelected(label);
        setPage(1);
      };
  
      const handleAssignmentChange = (event) => {
        const label = event.target.value;
        if (label === "All") {
          setIsSelectVisible(false);
          setSelectedRows([]);
        } else {
          setIsSelectVisible(true);
          setSelectedRows([]);
        }
        setSelectedAssignmentType(label);
        setPage(1);
      };

      
  
      return (
        <div className="flex gap-4">
          <FormControl className="w-40 " variant="outlined">
            <InputLabel id="attendee-label">Activity</InputLabel>
            <Select
              labelId="attendee-label"
              className="h-10"
              value={selected}
              onChange={handleChange}
              label="Activity"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Worked">Worked</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
  
          <FormControl className="w-40 " variant="outlined">
            <InputLabel id="attendee-label">Assignment</InputLabel>
            <Select
              labelId="attendee-label"
              className="h-10"
              value={selectedAssignmentType}
              onChange={handleAssignmentChange}
              label="Assignment"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Assigned">Assigned</MenuItem>
              <MenuItem value="Not Assigned"> Not Assigned</MenuItem>
            </Select>
          </FormControl>
        </div>
      );
    };
    return (
      <>
        <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700">{tableHeader}</h2>
    
          <IconButton
            id="demo-positioned-button"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreVertOutlinedIcon />
          </IconButton>

        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              dispatch(openModal(exportModalName));
              handleClose();
            }}
          >
            <ListItemIcon>
              <DownloadOutlinedIcon color="success" fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit"> Export</Typography>
          </MenuItem>
        </Menu>
      </div>

      <div
        className={`flex gap-4 ${
          ButtonGroup ? "justify-between flex-wrap" : "justify-end"
        } py-2 items-center`}
      >
        {ButtonGroup && <ButtonGroup />}
          <div className="flex gap-4">
          <Button
            component="label"
            color="secondary"
            variant="outlined"
            onClick={() => {
              dispatch(openModal(filterPresetModalName));
            }}
            startIcon={<BookmarkOutlinedIcon />}
          >
            Presets
          </Button>

          <Button
            component="label"
            variant="outlined"
            onClick={() => {
              dispatch(openModal(AttendeesFilterModalName));
            }}
            startIcon={<FilterAltIcon />}
          >
            Filters
            {filters && Object.keys(filters)?.length > 0 && (
              <span className="ml-3 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>
          </div>
      </div>
      {ClientCards}
      <div className={`${ClientCards !== null ? "hidden md:block " : ""}`}>
        <RawTable
          tableData={{
            ...tableData,
            rows: Array.isArray(tableData.rows) ? tableData.rows : [],
          }}
          actions={actions}
          isSelectVisible={isSelectVisible}
          page={page}
          limit={LIMIT}
          isLoading={isLoading}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          userData={userData}
          rowClick={rowClick}
          isRowClickable={isRowClickable}
          isLeadType={isLeadType}
        />
      </div>
      {tableData?.rows?.length > 0 && (
        <div className="flex gap-4 md:flex-row flex-col flex-wrap items-center justify-between py-4">
          <Pagination
            onChange={(e, page) => {
              setPage(page);
              logUserActivity({
                action: "Page changed",
                details: `User changed page For ${tableHeader} to ${page} `,
              });
            }}
            count={totalPages || 1}
            page={page}
            variant="outlined"
            shape="rounded"
          />
          <PageLimitEditor pageId={tableHeader} />
        </div>
      )}
      <FilterPresetModal
        tableName={tableUniqueKey}
        filters={filters}
        setFilters={setFilters}
        modalName={filterPresetModalName}
      />
    </div>
        <AttendeesFilterModal
          modalName={AttendeesFilterModalName}
          filters={filters}
          setFilters={setFilters}
        />
        <ExportWebinarAttendeesModal
          modalName={exportExcelModalName}
          filters={filters}
          webinarId={id}
          isAttended={tabValue === "postWebinar" ? true : false}
        />
      </>
    );
  };


  export default WebinarAttendeesPage