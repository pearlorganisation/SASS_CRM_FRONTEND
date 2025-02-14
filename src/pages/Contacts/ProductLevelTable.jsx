import React, { useEffect, useState } from "react";
import { getEnrollmentsByProductLevel, getProductLevelCounts } from "../../features/actions/product";
import { useDispatch, useSelector } from "react-redux";
import productLevelService from "../../services/productLevelService";
import EnrollmentsTableModal from "./EnrollmentsTableModal";
import { createPortal } from "react-dom";

const ProductLevelTable = ({ email }) => {
  const { productLevelCounts, isLoading } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
  const [productLevelObj, setProductLevelObj] = useState({});
  const [modal, setModal] = useState(false);

  useEffect(() => {
    dispatch(getProductLevelCounts(email));
    productLevelService.getProductLevels().then((res) => {
      if (res.success) {
        const obj = {};
        res.data.forEach((item) => {
          obj[item.level] = item.label;
        });
        setProductLevelObj(obj);
      }
    });
  }, [dispatch, email]);

  const handleRowClick = (rowData) => {
    console.log("Row clicked:", rowData);
    dispatch(getEnrollmentsByProductLevel({ email, productLevel: rowData._id }));
    setModal(true);
  };

  return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productLevelCounts.map((item, index) => (
              <tr 
                key={item._id} 
                onClick={() => handleRowClick(item)}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {productLevelObj[item._id]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modal && createPortal(<EnrollmentsTableModal setModal={setModal} />, document.body)}
      </div>
 
  );
};

export default ProductLevelTable;
