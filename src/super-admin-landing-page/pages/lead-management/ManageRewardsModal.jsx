import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { LucideAward, LucideHistory, LucideSend, LucideInfo, LucideCalendar, LucideChevronDown } from "lucide-react";
import { getLeadUserHistory, assignReward } from "../../api/leadApi";
import toast from "react-hot-toast";

export default function ManageRewardsModal({ isOpen, onClose, user, onUpdate }) {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rewardingLeadId, setRewardingLeadId] = useState(null);
    const [expandedLeadId, setExpandedLeadId] = useState(null);
    const [rewardForm, setRewardForm] = useState({
        points: "",
        status: "",
        remarks: ""
    });

    useEffect(() => {
        if (isOpen && user) {
            fetchHistory();
        }
    }, [isOpen, user]);

    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            const res = await getLeadUserHistory(user._id);
            if (res.success) {
                setHistory(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
            toast.error("Failed to load lead history");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignReward = async (leadId) => {
        if (!rewardForm.points || !rewardForm.status) {
            toast.error("Please provide points and status");
            return;
        }

        try {
            const res = await assignReward(user._id, {
                leadId,
                points: Number(rewardForm.points),
                status: rewardForm.status,
                remarks: rewardForm.remarks
            });

            if (res.success) {
                toast.success("Reward assigned successfully!");
                setRewardingLeadId(null);
                setRewardForm({ points: "", status: "", remarks: "" });
                fetchHistory();
                onUpdate && onUpdate(); 
            }
        } catch (error) {
            console.error("Reward error:", error);
            toast.error(error.response?.data?.message || "Failed to assign reward");
        }
    };

    const REWARDABLE_STATUSES = ["Visit Done", "Registration Done", "Admission Done", "Converted"];

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Manage Rewards: ${user.firstName} ${user.lastName}`} size="2xl">
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Header Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="text-xs font-bold text-blue-400 uppercase">Current Points</div>
                        <div className="text-2xl font-black text-blue-700">{user.points || 0}</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <div className="text-xs font-bold text-indigo-400 uppercase">Total Leads</div>
                        <div className="text-2xl font-black text-indigo-700">{history.length}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="text-xs font-bold text-green-400 uppercase">Admissions</div>
                        <div className="text-2xl font-black text-green-700">
                            {history.filter(h => h.status === "Admission Done" || h.status === "Converted").length}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <LucideHistory size={18} className="text-gray-400" />
                        Lead Activity & Reward History
                    </h3>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <LucideRefreshCcw size={32} className="animate-spin mb-2" />
                            <p>Loading history...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((item) => (
                                <div key={item._id} className={`border-2 rounded-2xl transition-all ${expandedLeadId === item._id ? 'border-blue-200 ring-2 ring-blue-50' : 'border-gray-100'}`}>
                                    <div 
                                        className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                                        onClick={() => setExpandedLeadId(expandedLeadId === item._id ? null : item._id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                                {item.studentName?.charAt(0) || "?"}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{item.studentName || "Unnamed Lead"}</h4>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <LucideCalendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                                item.status === 'Admission Done' ? 'bg-green-100 text-green-700' :
                                                item.status === 'Visit Done' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {item.status}
                                            </span>
                                            <div className={`transform transition-transform ${expandedLeadId === item._id ? 'rotate-180' : ''}`}>
                                                <LucideChevronDown size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {expandedLeadId === item._id && (
                                        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1">
                                            {/* Lead Details Grid */}
                                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6 mt-2">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
                                                    <div>
                                                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Student Name</div>
                                                        <div className="text-sm font-black text-gray-800">{item.studentName || "N/A"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Mobile</div>
                                                        <div className="text-sm font-black text-gray-800">{item.mobileNumber || "N/A"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Class</div>
                                                        <div className="text-sm font-black text-indigo-600">{item.class || "N/A"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Inquiry For</div>
                                                        <div className="text-sm font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded inline-block">{item.inquiryFor || "N/A"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Parent Name</div>
                                                        <div className="text-sm font-black text-gray-800">{item.parentName || "N/A"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Parent Mobile</div>
                                                        <div className="text-sm font-black text-gray-800">{item.parentMobile || "N/A"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">City</div>
                                                        <div className="text-sm font-black text-gray-800">{item.city || "N/A"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Assigned Counselor</div>
                                                        <div className="text-sm font-black text-blue-600">{item.assignedTo?.name || "Unassigned"}</div>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Lead Remarks</div>
                                                        <div className="text-sm font-semibold text-gray-600 italic">"{item.remarks || "No remarks provided"}"</div>
                                                    </div>
                                                    {item.attachments && item.attachments.length > 0 && (
                                                        <div className="col-span-3">
                                                            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Attachments</div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.attachments.map((file, idx) => (
                                                                    <a 
                                                                        key={idx}
                                                                        href={file}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1.5"
                                                                    >
                                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                                                        View File {idx + 1}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Existing Rewards */}
                                            {item.rewards && item.rewards.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Assigned Rewards</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.rewards.map((r, i) => (
                                                            <div key={i} className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-md border border-yellow-200">
                                                                <LucideAward size={10} />
                                                                {r.status}: +{r.points}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Reward Action */}
                                            {rewardingLeadId === item._id ? (
                                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-4">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-blue-400 uppercase mb-1">Milestone</label>
                                                            <select 
                                                                className="w-full text-sm border-2 border-white rounded-lg p-2 focus:outline-none focus:border-blue-300"
                                                                value={rewardForm.status}
                                                                onChange={(e) => setRewardForm({...rewardForm, status: e.target.value})}
                                                            >
                                                                <option value="">Select Status</option>
                                                                {REWARDABLE_STATUSES.map(s => (
                                                                    <option key={s} value={s}>{s}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-blue-400 uppercase mb-1">Points</label>
                                                            <input 
                                                                type="number"
                                                                placeholder="Enter Points"
                                                                className="w-full text-sm border-2 border-white rounded-lg p-2 focus:outline-none focus:border-blue-300"
                                                                value={rewardForm.points}
                                                                onChange={(e) => setRewardForm({...rewardForm, points: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleAssignReward(item._id)}
                                                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-blue-700 flex items-center justify-center gap-2"
                                                        >
                                                            <LucideSend size={14} /> Assign Points
                                                        </button>
                                                        <button 
                                                            onClick={() => setRewardingLeadId(null)}
                                                            className="px-4 py-2 text-gray-500 font-bold text-xs"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => {
                                                        setRewardingLeadId(item._id);
                                                        setRewardForm({
                                                            points: item.status === "Admission Done" ? 400 : (item.status === "Registration Done" ? 100 : 50),
                                                            status: item.status,
                                                            remarks: ""
                                                        });
                                                    }}
                                                    className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-sm transition-all"
                                                >
                                                    <LucideAward size={14} /> Award Reward Points
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {history.length === 0 && (
                                <div className="text-center py-12 text-gray-400 italic bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                    No lead activity found for this user.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] text-gray-400">
                <LucideInfo size={12} />
                Click on any lead to see full details and assign reward points.
            </div>
        </Modal>
    );
}

const LucideRefreshCcw = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
    </svg>
);
