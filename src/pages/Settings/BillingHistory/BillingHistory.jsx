import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getAdminBillingHistory } from "../../../features/actions/pricePlan";
import { Pagination } from "@mui/material";
import PageLimitEditor from "../../../components/PageLimitEditor";

const BillingHistory = () => {
  const dispatch = useDispatch();
  const { billingHistory, totalPages } = useSelector((state) => state.pricePlans);

    const [page, setPage] = useState(1);
    const LIMIT = useSelector(
      (state) => state.pageLimits["billingHistory"] || 10
    );

  useEffect(() => {
    dispatch(getAdminBillingHistory({page, limit:LIMIT}));
  }, [page, LIMIT]);

  return (
    <div className=" w-full pt-14 p-6">
      <div className="p-6 bg-gray-50  rounded-lg">
        <div className="flex gap-4 mb-8 justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">Billing History</h2>
        </div>
        <div className="overflow-x-auto border rounded-lg border-gray-300">
          <table className="min-w-full bg-white ">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Plan / Add-On</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((bill) => (
                <tr key={bill._id} className="text-center">
                  <td className="py-2 px-4 border-b">
                    {new Date(bill?.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {"\u20B9"}
                    {bill?.amount}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {bill?.plan?.name || bill?.addOn?.addonName}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button className="text-blue-500 hover:text-blue-700">
                      <FiDownload size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 md:flex-row flex-col flex-wrap items-center justify-between py-4">
            <Pagination
              onChange={(e, page) => {
                setPage(page);
                // logUserActivity({
                //   action: "Page changed",
                //   details: `User changed page For ${tableHeader} to ${page} `,
                // });
              }}
              count={totalPages || 1}
              page={Number(page) || 1}
              variant="outlined"
              shape="rounded"
            />
            <PageLimitEditor setPage={setPage} pageId={"billingHistory"} />
          </div>
      </div>
    </div>
  );
};

export default BillingHistory;
