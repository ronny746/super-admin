import { useState, useRef, useEffect } from "react";
import { read, utils } from 'xlsx';
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, Download, Trash2, Edit, Save, X, Plus, FileSpreadsheet, Eye, ChevronUp, Layout } from "lucide-react";
import toast from "react-hot-toast";
import Papa from "papaparse";
import { importQuestions, getQuestions, getQuestionPapers, deleteQuestionPaper, deleteQuestion, updateQuestion, previewPdfQuestions, previewWordQuestions, updatePaperDetails } from "../api/testSystemApi";
import { useAppContext } from "../context/AppContext";
import QuestionEditor from "./QuestionEditor";
import ConfirmDialog from "../components/ConfirmDialog";
import PaperPreviewModal from "../components/PaperPreviewModal";
import Modal from "../components/Modal";
import React from "react";

const SUBJECTS = [
    { id: "physics", name: "Physics", color: "blue", gradient: "from-blue-500 to-indigo-600" },
    { id: "chemistry", name: "Chemistry", color: "yellow", gradient: "from-yellow-400 to-orange-500" },
    { id: "biology", name: "Biology", color: "green", gradient: "from-green-500 to-emerald-600" },
    { id: "mathematics", name: "Mathematics", color: "red", gradient: "from-red-500 to-rose-600" },
    { id: "mat", name: "MAT", color: "purple", gradient: "from-purple-500 to-pink-600" },
    { id: "general", name: "General", color: "slate", gradient: "from-slate-500 to-slate-700" }
];

const SUBJECT_ORDER = { physics: 0, chemistry: 1, biology: 2, mathematics: 3, mat: 4, general: 5, unknown: 6 };

export default function QuestionImportPage() {
    const [activeTab, setActiveTab] = useState('physics');
    const [language, setLanguage] = useState('english');

    // Single paper details
    const [paperDetails, setPaperDetails] = useState({
        id: "",
        title: "",
        className: "",
        paperSet: ""
    });

    // Draft questions (not yet saved to DB)
    const [draftQuestions, setDraftQuestions] = useState([]);
    const [isDraft, setIsDraft] = useState(false);
    const [saving, setSaving] = useState(false);

    // Per-subject file info
    const [subjectFiles, setSubjectFiles] = useState({
        physics: { file: null, parsing: false, questionCount: 0 },
        chemistry: { file: null, parsing: false, questionCount: 0 },
        mathematics: { file: null, parsing: false, questionCount: 0 },
        biology: { file: null, parsing: false, questionCount: 0 },
        mat: { file: null, parsing: false, questionCount: 0 },
        general: { file: null, parsing: false, questionCount: 0 }
    });

    const [questionPapers, setQuestionPapers] = useState([]);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
        type: "warning"
    });

    const [selectedIds, setSelectedIds] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isFabOpen, setIsFabOpen] = useState(false);
    const [lastPdfPage, setLastPdfPage] = useState(1);

    const questionsRef = useRef(null);
    const { user } = useAppContext();
    const instituteId = user?.instituteId || user?._id;

    useEffect(() => {
        if (instituteId) {
            fetchQuestionPapers();
        }
    }, [instituteId]);

    const fetchQuestionPapers = async () => {
        try {
            const response = await getQuestionPapers(instituteId);
            setQuestionPapers(response.data);
        } catch (error) {
            console.error("Error fetching question papers:", error);
        }
    };

    const handleDeletePaper = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: "Delete Question Paper",
            message: "Are you sure you want to delete this paper? All questions in it will be permanently deleted.",
            type: "danger",
            onConfirm: async () => {
                try {
                    await deleteQuestionPaper(id);
                    fetchQuestionPapers();
                    setDraftQuestions([]);
                    setIsDraft(false);
                    toast.success("Question paper deleted successfully!");
                } catch (error) {
                    toast.error("Error deleting paper: " + error.message);
                }
            }
        });
    };

    const downloadSampleExcel = () => {
        const sampleData = language === 'hindi' ? [
            ["question", "questionType", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "level"],
            ["भारत की राजधानी क्या है?", "MCQ", "मुंबई", "दिल्ली", "कोलकाता", "चेन्नई", "B", "Easy"],
            ["सबसे बड़ा ग्रह कौन सा है?", "MCQ", "पृथ्वी", "मंगल", "बृहस्पति", "शनि", "C", "Medium"],
            ["इनमें से अभाज्य (prime) संख्याएँ कौन सी हैं?", "MSQ", "2", "4", "5", "9", "A,C", "Medium"],
            ["मुझे जटिल समस्याओं को सुलझाना पसंद है।", "MSQ", "पूर्णतः सहमत", "सहमत", "असहमत", "पूर्णतः असहमत", "", "Easy"],
        ] : [
            ["question", "questionType", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "level"],
            ["What is the capital of India?", "MCQ", "Mumbai", "Delhi", "Kolkata", "Chennai", "B", "Easy"],
            ["Which is the largest planet?", "MCQ", "Earth", "Mars", "Jupiter", "Saturn", "C", "Medium"],
            ["Which are prime numbers?", "MSQ", "2", "4", "5", "9", "A,C", "Medium"],
            ["I like to solve complex problems.", "MSQ", "Strongly Agree", "Agree", "Disagree", "Strongly Disagree", "", "Easy"],
        ];

        const csvContent = Papa.unparse(sampleData);
        // Ensure hindi characters are encoded properly by adding BOM
        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "sample-questions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadSampleWord = () => {
        const link = document.createElement("a");
        link.href = "/sample-questions-template.docx";
        link.download = "sample-questions-template.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (e, subject) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = [
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "text/csv",
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ];
            if (!validTypes.includes(selectedFile.type) &&
                !selectedFile.name.endsWith('.csv') &&
                !selectedFile.name.endsWith('.xlsx') &&
                !selectedFile.name.endsWith('.pdf') &&
                !selectedFile.name.endsWith('.docx') &&
                !selectedFile.name.endsWith('.xls')) {
                toast.error("Please select a valid Excel, CSV, PDF, or Word (.docx) file");
                return;
            }
            setSubjectFiles(prev => ({
                ...prev,
                [subject]: { ...prev[subject], file: selectedFile }
            }));
        }
    };

    const parseFile = async (file, subject) => {
        if (file.name.endsWith('.pdf')) {
            await parsePDF(file, subject);
        } else if (file.name.endsWith('.docx')) {
            await parseWord(file, subject);
        } else {
            await parseCSV(file, subject);
        }
    };

    const parseWord = async (file, subject) => {
        if (!file) {
            toast.error("Please select a file first.");
            return;
        }
        if (!paperDetails.title || !paperDetails.className || !paperDetails.paperSet) {
            toast.error("Please fill in Paper Title, Class, and Set first.");
            return;
        }

        setSubjectFiles(prev => ({
            ...prev,
            [subject]: { ...prev[subject], parsing: true }
        }));

        try {
            const response = await previewWordQuestions(file, subject);

            if (!response.questions || response.questions.length === 0) {
                toast.error("No questions found in the Word document.");
                setSubjectFiles(prev => ({
                    ...prev,
                    [subject]: { ...prev[subject], parsing: false }
                }));
                return;
            }

            const validQuestions = response.questions.map((q, index) => ({
                ...q,
                id: `draft-${subject}-${Date.now()}-${index}`,
                subjectId: subject,
                subjectName: SUBJECTS.find(s => s.id === subject)?.name,
                subjectColor: SUBJECTS.find(s => s.id === subject)?.color,
                subjectGradient: SUBJECTS.find(s => s.id === subject)?.gradient,
                sr: q.sr || index + 1
            }));

            // Add to draft questions
            setDraftQuestions(prev => {
                const filtered = prev.filter(q => q.subjectId !== subject);
                return [...filtered, ...validQuestions].sort((a, b) => {
                    const subjectOrder = SUBJECT_ORDER;
                    if (subjectOrder[a.subjectId] !== subjectOrder[b.subjectId]) {
                        return (subjectOrder[a.subjectId] ?? 99) - (subjectOrder[b.subjectId] ?? 99);
                    }
                    return a.sr - b.sr;
                });
            });

            setIsDraft(true);
            setSubjectFiles(prev => ({
                ...prev,
                [subject]: { file, parsing: false, questionCount: validQuestions.length }
            }));

            toast.success(`${validQuestions.length} questions loaded from Word!`);

            // Scroll to questions
            setTimeout(() => {
                if (questionsRef.current) {
                    questionsRef.current.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);

        } catch (error) {
            console.error("Word parse error:", error);
            toast.error("Word parse error: " + (error.response?.data?.message || error.message));
            setSubjectFiles(prev => ({
                ...prev,
                [subject]: { ...prev[subject], parsing: false }
            }));
        }
    };

    const parsePDF = async (file, subject) => {
        if (!file) {
            toast.error("Please select a file first.");
            return;
        }
        if (!paperDetails.title || !paperDetails.className || !paperDetails.paperSet) {
            toast.error("Please fill in Paper Title, Class, and Set first.");
            return;
        }

        setSubjectFiles(prev => ({
            ...prev,
            [subject]: { ...prev[subject], parsing: true }
        }));

        try {
            const response = await previewPdfQuestions(file, subject);

            if (!response.questions || response.questions.length === 0) {
                toast.error("No questions found in the PDF.");
                setSubjectFiles(prev => ({
                    ...prev,
                    [subject]: { ...prev[subject], parsing: false }
                }));
                return;
            }

            const validQuestions = response.questions.map((q, index) => ({
                ...q,
                id: `draft-${subject}-${Date.now()}-${index}`,
                subjectId: subject,
                subjectName: SUBJECTS.find(s => s.id === subject)?.name,
                subjectColor: SUBJECTS.find(s => s.id === subject)?.color,
                subjectGradient: SUBJECTS.find(s => s.id === subject)?.gradient,
                sr: q.sr || index + 1
            }));

            // Add to draft questions
            setDraftQuestions(prev => {
                const filtered = prev.filter(q => q.subjectId !== subject);
                return [...filtered, ...validQuestions].sort((a, b) => {
                    const subjectOrder = SUBJECT_ORDER;
                    if (subjectOrder[a.subjectId] !== subjectOrder[b.subjectId]) {
                        return (subjectOrder[a.subjectId] ?? 99) - (subjectOrder[b.subjectId] ?? 99);
                    }
                    return a.sr - b.sr;
                });
            });

            setIsDraft(true);
            setSubjectFiles(prev => ({
                ...prev,
                [subject]: { file, parsing: false, questionCount: validQuestions.length }
            }));

            toast.success(`${validQuestions.length} questions loaded from PDF!`);

            // Scroll to questions
            setTimeout(() => {
                if (questionsRef.current) {
                    questionsRef.current.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);

        } catch (error) {
            console.error("PDF parse error:", error);
            toast.error("PDF parse error: " + (error.response?.data?.message || error.message));
            setSubjectFiles(prev => ({
                ...prev,
                [subject]: { ...prev[subject], parsing: false }
            }));
        }
    };

    const parseCSV = async (file, subject) => {
        if (!file) {
            toast.error("Please select a file first.");
            return;
        }
        if (!paperDetails.title || !paperDetails.className || !paperDetails.paperSet) {
            toast.error("Please fill in Paper Title, Class, and Set first.");
            return;
        }

        setSubjectFiles(prev => ({
            ...prev,
            [subject]: { ...prev[subject], parsing: true }
        }));

        try {
            let questions = [];

            // 1. Check File Type and Parse Accordingly
            if (file.name.endsWith('.csv')) {
                // CSV Parsing (PapaParse)
                const result = await new Promise((resolve, reject) => {
                    Papa.parse(file, {
                        header: true,
                        skipEmptyLines: true,
                        complete: resolve,
                        error: reject
                    });
                });
                questions = result.data;
            } else {
                // Excel Parsing (xlsx)
                const data = await file.arrayBuffer();
                const workbook = read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0]; // Read first sheet
                const worksheet = workbook.Sheets[sheetName];
                questions = utils.sheet_to_json(worksheet, { defval: "" }); // defval ensures empty cells are empty strings
            }

            if (!questions || questions.length === 0) {
                toast.error("No questions found in the file.");
                setSubjectFiles(prev => ({
                    ...prev,
                    [subject]: { ...prev[subject], parsing: false }
                }));
                return;
            }

            // 2. Validate and Transform (Common Logic)
            const validQuestions = [];
            const errors = [];

            // Normalize headers
            const normalizedQuestions = questions.map(q => {
                const newQ = {};
                Object.keys(q).forEach(key => {
                    const normKey = key.trim().toLowerCase();
                    // Map common variations
                    if (normKey === 'question' || normKey === 'question text' || normKey === 'question_text') newQ.question = q[key];
                    else if (normKey === 'optiona' || normKey === 'option a' || normKey === 'option_a' || normKey === 'a') newQ.optionA = q[key];
                    else if (normKey === 'optionb' || normKey === 'option b' || normKey === 'option_b' || normKey === 'b') newQ.optionB = q[key];
                    else if (normKey === 'optionc' || normKey === 'option c' || normKey === 'option_c' || normKey === 'c') newQ.optionC = q[key];
                    else if (normKey === 'optiond' || normKey === 'option d' || normKey === 'option_d' || normKey === 'd') newQ.optionD = q[key];
                    else if (normKey === 'correctanswer' || normKey === 'correct answer' || normKey === 'correct_answer' || normKey === 'answer' || normKey === 'ans') newQ.correctAnswer = q[key];
                    else if (normKey === 'questiontype' || normKey === 'question type') newQ.questionType = q[key];
                    else if (normKey === 'level' || normKey === 'difficulty' || normKey === 'difficulty_level') newQ.level = q[key];
                    else newQ[key] = q[key]; // Keep original if no match
                });
                return newQ;
            });

            console.log("Parsed Data (First 3):", normalizedQuestions.slice(0, 3));

            // Check if we found ANY valid columns
            if (normalizedQuestions.length > 0) {
                const firstRow = normalizedQuestions[0];
                const missingCols = [];
                if (!('question' in firstRow)) missingCols.push('question');
                if (!('optionA' in firstRow)) missingCols.push('optionA');

                if (missingCols.length > 0) {
                    const foundCols = Object.keys(firstRow).join(", ");
                    toast.error(`Missing columns: ${missingCols.join(", ")}.\nFound: ${foundCols}`);
                    setSubjectFiles(prev => ({
                        ...prev,
                        [subject]: { ...prev[subject], parsing: false }
                    }));
                    return;
                }
            }

            normalizedQuestions.forEach((q, index) => {
                const rowNum = index + 2; // +2 for header and 0-index

                // Silently skip completely empty rows or rows without question
                // This handles Excel artifacts where "blank" rows are read as objects with empty strings
                if (!q.question || !q.question.toString().trim()) {
                    // Only flag as error if it has OTHER data but no question
                    if (q.optionA || q.correctAnswer) {
                        errors.push(`Row ${rowNum}: Missing question text`);
                    }
                    return; // Skip this row
                }

                // Validate required fields
                if (!q.optionA || !q.optionB || !q.optionC || !q.optionD) {
                    errors.push(`Row ${rowNum}: Missing one or more options`);
                    return;
                }

                // Validate correct answer (allow blank for no-right-answer psychometric, or comma separated for MSQ)
                const rawAns = (q.correctAnswer || "").toString().replace(/\s/g, "").toUpperCase();
                if (rawAns && !/^[A-D](,[A-D])*$/i.test(rawAns)) {
                    errors.push(`Row ${rowNum}: Invalid correct answer (must be A, B, C, D or A,C etc. or leave blank)`);
                    return;
                }

                // Transform to our format
                const correctAnswerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
                validQuestions.push({
                    id: `draft-${subject}-${Date.now()}-${index}`,
                    question: q.question.toString().trim(),
                    questionImage: "",
                    questionType: (q.questionType || (rawAns.includes(",") ? "MSQ" : "MCQ")).toString().toUpperCase(),
                    level: q.level || "Medium",
                    correctOptionIndex: rawAns.length === 1 ? correctAnswerMap[rawAns] : null,
                    correctAnswer: rawAns || null,
                    options: [
                        { text: q.optionA.toString().trim(), image: null, id: '0' },
                        { text: q.optionB.toString().trim(), image: null, id: '1' },
                        { text: q.optionC.toString().trim(), image: null, id: '2' },
                        { text: q.optionD.toString().trim(), image: null, id: '3' },
                    ],
                    subjectId: subject,
                    subjectName: SUBJECTS.find(s => s.id === subject)?.name,
                    subjectColor: SUBJECTS.find(s => s.id === subject)?.color,
                    subjectGradient: SUBJECTS.find(s => s.id === subject)?.gradient,
                    sr: index + 1
                });
            });

            if (errors.length > 0) {
                console.warn("Import Errors:", errors);
                // Show errors but allow partial import if we have valid questions
                if (validQuestions.length === 0) {
                    toast.error(`Validation failed:\n${errors.slice(0, 5).join('\n')}`);
                } else {
                    toast.error(`Imported with warnings:\n${errors.slice(0, 3).join('\n')}`, { icon: '⚠️' });
                }
            }

            if (validQuestions.length === 0) {
                toast.error("No valid questions found. Please fix the errors and try again.");
                setSubjectFiles(prev => ({
                    ...prev,
                    [subject]: { file: null, parsing: false, questionCount: 0 }
                }));
                return;
            }

            // Add to draft questions
            setDraftQuestions(prev => {
                const filtered = prev.filter(q => q.subjectId !== subject);
                return [...filtered, ...validQuestions].sort((a, b) => {
                    const subjectOrder = SUBJECT_ORDER;
                    if (subjectOrder[a.subjectId] !== subjectOrder[b.subjectId]) {
                        return (subjectOrder[a.subjectId] ?? 99) - (subjectOrder[b.subjectId] ?? 99);
                    }
                    return a.sr - b.sr;
                });
            });

            setIsDraft(true);
            setSubjectFiles(prev => ({
                ...prev,
                [subject]: { file, parsing: false, questionCount: validQuestions.length }
            }));

            toast.success(`${validQuestions.length} ${SUBJECTS.find(s => s.id === subject)?.name} questions loaded!${errors.length > 0 ? ` (${errors.length} skipped)` : ''}`);

            // Scroll to questions
            setTimeout(() => {
                if (questionsRef.current) {
                    questionsRef.current.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);

        } catch (error) {
            console.error("Parse error:", error);
            toast.error("File parse error: " + (error.message || "Unknown error"));
            setSubjectFiles(prev => ({
                ...prev,
                [subject]: { ...prev[subject], parsing: false }
            }));
        }
    };

    const handleSavePaper = async () => {
        if (draftQuestions.length === 0) {
            toast.error("No questions to save. Please import questions first.");
            return;
        }

        if (!instituteId) {
            toast.error("User session invalid. Please refresh the page or re-login.");
            return;
        }

        setSaving(true);
        try {
            // 1. Separate existing (DB) questions from new (draft) questions
            const existingQuestions = draftQuestions.filter(q => !q.id.toString().startsWith('draft-'));
            const newQuestions = draftQuestions.filter(q => q.id.toString().startsWith('draft-'));

            if (newQuestions.length === 0) {
                toast.success("All questions are already saved!");
                setSaving(false);
                return;
            }

            // 2. Sort new questions by subject order then by index to maintain structure
            const subjectOrder = SUBJECT_ORDER;
            newQuestions.sort((a, b) => {
                const subjDiff = (subjectOrder[a.subjectId] ?? 99) - (subjectOrder[b.subjectId] ?? 99);
                if (subjDiff !== 0) return subjDiff;
                return a.sr - b.sr;
            });

            // 3. Determine starting SR (Serial Number)
            // It should follow after the max SR of existing questions
            let maxExistingSr = 0;
            if (existingQuestions.length > 0) {
                maxExistingSr = Math.max(...existingQuestions.map(q => q.sr || 0));
            }
            let currentSr = maxExistingSr + 1;

            // 4. Assign new global SRs to new questions
            // We map newQuestions to a new array with updated SRs
            const questionsWithSr = newQuestions.map(q => ({
                ...q,
                sr: currentSr++
            }));

            // 5. Group by subject for API calls
            const subjectGroups = {};
            questionsWithSr.forEach(q => {
                if (!subjectGroups[q.subjectId]) {
                    subjectGroups[q.subjectId] = [];
                }
                subjectGroups[q.subjectId].push(q);
            });

            let totalSaved = 0;
            for (const [subjectId, questions] of Object.entries(subjectGroups)) {
                const formData = new FormData();
                formData.append("instituteId", instituteId);
                formData.append("paperTitle", paperDetails.title);
                formData.append("className", paperDetails.className);
                formData.append("paperSet", paperDetails.paperSet);
                formData.append("subject", subjectId);
                if (paperDetails.id) formData.append("paperId", paperDetails.id);

                const questionsPayload = questions.map(q => ({
                    sr: q.sr,
                    question: q.question,
                    questionImage: q.questionImage,
                    questionType: q.questionType,
                    level: q.level,
                    subject: subjectId,
                    options: q.options,
                    correctOptionIndex: q.correctOptionIndex,
                    correctAnswer: q.correctAnswer
                }));

                formData.append("questionsJson", JSON.stringify(questionsPayload));

                const response = await importQuestions(formData);
                totalSaved += response.imported || 0;
            }

            await fetchQuestionPapers();
            toast.success(`Successfully saved ${totalSaved} new questions to database!`);

            setDraftQuestions([]);
            setIsDraft(false);
            setSubjectFiles({
                physics: { file: null, parsing: false, questionCount: 0 },
                chemistry: { file: null, parsing: false, questionCount: 0 },
                mathematics: { file: null, parsing: false, questionCount: 0 },
                biology: { file: null, parsing: false, questionCount: 0 },
                mat: { file: null, parsing: false, questionCount: 0 },
                general: { file: null, parsing: false, questionCount: 0 }
            });
            setPaperDetails({ title: "", className: "", paperSet: "" });

        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save questions: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteQuestion = (questionId) => {
        const question = draftQuestions.find(q => q.id === questionId);
        const isRealDbQuestion = question && question._id && !question._id.toString().startsWith('draft-');
        const isDraftQuestion = !isRealDbQuestion;

        setConfirmDialog({
            isOpen: true,
            title: "Delete Question",
            message: isDraftQuestion
                ? "Are you sure you want to remove this draft question?"
                : "Are you sure you want to DELETE this question from the database? This action CANNOT be undone!",
            type: "danger",
            onConfirm: async () => {
                try {
                    const deletedSubject = question.subjectId;
                    const deletedSr = question.sr;

                    if (isRealDbQuestion) {
                        await deleteQuestion(question._id);
                        toast.success("Question deleted!");
                    } else {
                        toast.success("Draft removed!");
                    }

                    // Shift remaining questions down
                    let shiftedDbQuestions = [];
                    setDraftQuestions(prev => {
                        const filtered = prev.filter(q => q.id !== questionId);
                        const updated = filtered.map(q => {
                            if (q.subjectId === deletedSubject && q.sr > deletedSr) {
                                const newSr = q.sr - 1;
                                if (q._id && !q._id.toString().startsWith('draft-')) {
                                    shiftedDbQuestions.push({ _id: q._id, sr: newSr });
                                }
                                return { ...q, sr: newSr };
                            }
                            return q;
                        });
                        return updated;
                    });

                    // Background save shifts
                    if (shiftedDbQuestions.length > 0) {
                        (async () => {
                            for (const q of shiftedDbQuestions) {
                                await updateQuestion(q._id, { sr: q.sr });
                            }
                        })();
                    }
                    
                    if (isRealDbQuestion) await fetchQuestionPapers();

                } catch (error) {
                    console.error("Delete error:", error);
                    toast.error("Failed to delete: " + (error.response?.data?.message || error.message));
                }
            }
        });
    };

    const handleEditQuestion = async (questionId, updatedData) => {
        const targetSr = parseInt(updatedData.sr) || 0;
        const targetSubject = updatedData.subject;
        
        // Find if we need to shift
        const isDuplicate = draftQuestions.some(q => q.subjectId === targetSubject && q.sr === targetSr && q.id !== questionId);
        
        let shiftedDbQuestions = [];

        setDraftQuestions(prev => {
            let updated = prev.map(q => {
                if (q.id === questionId) {
                    const newSubject = SUBJECTS.find(s => s.id === updatedData.subject);
                    return {
                        ...q,
                        ...updatedData,
                        sr: targetSr,
                        subjectId: updatedData.subject,
                        subjectName: newSubject?.name,
                        subjectColor: newSubject?.color,
                        subjectGradient: newSubject?.gradient
                    };
                }
                // Shift if duplicate
                if (isDuplicate && q.subjectId === targetSubject && q.sr >= targetSr && q.id !== questionId) {
                    const newSr = q.sr + 1;
                    // If this is a DB question, keep track to update it later
                    if (q._id && !q._id.toString().startsWith('draft-')) {
                        shiftedDbQuestions.push({ _id: q._id, sr: newSr });
                    }
                    return { ...q, sr: newSr };
                }
                return q;
            });

            // Just sort, do NOT re-number. Respect the manual sr.
            return updated.sort((a, b) => {
                const subjectOrder = SUBJECT_ORDER;
                if (subjectOrder[a.subjectId] !== subjectOrder[b.subjectId]) {
                    return (subjectOrder[a.subjectId] ?? 99) - (subjectOrder[b.subjectId] ?? 99);
                }
                return (a.sr || 0) - (b.sr || 0);
            });
        });

        // Background update shifted DB questions (quietly)
        if (shiftedDbQuestions.length > 0) {
            console.log(`Background shifting ${shiftedDbQuestions.length} questions in DB...`);
            // Run in background without awaiting the whole loop to keep UI responsive
            (async () => {
                try {
                    for (const q of shiftedDbQuestions) {
                        await updateQuestion(q._id, { sr: q.sr });
                    }
                    console.log("Background shifting complete.");
                } catch (err) {
                    console.error("Error in background shifting:", err);
                }
            })();
        }

        // Mark as draft if the edited question has a draft ID
        const question = draftQuestions.find(q => q.id === questionId);
        if (question && question.id.toString().startsWith('draft-')) {
            setIsDraft(true);
        }
    };

    const handleUpdatePaperMetadata = async () => {
        if (!paperDetails.id) {
            toast.error("Please load a paper first to update its details.");
            return;
        }
        if (!paperDetails.title || !paperDetails.className || !paperDetails.paperSet) {
            toast.error("Please fill in all paper details.");
            return;
        }

        setSaving(true);
        try {
            await updatePaperDetails(paperDetails.id, {
                title: paperDetails.title,
                className: paperDetails.className,
                paperSet: paperDetails.paperSet
            });
            toast.success("Paper details updated successfully!");
            await fetchQuestionPapers();
        } catch (error) {
            console.error("Update metadata error:", error);
            toast.error("Failed to update paper details: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    const handleReorderAll = async () => {
        setSaving(true);
        try {
            const updated = [...draftQuestions].sort((a, b) => {
                const subjectOrder = SUBJECT_ORDER;
                if (subjectOrder[a.subjectId] !== subjectOrder[b.subjectId]) {
                    return (subjectOrder[a.subjectId] ?? 99) - (subjectOrder[b.subjectId] ?? 99);
                }
                return (a.sr || 0) - (b.sr || 0);
            });

            // Assign continuous SR based on global order
            const renumbered = updated.map((q, index) => ({
                ...q,
                sr: index + 1
            }));

            // Save to DB in background if needed
            const dbUpdates = renumbered.filter(q => q._id && !q._id.toString().startsWith('draft-'));
            if (dbUpdates.length > 0) {
                toast.loading("Updating " + dbUpdates.length + " questions in database...", { id: 'renumbering' });
                for (const q of dbUpdates) {
                    await updateQuestion(q._id, { sr: q.sr });
                }
                toast.success("Database updated!", { id: 'renumbering' });
            }

            setDraftQuestions(renumbered);
            toast.success(`All ${renumbered.length} questions re-numbered correctly (1 to ${renumbered.length})`);
        } catch (error) {
            console.error("Reorder all error:", error);
            toast.error("Failed to re-number all: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleBulkSubjectChange = async (newSubjectId) => {
        if (selectedIds.length === 0) return;

        const newSubject = SUBJECTS.find(s => s.id === newSubjectId);
        if (!newSubject) return;

        setDraftQuestions(prev => {
            const updated = prev.map(q => {
                if (selectedIds.includes(q.id)) {
                    // If it's a DB question, we'll handle API update later or just mark it as modified
                    return {
                        ...q,
                        subjectId: newSubjectId,
                        subjectName: newSubject.name,
                        subjectColor: newSubject.color,
                        subjectGradient: newSubject.gradient
                    };
                }
                return q;
            });

            return updated.sort((a, b) => {
                const subjectOrder = SUBJECT_ORDER;
                if (subjectOrder[a.subjectId] !== subjectOrder[b.subjectId]) {
                    return (subjectOrder[a.subjectId] ?? 99) - (subjectOrder[b.subjectId] ?? 99);
                }
                return a.sr - b.sr;
            });
        });

        // If any selected questions are from DB, update them in DB too
        const dbQuestions = draftQuestions.filter(q => selectedIds.includes(q.id) && q._id && !q._id.toString().startsWith('draft-'));
        if (dbQuestions.length > 0) {
            try {
                toast.loading(`Updating ${dbQuestions.length} questions...`, { id: 'bulk-update' });
                // Only send the subject update to avoid immutable field errors or validation issues
                await Promise.all(dbQuestions.map(q => updateQuestion(q._id, { subject: newSubjectId })));
                toast.success(`Moved to ${newSubject.name}`, { id: 'bulk-update' });
            } catch (error) {
                console.error("Bulk update error:", error);
                toast.error("Bulk update partially failed. Please check questions.", { id: 'bulk-update' });
            }
        }

        setSelectedIds([]);
        toast.success(`Moved ${selectedIds.length} questions to ${newSubject.name}`);
    };

    const toggleSelection = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAllOfSubject = (subjectId) => {
        const subjectQIds = draftQuestions.filter(q => q.subjectId === subjectId).map(q => q.id);
        setSelectedIds(prev => {
            const others = prev.filter(id => !subjectQIds.includes(id));
            if (subjectQIds.every(id => prev.includes(id))) {
                return others; // Deselect all
            }
            return [...others, ...subjectQIds]; // Select all
        });
    };

    const loadPaperQuestions = async (paper) => {
        setPaperDetails({
            id: paper._id,
            title: paper.title.replace(/ - (Physics|Chemistry|Mathematics|Biology|MAT)$/, ''),
            className: paper.class,
            paperSet: paper.set
        });

        try {
            const response = await getQuestions(instituteId, paper.class, paper.set, paper._id);
            const questionsWithSubject = response.data.map((q, index) => {
                // Use stored subject if available, otherwise fallback to title matching
                let subjectId = q.subject;

                if (!subjectId || !SUBJECTS.find(s => s.id === subjectId)) {
                    const subjectMatch = SUBJECTS.find(s => q.paperTitle?.includes(s.name));
                    subjectId = subjectMatch?.id || 'unknown';
                }

                const subjectInfo = SUBJECTS.find(s => s.id === subjectId);

                return {
                    ...q,
                    id: q._id,
                    subjectId: subjectId,
                    subjectName: subjectInfo?.name || 'Unknown',
                    subjectColor: subjectInfo?.color || 'gray',
                    subjectGradient: subjectInfo?.gradient || 'from-gray-500 to-gray-600'
                };
            });

            setDraftQuestions(questionsWithSubject.sort((a, b) => {
                const subjectOrder = SUBJECT_ORDER;
                if (subjectOrder[a.subjectId] !== subjectOrder[b.subjectId]) {
                    return (subjectOrder[a.subjectId] ?? 99) - (subjectOrder[b.subjectId] ?? 99);
                }
                return a.sr - b.sr;
            }));
            setIsDraft(false); // Loaded from DB, not a draft
        } catch (error) {
            console.error(error);
            toast.error("Failed to load questions");
        }
    };

    const renderQuestionCard = (q, index) => {
        const subjectInfo = SUBJECTS.find(s => s.id === q.subjectId) || SUBJECTS[0];

        return (
            <div key={q.id} className={`border-2 rounded-2xl p-6 transition-all duration-200 ${editingQuestionId === q.id ? 'bg-blue-50 border-blue-300 shadow-lg' : 'bg-white hover:border-gray-300 hover:shadow-md'} ${selectedIds.includes(q.id) ? 'border-blue-500 bg-blue-50/30' : ''}`}>
                {editingQuestionId === q.id ? (
                    <QuestionEditor
                        question={q}
                        subjectId={q.subjectId}
                        pdfFile={subjectFiles[q.subjectId]?.file}
                        lastPdfPage={lastPdfPage}
                        onPdfPageChange={setLastPdfPage}
                        displaySr={index + 1}
                        onSave={(updatedFormData) => {
                            if (updatedFormData) {
                                handleEditQuestion(q.id, updatedFormData);
                            }
                            setEditingQuestionId(null);
                            toast.success("Question updated!");
                        }}
                        onCancel={() => setEditingQuestionId(null)}
                    />
                ) : (
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center justify-start gap-3">
                            <input 
                                type="checkbox"
                                checked={selectedIds.includes(q.id)}
                                onChange={() => toggleSelection(q.id)}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className={`font-mono text-lg font-bold text-white bg-linear-to-br ${subjectInfo.gradient} w-10 h-10 flex items-center justify-center rounded-full shadow-lg`}>
                                {q.sr}
                            </span>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold bg-linear-to-r ${subjectInfo.gradient} text-white`}>
                                            {subjectInfo.name}
                                        </span>
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${q.level === "Hard" ? "bg-red-100 text-red-700 border-2 border-red-200" :
                                            q.level === "Easy" ? "bg-green-100 text-green-700 border-2 border-green-200" :
                                                "bg-yellow-100 text-yellow-700 border-2 border-yellow-200"
                                            }`}>
                                            {q.level || "Medium"}
                                        </span>
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${q.questionType === 'MSQ' ? "bg-purple-100 text-purple-700 border-2 border-purple-200" : "bg-blue-100 text-blue-700 border-2 border-blue-200"}`}>
                                            {q.questionType || "MCQ"}
                                        </span>
                                        {/* Database Status Badge */}
                                        {q._id && !q._id.toString().startsWith('draft-') ? (
                                            <span className="text-xs px-3 py-1 rounded-full font-bold bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-sm flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                IN DB
                                            </span>
                                        ) : (
                                            <span className="text-xs px-3 py-1 rounded-full font-bold bg-linear-to-r from-orange-500 to-yellow-500 text-white shadow-sm animate-pulse">
                                                📝 DRAFT
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-gray-900 text-lg">{q.question}</p>
                                    {q.questionImage && (
                                        <img src={q.questionImage} alt="Q" className="mt-3 h-24 object-contain border-2 rounded-xl shadow-sm" />
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {/* Show "Activate to DB" button only for draft questions */}
                                    {(!q._id || q._id.toString().startsWith('draft-')) && (
                                        <button
                                            onClick={async () => {
                                                if (!isPaperDetailsFilled) {
                                                    toast.error("Please fill in Paper Title, Class, and Set first.");
                                                    return;
                                                }
                                                try {
                                                    const formData = new FormData();
                                                    formData.append("instituteId", instituteId);
                                                    formData.append("paperTitle", paperDetails.title);
                                                    formData.append("className", paperDetails.className);
                                                    formData.append("paperSet", paperDetails.paperSet);
                                                    formData.append("subject", q.subjectId);
                                                    if (paperDetails.id) formData.append("paperId", paperDetails.id);

                                                    const questionsPayload = [{
                                                        sr: q.sr || index + 1,
                                                        question: q.question,
                                                        questionImage: q.questionImage || "",
                                                        questionType: q.questionType,
                                                        level: q.level,
                                                        subject: q.subjectId,
                                                        options: q.options,
                                                        correctOptionIndex: q.correctOptionIndex,
                                                        correctAnswer: q.correctAnswer
                                                    }];

                                                    formData.append("questionsJson", JSON.stringify(questionsPayload));

                                                    await importQuestions(formData);
                                                    toast.success("Question activated and saved to database!");

                                                    // Remove from draft, reload papers
                                                    setDraftQuestions(prev => prev.filter(dq => dq.id !== q.id));
                                                    await fetchQuestionPapers();
                                                } catch (error) {
                                                    console.error("Activate error:", error);
                                                    toast.error("Failed to activate: " + (error.response?.data?.message || error.message));
                                                }
                                            }}
                                            className="text-green-600 hover:bg-green-100 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all border-2 border-green-200 shadow-sm"
                                            title="Save this question to database"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                                <polyline points="7 3 7 8 15 8"></polyline>
                                            </svg>
                                            {language === 'hindi' ? 'DB में सेव करें' : 'Activate to DB'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setEditingQuestionId(q.id)}
                                        className="text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all"
                                    >
                                        <Edit size={16} />
                                        {language === 'hindi' ? 'संपादित करें' : 'Edit'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuestion(q.id)}
                                        className="text-red-500 hover:bg-red-100 p-2 rounded-xl transition-all"
                                        title={q._id && !q._id.toString().startsWith('draft-') ? "Delete from database" : "Remove draft"}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {["MCQ", "MSQ"].includes(q.questionType) ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pl-4 border-l-4 border-gray-200">
                                    {q.options.map((opt, i) => {
                                        const optionChar = String.fromCharCode(65 + i);
                                        const isCorrect = (q.questionType === "MSQ" && q.correctAnswer)
                                            ? q.correctAnswer.split(",").includes(optionChar)
                                            : q.correctOptionIndex === i;

                                        return (
                                            <div
                                                key={i}
                                                className={`text-sm flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${isCorrect
                                                    ? "bg-green-50 border-green-300 text-green-800 font-semibold shadow-sm"
                                                    : "bg-gray-50 border-gray-200 text-gray-700"
                                                    }`}
                                            >
                                                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${isCorrect ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                                                    }`}>
                                                    {String.fromCharCode(65 + i)}
                                                </span>
                                                <div className="flex-1 flex items-center gap-2">
                                                    <span>{opt.text}</span>
                                                    {opt.image && (
                                                        <img src={opt.image} alt={`Option ${String.fromCharCode(65 + i)}`} className="h-10 w-10 object-cover rounded border border-gray-300" />
                                                    )}
                                                </div>
                                                {isCorrect && <CheckCircle size={16} className="text-green-600" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="mt-4 pl-4 border-l-4 border-gray-200">
                                    <div className="bg-green-50 border-2 border-green-300 text-green-800 font-semibold p-3 rounded-xl shadow-sm inline-block min-w-[200px]">
                                        <span className="block text-xs text-green-600 mb-1">Correct Answer:</span>
                                        {q.correctAnswer}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const isPaperDetailsFilled = paperDetails.title && paperDetails.className && paperDetails.paperSet;
    const totalDraftCount = draftQuestions.length;

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Question Import & Management
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {isDraft ? `📝 Draft: ${totalDraftCount} questions ready to save` : 'Set paper details, then import questions'}
                            </p>
                        </div>

                        {(draftQuestions.length > 0) && (
                            <button
                                onClick={() => {
                                    setDraftQuestions([]);
                                    setIsDraft(false);
                                    setPaperDetails({ id: "", title: "", className: "", paperSet: "" });
                                    setSubjectFiles({
                                        physics: { file: null, parsing: false, questionCount: 0 },
                                        chemistry: { file: null, parsing: false, questionCount: 0 },
                                        mathematics: { file: null, parsing: false, questionCount: 0 },
                                        biology: { file: null, parsing: false, questionCount: 0 },
                                        mat: { file: null, parsing: false, questionCount: 0 },
                                        general: { file: null, parsing: false, questionCount: 0 }
                                    });
                                }}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all"
                                title="Close Paper"
                            >
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        )}

                        <div className="flex items-center gap-3">
                            {isDraft && (
                                <button
                                    onClick={handleSavePaper}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-linear-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-bold disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Save Paper to DB
                                        </>
                                    )}
                                </button>
                            )}

                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5 border border-gray-200">
                                <button
                                    onClick={() => setLanguage('english')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${language === 'english' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                                        }`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => setLanguage('hindi')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${language === 'hindi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                                        }`}
                                >
                                    हिंदी
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {language === 'hindi' ? '१. पेपर विवरण' : '1. Paper Details'}
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={downloadSampleExcel}
                                        className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-xl border-2 border-blue-200 hover:bg-blue-50 text-sm font-semibold transition-all"
                                    >
                                        <FileSpreadsheet size={16} />
                                        Sample CSV
                                    </button>
                                    <button
                                        onClick={downloadSampleWord}
                                        className="flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-xl border-2 border-indigo-200 hover:bg-indigo-50 text-sm font-semibold transition-all"
                                    >
                                        <FileText size={16} />
                                        Word Template
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {language === 'hindi' ? 'पेपर शीर्षक' : 'Paper Title'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={paperDetails.title}
                                            onChange={(e) => setPaperDetails({ ...paperDetails, title: e.target.value })}
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all pr-12"
                                            placeholder="e.g. Science Test 1"
                                        />
                                        {paperDetails.id && (
                                            <button
                                                onClick={handleUpdatePaperMetadata}
                                                disabled={saving}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Update only Paper Name/Details"
                                            >
                                                {saving ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                                ) : (
                                                    <Save size={20} />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {language === 'hindi' ? 'कक्षा' : 'Class'}
                                    </label>
                                    <input
                                        type="text"
                                        value={paperDetails.className}
                                        onChange={(e) => setPaperDetails({ ...paperDetails, className: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        placeholder="e.g. 10th"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {language === 'hindi' ? 'सेट' : 'Set'}
                                    </label>
                                    <select
                                        value={paperDetails.paperSet}
                                        onChange={(e) => setPaperDetails({ ...paperDetails, paperSet: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    >
                                        <option value="">{language === 'hindi' ? 'चुनें' : 'Select'}</option>
                                        <option value="A">Set A</option>
                                        <option value="B">Set B</option>
                                        <option value="C">Set C</option>
                                        <option value="D">Set D</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {isPaperDetailsFilled && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    {language === 'hindi' ? '२. विषयों द्वारा आयात करें' : '2. Import by Subject'}
                                </h2>

                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
                                    {SUBJECTS.map((subject) => {
                                        const isActive = activeTab === subject.id;
                                        const count = subjectFiles[subject.id].questionCount;

                                        return (
                                            <button
                                                key={subject.id}
                                                onClick={() => setActiveTab(subject.id)}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${isActive
                                                    ? `bg-linear-to-r ${subject.gradient} text-white shadow-lg scale-105`
                                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                                    }`}
                                            >
                                                <span>{subject.name}</span>
                                                {count > 0 && (
                                                    <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                                        {count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {SUBJECTS.map(subject => subject.id === activeTab && (
                                    <div key={subject.id} className="space-y-4">
                                        <div className={`bg-linear-to-r ${subject.gradient} rounded-xl p-4 text-white`}>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <h3 className="font-bold text-lg">{subject.name}</h3>
                                                    <p className="text-sm opacity-90">Upload questions CSV file</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <input
                                                type="file"
                                                accept=".csv,.xlsx,.pdf,.docx"
                                                onChange={(e) => handleFileChange(e, subject.id)}
                                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-linear-to-r file:from-blue-50 file:to-blue-100 file:text-blue-700 hover:file:from-blue-100 hover:file:to-blue-200 file:transition-all cursor-pointer"
                                            />
                                            {subjectFiles[subject.id].file && (
                                                <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                                                    <CheckCircle size={16} />
                                                    {subjectFiles[subject.id].file.name}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => parseFile(subjectFiles[subject.id].file, subject.id)}
                                            disabled={subjectFiles[subject.id].parsing || !subjectFiles[subject.id].file}
                                            className={`w-full bg-linear-to-r ${subject.gradient} text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                                        >
                                            {subjectFiles[subject.id].parsing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                    Parsing...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={20} />
                                                    Load {subject.name} Questions
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {language === 'hindi' ? 'हाल के पेपर' : 'Recent Papers'}
                        </h2>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {questionPapers.map(paper => (
                                <div
                                    key={paper._id}
                                    className="group flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                                    onClick={() => loadPaperQuestions(paper)}
                                >
                                    <div>
                                        <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                                            {paper.title}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                            <span className="bg-gray-100 px-2 py-1 rounded">{paper.class}</span>
                                            <span className="bg-gray-100 px-2 py-1 rounded">Set {paper.set}</span>
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                                                {paper.questionCount} Qs
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeletePaper(paper._id); }}
                                        className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {questionPapers.length === 0 && (
                                <p className="text-gray-400 text-sm text-center py-8">No papers found</p>
                            )}
                        </div>
                    </div>
                </div>

                {draftQuestions.length > 0 && (
                    <div ref={questionsRef} className="mt-8 bg-white rounded-2xl shadow-xl p-8 border-t-4 border-purple-500">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {isDraft ? '📝 Draft Questions' : 'All Questions'}
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    {paperDetails.className} - Set {paperDetails.paperSet} ({draftQuestions.length} Questions)
                                    {isDraft && <span className="text-orange-600 font-semibold ml-2">• Not saved yet</span>}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsPreviewOpen(true)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-100"
                                >
                                    <Eye size={16} />
                                    Full Preview
                                </button>
                                {selectedIds.length > 0 && (
                                    <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-xl animate-in fade-in slide-in-from-top-2">
                                        <span className="text-sm font-bold text-blue-700">{selectedIds.length} Selected</span>
                                        <div className="h-4 w-px bg-blue-200 mx-2"></div>
                                        <span className="text-xs font-semibold text-gray-500">Move to:</span>
                                        <div className="flex gap-1">
                                            {SUBJECTS.filter(s => s.id !== activeTab).map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => handleBulkSubjectChange(s.id)}
                                                    className={`text-[10px] px-2 py-1 rounded-md bg-linear-to-r ${s.gradient} text-white font-bold hover:scale-105 transition-all`}
                                                >
                                                    {s.name}
                                                </button>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => setSelectedIds([])}
                                            className="ml-2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                                
                                <button
                                    onClick={() => selectAllOfSubject(activeTab)}
                                    className="text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
                                >
                                    {draftQuestions.filter(q => q.subjectId === activeTab).every(id => selectedIds.includes(id)) && draftQuestions.filter(q => q.subjectId === activeTab).length > 0 ? "Deselect All" : "Select All"}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {draftQuestions.map((q, index) => renderQuestionCard(q, index))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Question Modal */}
            <Modal
                isOpen={isAddingQuestion}
                onClose={() => setIsAddingQuestion(false)}
                title={language === 'hindi' ? 'नया प्रश्न जोड़ें' : 'Add New Question'}
                size="lg"
            >
                <QuestionEditor
                    subjectId={activeTab}
                    pdfFile={subjectFiles[activeTab]?.file}
                    lastPdfPage={lastPdfPage}
                    onPdfPageChange={setLastPdfPage}
                    displaySr={draftQuestions.length + 1}
                    onSave={(newQuestionData) => {
                        if (newQuestionData) {
                                const questionToAdd = {
                                    ...newQuestionData,
                                    id: `draft-${activeTab}-${Date.now()}`,
                                    subjectId: newQuestionData.subject || activeTab,
                                    subjectName: SUBJECTS.find(s => s.id === (newQuestionData.subject || activeTab))?.name,
                                    subjectColor: SUBJECTS.find(s => s.id === (newQuestionData.subject || activeTab))?.color,
                                    subjectGradient: SUBJECTS.find(s => s.id === (newQuestionData.subject || activeTab))?.gradient,
                                    sr: parseInt(newQuestionData.sr) || (draftQuestions.length + 1)
                                };
                                
                                const targetSr = questionToAdd.sr;
                                const targetSubject = questionToAdd.subjectId;
                                let shiftedDbQuestions = [];

                                setDraftQuestions(prev => {
                                    const isDuplicate = prev.some(q => q.subjectId === targetSubject && q.sr === targetSr);
                                    
                                    let updated = prev;
                                    if (isDuplicate) {
                                        updated = prev.map(q => {
                                            if (q.subjectId === targetSubject && q.sr >= targetSr) {
                                                const newSr = q.sr + 1;
                                                if (q._id && !q._id.toString().startsWith('draft-')) {
                                                    shiftedDbQuestions.push({ _id: q._id, sr: newSr });
                                                }
                                                return { ...q, sr: newSr };
                                            }
                                            return q;
                                        });
                                    }
                                    
                                    // Just sort, do NOT re-number. Respect the manual sr.
                                    return [...updated, questionToAdd].sort((a, b) => {
                                        if (SUBJECT_ORDER[a.subjectId] !== SUBJECT_ORDER[b.subjectId]) {
                                            return (SUBJECT_ORDER[a.subjectId] ?? 99) - (SUBJECT_ORDER[b.subjectId] ?? 99);
                                        }
                                        return (a.sr || 0) - (b.sr || 0);
                                    });
                                });

                                // Background save shifts for DB questions
                                if (shiftedDbQuestions.length > 0) {
                                    (async () => {
                                        for (const q of shiftedDbQuestions) {
                                            await updateQuestion(q._id, { sr: q.sr });
                                        }
                                    })();
                                }
                                
                                setIsDraft(true);
                        }
                        setIsAddingQuestion(false);
                        toast.success("Question added to draft!");
                    }}
                    onCancel={() => setIsAddingQuestion(false)}
                />
            </Modal>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                type={confirmDialog.type}
                confirmText="Delete"
                cancelText="Cancel"
            />

            <PaperPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                questions={draftQuestions}
                paperDetails={paperDetails}
            />

            {/* Floating Action Button (FAB) */}
            {!isPreviewOpen && !isAddingQuestion && !editingQuestionId && (
                <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-3">
                    {isFabOpen && (
                        <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200">
                            <button
                                onClick={() => { setIsPreviewOpen(true); setIsFabOpen(false); }}
                                className="flex items-center gap-3 bg-white text-blue-600 px-6 py-3 rounded-2xl shadow-2xl border border-blue-100 hover:bg-blue-50 transition-all font-bold group"
                            >
                                <span className="text-sm">Full Preview</span>
                                <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
                                    <Eye size={20} />
                                </div>
                            </button>

                            <button
                                onClick={() => { setIsAddingQuestion(true); setIsFabOpen(false); }}
                                className="flex items-center gap-3 bg-white text-purple-600 px-6 py-3 rounded-2xl shadow-2xl border border-purple-100 hover:bg-purple-50 transition-all font-bold group"
                            >
                                <span className="text-sm">Add Question</span>
                                <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                                    <Plus size={20} />
                                </div>
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setIsFabOpen(!isFabOpen)}
                        className={`p-4 rounded-3xl shadow-2xl transition-all duration-300 flex items-center justify-center ${isFabOpen ? 'bg-slate-800 text-white rotate-180 scale-90' : 'bg-linear-to-r from-blue-600 to-indigo-700 text-white hover:scale-105 active:scale-95'}`}
                    >
                        {isFabOpen ? <X size={28} /> : <ChevronUp size={28} className="animate-bounce" />}
                    </button>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
