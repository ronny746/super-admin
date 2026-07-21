import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { LucideUser, LucidePhone, LucideMail, LucideMapPin, LucideBriefcase, LucideLock, LucideCheckSquare, LucideSquare } from "lucide-react";
import { getForms } from "../../api/formApi";

export default function CreateStaffModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "COUNSELOR",
        password: "",
        confirmPassword: "",
    });

    const [availableForms, setAvailableForms] = useState([]);
    const [selectedForms, setSelectedForms] = useState([]);
    const [giveFormAccess, setGiveFormAccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchForms();
        }
    }, [isOpen]);

    const fetchForms = async () => {
        try {
            const res = await getForms();
            if (res.success) {
                setAvailableForms(res.data);
            }
        } catch (error) {
            console.error("Error fetching forms:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleFormSelection = (formId) => {
        setSelectedForms(prev =>
            prev.includes(formId)
                ? prev.filter(id => id !== formId)
                : [...prev, formId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const payload = {
            ...formData,
            permissions: {
                forms: giveFormAccess && selectedForms.length === 0,
                allowedForms: selectedForms
            }
        };

        onSubmit(payload);
        onClose();
        setFormData({
            name: "",
            email: "",
            role: "COUNSELOR",
            password: "",
            confirmPassword: "",
        });
        setSelectedForms([]);
        setGiveFormAccess(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Staff / Counselor" size="lg">
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Basic Information */}
                <div className="border-b pb-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <LucideUser size={18} className="text-blue-600" />
                        Staff Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter full name"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="email@example.com"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="COUNSELOR">Counselor</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Form Permissions */}
                <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-semibold text-gray-700 flex items-center gap-2">
                            <LucideBriefcase size={18} className="text-green-600" />
                            Form Access Permissions
                        </h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={giveFormAccess}
                                onChange={(e) => setGiveFormAccess(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {giveFormAccess && (
                        <div className="space-y-3">
                            <p className="text-xs text-gray-500 mb-2">Select specific forms this staff member can access. If none selected, they will have access to all forms.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 max-h-48 overflow-y-auto p-1">
                                {availableForms.map(form => (
                                    <div
                                        key={form._id}
                                        onClick={() => toggleFormSelection(form._id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedForms.includes(form._id)
                                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                                            : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-200'
                                            }`}
                                    >
                                        {selectedForms.includes(form._id) ? <LucideCheckSquare size={18} /> : <LucideSquare size={18} />}
                                        <span className="text-sm font-medium truncate">{form.title}</span>
                                    </div>
                                ))}
                                {availableForms.length === 0 && (
                                    <p className="text-sm text-gray-400 col-span-2 py-4 text-center">No forms available to assign.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Login Credentials */}
                <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <LucideLock size={18} className="text-purple-600" />
                        Login Credentials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Re-enter password"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
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
                        Create Staff Account
                    </button>
                </div>
            </form>
        </Modal>
    );
}
