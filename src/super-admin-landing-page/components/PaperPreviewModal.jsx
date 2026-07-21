import React, { useRef } from "react";
import { X, Printer, Eye, Download, FileText } from "lucide-react";

export default function PaperPreviewModal({ isOpen, onClose, questions, paperDetails }) {
    const printRef = useRef();

    if (!isOpen) return null;

    const handlePrint = () => {
        const printContent = printRef.current;
        const windowUrl = 'about:blank';
        const uniqueName = new Date();
        const windowName = 'Print' + uniqueName.getTime();
        const printWindow = window.open(windowUrl, windowName, 'left=50,top=50,width=900,height=900');

        printWindow.document.write(`
            <html>
                <head>
                    <title>${paperDetails.title || 'Question Paper'}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        @media print {
                            @page { margin: 1cm; }
                            .no-print { display: none; }
                            .page-break { page-break-after: always; }
                            body { -webkit-print-color-adjust: exact; }
                        }
                        .question-container { break-inside: avoid; }
                        .two-column { column-count: 2; column-gap: 40px; }
                        @media screen {
                            .two-column { column-count: 1; }
                        }
                    </style>
                </head>
                <body class="bg-white p-8">
                    ${printContent.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    // Define strict subject order
    const subjectOrder = { physics: 0, chemistry: 1, biology: 2, mathematics: 3, mat: 4, general: 5, unknown: 6 };
    
    // Group and sort questions
    const sortedSubjects = [...new Set(questions.map(q => q.subjectId || 'general'))]
        .sort((a, b) => (subjectOrder[a] ?? 99) - (subjectOrder[b] ?? 99));

    // Calculate total questions up to each subject for continuous numbering if desired
    // However, the user asked for "sr" to be correct. We will use global index for display.
    let globalIndex = 0;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-8 py-4 border-b bg-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-2 rounded-xl text-white">
                            <Eye size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Paper Preview</h2>
                            <p className="text-sm text-gray-500">{paperDetails.title} • Class {paperDetails.className} • Set {paperDetails.paperSet}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-200"
                        >
                            <Printer size={18} />
                            Print / Save PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto p-12 bg-gray-100/50" id="preview-scroll-container">
                    <div ref={printRef} className="bg-white shadow-sm border border-gray-200 mx-auto max-w-[210mm] min-h-[297mm] p-12 text-[12pt] leading-relaxed text-black font-serif">
                        
                        {/* Paper Header (Exam Style) */}
                        <div className="text-center border-b-2 border-black pb-6 mb-8">
                            <h1 className="text-3xl font-bold uppercase mb-2 tracking-wider">{paperDetails.title || "EXAMINATION PAPER"}</h1>
                            <div className="flex justify-between text-lg font-bold">
                                <span>CLASS: {paperDetails.className || "____"}</span>
                                <span>SET: {paperDetails.paperSet || "A"}</span>
                                <span>TIME: 3 HOURS</span>
                            </div>
                            <div className="flex justify-between mt-2 text-sm italic">
                                <span>Max Marks: 720</span>
                                <span>Total Questions: {questions.length}</span>
                            </div>
                        </div>

                        {/* General Instructions */}
                        <div className="mb-8 p-4 border border-gray-300 rounded-lg text-sm bg-gray-50 no-print">
                            <p className="font-bold mb-2">Instructions:</p>
                            <ul className="list-disc ml-5 space-y-1">
                                <li>All questions are compulsory.</li>
                                <li>The paper is divided into subjects as per the tabs.</li>
                                <li>Each question has four options with only one correct answer.</li>
                            </ul>
                        </div>

                        {/* Questions Rendering */}
                        <div className="space-y-12">
                            {sortedSubjects.map(subId => {
                                const subQuestions = questions
                                    .filter(q => (q.subjectId || 'general') === subId)
                                    .sort((a, b) => a.sr - b.sr);
                                
                                if (subQuestions.length === 0) return null;

                                return (
                                    <div key={subId} className="page-break-inside-avoid">
                                        <div className="bg-gray-200 py-2 px-4 mb-6 border-y-2 border-black">
                                            <h2 className="text-xl font-bold uppercase text-center tracking-[0.2em]">{subId}</h2>
                                        </div>

                                        <div className="grid grid-cols-1 gap-x-12 gap-y-10">
                                            {subQuestions.map((q, idx) => {
                                                globalIndex++; // Increment global counter
                                                return (
                                                    <div key={q.id} className="question-container break-inside-avoid">
                                                        <div className="flex gap-3">
                                                            <span className="font-bold min-w-[2.5rem]">Q.{globalIndex}</span>
                                                            <div className="flex-1">
                                                                {/* Question Text */}
                                                                {q.question && <p className="mb-4 whitespace-pre-wrap">{q.question}</p>}
                                                                
                                                                {/* Question Image (Cropped Math/Diagram) */}
                                                                {q.questionImage && (
                                                                    <div className="mb-4 max-w-full">
                                                                        <img 
                                                                            src={q.questionImage} 
                                                                            alt="Question Diagram" 
                                                                            className="max-h-64 object-contain rounded border border-gray-100 shadow-sm"
                                                                        />
                                                                    </div>
                                                                )}

                                                                {/* Options Grid */}
                                                                {(!q.questionType || q.questionType === 'MCQ' || q.questionType === 'MSQ') && (
                                                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                                                        {(q.options || []).map((opt, oIdx) => (
                                                                            <div key={oIdx} className="flex gap-2 items-start">
                                                                                <span className="font-bold">({String.fromCharCode(65 + oIdx)})</span>
                                                                                <div className="flex-1">
                                                                                    {opt.text && <span>{opt.text}</span>}
                                                                                    {opt.image && (
                                                                                        <img 
                                                                                            src={opt.image} 
                                                                                            alt={`Option ${oIdx}`} 
                                                                                            className="mt-1 h-20 object-contain rounded border border-gray-100"
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {q.questionType === 'SUBJECTIVE' && (
                                                                    <div className="mt-8 mb-4 border-b border-dashed border-gray-400 pb-16">
                                                                        {/* Space for subjective answer */}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Paper Footer */}
                        <div className="mt-16 pt-8 border-t border-gray-300 text-center text-sm text-gray-500 italic">
                            *** End of Question Paper ***
                        </div>
                    </div>
                </div>
                
                {/* Footer Tip */}
                <div className="p-4 bg-blue-50 text-center border-t border-blue-100">
                    <p className="text-blue-700 text-sm font-medium flex items-center justify-center gap-2">
                        <Eye size={16} />
                        Tip: This is exactly how the student will see the paper. Use the Print button to save it as a professional PDF.
                    </p>
                </div>
            </div>
        </div>
    );
}
