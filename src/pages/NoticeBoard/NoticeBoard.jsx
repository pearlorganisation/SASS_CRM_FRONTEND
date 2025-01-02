import React, { useEffect } from "react";
import { Paper, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import useRoles from "../../hooks/useRoles";
import { getNoticeBoard } from "../../features/actions/noticeBoard";
import { resetSuccessAndUpdate } from "../../features/slices/noticeBoard";

const NoticeBoardPage = () => {
  const roles = useRoles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { noticeData } = useSelector((state) => state.noticeBoard);
  const { employeeModeData } = useSelector((state) => state.employee);

  const editorContent = noticeData?.content || "<p>Loading notice board...</p>";
  useEffect(() => {
    dispatch(getNoticeBoard());
    dispatch(resetSuccessAndUpdate());
  }, []);
  return (
    <div className="pt-14  md:px-8 px-4 lg:px-12  flex flex-col items-center">
      {/* Title */}

      {/* Update Button at the top right */}
      <div className="flex w-full max-w-4xl justify-between items-center">
        <div className="text-4xl font-bold">Notice Board</div>
        <ComponentGuard
          allowedRoles={[roles.ADMIN]}
          conditions={[userData?.isActive , employeeModeData ? false : true]}
        >
          {" "}
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/notice-board/update")}
            className="h-fit"
          >
            Update
          </Button>
        </ComponentGuard>
      </div>

      {/* Preview content area */}
      <div className="max-w-4xl w-full  mt-10">
        <Paper className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
          <div
            className="preview-content text-base leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{ __html: editorContent }}
          />
        </Paper>
      </div>
    </div>
  );
};

export default NoticeBoardPage;
