import React, { useState, useEffect, useRef } from 'react';
import { LucideX, LucideUsers, LucideChevronDown, LucideSearch, LucideCheck } from 'lucide-react';
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
                <LucideChevronDown size={14} className={`text-gray-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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

const MultiSearchableSelect = ({ options, value = [], onChange, placeholder = "Select..." }) => {
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

    const toggleOption = (optValue) => {
        if (value.includes(optValue)) {
            onChange(value.filter(v => v !== optValue));
        } else {
            onChange([...value, optValue]);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`truncate ${value.length === 0 ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                    {value.length === 0 ? placeholder : `${value.length} Counselor${value.length > 1 ? 's' : ''} Selected`}
                </span>
                <LucideChevronDown size={14} className={`text-gray-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, idx) => (
                                <div
                                    key={idx}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex items-center justify-between transition-colors ${value.includes(opt.value) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleOption(opt.value);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${value.includes(opt.value) ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white'}`}>
                                            {value.includes(opt.value) && <LucideCheck size={12} strokeWidth={3} />}
                                        </div>
                                        <span className="truncate">{opt.label}</span>
                                    </div>
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

export default function BulkAssignModal({ isOpen, onClose, filters: initialFilters, unassignedCount: initialUnassignedCount, staffList, sourceOptions = [], onAssign }) {
    const [selectedCounselors, setSelectedCounselors] = useState([]);
    const [distributionMode, setDistributionMode] = useState('evenly');
    const [customCounts, setCustomCounts] = useState({});
    
    const [loading, setLoading] = useState(false);
    
    // Internal filters for assignment
    const [localFilters, setLocalFilters] = useState({
        source: initialFilters?.source || "",
        class: initialFilters?.class || "",
        course: initialFilters?.course || "",
        status: initialFilters?.status || ""
    });
    
    const [localUnassignedCount, setLocalUnassignedCount] = useState(initialUnassignedCount);
    const [count, setCount] = useState(initialUnassignedCount);
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        const fetchCount = async () => {
            setIsCalculating(true);
            try {
                const res = await getAllLeads(1, 1, localFilters);
                const newCount = res.unassignedCount || 0;
                setLocalUnassignedCount(newCount);
                setCount(newCount);
            } catch (err) {
                console.error("Error fetching count:", err);
            } finally {
                setIsCalculating(false);
            }
        };
        if (isOpen) fetchCount();
    }, [localFilters, isOpen]);

    if (!isOpen) return null;

    const getEvenDistribution = () => {
        if (selectedCounselors.length === 0) return {};
        const total = parseInt(count) || 0;
        const base = Math.floor(total / selectedCounselors.length);
        const remainder = total % selectedCounselors.length;
        
        const dist = {};
        selectedCounselors.forEach((id, idx) => {
            dist[id] = base + (idx === selectedCounselors.length - 1 ? remainder : 0);
        });
        return dist;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedCounselors.length === 0) {
            return toast.error("Please select at least one counselor");
        }
        if (distributionMode === 'evenly') {
            if (count < 1 || count > localUnassignedCount) {
                return toast.error(`Please enter a valid total count up to ${localUnassignedCount}`);
            }
        }
        
        const assignments = [];
        const evenDist = getEvenDistribution();
        
        let sum = 0;
        selectedCounselors.forEach(cId => {
            const assignCount = distributionMode === 'evenly' ? evenDist[cId] : (parseInt(customCounts[cId]) || 0);
            if (assignCount > 0) {
                assignments.push({ filters: localFilters, assignTo: cId, count: assignCount });
                sum += assignCount;
            }
        });
        
        if (assignments.length === 0) return toast.error("No leads assigned (Counts are 0)");
        if (sum > localUnassignedCount) return toast.error(`Sum of assigned leads (${sum}) exceeds available leads (${localUnassignedCount})`);
        
        setLoading(true);
        await onAssign(assignments);
        setLoading(false);
    };

    const handleFilterChange = (field, value) => {
        setLocalFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-blue-50/40 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                            <LucideUsers size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Bulk Assign Leads</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Auto-distribute leads to counselors</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-white rounded-xl text-gray-400 hover:text-gray-600 transition-all shadow-sm border border-transparent hover:border-gray-200">
                        <LucideX size={18} />
                    </button>
                </div>

                <div className="px-7 py-5 overflow-y-auto">
                    {/* Internal Filters */}
                    <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100 relative z-10">
                        <div className="col-span-2">
                            <h3 className="text-sm font-semibold text-gray-700">Refine Leads to Assign</h3>
                            <p className="text-xs text-gray-500 mt-1">Select criteria below to filter which leads you want to assign.</p>
                        </div>
                        
                        <div className="z-40">
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
                                value={localFilters.class}
                                onChange={(val) => handleFilterChange('class', val)}
                                placeholder="Select Class"
                                allLabel="All Classes"
                            />
                        </div>

                        <div className="z-40">
                            <label className="block text-xs text-gray-500 mb-1">Inquiry For</label>
                            <SearchableSelect 
                                options={[
                                    { label: "IIT-JEE", value: "IIT-JEE" },
                                    { label: "NEET", value: "NEET" },
                                    { label: "Foundation", value: "Foundation" }
                                ]}
                                value={localFilters.course}
                                onChange={(val) => handleFilterChange('course', val)}
                                placeholder="Select Course"
                                allLabel="All Courses"
                            />
                        </div>
                        
                        <div className="z-30">
                            <label className="block text-xs text-gray-500 mb-1">Status</label>
                            <SearchableSelect 
                                options={[
                                    { label: "New", value: "New" },
                                    { label: "In Process", value: "In Process" },
                                    { label: "Follow Up", value: "Follow Up" }
                                ]}
                                value={localFilters.status}
                                onChange={(val) => handleFilterChange('status', val)}
                                placeholder="Select Status"
                                allLabel="All Statuses"
                            />
                        </div>

                        <div className="z-30">
                            <label className="block text-xs text-gray-500 mb-1">Source</label>
                            <SearchableSelect 
                                options={sourceOptions.map(s => ({ label: s, value: s }))}
                                value={localFilters.source}
                                onChange={(val) => handleFilterChange('source', val)}
                                placeholder="Select Source"
                                allLabel="All Sources"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex justify-between items-center relative z-0">
                        <p className="text-sm text-blue-800 flex items-center font-medium">
                            Matching Unassigned Leads: 
                            {isCalculating ? (
                                <span className="ml-2 font-bold animate-pulse text-lg">...</span>
                            ) : (
                                <strong className="ml-2 text-xl">{localUnassignedCount}</strong>
                            )}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 relative z-0">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assign To Counselors
                            </label>
                            <MultiSearchableSelect 
                                options={staffList.map(staff => ({ label: staff.name, value: staff._id }))}
                                value={selectedCounselors}
                                onChange={setSelectedCounselors}
                                placeholder="Select Counselors..."
                            />
                        </div>

                        {selectedCounselors.length > 0 && (
                            <div className="border border-gray-200 rounded-xl bg-gray-50 p-4 mt-2 shadow-sm animate-in fade-in duration-200">
                                <div className="flex gap-4 mb-4">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            checked={distributionMode === 'evenly'} 
                                            onChange={() => setDistributionMode('evenly')} 
                                        />
                                        Evenly Distribute
                                    </label>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            checked={distributionMode === 'custom'} 
                                            onChange={() => setDistributionMode('custom')} 
                                        />
                                        Custom
                                    </label>
                                </div>

                                {distributionMode === 'evenly' && (
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            Total Leads to Distribute
                                        </label>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max={localUnassignedCount}
                                            value={count}
                                            onChange={(e) => setCount(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            required
                                            disabled={localUnassignedCount === 0 || isCalculating}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {selectedCounselors.map(cId => {
                                        const staff = staffList.find(s => s._id === cId);
                                        const evenDist = getEvenDistribution();
                                        return (
                                            <div key={cId} className="flex justify-between items-center bg-white p-2.5 border border-gray-200 rounded-lg shadow-sm">
                                                <span className="text-sm font-semibold text-gray-800">{staff?.name}</span>
                                                {distributionMode === 'evenly' ? (
                                                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full">{evenDist[cId]} leads</span>
                                                ) : (
                                                    <input 
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm text-center font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                                                        value={customCounts[cId] || ""}
                                                        onChange={(e) => setCustomCounts(prev => ({...prev, [cId]: e.target.value}))}
                                                    />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                                
                                {distributionMode === 'custom' && (
                                    <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Total Selected</span>
                                        <span className={`text-sm font-bold ${selectedCounselors.reduce((acc, cId) => acc + (parseInt(customCounts[cId]) || 0), 0) > localUnassignedCount ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {selectedCounselors.reduce((acc, cId) => acc + (parseInt(customCounts[cId]) || 0), 0)} / {localUnassignedCount} available
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-4 flex gap-3 justify-end shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium disabled:bg-blue-400 disabled:opacity-50 transition-colors"
                                disabled={loading || localUnassignedCount === 0 || isCalculating}
                            >
                                {loading ? "Assigning..." : "Confirm Assignment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

