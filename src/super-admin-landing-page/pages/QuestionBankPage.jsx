import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestionBank } from "../api/testSystemApi";
import { Search, Filter, LayoutGrid, List, BookOpen, Plus, ChevronRight, ArrowLeft, Trash2, Calendar, FileText, Edit2 } from "lucide-react";
import { deleteQuestionBankPaper } from "../api/testSystemApi";
import toast from "react-hot-toast";
import 'katex/dist/katex.min.css';

export default function QuestionBankPage() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPaper, setSelectedPaper] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const data = await getQuestionBank();
            if (data.success) {
                setQuestions(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch questions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePaper = async (paperName, e) => {
        e.stopPropagation();
        const pin = prompt(`To delete paper "${paperName}", please enter the MASTER PIN:`);
        if (!pin) return;

        try {
            const data = await deleteQuestionBankPaper(paperName, pin);
            if (data.success) {
                toast.success(data.message);
                fetchQuestions();
                if (selectedPaper === paperName) setSelectedPaper(null);
            } else {
                toast.error(data.message || "Failed to delete paper");
            }
        } catch (error) {
            console.error("Delete failed", error);
            toast.error(error.response?.data?.message || "Invalid PIN or Server Error");
        }
    };

    const handleEditPaper = (paper, e) => {
        e.stopPropagation();
        // Redirect to paper generator with current paper questions
        navigate("/admin/paper-generator", { 
            state: { 
                questions: paper.questions,
                paperName: paper.name
            } 
        });
    };

    // Group questions by Paper Name
    const papers = questions.reduce((acc, q) => {
        const pName = q.paperName || "Untitled Paper";
        if (!acc[pName]) {
            acc[pName] = {
                name: pName,
                count: 0,
                subjects: new Set(),
                lastAdded: q.createdAt,
                questions: []
            };
        }
        acc[pName].count++;
        acc[pName].questions.push(q);
        if (q.subject_en) acc[pName].subjects.add(q.subject_en);
        if (new Date(q.createdAt) > new Date(acc[pName].lastAdded)) {
            acc[pName].lastAdded = q.createdAt;
        }
        return acc;
    }, {});

    const paperList = Object.values(papers).sort((a, b) => new Date(b.lastAdded) - new Date(a.lastAdded));

    const sortedQuestions = selectedPaper 
        ? papers[selectedPaper].questions
            .filter(q => 
                (q.question_en?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (q.topic_en?.toLowerCase() || "").includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const aNum = parseInt((a.qid || "0").replace(/\D/g, ""), 10);
                const bNum = parseInt((b.qid || "0").replace(/\D/g, ""), 10);
                return aNum - bNum;
            })
        : [];

    const questionsBySubject = sortedQuestions.reduce((acc, q) => {
        const subj = q.subject_en || "General";
        if (!acc[subj]) acc[subj] = [];
        acc[subj].push(q);
        return acc;
    }, {});

    const filteredPapers = paperList.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
                
                .font-hindi {
                    font-family: 'Noto Sans Devanagari', sans-serif;
                }
                .math-inline {
                    display: inline-block;
                    margin: 0 2px;
                    vertical-align: middle;
                }
                `}
            </style>

            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {selectedPaper && (
                        <button 
                            onClick={() => { setSelectedPaper(null); setSearchTerm(""); }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {selectedPaper ? selectedPaper : "Question Bank"}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {selectedPaper 
                                ? `Showing ${sortedQuestions.length} questions from this paper.` 
                                : "View and manage questions grouped by generated papers."}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate("/admin/paper-generator")}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
                    >
                        <Plus size={20} /> Create New Paper
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={selectedPaper ? "Search questions in this paper..." : "Search papers by name..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-600 font-medium">
                        <Filter size={16} /> Filters
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-500">Loading your question bank...</p>
                </div>
            ) : questions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">No questions found</h3>
                    <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                        Your question bank is empty. Generate some papers and upload them to see them here.
                    </p>
                </div>
            ) : !selectedPaper ? (
                /* Paper Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPapers.map((paper, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedPaper(paper.name)}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                            
                            <div className="relative z-10">
                                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl inline-block mb-4">
                                    <FileText size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{paper.name}</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <BookOpen size={16} />
                                        <span>{paper.count} Questions</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={16} />
                                        <span>Added {new Date(paper.lastAdded).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {Array.from(paper.subjects).slice(0, 3).map((sub, i) => (
                                            <span key={i} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                                {sub}
                                            </span>
                                        ))}
                                        {paper.subjects.size > 3 && <span className="text-[10px] text-gray-400">+{paper.subjects.size - 3} more</span>}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        View Questions <ChevronRight size={16} />
                                    </span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => handleEditPaper(paper, e)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            title="Edit in Paper Generator"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDeletePaper(paper.name, e)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Paper Bank"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Question List (Detailed View) */
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
                    {Object.entries(questionsBySubject).map(([subject, qs]) => (
                        <div key={subject} className="space-y-6">
                            {/* Centered Subject Header */}
                            <div className="text-center relative pt-4">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-gray-50 px-6 text-xl font-black text-gray-900 uppercase tracking-[0.2em]">{subject}</span>
                                </div>
                            </div>
                            
                            {qs.map((q, idx) => (
                                <div key={q._id || idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-2 items-center flex-wrap">
                                            {q.topic_en && q.topic_en.trim() !== '' && (
                                                <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1.5 rounded-lg border border-gray-200 font-bold uppercase tracking-wider">
                                                    {q.topic_en}
                                                </span>
                                            )}
                                            {q.difficulty && (
                                                <span className={`text-xs px-3 py-1.5 rounded-lg font-bold border ${
                                                    q.difficulty === 'Hard' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    q.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                    'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                    {q.difficulty}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">#{q.qid}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* English Version */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">English Version</h4>
                                            </div>
                                            <div className="text-gray-900 text-base leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: q.question_en || '<span class="text-gray-400 italic">No question provided</span>' }} />
                                            {q.image_en && (
                                                <div className="my-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 inline-block shadow-inner">
                                                    <img src={q.image_en} alt="Question English" className="max-h-48 rounded-lg object-contain" />
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                                {['A', 'B', 'C', 'D'].map(opt => (
                                                    <div key={opt} className={`p-3 rounded-xl text-sm border flex items-start gap-3 transition-colors ${q.answer === opt ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-100 bg-gray-50 text-gray-600'}`}>
                                                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${q.answer === opt ? 'bg-green-500 text-white shadow-sm' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                                            {opt}
                                                        </span> 
                                                        <span className="mt-0.5" dangerouslySetInnerHTML={{ __html: q.options?.[opt]?.en || '' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Hindi Version */}
                                        <div className="space-y-4 pl-0 lg:pl-8 lg:border-l border-gray-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Hindi Version</h4>
                                            </div>
                                            <div className="text-gray-900 text-base leading-relaxed font-hindi" dangerouslySetInnerHTML={{ __html: q.question_hi || '<span class="text-gray-400 italic">No question provided</span>' }} />
                                            {q.image_hi && (
                                                <div className="my-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 inline-block shadow-inner">
                                                    <img src={q.image_hi} alt="Question Hindi" className="max-h-48 rounded-lg object-contain" />
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                                {['A', 'B', 'C', 'D'].map(opt => (
                                                    <div key={opt} className={`p-3 rounded-xl text-sm border font-hindi flex items-start gap-3 transition-colors ${q.answer === opt ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-100 bg-gray-50 text-gray-600'}`}>
                                                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] font-sans ${q.answer === opt ? 'bg-green-500 text-white shadow-sm' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                                            {opt}
                                                        </span> 
                                                        <span className="mt-0.5" dangerouslySetInnerHTML={{ __html: q.options?.[opt]?.hi || '' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
