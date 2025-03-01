import React, { useEffect, useState } from "react";
import tagsService from "../../../services/tagsService";
import AddEditTagsModal from "./AddEditTagsModal";
import { formatDateAsNumberWithTime } from "../../../utils/extra";

const ManageTags = () => {
  const [tags, setTags] = useState([]);
  const [modal, setModal] = useState(false);
  const fetchTags = () => {
    tagsService.getTags().then((res) => {
      if (res.success) {
        setTags(res.data);
      }
    });
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className=" w-full pt-14 p-6">
      <div className="p-6 bg-gray-50  rounded-lg">
        <div className="flex gap-4 mb-8 justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">Manage Tags</h2>
          <div>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded-md"
              onClick={() => setModal(true)}
            >
              Add Tag
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  S.No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usecase
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tags.map((tag, index) => (
                <tr
                  key={tag._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {tag.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap capitalize">
                    {tag.usecase ? tag.usecase.replace("_", " ") : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {formatDateAsNumberWithTime(tag.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && <AddEditTagsModal setModal={setModal} fetchTags={fetchTags} />}
    </div>
  );
};

export default ManageTags;
