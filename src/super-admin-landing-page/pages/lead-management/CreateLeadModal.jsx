import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { LucideUser, LucidePhone, LucideMail, LucideMapPin, LucideGraduationCap, LucideFileText } from "lucide-react";
import { getStaff } from "../../api/staffApi";
import { getLeadUsers } from "../../api/leadApi";


export default function CreateLeadModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        studentName: "",
        mobileNumber: "",
        class: "",
        parentName: "",
        parentMobile: "",
        city: "",
        inquiryFor: "",
        remarks: "",
        assignedTo: "Auto-assign",
    });

    const [staffList, setStaffList] = useState([]);
    const [leadUsersList, setLeadUsersList] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            const [staffRes, leadUsersRes] = await Promise.all([
                getStaff(),
                getLeadUsers()
            ]);
            
            if (staffRes.success) setStaffList(staffRes.data);
            if (leadUsersRes.success) setLeadUsersList(leadUsersRes.data);
        } catch (error) {
            console.error("Failed to fetch assignment list", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        setFormData({
            studentName: "",
            mobileNumber: "",
            class: "",
            parentName: "",
            parentMobile: "",
            city: "",
            inquiryFor: "",
            remarks: "",
            assignedTo: "Auto-assign",
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Lead" size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Details */}
                <div className="border-b pb-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <LucideUser size={18} className="text-blue-600" />
                        Student Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Student Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter student name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Student Mobile
                            </label>
                            <input
                                type="tel"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="9876543210"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class
                            </label>
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Class</option>
                                <option value="10th">10th</option>
                                <option value="11th">11th</option>
                                <option value="12th">12th</option>
                                <option value="Dropper">Dropper</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Inquiry For
                            </label>
                            <select
                                name="inquiryFor"
                                value={formData.inquiryFor}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Course</option>
                                <option value="IIT-JEE">IIT-JEE</option>
                                <option value="NEET">NEET</option>
                                <option value="Foundation">Foundation</option>
                                <option value="CBSE">CBSE</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Parent Details */}
                <div className="border-b pb-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <LucideUser size={18} className="text-purple-600" />
                        Parent Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Parent Name
                            </label>
                            <input
                                type="text"
                                name="parentName"
                                value={formData.parentName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter parent name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Parent Mobile
                            </label>
                            <input
                                type="tel"
                                name="parentMobile"
                                value={formData.parentMobile}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="9876543210"
                            />
                        </div>
                    </div>
                </div>

                {/* Location & Assignment */}
                <div className="border-b pb-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <LucideMapPin size={18} className="text-green-600" />
                        Location & Assignment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Lucknow"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign To
                            </label>
                            <select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Auto-assign">Auto-assign (Unassigned)</option>
                                <option value="Self">Self (Me)</option>
                                {staffList.map((staff) => (
                                    <option key={staff._id} value={staff._id}>
                                        {staff.name || staff.firstName} ({staff.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Remarks */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remarks / Notes
                    </label>
                    <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Add any remarks or notes about this lead..."
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl"
                    >
                        Create Lead
                    </button>
                </div>
            </form>
        </Modal>
    );
}
