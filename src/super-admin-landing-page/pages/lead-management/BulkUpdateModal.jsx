import React, { useState, useEffect, useRef } from 'react';
import { LucideX, LucideCheck, LucideSearch } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllLeads } from '../../api/leadApi';

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`truncate ${!value ? 'text-gray-500' : 'text-gray-800'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <LucideCheck size={14} className={`text-gray-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full min-w-[200px] mt-1 bg-white border rounded-lg shadow-xl max-h-72 flex flex-col animate-in fade-in zoom-in-95 duration-100">
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

export default function BulkUpdateModal({ isOpen, onClose, filters: initialFilters, sourceOptions = [], onUpdate }) {
    const [loading, setLoading] = useState(false);
    
    // Internal filters for update
    const [localFilters, setLocalFilters] = useState({
        source: initialFilters?.source || "",
        class: initialFilters?.class || "",
        course: initialFilters?.course || "",
        status: initialFilters?.status || ""
    });
    
    const [totalMatchingLeads, setTotalMatchingLeads] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);

    const [updateType, setUpdateType] = useState('course');
    const [updateValue, setUpdateValue] = useState("");

    useEffect(() => {
        const fetchCount = async () => {
            setIsCalculating(true);
            try {
                // We use getAllLeads to get the total count for these filters
                const res = await getAllLeads(1, 1, localFilters);
                const newCount = res.total || 0;
                setTotalMatchingLeads(newCount);
            } catch (err) {
                console.error("Error fetching count:", err);
            } finally {
                setIsCalculating(false);
            }
        };
        if (isOpen) fetchCount();
    }, [localFilters, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!updateValue.trim()) {
            return toast.error(`Please enter a valid ${updateType}`);
        }
        if (totalMatchingLeads === 0) {
            return toast.error("No leads match the selected filters");
        }

        const updates = { [updateType]: updateValue };
        
        setLoading(true);
        await onUpdate({ filters: localFilters, updates });
        setLoading(false);
    };

    const handleFilterChange = (field, value) => {
        setLocalFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-emerald-50/40 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                            <LucideCheck size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Bulk Update Leads</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Update field for all matching leads</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-white rounded-xl text-gray-400 hover:text-gray-600 transition-all shadow-sm border border-transparent hover:border-gray-200">
                        <LucideX size={18} />
                    </button>
                </div>

                <div className="px-7 py-5 overflow-y-auto">
                    {/* Internal Filters */}
                    <div className="grid grid-cols-1 gap-4 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100 relative z-10">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700">1. Select Form (Source)</h3>
                            <p className="text-xs text-gray-500 mt-1">Select the form to update all its leads.</p>
                        </div>

                        <div className="z-30">
                            <label className="block text-xs text-gray-500 mb-1">Source / Form</label>
                            <SearchableSelect 
                                options={sourceOptions.map(s => ({ label: s, value: s }))}
                                value={localFilters.source}
                                onChange={(val) => handleFilterChange('source', val)}
                                placeholder="Select Source"
                                allLabel="All Sources"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 mb-6 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                        <div className="text-sm font-medium">Matching Leads Found:</div>
                        <div className="text-xl font-bold flex items-center gap-2">
                            {isCalculating ? (
                                <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                totalMatchingLeads
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 relative z-0">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">2. Update Information</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Field to Update</label>
                            <select 
                                value={updateType}
                                onChange={e => setUpdateType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
                            >
                                <option value="course">Course / Enquiry For</option>
                                <option value="class">Class</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Value</label>
                            <input 
                                type="text"
                                list="modal-course-options"
                                value={updateValue}
                                onChange={e => setUpdateValue(e.target.value)}
                                placeholder={`Enter new ${updateType} (Select or Type)`}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
                            />
                            {updateType === 'course' && (
                                <datalist id="modal-course-options">
                                    {["IIT-JEE", "NEET", "Foundation", "Target", "Pre-Foundation", "Crash Course"].map(c => <option key={c} value={c}>{c}</option>)}
                                </datalist>
                            )}
                            {updateType === 'class' && (
                                <datalist id="modal-course-options">
                                    {["6th", "7th", "8th", "9th", "10th", "11th", "12th", "Dropper"].map(c => <option key={c} value={c}>{c}</option>)}
                                </datalist>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-7 py-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading || isCalculating || totalMatchingLeads === 0 || !updateValue.trim()} 
                        className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Updating...
                            </>
                        ) : (
                            "Update All Leads"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
