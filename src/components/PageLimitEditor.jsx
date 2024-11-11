import React, { useEffect, useState } from "react";
import { FaRegEdit, FaCheckSquare } from "react-icons/fa";

const PageLimitEditor = (props) => {
  const {
    localStorageKey = "defaultPageLimit",
    setLimit = (limit) => {
    },
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [pageLimit, setPageLimit] = useState(10);

  useEffect(() => {
    const savedData = parseInt(localStorage.getItem(localStorageKey), 10);
    if (!isNaN(savedData)) {
      setPageLimit(savedData);
    }
    console.log("setting limit",savedData)
    setLimit(savedData || 10);
  }, [localStorageKey]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    localStorage.setItem(localStorageKey, pageLimit);
    setIsEditing(false);
    setLimit(pageLimit);
  };

  return (
    <div className="border text-gray-600 rounded-md text-sm items-center px-3 flex  gap-3 w-full">
      {isEditing ? (
        <input
        type="number"
        value={pageLimit}
        min={1}
        max={100}
        onClick={(e) => e.target.select()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSaveClick();
          }
        }}
        onChange={(e) => {
          const value = Math.max(1, Math.min(100, Number(e.target.value)));
          setPageLimit(value);
        }}
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
