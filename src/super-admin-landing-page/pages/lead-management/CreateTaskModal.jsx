import React, { useState } from "react";
import Modal from "../../components/Modal";
import { LucideUser, LucideCalendar, LucideAlertCircle, LucideImage } from "lucide-react";
import { getLeadUsers } from "../../api/leadApi";
import { useEffect } from "react";

export default function CreateTaskModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: "",
        image: null
    });
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchStaff();
        }
    }, [isOpen]);

    const fetchStaff = async () => {
        try {
            const res = await getLeadUsers();
            if (res.success) {
                setStaffList(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch mobile users", error);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create FormData for multipart upload
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("assignedTo", formData.assignedTo);
        data.append("priority", formData.priority);
        data.append("dueDate", formData.dueDate);
        if (formData.image) {
            data.append("image", formData.image);
        }

        onSubmit(data);
        onClose();
        setFormData({
            title: "",
            description: "",
            assignedTo: "",
            priority: "Medium",
            dueDate: "",
            image: null
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="md">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Follow up with Rahul Kumar"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Add task details..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                            <LucideUser size={16} className="text-blue-600" />
                            Assign To <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Staff</option>
                            {staffList.map((staff) => (
                                <option key={staff._id} value={staff._id}>
                                    {staff.firstName} {staff.lastName} ({staff.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                            <LucideAlertCircle size={16} className="text-orange-600" />
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                        <LucideCalendar size={16} className="text-green-600" />
                        Due Date
                    </label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                        <LucideImage size={16} className="text-purple-600" />
                        Task Banner / Image
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 h-12"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl h-12 flex items-center justify-center"
                    >
                        Create Task
                    </button>
                </div>
            </form>
        </Modal>
    );
}
