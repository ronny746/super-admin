import React, { useEffect, useMemo, useState } from "react";
import { getAllAttendance } from "../api/institute_admin/attendence/all_attendence";
import { useAppContext } from "../context/AppContext";
import { RefreshCcw, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AttendanceTable() {
  const { user } = useAppContext();
  const instituteId = user?.instituteId;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // filters
  const [search, setSearch] = useState("");
  const [cls, setCls] = useState("");
  const [section, setSection] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const fetchAttendance = async (queryDate = date) => {
    try {
      setLoading(true);
      const res = await getAllAttendance(instituteId, queryDate);
      setData(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (instituteId) fetchAttendance(date);
  }, [instituteId, date]);

  // Utility to format time string to readable 12-hour AM/PM format
  const formatTime = (timeStr) => {
    if (!timeStr) return "-";

    let hours, minutes;

    if (timeStr.includes("T")) {
      const timePart = timeStr.split("T")[1];
      if (timePart) {
        [hours, minutes] = timePart.substring(0, 5).split(":");
      }
    } else if (timeStr.includes(":")) {
      [hours, minutes] = timeStr.split(":");
    } else {
      return timeStr;
    }

    if (!hours || !minutes) return timeStr;

    const hr = parseInt(hours, 10);
    const ampm = hr >= 12 ? "PM" : "AM";
    const formattedHr = hr % 12 || 12;

    return `${formattedHr}:${minutes} ${ampm}`;
  };

  // 🔹 Case-insensitive filter logic
  const filtered = useMemo(() => {
    return data.filter((row) => {
      const s = row.student || {};
      const name = s.name?.toLowerCase() || "";
      const roll = s.rollNo?.toLowerCase() || "";
      const className = s.className?.toLowerCase() || "";
      const sec = s.section?.toLowerCase() || "";
      const stat = row.status?.toLowerCase() || "";

      return (
        (!search ||
          name.includes(search.toLowerCase()) ||
          roll.includes(search.toLowerCase())) &&
        (!cls || className === cls.toLowerCase()) &&
        (!section || sec === section.toLowerCase()) &&
        (!status || stat === status.toLowerCase()) &&
        (!date || row.date === date)
      );
    });
  }, [data, search, cls, section, status, date]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, cls, section, status, date]);

  // Compute current page data
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return <div className="p-6 bg-white rounded-xl">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Attendance Records</h2>

        <div className="flex gap-2">
          {/* Today button */}
          <button
            onClick={() => setDate(prev => (prev === today ? "" : today))}
            className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition
    ${date === today
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }
  `}
          >
            Today
          </button>


          {/* Refresh button */}
          <button
            onClick={fetchAttendance}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg
                       bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-6 gap-3 mb-5">
        <input
          placeholder="Search name / roll"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
        />

        <input
          placeholder="Class"
          value={cls}
          onChange={(e) => setCls(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />

        <input
          placeholder="Section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
          <option value="NOT MARKED">Not Marked</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />

        <button
          onClick={() => {
            setSearch("");
            setCls("");
            setSection("");
            setStatus("");
            setDate("");
          }}
          className="bg-gray-100 rounded-lg px-3 py-2 text-sm hover:bg-gray-200"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-600">
              <th className="text-left px-3">Name</th>
              <th>Roll</th>
              <th>Class</th>
              <th>Section</th>
              <th>Date</th>
              <th>First Check In</th>
              <th>Last Check Out</th>
              <th>Status</th>
              <th>Action</th>

            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row) => {
              const s = row.student || {};
              return (
                <tr
                  key={row._id}
                  className="bg-white shadow-sm rounded-lg
                             hover:shadow-md hover:scale-[1.01]
                             transition-all duration-200 text-center"
                >
                  <td className="px-3 py-3 text-left font-medium">
                    {s.name || "-"}
                  </td>
                  <td>{s.rollNo || "-"}</td>
                  <td>{s.className || "-"}</td>
                  <td>{s.section || "-"}</td>
                  <td>{row.date}</td>
                  <td>{formatTime(row.firstInTime)}</td>
                  <td>{formatTime(row.lastOutTime)}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${row.status === "PRESENT"
                          ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
                          : row.status === "NOT MARKED"
                            ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300"
                            : "bg-rose-100 text-rose-700 ring-1 ring-rose-300"
                        }
                      `}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/attendance/student/${s._id}`)}
                      className="px-3 py-1 text-xs rounded-lg
               bg-indigo-50 text-indigo-700
               hover:bg-indigo-100 transition"
                    >
                      View
                    </button>
                  </td>

                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <span className="text-sm text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-700">{paginatedData.length}</span> out of <span className="font-bold text-gray-700">{filtered.length}</span>
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              Previous
            </button>
            
            <div className="flex items-center justify-center min-w-[3rem] text-sm font-bold text-gray-700">
              {currentPage} / {totalPages}
            </div>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
