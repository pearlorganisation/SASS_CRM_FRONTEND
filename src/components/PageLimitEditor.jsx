import React, { useEffect, useState } from "react";
import { FaRegEdit, FaCheckSquare } from "react-icons/fa";

const PageLimitEditor = (props) => {
  const {
    localStorageKey = "defaultPageLimit",
    setLimit = (limit) => {
      console.log("limit", limit);
    },
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [pageLimit, setPageLimit] = useState(10);

  useEffect(() => {
    const savedData = parseInt(localStorage.getItem(localStorageKey), 10);
    console.log(localStorageKey, savedData);
    if (!isNaN(savedData)) {
      setPageLimit(savedData);
    }
    setLimit(savedData || 10);
  }, [localStorageKey]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    localStorage.setItem(localStorageKey, pageLimit);
    setIsEditing(false);
    console.log("Page limit updated:", pageLimit);
    setLimit(pageLimit);
  };

  return (
    <div className="border text-gray-600 rounded-md text-sm items-center px-3 flex  gap-3 w-full">
      {isEditing ? (
        <input
          type="number"
          value={pageLimit}
          onChange={(e) => setPageLimit(e.target.value)}
          className="border rounded px-2 py-1 w-16"
        />
      ) : (
        <label>Page Limit: {pageLimit}</label>
      )}

      {isEditing ? (
        <FaCheckSquare
          onClick={handleSaveClick}
          className="text-xl cursor-pointer text-green-500"
          title="Save"
        />
      ) : (
        <FaRegEdit
          onClick={handleEditClick}
          className="text-xl cursor-pointer"
          title="Edit"
        />
      )}
    </div>
  );
};

export default PageLimitEditor;
