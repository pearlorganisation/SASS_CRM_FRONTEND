import React, { useState } from "react";
import {
  Button,
  Tooltip,
  Table,
  Checkbox,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Chip,
} from "@mui/material";
import PageLimitEditor from "../PageLimitEditor";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { formatDateAsNumber } from "../../utils/extra";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../features/slices/modalSlice";
import RawTable from "./RawTable";

const DataTable = ({
  tableHeader = "Table",
  ClientCards=null,
  tableData,
  actions,
  isSelectVisible = false,
  totalPages = 1,
  page = 1,
  setPage,
  limit = 10,
  filterModalName = "FilterModal",
  exportModalName = "ExportExcelModal",
}) => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
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
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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

      <div className="flex gap-4 justify-end items-center py-2">
        <Button
          component="label"
          color="secondary"
          variant="outlined"
          startIcon={<BookmarkOutlinedIcon />}
        >
          Presets
        </Button>

        <Button
          component="label"
          variant="outlined"
          onClick={() => {
            dispatch(openModal(filterModalName));
          }}
          startIcon={<FilterAltIcon />}
        >
          Filters
        </Button>
      </div>
      {ClientCards}
      <div className={`${ClientCards !== null ? "hidden md:block " : ""}`} >
      <RawTable
        tableData={tableData}
        actions={actions}
        isSelectVisible={isSelectVisible}
        page={page}
        limit={limit}
      />
      </div>
      

      <div className="flex gap-4 md:flex-row flex-col items-center justify-between py-4">
        <Pagination
          onChange={(e, page) => setPage(page)}
          count={totalPages || 1}
          variant="outlined"
          shape="rounded"
        />
        <PageLimitEditor pageId={tableHeader} />
      </div>
    </div>
  );
};

export default DataTable;
