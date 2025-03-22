import React, {
  memo,
  Suspense,
  useState,
  lazy,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Pagination from "@mui/material/Pagination";
import PageLimitEditor from "../PageLimitEditor";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../features/slices/modalSlice";
import RawTable from "./RawTable";
const FilterPresetModal = lazy(() => import("../Filter/FilterPresetModal"));
import useAddUserActivity from "../../hooks/useAddUserActivity";
import ModalFallback from "../Fallback/ModalFallback";
import {
  BookmarkIcon,
  FilterIcon,
  GreenDownloadIcon,
  ThreeDotsIcon,
} from "../SVGs";

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
  console.log("DataTable -> re-render");

  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { userData } = useSelector((state) => state.auth);
  

  const handleClick = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700">{tableHeader}</h2>

        {userData?.isActive &&
          tableUniqueKey !== "viewAssignmentsTable" &&
          exportModalName !== "" && (
            <div className="flex justify-center overflow-visible relative items-center gap-4">
              {tableData.totalRecords && (
                <span className="font-semibold text-neutral-800">
                  Total Records:{" "}
                  <span className="text-indigo-500">
                    {tableData.totalRecords}
                  </span>
                </span>
              )}

              <div className="relative">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full group"
                  onClick={handleClick}
                >
                  <img src={ThreeDotsIcon} alt="Menu" className="h-6 w-6" />
                </button>

                {open && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 top-full px-4 mt-1 bg-white shadow-lg rounded-md py-2 border border-gray-100 z-50"
                  >
                    <button
                      onClick={() => {
                        dispatch(openModal({ modalName: exportModalName }));
                        handleClose();
                      }}
                      className="max-w-fit py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left flex justify-between items-center "
                    >
                      <img
                        src={GreenDownloadIcon}
                        alt="Download"
                        className="h-4 w-4"
                      />
                      <span className="text-sm px-4 font-medium"> Export</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
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
          </div>
        )}
      </div>
      {ClientCards}
      <div className={`${ClientCards !== null ? "hidden md:block " : ""}`}>
        <RawTable
          tableData={tableData}
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

export default memo(DataTable, areEqual);


function areEqual(prevProps, nextProps) {
  // Compare each prop to determine if the component should re-render
  // console.log("tableData", prevProps.tableData === nextProps.tableData);
  
  // console.log(
  //   "isSelectVisible",
  //   prevProps.isSelectVisible === nextProps.isSelectVisible
  // );
  // console.log("page", prevProps.page === nextProps.page);
  // console.log("limit", prevProps.limit === nextProps.limit);
  // console.log("isLoading", prevProps.isLoading === nextProps.isLoading);
  // console.log(
  //   "selectedRows",
  //   prevProps.selectedRows === nextProps.selectedRows
  // );
  // console.log("totalPages", prevProps.totalPages === nextProps.totalPages);
  // console.log("rowClick", prevProps.rowClick === nextProps.rowClick);
  // console.log(
  //   "isRowClickable",
  //   prevProps.isRowClickable === nextProps.isRowClickable
  // );
  // console.log("isLeadType", prevProps.isLeadType === nextProps.isLeadType);
  // console.log("userData", prevProps.userData === nextProps.userData);
  // console.log("locations", prevProps.locations === nextProps.locations);
  // console.log("sortByOrder", prevProps.sortByOrder === nextProps.sortByOrder);
  // console.log(
  //   "setSelectedRows",
  //   prevProps.setSelectedRows === nextProps.setSelectedRows
  // );

  // console.log("prevProps.tableHeader", prevProps.tableHeader === nextProps.tableHeader);
  // console.log("prevProps.tableUniqueKey", prevProps.tableUniqueKey === nextProps.tableUniqueKey);
  // console.log("prevProps.ButtonGroup", prevProps.ButtonGroup === nextProps.ButtonGroup);
  // console.log("prevProps.filters", prevProps.filters === nextProps.filters);
  // console.log("prevProps.setFilters", prevProps.setFilters === nextProps.setFilters);
  // console.log("prevProps.ClientCards", prevProps.ClientCards === nextProps.ClientCards);
  // console.log("prevProps.exportModalName", prevProps.exportModalName === nextProps.exportModalName);
  // console.log("prevProps.isPresetModalOpen", prevProps.isPresetModalOpen === nextProps.isPresetModalOpen);
  // console.log("prevProps.open", prevProps.open === nextProps.open);
  // console.log("prevProps.menuRef", prevProps.menuRef === nextProps.menuRef);
  // console.log("prevProps.userData", prevProps.userData === nextProps.userData);
  // console.log("prevProps.locations", prevProps.locations === nextProps.locations);
  // console.log("prevProps.sortByOrder", prevProps.sortByOrder === nextProps.sortByOrder);
  
  

  return (
    prevProps.tableData === nextProps.tableData &&
    prevProps.isSelectVisible === nextProps.isSelectVisible &&
    prevProps.totalPages === nextProps.totalPages &&
    prevProps.page === nextProps.page &&
    prevProps.limit === nextProps.limit &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.selectedRows === nextProps.selectedRows 
    
    

  );
}