import React from "react";
import { errorToast } from "../../utils/extra";

const EmpAssignModal = ({ selectedData, setSelectedData }) => {
    if(!Array.isArray(selectedData.data)){
        errorToast("Invalid Data");
    }
    console.log('render')
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-start">
          <h2 className="text-2xl font-bold text-white">Employee Assignment Details</h2>
          <button
            onClick={() => setSelectedData(null)}
            className="text-indigo-100 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Pending
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedData.data.map((entry, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-center text-sm text-gray-900 whitespace-nowrap">
                      {entry.userName}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 whitespace-nowrap">
                      {entry.count}
                    </td>
                    <td className="px-4 py-3 text-center text-sm whitespace-nowrap text-green-600">
                      {entry.completed}
                    </td>
                    <td className="px-4 py-3 text-center text-sm whitespace-nowrap text-amber-600">
                      {entry.count - entry.completed}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                        {((entry.completed / entry.count) * 100 || 0).toFixed(1)}%
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpAssignModal;
