import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearEnrollmentsByProductLevel } from '../../features/slices/product';
import { formatDateAsNumberWithTime } from '../../utils/extra';

const EnrollmentsTableModal = ({ setModal }) => {
    const dispatch = useDispatch();

    const {enrollmentsByProductLevel, isLoading} = useSelector((state) => state.product);

    useEffect(() => {
        return () => {
            dispatch(clearEnrollmentsByProductLevel());
        };
    }, []);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-2 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">Enrollment Records</h2>
              <p className="text-indigo-100 mt-1">{enrollmentsByProductLevel.length} total enrollments</p>
            </div>
            <button 
              onClick={() => setModal(false)}
              className="text-indigo-100 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
  
          {/* Table */}
          <div className="p-6">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Webinar</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollmentsByProductLevel.map((enrollment) => (
                    <tr key={enrollment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{enrollment.productName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{enrollment.productLevel}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{enrollment.webinarName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDateAsNumberWithTime(enrollment.webinarDate)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        ${enrollment.productPrice}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
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

export default EnrollmentsTableModal