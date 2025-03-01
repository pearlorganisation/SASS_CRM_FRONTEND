import React, { useEffect, useState } from "react";
import { FaDollarSign, FaChartLine, FaUsers } from "react-icons/fa";
import { GiPieChart, GiStairs } from "react-icons/gi";
import { FiBox, FiTrendingUp } from "react-icons/fi";
import { formatCurrency, formatDate } from "../../utils/LeadType";
import productRevenueService from "../../services/productRevenueService";
import { useNavigate } from "react-router-dom";

const ProductRevenue = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    adoptionRate: 0,
    totalBase: 0,
    totalUpgraded: 0,
  });
  const [revenueByLevel, setRevenueByLevel] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [webinarRevenue, setWebinarRevenue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topUsers, setTopUsers] = useState([]);

  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleDateApply = () => {
    setLoading(true);

    productRevenueService
      .getTotalRevenue({ start: startDate, end: endDate })
      .then((res) => {
        if (res?.success)
          setMetrics((prev) => ({ ...prev, totalRevenue: res.data }));
      });

    productRevenueService
      .getRevenueByLevel({ start: startDate, end: endDate })
      .then((res) => {
        if (res?.success) setRevenueByLevel(res.data);
      });

    productRevenueService
      .getAdoptionRate({ start: startDate, end: endDate })
      .then((res) => {
        if (res?.success) {
          setMetrics((prev) => ({
            ...prev,
            adoptionRate: res.data.adoptionRate,
            totalBase: res.data.totalBaseCustomers,
            totalUpgraded: res.data.totalUpgradedCustomers,
          }));
        }
      });

    productRevenueService
      .getTopProducts({
        start: startDate,
        end: endDate,
        limit: 5,
      })
      .then((res) => {
        if (res?.success) setTopProducts(res.data);
      });

    productRevenueService
      .getTopUsers({
        start: startDate,
        end: endDate,
        limit: 5,
      })
      .then((res) => {
        if (res?.success) setTopUsers(res.data);
      });

    productRevenueService
      .getRevenueByWebinar({ start: startDate, end: endDate })
      .then((res) => {
        if (res?.success) setWebinarRevenue(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleDateApply();
  }, []);

  const MetricCard = ({ icon: Icon, title, value, helperText }) => (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {typeof value === "number"
              ? title.includes("Revenue")
                ? formatCurrency(value)
                : `${value}%`
              : value || "--"}
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
        <h1 className="text-2xl font-bold text-gray-900">
          Product Revenue Analytics
        </h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={FaDollarSign}
          title="Total Revenue"
          value={metrics.totalRevenue}
        />
        <MetricCard
          icon={GiStairs}
          title="Adoption Rate"
          value={metrics.adoptionRate?.toFixed(1)}
          helperText={`${metrics.totalUpgraded} upgraded / ${metrics.totalBase} base`}
        />
        {/* <MetricCard
          icon={FaUsers}
          title="Base Customers"
          value={metrics.totalBase}
        />
        <MetricCard
          icon={FiTrendingUp}
          title="Upgraded Customers"
          value={metrics.totalUpgraded}
        /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <GiPieChart className="w-5 h-5 text-indigo-600" />
            Revenue by Product Level
          </h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Level</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Sales</th>
              </tr>
            </thead>
            <tbody>
              {revenueByLevel.map(
                ({ _id: level, totalRevenue, count }, index) => (
                  <tr
                    onClick={() =>
                      navigate(`/product-enrollments?level=${level}`)
                    }
                    key={index}
                    className="border-b hover:bg-gray-200 cursor-pointer last:border-b-0"
                  >
                    <td className="py-3 text-sm text-gray-600">
                      Level {level}
                    </td>
                    <td className="py-3 text-sm font-medium">
                      {formatCurrency(totalRevenue)}
                    </td>
                    <td className="py-3 text-sm text-gray-600">{count}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaChartLine className="w-5 h-5 text-indigo-600" />
            Webinar Performance
          </h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 ps-2">Webinar</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Enrollments</th>
              </tr>
            </thead>
            <tbody>
              {webinarRevenue.map(
                (
                  { _id: webinar, totalRevenue, totalEnrollments, webinarName },
                  index
                ) => (
                  <tr
                    onClick={() =>
                      navigate(
                        `/webinarDetails/${webinar}?tabValue=enrollments&page=1&subTabValue=attendees`
                      )
                    }
                    key={index}
                    className="border-b hover:bg-gray-200 cursor-pointer last:border-b-0"
                  >
                    <td className="py-3 ps-2 text-sm text-gray-600">
                      {webinarName || "N/A"}
                    </td>
                    <td className="py-3 text-sm font-medium">
                      {formatCurrency(totalRevenue)}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {totalEnrollments}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">
            Top Performing Products
          </h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Product</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Sales</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr
                  onClick={() =>
                    navigate(`/product-enrollments?productId=${product._id}`)
                  }
                  key={index}
                  className="border-b hover:bg-gray-200 cursor-pointer last:border-b-0"
                >
                  <td className="py-3 text-sm text-gray-600">{product.name}</td>
                  <td className="py-3 text-sm font-medium">
                    {formatCurrency(product.totalRevenue)}
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {product.totalSales}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 ps-2">Email</th>
                <th className="pb-3">Total Spent</th>
                <th className="pb-3">Purchases</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, index) => (
                <tr
                  onClick={() =>
                    navigate(`/particularContact?email=${user._id}`)
                  }
                  key={index}
                  className="border-b hover:bg-gray-200 cursor-pointer last:border-b-0"
                >
                  <td className="py-3 ps-2 text-sm text-gray-600">
                    {user._id}
                  </td>
                  <td className="py-3 text-sm font-medium">
                    {formatCurrency(user.totalRevenue)}
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {user.totalPurchases}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductRevenue;
