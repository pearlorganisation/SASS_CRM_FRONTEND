import React, { useEffect, useState } from "react";
import { FaRegEdit, FaCheckSquare } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setPageLimit } from "../features/slices/pageLimits";
import useAddUserActivity from "../hooks/useAddUserActivity";

const PageLimitEditor = ({ pageId = "defaultPage", setPage = () => {} }) => {
  const logUserActivity = useAddUserActivity();
  const dispatch = useDispatch();
  const limitFromRedux = useSelector((state) => state.pageLimits[pageId] || 10);

  const [isEditing, setIsEditing] = useState(false);
  const [pageLimit, setPageLimitState] = useState(limitFromRedux);

  useEffect(() => {
    setPageLimitState(limitFromRedux);
  }, [limitFromRedux]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // console.log("pageLimit", pageLimit);
    const validLimit =
      pageLimit === "" ? 10 : Math.max(1, Math.min(100, Number(pageLimit)));
    setPageLimitState(validLimit);
    dispatch(setPageLimit({ pageId, limit: validLimit }));
    logUserActivity({
      action: "savePageLimit",
      details: `User Updated Page Limit For ${pageId}: ${validLimit}`,
    });
    setIsEditing(false);
    setPage(1);
  };

  return (
    <div className="border rounded-md px-3 py-2 flex items-center gap-3 w-fit text-gray-600">
      {isEditing ? (
        <input
          type="number"
          value={pageLimit}
          onClick={(e) => e.target.select()}
          onKeyDown={(e) => {
            if (["-", "e", "+","."].includes(e.key)) {
              e.preventDefault();
            }
            if (e.key === "Enter") {
              handleSaveClick();
            }
          }}
          onChange={(e) => {
            const value = e.target.value; // Allow empty string
            if (
              value === "" ||
              (!isNaN(value) && Number(value) >= 0 && Number(value) <= 100)
            ) {
              setPageLimitState(value);
            }
          }}
          className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none "
          min={1}
          max={100}
        />
      ) : (
        <label className="text-sm font-medium">
          Page Limit: {limitFromRedux}
        </label>
      )}

      {isEditing ? (
        <button
          onClick={handleSaveClick}
          className="text-green-500 hover:text-green-700"
          title="Save"
        >
          <FaCheckSquare size={20} />
        </button>
      ) : (
        <button
          onClick={handleEditClick}
          className="text-gray-500 hover:text-gray-700"
          title="Edit"
        >
          <FaRegEdit size={20} />
        </button>
      )}
    </div>
  );
};

export default PageLimitEditor;
