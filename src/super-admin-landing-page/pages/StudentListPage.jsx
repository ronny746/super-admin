// // src/pages/StudentListPage.jsx
// import React, { useState, useMemo } from "react";
// import AdminLayout from "../layouts/AdminLayout";
// import { Search, ArrowUpDown, FileSpreadsheet } from "lucide-react";
// import * as XLSX from "xlsx";

// export default function StudentListPage() {
//   // Dummy data
//   const students = Array.from({ length: 90 }).map((_, i) => {
//     const cls = 9 + (i % 4);
//     const section = ["A", "B", "C", "D"][i % 4];
//     const present = Math.random() > 0.2;
//     return {
//       id: i + 1,
//       name: `Student ${i + 1}`,
//       roll: `${100 + i}`,
//       class: cls,
//       section,
//       email: `student${i + 1}@school.com`,
//       phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
//       present,
//     };
//   });

//   // Filters
//   const [query, setQuery] = useState("");
//   const [classFilter, setClassFilter] = useState("All");
//   const [sectionFilter, setSectionFilter] = useState("All");
//   const [attendanceFilter, setAttendanceFilter] = useState("All");

//   // Sorting
//   const [sortBy, setSortBy] = useState(null);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const perPage = 15;

//   const classes = ["All", ...new Set(students.map((s) => s.class))];
//   const sections = ["All", ...new Set(students.map((s) => s.section))];

//   const filtered = useMemo(() => {
//     let list = [...students];

//     // Filters
//     if (classFilter !== "All") list = list.filter((s) => `${s.class}` === `${classFilter}`);
//     if (sectionFilter !== "All") list = list.filter((s) => s.section === sectionFilter);
//     if (attendanceFilter !== "All")
//       list = list.filter((s) => (attendanceFilter === "Present" ? s.present : !s.present));

//     if (query) {
//       const q = query.toLowerCase();
//       list = list.filter(
//         (s) =>
//           s.name.toLowerCase().includes(q) ||
//           s.roll.includes(q) ||
//           s.email.toLowerCase().includes(q)
//       );
//     }

//     // Sorting
//     if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
//     if (sortBy === "roll") list.sort((a, b) => a.roll - b.roll);
//     if (sortBy === "class") list.sort((a, b) => a.class - b.class);

//     return list;
//   }, [students, query, classFilter, sectionFilter, attendanceFilter, sortBy]);

//   // Paginated data
//   const paginated = filtered.slice((page - 1) * perPage, page * perPage);

//   // Export to Excel
//   const exportExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(filtered);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Students");
//     XLSX.writeFile(wb, "students_filtered.xlsx");
//   };

//   return (
//     <AdminLayout>
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Students List</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-6 items-center">
//         <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full md:w-64">
//           <Search size={16} className="text-gray-500 mr-2" />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search name, roll, email..."
//             className="bg-transparent outline-none w-full text-sm"
//           />
//         </div>

//         <select className="border rounded-lg px-3 py-2" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
//           {classes.map((cls) => <option key={cls}>{cls}</option>)}
//         </select>

//         <select className="border rounded-lg px-3 py-2" value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}>
//           {sections.map((sec) => <option key={sec}>{sec}</option>)}
//         </select>

//         <select className="border rounded-lg px-3 py-2" value={attendanceFilter} onChange={(e) => setAttendanceFilter(e.target.value)}>
//           <option>All</option>
//           <option>Present</option>
//           <option>Absent</option>
//         </select>

//         <button
//           onClick={exportExcel}
//           className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//         >
//           <FileSpreadsheet size={18} /> Export
//         </button>
//       </div>

//       {/* Table */}
//       <div className="border rounded-xl overflow-hidden shadow-lg bg-white">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100 border-b">
//             <tr>
//               <th className="p-3 text-left cursor-pointer" onClick={() => setSortBy("roll")}>
//                 Roll <ArrowUpDown size={14} className="inline" />
//               </th>
//               <th className="p-3 text-left cursor-pointer" onClick={() => setSortBy("name")}>
//                 Name <ArrowUpDown size={14} className="inline" />
//               </th>
//               <th className="p-3 text-left cursor-pointer" onClick={() => setSortBy("class")}>
//                 Class <ArrowUpDown size={14} className="inline" />
//               </th>
//               <th className="p-3 text-left">Section</th>
//               <th className="p-3 text-left">Email</th>
//               <th className="p-3 text-left">Phone</th>
//               <th className="p-3 text-left">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginated.map((st) => (
//               <tr
//                 key={st.id}
//                 className="border-b hover:bg-blue-50 transition cursor-pointer"
//                 onClick={() => window.location.href = `/admin/student/${st.id}`}
//               >
//                 <td className="p-3">{st.roll}</td>
//                 <td className="p-3">{st.name}</td>
//                 <td className="p-3">{st.class}</td>
//                 <td className="p-3">{st.section}</td>
//                 <td className="p-3">{st.email}</td>
//                 <td className="p-3">{st.phone}</td>
//                 <td className="p-3">
//                   {st.present ? (
//                     <span className="text-green-600 font-semibold">Present</span>
//                   ) : (
//                     <span className="text-red-600 font-semibold">Absent</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filtered.length === 0 && (
//           <div className="p-6 text-center text-gray-500">No students found</div>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 rounded-lg">
//           Prev
//         </button>

//         <div className="text-sm text-gray-600">
//           Page {page} of {Math.ceil(filtered.length / perPage)}
//         </div>

//         <button disabled={page >= filtered.length / perPage} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-200 rounded-lg">
//           Next
//         </button>
//       </div>
//     </AdminLayout>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  Search,
  ArrowUpDown,
  FileSpreadsheet,
  Pencil,
  Trash2,
  X,
  Download,
  Plus,
} from "lucide-react";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStudents,
  updateStudent,
  deleteStudent,
  addStudent,
} from "../api/institute_admin/students_api";

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Sorting
  const [sortBy, setSortBy] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 12;

  // Edit / Delete
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Add
  const [addModal, setAddModal] = useState(false);
  const [addData, setAddData] = useState({});
  const [adding, setAdding] = useState(false);


  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents();
      setStudents(res.data || []);
    } catch {
      setStudents([]);
    }
    setLoading(false);
  };

  // Dropdown values
  const classes = useMemo(
    () => ["All", ...new Set(students.map((s) => s.className))],
    [students]
  );

  const sections = useMemo(
    () => ["All", ...new Set(students.map((s) => s.section))],
    [students]
  );

  // Filter + Search + Sort
  const filtered = useMemo(() => {
    let list = [...students];

    if (classFilter !== "All")
      list = list.filter((s) => s.className === classFilter);

    if (sectionFilter !== "All")
      list = list.filter((s) => s.section === sectionFilter);

    if (statusFilter !== "All")
      list = list.filter((s) =>
        statusFilter === "Active" ? s.isActive : !s.isActive
      );

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNo.includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "roll") list.sort((a, b) => a.rollNo - b.rollNo);
    if (sortBy === "class")
      list.sort((a, b) => a.className.localeCompare(b.className));

    return list;
  }, [students, query, classFilter, sectionFilter, statusFilter, sortBy]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Export
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students_filtered.xlsx");
  };

  // Edit
  const handleEdit = (st) => {
    setEditData({ ...st });
    setEditModal(true);
  };

  const handleEditSave = async () => {
    setSaving(true);
    await updateStudent(editData._id, {
      rollNo: editData.rollNo,
      name: editData.name,
      className: editData.className,
      section: editData.section,
      email: editData.email,
      studentPhone: editData.studentPhone,
      parentPhone: editData.parentPhone,
      rfidCardId: editData.rfidCardId,
      isActive: editData.isActive,
    });
    setSaving(false);
    setEditModal(false);
    fetchStudents();
  };

  const handleDelete = async () => {
    setDeleting(true);
    await deleteStudent(deleteDialog._id);
    setDeleting(false);
    setDeleteDialog(null);
    fetchStudents();
  };

  const handleAddSave = async () => {
    if (!addData.rollNo || !addData.name || !addData.parentPhone) {
      alert("Roll No, Name, and Parent Phone are required.");
      return;
    }
    setAdding(true);
    try {
      await addStudent({
        rollNo: addData.rollNo,
        name: addData.name,
        className: addData.className || "",
        section: addData.section || "",
        email: addData.email || "",
        studentPhone: addData.studentPhone || "",
        parentPhone: addData.parentPhone,
        rfidCardId: addData.rfidCardId || undefined,
        isActive: true,
      });
      setAddModal(false);
      setAddData({});
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add student. Could be a duplicate.");
    }
    setAdding(false);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Students List</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded w-64">
          <Search size={16} />
          <input
            className="bg-transparent ml-2 w-full outline-none"
            placeholder="Search name, roll, email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {classes.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {sections.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded flex gap-2 items-center"
        >
          <FileSpreadsheet size={18} /> Export
        </button>

        <button
          onClick={() => setAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2 items-center font-bold ml-auto"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th onClick={() => setSortBy("roll")} className="p-4 text-left cursor-pointer font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                Roll <ArrowUpDown size={12} className="inline ml-1" />
              </th>
              <th onClick={() => setSortBy("name")} className="p-4 text-left cursor-pointer font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                Name <ArrowUpDown size={12} className="inline ml-1" />
              </th>
              <th onClick={() => setSortBy("class")} className="p-4 text-left cursor-pointer font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                Class/Sec <ArrowUpDown size={12} className="inline ml-1" />
              </th>
              <th className="p-4 text-left font-bold text-gray-600 uppercase text-[10px] tracking-wider">Contact</th>
              <th className="p-4 font-bold text-gray-600 uppercase text-[10px] tracking-wider text-center">RFID / QR ID</th>
              <th className="p-4 font-bold text-gray-600 uppercase text-[10px] tracking-wider text-center">Status</th>
              <th className="p-4 font-bold text-gray-600 uppercase text-[10px] tracking-wider text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {paginated.map((st) => (
              <tr key={st._id} className="group hover:bg-blue-50/50 transition-colors">
                <td className="p-4 font-mono text-blue-600 font-bold">{st.rollNo}</td>
                <td className="p-4">
                  <p className="font-bold text-gray-900">{st.name}</p>
                </td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[11px] font-bold">
                    {st.className} - {st.section}
                  </span>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <p className="text-gray-900 text-[11px] font-bold flex items-center gap-1">
                      <span className="text-[8px] bg-indigo-50 text-indigo-600 px-1 rounded">P:</span> {st.parentPhone}
                    </p>
                    {st.studentPhone && (
                      <p className="text-gray-500 text-[10px] flex items-center gap-1">
                        <span className="text-[8px] bg-gray-50 text-gray-400 px-1 rounded">S:</span> {st.studentPhone}
                      </p>
                    )}
                    <p className="text-gray-400 text-[9px] italic">{st.email}</p>
                  </div>
                </td>
                <td className="p-4">
                   <div className="flex flex-col items-center gap-1 text-center">
                      {st.rfidCardId && (
                        <span className="text-[9px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase">RFID: {st.rfidCardId}</span>
                      )}
                      {st.qrCode ? (
                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-tighter">QR: {st.qrCode}</span>
                      ) : (
                        <span className="text-[9px] font-bold text-gray-300 italic uppercase">No ID Linked</span>
                      )}
                   </div>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    st.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}>
                    {st.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(st)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                      title="Edit Student"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteDialog(st)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                      title="Delete Student"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No students found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Prev
        </button>
        <div className="text-sm">
          Page {page} of {Math.ceil(filtered.length / perPage)}
        </div>
        <button
          disabled={page >= filtered.length / perPage}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      {/* Modals & Dialogs */}
      <AnimatePresence>
        {/* Edit Modal */}
        {editModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-2xl"
            >
              <button
                onClick={() => setEditModal(false)}
                className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold mb-4">Edit Student</h2>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto px-1">
                {[
                  { key: "rollNo", label: "Roll Number" },
                  { key: "name", label: "Full Name" },
                  { key: "className", label: "Class" },
                  { key: "section", label: "Section" },
                  { key: "email", label: "Email Address" },
                  { key: "parentPhone", label: "Parent Phone (SMS)" },
                  { key: "studentPhone", label: "Student Phone" },
                  { key: "rfidCardId", label: "RFID Card ID" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{f.label}</label>
                    <input
                      value={editData[f.key] || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, [f.key]: e.target.value })
                      }
                      placeholder={f.label}
                      className="border rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                ))}
                
                <div className="flex items-center gap-2 mt-4 p-2 bg-gray-50 rounded-lg">
                   <input 
                    type="checkbox" 
                    checked={editData.isActive} 
                    onChange={(e) => setEditData({...editData, isActive: e.target.checked})}
                    id="isActive"
                   />
                   <label htmlFor="isActive" className="text-sm font-bold text-gray-700">Active Account</label>
                </div>
              </div>

              <button
                onClick={handleEditSave}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6 font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Dialog */}
        {deleteDialog && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Student?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-bold text-gray-800">{deleteDialog.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteDialog(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Modal */}
        {addModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-2xl"
            >
              <button
                onClick={() => setAddModal(false)}
                className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold mb-4">Add New Student</h2>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto px-1 pb-4">
                {[
                  { key: "rollNo", label: "Roll Number *" },
                  { key: "name", label: "Full Name *" },
                  { key: "className", label: "Class" },
                  { key: "section", label: "Section" },
                  { key: "email", label: "Email Address" },
                  { key: "parentPhone", label: "Parent Phone (SMS) *" },
                  { key: "studentPhone", label: "Student Phone" },
                  { key: "rfidCardId", label: "RFID Card ID" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{f.label}</label>
                    <input
                      value={addData[f.key] || ""}
                      onChange={(e) =>
                        setAddData({ ...addData, [f.key]: e.target.value })
                      }
                      placeholder={f.label.replace(' *', '')}
                      className="border rounded-lg px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddSave}
                disabled={adding}
                className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4 font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add Student"}
              </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}
