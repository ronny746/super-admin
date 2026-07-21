import React, { useState } from 'react';
import { RefreshCw, X, Phone, Mail, MapPin, Calendar, CheckCircle, Clock, Send, CreditCard, MessageSquare, IndianRupee, FileText, Download, PlusCircle, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { syncPayments, requestPayment, updateLead, recordManualPayment } from '../../api/leadApi';
import { jsPDF } from 'jspdf';
import { useAppContext } from '../../context/AppContext';

export const STAGE_OPTIONS = ["Hot", "Warm", "Cold", "Frozen"];

export const DISPOSITION_OPTIONS = [
    "Admission Done", "Already Joined UA", "Call Back", "Cut The Call", "Doing Self Study",
    "Duplicate No.", "Fees Issue", "Interested", "Invalid No.", "Joined At Hometown",
    "Joined College", "Joined Online Course", "Joined Other Institute", "Language Issue",
    "No Student Available", "Not Contactable", "Not Interested", "Not Responding",
    "Other Subject", "Registration Done", "Scholarship Issue", "Switch Off",
    "Think & Decide", "Visit Done", "Voice Issue", "Will Come For Free Test",
    "Will Join College", "Will Join Crash Course", "Will Join Next Year", "Will Join Test Series",
    "Will Pay Today", "Will Think After Adv Exam", "Will Think After Mains Exam",
    "Will Think After Neet Exam", "Will Visit", "Will Visit Again", "Will Wait For Result",
    "Won't Join Again", "Wrong No."
];

export const getStageColor = (stage) => {
    switch(stage) {
        case 'Hot': return 'text-red-600 bg-red-50';
        case 'Warm': return 'text-orange-600 bg-orange-50';
        case 'Cold': return 'text-blue-600 bg-blue-50';
        case 'Frozen': return 'bg-red-600 text-white font-bold';
        default: return 'text-gray-600 bg-gray-50';
    }
};

export const getDispositionColor = (disp) => {
    const positive = ["Admission Done", "Interested", "Registration Done", "Will Pay Today", "Visit Done", "Will Visit", "Will Visit Again", "Will Come For Free Test"];
    const negative = ["Not Interested", "Not Contactable", "Invalid No.", "Duplicate No.", "Cut The Call", "Switch Off", "Not Responding", "Wrong No.", "Won't Join Again", "Joined Other Institute", "Already Joined UA", "Joined College", "Joined Online Course", "Joined At Hometown", "Language Issue", "No Student Available", "Fees Issue", "Scholarship Issue", "Voice Issue"];
    
    if (positive.includes(disp)) return 'text-emerald-600 bg-emerald-50';
    if (negative.includes(disp)) return 'text-rose-600 bg-rose-50';
    return 'text-amber-600 bg-amber-50';
};

const getVal = (obj, keyName) => {
    if (!obj) return "";
    const key = Object.keys(obj).find(k => k.toLowerCase() === keyName.toLowerCase());
    return key ? obj[key] : "";
};

export const getStage = (lead) => {
    if (!lead) return "";
    if (lead.stage) return lead.stage;
    if (lead.formResponseId?.remarks?.length > 0) {
        const lastRemark = lead.formResponseId.remarks[lead.formResponseId.remarks.length - 1];
        if (lastRemark.stage) return lastRemark.stage;
    }
    if (lead.formResponseId?.stage) return lead.formResponseId.stage;
    return getVal(lead.rawFormData, 'stage');
};

export const getDisposition = (lead) => {
    if (!lead) return "";
    if (lead.disposition) return lead.disposition;
    if (lead.formResponseId?.remarks?.length > 0) {
        const lastRemark = lead.formResponseId.remarks[lead.formResponseId.remarks.length - 1];
        if (lastRemark.disposition) return lastRemark.disposition;
    }
    if (lead.formResponseId?.disposition) return lead.formResponseId.disposition;
    return getVal(lead.rawFormData, 'disposition');
};

const SearchableSelect = ({ options, value, onChange, placeholder, className }) => {
    const [search, setSearch] = React.useState(value || "");
    const [isOpen, setIsOpen] = React.useState(false);
    const wrapperRef = React.useRef(null);

    React.useEffect(() => {
        setSearch(value || "");
    }, [value]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearch(value || ""); 
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef, value]);

    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className={className}
            />
            {isOpen && (
                <div className="absolute bottom-[calc(100%+4px)] left-0 z-[100] w-[200px] bg-white border border-gray-100 rounded-lg shadow-xl max-h-48 overflow-y-auto transform transition-all origin-bottom-left">
                    {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                        <div 
                            key={opt}
                            className="px-3 py-2 text-[11px] font-medium hover:bg-blue-50 cursor-pointer text-gray-700 transition-colors border-b border-gray-50 last:border-0"
                            onClick={() => {
                                onChange(opt);
                                setSearch(opt);
                                setIsOpen(false);
                            }}
                        >
                            {opt}
                        </div>
                    )) : (
                        <div className="px-3 py-2 text-[11px] text-gray-400">No options found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function LeadDrawer({ isOpen, onClose, lead, onLeadUpdated, staffList = [], leadUsersList = [] }) {
    const { user } = useAppContext();
    const drawerRef = React.useRef(null);
    
    const [currentLead, setCurrentLead] = useState(lead);
    
    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'SUB_ADMIN'].includes(user?.role);
    const isFrozen = getStage(currentLead) === "Frozen";
    
    React.useEffect(() => {
        if (lead) setCurrentLead(lead);
    }, [lead]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                // Ignore clicks on table rows to allow immediate viewing of another lead
                if (event.target.closest('.lead-row')) return;
                // Also ignore clicks on toast notifications
                if (event.target.closest('.go3958317564')) return; 
                // Wait, go3958317564 is react-hot-toast generic class but it might change.
                if (event.target.closest('[role="status"]')) return;
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    const [noteText, setNoteText] = useState("");
    const [amount, setAmount] = useState("");
    const [onlinePaymentType, setOnlinePaymentType] = useState("Full");
    
    const [showPayment, setShowPayment] = useState(false);
    const [loadingReceipt, setLoadingReceipt] = useState(false);

    // Accordion states
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [showActivity, setShowActivity] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);
    const [showManualPayment, setShowManualPayment] = useState(false);
    const [showActions, setShowActions] = useState(false);
    
    const [showFollowUpPicker, setShowFollowUpPicker] = useState(false);
    const [pendingDisposition, setPendingDisposition] = useState(null);
    const [followUpDate, setFollowUpDate] = useState("");

    const [totalFee, setTotalFee] = useState(lead?.totalCourseFee || "");
    const [manualAmount, setManualAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [manualPaymentType, setManualPaymentType] = useState("Full");
    
    React.useEffect(() => {
        if (currentLead) setTotalFee(currentLead.totalCourseFee || "");
    }, [currentLead]);
    
    // Auto calculate full amount
    React.useEffect(() => {
        if (manualPaymentType === "Full" && showManualPayment) {
            const fee = Number(totalFee) || 0;
            const paid = currentLead?.totalAmountPaid || 0;
            setManualAmount(Math.max(fee - paid, 0));
        }
    }, [manualPaymentType, totalFee, showManualPayment, currentLead]);

    React.useEffect(() => {
        if (onlinePaymentType === "Full" && showPayment) {
            const fee = Number(totalFee) || 0;
            const paid = currentLead?.totalAmountPaid || 0;
            setAmount(Math.max(fee - paid, 0));
        }
    }, [onlinePaymentType, totalFee, showPayment, currentLead]);

    const [manualRemarks, setManualRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !currentLead) return null;

    const handleAddNote = async () => {
        if (!noteText.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await updateLead(currentLead._id, { remarks: noteText });
            toast.success("Note added successfully!");
            if (res && res.data) {
                setCurrentLead(res.data);
            }
            setNoteText("");
            onLeadUpdated();
        } catch (error) {
            toast.error("Failed to add note.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRequestPayment = async () => {
        if (!amount || amount <= 0) return toast.error("Enter a valid amount");
        setIsSubmitting(true);
        try {
            await requestPayment({ 
                leadId: currentLead._id, 
                amount: Number(amount), 
                paymentType: onlinePaymentType,
                totalCourseFee: Number(totalFee)
            });
            toast.success("Payment link sent via SMS!");
            
            // Optimistic UI update
            const newActivity = {
                action: "Payment Requested",
                description: `Payment link of ₹${amount} created.`,
                timestamp: new Date().toISOString(),
                performedByName: user?.name || "System"
            };
            setCurrentLead(prev => ({ ...prev, activities: [...(prev.activities || []), newActivity] }));
            
            setShowPayment(false);
            setAmount("");
            onLeadUpdated();
        } catch (error) {
            toast.error("Failed to send payment link.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleManualPayment = async () => {
        if (!manualAmount || manualAmount <= 0) return toast.error("Enter a valid amount");
        setIsSubmitting(true);
        try {
            const res = await recordManualPayment({
                leadId: currentLead._id,
                amount: Number(manualAmount),
                paymentMode,
                paymentType: manualPaymentType,
                totalCourseFee: Number(totalFee),
                remarks: manualRemarks
            });
            toast.success("Payment recorded successfully!");
            
            // Real-time UI update
            if (res && res.lead) {
                setCurrentLead(res.lead);
            }
            
            setShowManualPayment(false);
            setManualAmount("");
            setManualRemarks("");
            setPaymentMode("Cash");
            onLeadUpdated();
        } catch (error) {
            toast.error("Failed to record payment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSyncPayments = async () => {
        setIsSubmitting(true);
        try {
            const res = await syncPayments(currentLead._id);
            if (res.syncedCount > 0) {
                toast.success(`Successfully synced ${res.syncedCount} payment(s)!`);
                setCurrentLead(res.lead);
                onLeadUpdated();
            } else {
                toast.success("All payments are up to date.");
            }
        } catch (error) {
            toast.error("Failed to sync payments.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateInvoice = () => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22);
        doc.setTextColor(33, 150, 243);
        doc.text("FEE RECEIPT / INVOICE", 105, 20, null, null, "center");
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 190, 30, null, null, "right");
        
        doc.setLineWidth(0.5);
        doc.line(15, 35, 195, 35);
        
        // Student Info
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Student Details:", 15, 45);
        
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${currentLead.studentName || currentLead.firstName}`, 15, 55);
        const displayMobile = currentLead.mobileNumber?.startsWith("Form-") ? "No Mobile" : (currentLead.mobileNumber || "N/A");
        doc.text(`Mobile: ${displayMobile}`, 15, 65);
        doc.text(`Course: ${currentLead.course || 'N/A'}`, 15, 75);
        doc.text(`Class: ${currentLead.class || 'N/A'}`, 15, 85);
        
        // Payment Info
        doc.setFont("helvetica", "bold");
        doc.text("Payment Summary:", 120, 45);
        
        doc.setFont("helvetica", "normal");
        doc.text(`Total Course Fee: Rs. ${currentLead.totalCourseFee || 0}`, 120, 55);
        doc.text(`Amount Paid: Rs. ${currentLead.totalAmountPaid || 0}`, 120, 65);
        doc.text(`Balance: Rs. ${currentLead.remainingFee || 0}`, 120, 75);
        
        // Transaction History
        let yPos = 105;
        const payments = currentLead.activities?.filter(a => a.action === "Payment Received") || [];
        if (payments.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.text("Transaction History:", 15, yPos);
            yPos += 10;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            
            payments.forEach(p => {
                // Extract Txn ID if present
                const txnMatch = p.description.match(/Txn ID: ([A-Za-z0-9_]+)/);
                const txnId = txnMatch ? txnMatch[1] : "N/A";
                
                const amountMatch = p.description.match(/Payment of ₹([0-9.]+)/);
                const amt = amountMatch ? amountMatch[1] : "N/A";
                
                const date = new Date(p.timestamp).toLocaleDateString();
                
                doc.text(`Date: ${date} | Txn ID: ${txnId} | Amount: Rs. ${amt}`, 15, yPos);
                yPos += 7;
            });
        } else {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.text("No payments recorded yet.", 15, yPos);
            yPos += 7;
        }
        
        doc.setLineWidth(0.5);
        doc.line(15, yPos + 5, 195, yPos + 5);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("This is a computer generated receipt and does not require a physical signature.", 105, 280, null, null, "center");
        
        doc.save(`${currentLead.firstName}_Receipt.pdf`);
        toast.success("Invoice downloaded!");
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            const res = await updateLead(currentLead._id, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
            if (res && res.data) {
                setCurrentLead(res.data);
            }
            onLeadUpdated();
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const getStatusForDisposition = (disp) => {
        if (!disp) return "New";
        const closed = [
            "Won't Join Again", "Wrong No.", "Already Joined UA", "Doing Self Study",
            "Duplicate No.", "Invalid No.", "Joined At Hometown", "Joined College", 
            "Joined Online Course", "Joined Other Institute", "Language Issue", 
            "No Student Available", "Not Interested", "Other Subject"
        ];
        const followUp = [
            "Call Back", "Cut The Call", "Fees Issue", "Interested", "Not Contactable", 
            "Not Responding", "Scholarship Issue", "Switch Off", "Think & Decide", 
            "Visit Done", "Voice Issue", "Will Come For Free Test", "Will Join Crash Course", 
            "Will Join Test Series", "Will Pay Today", "Will Think After Adv Exam", 
            "Will Think After Mains Exam", "Will Think After Neet Exam", "Will Visit", 
            "Will Visit Again", "Will Wait For Result"
        ];
        if (closed.includes(disp)) return "Closed";
        if (followUp.includes(disp)) return "Follow Up";
        if (disp === "Admission Done" || disp === "Registration Done") return "Converted";
        return "In Process";
    };

    const handleDispositionSelect = (val) => {
        setPendingDisposition(val);
        setShowFollowUpPicker(true);
    };

    const confirmDispositionWithFollowUp = async () => {
        try {
            const updates = { disposition: pendingDisposition };
            if (followUpDate) {
                updates.nextFollowUpDate = followUpDate;
            }
            const newStatus = getStatusForDisposition(pendingDisposition);
            if (newStatus) {
                updates.status = newStatus;
            }
            
            const res = await updateLead(currentLead._id, updates);
            if (res && res.data) {
                setCurrentLead(res.data);
                toast.success('Disposition updated');
                onLeadUpdated();
            }
            setShowFollowUpPicker(false);
            setPendingDisposition(null);
            setFollowUpDate("");
        } catch (error) {
            toast.error('Failed to update disposition');
        }
    };

    const handleInlineUpdate = async (field, value) => {
        try {
            const updates = { [field]: value };
            if (field === 'disposition') {
                const newStatus = getStatusForDisposition(value);
                if (newStatus) {
                    updates.status = newStatus;
                }
            }
            const res = await updateLead(currentLead._id, updates);
            if (res && res.data) {
                setCurrentLead(res.data);
                toast.success(`${field} updated`);
                onLeadUpdated();
            }
        } catch (error) {
            toast.error(`Failed to update ${field}`);
        }
    };

    const handleAssignmentUpdate = async (value) => {
        if (!value) return;
        try {
            let updates = {};
            let newName = "";
            if (value.startsWith('leaduser_')) {
                const newId = value.replace('leaduser_', '');
                const u = leadUsersList.find(u => u._id === newId);
                updates = { assignedToLeadUser: newId, assignedTo: null, assignedToName: `${u?.firstName} ${u?.lastName}` };
            } else {
                const newId = value;
                const staff = staffList.find(s => s._id === newId);
                updates = { assignedTo: newId, assignedToLeadUser: null, assignedToName: staff?.name };
            }
            const res = await updateLead(currentLead._id, updates);
            if (res && res.data) {
                setCurrentLead(res.data);
                toast.success("Assignment updated");
                onLeadUpdated();
            }
        } catch (error) {
            toast.error("Failed to update assignment");
        }
    };

    const statusOptions = [
        "New", "In Process", "Follow Up", "Converted", "Closed",
        "Visit Done", "CNR", "Not Interested", "Interested",
        "Will Think", "Call Me Later", "Already Admitted Elsewhere",
        "Admission Done", "Registration Done"
    ];

    return (
        <div className="fixed inset-0 z-[100] flex justify-end pointer-events-none">
            {/* No Backdrop Blocking to allow background interaction */}
            <div className="absolute inset-0 pointer-events-none" />

            <div ref={drawerRef} className="relative w-full max-w-[560px] h-full bg-white shadow-2xl flex flex-col transform transition-all duration-300 ease-out translate-x-0 pointer-events-auto border-l border-gray-100">

                {/* ── Premium Header ── */}
                <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 px-6 py-5 flex items-start justify-between shrink-0 z-10 shadow-md">
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-lg border border-white/10">
                            <span className="text-white font-bold text-sm">
                                {(currentLead.firstName || currentLead.studentName || "?")[0].toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-base font-bold text-white leading-tight truncate flex items-center gap-2">
                                <span>{currentLead.firstName} {currentLead.lastName || ""}</span>
                                {currentLead.leadNo && (
                                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-white/20 text-white shadow-sm border border-white/10 shrink-0">
                                        #{String(currentLead.leadNo).padStart(4, '0')}
                                    </span>
                                )}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20 ${
                                        currentLead.status === 'Admission Done' ? 'bg-emerald-500/20 text-emerald-300' :
                                        currentLead.status === 'New' ? 'bg-blue-500/20 text-blue-300' :
                                        currentLead.status === 'Closed' || currentLead.status === 'Not Interested' ? 'bg-red-500/20 text-red-300' :
                                        'bg-amber-500/20 text-amber-300'
                                    }`}
                                >
                                    {currentLead.status || "New"}
                                </span>
                                
                                {getStage(currentLead) && (
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20 bg-white/10 text-white/90 ${getStageColor(getStage(currentLead)).split(' ')[0]}`}>
                                        {getStage(currentLead)}
                                    </span>
                                )}

                                {getDisposition(currentLead) && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20 bg-white/10 text-white/90 max-w-[120px] truncate">
                                        {getDisposition(currentLead)}
                                    </span>
                                )}

                                <span className="text-slate-400 text-[10px] ml-1 truncate max-w-[80px]">{currentLead.source || "Manual"}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0 shadow-sm border border-white/10 relative z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Scrollable Content ── */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 pb-[300px]">

                {/* ── Quick Info Strip ── */}
                <div className="grid grid-cols-2 gap-px bg-gray-100 border-b border-gray-200">
                    <div className="bg-white px-5 py-3 flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                            <Phone className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Mobile</p>
                            <p className="text-xs font-semibold text-gray-800 truncate">
                                {currentLead.mobileNumber?.startsWith("Form-") ? "No Mobile" : (currentLead.mobileNumber || "—")}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white px-5 py-3 flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                            <Mail className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Email</p>
                            <p className="text-xs font-semibold text-gray-800 truncate">{currentLead.email || "—"}</p>
                        </div>
                    </div>
                    <div className="bg-white px-5 py-3 flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Class / Course</p>
                            <p className="text-xs font-semibold text-gray-800 truncate">
                                {currentLead.class || "—"} {currentLead.course ? `/ ${currentLead.course}` : ""}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white px-5 py-3 flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">City</p>
                            <p className="text-xs font-semibold text-gray-800 truncate">{currentLead.city || "—"}</p>
                        </div>
                    </div>
                    <div className="bg-white px-5 py-3 flex items-center gap-2.5 col-span-2">
                        <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <div className="min-w-0 w-full pr-2">
                            <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Assigned To</p>
                            {isAdmin ? (
                                <select
                                    value={currentLead.assignedTo?._id || currentLead.assignedTo || ""}
                                    onChange={(e) => handleAssignmentUpdate(e.target.value)}
                                    className="text-xs font-semibold text-gray-800 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 w-full cursor-pointer pb-0.5"
                                >
                                    <option value="" disabled>Unassigned</option>
                                    {staffList.map(staff => (
                                        <option key={staff._id} value={staff._id}>{staff.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-xs font-semibold text-gray-800 truncate">
                                    {currentLead.assignedTo ? (currentLead.assignedTo.name || "Counselor") : (currentLead.assignedToLeadUser ? `${currentLead.assignedToLeadUser.firstName || ''} ${currentLead.assignedToLeadUser.lastName || ''}` : "Unassigned")}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Details */}
                    <div className="mx-5 mt-5">
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            <button 
                                onClick={() => setShowMoreDetails(!showMoreDetails)}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5 text-indigo-500" /> Additional Info
                                </span>
                                <span className={`text-gray-400 text-xs transition-transform duration-200 ${showMoreDetails ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                            {showMoreDetails && (
                                <div className="px-4 pb-4 pt-2 border-t border-gray-50">
                                    {currentLead.rawFormData && Object.keys(currentLead.rawFormData).length > 0 ? (
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                            {Object.entries(currentLead.rawFormData).map(([key, value]) => (
                                                <div key={key} className="col-span-2 border-b border-gray-50 pb-2 last:border-0">
                                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{key.replace(/_/g, ' ')}</p>
                                                    <p className="text-xs font-semibold text-gray-700">{value || "—"}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                            {[
                                                { label: 'Parent Name', value: currentLead.parentName },
                                                { label: 'Parent Mobile', value: currentLead.parentMobile },
                                                { label: 'Source', value: currentLead.source },
                                                { label: 'Created At', value: currentLead.createdAt ? new Date(currentLead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null },
                                            ].map(({ label, value }) => (
                                                <div key={label}>
                                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                                                    <p className="text-xs font-semibold text-gray-700">{value || "—"}</p>
                                                </div>
                                            ))}
                                            {currentLead.address && (
                                                <div className="col-span-2">
                                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Address</p>
                                                    <p className="text-xs font-semibold text-gray-700">{currentLead.address}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="mx-5 mt-5">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 shadow-md">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-white/90 flex items-center gap-1.5">
                                    <IndianRupee className="w-3.5 h-3.5" /> Financials
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        onClick={handleSyncPayments} 
                                        disabled={isSubmitting}
                                        className="text-[10px] flex items-center gap-1 bg-white/15 text-white px-2 py-1 rounded-lg hover:bg-white/25 transition disabled:opacity-50 border border-white/20"
                                    >
                                        <RefreshCw className={`w-2.5 h-2.5 ${isSubmitting ? 'animate-spin' : ''}`} /> Sync
                                    </button>
                                    <button onClick={generateInvoice} className="text-[10px] flex items-center gap-1 bg-white/15 text-white px-2 py-1 rounded-lg hover:bg-white/25 transition border border-white/20">
                                        <Download className="w-2.5 h-2.5" /> Receipt
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-white/15 backdrop-blur rounded-lg p-2.5 text-center border border-white/20">
                                    <p className="text-[9px] text-white/70 uppercase tracking-wide mb-0.5">Total Fee</p>
                                    <p className="text-sm font-bold text-white">₹{currentLead.totalCourseFee || 0}</p>
                                </div>
                                <div className="bg-white/15 backdrop-blur rounded-lg p-2.5 text-center border border-white/20">
                                    <p className="text-[9px] text-white/70 uppercase tracking-wide mb-0.5">Paid</p>
                                    <p className="text-sm font-bold text-white">₹{currentLead.totalAmountPaid || 0}</p>
                                </div>
                                <div className="bg-white/15 backdrop-blur rounded-lg p-2.5 text-center border border-white/20">
                                    <p className="text-[9px] text-white/70 uppercase tracking-wide mb-0.5">Balance</p>
                                    <p className="text-sm font-bold text-white">₹{currentLead.remainingFee || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Timeline */}
                    <div className="mx-5 mt-5 mb-5">
                        <div className="w-full flex items-center justify-between px-1 mb-4">
                            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2 m-0">
                                <Clock className="w-4 h-4 text-blue-500" /> Activity Timeline & Remarks
                            </h3>
                        </div>
                        
                        <div className="mt-2">
                            {((!currentLead.activities || currentLead.activities.length === 0) && (!currentLead.formResponseId?.remarks || currentLead.formResponseId.remarks.length === 0)) ? (
                                <div className="bg-white rounded-xl border border-gray-100 py-6 text-center">
                                    <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400">No activities yet</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Vertical line */}
                                    <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-gray-200 to-transparent" />
                                    <div className="space-y-2">
                                        {(() => {
                                            let allActivities = currentLead.activities ? [...currentLead.activities] : [];
                                            if (currentLead.formResponseId?.remarks?.length > 0) {
                                                const formRemarks = currentLead.formResponseId.remarks.map(r => ({
                                                    action: "Form Remark Added",
                                                    description: `Stage: ${r.stage || 'N/A'} | Disposition: ${r.disposition || 'N/A'}\nNote: ${r.text}`,
                                                    performedByName: r.adminName || 'System',
                                                    timestamp: r.createdAt || currentLead.createdAt
                                                }));
                                                allActivities = [...allActivities, ...formRemarks];
                                            }
                                            return allActivities
                                                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                                .map((activity, idx) => (
                                            <div key={idx} className="relative flex gap-3 items-start pl-1">
                                                {/* Dot */}
                                                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 border-white mt-0.5 ${
                                                    activity.action.includes('Payment') ? 'bg-emerald-500' :
                                                    activity.action.includes('Status') ? 'bg-blue-500' :
                                                    'bg-slate-400'
                                                }`}>
                                                    {activity.action.includes('Payment') 
                                                        ? <IndianRupee className="w-2.5 h-2.5 text-white" /> 
                                                        : activity.action.includes('Status')
                                                        ? <CheckCircle className="w-2.5 h-2.5 text-white" />
                                                        : <MessageSquare className="w-2.5 h-2.5 text-white" />}
                                                </div>
                                                {/* Card */}
                                                <div className="flex-1 bg-white rounded-xl border border-gray-100 px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                                        <span className="text-xs font-semibold text-gray-800 truncate">{activity.action}</span>
                                                        <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                                                            {new Date(activity.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 leading-relaxed whitespace-pre-line">
                                                        {activity.description ? activity.description.split(/(\*\*.*?\*\*)/).map((part, i) => 
                                                            part.startsWith('**') && part.endsWith('**') 
                                                                ? <strong key={i} className="font-bold text-gray-800 bg-gray-100 px-1 py-0.5 rounded mx-0.5">{part.slice(2, -2)}</strong> 
                                                                : part
                                                        ) : ""}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-1">— {activity.performedByName || 'System'}</p>
                                                </div>
                                            </div>
                                        ))})()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Action Sheet */}
                <div className="absolute bottom-0 inset-x-0 z-50 pointer-events-none">
                    {isFrozen && !isAdmin ? (
                        <div className="pointer-events-auto bg-gray-100 border-t border-gray-200 px-4 py-3 flex items-center justify-center gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                <span className="text-[14px]">❄️</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700 leading-tight">Lead is Frozen</p>
                                <p className="text-[10px] text-gray-500 font-medium">This lead is read-only and cannot be modified.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="pointer-events-auto w-full bg-white border-t-2 border-blue-100 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">                
                                 {/* Handle Bar */}
                                 <div className="flex justify-center pt-2.5 pb-1">
                                     <div className="w-10 h-1 bg-gray-200 rounded-full" />
                                 </div>

                                 <div className="px-4 pb-4 pt-1">
                                     {showPayment ? (
                                         <div>
                                             <div className="flex justify-between items-center mb-3">
                                                 <h4 className="text-sm font-bold text-blue-700 flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> Request Online Payment</h4>
                                                 <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                                             </div>
                                             <div className="mb-2">
                                                 <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Total Course Fee</label>
                                                 <div className="relative">
                                                     <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                                                     <input type="number" placeholder="Enter total course fee" className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50" value={totalFee} onChange={(e) => setTotalFee(e.target.value)} />
                                                 </div>
                                             </div>
                                             <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Amount &amp; Type</label>
                                             <div className="flex gap-2">
                                                 <select className="w-1/3 border border-gray-200 rounded-lg px-2 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none" value={onlinePaymentType} onChange={(e) => setOnlinePaymentType(e.target.value)}>
                                                     <option value="Full">Full</option>
                                                     <option value="Partial">Partial</option>
                                                 </select>
                                                 <div className="relative flex-1">
                                                     <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                                                     <input type="number" placeholder="Amount" className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={onlinePaymentType === "Full" ? Math.max((totalFee || currentLead.totalCourseFee || 0) - (currentLead.totalAmountPaid || 0), 0) : amount} onChange={(e) => setAmount(e.target.value)} disabled={onlinePaymentType === "Full"} />
                                                 </div>
                                                 <button onClick={handleRequestPayment} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 shadow-md shrink-0">
                                                     {isSubmitting ? '...' : <Send className="w-4 h-4" />}
                                                 </button>
                                             </div>
                                             {totalFee !== "" && (<p className="text-xs text-gray-400 mt-2">Balance after: <strong className="text-blue-600">₹{Math.max(Number(totalFee||0)-(currentLead.totalAmountPaid||0)-Number(onlinePaymentType==="Full"?Math.max((totalFee||currentLead.totalCourseFee||0)-(currentLead.totalAmountPaid||0),0):amount||0),0)}</strong></p>)}
                                         </div>
                                     ) : showManualPayment ? (
                                         <div>
                                             <div className="flex justify-between items-center mb-3">
                                                 <h4 className="text-sm font-bold text-purple-700 flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Record Offline Payment</h4>
                                                 <button onClick={() => setShowManualPayment(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                                             </div>
                                             <div className="grid grid-cols-2 gap-2 mb-2">
                                                 <div>
                                                     <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Total Fee</label>
                                                     <div className="relative"><span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span><input type="number" placeholder="Total fee" className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-purple-400 focus:outline-none" value={totalFee} onChange={(e) => setTotalFee(e.target.value)} /></div>
                                                 </div>
                                                 <div>
                                                     <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Mode</label>
                                                     <select className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-purple-400 focus:outline-none" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                                                         <option value="Cash">Cash</option><option value="Card">Card</option><option value="UPI">UPI</option><option value="Bank Transfer">Bank Transfer</option><option value="Cheque">Cheque</option>
                                                     </select>
                                                 </div>
                                             </div>
                                             <div className="flex gap-2 mb-2">
                                                 <select className="w-1/3 border border-gray-200 rounded-lg px-2 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-purple-400 focus:outline-none" value={manualPaymentType} onChange={(e) => setManualPaymentType(e.target.value)}>
                                                     <option value="Full">Full</option><option value="Partial">Partial</option>
                                                 </select>
                                                 <div className="relative flex-1"><span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span><input type="number" placeholder="Amount received" className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none" value={manualPaymentType==="Full"?Math.max((totalFee||currentLead.totalCourseFee||0)-(currentLead.totalAmountPaid||0),0):manualAmount} onChange={(e) => setManualAmount(e.target.value)} disabled={manualPaymentType==="Full"} /></div>
                                             </div>
                                             <input type="text" placeholder="Remarks / Transaction ID (optional)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none mb-3" value={manualRemarks} onChange={(e) => setManualRemarks(e.target.value)} />
                                             {totalFee !== "" && (<p className="text-xs text-gray-400 mb-2">Balance after: <strong className="text-purple-600">₹{Math.max(Number(totalFee||0)-(currentLead.totalAmountPaid||0)-Number(manualPaymentType==="Full"?Math.max((totalFee||currentLead.totalCourseFee||0)-(currentLead.totalAmountPaid||0),0):manualAmount||0),0)}</strong></p>)}
                                             <button onClick={handleManualPayment} disabled={isSubmitting} className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm font-semibold shadow-md">
                                                 {isSubmitting ? 'Saving...' : 'Save Payment'}
                                             </button>
                                         </div>
                                     ) : (
                                         <div className="space-y-3">
                                             {/* Quick Update Row */}
                                             <div className="grid grid-cols-2 gap-2">
                                                 <select className="w-full border border-gray-200 rounded-xl text-[11px] px-2.5 py-2 font-medium bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:bg-white transition-colors" value={getStage(currentLead) || ""} onChange={(e) => handleInlineUpdate('stage', e.target.value)}>
                                                     <option value="" disabled>Stage...</option>
                                                     {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                                 </select>
                                                 <SearchableSelect className="w-full border border-gray-200 rounded-xl text-[11px] px-2.5 py-2 font-medium bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:bg-white transition-colors" value={getDisposition(currentLead) || ""} onChange={(val) => handleDispositionSelect(val)} options={DISPOSITION_OPTIONS} placeholder="Disposition..." />
                                             </div>

                                             {/* Follow Up Date Picker */}
                                             {showFollowUpPicker && (
                                                 <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex flex-col gap-2">
                                                     <p className="text-[11px] font-bold text-orange-800">Set Follow-up Date &amp; Time</p>
                                                     <input 
                                                         type="datetime-local" 
                                                         className="w-full border border-orange-200 rounded-lg text-xs px-2.5 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none bg-white"
                                                         value={followUpDate}
                                                         onChange={(e) => setFollowUpDate(e.target.value)}
                                                     />
                                                     <div className="flex justify-end gap-2 mt-1">
                                                         <button 
                                                             onClick={() => { setShowFollowUpPicker(false); setPendingDisposition(null); setFollowUpDate(""); }} 
                                                             className="px-3 py-1.5 text-[11px] font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                                         >
                                                             Cancel
                                                         </button>
                                                         <button 
                                                             onClick={confirmDispositionWithFollowUp}
                                                             disabled={!followUpDate}
                                                             className="px-3 py-1.5 text-[11px] font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                                         >
                                                             Save
                                                         </button>
                                                     </div>
                                                 </div>
                                             )}

                                             {/* Pay Buttons */}
                                             <div className="grid grid-cols-2 gap-2">
                                                 <button onClick={() => {setShowPayment(true); setShowManualPayment(false);}} className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all">
                                                     <CreditCard className="w-3.5 h-3.5" /> Request Pay
                                                 </button>
                                                 <button onClick={() => {setShowManualPayment(true); setShowPayment(false);}} className="flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded-xl text-xs font-bold transition-all">
                                                     <CheckCircle className="w-3.5 h-3.5" /> Record Pay
                                                 </button>
                                             </div>

                                             {/* Note Input */}
                                             <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 focus-within:bg-white transition-all">
                                                 <MessageSquare className="w-4 h-4 text-gray-300 shrink-0" />
                                                 <input 
                                                     type="text" 
                                                     placeholder="Type a note or remark..." 
                                                     className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 min-w-0"
                                                     value={noteText}
                                                     onChange={(e) => setNoteText(e.target.value)}
                                                     onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                                 />
                                                 <button 
                                                     onClick={handleAddNote} 
                                                     disabled={isSubmitting || !noteText.trim()} 
                                                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors disabled:opacity-40 shrink-0"
                                                 >
                                                     {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <><Send className="w-3 h-3" /> Save</>}
                                                 </button>
                                             </div>
                                         </div>
                                     )}
                                 </div>
                             </div>
                    )}
                </div>
            </div>
        </div>
    );
}
