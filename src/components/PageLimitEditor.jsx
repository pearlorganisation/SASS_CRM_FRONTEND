import React, { useEffect, useState } from "react";
import { TextField, IconButton, Box } from "@mui/material";
import { FaRegEdit, FaCheckSquare } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setPageLimit } from "../features/slices/pageLimits";

const PageLimitEditor = ({ pageId = "defaultPage" }) => {
  const dispatch = useDispatch();
  const limitFromRedux = useSelector((state) => state.pageLimits[pageId] || 10);

  const [isEditing, setIsEditing] = useState(false);
  const [pageLimit, setPageLimitState] = useState(limitFromRedux);

  useEffect(() => {
    console.log('limitFromRedux', limitFromRedux, pageId);
    setPageLimitState(limitFromRedux);
  }, [limitFromRedux]);

  useEffect(() => {
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    dispatch(setPageLimit({ pageId, limit: pageLimit }));
    setIsEditing(false);
  };

  return (
    <Box className="border rounded-md px-3 flex items-center gap-3 w-fit text-gray-600">
      {isEditing ? (
        <TextField
          type="number"
          value={pageLimit}
          variant="standard"
          size="small"
          onClick={(e) => e.target.select()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSaveClick();
            }
          }}
          onChange={(e) => {
            const value = Math.max(1, Math.min(100, Number(e.target.value)));
            setPageLimitState(value);
          }}
          className="w-20"
          inputProps={{ min: 1, max: 100 }}
        />
      ) : (
        <label className="text-sm font-medium">
          Page Limit: {limitFromRedux}
        </label>
      )}

      {isEditing ? (
        <IconButton
          onClick={handleSaveClick}
          color="success"
          className="text-green-500"
          title="Save"
        >
          <FaCheckSquare />
        </IconButton>
      ) : (
        <IconButton
          onClick={handleEditClick}
          color="default"
          className="text-gray-500"
          title="Edit"
        >
          <FaRegEdit />
        </IconButton>
      )}
    </Box>
  );
};

export default PageLimitEditor;
