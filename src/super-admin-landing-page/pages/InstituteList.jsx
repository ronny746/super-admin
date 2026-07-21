import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import {
  ChevronRight,
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  User,
  X,
  Calendar,
  Trash2,
  RefreshCw,
  Edit2,
  Save,
  CheckCircle2,
  CircleDashed
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getInstitute, getInstituteDetails, updateInstitute } from "../api/super_admin/get_institute";
import { deleteInstitute } from "../api/super_admin/delete_institute";
import toast from "react-hot-toast";

export default function InstituteList() {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    setLoading(true);
    try {
      const res = await getInstitute();
      setInstitutes(res.institutes || []);
    } catch {
      setInstitutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this institute? This action cannot be undone.")) return;

    setDeletingId(id);
    try {
      await deleteInstitute(id);
      setInstitutes(institutes.filter(i => i._id !== id));
      toast.success("Institute deleted successfully");
    } catch (err) {
      toast.error("Failed to delete institute: " + (err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await getInstituteDetails(id);
      setSelectedInstitute(res.institute);
      setEditForm({
        name: res.institute.name,
        code: res.institute.code,
        address: res.institute.address,
        isActive: res.institute.isActive,
        adminName: res.institute.admin?.name || "",
        adminEmail: res.institute.admin?.email || "",
      });
      setIsEditing(false);
      setModalOpen(true);
    } catch {
      toast.error("Failed to fetch institute details");
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateInstitute(selectedInstitute._id, editForm);
      toast.success("Institute updated successfully!");
      setIsEditing(false);
      fetchInstitutes(); // refresh list
      // Refresh details too
      const res = await getInstituteDetails(selectedInstitute._id);
      setSelectedInstitute(res.institute);
    } catch (err) {
      toast.error("Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Institutes Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage all registered institutes</p>
        </div>
        <button
          onClick={fetchInstitutes}
          className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center gap-2 font-bold"
        >
          <RefreshCw size={20} className={loading && institutes.length > 0 ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading && institutes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
          <CircleDashed size={60} className="animate-spin text-blue-600 mb-4" />
          <p className="font-bold text-gray-400">Loading Institute Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {institutes.map((i) => (
            <div
              key={i._id}
              className="
                group bg-white border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6
                hover:shadow-xl hover:-translate-y-1 hover:border-blue-300
                transition-all duration-300 relative overflow-hidden flex flex-col
              "
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 md:h-2 ${i.isActive ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gray-300"}`} />

              <div className="flex items-start justify-between mt-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-2xl ${i.isActive ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"} group-hover:scale-110 transition-transform`}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900 line-clamp-1">{i.name}</h2>
                    <p className="text-xs font-bold text-blue-600 tracking-wider">CODE: {i.code}</p>
                  </div>
                </div>
                <button
                  disabled={deletingId === i._id}
                  onClick={(e) => handleDelete(i._id, e)}
                  className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  {deletingId === i._id ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              </div>

              <div className="space-y-4 text-gray-700 text-sm flex-1">
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-2xl">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Students</p>
                        <p className="text-lg font-black text-gray-900">{i.studentCount ?? 0}</p>
                    </div>
                    <div className="text-center border-l">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Teachers</p>
                        <p className="text-lg font-black text-gray-900">{i.teacherCount ?? 0}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                    <User size={14} className="text-blue-500" />
                    <span className="truncate">ID: {i.adminUserId || "N/A"}</span>
                    </p>
                    <p className="flex items-start gap-2 text-xs text-gray-500">
                    <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 italic">{i.address}</span>
                    </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-50">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${i.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {i.isActive ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => handleViewDetails(i._id)}
                  className="flex items-center gap-2 text-blue-600 text-sm font-black hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all border border-blue-100 hover:border-blue-600"
                >
                  Manage
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODERN DETAIL & EDIT MODAL ================= */}
      <AnimatePresence>
        {modalOpen && selectedInstitute && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[70] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !updating && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl p-8 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 -z-10 blur-3xl opacity-50" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50 rounded-full -ml-16 -mb-16 -z-10 blur-3xl opacity-50" />

              <button
                onClick={() => !updating && setModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-5 mb-8">
                <div className="p-5 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-200">
                  <Building2 size={32} />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                      <input 
                        className="text-2xl font-black bg-gray-50 border-b-2 border-blue-500 outline-none w-full"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                  ) : (
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">
                        {selectedInstitute.name}
                    </h2>
                  )}
                  <p className="text-xs font-bold text-blue-600 tracking-widest mt-1 uppercase">
                    INSTITUTE CODE: {selectedInstitute.code}
                  </p>
                </div>
                
                <div className="hidden sm:block">
                   {isEditing ? (
                        <select 
                            className={`px-4 py-2 rounded-xl text-sm font-black border transition-colors outline-none ${editForm.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}
                            value={editForm.isActive ? "true" : "false"}
                            onChange={(e) => setEditForm({...editForm, isActive: e.target.value === "true"})}
                        >
                            <option value="true">ACTIVE</option>
                            <option value="false">INACTIVE</option>
                        </select>
                   ) : (
                        <span className={`px-4 py-2 rounded-full text-[10px] font-black tracking-[0.2em] border ${selectedInstitute.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}>
                            {selectedInstitute.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                   )}
                </div>
              </div>

              {/* Action Tabs / Buttons */}
              <div className="flex gap-3 mb-8">
                  {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        <Edit2 size={18} /> Edit Details
                      </button>
                  ) : (
                    <>
                        <button 
                            onClick={handleUpdate}
                            disabled={updating}
                            className="flex-[2] bg-blue-600 text-white py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                        >
                            {updating ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                            {updating ? "Saving Changes..." : "Save Institute Details"}
                        </button>
                         <button 
                            disabled={updating}
                            onClick={() => setIsEditing(false)}
                            className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-gray-300 transition-all"
                        >
                            Cancel
                        </button>
                    </>
                  )}
              </div>

              {/* Detailed Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8 mt-4">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={12} /> Location & Address
                    </h4>
                    {isEditing ? (
                        <textarea 
                            className="w-full bg-gray-50 border rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 h-24"
                            value={editForm.address}
                            onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                        />
                    ) : (
                        <p className="text-sm font-bold text-gray-700 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1">
                            {selectedInstitute.address}
                        </p>
                    )}

                     <div className="pt-2">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                             <Calendar size={12} /> Security Info
                        </h4>
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                             <ShieldCheck size={14} className="text-indigo-600" />
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Admin ID:</span>
                             <span className="text-[10px] font-mono font-bold text-indigo-700 truncate">{selectedInstitute.adminUserId}</span>
                        </div>
                    </div>
                 </div>

                 <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100 flex flex-col">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <User size={14} /> Master Administrator
                    </h4>
                    <div className="space-y-4 flex-1">
                        <div>
                             <label className="text-[9px] font-bold text-indigo-300 block mb-1">FULL NAME</label>
                             {isEditing ? (
                                <input 
                                    className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={editForm.adminName}
                                    onChange={(e) => setEditForm({...editForm, adminName: e.target.value})}
                                />
                             ) : (
                                <p className="text-lg font-black text-indigo-900">{selectedInstitute.admin?.name}</p>
                             )}
                        </div>
                        <div>
                             <label className="text-[9px] font-bold text-indigo-300 block mb-1">CONTACT EMAIL</label>
                             {isEditing ? (
                                <input 
                                    className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={editForm.adminEmail}
                                    onChange={(e) => setEditForm({...editForm, adminEmail: e.target.value})}
                                />
                             ) : (
                                <p className="text-sm font-bold text-indigo-700 flex items-center gap-2 truncate whitespace-nowrap">
                                    <Mail size={14} /> {selectedInstitute.admin?.email}
                                </p>
                             )}
                        </div>
                    </div>
                    
                    {!isEditing && (
                        <div className="mt-4 pt-4 border-t border-indigo-100">
                             <span className="text-[9px] font-black text-indigo-400 bg-white px-2 py-1 rounded-lg uppercase">Super Admin Access Verified</span>
                        </div>
                    )}
                 </div>
              </div>

               {/* Timestamps Footer */}
               <div className="flex items-center justify-between pt-6 border-t border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                   <div className="flex items-center gap-2">
                        <Calendar size={12} /> Joined: {new Date(selectedInstitute.createdAt).toLocaleDateString()}
                   </div>
                   <div className="flex items-center gap-2">
                        Updated: {new Date(selectedInstitute.updatedAt).toLocaleTimeString()}
                   </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SuperAdminLayout>
  );
}
