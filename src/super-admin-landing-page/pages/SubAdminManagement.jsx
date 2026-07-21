import React, { useState, useEffect } from "react";
import {
    Shield,
    Plus,
    Pencil,
    Trash2,
    X,
    CheckCircle2,
    Circle,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    getSubAdmins,
    createSubAdmin,
    updateSubAdmin,
    deleteSubAdmin
} from "../api/subAdminApi";

export default function SubAdminManagement() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Edit/Create Modal
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
        permissions: {
            attendance_system: false,
            test_system: false,
            forms: false,
            academic_management: false,
            slot_booking: false,
            allowedForms: []
        }
    });

    const [availableForms, setAvailableForms] = useState([]);

    useEffect(() => {
        fetchAdmins();
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const { getForms } = await import("../api/formApi");
            const res = await getForms();
            if (res.success) {
                setAvailableForms(res.data);
            }
        } catch (error) {
            console.error("Error fetching forms:", error);
        }
    };

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await getSubAdmins();
            if (res.success) {
                setAdmins(res.data);
            }
        } catch (error) {
            toast.error("Failed to fetch sub-admins");
            console.error(error);
        }
        setLoading(false);
    };

    const handleOpenModal = (admin = null) => {
        if (admin) {
            setFormData({
                id: admin._id,
                name: admin.name,
                email: admin.email,
                password: "", // Don't show password
                permissions: {
                    attendance_system: admin.permissions?.attendance_system || false,
                    test_system: admin.permissions?.test_system || false,
                    forms: admin.permissions?.forms || false,
                    academic_management: admin.permissions?.academic_management || false,
                    slot_booking: admin.permissions?.slot_booking || false,
                    allowedForms: admin.permissions?.allowedForms || []
                }
            });
        } else {
            setFormData({
                id: null,
                name: "",
                email: "",
                password: "",
                permissions: {
                    attendance_system: false,
                    test_system: false,
                    forms: false,
                    academic_management: false,
                    slot_booking: false,
                    allowedForms: []
                }
            });
        }
        setShowModal(true);
    };

    const toggleFormSelection = (formId) => {
        setFormData(prev => {
            const currentForms = prev.permissions.allowedForms || [];
            const newForms = currentForms.includes(formId)
                ? currentForms.filter(id => id !== formId)
                : [...currentForms, formId];

            return {
                ...prev,
                permissions: {
                    ...prev.permissions,
                    allowedForms: newForms
                }
            };
        });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            toast.error("Name and Email are required");
            return;
        }


        setSaving(true);
        try {
            if (formData.id) {
                // Update
                await updateSubAdmin(formData.id, {
                    name: formData.name,
                    email: formData.email,
                    permissions: formData.permissions
                    // Password update logic if needed
                });
                toast.success("Sub-Admin updated successfully");
            } else {
                // Create

                await createSubAdmin({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    permissions: formData.permissions
                });
                toast.success("Sub-Admin created successfully");
            }
            await fetchAdmins();
            setShowModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteSubAdmin(deleteId);
            await fetchAdmins();
            toast.success("Sub-Admin deleted");
        } catch (error) {
            toast.error("Failed to delete sub-admin");
        }
        setDeleteId(null);
    };

    const togglePermission = (key) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [key]: !prev.permissions[key]
            }
        }));
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Shield className="text-blue-600" />
                    Sub-Admin Management
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus size={20} /> Create Sub-Admin
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="text-left p-4 font-semibold text-gray-600">Name</th>
                            <th className="text-left p-4 font-semibold text-gray-600">Email</th>
                            <th className="text-left p-4 font-semibold text-gray-600">Permissions</th>
                            <th className="text-right p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center">Loading...</td></tr>
                        ) : admins.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No sub-admins found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            admins.map(admin => (
                                <tr key={admin._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{admin.name}</td>
                                    <td className="p-4 text-gray-600">{admin.email}</td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(admin.permissions || {})
                                                .filter(([key, val]) => val === true && key !== 'allowedForms')
                                                .map(([key]) => {
                                                    const labels = {
                                                        attendance_system: 'Attendance',
                                                        test_system: 'Test System',
                                                        forms: 'Forms',
                                                        academic_management: 'Academic Associate',
                                                        slot_booking: 'Slot Booking'
                                                    };
                                                    return (
                                                        <span key={key} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                                            {labels[key] || key.replace('_', ' ')}
                                                        </span>
                                                    );
                                                })}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(admin)}
                                                className="text-gray-600 hover:text-blue-600 p-1"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(admin._id)}
                                                className="text-gray-600 hover:text-red-600 p-1"
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

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-xl font-bold">
                                    {formData.id ? "Edit Sub-Admin" : "Create Sub-Admin"}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="email@example.com"
                                        type="email"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100 italic">
                                        Password is not required. Sub-Admins will login securely using OTP sent to their email.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Access Permissions</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { key: 'attendance_system', label: 'Attendance System (Dashboard & Mgmt)' },
                                            { key: 'test_system', label: 'Test System' },
                                            { key: 'forms', label: 'Forms System' },
                                            { key: 'academic_management', label: 'Academic Associate (Lead System Management)' },
                                            { key: 'slot_booking', label: 'Slot Booking Manager' }
                                        ].map(perm => (
                                            <div
                                                key={perm.key}
                                                onClick={() => togglePermission(perm.key)}
                                                className={`
                                            flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                            ${formData.permissions[perm.key]
                                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                        : 'hover:bg-gray-50 border-gray-200'}
                                        `}
                                            >
                                                {formData.permissions[perm.key]
                                                    ? <CheckCircle2 size={20} className="text-blue-500" />
                                                    : <Circle size={20} className="text-gray-300" />
                                                }
                                                <span className="font-medium">{perm.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {formData.permissions.forms && (
                                        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <label className="block text-sm font-medium text-gray-700 mb-3">Specific Form Access</label>
                                            <p className="text-xs text-gray-500 mb-3">Optional: Select specific forms to restrict access. If none are selected, the sub-admin will have access to all forms.</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                                                {availableForms.map(form => (
                                                    <div
                                                        key={form._id}
                                                        onClick={() => toggleFormSelection(form._id)}
                                                        className={`
                                                            flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm transition-all
                                                            ${formData.permissions.allowedForms?.includes(form._id)
                                                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                                                : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-200'}
                                                        `}
                                                    >
                                                        {formData.permissions.allowedForms?.includes(form._id)
                                                            ? <CheckCircle2 size={16} className="text-indigo-500" />
                                                            : <Circle size={16} className="text-gray-300" />
                                                        }
                                                        <span className="truncate">{form.title}</span>
                                                    </div>
                                                ))}
                                                {availableForms.length === 0 && (
                                                    <p className="text-xs text-gray-400 text-center py-2 col-span-2">No forms available.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
                                >
                                    {saving ? <Loader2 className="animate-spin" size={20} /> : "Save Sub-Admin"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* Delete Confirmation Modal */}
            < AnimatePresence >
                {deleteId && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="text-red-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Sub-Admin?</h3>
                                <p className="text-gray-500 mb-6">
                                    Are you sure you want to delete this sub-admin? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => setDeleteId(null)}
                                        className="px-5 py-2.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-5 py-2.5 bg-red-600 text-white font-medium hover:bg-red-700 rounded-xl shadow-lg shadow-red-200 transition-all hover:scale-105"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )
                }
            </AnimatePresence >
        </>
    );
}
