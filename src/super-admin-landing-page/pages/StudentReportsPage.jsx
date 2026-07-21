import { useState, useEffect } from 'react';
import React from 'react';
import { FileText, TrendingUp, Award, AlertTriangle, Eye, Calendar, Clock, CheckCircle, XCircle, Camera, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTestStudents, getStudentTestHistory, getResultDetail } from '../api/testSystemApi';
import { useAppContext } from '../context/AppContext';

export default function StudentReportsPage() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showTestDetailModal, setShowTestDetailModal] = useState(false);
    const [testDetail, setTestDetail] = useState(null);

    const { user } = useAppContext();
    const instituteId = user?.instituteId || user?._id;

    useEffect(() => {
        if (instituteId) {
            fetchStudents();
        }
    }, [instituteId]);

    useEffect(() => {
        // Filter students based on search term
        const filtered = students.filter(student =>
            student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(filtered);
    }, [searchTerm, students]);

    const fetchStudents = async () => {
        try {
            const response = await getTestStudents(instituteId);
            setStudents(response.data);
            setFilteredStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to load students');
        }
    };

    const handleViewDetails = async (student) => {
        setSelectedStudent(student);
        setLoading(true);
        setShowDetailModal(true);

        try {
            const response = await getStudentTestHistory(student._id);
            console.log('Student Test History Response:', response);
            console.log('Response Data:', response.data);
            setStudentData(response.data);
        } catch (error) {
            console.error('Error fetching student history:', error);
            toast.error('Failed to load student history');
            setShowDetailModal(false);
        } finally {
            setLoading(false);
        }
    };

    const handleViewTestDetails = async (testResponseId) => {
        try {
            const response = await getResultDetail(testResponseId);
            setTestDetail(response.data);
            setShowTestDetailModal(true);
        } catch (error) {
            console.error('Error fetching test details:', error);
            toast.error('Failed to load test details');
        }
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedStudent(null);
        setStudentData(null);
    };

    const getImageUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http") || url.startsWith("https")) return url;
        return `http://localhost:5000${url}`;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-blue-600" size={32} />
                        Student Reports
                    </h1>
                    <p className="text-gray-500 mt-1">View comprehensive test history and performance analytics for all students</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex gap-4 items-center">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, User ID, email, or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium">
                        <Filter size={20} />
                        Filters
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Showing {filteredStudents.length} of {students.length} students
                </p>
            </div>

            {/* Students List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 text-lg">All Students</h3>
                </div>

                {filteredStudents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? 'No students found matching your search' : 'No students available'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student Info</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Roll Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Assigned Test</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{student.name}</p>
                                            <p className="text-xs text-gray-500">{student.mobileNumber || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-bold text-blue-600">{student.userId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">{student.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{student.rollNumber || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.assignedTest ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle size={12} className="mr-1" />
                                                    {student.assignedTest.title}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not Assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewDetails(student)}
                                                className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                                            >
                                                <Eye size={16} />
                                                View Reports
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Student Detail Modal */}
            {showDetailModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl my-8 max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-gray-200 z-10">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Student Report - {selectedStudent?.name}
                            </h2>
                            <button
                                onClick={closeDetailModal}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <XCircle size={28} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                                </div>
                            ) : studentData ? (
                                <>
                                    {/* Student Info Card */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-6 shadow-sm">
                                        <h3 className="font-bold text-blue-900 text-lg mb-4">Student Information</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-blue-700 font-semibold mb-1">Name</p>
                                                <p className="text-gray-900 font-bold">{studentData.student.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-700 font-semibold mb-1">User ID</p>
                                                <p className="text-gray-900 font-mono font-bold">{studentData.student.userId}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-700 font-semibold mb-1">Email</p>
                                                <p className="text-gray-900 text-sm">{studentData.student.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-700 font-semibold mb-1">Roll Number</p>
                                                <p className="text-gray-900 font-bold">{studentData.student.rollNumber || '-'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Analytics Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-white border-2 border-purple-200 rounded-xl p-5 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-gray-600">Total Tests</p>
                                                <FileText className="text-purple-600" size={24} />
                                            </div>
                                            <p className="text-3xl font-black text-gray-900">{studentData.analytics.totalTests}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {studentData.analytics.submittedTests} submitted, {studentData.analytics.inProgressTests} in-progress
                                            </p>
                                        </div>

                                        <div className="bg-white border-2 border-green-200 rounded-xl p-5 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-gray-600">Avg Score</p>
                                                <Award className="text-green-600" size={24} />
                                            </div>
                                            <p className="text-3xl font-black text-gray-900">{studentData.analytics.averageScore}%</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {studentData.analytics.totalCorrect}/{studentData.analytics.totalAttempted} correct
                                            </p>
                                        </div>

                                        <div className="bg-white border-2 border-blue-200 rounded-xl p-5 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-gray-600">Accuracy</p>
                                                <TrendingUp className="text-blue-600" size={24} />
                                            </div>
                                            <p className="text-3xl font-black text-gray-900">{studentData.analytics.accuracy}%</p>
                                            <p className="text-xs text-gray-500 mt-1">Overall performance</p>
                                        </div>

                                        <div className="bg-white border-2 border-red-200 rounded-xl p-5 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-gray-600">Violations</p>
                                                <AlertTriangle className="text-red-600" size={24} />
                                            </div>
                                            <p className="text-3xl font-black text-gray-900">{studentData.analytics.totalViolations}</p>
                                            <p className="text-xs text-gray-500 mt-1">Across all tests</p>
                                        </div>
                                    </div>

                                    {/* Test History */}
                                    <div className="bg-white rounded-xl border border-gray-200">
                                        <div className="p-4 border-b border-gray-200">
                                            <h3 className="font-bold text-gray-900">Test History</h3>
                                        </div>

                                        {studentData.testHistory.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500">
                                                No test history available for this student
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Test Name</th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Score</th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Violations</th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {studentData.testHistory.map((test) => (
                                                            <tr key={test._id} className="hover:bg-gray-50 transition">
                                                                <td className="px-4 py-3">
                                                                    <p className="font-medium text-gray-900 text-sm">{test.testTitle}</p>
                                                                    <p className="text-xs text-gray-500">{test.testDuration} mins</p>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                                                        <Calendar size={12} />
                                                                        {new Date(test.startTime).toLocaleDateString()}
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                        <Clock size={10} />
                                                                        {new Date(test.startTime).toLocaleTimeString()}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-lg font-bold text-gray-900">{test.score}</span>
                                                                        {test.scoreMetadata && (
                                                                            <span className="text-xs text-gray-500">
                                                                                ({test.scoreMetadata.correct}/{test.scoreMetadata.totalQuestions})
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {test.status === 'submitted' ? (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                            <CheckCircle size={10} className="mr-1" />
                                                                            Submitted
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            In Progress
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`font-bold ${test.violations > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                                        {test.violations}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <button
                                                                        onClick={() => handleViewTestDetails(test._id)}
                                                                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition"
                                                                    >
                                                                        <Eye size={12} />
                                                                        View
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* Test Detail Modal */}
            {showTestDetailModal && testDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Test Details</h2>
                            <button
                                onClick={() => setShowTestDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircle size={28} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Test Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Student</p>
                                    <p className="font-bold">{testDetail?.examSummary?.studentName || selectedStudent?.name || 'N/A'}</p>
                                    <p className="text-xs text-gray-500 font-mono">{testDetail?.examSummary?.userId || selectedStudent?.userId || ''}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Test</p>
                                    <p className="font-bold">{testDetail?.examSummary?.testTitle || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">{testDetail?.examSummary?.duration || 0} mins</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Score</p>
                                    <p className="text-2xl font-black text-green-600">{testDetail?.performanceSummary?.score || 0}</p>
                                    <p className="text-xs text-gray-500">
                                        {testDetail?.performanceSummary?.correct || 0}/{testDetail?.performanceSummary?.totalQuestions || 0} correct
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Violations</p>
                                    <p className="text-2xl font-black text-red-600">{testDetail?.violations?.length || 0}</p>
                                    <p className="text-xs text-gray-500">Total violations</p>
                                </div>
                            </div>

                            {/* Snapshots */}
                            {testDetail?.snapshots?.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Camera size={20} />
                                        Webcam Snapshots ({testDetail.snapshots.length})
                                    </h3>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                        {testDetail.snapshots.slice(0, 10).map((snap, idx) => (
                                            <div key={idx} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                                                <img
                                                    src={getImageUrl(snap.url || snap.imageUrl)}
                                                    alt={`Snapshot ${idx + 1}`}
                                                    className="w-full h-24 object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">No Image</text></svg>';
                                                    }}
                                                />
                                                <div className="text-xs text-center text-gray-500 py-1 bg-gray-50">
                                                    #{idx + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
