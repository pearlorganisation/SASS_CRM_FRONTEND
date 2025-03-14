import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPageLimit } from "../features/slices/pageLimits";
import useAddUserActivity from "../hooks/useAddUserActivity";
import { EditIcon, CheckSquare } from "./SVGs";

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
    console.log("pageLimit ---> render");

  const handleSaveClick = () => {
    const validLimit =
      pageLimit === "" ? 10 : Math.max(1, Math.min(1000, Number(pageLimit)));
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
              (!isNaN(value) && Number(value) >= 0 && Number(value) <= 1000)
            ) {
              setPageLimitState(value);
            }
          }}
          className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none "
          min={1}
          max={1000}
        />
      ) : (
        <label className="text-sm font-medium">
          Page Limit: {limitFromRedux}
        </label>
      )}

      {isEditing ? (
        <button
          onClick={handleSaveClick}
          className="text-green-500 "
          title="Save"
        >
          <img src={CheckSquare} alt="check" className="w-6 h-6" />
        </button>
      ) : (
        <button
          onClick={handleEditClick}
          className="text-gray-500 hover:text-gray-700"
          title="Edit"
        >
          <img src={EditIcon} alt="edit" className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default React.memo(PageLimitEditor);
