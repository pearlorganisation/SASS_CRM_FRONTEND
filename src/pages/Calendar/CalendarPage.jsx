import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarPage.css"; // Import your custom CSS file
import { useDispatch, useSelector } from "react-redux";
import { getUserAlarms } from "../../features/actions/alarm";

const CalendarPage = () => {
  const dispatch = useDispatch();
  const [value, onChange] = useState(new Date());

  const { userAlarms } = useSelector((state) => state.alarm);
  const { userData } = useSelector((state) => state.auth);
  const [dateMapping, setDateMapping] = useState(new Map());

  console.log("userArlams", userAlarms);

  useEffect(() => {

    if(Array.isArray(userAlarms))
    userAlarms.forEach((element) => {
      const dateObj = new Date(element.date);
      if(dateObj){
        const date = dateObj.getDate();
        console.log(date)
      }
      
    });
  }, [userAlarms]);

  useEffect(() => {
    dispatch(
      getUserAlarms({
        id: userData?._id,
      })
    );
  }, []);

  return (
    <div className="py-14 px-6 flex flex-col items-center">
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="w-full mb-7">
          <h2 className="text-2xl font-bold text-gray-700">Alarm Calendar</h2>
        </div>
        <Calendar
          onChange={onChange}
          value={value}
          className="custom-calendar"
          tileClassName={({ date }) => {
            // console.log("date", date, date.getDate());
            return date.getDay() === 0 ? "weekend all-cell" : "alarm all-cell";
          }}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
