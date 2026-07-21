import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Plus, User, Clock, MessageSquarePlus, MessageSquare, Eye, EyeOff, Settings2, ChevronDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { getFormById, getFormResponses, addResponseRemark, syncFormFields } from '../../api/formApi';
import { useAppContext } from '../../context/AppContext';

export default function FormResponses() {
    const { user } = useAppContext();
    const isAdmin = user?.role === 'ADMIN';
    const isSubAdmin = user?.role === 'SUB_ADMIN';
    const { id } = useParams();
    const [responses, setResponses] = useState([]);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newRemark, setNewRemark] = useState({ text: '', disposition: '', stage: '' });
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [showColMenu, setShowColMenu] = useState(false);
    
    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStage, setFilterStage] = useState('');
    const [filterDisposition, setFilterDisposition] = useState('');
    const [filterVerification, setFilterVerification] = useState('');
    const [filterPayment, setFilterPayment] = useState('');
    
    // Mapping state
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [mapTargetField, setMapTargetField] = useState('studentName');
    const [mapSourceQuestionId, setMapSourceQuestionId] = useState('');
    const [isMapping, setIsMapping] = useState(false);
    const [syncProgress, setSyncProgress] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;

    // Calculate max remarks to know how many columns to show
    const maxRemarks = Math.max(1, ...responses.map(r => r.remarks?.length || 0));

    const toggleColumn = (colId) => {
        setHiddenColumns(prev => 
            prev.includes(colId) ? prev.filter(c => c !== colId) : [...prev, colId]
        );
    };

    const isVisible = (colId) => !hiddenColumns.includes(colId);

    const DISPOSITIONS = [
        "Admission Done",
        "Already Joined UA",
        "Call Back",
        "Cut The Call",
        "Doing Self Study",
        "Duplicate No.",
        "Fees Issue",
        "Interested",
        "Invalid No.",
        "Joined At Hometown",
        "Joined College",
        "Joined Online Course",
        "Joined Other Institute",
        "Language Issue",
        "No Student Available",
        "Not Contactable",
        "Not Interested",
        "Not Responding",
        "Other Subject",
        "Registration Done",
        "Scholarship Issue",
        "Switch Off",
        "Think & Decide",
        "Visit Done",
        "Voice Issue",
        "Will Come For Free Test",
        "Will Join College",
        "Will Join Crash Course",
        "Will Join Next Year",
        "Will Join Test Series",
        "Will Pay Today",
        "Will Think After Adv Exam",
        "Will Think After Mains Exam",
        "Will Think After Neet Exam",
        "Will Visit",
        "Will Visit Again",
        "Will Wait For Result",
        "Won't Join Again",
        "Wrong No."
    ];

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStage, filterDisposition, filterVerification, filterPayment]);

    const fetchData = async () => {
        try {
            const [formData, responsesData] = await Promise.all([
                getFormById(id),
                getFormResponses(id)
            ]);

            if (formData.success) setForm(formData.data);
            if (responsesData.success) setResponses(responsesData.data);

        } catch (error) {
            toast.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRemarkClick = (resp) => {
        setSelectedResponse(resp);
        setNewRemark({ text: '', disposition: '', stage: '' });
        setIsRemarkModalOpen(true);
    };

    const handleAddRemark = async () => {
        if (!newRemark.text || !newRemark.disposition) {
            toast.error('Please enter remark and select disposition');
            return;
        }

        if (!newRemark.stage) {
            toast.error('Please select a stage');
            return;
        }

        try {
            setIsSubmitting(true);
            await addResponseRemark(selectedResponse._id, {
                text: newRemark.text,
                disposition: newRemark.disposition,
                stage: newRemark.stage
            });
            toast.success('Remark added successfully');
            setIsRemarkModalOpen(false);
            setNewRemark({ text: '', disposition: '', stage: '' });
            fetchData();
        } catch (error) {
            console.error('Error adding remark:', error);
            toast.error(error.response?.data?.message || 'Failed to add remark');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMapData = async () => {
        if (!mapSourceQuestionId) {
            toast.error("Please select a source question");
            return;
        }
        setIsMapping(true);
        setSyncProgress({ current: 0, total: responses.length });
        
        try {
            const chunkSize = 20; // Sync 20 at a time to show frequent progress updates
            let totalUpdated = 0;
            
            for (let i = 0; i < responses.length; i += chunkSize) {
                const chunk = responses.slice(i, i + chunkSize).map(r => r._id);
                const res = await syncFormFields(id, { 
                    targetField: mapTargetField, 
                    questionId: mapSourceQuestionId,
                    responseIds: chunk
                });
                totalUpdated += res.updatedCount;
                setSyncProgress({ current: Math.min(i + chunkSize, responses.length), total: responses.length });
            }
            
            toast.success(`Successfully mapped ${totalUpdated} records`);
            setIsMapModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to map data");
        } finally {
            setIsMapping(false);
            setSyncProgress(null);
            setMapSourceQuestionId('');
        }
    };

    // Helper: Normalize text for flexible matching:
    // 1. Trim whitespace
    // 2. Lowercase
    // 3. Squash multiple spaces to single space
    // 4. Remove special characters to catch minor typos like "Stream:" vs "Stream"
    const normalizeKey = (text) => (text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove non-alphanumeric chars (like : or ?)
        .replace(/\s+/g, ' ')        // Squash spaces
        .trim();

    // Helper: Identify unique question texts to merge duplicate columns
    const getUniqueHeaders = (questions) => {
        if (!questions) return [];
        const seenKeys = new Set();
        return questions
            .filter(q => {
                const key = normalizeKey(q.questionText);
                if (seenKeys.has(key)) return false;
                seenKeys.add(key);
                return true;
            })
            .map(q => q.questionText); // Return the original text of the first occurrence
    };

    // Helper: Find answer across all potential question IDs for a given text header
    const getMergedAnswer = (response, questionText, allQuestions) => {
        if (!allQuestions || !response.answers) return '-';

        const targetKey = normalizeKey(questionText);

        // Find all question IDs that fuzzy-match this text
        const matchingQIds = allQuestions
            .filter(q => normalizeKey(q.questionText) === targetKey)
            .map(q => q.id);

        // Find the first non-empty answer among these IDs
        for (const qId of matchingQIds) {
            const ansObj = response.answers.find(a => a.questionId === qId);
            if (ansObj && ansObj.answer != null) {
                const val = ansObj.answer;
                // Skip empty values to allow finding data in other branches
                if (Array.isArray(val) && val.length === 0) continue;
                if (typeof val === 'string' && val.trim() === '') continue;

                return Array.isArray(val) ? val.join(', ') : val;
            }
        }
        return '-';
    };

    const getDispositionColor = (disp) => {
        const d = disp?.toUpperCase();
        if (d === 'SWITCH OFF/NOT REACHABLE') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (d === 'COLD') return 'bg-sky-100 text-sky-700 border-sky-200';
        if (d === 'NOT INTERESTED') return 'bg-red-600 text-white border-red-700';
        if (d === 'THINK & DECIDE') return 'bg-violet-100 text-violet-700 border-violet-200';
        if (d === 'OUT OF TOWN') return 'bg-orange-800 text-white border-orange-900';
        if (d === 'ASK TO CALL BACK') return 'bg-blue-600 text-white border-blue-700';
        // Defaults forTHERS as per image (grayish/light)
        const neutrals = ['CNR', 'ASKED TO CALL BACK', 'WRONG NUMBER', 'INTERESTED', 'REPEATED', 'DONE', 'NOT ANSWERED', 'CALL CUT'];
        if (neutrals.includes(d)) return 'bg-slate-100 text-slate-700 border-slate-200';
        
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const exportToExcel = () => {
        if (!form || responses.length === 0) return;

        const uniqueHeaders = getUniqueHeaders(form.questions);
        
        // Base headers
        const headers = ['Submitted At', 'Respondent', 'Verification', 'Payment Status', 'Stage', ...uniqueHeaders];
        
        // Add dynamic Remark/Disp headers
        for (let i = 0; i < maxRemarks; i++) {
            headers.push(`Remark ${i + 1}`, `Disposition ${i + 1}`);
        }
        
        // Add Tracking headers at the end
        if (isAdmin) {
            headers.push('GCLID', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Term');
        }

        const data = responses.map(r => {
            const row = {
                'Submitted At': new Date(r.createdAt).toLocaleString(),
                'Respondent': r.respondentPhone || r.respondentEmail || 'Anonymous',
                'Verification': r.verificationStatus || 'Not Required',
                'Payment Status': r.paymentStatus || 'Not Required',
                'Stage': r.stage || '-'
            };

            uniqueHeaders.forEach(header => {
                row[header] = getMergedAnswer(r, header, form.questions);
            });

            // Populate dynamic Remark/Disp data
            for (let i = 0; i < maxRemarks; i++) {
                const rem = r.remarks?.[i];
                row[`Remark ${i + 1}`] = rem ? (rem.adminName ? `${rem.text} (By: ${rem.adminName})` : rem.text) : '-';
                row[`Disposition ${i + 1}`] = rem ? rem.disposition : '-';
            }
            
            if (isAdmin) {
                row['GCLID'] = r.trackingData?.gclid || '-';
                row['UTM Source'] = r.trackingData?.utm_source || '-';
                row['UTM Medium'] = r.trackingData?.utm_medium || '-';
                row['UTM Campaign'] = r.trackingData?.utm_campaign || '-';
                row['UTM Term'] = r.trackingData?.utm_term || '-';
            }
            
            return row;
        });

        const ws = XLSX.utils.json_to_sheet(data, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Responses");
        XLSX.writeFile(wb, `${form.title}_responses.xlsx`);
    };

    if (loading) return <div className="p-10 text-center">Loading responses...</div>;

    // Filter & Search Logic
    const filteredResponses = responses.filter(r => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = !query || 
            String(r.respondentPhone || '').toLowerCase().includes(query) ||
            String(r.respondentEmail || '').toLowerCase().includes(query) ||
            (r.answers && r.answers.some(a => String(a.answer || '').toLowerCase().includes(query))) ||
            (r.remarks && r.remarks.some(rem => 
                String(rem.text || '').toLowerCase().includes(query) || 
                String(rem.disposition || '').toLowerCase().includes(query)
            ));

        const latestRemark = r.remarks && r.remarks.length > 0 ? r.remarks[r.remarks.length - 1] : null;
        const matchesStage = !filterStage || (latestRemark && latestRemark.stage === filterStage);
        const matchesDisposition = !filterDisposition || (latestRemark && latestRemark.disposition === filterDisposition);
        const matchesVerification = !filterVerification || r.verificationStatus === filterVerification;
        const matchesPayment = !filterPayment || r.paymentStatus === filterPayment;

        return matchesSearch && matchesStage && matchesDisposition && matchesVerification && matchesPayment;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredResponses.length / rowsPerPage);
    const paginatedResponses = filteredResponses.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="space-y-6 pb-20">
            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/forms" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{form?.title}</h1>
                        <p className="text-gray-500 text-sm">
                            {filteredResponses.length} {filteredResponses.length !== responses.length ? `(filtered from ${responses.length})` : ''} responses found
                        </p>
                    </div>
                </div>

                {/* Action Buttons (Upper Row) */}
                <div className="flex flex-wrap items-center gap-3 pl-14">
                    {isAdmin && (
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm font-medium"
                            disabled={responses.length === 0}
                        >
                            <Download size={18} /> Export Excel
                        </button>
                    )}

                    {isAdmin && (
                        <button
                            onClick={() => setIsMapModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium"
                        >
                            <Settings2 size={18} /> Map Old Data
                        </button>
                    )}

                    {/* Column Manager */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowColMenu(!showColMenu)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm font-medium"
                        >
                            <Settings2 size={18} />
                            <span>Show/Hide Columns</span>
                            <ChevronDown size={16} className={`transition-transform ${showColMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showColMenu && (
                            <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-[110] p-3 max-h-[80vh] overflow-y-auto">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-3 px-2">Manage Visibility</div>
                                <div className="space-y-1">
                                    {[
                                        { id: 'submitted', label: 'Submitted At' },
                                        { id: 'mobile', label: 'Mobile Number' },
                                        { id: 'verify', label: 'Verification Status' },
                                        { id: 'payment', label: 'Payment Status' },
                                        ...getUniqueHeaders(form?.questions).map(h => ({ id: `q-${h}`, label: h })),
                                        ...(() => {
                                            const remCols = [];
                                            for(let i=0; i<maxRemarks; i++) {
                                                remCols.push({ id: `rem-${i}`, label: `Remark ${i+1}` });
                                                remCols.push({ id: `disp-${i}`, label: `Disposition ${i+1}` });
                                            }
                                            return remCols;
                                        })(),
                                        ...(isAdmin ? [
                                            { id: 'gclid', label: 'GCLID - Google Click ID' },
                                            { id: 'source', label: 'UTM Source' },
                                            { id: 'medium', label: 'UTM Medium' },
                                            { id: 'campaign', label: 'UTM Campaign' }
                                        ] : [])
                                    ].map(col => (
                                        <label key={col.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors text-sm text-slate-700">
                                            <input 
                                                type="checkbox" 
                                                checked={isVisible(col.id)}
                                                onChange={() => toggleColumn(col.id)}
                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className={isVisible(col.id) ? '' : 'text-slate-400'}>{col.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search & Filters (Lower Row) */}
                <div className="flex items-center gap-2 flex-wrap pl-14">
                    <input
                        type="text"
                        placeholder="Search name, phone, etc..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-56 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                    />
                    <select
                        value={filterStage}
                        onChange={(e) => setFilterStage(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                    >
                        <option value="">All Stages</option>
                        <option value="Hot">Hot</option>
                        <option value="Warm">Warm</option>
                        <option value="Cold">Cold</option>
                        <option value="Frozen">Frozen</option>
                    </select>
                    <select
                        value={filterDisposition}
                        onChange={(e) => setFilterDisposition(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white max-w-[200px]"
                    >
                        <option value="">All Dispositions</option>
                        {DISPOSITIONS.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <select
                        value={filterVerification}
                        onChange={(e) => setFilterVerification(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                    >
                        <option value="">All Verification</option>
                        <option value="Verified">Verified</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <select
                        value={filterPayment}
                        onChange={(e) => setFilterPayment(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                    >
                        <option value="">All Payment</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>
            </div>

            {responses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200">
                    <p className="text-gray-500 text-lg">No responses yet.</p>
                </div>
            ) : filteredResponses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200">
                    <p className="text-gray-500 text-lg">No matches found for your search/filter.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden w-full">
                    <div className="overflow-hidden w-full">
                        <table className="min-w-full text-left text-sm text-gray-600 bg-white">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                                <tr>
                                    {isVisible('submitted') && <th className="px-6 py-4 min-w-[150px]">Submitted At</th>}
                                    {isVisible('mobile') && <th className="px-6 py-4 min-w-[150px]">Mobile Number</th>}
                                    {isVisible('verify') && <th className="px-6 py-4 min-w-[120px]">Verification</th>}
                                    {isVisible('payment') && <th className="px-6 py-4 min-w-[120px]">Payment</th>}
                                    {/* Merged Headers: Display unique question texts only */}
                                    {getUniqueHeaders(form?.questions).map((header, idx) => (
                                        isVisible(`q-${header}`) && <th key={idx} className="px-6 py-4 min-w-[200px]">{header}</th>
                                    ))}
                                    
                                    {/* Dynamic Remark/Disp Columns */}
                                    {[...Array(maxRemarks)].map((_, i) => (
                                        isVisible(`rem-${i}`) && (
                                            <React.Fragment key={i}>
                                                <th className="px-6 py-4 min-w-[120px] bg-slate-50 border-x border-slate-200">Stage {i + 1}</th>
                                                <th className="px-6 py-4 min-w-[150px] bg-slate-50 border-x border-slate-200">Disposition {i + 1}</th>
                                                <th className="px-6 py-4 min-w-[200px] bg-slate-50 border-x border-slate-200">Remark {i + 1}</th>
                                            </React.Fragment>
                                        )
                                    ))}

                                    {isSubAdmin && <th className="px-6 py-4 min-w-[100px]">Actions</th>}

                                    {isAdmin && (
                                        <>
                                            {isVisible('gclid') && <th className="px-6 py-4 min-w-[120px]">GCLID</th>}
                                            {isVisible('source') && <th className="px-6 py-4 min-w-[120px]">Source</th>}
                                            {isVisible('medium') && <th className="px-6 py-4 min-w-[120px]">Medium</th>}
                                            {isVisible('campaign') && <th className="px-6 py-4 min-w-[120px]">Campaign</th>}
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedResponses.map((r, idx) => (
                                    <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                                        {isVisible('submitted') && <td className="px-6 py-4 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td>}
                                        {isVisible('mobile') && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {r.respondentPhone ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-700">{r.respondentPhone}</span>
                                                        {r.respondentEmail && <span className="text-xs text-slate-400">{r.respondentEmail}</span>}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-500 italic">Anonymous</span>
                                                )}
                                            </td>
                                        )}
                                        {isVisible('verify') && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {r.verificationStatus === 'Verified' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                                        Verified
                                                    </span>
                                                ) : r.verificationStatus === 'Pending' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                                                        Unverified
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">-</span>
                                                )}
                                            </td>
                                        )}
                                        {isVisible('payment') && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {r.paymentStatus === 'Paid' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                        Paid
                                                    </span>
                                                ) : r.paymentStatus === 'Pending' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                                        Pending
                                                    </span>
                                                ) : r.paymentStatus === 'Failed' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                                        Failed
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">-</span>
                                                )}
                                            </td>
                                        )}
                                        {/* Merged Cells */}
                                        {getUniqueHeaders(form?.questions).map((header, hIdx) => {
                                            const ans = getMergedAnswer(r, header, form?.questions);
                                            return isVisible(`q-${header}`) && (
                                                <td key={hIdx} className="px-6 py-4 truncate max-w-xs" title={String(ans)}>
                                                    {ans && String(ans).startsWith('http') && (String(ans).includes('cloudinary') || String(ans).includes('amazonaws.com')) ? (
                                                        <a
                                                            href={ans}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-cyan-600 hover:text-cyan-800 hover:underline flex items-center gap-1 font-medium"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                            View File
                                                        </a>
                                                    ) : (
                                                        ans
                                                    )}
                                                </td>
                                            );
                                        })}

                                        {/* Dynamic Remark/Disp Cells */}
                                        {[...Array(maxRemarks)].map((_, i) => {
                                            const rem = r.remarks?.[i];
                                            return isVisible(`rem-${i}`) && (
                                                <React.Fragment key={i}>
                                                    <td className="px-6 py-4 border-x border-slate-100">
                                                        {rem && rem.stage ? (
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                                rem.stage === 'Hot' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                                rem.stage === 'Warm' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                                rem.stage === 'Cold' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                                'bg-cyan-100 text-cyan-700 border border-cyan-200'
                                                            }`}>
                                                                {rem.stage}
                                                            </span>
                                                        ) : <span className="text-slate-300">-</span>}
                                                    </td>
                                                    <td className="px-6 py-4 border-x border-slate-100 uppercase">
                                                        {rem ? (
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getDispositionColor(rem.disposition)}`}>
                                                                {rem.disposition || 'General'}
                                                            </span>
                                                        ) : <span className="text-slate-300">-</span>}
                                                    </td>
                                                    <td className="px-6 py-4 border-x border-slate-100">
                                                        {rem ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-slate-800 font-medium">{rem.text}</span>
                                                                <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                                    <Clock size={10} /> {new Date(rem.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                                </span>
                                                            </div>
                                                        ) : <span className="text-slate-300">-</span>}
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}

                                        {isSubAdmin && (
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => handleAddRemarkClick(r)}
                                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center gap-1 whitespace-nowrap"
                                                    title="Add Remark"
                                                >
                                                    <Plus size={16} /> 
                                                    <span className="text-xs font-bold">Add Remark</span>
                                                </button>
                                            </td>
                                        )}

                                        {isAdmin && (
                                            <>
                                                {isVisible('gclid') && <td className="px-6 py-4 whitespace-nowrap text-cyan-600 font-medium">{r.trackingData?.gclid || '-'}</td>}
                                                {isVisible('source') && <td className="px-6 py-4 whitespace-nowrap text-xs">{r.trackingData?.utm_source || '-'}</td>}
                                                {isVisible('medium') && <td className="px-6 py-4 whitespace-nowrap text-xs">{r.trackingData?.utm_medium || '-'}</td>}
                                                {isVisible('campaign') && <td className="px-6 py-4 whitespace-nowrap text-xs truncate max-w-[150px]" title={r.trackingData?.utm_campaign}>{r.trackingData?.utm_campaign || '-'}</td>}
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            {filteredResponses.length > 0 && totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-sm text-gray-500 font-medium">
                        Showing <span className="font-bold text-gray-700">{paginatedResponses.length}</span> out of <span className="font-bold text-gray-700">{filteredResponses.length}</span> responses
                    </span>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                        >
                            Previous
                        </button>
                        
                        <div className="flex items-center justify-center min-w-[3rem] text-sm font-bold text-gray-700">
                            {currentPage} / {totalPages}
                        </div>
                        
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            
            {/* Remark Modal */}
            {isRemarkModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <MessageSquarePlus size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Add Remark</h3>
                                <p className="text-sm text-slate-500">Update status for {selectedResponse?.respondentPhone || 'this entry'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Stage <span className="text-red-500">*</span></label>
                                    <select 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        value={newRemark.stage}
                                        onChange={(e) => setNewRemark({ ...newRemark, stage: e.target.value })}
                                    >
                                        <option value="">Select Stage</option>
                                        <option value="Hot">Hot</option>
                                        <option value="Warm">Warm</option>
                                        <option value="Cold">Cold</option>
                                        <option value="Frozen">Frozen</option>
                                    </select>
                                </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Disposition <span className="text-red-500">*</span></label>
                                <select 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    value={newRemark.disposition}
                                    onChange={(e) => setNewRemark({ ...newRemark, disposition: e.target.value })}
                                >
                                    <option value="">Select Status (Disposition)</option>
                                    {DISPOSITIONS.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Remark Note</label>
                                <textarea 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm h-24"
                                    placeholder="Type your notes here..."
                                    value={newRemark.text}
                                    onChange={(e) => setNewRemark({ ...newRemark, text: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button 
                                onClick={() => setIsRemarkModalOpen(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddRemark}
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    'Save Remark'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Map Data Modal */}
            {isMapModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Settings2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Map Old Data</h3>
                                <p className="text-sm text-slate-500">Sync older responses to Lead fields</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Target Field (Lead) <span className="text-red-500">*</span></label>
                                <select 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                    value={mapTargetField}
                                    onChange={(e) => setMapTargetField(e.target.value)}
                                >
                                    <option value="studentName">Student Name</option>
                                    <option value="mobileNumber">Mobile Number</option>
                                    <option value="email">Email</option>
                                    <option value="class">Class</option>
                                    <option value="course">Course</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Source Question (From Form) <span className="text-red-500">*</span></label>
                                <select 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                    value={mapSourceQuestionId}
                                    onChange={(e) => setMapSourceQuestionId(e.target.value)}
                                >
                                    <option value="">Select Question</option>
                                    {form?.questions?.filter(q => q.type !== 'file_upload').map(q => (
                                        <option key={q.id} value={q.id}>{q.questionText}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button 
                                onClick={() => { setIsMapModalOpen(false); setSyncProgress(null); }}
                                disabled={isMapping}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMapData}
                                disabled={isMapping || !mapSourceQuestionId}
                                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isMapping ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>
                                            {syncProgress ? `Syncing ${syncProgress.current}/${syncProgress.total}` : 'Syncing...'}
                                        </span>
                                    </>
                                ) : (
                                    'Sync Data'
                                )}
                            </button>
                        </div>
                        
                        {isMapping && syncProgress && (
                            <div className="mt-4">
                                <div className="w-full bg-slate-100 rounded-full h-2 mb-1 overflow-hidden">
                                    <div 
                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out" 
                                        style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-center text-slate-500 font-medium">{Math.round((syncProgress.current / syncProgress.total) * 100)}% Complete</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
