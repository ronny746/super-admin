import React, { useState, useEffect, useRef } from "react";
import { LucideSearch, LucideFilter, LucideMoreVertical, LucidePlus, LucideFileDown, LucideUsers, LucideChevronDown, LucideCheck, LucideCheckCircle2, LucideXCircle, LucideColumns, LucideCalendar, LucideUpload } from "lucide-react";
import CreateLeadModal from "./CreateLeadModal";
import LeadDrawer from "./LeadDrawer";
import BulkAssignModal from "./BulkAssignModal";
import BulkUpdateModal from "./BulkUpdateModal";
import ImportLeadsModal from './ImportLeadsModal';
import { useAppContext } from "../../context/AppContext";
import { getAllLeads, createLead, updateLeadStatus, updateLead, getLeadUsers, exportLeadsData, getLeadSources, bulkAssignLeads, bulkUpdateLeads } from "../../api/leadApi";
import { getStaff } from "../../api/staffApi";
import toast from "react-hot-toast";
import * as xlsx from 'xlsx';
import { useLocation } from "react-router-dom";

const statusColors = {
    "New": "bg-blue-100 text-blue-700",
    "In Process": "bg-yellow-100 text-yellow-700",
    "Follow Up": "bg-orange-100 text-orange-700",
    "Admission Done": "bg-green-100 text-green-700",
    "Closed": "bg-red-100 text-red-700",
};

const LEAD_STATUSES = [
    "New", "In Process", "Follow Up", "Converted", "Closed"
];

const VALID_CLASSES = ["6th", "7th", "8th", "9th", "10th", "11th", "12th", "Dropper"];
const VALID_COURSES = ["IIT-JEE", "NEET", "Foundation"];

const STAGE_OPTIONS = ["Hot", "Warm", "Cold", "Frozen"];

const DISPOSITION_OPTIONS = [
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
    return 'text-amber-600 bg-amber-50'; // Neutral
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
    return getVal(lead.rawFormData, 'disposition');
};

export const getRemarkText = (lead) => {
    if (lead.formResponseId?.remarks?.length > 0) {
        const lastRemark = lead.formResponseId.remarks[lead.formResponseId.remarks.length - 1];
        if (lastRemark.text) return lastRemark.text;
    }
    const rawRemark = getVal(lead.rawFormData, 'remark') || getVal(lead.rawFormData, 'remarks');
    if (rawRemark) return rawRemark;
    if (lead.remarks) return lead.remarks;
    return "";
};

const SearchableSelect = ({ options, value, onChange, placeholder = "Select...", allLabel = "All Options" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 hover:bg-white cursor-pointer flex justify-between items-center transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`truncate ${!value ? 'text-gray-500' : 'text-gray-800'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <LucideChevronDown size={14} className={`text-gray-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-[250px] md:w-full min-w-[200px] mt-1 bg-white border rounded-lg shadow-xl max-h-72 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b bg-gray-50/50 rounded-t-lg">
                        <div className="relative">
                            <LucideSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto overflow-x-hidden">
                        <div 
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors ${value === "" ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                            onClick={() => {
                                onChange("");
                                setIsOpen(false);
                                setSearch("");
                            }}
                        >
                            {allLabel}
                        </div>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, idx) => (
                                <div
                                    key={idx}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 truncate flex items-center justify-between transition-colors ${value === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    title={opt.label}
                                >
                                    <span className="truncate pr-2">{opt.label}</span>
                                    {value === opt.value && <LucideCheck size={14} className="shrink-0 text-blue-600" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-6 text-sm text-center text-gray-500">No matching options found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function AllLeadsPage({ isFocusToday = false }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination & Filters
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);
    const [totalPages, setTotalPages] = useState(1);
    const [unassignedCount, setUnassignedCount] = useState(0);
    const [sourceOptions, setSourceOptions] = useState([]);
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialAssignedTo = queryParams.get("assignedTo") || "";
    const [filters, setFilters] = useState({
        source: "",
        class: "",
        course: "",
        status: "",
        assignedTo: initialAssignedTo,
        isVerified: "",
        stage: isFocusToday ? "Hot" : "",
        disposition: "",
        date: isFocusToday ? new Date().toISOString().split('T')[0] : ""
    });
    const [showFilters, setShowFilters] = useState(false);
    const { user } = useAppContext();

    const [staffList, setStaffList] = useState([]);
    const [leadUsersList, setLeadUsersList] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
    const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState({
        leadNo: true,
        name: true,
        mobile: true,
        class: true,
        enquiryFor: true,
        source: true,
        stage: true,
        disposition: true,
        createdDate: true,
        updatedDate: true,
        followUpDate: true,
        status: true,
        assignedTo: true
    });
    const [showColumnToggle, setShowColumnToggle] = useState(false);
    const columnToggleRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (columnToggleRef.current && !columnToggleRef.current.contains(event.target)) {
                setShowColumnToggle(false);
            }
        };

        if (showColumnToggle) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColumnToggle]);

    // Fetch leads & Staff
    const fetchData = async () => {
        try {
            setLoading(true);
            const [leadsRes, staffRes, leadUsersRes, sourcesRes] = await Promise.all([
                getAllLeads(page, limit, filters),
                getStaff(),
                getLeadUsers(),
                getLeadSources()
            ]);

            setLeads(leadsRes.data);
            if (leadsRes.totalPages) setTotalPages(leadsRes.totalPages);
            if (leadsRes.unassignedCount !== undefined) setUnassignedCount(leadsRes.unassignedCount);

            if (staffRes.success) {
                setStaffList(staffRes.data);
            }
            if (leadUsersRes.success) {
                setLeadUsersList(leadUsersRes.data);
            }
            if (sourcesRes.success) {
                setSourceOptions(sourcesRes.data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit, filters]);

    const handleCreateLead = async (formData) => {
        try {
            let submissionData = { ...formData };
            if (formData.assignedTo && formData.assignedTo.startsWith("leaduser_")) {
                submissionData.assignedToLeadUser = formData.assignedTo.replace("leaduser_", "");
                delete submissionData.assignedTo;
            }
            
            toast.promise(
                createLead(submissionData),
                {
                    loading: 'Creating Lead...',
                    success: (res) => {
                        fetchData(); // Refresh to get populated names
                        return 'Lead Created Successfully!';
                    },
                    error: (err) => err.response?.data?.message || 'Failed to create lead'
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusUpdate = async (leadId, newStatus) => {
        try {
            const res = await updateLeadStatus(leadId, newStatus);
            if (res.success) {
                setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
                toast.success(`Status updated to ${newStatus}`);
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    }

    const handleAssignmentUpdate = async (leadId, newId) => {
        try {
            let updateData = {};
            let assignedName = "";
            if (newId.startsWith("leaduser_")) {
                const actualId = newId.replace("leaduser_", "");
                updateData.assignedToLeadUser = actualId;
                updateData.assignedTo = null; // Clear admin assignment
                const user = leadUsersList.find(u => u._id === actualId);
                if (user) assignedName = `${user.firstName} ${user.lastName}`;
            } else {
                updateData.assignedTo = newId;
                updateData.assignedToLeadUser = null; // Clear mobile assignment
                const staff = staffList.find(s => s._id === newId);
                if (staff) assignedName = staff.name;
            }
            if (assignedName) updateData.assignedToName = assignedName;

            const res = await updateLead(leadId, updateData);
            if (res.success) {
                fetchData(); // Refresh to get populated names
                toast.success(`Lead re-assigned successfully`);
            }
        } catch (error) {
            toast.error("Failed to update assignment");
        }
    }

    const handleInlineUpdate = async (leadId, field, value) => {
        if (!value.trim()) return;
        try {
            const res = await updateLead(leadId, { [field]: value });
            if (res.success) {
                setLeads(prev => prev.map(l => l._id === leadId ? { ...l, [field]: value } : l));
                toast.success(`${field} updated`);
            }
        } catch (error) {
            toast.error(`Failed to update ${field}`);
        }
    };

    const handleBulkUpdate = async (updateData) => {
        try {
            const res = await bulkUpdateLeads(updateData);
            if (res.success) {
                toast.success(res.message || "Bulk update successful");
                setIsBulkUpdateModalOpen(false);
                fetchData();
            } else {
                toast.error(res.message || "Failed to update leads");
            }
        } catch (error) {
            console.error("Bulk update error:", error);
            toast.error(error.response?.data?.message || "Failed to update leads");
        }
    };

    const handleExport = async () => {
        try {
            const toastId = toast.loading("Generating Excel...");
            const res = await exportLeadsData();
            if (res.success) {
                const data = res.data;
                if (!data || data.length === 0) {
                    toast.dismiss(toastId);
                    return toast.error("No data to export");
                }
                
                // Use xlsx library to generate a proper Excel file
                const ws = xlsx.utils.json_to_sheet(data);
                
                // Add some column width formatting for better readability
                const colWidths = [
                    { wch: 10 }, // Lead No
                    { wch: 20 }, // Name
                    { wch: 15 }, // Phone
                    { wch: 25 }, // Email
                    { wch: 10 }, // Class
                    { wch: 15 }, // Course
                    { wch: 15 }, // Source
                    { wch: 10 }, // Stage
                    { wch: 15 }, // Disposition
                    { wch: 15 }, // Status
                    { wch: 40 }, // Remarks
                    { wch: 20 }, // Assigned To
                    { wch: 10 }, // Total Fee
                    { wch: 10 }, // Amount Paid
                    { wch: 25 }, // Created At
                    { wch: 150 } // Activity History
                ];
                ws['!cols'] = colWidths;

                const wb = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(wb, ws, "Leads");
                
                // Attempt to apply wrapText if supported
                const range = xlsx.utils.decode_range(ws['!ref']);
                for(let R = range.s.r; R <= range.e.r; ++R) {
                    for(let C = range.s.c; C <= range.e.c; ++C) {
                        const cell = ws[xlsx.utils.encode_cell({r: R, c: C})];
                        if(!cell) continue;
                        if(!cell.s) cell.s = {};
                        cell.s.alignment = { wrapText: true, vertical: 'top' };
                    }
                }

                xlsx.writeFile(wb, "leads_export.xlsx", { cellStyles: true });
                
                toast.success("Export successful", { id: toastId });
            }
        } catch (error) {
            console.error("Export Error:", error);
            toast.error("Export failed", { id: toastId });
        }
    };

    const handleBulkAssign = async (assignData) => {
        try {
            if (Array.isArray(assignData)) {
                let successCount = 0;
                for (const data of assignData) {
                    const res = await bulkAssignLeads(data);
                    if (res.success) successCount++;
                }
                toast.success(`Successfully assigned leads across ${successCount} counselors`);
            } else {
                const res = await bulkAssignLeads(assignData);
                if (res.success) {
                    toast.success(res.message);
                }
            }
            setIsBulkAssignModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to bulk assign leads");
        }
    };

    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'SUB_ADMIN'].includes(user?.role);
    const isCounselor = user?.role === 'COUNSELOR';

    const filteredLeads = leads.filter(l => {
        const matchesSearch = l.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(l.leadNo).includes(searchTerm) ||
            l.mobileNumber?.includes(searchTerm);
        const matchesStage = !filters.stage || getStage(l) === filters.stage;
        const matchesDisposition = !filters.disposition || getDisposition(l) === filters.disposition;
        return matchesSearch && matchesStage && matchesDisposition;
    });

    const handleFilterChange = (key, value) => {
        setPage(1);
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ 
            source: "", 
            class: "", 
            course: "", 
            status: "", 
            assignedTo: "", 
            isVerified: "", 
            stage: isFocusToday ? "Hot" : "", 
            disposition: "",
            date: isFocusToday ? new Date().toISOString().split('T')[0] : ""
        });
        setPage(1);
    };

    return (
        <>
            <CreateLeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateLead}
            />
            <ImportLeadsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportSuccess={fetchData}
            />
            <LeadDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                lead={selectedLead}
                onLeadUpdated={() => {
                    fetchData();
                    // Keep drawer open but data will refresh
                }}
                staffList={staffList}
                leadUsersList={leadUsersList}
                user={user}
            />
            {isBulkAssignModalOpen && (
                <BulkAssignModal
                    isOpen={isBulkAssignModalOpen}
                    onClose={() => setIsBulkAssignModalOpen(false)}
                    filters={filters}
                    unassignedCount={unassignedCount}
                    staffList={staffList}
                    sourceOptions={sourceOptions}
                    onAssign={handleBulkAssign}
                />
            )}
            {isBulkUpdateModalOpen && (
                <BulkUpdateModal
                    isOpen={isBulkUpdateModalOpen}
                    onClose={() => setIsBulkUpdateModalOpen(false)}
                    filters={filters}
                    sourceOptions={sourceOptions}
                    onUpdate={handleBulkUpdate}
                />
            )}
            <div className="p-6">
                {isFocusToday ? (
                    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-8 bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 rounded-2xl shadow-lg">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                🔥 My Focus Today
                            </h2>
                            <p className="text-orange-100 text-sm mt-1">High priority leads requiring immediate attention</p>
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-sm border border-white/20 shadow-sm">
                            <LucideCalendar size={18} />
                            <input 
                                type="date" 
                                value={filters.date}
                                onChange={(e) => handleFilterChange('date', e.target.value)}
                                className="bg-transparent border-none focus:outline-none text-white font-medium cursor-pointer"
                                style={{ colorScheme: 'dark' }} // to make date picker icon visible on dark bg
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">All Leads</h2>
                        <p className="text-gray-500 text-sm mt-1">Manage and track all your leads in one place</p>
                    </div>
                )}
                {/* Header & Actions — All Left */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    {/* Search */}
                    <div className="relative">
                        <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name or mobile..."
                            className="w-64 pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all whitespace-nowrap ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' : 'border-gray-200 hover:bg-gray-50 text-gray-600 bg-white shadow-sm'}`}
                    >
                        <LucideFilter size={15} />
                        Filters
                        {(() => {
                            const activeCount = Object.entries(filters).filter(([k, v]) => {
                                if (v === "") return false;
                                if (isFocusToday && (k === 'stage' || k === 'date')) return false;
                                return true;
                            }).length;
                            return activeCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                    {activeCount}
                                </span>
                            );
                        })()}
                    </button>

                    {/* Rows per page */}
                    <div className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium border-gray-200 bg-white shadow-sm whitespace-nowrap">
                        <span className="text-gray-500">Show:</span>
                        <select
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            className="bg-transparent border-none focus:outline-none text-gray-700 cursor-pointer font-semibold"
                        >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={500}>500</option>
                            <option value={1000}>1000</option>
                        </select>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-7 bg-gray-200 mx-1" />

                    {/* Column Toggle */}
                    <div className="relative" ref={columnToggleRef}>
                        <button 
                            onClick={() => setShowColumnToggle(!showColumnToggle)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 bg-white shadow-sm transition-all whitespace-nowrap"
                        >
                            <LucideColumns size={15} />
                            Columns
                        </button>
                        
                        {showColumnToggle && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 p-3 max-h-[300px] overflow-y-auto">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-1">Visible Columns</h4>
                                {Object.keys(visibleColumns).map((colKey) => (
                                    <label key={colKey} className="flex items-center gap-3 py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={visibleColumns[colKey]}
                                            onChange={() => setVisibleColumns(prev => ({...prev, [colKey]: !prev[colKey]}))}
                                        />
                                        <span className="text-sm text-gray-700 capitalize">
                                            {colKey.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Import */}
                    <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 bg-white shadow-sm transition-all whitespace-nowrap">
                        <LucideUpload size={15} />
                        Import Excel
                    </button>

                    {/* Export */}
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 bg-white shadow-sm transition-all whitespace-nowrap">
                        <LucideFileDown size={15} />
                        Export
                    </button>

                    {/* Bulk Assign & Bulk Update */}
                    {isAdmin && (
                        <>
                            <button onClick={() => setIsBulkAssignModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 border border-blue-200 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 shadow-sm transition-all whitespace-nowrap">
                                <LucideUsers size={15} />
                                Bulk Assign
                            </button>
                            <button onClick={() => setIsBulkUpdateModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 shadow-sm transition-all whitespace-nowrap">
                                <LucideCheck size={15} />
                                Bulk Update
                            </button>
                        </>
                    )}

                    {/* Add Lead */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                    >
                        <LucidePlus size={15} />
                        Add Lead
                    </button>
                </div>

                {/* Advanced Filter Panel */}
                {showFilters && (
                    <div className="bg-white p-5 rounded-xl border shadow-sm mb-6 animate-in slide-in-from-top-2">
                        <div className="flex justify-start items-center gap-6 mb-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2"><LucideFilter className="w-4 h-4" /> Filters</h3>
                            <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">Clear All</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Class</label>
                                <SearchableSelect 
                                    options={[
                                        { label: "6th", value: "6th" },
                                        { label: "7th", value: "7th" },
                                        { label: "8th", value: "8th" },
                                        { label: "9th", value: "9th" },
                                        { label: "10th", value: "10th" },
                                        { label: "11th", value: "11th" },
                                        { label: "12th", value: "12th" },
                                        { label: "Dropper", value: "Dropper" }
                                    ]}
                                    value={filters.class}
                                    onChange={(val) => handleFilterChange('class', val)}
                                    placeholder="Select Class"
                                    allLabel="All Classes"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Inquiry For</label>
                                <SearchableSelect 
                                    options={[
                                        { label: "IIT-JEE", value: "IIT-JEE" },
                                        { label: "NEET", value: "NEET" },
                                        { label: "Foundation", value: "Foundation" }
                                    ]}
                                    value={filters.course}
                                    onChange={(val) => handleFilterChange('course', val)}
                                    placeholder="Select Course"
                                    allLabel="All Courses"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Status</label>
                                <SearchableSelect 
                                    options={LEAD_STATUSES.map(s => ({ label: s, value: s }))}
                                    value={filters.status}
                                    onChange={(val) => handleFilterChange('status', val)}
                                    placeholder="Select Status"
                                    allLabel="All Statuses"
                                />
                            </div>
                            {user?.role !== 'COUNSELOR' && (
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Assigned To</label>
                                    <SearchableSelect 
                                        options={[
                                            { label: "-- Unassigned --", value: "unassigned" },
                                            ...staffList.map(staff => ({ label: staff.name, value: staff._id }))
                                        ]}
                                        value={filters.assignedTo}
                                        onChange={(val) => handleFilterChange('assignedTo', val)}
                                        placeholder="Select Counselor"
                                        allLabel="All Counselors"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Source</label>
                                <SearchableSelect 
                                    options={sourceOptions.map(s => ({ label: s, value: s }))}
                                    value={filters.source}
                                    onChange={(val) => handleFilterChange('source', val)}
                                    placeholder="Select Source"
                                    allLabel="All Sources"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Verification</label>
                                <SearchableSelect 
                                    options={[
                                        { label: "Verified", value: "true" },
                                        { label: "Unverified", value: "false" }
                                    ]}
                                    value={filters.isVerified}
                                    onChange={(val) => handleFilterChange('isVerified', val)}
                                    placeholder="Select"
                                    allLabel="All"
                                />
                            </div>
                            {!isFocusToday && (
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Stage</label>
                                    <SearchableSelect 
                                        options={STAGE_OPTIONS.map(s => ({ label: s, value: s }))}
                                        value={filters.stage}
                                        onChange={(val) => handleFilterChange('stage', val)}
                                        placeholder="Select Stage"
                                        allLabel="All Stages"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Disposition</label>
                                <SearchableSelect 
                                    options={DISPOSITION_OPTIONS.map(d => ({ label: d, value: d }))}
                                    value={filters.disposition}
                                    onChange={(val) => handleFilterChange('disposition', val)}
                                    placeholder="Select Disposition"
                                    allLabel="All Dispositions"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading leads...</div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No leads found.</div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse min-w-[1500px]">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    {visibleColumns.leadNo && <th className="p-4 font-medium text-gray-600 min-w-[80px]">Lead No</th>}
                                    {visibleColumns.name && <th className="p-4 font-medium text-gray-600 min-w-[150px]">Name</th>}
                                    {visibleColumns.mobile && <th className="p-4 font-medium text-gray-600 min-w-[120px]">Mobile No</th>}
                                    {visibleColumns.class && <th className="p-4 font-medium text-gray-600 min-w-[100px]">Class</th>}
                                    {visibleColumns.enquiryFor && <th className="p-4 font-medium text-gray-600 min-w-[120px]">Enquiry For</th>}
                                    {visibleColumns.source && <th className="p-4 font-medium text-gray-600 min-w-[120px]">Lead Source</th>}
                                    {visibleColumns.stage && <th className="p-4 font-medium text-gray-600 min-w-[100px]">Stage</th>}
                                    {visibleColumns.disposition && <th className="p-4 font-medium text-gray-600 min-w-[120px]">Disposition</th>}
                                    {visibleColumns.createdDate && <th className="p-4 font-medium text-gray-600 min-w-[120px]">Created Date</th>}
                                    {visibleColumns.updatedDate && <th className="p-4 font-medium text-gray-600 min-w-[150px]">Last Mod. Date</th>}
                                    {visibleColumns.followUpDate && <th className="p-4 font-medium text-gray-600 min-w-[120px]">Follow up Date</th>}
                                    {visibleColumns.status && <th className="p-4 font-medium text-gray-600 min-w-[120px]">Status</th>}
                                    {visibleColumns.assignedTo && <th className="p-4 font-medium text-gray-600 min-w-[150px]">{isAdmin ? "Assigned To" : "Transfer To"}</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredLeads.map((lead) => (
                                    <tr 
                                        key={lead._id} 
                                        className="hover:bg-gray-100 cursor-pointer transition-colors"
                                        onClick={() => {
                                            setSelectedLead(lead);
                                            setIsDrawerOpen(true);
                                        }}
                                    >
                                        {visibleColumns.leadNo && (
                                            <td className="p-4 relative overflow-hidden text-sm text-gray-600 font-medium">
                                                {/* Duplicate Badge */}
                                                {lead.mobileNumber && !lead.mobileNumber.startsWith("Form-") && 
                                                 filteredLeads.some(l => l.mobileNumber === lead.mobileNumber && new Date(l.createdAt) < new Date(lead.createdAt)) && (
                                                    <div className="absolute top-2 -left-8 w-28 -rotate-45 bg-red-500 text-center shadow-sm pointer-events-none">
                                                        <span className="text-white text-[7px] font-bold uppercase tracking-wider block py-[2px]">
                                                            Duplicate
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="mt-2 pl-2">
                                                    #{String(lead.leadNo || 0).padStart(4, '0')}
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.name && (
                                            <td className="p-4 min-w-[150px]">
                                                <div className="mt-2 pl-2">
                                                    <p className="font-semibold text-gray-800">{lead.studentName || lead.firstName}</p>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.mobile && (
                                            <td className="p-4 text-sm min-w-[120px]">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-gray-600">
                                                        {lead.mobileNumber?.startsWith("Form-") ? "No Mobile" : lead.mobileNumber}
                                                    </p>
                                                    {lead.isMobileVerified || lead.rawFormData?.isVerified === true || lead.rawFormData?.isVerified === "true" || lead.formResponseId?.verificationStatus === 'Verified' ? (
                                                        <LucideCheckCircle2 size={14} className="text-green-600" title="Verified" />
                                                    ) : (
                                                        <LucideXCircle size={14} className="text-red-500" title="Unverified" />
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.class && (
                                            <td className="p-4 text-sm min-w-[140px]" onClick={(e) => e.stopPropagation()}>
                                                <select
                                                    className="px-2 py-1 rounded-md border border-gray-200 cursor-pointer bg-white w-full"
                                                    value={VALID_CLASSES.includes(lead.class) ? lead.class : ""}
                                                    onChange={(e) => handleInlineUpdate(lead._id, 'class', e.target.value)}
                                                >
                                                    <option value="" disabled>Select Class</option>
                                                    {VALID_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </td>
                                        )}
                                        {visibleColumns.enquiryFor && (
                                            <td className="p-4 text-sm min-w-[150px]" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="text"
                                                    list={`course-options-${lead._id}`}
                                                    className="px-2 py-1 rounded-md border border-gray-200 bg-white w-full focus:ring-1 focus:ring-blue-500 outline-none"
                                                    placeholder="Type or Select"
                                                    defaultValue={lead.inquiryFor || lead.course || ""}
                                                    onBlur={(e) => {
                                                        const newVal = e.target.value.trim();
                                                        if (newVal !== (lead.inquiryFor || lead.course || "")) {
                                                            handleInlineUpdate(lead._id, 'course', newVal);
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.target.blur();
                                                        }
                                                    }}
                                                />
                                                <datalist id={`course-options-${lead._id}`}>
                                                    {VALID_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </datalist>
                                            </td>
                                        )}
                                        {visibleColumns.source && (
                                            <td className="p-4 text-gray-600 text-sm min-w-[120px]">{lead.source || "Manual"}</td>
                                        )}
                                        {visibleColumns.stage && (
                                            <td className="p-4 text-sm min-w-[100px]">
                                                {getStage(lead) ? (
                                                    <span className={`px-2 py-1 rounded-md text-xs font-medium border border-transparent ${getStageColor(getStage(lead))}`}>
                                                        {getStage(lead)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Not Set</span>
                                                )}
                                            </td>
                                        )}
                                        {visibleColumns.disposition && (
                                            <td className="p-4 text-sm min-w-[120px]">
                                                {getDisposition(lead) ? (
                                                    <span className={`px-2 py-1 rounded-md text-xs font-medium border border-transparent inline-block max-w-[150px] truncate ${getDispositionColor(getDisposition(lead))}`}>
                                                        {getDisposition(lead)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Not Set</span>
                                                )}
                                            </td>
                                        )}
                                        {visibleColumns.createdDate && (
                                            <td className="p-4 text-gray-600 text-sm min-w-[150px] whitespace-nowrap">
                                                {new Date(lead.createdAt).toLocaleString('en-IN', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit', second: '2-digit', hour12: true})}
                                            </td>
                                        )}
                                        {visibleColumns.updatedDate && (
                                            <td className="p-4 text-gray-600 text-sm min-w-[150px] whitespace-nowrap">
                                                {(lead.updatedAt && new Date(lead.updatedAt).getTime() > new Date(lead.createdAt).getTime()) 
                                                    ? new Date(lead.updatedAt).toLocaleString('en-IN', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit', second: '2-digit', hour12: true}) 
                                                    : "—"}
                                            </td>
                                        )}
                                        {visibleColumns.followUpDate && (
                                            <td className="p-4 text-sm text-gray-700 font-medium whitespace-nowrap">
                                                {lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate).toLocaleString('en-IN', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit', hour12: true}) : "—"}
                                            </td>
                                        )}
                                        {visibleColumns.status && (
                                            <td className="p-4 min-w-[120px]">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] || "bg-gray-100 text-gray-700"}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.assignedTo && (
                                            <td className="p-4 min-w-[150px]">
                                                <select
                                                    value={isAdmin ? (lead.assignedTo?._id || lead.assignedToLeadUser || "") : ""}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => handleAssignmentUpdate(lead._id, e.target.value)}
                                                    className="px-2 py-1 text-sm border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 w-full"
                                                >
                                                    <option value="" disabled>{isAdmin ? "Assign to..." : "Transfer to..."}</option>
                                                    
                                                    {isAdmin ? (
                                                        staffList.map(staff => (
                                                            <option key={staff._id} value={staff._id}>{staff.name}</option>
                                                        ))
                                                    ) : (
                                                        staffList
                                                            .filter(staff => staff._id !== user._id)
                                                            .map(staff => (
                                                                <option key={staff._id} value={staff._id}>{staff.name}</option>
                                                            ))
                                                    )}
                                                </select>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    )}
                    
                    {/* Pagination Controls */}
                    {!loading && totalPages > 1 && (
                        <div className="flex justify-start items-center gap-6 p-4 border-t bg-gray-50">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
                                >
                                    Previous
                                </button>
                                <button 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
                                >
                                    Next
                                </button>
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                                Page {page} of {totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Go to page:</span>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max={totalPages}
                                    placeholder={page}
                                    className="w-16 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter') {
                                            const val = parseInt(e.target.value);
                                            if(val >= 1 && val <= totalPages) {
                                                setPage(val);
                                                e.target.value = '';
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
