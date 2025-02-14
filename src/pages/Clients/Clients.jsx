import React, { lazy, Suspense, useEffect, useState } from "react";
import DataTable from "../../components/Table/DataTable";

import { useDispatch, useSelector } from "react-redux";
import { clientTableColumns } from "../../utils/columnData";
import { useNavigate, useSearchParams } from "react-router-dom";
const UpdateClientModal = lazy(() =>
  import("../../components/Client/UpdateClientModal")
);
const ActiveInactiveModal = lazy(() =>
  import("../../components/Client/ActiveInactiveModal")
);
const ExportClientExcelModal = lazy(() =>
  import("../../components/Export/ExportClientExcelModal")
);
const ClientFilterModal = lazy(() =>
  import("../../components/Client/ClientFilterModal")
);
import { openModal } from "../../features/slices/modalSlice";
import { getAllClients } from "../../features/actions/client";
import { Button } from "@mui/material";
import ClientCard from "../../components/Client/ClientCard";
import { MdVisibility, MdEdit, MdLogout } from "react-icons/md";
import ModalFallback from "../../components/Fallback/ModalFallback";
import { getPlansForDropdown } from "../../features/actions/pricePlan";

const Clients = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const updateClientModalname = "UpdateClientModal";
  const updateClientStatusModalName = "UpdateClientStatusModal";
  const exportExcelModalName = "ExportClientExcel";
  const clientFilterModalName = "ClientFilterModal";
  const tableHeader = "Clients Table";

  const { modals } = useSelector((state) => state.modals);
  const openClientFilterModal = modals[clientFilterModalName] ? true : false;
  const openExportExcelModal = modals[exportExcelModalName] ? true : false;
  const openClientStatusModal = modals[updateClientStatusModalName]
    ? true
    : false;
  const openUpdateClientModal = modals[updateClientModalname] ? true : false;

  // ----------------------- Constants -----------------------
  const actionIcons = [
    {
      icon: () => (
        <MdVisibility
          size={24}
          className="text-indigo-500 group-hover:text-indigo-600"
        />
      ),
      tooltip: "View Client Info",
      onClick: (item) => {
        navigate(`/view-client/${item?._id}`);
      },
    },
    {
      icon: () => (
        <MdEdit size={24} className="text-blue-500 group-hover:text-blue-600" />
      ),
      tooltip: "Edit Client",
      onClick: (item) => {
        dispatch(openModal({ modalName: updateClientModalname, data: item }));
      },
    },
    {
      icon: (item) => (
        <div className={`${item?.isActive ? "" : "rotate-180"}`}>
          <MdLogout
            size={24}
            className={`${!item?.isActive ? "text-green-700" : "text-red-500"}`}
          />
        </div>
      ),
      tooltip: "Toggle Status",
      onClick: (item) => {
        dispatch(
          openModal({
            modalName: updateClientStatusModalName,
            data: item,
          })
        );
      },
    },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    clientsData = [],
    isLoading,
    totalPages,
    isSuccess,
  } = useSelector((state) => state.client);
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(searchParams.get("page") || 1);

  // ----------------------- Functions -----------------------
  const ClientCards = (
    <div className=" gap-4 md:hidden grid  grid-cols-1">
      {clientsData.map((item, idx) => (
        <ClientCard key={idx} actions={actionIcons} item={item} />
      ))}
    </div>
  );

  // ----------------------- useEffects -----------------------

  useEffect(() => {
    dispatch(getAllClients({ page: page, limit: LIMIT, filters: filters }));
  }, [page, filters, LIMIT]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(getAllClients({ page: page, limit: LIMIT, filters: filters }));
    }
  }, [isSuccess]);

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  useEffect(() => {
    dispatch(getPlansForDropdown());
  }, []);

  return (
    <div className="w-full pt-14 sm:px-5">

      <div className="flex justify-end mb-5">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          onClick={() => navigate("/add-client")}
        >
          Add Client
        </button>
      </div>

      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="clientsListingTable"
        filters={filters}
        setFilters={setFilters}
        ClientCards={ClientCards}
        tableData={{
          columns: clientTableColumns,
          rows: clientsData,
        }}
        actions={actionIcons}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        limit={LIMIT}
        filterModalName={clientFilterModalName}
        exportModalName={exportExcelModalName}
        isLoading={isLoading}
      />
      {openUpdateClientModal && (
        <Suspense fallback={<ModalFallback />}>
          <UpdateClientModal modalName={updateClientModalname} />
        </Suspense>
      )}

      {openClientStatusModal && (
        <Suspense fallback={<ModalFallback />}>
          <ActiveInactiveModal modalName={updateClientStatusModalName} />
        </Suspense>
      )}

      {openExportExcelModal && (
        <Suspense fallback={<ModalFallback />}>
          <ExportClientExcelModal
            filters={filters}
            modalName={exportExcelModalName}
          />
        </Suspense>
      )}

      {openClientFilterModal && (
        <Suspense fallback={<ModalFallback />}>
          <ClientFilterModal
            setFilters={(filters) => {
              setFilters(filters);
              setPage(1);
            }}
            filters={filters}
            modalName={clientFilterModalName}
          />

        </Suspense>
      )}
    </div>
  );
};

export default Clients;
