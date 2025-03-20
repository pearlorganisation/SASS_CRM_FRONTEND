import React, { memo, Suspense, useState, lazy, useEffect } from "react";
import {
  Pagination,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import PageLimitEditor from "../PageLimitEditor";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../features/slices/modalSlice";
import RawTable from "./RawTable";
const FilterPresetModal = lazy(() => import("../Filter/FilterPresetModal"));
import useAddUserActivity from "../../hooks/useAddUserActivity";
import ModalFallback from "../Fallback/ModalFallback";
import { BookmarkIcon, FilterIcon, GreenDownloadIcon, ThreeDotsIcon } from "../SVGs";

const DataTable = ({
  tableHeader = "Table",
  tableUniqueKey = "id",
  ButtonGroup = null,
  filters,
  setFilters,
  ClientCards = null,
  tableData,
  actions,
  isSelectVisible = false,
  totalPages = 1,
  page = 1,
  setPage,
  limit = 10,
  filterModalName = "",
  exportModalName = "",
  isLoading = false,
  selectedRows = [],
  rowClick = (row) => {},
  isRowClickable = false,
  setSelectedRows = () => {},
  isLeadType = false,
  locations = null,
  sortByOrder = "asc",
}) => {
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();
  // console.log("DataTable -> Rendered");

  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { userData } = useSelector((state) => state.auth);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    console.log("handleClick", event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700">{tableHeader}</h2>

        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          disablePortal
        >
          <MenuItem
            onClick={() => {
              dispatch(openModal({ modalName: exportModalName }));
              handleClose();
            }}
          >
            <ListItemIcon>
            <img src={GreenDownloadIcon} alt="Download" className="h-4 w-4" />
            </ListItemIcon>
            <span className="text-sm font-medium"> Export</span>
          </MenuItem>
        </Menu>
      </div>
      <div
        className={`flex gap-4 ${
          ButtonGroup ? "justify-between flex-wrap" : "justify-end"
        } py-2 items-center`}
      >
        {ButtonGroup && <ButtonGroup />}
        {userData?.isActive && filterModalName !== "" && (
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsPresetModalOpen(true);
              }}
              className="border-purple-500 h-10 border text-md text-purple-500 px-4 rounded-md flex items-center gap-2 "
            >
              <img src={BookmarkIcon} alt="Bookmark" width={20} height={20} />
              Presets
            </button>
            <button
              onClick={() => {
                dispatch(openModal(filterModalName));
              }}
              className="border-blue-500 h-10 border text-md text-blue-500 px-4 rounded-md flex items-center gap-2 "
            >
              <img src={FilterIcon} alt="Bookmark" width={22} height={22} />
              Filters
              {filters && Object.keys(filters)?.length > 0 && (
                <span className=" px-2 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>
            {userData?.isActive &&
              tableUniqueKey !== "viewAssignmentsTable" &&
              exportModalName !== "" && (
                <div className="flex justify-center overflow-visible relative items-center gap-4">
                  {tableData.totalRecords ? (
                    <span className="font-semibold text-neutral-800">
                      Total Records:{" "}
                      <span className="text-indigo-500">
                        {tableData.totalRecords}
                      </span>
                    </span>
                  ) : null}

                  <button
                    className="p-2 hover:bg-gray-200 rounded-full group"
                    onClick={handleClick}
                  >
                    <img src={ThreeDotsIcon} alt="Edit" className="h-6 w-6" />
                  </button>

                  {/* {
                    true && (
                      <div className="absolute right-0 bottom-0 bg-white shadow-md rounded-md p-2">
                        <span>Export</span>
                      </div>
                    )
                  } */}
                </div>
              )}
          </div>
        )}
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
          limit={limit}
          isLoading={isLoading}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          userData={userData}
          rowClick={rowClick}
          isRowClickable={isRowClickable}
          isLeadType={isLeadType}
          locations={locations}
          sortByOrder={sortByOrder}
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
            page={Number(page) || 1}
            variant="outlined"
            shape="rounded"
          />
          <PageLimitEditor setPage={setPage} pageId={tableHeader} />
        </div>
      )}
      {isPresetModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <FilterPresetModal
            tableName={tableUniqueKey}
            filters={filters}
            setFilters={setFilters}
            setIsPresetModalOpen={setIsPresetModalOpen}
          />
        </Suspense>
      )}
    </div>
  );
};

export default memo(DataTable);
