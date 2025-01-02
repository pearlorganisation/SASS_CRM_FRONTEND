import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { productTableColumns } from "../../utils/columnData";
import { Edit, Delete } from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable";
import { openModal } from "../../features/slices/modalSlice";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import { resetProductState } from "../../features/slices/product";
import useRoles from "../../hooks/useRoles";
import { getAllProducts } from "../../features/actions/product";
import EditProductModal from "./Modal/EditProductModal";

const ViewProducts = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const exportModalName = "ExportProductModalname";
  const filterModalName = "FilterProductModalname";
  const tableHeader = "Product Table";

  // ----------------------- etcetra -----------------------
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();

  const { userData } = useSelector((state) => state.auth);
  const { isLoading, isSuccess, productData, totalPages } = useSelector(
    (state) => state.product
  );

  const { employeeModeData } = useSelector((state) => state.employee);
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [filters, setFilters] = useState({});

  const [product, setProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  useEffect(() => {
    dispatch(getAllProducts({ page, limit: LIMIT, filters }));
  }, [page, LIMIT, filters]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(getAllProducts({ page: 1, limit: LIMIT, filters }));
      dispatch(resetProductState());
    }
  }, [isSuccess]);
  // ----------------------- Action Icons -----------------------

  const actionIcons =  employeeModeData ? [] : [
    {
      icon: () => <Edit className="text-blue-500 group-hover:text-blue-600" />,
      tooltip: "Edit Product",
      onClick: (item) => {
        setProduct(item);
        setOpenModal(true);
      },
    },
    {
      icon: (item) => (
        <Delete className="text-red-500 group-hover:text-red-600" />
      ),
      tooltip: "Delete Product",
      onClick: (item) => {},
    },
  ];
  return (
    <div className="px-6 md:px-10 pt-14 space-y-6">
      <div className="flex gap-4 justify-end">
        <ComponentGuard
          allowedRoles={[roles.ADMIN]}
          conditions={[userData?.isActive, employeeModeData ? false : true]}
        >
          <Button
            onClick={() => navigate("/products/addProduct")}
            variant="contained"
          >
            Add Product
          </Button>
        </ComponentGuard>
      </div>

      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="productTable"
        filters={filters}
        setFilters={setFilters}
        tableData={{
          columns: productTableColumns,
          rows: Array.isArray(productData)
            ? productData.map((item) => ({
                ...item,
                level: `L${item.level}`,
              }))
            : [],
        }}
        actions={actionIcons}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        limit={LIMIT}
        filterModalName={filterModalName}
        isLoading={isLoading}
      />
      {openModal && (
        <EditProductModal
          product={product}
          setModal={setOpenModal}
          page={page}
          LIMIT={LIMIT}
        />
      )}
    </div>
  );
};

export default ViewProducts;
