import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../features/actions/product";
import {
  Button,
  IconButton,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { roles } from "../../utils/roles";
import ProductDetailsModal from "./Modal/ProductDetailsModal";
import { addUserActivity } from "../../features/actions/userActivity";
import { formatDate } from "../../utils/extra";

const ViewProducts = () => {
  const [modalData, setModalData] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productData, isLoading, totalPages } = useSelector(
    (state) => state.product
  );
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllProducts({ page }));
  }, [dispatch, page]);

  const handleViewDetails = (product) => {
    setModalData(product);
    dispatch(
      addUserActivity({
        action: "viewDetails",
        details: `User viewed details of Product Name: ${product?.name}`,
      })
    );
  };

  const handlePagination = (e, p) => {
    setPage(p);
  };
  const tableCellStyles = {
    paddingTop: "6px",
    paddingBottom: "6px",
    textWrap: "nowrap",
  };

  const dummyData = [
    {
      id: 1,
      name: "Product A",
      price: 100,
      purchaseDate: "2024-12-01",
      webinar: "Webinar A",
      description: "Description A",
      level: "L1",
    },
    {
      id: 2,
      name: "Product B",
      price: 200,
      purchaseDate: "2024-12-01",
      webinar: "Webinar B",
      description: "Description B",
      level: "L2",
    },
  ];

  return (
    <div className="px-5 py-14">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <Typography variant="h5" className="font-bold">
          Product Details
        </Typography>
        {roles.SUPER_ADMIN === userData?.role ||
        roles.ADMIN === userData?.role ? (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/products/addProduct")}
          >
            Add Product
          </Button>
        ) : null}
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead className="bg-gray-50" >
            <TableRow>
              <TableCell className="font-semibold text-gray-700 whitespace-nowrap">Product Name</TableCell>
              <TableCell className="font-semibold text-gray-700  whitespace-nowrap">Price</TableCell>
              <TableCell className="font-semibold text-gray-700  whitespace-nowrap">Purchase Date</TableCell>
              <TableCell className="font-semibold text-gray-700  whitespace-nowrap">Webinar</TableCell>
              {/* <TableCell className="font-semibold text-gray-700  whitespace-nowrap">Description</TableCell> */}
              <TableCell className="font-semibold text-gray-700  whitespace-nowrap">Product Level</TableCell>
              <TableCell className="font-semibold text-gray-700  whitespace-nowrap sticky right-0 z-10">
                  Actions
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Stack spacing={2}>
                    <Skeleton variant="rectangular" height={40} />
                    <Skeleton variant="rectangular" height={40} />
                    <Skeleton variant="rectangular" height={40} />
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              (productData || dummyData).map((product, index) => (
                <TableRow key={index}>
                  <TableCell sx={tableCellStyles}>{product.name}</TableCell>
                  <TableCell sx={tableCellStyles}>₹ {product.price}</TableCell>
                  <TableCell sx={tableCellStyles}>
                    {formatDate(product.purchaseDate)}
                  </TableCell>
                  <TableCell sx={tableCellStyles}>{product.webinar}</TableCell>
                  {/* <TableCell sx={tableCellStyles}>
                    {product.description}
                  </TableCell> */}
                  <TableCell sx={tableCellStyles}>{product.level}</TableCell>
                  <TableCell
                    sx={tableCellStyles}
                    className="sticky right-0 bg-white z-10"
                  >
                    <div className="flex gap-2 ">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewDetails(product)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => console.log("Edit Product")}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => console.log("Delete Product")}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="flex justify-center mt-5">
        <Pagination
          count={totalPages || 5}
          page={page}
          color="primary"
          onChange={handlePagination}
        />
      </div>

      {/* Product Details Modal */}
      {modalData && (
        <ProductDetailsModal
          setModalData={setModalData}
          modalData={modalData}
        />
      )}
    </div>
  );
};

export default ViewProducts;
