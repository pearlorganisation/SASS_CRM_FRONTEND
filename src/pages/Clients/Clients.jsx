import React, { useEffect, useState } from "react";
import DataTable from "../../components/Table/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { clientTableColumns } from "../../utils/columnData";
import { useNavigate, useSearchParams } from "react-router-dom";
import UpdateClientModal from "../../components/Client/UpdateClientModal";
import ActiveInactiveModal from "../../components/Client/ActiveInactiveModal";
import ExportClientExcelModal from "../../components/Export/ExportClientExcelModal";
import ClientFilterModal from "../../components/Client/ClientFilterModal";
import { openModal } from "../../features/slices/modalSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import { getAllClients } from "../../features/actions/client";
import { Button } from "@mui/material";
import ClientCard from "../../components/Client/ClientCard";

const Clients = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const updateClientModalname = "UpdateClientModal";
  const updateClientStatusModalName = "UpdateClientStatusModal";
  const exportExcelModalName = "ExportClientExcel";
  const clientFilterModalName = "ClientFilterModal";
  const tableHeader = "Clients Table";

  // ----------------------- Constants -----------------------
  const actionIcons = [
    {
      icon: () => (
        <VisibilityIcon className="text-indigo-500 group-hover:text-indigo-600" />
      ),
      tooltip: "View Client Info",
      onClick: (item) => {
        navigate(`/view-client/${item?._id}`);
      },
    },
    {
      icon: () => (
        <EditIcon className="text-blue-500 group-hover:text-blue-600" />
      ),
      tooltip: "Edit Client",
      onClick: (item) => {
        dispatch(openModal({ modalName: updateClientModalname, data: item }));
      },
    },
    {
      icon: (item) => (
        <div className={`${item?.isActive ? "" : "rotate-180"}`}>
          <LogoutIcon
            className={`${item?.isActive ? "text-green-700" : "text-red-500"}`}
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
  console.log("clientsData", LIMIT);

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

  return (
    <div className="w-full pt-14 sm:px-5">
      <div className="flex justify-end mb-5">
        <Button variant="contained" 
        onClick={() => navigate("/add-client")}
        color="primary">
          Add Client
        </Button>
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
      />

      <UpdateClientModal modalName={updateClientModalname} />
      <ActiveInactiveModal modalName={updateClientStatusModalName} />
      <ExportClientExcelModal filters={filters} modalName={exportExcelModalName} />
      <ClientFilterModal
        setFilters={setFilters}
        filters={filters}
        modalName={clientFilterModalName}
      />
    </div>
  );
};

export default Clients;