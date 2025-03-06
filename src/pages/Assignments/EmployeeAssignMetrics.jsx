import React, { useState, useEffect } from "react";
import multiService from "../../services/multiService";
import { formatDate, errorToast, formatDateAsNumber } from "../../utils/extra";
import useRoles from "../../hooks/useRoles";
import { useSelector } from "react-redux";

const EmployeeAssignMetrics = () => {
  const roles = useRoles();
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role;
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    daily: [],
  });

  const fetchMetrics = async () => {
    try {
      setLoading(true);
       // Create adjusted end date
       const adjustEndDate = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0];
      };

      if (roles.isEmployeeId(role)) {
       

        const [countRes, dailyRes] = await Promise.all([
          multiService.getAssignmentCountByDateRange({
            start: startDate,
            end: adjustEndDate(endDate), // Use adjusted end date
          }),
          multiService.getDailyAssignmentStats({
            start: startDate,
            end: adjustEndDate(endDate), // Use adjusted end date
          }),
        ]);
        if (countRes.success) {
          const [countData = {}] = countRes.data || [];
          const dailyData = dailyRes.data || [];

          setStats({
            total: countData?.totalAssignments || 0,
            completed: countData?.completed || 0,
            active: countData?.active || 0,
            daily: dailyData || [],
          });
        }
      } else {
        const allRes = await multiService.getAllAssignmentsByDateRange({
          start: startDate,
          end: adjustEndDate(endDate),
        });

        if (allRes.success) {
          const allData = allRes.data || [];
          const result =  {total: 0 , completed: 0 , active: 0};
          const dataByDate = {};
          allData.forEach(item => {
            result.total += item.count;
            result.completed += item.completed;
            result.active += item.count - item.completed;
            if(!dataByDate[item.date]){
              dataByDate[item.date] = {
                count: item.count,
                completed: item.completed,
                active: item.count - item.completed,
                date: item.date,
                data: [item],
              };
            }
            else{
              dataByDate[item.date].count += item.count;
              dataByDate[item.date].completed += item.completed;
              dataByDate[item.date].active += item.count - item.completed;
              dataByDate[item.date].data.push(item);
            }
          });
          const dailyData = Object.values(dataByDate);
          console.log(dailyData,'skdjfljflskfj');
          
          setStats(prev => ({...prev, ...result, daily: dailyData}));
        }
      }
    } catch (error) {
      errorToast(error.message || "Error loading metrics");
    } finally {
      setLoading(false);
    }
  };

  const handleDateApply = () => {
    if (new Date(startDate) > new Date(endDate)) {
      errorToast("End date cannot be before start date");
      return;
    }
    fetchMetrics();
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Calculate max value for scaling
  const maxAssignments = Math.max(...stats.daily.map((d) => d.count), 1);

  return (
    <div className="p-8 max-w-7xl mt-10 mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Assignment Metrics</h1>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <button
            onClick={handleDateApply}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Applying..." : "Apply Dates"}
          </button>
        </div>

        {/* <p className="text-gray-500 mt-4">
          Showing data from {formatDateAsNumber(startDate)} to {formatDateAsNumber(endDate)}
        </p> */}

        {loading ? (
          <></>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Assignments
                </h3>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700">
                  Completed
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.completed}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700">Active</h3>
                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {stats.active}
                </p>
              </div>
            </div>

            {/* Custom Bar Chart */}
            {/* <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Daily Assignment Trend</h2>
              <div className="space-y-4">
                {stats.daily.map((day) => {
                  const completionPercentage = (day.completed / day.count) * 100 || 0;
                  return (
                    <div key={day.date} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{day.date}</span>
                        <span>{day.completed}/{day.count} ({completionPercentage.toFixed(1)}%)</span>
                      </div>
                      <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute h-full bg-indigo-100" 
                          style={{ width: `${(day.count / maxAssignments) * 100}%` }}
                        >
                          <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                              {day.completed} completed
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div> */}

            {/* Data Table */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Completion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.daily.map((day) => (
                    <tr key={day.date}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {day.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {day.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">
                        {day.completed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {((day.completed / day.count) * 100 || 0).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeAssignMetrics;
