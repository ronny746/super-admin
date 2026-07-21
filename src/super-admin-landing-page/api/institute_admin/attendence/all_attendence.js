import axios_client from "../../axios_client";
import { getToken } from "../../../context/AppContext";

// get all attendance by institute
export const getAllAttendance = async (instituteId, date) => {
  const token = getToken();
  const res = await axios_client.get(
    `/attendance/institute/${instituteId}`,
    {
      params: date ? { date } : {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data;
};
// get single student attendance
export const getStudentAttendance = async (studentId) => {
  const token = getToken();
  const res = await axios_client.get(
    `/attendance/student/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data;
};

