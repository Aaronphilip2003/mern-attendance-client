import "./App.css";
import ScheduleDropdown from "./components/ScheduleDropdown";
import AttendanceList from "./components/AttendanceList";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";

function App() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    // Fetch data from the endpoint
    fetch("https://mern-attendance-server.vercel.app/getattendance")
      .then((response) => response.json())
      .then((data) => setAttendanceData(data))
      .catch((error) =>
        console.error("Error fetching attendance data:", error)
      );

    // Set the current day
    setCurrentDay(format(new Date(), "EEEE, do MMMM"));
  }, []);

  return (
    <div className="App">
      <h2 className="font-bold text-4xl m-8">Attendance for {currentDay}</h2>
      <ScheduleDropdown />
      <AttendanceList attendanceData={attendanceData} />
    </div>
  );
}

export default App;
