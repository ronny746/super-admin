import React, { useState } from "react";
import Modal from "../../components/Modal";
import { LucideTag, LucideCalendar, LucideUsers, LucideImage } from "lucide-react";

export default function CreateOfferModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "Discount",
        validTill: "",
        targetRole: "all",
        bannerColor: "#00C853",
        image: null
    });

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
        data.append("type", formData.type);
        data.append("validTill", formData.validTill);
        data.append("targetRoles", formData.targetRole);
        data.append("bannerColor", formData.bannerColor);
        if (formData.image) {
            data.append("image", formData.image);
        }

        onSubmit(data);
        onClose();
        setFormData({
            title: "",
            description: "",
            type: "Discount",
            validTill: "",
            targetRole: "all",
            bannerColor: "#00C853",
            image: null
        });
    };

    const colorOptions = [
        { label: "Green", value: "#00C853" },
        { label: "Blue", value: "#2196F3" },
        { label: "Purple", value: "#9C27B0" },
        { label: "Orange", value: "#FF9800" },
        { label: "Red", value: "#F44336" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Offer" size="md">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 20% Off on IIT-JEE"
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
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Brief description of the offer..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <LucideTag size={16} className="text-purple-600" />
                            Offer Type
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Discount">Discount</option>
                            <option value="Referral">Referral</option>
                            <option value="Promotion">Promotion</option>
                            <option value="General">General</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <LucideCalendar size={16} className="text-green-600" />
                            Valid Till
                        </label>
                        <input
                            type="date"
                            name="validTill"
                            value={formData.validTill}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <LucideUsers size={16} className="text-blue-600" />
                        Target Audience
                    </label>
                    <select
                        name="targetRole"
                        value={formData.targetRole}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Users (Everyone)</option>
                        <option value="COUNSELOR">Counselors</option>
                        <option value="LEARNER">Learners</option>
                        <option value="ACADEMIC_ASSOCIATE">Academic Associates</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="FOS">FOS (Field Staff)</option>
                        <option value="TEAM_MEMBER">Team Members</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <LucideImage size={16} className="text-purple-600" />
                        Offer Banner / Image
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme Color
                    </label>
                    <div className="flex gap-2">
                        {colorOptions.map((color) => (
                            <button
                                key={color.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, bannerColor: color.value })}
                                className={`w-10 h-10 rounded-lg border-2 transition-all ${formData.bannerColor === color.value ? "border-gray-800 scale-110" : "border-gray-200"
                                    }`}
                                style={{ backgroundColor: color.value }}
                                title={color.label}
                            />
                        ))}
                    </div>
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
                        Create Offer
                    </button>
                </div>
            </form>
        </Modal>
    );
}
