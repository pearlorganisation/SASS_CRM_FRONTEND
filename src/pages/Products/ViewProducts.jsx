import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { productTableColumns } from "../../utils/columnData";
import { Edit, Delete } from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import { resetProductState } from "../../features/slices/product";
import useRoles from "../../hooks/useRoles";
import { deleteProduct, getAllProducts } from "../../features/actions/product";
import EditProductModal from "./Modal/EditProductModal";
import productLevelService from "../../services/productLevelService";

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
  const [productLevelObj, setProductLevelObj] = useState({});
  const [productLevelData, setProductLevelData] = useState([]);

  const [product, setProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(false);

  const openConfirmDialog = () => {
    setConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(false);
  };

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

  useEffect(() => {
    productLevelService.getProductLevels().then((res) => {
      if (res.success) {
        setProductLevelData(res.data);
        const obj = {};
        res.data.forEach((item) => {
          obj[item.level] = item.label;
        });
        setProductLevelObj(obj);
      }
    });
  }, []);

  // ----------------------- Action Icons -----------------------

  const actionIcons = employeeModeData
    ? []
    : [
        {
          icon: () => (
            <Edit className="text-blue-500 group-hover:text-blue-600" />
          ),
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
          onClick: (item) => {
            setSelectedProduct(item);
            openConfirmDialog(item);
          },
        },
      ];

  const deleteThisProduct = (item) => {
    dispatch(deleteProduct(item._id)).then((res) => {
      dispatch(getAllProducts({ page: page || 1, limit: LIMIT, filters }));
    });
    setSelectedProduct(null);
    closeConfirmDialog();
  };
  return (
    <div className="px-6 md:px-10 pt-14 space-y-6">
      <div className="flex gap-4 justify-end">
        <ComponentGuard
          allowedRoles={[roles.ADMIN]}
          conditions={[userData?.isActive, employeeModeData ? false : true]}
        >
          <div className="flex gap-4 items-center">
          <Button
            onClick={() => navigate("/product-revenue")}
            variant="contained"
          >
            Revenue
          </Button>
          <Button
            onClick={() => navigate("/products/addProduct")}
            variant="contained"
          >
            Add Product
          </Button>
          </div>
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
                level: productLevelObj[item.level] || `L${item.level}`,

              }))
            : [],
        }}
        actions={userData.role === roles.ADMIN ? actionIcons : []}
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
          productLevelData={productLevelData}
        />
      )}

      <Dialog
        open={confirmDialog}
        onClose={closeConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Product?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delte this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Disagree</Button>
          <Button
            onClick={() => {
              deleteThisProduct(selectedProduct);
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewProducts;
