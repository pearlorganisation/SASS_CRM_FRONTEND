import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import { getAdminBillingHistory } from "../../../features/actions/pricePlan";
import { Pagination } from "@mui/material";
import PageLimitEditor from "../../../components/PageLimitEditor";
import { getSuperAdmin } from "../../../features/actions/auth";
import { toast } from "sonner";

const BillingHistory = () => {
  const dispatch = useDispatch();
  const { billingHistory, totalPages } = useSelector(
    (state) => state.pricePlans
  );
  const { superAdminData, userData } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const LIMIT = useSelector(
    (state) => state.pageLimits["billingHistory"] || 10
  );

  useEffect(() => {
    dispatch(getAdminBillingHistory({ page, limit: LIMIT }));
  }, [page, LIMIT]);

  useEffect(() => {
    console.log("userData", userData);
    dispatch(getSuperAdmin());
  }, []);

  const downloadPDF = (bill) => {
    if (!superAdminData || !userData) {
      toast.error("Super Admin and Admin Data is required to download the PDF");
      return;
    }

    if (!bill?.date) {
      toast.error("Invalid Date");
      return;
    }

    const doc = new jsPDF();

    let YAxis = 20;
    doc.setFontSize(40);
    doc.setFont("Times New Roman", "bold");
    doc.text("Invoice", 200, YAxis + 5, { align: "right" });

    doc.setFontSize(9);
    doc
      .text("" + bill?.invoiceNumber || "" + "", 200, YAxis + 15, { align: "right" })
      .setFontSize(10);

    doc.text("Invoice No. :", 200 - doc.getTextWidth(bill?.invoiceNumber || ""), YAxis + 15, {
      align: "right",
    });

    doc.setFontSize(12);
    doc.text(superAdminData?.companyName, 13, YAxis).setFontSize(9);

    YAxis += 5;
    doc.setFont("Times New Roman", "normal");
    doc.text("Email : ", 13, YAxis);
    doc.text("" + superAdminData?.email + "", 30, YAxis);

    YAxis = YAxis + 5;

    doc.text("Address : ", 13, YAxis);
    doc.text("South Canmore, Spring Creek Mountain Village", 30, YAxis);

    YAxis += 10;
    doc
      .setFont("Times New Roman", "bold")
      .text("Bill To", 13, YAxis)
      .setFont("Times New Roman", "normal");

    YAxis += 5;

    doc
      .text("Company Name : ", 13, YAxis)
      .text("" + userData?.companyName + "", 40, YAxis);

    YAxis += 5;

    doc.text("Email : ", 13, YAxis).text("" + userData?.email + "", 40, YAxis);

    YAxis += 5;

    doc
      .text("Contact : ", 13, YAxis)
      .text("" + userData?.phone + "", 40, YAxis);

    YAxis += 5;

    doc
      .text("Address : ", 13, YAxis)
      .text("South Canmore, Spring Creek Mountain Village", 40, YAxis);

    if (userData?.gst) {
      YAxis += 5;

      doc.text("GSTIN : ", 13, YAxis).text("" + userData.gst + "", 40, YAxis);
    }
    YAxis += 3;

    doc.line(13, YAxis, 200, YAxis);

    YAxis += 10;

    if (bill.addOn) {
      doc
        .setFont("Times New Roman", "bold")
        .text("Item Type : ", 13, YAxis)
        .text("Add-On Name :", 13, YAxis + 5)
        .setFont("Times New Roman", "normal")
        .text("Add-On", 40, YAxis)
        .text("" + bill?.addOn?.addonName + "", 40, YAxis + 5);
    } else {
      doc
        .setFont("Times New Roman", "bold")
        .text("Item Type : ", 13, YAxis)
        .text("Plan Name :", 13, YAxis + 5)
        .setFont("Times New Roman", "normal")
        .text("Plan", 40, YAxis)
        .text("" + bill?.plan?.name + "", 40, YAxis + 5);
    }
    YAxis += 10;

    const date = new Date(bill?.date);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

    doc
      .setFont("Times New Roman", "bold")
      .text("Purchase Date : ", 13, YAxis)
      .setFont("Times New Roman", "normal")
      .text(formattedDate, 40, YAxis);
      
    YAxis += 3;

    doc.line(13, YAxis, 200, YAxis);

    YAxis += 6;

    doc
      .text("DESCRIPTION", 13, YAxis)
      .text("UNITS", 130, YAxis, { align: "right" })
      .text("UNIT PRICE", 170, YAxis, { align: "right" })
      .text("AMOUNT (INR)", 200, YAxis, { align: "right" });
    YAxis += 3;

    doc.line(13, YAxis, 200, YAxis);

    YAxis += 8;

    const description = bill.addOn
      ? `${bill.addOn.addonName} (Add-On)`
      : `${bill.plan.name} (Plan)`;

    doc.setFontSize(12);

    doc
      .setFont("Times New Roman", "normal")
      .text(description, 13, YAxis)
      .text("1", 130, YAxis, { align: "right" })
      .text(`Rs.${bill.itemAmount}`, 170, YAxis, { align: "right" })
      .setFont("Times New Roman", "bold")
      .text(`Rs.${bill.itemAmount}`, 200, YAxis, { align: "right" });

    YAxis += 5;

    doc.line(13, YAxis, 200, YAxis);

    YAxis += 5;

    doc
      .setFont("Times New Roman", "normal")
      .text(`Discount`, 170, YAxis, { align: "right" })
      .text(`Rs.${bill.discountAmount}`, 200, YAxis, { align: "right" });

      YAxis += 4;

      doc.line(150, YAxis, 200, YAxis);
  
      YAxis += 7;

    doc
      .setFont("Times New Roman", "normal")
      .text(`Sub Total`, 170, YAxis, { align: "right" })
      .text(`Rs.${bill.itemAmount - bill.discountAmount}`, 200, YAxis, { align: "right" });

    YAxis += 7;

    doc
      .text(`IGST @ 18%`, 170, YAxis, { align: "right" })
      .text(`Rs.${bill.taxAmount}`, 200, YAxis, { align: "right" });
    YAxis += 4;

    doc.line(150, YAxis, 200, YAxis);

    YAxis += 7;

    doc
      .setFont("Times New Roman", "bold")
      .text(`Total`, 170, YAxis, { align: "right" })
      .text(`Rs.${bill.amount}`, 200, YAxis, { align: "right" });

    YAxis += 4;
    doc.line(150, YAxis, 200, YAxis);

    doc.save("a4.pdf");
  };

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
                    <button
                      onClick={() => downloadPDF(bill)}
                      className="text-blue-500 hover:text-blue-700"
                    >
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
