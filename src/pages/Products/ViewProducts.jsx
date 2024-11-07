import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../features/actions/product";
import { Skeleton, Stack } from "@mui/material";
import { roles } from "../../utils/roles";
import ProductDetailsModal from "./Modal/ProductDetailsModal";

const ViewProducts = () => {
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productData, isLoading } = useSelector((state) => state.product);
  const { userData } = useSelector((state) => state.auth);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    dispatch(getAllProducts(userData?.id));
  }, []);

  return (
    <div>
      <div
        className={`${showFilters ? "" : "hidden"} fixed w-screen h-screen z-2`}
        onClick={() => setShowFilters(false)}
      ></div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <div className="p-10 ">
        <div className="flex justify-between">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl mb-5">
            Product Details
          </h3>
        </div>
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-8 bg-white ">
          <div className="relative">
            <button
              id="dropdownActionButton"
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 "
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <span className="sr-only">Action button</span>
              Filter
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {/* <!-- Dropdown menu --> */}
            <div
              id="dropdownAction"
              className={` ${
                showFilters ? "" : "hidden"
              } absolute top-full z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-44  `}
            >
              <ul
                className="py-1 text-sm text-gray-700 "
                aria-labelledby="dropdownActionButton"
              >
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100  ">
                    Ascending
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100  ">
                    Descending
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* <label for="table-search" className="sr-only">
              Search
            </label> */}
          {/* <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search-users"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500    "
                placeholder="Search for users"
              />
            </div> */}
          {roles.SUPER_ADMIN === userData?.role ||
            (roles.ADMIN === userData?.role && (
              <button
                onClick={() => navigate("/products/addProduct")}
                className="bg-blue-600 rounded-md text-white px-3 py-1 font-semibold "
              >
                Add Product
              </button>
            ))}
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>

                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center px-6 py-8">
                    <Stack spacing={4}>
                      <Skeleton variant="rounded" height={30} />
                      <Skeleton variant="rounded" height={25} />
                      <Skeleton variant="rounded" height={20} />
                      <Skeleton variant="rounded" height={20} />
                      <Skeleton variant="rounded" height={20} />
                    </Stack>
                  </td>
                </tr>
              ) : (
                Array.isArray(productData) &&
                productData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="bg-white border-b   hover:bg-gray-50 "
                  >
                    <td className="px-6 py-4">{item?.name}</td>
                    <td className="px-6 py-4">₹ {item?.price}</td>

                    <td className="px-6 py-4">
                      <span 
                      onClick={() => setModalData(item)}
                      className="font-medium text-blue-600 cursor-pointer hover:underline">
                        View Details
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {
        modalData && (
          <ProductDetailsModal
            setModalData={setModalData}
            modalData={modalData}
          />
        )
      }
    </div>
  );
};

export default ViewProducts;
