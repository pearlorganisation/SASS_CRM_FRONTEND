import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatDate } from "../../../utils/extra";

const ViewFullDetailsModal = (props) => {
  const { setModalData, modalData } = props;

  return (
    <Dialog
      open={!!modalData}
      onClose={() => setModalData(null)}
      fullWidth
      maxWidth="md"
      className="backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-6 pt-4">
        <DialogTitle>
          <Typography variant="h6" component="div" className="font-semibold">
            Full Details
          </Typography>
        </DialogTitle>
        <IconButton
          edge="end"
          onClick={() => setModalData(null)}
          aria-label="close"
          className="hover:text-emerald-600 focus:text-emerald-700"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-thin">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="bg-slate-100 font-medium text-slate-700">
                Date
              </TableCell>
              <TableCell className="bg-slate-50 text-slate-500">
                {formatDate(modalData?.updatedAt)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="bg-slate-100 font-medium text-slate-700">
                Created BY
              </TableCell>
              <TableCell className="bg-slate-50 text-slate-500">
              {modalData?.createdBy?.userName || "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="bg-slate-100 font-medium text-slate-700">
                Phone Number
              </TableCell>
              <TableCell className="bg-slate-50 text-slate-500">
                {modalData?.phone}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="bg-slate-100 font-medium text-slate-700">
                Call Duration
              </TableCell>
              <TableCell className="bg-slate-50 text-slate-500">
                {`${modalData?.callDuration?.hr || 0} hr ${
                  modalData?.callDuration?.min || 0
                } min ${modalData?.callDuration?.sec || 0} sec`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="bg-slate-100 font-medium text-slate-700">
                Status
              </TableCell>
              <TableCell className="bg-slate-50 text-slate-500">
                {modalData?.status}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="bg-slate-100 font-medium text-slate-700">
                Product
              </TableCell>
              <TableCell className="bg-slate-50 text-slate-500">
                {modalData?.product || "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="bg-slate-100 font-medium text-slate-700">
                Image
              </TableCell>
              <TableCell className="bg-slate-50 text-slate-500">
                {Array.isArray(modalData?.image) &&
                modalData.image.length > 0 &&
                modalData.image[0].url ? (
                  <a
                    href={modalData.image[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-emerald-600"
                  >
                    <img
                      src={modalData.image[0].url}
                      alt="Uploaded"
                      className="max-h-52 rounded-md border"
                    />
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="bg-slate-100 font-medium text-slate-700">
                Note
              </TableCell>
              <TableCell className="bg-slate-50 text-slate-500">
                {modalData?.note || "-"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ViewFullDetailsModal;
