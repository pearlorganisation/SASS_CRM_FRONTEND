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
                  className="p-4 bg-white cursor-pointer shadow-md rounded-md border border-gray-200"
                >
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
      </div>
    </div>
  );
};

export default CalendarPage;
