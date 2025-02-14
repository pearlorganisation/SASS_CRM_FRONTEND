import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { webinarTableColumns } from "../../utils/columnData";
import { Edit, Delete, ContentCopy } from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable";
import { openModal } from "../../features/slices/modalSlice";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import CreateWebinar from "../../components/Webinar/CreateWebinar";
import DeleteModal from "../../components/Webinar/delete";
import { getAllWebinars } from "../../features/actions/webinarContact";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import { resetWebinarSuccess } from "../../features/slices/webinarContact";
const WebinarFilterModal = lazy(() =>
  import("../../components/Filter/WebinarFilterModal")
);
import ExportModal from "../../components/Export/ExportModal";
import { exportWebinarExcel } from "../../features/actions/export-excel";
import { toast } from "sonner";
import { setWebinarAttendeesFilters } from "../../features/slices/filters.slice";
import ModalFallback from "../../components/Fallback/ModalFallback";
import FullScreen from "../../components/FullScreen";
import { DateFormat } from "../../utils/extra";

const Webinar = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const exportModalName = "ExportFilterModal";
  const filterModalName = "WebinarFilterModal";
  const tableHeader = "Webinar Table";
  const createWebinarModalName = "createWebinarModal";

  // ----------------------- etcetra -----------------------
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logUserActivity = useAddUserActivity();

  const { isLoading, isSuccess, webinarData, totalPages } = useSelector(
    (state) => state.webinarContact
  );
  const { userData } = useSelector((state) => state.auth);
  const dateFormat = userData?.dateFormat || DateFormat.DD_MM_YYYY;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [id, setId] = useState();
  const [webinarName, setWebinarName] = useState(null);

  const handleDeleteModal = (ID, name) => {
    setShowDeleteModal(true);
    setId(ID);
    setWebinarName(name);
  };

  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [filters, setFilters] = useState({});


  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  useEffect(() => {
    dispatch(getAllWebinars({ page, limit: LIMIT, filters }));
  }, [page, LIMIT, filters]);

  useEffect(() => {
    if (isSuccess) {
      setShowDeleteModal(false);
      dispatch(getAllWebinars({ page: 1, limit: LIMIT, filters }));
      dispatch(resetWebinarSuccess());
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(setWebinarAttendeesFilters());
  }, []);

  const handleRowClick = (id, webinarName) => {
    logUserActivity({
      action: "navigate",
      navigateType: "page",
      detailItem: `/webinarDetails/${webinarName}`,
    });
    navigate(`/webinarDetails/${id}?webinarName=${webinarName}`);
  };

  // ----------------------- Action Icons -----------------------

  const actionIcons = [
    {
      icon: () => (
        <ContentCopy className="text-blue-500 group-hover:text-blue-600" />
      ),
      tooltip: "Copy Webinar Id",
      onClick: (item) => {
        navigator.clipboard.writeText(item?._id);
        toast.success("Copied to clipboard");
      },
    },
    ...(userData?.isActive
      ? [
          {
            icon: () => (
              <Edit className="text-blue-500 group-hover:text-blue-600"  />
            ),
            tooltip: "Edit Attendee",
            onClick: (item) => {
              dispatch(
                openModal({
                  modalName: createWebinarModalName,
                  data: item,
                })
              );
            },
          },
          {
            icon: (item) => (
              <Delete className="text-red-500 group-hover:text-red-600" />
            ),
            tooltip: "Delete Attendee",
            hideCondition: (item) => item?.totalParticipants <= 0 && item?.totalRegistrations <= 0,
            onClick: (item) => {
              handleDeleteModal(item?._id, item?.webinarName);
            },
          },
        ]
      : []),
  ];
  return (
    <div className="px-6 md:px-10 pt-14 space-y-6">
      <div className="flex gap-4 justify-end">
        <ComponentGuard conditions={[userData?.isActive]}>
          <Button
            onClick={() => dispatch(openModal(createWebinarModalName))}
            variant="contained"
          >
            Create Webinar
          </Button>
        </ComponentGuard>
      </div>
      <FullScreen>
        <DataTable
          tableHeader={tableHeader}
          tableUniqueKey="webinarTable"
          filters={filters}
          setFilters={setFilters}
          tableData={{
            columns: webinarTableColumns,
            rows: webinarData,
          }}
          actions={actionIcons}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          limit={LIMIT}
          filterModalName={filterModalName}
          exportModalName={exportModalName}
          isLoading={isLoading}
          rowClick={(row) => {
            handleRowClick(row?._id, row.webinarName);
          }}
          isRowClickable={true}
        />
        {showDeleteModal && (
          <DeleteModal
            setModal={setShowDeleteModal}
            webinarName={webinarName}
            id={id}
          />
        )}

        <CreateWebinar modalName={createWebinarModalName} />

        <Suspense fallback={<ModalFallback />}>
          <WebinarFilterModal
            filters={filters}
            setFilters={setFilters}
            modalName={filterModalName}
            dateFormat={dateFormat}
          />
        </Suspense>

        <ExportModal
          modalName={exportModalName}
          defaultColumns={webinarTableColumns}
          handleExport={({ limit, columns }) => {
            dispatch(exportWebinarExcel({ limit, columns, filters }));
          }}
        />
      </FullScreen>
    </div>
  );
};

export default Webinar;
