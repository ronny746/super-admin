import React, { useState, useEffect } from "react";
import { Save, X, Image as ImageIcon, Trash2, Plus, ArrowUp, ArrowDown, Loader2, Scissors } from "lucide-react";
import { updateQuestion, createQuestion, uploadImage } from "../api/testSystemApi";
import PdfCropperModal from "../components/PdfCropperModal";

export default function QuestionEditor({ question, onSave, onCancel, metadata, subjectId, pdfFile, lastPdfPage, onPdfPageChange, displaySr }) {
    const [formData, setFormData] = useState({
        question: "",
        questionImage: "",
        questionType: "MCQ",
        level: "Medium",
        subject: subjectId || "physics",
        correctOptionIndex: null, // For MCQ
        correctAnswer: "", // For MSQ and empty Psychometric tests
        sr: displaySr || question?.sr || "", // Question Number
        options: [
            { text: "", image: null, id: "0" },
            { text: "", image: null, id: "1" },
            { text: "", image: null, id: "2" },
            { text: "", image: null, id: "3" },
        ]
    });
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(null); // Track which image is uploading
    const [error, setError] = useState("");
    const [isCroppingPdf, setIsCroppingPdf] = useState(false);
    const [croppingTarget, setCroppingTarget] = useState(null); // "question" or index for options

    useEffect(() => {
        if (question && (question._id || question.id)) {
            // Map incoming question data to form state (Editing Mode)
            // Works for both DB questions (_id) and draft questions (id)
            let initialOptions = [];

            if (question.options && question.options.length > 0) {
                initialOptions = question.options.map(opt => ({
                    text: opt.text || "",
                    image: opt.image || null,
                    id: opt.id || Math.random().toString(36).substr(2, 9)
                }));
            } else {
                initialOptions = [
                    { text: question.optionA || "", image: null, id: "0" },
                    { text: question.optionB || "", image: null, id: "1" },
                    { text: question.optionC || "", image: null, id: "2" },
                    { text: question.optionD || "", image: null, id: "3" },
                ];
            }

            let correctIdx = question.correctOptionIndex;
            if (correctIdx === undefined || correctIdx === null) {
                const mapping = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
                if (question.correctAnswer && question.correctAnswer.length === 1 && mapping.hasOwnProperty(question.correctAnswer)) {
                    correctIdx = mapping[question.correctAnswer];
                }
            }

            setFormData({
                question: question.question || "",
                questionImage: question.questionImage || "",
                questionType: question.questionType || "MCQ",
                level: question.level || "Medium",
                subject: question.subjectId || subjectId || "physics",
                correctOptionIndex: correctIdx,
                correctAnswer: question.correctAnswer || "",
                sr: displaySr || question.sr || "",
                options: initialOptions
            });
        }
    }, [question]);

    const handleOptionChange = (idx, field, value) => {
        const newOptions = [...formData.options];
        newOptions[idx][field] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [
                ...formData.options,
                { text: "", image: null, id: Math.random().toString(36).substr(2, 9) }
            ]
        });
    };

    const removeOption = (idx) => {
        const newOptions = formData.options.filter((_, i) => i !== idx);

        // Fix up MCQ
        let newCorrectIdx = formData.correctOptionIndex;
        if (newCorrectIdx === idx) newCorrectIdx = null;
        else if (newCorrectIdx !== null && newCorrectIdx > idx) newCorrectIdx--;

        // Fix up MSQ (This is a bit complex as letters change, but we'll leave it as string operations for simplicity or just clear it)
        const removedLetter = String.fromCharCode(65 + idx);
        let newCorrectAnswer = formData.correctAnswer;
        if (newCorrectAnswer) {
            newCorrectAnswer = newCorrectAnswer.split(",").filter(a => a !== removedLetter).join(",");
        }

        setFormData({ ...formData, options: newOptions, correctOptionIndex: newCorrectIdx, correctAnswer: newCorrectAnswer });
    };

    const handleSave = async () => {
        setLoading(true);
        setError("");
        try {
            // Validations
            if (["MCQ", "MSQ"].includes(formData.questionType) && formData.options.length < 2) {
                throw new Error("At least 2 options are required for MCQ/MSQ");
            }

            // Check if this is a real database question or a draft
            const isRealDbQuestion = question && question._id && !question._id.toString().startsWith('draft-');
            const isDraftQuestion = question && question.id && question.id.toString().startsWith('draft-');

            // Set correctAnswer properly for MCQ so that the backend isn't confused
            let finalCorrectAnswer = formData.correctAnswer;
            if (formData.questionType === "MCQ" && formData.correctOptionIndex !== null) {
                finalCorrectAnswer = String.fromCharCode(65 + formData.correctOptionIndex);
            }

            // Sanitize payload
            const payload = {
                question: formData.question,
                questionImage: formData.questionImage || "",
                questionType: formData.questionType,
                level: formData.level,
                subject: ["physics", "chemistry", "mathematics", "biology", "mat", "general"].includes(formData.subject) ? formData.subject : "physics",
                correctOptionIndex: formData.questionType === "MSQ" ? null : parseInt(formData.correctOptionIndex),
                correctAnswer: finalCorrectAnswer,
                sr: parseInt(formData.sr) || 0,
                options: formData.options.map(opt => ({
                    text: opt.text || "",
                    image: opt.image || "",
                    id: opt.id
                }))
            };

            if (isRealDbQuestion) {
                // Real database question - call API to update
                const idToUpdate = question._id || question.id;
                if (!idToUpdate) throw new Error("Question ID is missing. Cannot update database.");
                
                console.log("Updating question in database:", idToUpdate, payload);
                const response = await updateQuestion(idToUpdate, payload);
                console.log("Database update successful:", response);
                // Always call onSave to let parent component handle state updates
                onSave({ ...payload, _id: idToUpdate });
            } else if (isDraftQuestion) {
                // Draft question - just update local state
                console.log("Updating draft question:", question.id);
                onSave(payload);
            } else {
                // New question - call create API if metadata provided
                if (metadata) {
                    console.log("Creating new question in database with metadata:", metadata);
                    const response = await createQuestion({ ...payload, ...metadata });
                    console.log("Database create successful:", response);
                    onSave({ ...payload, _id: response.questionId || response._id });
                } else {
                    // No metadata - just add to draft
                    console.log("Adding new question to draft");
                    onSave(payload);
                }
            }
        } catch (err) {
            console.error("Save error full details:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to save question";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const [signedUrls, setSignedUrls] = useState({}); // To store signed URLs for keys

    // Handle image upload to server
    const handleImageUpload = async (e, target) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(target); // Set which image is uploading
        try {
            const response = await uploadImage(file);
            const imageUrl = response.imageUrl; // Signed URL
            const imageKey = response.imageKey; // S3 Key

            if (target === "question") {
                setFormData({ ...formData, questionImage: imageKey });
                setSignedUrls(prev => ({ ...prev, question: imageUrl }));
            } else if (typeof target === "number") {
                handleOptionChange(target, "image", imageKey);
                setSignedUrls(prev => ({ ...prev, [target]: imageUrl }));
            }
        } catch (err) {
            setError("Failed to upload image: " + (err.response?.data?.message || err.message));
        } finally {
            setUploadingImage(null);
        }
    };

    const isEditing = question && (question._id || question.id);

    const handleCropComplete = (base64Image) => {
        if (croppingTarget === "question") {
            setFormData({ ...formData, questionImage: base64Image });
        } else if (typeof croppingTarget === "number") {
            handleOptionChange(croppingTarget, "image", base64Image);
        }
    };

    return (
        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            {isCroppingPdf && pdfFile && (
                <PdfCropperModal 
                    file={pdfFile} 
                    initialPage={lastPdfPage}
                    onClose={() => setIsCroppingPdf(false)} 
                    onCropComplete={(base64, pageNum) => {
                        handleCropComplete(base64);
                        if (onPdfPageChange) onPdfPageChange(pageNum);
                    }} 
                />
            )}
            {/* Header with gradient */}
            <div className={`bg-linear-to-r ${isEditing ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'} p-4`}>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {isEditing ? " Edit Question" : "➕ Add New Question"}
                </h3>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {error && (
                    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 text-red-700 flex items-center gap-2 text-sm">
                        <span className="text-xl">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Question Text & Image */}
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-gray-800"> Question Text</label>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-gray-600">Q. No:</label>
                            <input 
                                type="number" 
                                value={formData.sr}
                                onChange={(e) => setFormData({ ...formData, sr: e.target.value })}
                                className="w-16 border-2 border-gray-300 rounded-lg p-1 text-center font-bold focus:border-blue-500 transition-all"
                                placeholder="#"
                            />
                        </div>
                    </div>
                    <textarea
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        rows={3}
                        placeholder="Enter your question here..."
                    />

                    <div className="mt-4">
                        {formData.questionImage && (
                            <div className="mb-4 relative w-48 h-48 group">
                                <img
                                    src={signedUrls.question || formData.questionImage}
                                    alt="Question"
                                    className="w-full h-full object-cover rounded-xl border-4 border-blue-200 shadow-lg"
                                />
                                <button
                                    onClick={() => setFormData({ ...formData, questionImage: "" })}
                                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 hover:scale-110 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg transition-all">
                            {uploadingImage === "question" ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <ImageIcon size={18} />
                                    <span>{formData.questionImage ? "Change Image" : "Upload Image"}</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, "question")}
                                disabled={uploadingImage !== null}
                            />
                        </label>
                            {pdfFile && pdfFile.name.endsWith('.pdf') ? (
                                <button
                                    type="button"
                                    onClick={() => { setCroppingTarget("question"); setIsCroppingPdf(true); }}
                                    className="ml-3 inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-200 hover:shadow-lg transition-all"
                                >
                                    <Scissors size={18} />
                                    <span>Crop from PDF</span>
                                </button>
                            ) : (
                                <p className="ml-3 text-[10px] text-gray-400 italic max-w-[150px]">
                                    To crop from PDF, first select the PDF file in the subject tab above.
                                </p>
                            )}
                    </div>
                </div>

                {/* Subject and Level in one row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                        <label className="block text-sm font-bold text-gray-800 mb-2">📚 Subject</label>
                        <select
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="border-2 border-gray-300 rounded-xl p-2 w-full font-semibold focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                        >
                            <option value="physics">Physics</option>
                            <option value="chemistry">Chemistry</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="biology">Biology</option>
                            <option value="mat">MAT</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                        <label className="block text-sm font-bold text-gray-800 mb-2"> Type</label>
                        <select
                            value={formData.questionType}
                            onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
                            className="border-2 border-gray-300 rounded-xl p-2 w-full font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        >
                            <option value="MCQ"> MCQ</option>
                            <option value="MSQ"> MSQ</option>
                            <option value="INTEGER"> Integer</option>
                            <option value="SUBJECTIVE"> Subjective</option>
                        </select>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                        <label className="block text-sm font-bold text-gray-800 mb-2"> Difficulty Level</label>
                        <select
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            className="border-2 border-gray-300 rounded-xl p-2 w-full font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        >
                            <option value="Easy"> Easy</option>
                            <option value="Medium"> Medium</option>
                            <option value="Hard"> Hard</option>
                        </select>
                    </div>
                </div>

                {/* Options / Answer */}
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    {["MCQ", "MSQ"].includes(formData.questionType) ? (
                        <>
                            <label className="block text-sm font-bold text-gray-800 mb-3">✅ Options (Select Correct Answer)</label>
                            <div className="space-y-3">
                                {formData.options.map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-start gap-4 border-2 p-4 rounded-xl transition-all ${(formData.questionType === "MSQ" && formData.correctAnswer.split(",").includes(String.fromCharCode(65 + idx))) ||
                                            (formData.questionType === "MCQ" && formData.correctOptionIndex === idx)
                                            ? 'bg-green-50 border-green-400 shadow-md'
                                            : 'bg-white border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        {/* Checkbox or Radio button */}
                                        {formData.questionType === "MSQ" ? (
                                            <input
                                                type="checkbox"
                                                checked={formData.correctAnswer.split(",").includes(String.fromCharCode(65 + idx))}
                                                onChange={(e) => {
                                                    const letter = String.fromCharCode(65 + idx);
                                                    let answers = formData.correctAnswer ? formData.correctAnswer.split(",").filter(Boolean) : [];
                                                    if (e.target.checked) {
                                                        if (!answers.includes(letter)) answers.push(letter);
                                                    } else {
                                                        answers = answers.filter(a => a !== letter);
                                                    }
                                                    setFormData({ ...formData, correctAnswer: answers.sort().join(",") });
                                                }}
                                                className="mt-4 w-5 h-5 cursor-pointer rounded"
                                            />
                                        ) : (
                                            <input
                                                type="radio"
                                                name="correctOption"
                                                checked={formData.correctOptionIndex === idx}
                                                onChange={() => setFormData({ ...formData, correctOptionIndex: idx })}
                                                className="mt-4 w-5 h-5 cursor-pointer"
                                            />
                                        )}

                                        {/* Option content */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${(formData.questionType === "MSQ" && formData.correctAnswer.split(",").includes(String.fromCharCode(65 + idx))) ||
                                                    (formData.questionType === "MCQ" && formData.correctOptionIndex === idx)
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-300 text-gray-700'
                                                    }`}>
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={opt.text}
                                                    onChange={(e) => handleOptionChange(idx, "text", e.target.value)}
                                                    placeholder={`Option ${idx + 1}`}
                                                    className="flex-1 border-2 border-gray-300 rounded-lg p-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                                />
                                            </div>

                                            {/* Option image */}
                                            <div className="flex items-center gap-3">
                                                {opt.image && (
                                                    <div className="relative w-24 h-24 group">
                                                        <img
                                                            src={signedUrls[idx] || opt.image}
                                                            alt={`Option ${idx + 1}`}
                                                            className="w-full h-full object-cover rounded-lg border-2 border-blue-200 shadow"
                                                        />
                                                        <button
                                                            onClick={() => handleOptionChange(idx, "image", null)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 hover:scale-110 transition-all"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                )}

                                                <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all">
                                                    {uploadingImage === idx ? (
                                                        <>
                                                            <Loader2 size={14} className="animate-spin" />
                                                            <span>Uploading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ImageIcon size={14} />
                                                            <span>{opt.image ? "Change" : "Add Image"}</span>
                                                        </>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleImageUpload(e, idx)}
                                                        disabled={uploadingImage !== null}
                                                    />
                                                </label>
                                                
                                                {pdfFile && pdfFile.name.endsWith('.pdf') && (
                                                    <button
                                                        onClick={() => { setCroppingTarget(idx); setIsCroppingPdf(true); }}
                                                        className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-all"
                                                    >
                                                        <Scissors size={14} />
                                                        <span>Crop from PDF</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Delete button */}
                                        {formData.options.length > 2 && (
                                            <button
                                                onClick={() => removeOption(idx)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg mt-2 transition-all"
                                                title="Remove this option"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addOption}
                                className="mt-4 flex items-center gap-2 text-base font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all"
                            >
                                <Plus size={18} />
                                Add Another Option
                            </button>
                        </>
                    ) : (
                        <>
                            <label className="block text-sm font-bold text-gray-800 mb-3">✅ Correct Answer</label>
                            <input
                                type={formData.questionType === "INTEGER" ? "number" : "text"}
                                value={formData.correctAnswer || ""}
                                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                                placeholder={formData.questionType === "INTEGER" ? "e.g. 10" : "Type the correct answer here..."}
                                className="w-full border-2 border-gray-300 rounded-lg p-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-200">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-all"
                        disabled={loading || uploadingImage !== null}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || uploadingImage !== null}
                        className="flex items-center gap-2 bg-linear-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl hover:shadow-xl transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Save Question</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
