import { Plus, Search, Filter, BookOpen, Clock, AlertCircle, CheckCircle, Trash2, Edit2, UserPlus, FileSpreadsheet, Send, X, Upload, Download } from "lucide-react";
import * as XLSX from 'xlsx';
import toast from "react-hot-toast";
import {
    createTestStudent,
    getTestStudents,
    deleteTestStudent,
    assignTestToStudent,
    getTests,
    bulkUploadStudents,
} from "../api/testSystemApi";
import React from "react";

import { useAppContext } from "../context/AppContext";
import { useState } from "react";
import { useEffect } from "react";

export default function TestStudentPage() {
    const [students, setStudents] = useState([]);
    const [tests, setTests] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadErrors, setUploadErrors] = useState([]);

    const { user } = useAppContext();
    const instituteId = user?.instituteId || user?._id;

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rollNumber: "", // New
        mobileNumber: "", // New
        testId: "",
        className: "",
        paperSet: "A",
    });

    const [assignData, setAssignData] = useState({
        testId: "",
        className: "",
        paperSet: "A",
    });

    useEffect(() => {
        if (instituteId) {
            fetchStudents();
            fetchTests();
        }
    }, [instituteId]);

    const fetchStudents = async () => {
        if (!instituteId) return;
        try {
            console.log("Fetching students for institute:", instituteId);
            const response = await getTestStudents(instituteId);
            setStudents(response.data);
        } catch (error) {
            console.error("Fetch students error:", error);
            // alert("Error fetching students: " + error.message); // Suppress alert loop
        }
    };

    const fetchTests = async () => {
        if (!instituteId) return;
        try {
            const response = await getTests(instituteId);
            setTests(response.data);
        } catch (error) {
            console.error("Error fetching tests:", error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createTestStudent({
                ...formData,
                instituteId,
            });
            setStudents([...students, response.data]);
            setShowCreateModal(false);
            setFormData({
                name: "",
                email: "",
                rollNumber: "",
                mobileNumber: "",
                testId: "",
                className: "",
                paperSet: "A"
            });
            toast.success("Student created successfully!");
        } catch (error) {
            toast.error("Error creating student: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Assuming axiosClient is available or imported elsewhere
            // and editingId is defined in the component state
            // const response = await axiosClient.put(`/test-system/students/${editingId}`, formData);
            // setStudents(students.map(s => s._id === editingId ? response.data : s));
            // setIsModalOpen(false); // Assuming this refers to setShowCreateModal(false)
            // resetFormData(); // Assuming this refers to resetting formData
            toast.success("Student updated successfully!");
        } catch (error) {
            toast.error("Error updating student: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteTargetId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;

        try {
            await deleteTestStudent(deleteTargetId);
            setStudents(students.filter(s => s._id !== deleteTargetId));
            toast.success("Student deleted successfully!");
        } catch (error) {
            toast.error("Error deleting student: " + error.message);
        } finally {
            setShowDeleteModal(false);
            setDeleteTargetId(null);
        }
    };

    const handleSendCredentials = async (studentId) => {
        setLoading(true);
        try {
            // Assuming axiosClient is available or imported elsewhere
            // await axiosClient.post(`/test-system/students/${studentId}/send-credentials`);
            toast.success("Credentials sent successfully!");
        } catch (error) {
            toast.error("Error sending credentials: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await assignTestToStudent(selectedStudent._id, assignData);
            setShowAssignModal(false);
            setSelectedStudent(null);
            setAssignData({ testId: "", className: "", paperSet: "A" });
            fetchStudents();
            toast.success("Test assigned successfully!");
        } catch (error) {
            toast.error("Error assigning test: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkUpload = async () => {
        if (!uploadFile) {
            toast.error('Please select a file');
            return;
        }

        setLoading(true);
        setUploadErrors([]);

        try {
            const response = await bulkUploadStudents(instituteId, uploadFile);

            toast.success(
                `✅ ${response.data.created} students created successfully!`,
                { duration: 4000 }
            );

            if (response.data.failed > 0) {
                setUploadErrors(response.data.failedStudents);
                toast.error(`⚠️ ${response.data.failed} students failed to create`);
            }

            setShowUploadModal(false);
            setUploadFile(null);
            fetchStudents();
        } catch (error) {
            console.error('Bulk upload error:', error);
            if (error.response?.data?.errors) {
                setUploadErrors(error.response.data.errors);
                toast.error('Validation errors found in file');
            } else {
                toast.error(error.response?.data?.message || 'Failed to upload file');
            }
        } finally {
            setLoading(false);
        }
    };

    const downloadSampleCSV = () => {
        const csvContent = [
            ['name', 'email', 'rollNumber', 'mobileNumber', 'className', 'testTitle', 'paperSet'],
            ['Rahul Kumar', 'rahul@example.com', '101', '9876543210', '12th', 'Physics Mock Test', 'A'],
            ['Priya Singh', 'priya@example.com', '102', '9876543211', '12th', 'Physics Mock Test', 'B'],
            ['Amit Sharma', 'amit@example.com', '103', '9876543212', '12th', '', 'A']
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_upload_sample.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Sample CSV downloaded!');
    };

    const downloadSampleExcel = () => {
        const data = [
            ['name', 'email', 'rollNumber', 'mobileNumber', 'className', 'testTitle', 'paperSet'],
            ['Rahul Kumar', 'rahul@example.com', '101', '9876543210', '12th', 'Physics Mock Test', 'A'],
            ['Priya Singh', 'priya@example.com', '102', '9876543211', '12th', 'Physics Mock Test', 'B'],
            ['Amit Sharma', 'amit@example.com', '103', '9876543212', '12th', '', 'A']
        ];

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students');
        XLSX.writeFile(wb, 'student_upload_sample.xlsx');
        toast.success('Sample Excel downloaded!');
    };

    // Auto-fill form data when test selected
    useEffect(() => {
        if (formData.testId) {
            const selectedTest = tests.find(t => t._id === formData.testId);
            if (selectedTest) {
                setFormData(prev => ({
                    ...prev,
                    paperSet: selectedTest.targetPaperSet,
                    className: selectedTest.targetClass || prev.className // Also auto-fill class
                }));
            }
        }
    }, [formData.testId, tests]);

    // Auto-fill assign data when test selected
    useEffect(() => {
        if (assignData.testId) {
            const selectedTest = tests.find(t => t._id === assignData.testId);
            if (selectedTest) {
                setAssignData(prev => ({
                    ...prev,
                    paperSet: selectedTest.targetPaperSet,
                    className: selectedTest.targetClass || prev.className
                }));
            }
        }
    }, [assignData.testId, tests]);

    return (
        <div className="p-6">
            {/* ... header ... */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Test Students</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-md"
                    >
                        <Upload size={20} />
                        Upload Students
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
                    >
                        <Plus size={20} />
                        Create Student
                    </button>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll No</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email/User ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Test</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class/Set</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No students found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {student.rollNumber || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="text-gray-900">{student.email}</div>
                                            <div className="text-gray-500 text-xs font-mono">{student.userId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {student.mobileNumber || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            {student.assignedTest ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {student.assignedTest.title}
                                                </span>
                                            ) : "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {student.assignedClass && student.assignedPaperSet ? (
                                                <span>{student.assignedClass} / Set {student.assignedPaperSet}</span>
                                            ) : "-"}
                                        </td>
                                        {/* ... Actions ... */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setAssignData({
                                                            testId: student.assignedTest?._id || "",
                                                            className: student.assignedClass || "",
                                                            paperSet: student.assignedPaperSet || "A",
                                                        });
                                                        setShowAssignModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 transition"
                                                    title="Edit Assignment"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student._id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">Add New Student</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Personal Info</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Roll Number</label>
                                            <input
                                                type="text"
                                                value={formData.rollNumber}
                                                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                placeholder="Opt"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile No</label>
                                            <input
                                                type="tel"
                                                value={formData.mobileNumber}
                                                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                placeholder="Opt"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Exam Assignment</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign Test</label>
                                        <select
                                            value={formData.testId}
                                            onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        >
                                            <option value="">Select a test (Optional)</option>
                                            {tests.map((test) => (
                                                <option key={test._id} value={test._id}>
                                                    {test.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Class</label>
                                            <input
                                                type="text"
                                                value={formData.className}
                                                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                placeholder="e.g. 10th"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Paper Set</label>
                                            <select
                                                value={formData.paperSet}
                                                onChange={(e) => setFormData({ ...formData, paperSet: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            >
                                                <option value="A">Set A</option>
                                                <option value="B">Set B</option>
                                                <option value="C">Set C</option>
                                                <option value="D">Set D</option>
                                                {/* Allow dynamic set if logic requires it */}
                                                {formData.paperSet && !['A', 'B', 'C', 'D'].includes(formData.paperSet) && (
                                                    <option value={formData.paperSet}>{formData.paperSet.startsWith('GEN') ? 'Auto Generated' : formData.paperSet}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3 justify-end pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Student"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Modal - Kept for editing assignments via table action */}
            {showAssignModal && selectedStudent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Edit Assignment</h2>
                            <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAssign} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Test</label>
                                <select
                                    required
                                    value={assignData.testId}
                                    onChange={(e) => setAssignData({ ...assignData, testId: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                                >
                                    <option value="">Select test</option>
                                    {tests.map((test) => (
                                        <option key={test._id} value={test._id}>
                                            {test.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Class</label>
                                <input
                                    type="text"
                                    required
                                    value={assignData.className}
                                    onChange={(e) => setAssignData({ ...assignData, className: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Paper Set</label>
                                <select
                                    required
                                    value={assignData.paperSet}
                                    onChange={(e) => setAssignData({ ...assignData, paperSet: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                                >
                                    <option value="A">Set A</option>
                                    <option value="B">Set B</option>
                                    <option value="C">Set C</option>
                                    <option value="D">Set D</option>
                                    {/* Allow dynamic set matches */}
                                    {assignData.paperSet && !['A', 'B', 'C', 'D'].includes(assignData.paperSet) && (
                                        <option value={assignData.paperSet}>{assignData.paperSet.startsWith('GEN') ? 'Auto Generated' : assignData.paperSet}</option>
                                    )}
                                </select>
                            </div>
                            <div className="mt-6 flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl transform transition-all">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Upload className="text-green-600" size={28} />
                                Bulk Upload Students
                            </h2>
                            <button
                                onClick={() => { setShowUploadModal(false); setUploadFile(null); setUploadErrors([]); }}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Sample File Downloads */}
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                    <Download size={20} />
                                    Download Sample Files
                                </h3>
                                <div className="flex gap-3">
                                    <button
                                        onClick={downloadSampleCSV}
                                        className="flex-1 px-4 py-2.5 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 font-medium text-blue-700 transition flex items-center justify-center gap-2"
                                    >
                                        <FileSpreadsheet size={18} />
                                        CSV Sample
                                    </button>
                                    <button
                                        onClick={downloadSampleExcel}
                                        className="flex-1 px-4 py-2.5 bg-white border-2 border-green-300 rounded-lg hover:bg-green-50 font-medium text-green-700 transition flex items-center justify-center gap-2"
                                    >
                                        <FileSpreadsheet size={18} />
                                        Excel Sample
                                    </button>
                                </div>
                                <p className="text-xs text-blue-700 mt-3">
                                    💡 Download a sample file, fill in your student data, then upload it below
                                </p>
                            </div>

                            {/* File Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select File (CSV or Excel)
                                </label>
                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={(e) => setUploadFile(e.target.files[0])}
                                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                                {uploadFile && (
                                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                        <CheckCircle size={16} />
                                        {uploadFile.name}
                                    </p>
                                )}
                            </div>

                            {/* Upload Errors */}
                            {uploadErrors.length > 0 && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 max-h-40 overflow-y-auto">
                                    <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                                        <AlertCircle size={18} />
                                        Errors Found
                                    </h4>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        {uploadErrors.map((error, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-red-500 mt-0.5">•</span>
                                                <span>{typeof error === 'string' ? error : `${error.name || error.email}: ${error.error}`}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Info */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
                                <p className="font-semibold mb-2">📋 Required Fields:</p>
                                <ul className="space-y-1 ml-4">
                                    <li>• <strong>name</strong> - Student's full name</li>
                                    <li>• <strong>email</strong> - Valid email address</li>
                                </ul>
                                <p className="font-semibold mt-3 mb-2">✨ Optional Fields:</p>
                                <ul className="space-y-1 ml-4">
                                    <li>• rollNumber, mobileNumber, className</li>
                                    <li>• <strong>testTitle</strong> - Exact test name (will auto-assign)</li>
                                    <li>• paperSet (A/B/C/D)</li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => { setShowUploadModal(false); setUploadFile(null); setUploadErrors([]); }}
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkUpload}
                                    disabled={!uploadFile || loading}
                                    className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={18} />
                                            Upload Students
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Student?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to delete this student? This action cannot be undone and all associated data will be removed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 shadow-lg shadow-red-200 transition-all transform hover:scale-[1.02]"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
