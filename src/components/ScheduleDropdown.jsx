import React, { useState, useEffect } from "react";
import axios from "axios";

const ScheduleDropdown = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://mern-attendance-server.vercel.app/subjects"
        );
        setScheduleData(response.data);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDayChange = (event) => {
    const selectedDayName = event.target.value;
    const selectedDayObject = scheduleData.find(
      (day) => day.day_name === selectedDayName
    );

    setSelectedDay(selectedDayName);
    setSelectedSubjects(selectedDayObject ? selectedDayObject.subjects : []);
    setAttendanceStatus({});
  };

  const handleAttendance = async (subject, status) => {
    try {
      let endpoint;
      if (status === "yes") {
        endpoint = `https://mern-attendance-server.vercel.app/update-attendance-yes/${subject}`;
      } else if (status === "no") {
        endpoint = `https://mern-attendance-server.vercel.app/update-attendance-no/${subject}`;
      }

      const response = await axios.post(endpoint, {
        subject_name: subject,
      });

      console.log(response.data);

      setAttendanceStatus((prevStatus) => ({
        ...prevStatus,
        [subject]: prevStatus[subject] === status ? "" : status,
      }));
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const handleSubmitAttendance = () => {
    console.log("Attendance Status:", attendanceStatus);
    setAttendanceStatus({});
  };

  return (
    <div className="mx-auto mt-10 p-6 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg shadow-md">
      <select
        id="dayDropdown"
        onChange={handleDayChange}
        value={selectedDay}
        className="w-full py-1 text-sm text-center border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled>
          Select a day
        </option>
        {scheduleData.map((day) => (
          <option key={day._id} value={day.day_name}>
            {day.day_name}
          </option>
        ))}
      </select>

      {selectedDay && (
        <div className="mt-4">
          <h2 className="text-lg font-medium text-gray-900">
            Subjects for {selectedDay}:
          </h2>
          <ul className="mt-2">
            {selectedSubjects.map((subject) => (
              <li key={subject}>
                {subject}
                <button
                  onClick={() => handleAttendance(subject, "yes")}
                  style={{
                    backgroundColor:
                      attendanceStatus[subject] === "yes" ? "green" : "white",
                  }}
                  className="ml-2 p-2 rounded"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAttendance(subject, "no")}
                  style={{
                    backgroundColor:
                      attendanceStatus[subject] === "no" ? "red" : "white",
                  }}
                  className="ml-2 p-2 rounded"
                >
                  No
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmitAttendance}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit Attendance
      </button>
    </div>
  );
};

export default ScheduleDropdown;
