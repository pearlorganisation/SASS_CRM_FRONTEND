import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarPage.css"; // Import your custom CSS file
import { useDispatch, useSelector } from "react-redux";
import { getUserAlarms } from "../../features/actions/alarm";
import { useNavigate } from "react-router-dom";
import { formatDateAsNumberWithTime } from "../../utils/extra";

const CalendarPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, onChange] = useState(new Date());

  const { employeeModeData } = useSelector((state) => state.employee);
  const { userAlarms } = useSelector((state) => state.alarm);
  const { userData } = useSelector((state) => state.auth);
  const [dateMapping, setDateMapping] = useState(new Map());
  const [selectedDateAlarms, setSelectedDateAlarms] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');

  useEffect(() => {
    if (Array.isArray(userAlarms)) {
      const newDateMapping = new Map();
      userAlarms.forEach((element) => {
        const dateObj = new Date(element.date);
        if (dateObj) {
          const dateKey = dateObj.toDateString();
          if (!newDateMapping.has(dateKey)) {
            newDateMapping.set(dateKey, []);
          }
          newDateMapping.get(dateKey).push(element);
        }
      });
      setDateMapping(newDateMapping);
    }
  }, [userAlarms]);

  useEffect(() => {
    const date = new Date();
    if(userData?._id)
    dispatch(
      getUserAlarms({
        id: employeeModeData ? employeeModeData?._id : userData?._id,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      })
    );
  }, [userData]);

  const handleMonthChange = ({ activeStartDate }) => {
    const newMonth = activeStartDate.getMonth() + 1;
    const newYear = activeStartDate.getFullYear();

    dispatch(
      getUserAlarms({
        id: userData?._id,
        month: newMonth,
        year: newYear,
      })
    );
  };

  useEffect(() => {
    const selectedDateKey = value.toDateString();
    setSelectedDateAlarms(dateMapping.get(selectedDateKey) || []);
  }, [value, dateMapping]);

  const handleAlarmClick = (alarm) => {
    if (alarm.email && alarm.attendeeId)
      navigate(
        `/particularContact?email=${alarm.email}&attendeeId=${alarm.attendeeId}`
      );
  };

  const activeAlarms = userAlarms?.filter(alarm => alarm.isActive) || [];
  const inactiveAlarms = userAlarms?.filter(alarm => !alarm.isActive) || [];
  const visibleAlarms = selectedTab === 'active' ? activeAlarms : inactiveAlarms;

  return (
    <div className="py-14 px-6 flex flex-col items-center">
      <div className="p-6 bg-gray-50 rounded-lg">
        {/* <div className="w-full mb-7">
          <h2 className="text-2xl font-bold text-gray-700">Alarm Calendar</h2>
        </div> */}
        <Calendar
          onChange={onChange}
          value={value}
          className="custom-calendar"
          onActiveStartDateChange={handleMonthChange}
          tileClassName={({ date }) => {
            const dateKey = date.toDateString();
            return dateMapping.has(dateKey)
              ? "has-alarm all-cell"
              : "no-alarm all-cell";
          }}
        />

        <div className="mt-6 w-full">
          <h3 className="text-xl font-semibold text-gray-700">
            Alarms for {value.toDateString()}
          </h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {selectedDateAlarms.length === 0 ? (
              <p className="text-gray-600">No alarms for this date.</p>
            ) : (
              selectedDateAlarms.map((alarm) => (
                <div
                  key={alarm._id}
                  onClick={() => handleAlarmClick(alarm)}
                  className={`p-4 bg-white cursor-pointer shadow-md rounded-md border-l-4 ${
                    alarm.isActive 
                      ? 'border-green-500 hover:border-green-600' 
                      : 'border-red-500 hover:border-red-600'
                  } border border-gray-200`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      alarm.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className={`text-xs font-medium ${
                      alarm.isActive ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {alarm.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    <strong>Date:</strong>{" "}
                    {formatDateAsNumberWithTime(alarm.date)}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Email:</strong> {alarm.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Note:</strong> {alarm.note || "No note provided"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add new section for all alarms table */}
        <div className="mt-8 w-full">
          <div className="flex gap-4 mb-4 border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('active')}
              className={`pb-2 px-1 ${
                selectedTab === 'active'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Alarms
            </button>
            <button
              onClick={() => setSelectedTab('inactive')}
              className={`pb-2 px-1 ${
                selectedTab === 'inactive'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inactive Alarms
            </button>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-4">All Alarms</h3>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {visibleAlarms?.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visibleAlarms.map(alarm => (
                    <tr 
                      key={alarm._id} 
                      onClick={() => handleAlarmClick(alarm)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${alarm.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-sm">{alarm.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateAsNumberWithTime(alarm.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alarm.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {alarm.note || "No note provided"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-gray-600">No {selectedTab} alarms found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
