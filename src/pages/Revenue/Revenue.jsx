import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaDollarSign, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { GiPieChart, GiSparkles } from "react-icons/gi";
import { FiTrendingUp, FiBox } from "react-icons/fi";
import { formatCurrency, formatDate } from "../../utils/LeadType";
import revenueService from "../../services/revenueService";


const RevenueDashboard = () => {
  const [totalData, setTotalData] = useState({
    gross: 0,
    net: 0,
    final: 0,
    totalDiscounts: 0,
    totalTaxes: 0,
    count: 0,
  });

  const [billTypeData, setBillTypeData] = useState([]);
  const [durationData, setDurationData] = useState([]);
  const [topPlansData, setTopPlansData] = useState([]);
  const [topAddOnsData, setTopAddOnsData] = useState([]);
  const [loading, setLoading] = useState(false);


  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleDateApply = () => {
    revenueService.getTotalRevenue({ start: startDate, end: endDate }).then((res) => {
      setTotalData(res);
    });

    revenueService.getRevenueByType({ start: startDate, end: endDate }).then((res) => {
      setBillTypeData(res);
    });

    revenueService.getDurationRevenue({ start: startDate, end: endDate }).then((res) => {
      setDurationData(res);
    });

    revenueService.getTopPlans({ limit: 5, start: startDate, end: endDate }).then((res) => {
      setTopPlansData(res);
    });

    revenueService.getTopAddOns({ limit: 5, start: startDate, end: endDate }).then((res) => {
      setTopAddOnsData(res);
    });
  };

  useEffect(() => {
    handleDateApply();
    // dispatch(getMRR());
    // dispatch(getTaxCollected());
    // dispatch(getDiscountsGiven());
    // dispatch(getRevenueTrend({ interval: 'month' }));

  }, []); // Empty dependency array to run only on initial mount


  const MetricCard = ({ icon: Icon, title, value, helperText }) => (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {false ? "Loading..." : value || "--"}
          </p>
          {helperText && (
            <p className="mt-1 text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mt-10 mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h1>

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

        <p className="text-gray-500 mt-4">
          Showing data from {formatDate(startDate)} to {formatDate(endDate)}
        </p>
      </div>

      {/* {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-red-700">{error.message}</p>
            <button
              onClick={() => dispatch(resetRevenue())}
              className="text-red-500 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )} */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={FaDollarSign}
          title="Total Revenue"
          value={formatCurrency(totalData.final)}
          helperText={`Gross ${formatCurrency(
            totalData.gross
          )} • Net ${formatCurrency(totalData.net)}`}

        />
        {/* <MetricCard
          icon={GiPieChart}
          title="Monthly Recurring"
          value={formatCurrency(data.mrr)}
          helperText="Projected monthly income"
        /> */}
        <MetricCard
          icon={GiSparkles}
          title="Tax Collected"
          value={formatCurrency(totalData.totalTaxes)}
          helperText={`From ${formatCurrency(totalData.final)} revenue`}
        />

        <MetricCard
          icon={FiBox}
          title="Discounts Given"
          value={formatCurrency(totalData.totalDiscounts)}
          helperText={`From ${formatCurrency(totalData.final)} revenue`}
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiTrendingUp className="w-5 h-5 text-indigo-600" />
            Revenue Trend
          </h3>
        </div> */}

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt className="w-5 h-5 text-indigo-600" />
            Revenue Distribution (By Billing Type)
          </h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Type</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Sales</th>
              </tr>
            </thead>
            <tbody>
              {billTypeData.map((value, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-3 text-sm text-gray-600">
                    {value.type

                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </td>

                  <td className="py-3 text-sm font-medium">
                    {formatCurrency(value.total)}
                  </td>
                  <td className="py-3 text-sm text-gray-600">{value.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt className="w-5 h-5 text-indigo-600" />
            Revenue Distribution (By Plan Duration)
          </h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Type</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Sales</th>
              </tr>
            </thead>
            <tbody>
              {durationData.map(
                ({ duration = "N/A", total = 0, count = 0 }, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-3 text-sm capitalize text-gray-600">

                      {duration}
                    </td>

                    <td className="py-3 text-sm font-medium">
                      {formatCurrency(total)}
                    </td>
                    <td className="py-3 text-sm text-gray-600">{count}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Top Plans</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Plan</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Sales</th>
              </tr>
            </thead>
            <tbody>
              {topPlansData.map((plan, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-3 text-sm text-gray-600">

                    {plan.planName || "N/A"}
                  </td>
                  <td className="py-3 text-sm font-medium">
                    {formatCurrency(plan.totalRevenue)}
                  </td>
                  <td className="py-3 text-sm text-gray-600">{plan.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Top Add-Ons</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Add-On</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Sales</th>
              </tr>
            </thead>
            <tbody>
              {topAddOnsData.map((addon, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-3 text-sm text-gray-600">

                    {addon.addOnName}
                  </td>
                  <td className="py-3 text-sm font-medium">
                    {formatCurrency(addon.totalRevenue)}
                  </td>
                  <td className="py-3 text-sm text-gray-600">{addon.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Renewal Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Renewal Rate</p>
              <p className="text-2xl font-semibold mt-1">
                {data.renewalMetrics.renewalRate?.toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Renewals</p>
              <p className="text-2xl font-semibold mt-1">
                {data.renewalMetrics.renewalCount}
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default React.memo(RevenueDashboard);
