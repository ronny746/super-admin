import React, { useState, useEffect, useRef } from 'react';
import 'mathlive';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Plus, Printer, Image as ImageIcon, FunctionSquare, FileText, FileSpreadsheet, Maximize2, Minimize2, Trash2, Layout, FileJson } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { saveToQuestionBank } from '../../api/testSystemApi';

const MathEditorModal = ({ isOpen, onClose, initialValue, onSave }) => {
    const mathFieldRef = useRef(null);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        if (isOpen && mathFieldRef.current) {
            mathFieldRef.current.value = initialValue || '';
            mathFieldRef.current.setOptions({
                virtualKeyboardMode: 'manual', // Completely disable keyboard on focus
                menuMode: 'off',
            });
            setTimeout(() => mathFieldRef.current.focus(), 100);
        }
    }, [isOpen, initialValue]);

    const insertSymbol = (latex) => {
        if (mathFieldRef.current) {
            mathFieldRef.current.insert(latex);
            mathFieldRef.current.focus();
        }
    };

    const categories = {
        basic: [
            { label: '√x', latex: '\\sqrt{#?}' },
            { label: 'x²', latex: '#?^{2}' },
            { label: 'x/y', latex: '\\frac{#?}{#?}' },
            { label: 'xⁿ', latex: '#?^{#?}' },
            { label: 'xₙ', latex: '#?_{#?}' },
            { label: '±', latex: '\\pm' },
            { label: '×', latex: '\\times' },
            { label: '÷', latex: '\\div' },
            { label: '∞', latex: '\\infty' },
            { label: 'π', latex: '\\pi' },
            { label: 'θ', latex: '\\theta' },
            { label: 'Δ', latex: '\\Delta' },
        ],
        calculus: [
            { label: 'd/dx', latex: '\\frac{d}{dx}#?' },
            { label: 'dⁿ/dxⁿ', latex: '\\frac{d^{n}}{dx^{n}}#?' },
            { label: '∫', latex: '\\int_{#?}^{#?} #? dx' },
            { label: 'Σ', latex: '\\sum_{i=#?}^{#?} #?' },
            { label: 'Π', latex: '\\prod_{i=#?}^{#?} #?' },
            { label: 'lim', latex: '\\lim_{#? \\to #?}' },
            { label: 'logₐ', latex: '\\log_{#?}(#?)' },
            { label: 'ln', latex: '\\ln(#?)' },
            { label: '∂', latex: '\\partial' },
            { label: '∇', latex: '\\nabla' },
        ],
        complex: [
            { label: '|z|', latex: '|#?|' },
            { label: 'arg(z)', latex: '\\text{arg}(#?)' },
            { label: 'Re(z)', latex: '\\Re(#?)' },
            { label: 'Im(z)', latex: '\\Im(#?)' },
            { label: 'z̄', latex: '\\bar{#?}' },
            { label: 'eⁱᶿ', latex: 'e^{i\\theta}' },
        ],
        matrix: [
            { label: '[2x2]', latex: '\\begin{pmatrix} #? & #? \\\\ #? & #? \\end{pmatrix}' },
            { label: '[3x3]', latex: '\\begin{pmatrix} #? & #? & #? \\\\ #? & #? & #? \\\\ #? & #? & #? \\end{pmatrix}' },
            { label: '[1x3]', latex: '\\begin{pmatrix} #? & #? & #? \\end{pmatrix}' },
            { label: 'det', latex: '\\begin{vmatrix} #? & #? \\\\ #? & #? \\end{vmatrix}' },
        ],
        greek: [
            { label: 'α', latex: '\\alpha' },
            { label: 'β', latex: '\\beta' },
            { label: 'γ', latex: '\\gamma' },
            { label: 'δ', latex: '\\delta' },
            { label: 'λ', latex: '\\lambda' },
            { label: 'μ', latex: '\\mu' },
            { label: 'ω', latex: '\\omega' },
            { label: 'Ω', latex: '\\Omega' },
            { label: 'Φ', latex: '\\Phi' },
        ]
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[250] print:hidden p-4">
            <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-5xl overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-4 text-white">
                        <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
                            <FunctionSquare className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold tracking-tight">Advanced Equation Designer</h3>
                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Complete Mathematical Studio</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all">
                        <Plus size={24} className="rotate-45" />
                    </button>
                </div>

                {/* Tabbed Toolbar */}
                <div className="bg-gray-50 border-b border-gray-200 flex flex-col">
                    <div className="flex gap-1 p-2 bg-gray-200/50 overflow-x-auto">
                        {Object.keys(categories).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-5 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === cat ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:bg-white/50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="p-3 grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-1.5 bg-white">
                        {categories[activeTab].map((s, idx) => (
                            <button
                                key={idx}
                                onClick={() => insertSymbol(s.latex)}
                                className="h-12 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all font-serif text-lg shadow-sm hover:shadow group"
                                title={s.label}
                            >
                                <span className="group-hover:scale-110 transition-transform" dangerouslySetInnerHTML={{ __html: katex.renderToString(s.label.includes('\\') || s.label.includes('{') ? s.label : s.label, { throwOnError: false }) }} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor Surface */}
                <div className="p-10 bg-white min-h-[350px] flex flex-col items-center justify-center relative">
                    <div className="absolute top-4 left-10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pro Scientific Canvas</span>
                    </div>
                    
                    <div className="w-full max-w-4xl p-10 rounded-2xl bg-gray-50 border-2 border-indigo-50 shadow-inner focus-within:border-indigo-300 focus-within:bg-white transition-all">
                        <math-field 
                            ref={mathFieldRef} 
                            style={{ 
                                width: '100%', 
                                fontSize: '48px', 
                                padding: '10px', 
                                background: 'transparent',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 px-8 py-5 flex justify-between items-center border-t border-gray-200">
                    <button 
                        className="text-gray-500 hover:text-red-600 font-bold text-sm flex items-center gap-2"
                        onClick={() => { if (mathFieldRef.current) mathFieldRef.current.value = ''; }}
                    >
                        <Trash2 size={16} /> Clear Canvas
                    </button>
                    <div className="flex gap-4">
                        <button 
                            className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-white transition-all font-bold text-sm shadow-sm" 
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            className="px-10 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-200 flex items-center gap-2" 
                            onClick={() => onSave(mathFieldRef.current.value)}
                        >
                            <Plus size={18} /> Apply Equation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Symbol shortcut map: type /shortcut then press Space to auto-replace
const SYMBOL_SHORTCUTS = {
    '/deg': '°', '/ohm': 'Ω', '/inf': '∞', '/pi': 'π',
    '/alpha': 'α', '/beta': 'β', '/gamma': 'γ', '/delta': 'δ',
    '/theta': 'θ', '/lambda': 'λ', '/mu': 'μ', '/sigma': 'Σ',
    '/omega': 'ω', '/phi': 'φ', '/psi': 'ψ', '/chi': 'χ',
    '/pm': '±', '/times': '×', '/div': '÷', '/neq': '≠',
    '/leq': '≤', '/geq': '≥', '/approx': '≈', '/perp': '⊥',
    '/angle': '∠', '/triangle': '△', '/parallel': '∥', '/sqrt': '√',
    '/sup2': '²', '/sup3': '³', '/arrow': '→', '/darrow': '⇒',
    '/in': '∈', '/notin': '∉', '/sub': '⊂', '/cup': '∪', '/cap': '∩',
};

// Keyboard shortcut map: Ctrl+Shift+<key> inserts symbol at cursor
const KEYBOARD_SHORTCUTS = [
    { combo: 'Ctrl+Shift+D', key: 'D', symbol: '°', name: 'Degree' },
    { combo: 'Ctrl+Shift+P', key: 'P', symbol: 'π', name: 'Pi' },
    { combo: 'Ctrl+Shift+A', key: 'A', symbol: 'α', name: 'Alpha' },
    { combo: 'Ctrl+Shift+B', key: 'B', symbol: 'β', name: 'Beta' },
    { combo: 'Ctrl+Shift+G', key: 'G', symbol: 'γ', name: 'Gamma' },
    { combo: 'Ctrl+Shift+T', key: 'T', symbol: 'θ', name: 'Theta' },
    { combo: 'Ctrl+Shift+L', key: 'L', symbol: 'λ', name: 'Lambda' },
    { combo: 'Ctrl+Shift+M', key: 'M', symbol: 'μ', name: 'Mu' },
    { combo: 'Ctrl+Shift+O', key: 'O', symbol: 'Ω', name: 'Omega' },
    { combo: 'Ctrl+Shift+E', key: 'E', symbol: '∞', name: 'Infinity' },
    { combo: 'Ctrl+Shift+Q', key: 'Q', symbol: '√', name: 'Square Root' },
    { combo: 'Ctrl+Shift+I', key: 'I', symbol: '→', name: 'Arrow' },
    { combo: 'Ctrl+Shift+=', key: '=', symbol: '±', name: 'Plus/Minus' },
    { combo: 'Ctrl+Shift+X', key: 'X', symbol: '×', name: 'Multiply' },
    { combo: 'Ctrl+Shift+/', key: '/', symbol: '÷', name: 'Divide' },
    { combo: 'Ctrl+Shift+2', key: '2', symbol: '²', name: 'Superscript 2' },
    { combo: 'Ctrl+Shift+3', key: '3', symbol: '³', name: 'Superscript 3' },
    { combo: 'Ctrl+Shift+N', key: 'N', symbol: '≠', name: 'Not Equal' },
    { combo: 'Ctrl+Shift+,', key: ',', symbol: '≤', name: 'Less or Equal' },
    { combo: 'Ctrl+Shift+.', key: '.', symbol: '≥', name: 'Greater or Equal' },
    { combo: 'Ctrl+Shift+\\', key: '\\', symbol: '≈', name: 'Approx Equal' },
    { combo: 'Ctrl+Shift+K', key: 'K', symbol: 'Σ', name: 'Sigma' },
    { combo: 'Ctrl+Shift+H', key: 'H', symbol: 'φ', name: 'Phi' },
    { combo: 'Ctrl+Shift+U', key: 'U', symbol: '△', name: 'Triangle' },
    { combo: 'Ctrl+Shift+J', key: 'J', symbol: '∠', name: 'Angle' },
];

// New InlineEditor Component
const InlineEditor = ({ value, onChange, placeholder, isHindi, onRequestMath }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = (e) => {
        onChange(e.currentTarget.innerHTML);
    };

    // Auto-replace shortcut on Space key
    const handleKeyDown = (e) => {
        if (e.key !== ' ') return;
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        const node = range.startContainer;
        if (node.nodeType !== Node.TEXT_NODE) return;
        const text = node.textContent.slice(0, range.startOffset);
        for (const [shortcut, symbol] of Object.entries(SYMBOL_SHORTCUTS)) {
            if (text.endsWith(shortcut)) {
                e.preventDefault();
                // Replace shortcut text with symbol + space
                const before = text.slice(0, text.length - shortcut.length);
                node.textContent = before + symbol + ' ' + node.textContent.slice(range.startOffset);
                // Move cursor after inserted symbol+space
                const newRange = document.createRange();
                newRange.setStart(node, before.length + symbol.length + 1);
                newRange.collapse(true);
                sel.removeAllRanges();
                sel.addRange(newRange);
                onChange(editorRef.current.innerHTML);
                return;
            }
        }
    };

    const handleAddMathClick = () => {
        const sel = window.getSelection();
        let savedRange = null;
        if (sel.rangeCount > 0 && editorRef.current.contains(sel.anchorNode)) {
            savedRange = sel.getRangeAt(0);
        } else {
            const range = document.createRange();
            range.selectNodeContents(editorRef.current);
            range.collapse(false);
            savedRange = range;
        }

        onRequestMath("", (latex) => {
            if (!latex) return;
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedRange);
            
            const rendered = katex.renderToString(latex, { throwOnError: false });
            const mathHtml = ` <span class="math-inline inline-block align-middle mx-1 cursor-pointer hover:ring-2 hover:ring-indigo-300 rounded" contenteditable="false" data-latex="${latex.replace(/"/g, '&quot;')}">${rendered}</span> `;
            
            document.execCommand("insertHTML", false, mathHtml);
            onChange(editorRef.current.innerHTML);
        });
    };

    const handleEditorClick = (e) => {
        const mathSpan = e.target.closest('.math-inline');
        if (mathSpan) {
            const currentLatex = mathSpan.getAttribute('data-latex');
            onRequestMath(currentLatex, (newLatex) => {
                if (!newLatex) {
                    mathSpan.remove(); // If saved as empty, delete it
                } else {
                    const rendered = katex.renderToString(newLatex, { throwOnError: false });
                    mathSpan.setAttribute('data-latex', newLatex.replace(/"/g, '&quot;'));
                    mathSpan.innerHTML = rendered;
                }
                onChange(editorRef.current.innerHTML);
            });
        }
    };

    return (
        <div className="w-full space-y-0 text-sm">
            <div className="print:hidden flex justify-between items-center bg-gray-50 border border-b-0 border-gray-200 rounded-t p-1">
                <span className="text-[10px] text-gray-500 font-medium px-1 uppercase tracking-wider">{placeholder}</span>
                <button 
                    onClick={handleAddMathClick}
                    className="flex items-center gap-1 text-[10px] bg-white border border-gray-200 text-indigo-700 px-2 py-0.5 rounded shadow-sm hover:bg-indigo-50 transition-colors"
                    title="Insert KaTeX Equation"
                >
                    <FunctionSquare size={12} /> + Math
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onBlur={handleInput}
                onClick={handleEditorClick}
                onKeyDown={handleKeyDown}
                className={`w-full p-2 border border-gray-200 rounded-b focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-h-[40px] print:hidden ${isHindi ? 'font-hindi' : ''}`}
                style={{ lineHeight: 1.6 }}
            />
            <div 
                className={`hidden print:block text-[11px] min-h-[20px] ${isHindi ? 'font-hindi' : ''}`} 
                style={{ border: 'none', padding: 0 }}
                dangerouslySetInnerHTML={{ __html: value || '\u00A0' }}
            />
        </div>
    );
};

const defaultRow = (index) => ({
    qid: `Q${index + 1}`,
    subject_en: "",
    subject_hi: "",
    topic_en: "",
    topic_hi: "",
    difficulty: "Medium",
    question_en: "",
    question_hi: "",
    image_en: "",
    image_hi: "",
    options: {
        A: { en: "", hi: "" },
        B: { en: "", hi: "" },
        C: { en: "", hi: "" },
        D: { en: "", hi: "" }
    },
    answer: "A",
    explanation_en: "",
    explanation_hi: ""
});

export default function PaperGenerator() {
    const location = useLocation();
    const navigate = useNavigate();
    const [rows, setRows] = useState([defaultRow(0)]);
    const [paperName, setPaperName] = useState("");
    const [selectedSectionSubject, setSelectedSectionSubject] = useState("PHYSICS");
    const [mathModal, setMathModal] = useState({ isOpen: false, initialValue: "", onSave: null });
    const [isUploading, setIsUploading] = useState(false);
    const [showHindi, setShowHindi] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDocumentMode, setIsDocumentMode] = useState(true);
    const [showMetadata, setShowMetadata] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
    // Custom shortcuts persisted in localStorage
    const [customShortcuts, setCustomShortcuts] = useState(() => {
        try { return JSON.parse(localStorage.getItem('pg_custom_shortcuts') || '[]'); }
        catch { return []; }
    });
    const [newShortcut, setNewShortcut] = useState({ key: '', symbol: '', name: '' });
    const [shortcutTab, setShortcutTab] = useState('keyboard'); // 'keyboard' | 'text' | 'custom'
    const [paperHeader, setPaperHeader] = useState({
        institute: "INSTITUTE NAME HERE",
        exam: "PERIODIC TEST - 1 (2024-25)",
        time: "3 Hours",
        marks: "100",
        classLevel: "N/A"
    });

    // Global Ctrl+Shift keyboard shortcuts — built-in + custom
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            // Toggle header on Backtick (`) key
            if (e.key === '`') {
                const active = document.activeElement;
                const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.contentEditable === 'true');
                if (!isInput) {
                    e.preventDefault();
                    setIsHeaderCollapsed(prev => !prev);
                }
                return;
            }

            if (!e.ctrlKey || !e.shiftKey) return;

            // Check built-in shortcuts
            const builtIn = KEYBOARD_SHORTCUTS.find(s => s.key.toUpperCase() === e.key.toUpperCase());
            // Check custom shortcuts
            const custom = customShortcuts.find(s => s.key.toUpperCase() === e.key.toUpperCase());
            const sym = builtIn?.symbol || custom?.symbol || null;
            if (!sym) return;

            const active = document.activeElement;
            const isEditableDiv = active && active.contentEditable === 'true';
            const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
            if (!isEditableDiv && !isInput) return;
            e.preventDefault();

            if (isEditableDiv) {
                document.execCommand('insertText', false, sym);
            } else {
                const start = active.selectionStart;
                const end = active.selectionEnd;
                const val = active.value;
                active.value = val.slice(0, start) + sym + val.slice(end);
                active.selectionStart = active.selectionEnd = start + sym.length;
                active.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [customShortcuts]);

    const addCustomShortcut = () => {
        const k = newShortcut.key.trim().toUpperCase();
        const sym = newShortcut.symbol.trim();
        const nm = newShortcut.name.trim() || sym;
        if (!k || !sym || k.length > 1) return;
        // Prevent duplicate key
        const allKeys = [...KEYBOARD_SHORTCUTS.map(s => s.key.toUpperCase()), ...customShortcuts.map(s => s.key.toUpperCase())];
        if (allKeys.includes(k)) { alert(`Key "${k}" is already used. Choose a different key.`); return; }
        const updated = [...customShortcuts, { key: k, symbol: sym, name: nm, combo: `Ctrl+Shift+${k}`, custom: true }];
        setCustomShortcuts(updated);
        localStorage.setItem('pg_custom_shortcuts', JSON.stringify(updated));
        setNewShortcut({ key: '', symbol: '', name: '' });
    };

    const deleteCustomShortcut = (key) => {
        const updated = customShortcuts.filter(s => s.key !== key);
        setCustomShortcuts(updated);
        localStorage.setItem('pg_custom_shortcuts', JSON.stringify(updated));
    };

    useEffect(() => {
        if (location.state && location.state.questions) {
            console.log("Loading questions from Question Bank:", location.state.questions.length);
            setRows(location.state.questions);
            if (location.state.paperName) {
                setPaperName(location.state.paperName);
            }
            if (location.state.questions[0]?.class) {
                setPaperHeader(prev => ({ ...prev, classLevel: location.state.questions[0].class }));
            }
        }
    }, [location.state]);

    const handleAddRow = () => {
        const questionCount = rows.filter(r => !r.isHeader).length;
        setRows([...rows, defaultRow(questionCount)]);
    };

    const handleDeleteRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const updateRow = (index, fieldPath, value) => {
        const newRows = [...rows];
        let current = newRows[index];
        const parts = fieldPath.split('.');
        
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        setRows(newRows);
    };

    const handleImageUpload = (index, lang, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            updateRow(index, `image_${lang}`, reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleOptionImageUpload = (index, optKey, lang, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            updateRow(index, `options.${optKey}.image_${lang}`, reader.result);
        };
        reader.readAsDataURL(file);
    };

    const exportToWord = () => {
        // Helper to process HTML text and safely replace math tokens with Images for Word
        const processText = (htmlString) => {
            if (!htmlString) return "";
            
            // Use DOM parser to safely handle nested tags without regex breaking
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlString;
            
            const mathSpans = tempDiv.querySelectorAll('.math-inline');
            mathSpans.forEach(span => {
                let latex = span.getAttribute('data-latex');
                if (latex) {
                    // Unescape characters
                    latex = latex.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                    // Use CodeCogs API to generate a high-quality PNG of the math for Word
                    const encodedLatex = encodeURIComponent(latex);
                    const imgUrl = `https://latex.codecogs.com/png.image?\\dpi{300}\\bg{white}${encodedLatex}`;
                    // Replace the span with an image that Word can perfectly render
                    span.outerHTML = `<img src="${imgUrl}" style="vertical-align: middle; max-height: 40px;" alt="Math" />`;
                }
            });
            
            return tempDiv.innerHTML;
        };

        let questionsHtml = "";
        
        // Group rows by headers
        const chunks = [];
        if (rows.length > 0) {
            let currentChunk = { subject: null, items: [] };
            rows.forEach((row) => {
                if (row.isHeader) {
                    if (currentChunk.items.length > 0 || currentChunk.subject) {
                        chunks.push(currentChunk);
                    }
                    currentChunk = { subject: row.subjectName, items: [] };
                } else {
                    currentChunk.items.push(row);
                }
            });
            if (currentChunk.items.length > 0 || currentChunk.subject) {
                chunks.push(currentChunk);
            }
        }

        if (showHindi) {
            // Bilingual Mode: Table with 2 columns
            questionsHtml = `
                <table width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td width="48%" style="text-align: center; font-weight: bold; font-size: 10pt; color: #666; border-bottom: 1px solid #eee; padding-bottom: 10px;">ENGLISH VERSION</td>
                        <td width="2%"></td>
                        <td width="48%" style="text-align: center; font-weight: bold; font-size: 10pt; color: #666; border-bottom: 1px solid #eee; padding-bottom: 10px; font-family: 'Mangal', 'Arial Unicode MS';">हिंदी संस्करण</td>
                    </tr>
                </table>
                ${chunks.map(chunk => `
                    ${chunk.subject ? `<div style="text-align: center; font-weight: bold; font-size: 14pt; padding: 10px 0; border-top: 1px solid #000; border-bottom: 1px solid #000; text-transform: uppercase; margin: 20px 0;">${chunk.subject}</div>` : ''}
                    <table width="100%" style="border-collapse: collapse;">
                        ${chunk.items.map(row => {
                            const i = rows.indexOf(row);
                            return `
                            <tr>
                                <td width="48%" style="vertical-align: top; padding-right: 15px; padding-bottom: 20px;">
                                    <b>${i + 1}.</b> ${processText(row.question_en)}
                                    <table width="100%" style="margin-top: 5px; margin-left: 15px;">
                                        <tr><td width="50%">(A) ${processText(row.options?.A?.en)}</td><td width="50%">(B) ${processText(row.options?.B?.en)}</td></tr>
                                        <tr><td width="50%">(C) ${processText(row.options?.C?.en)}</td><td width="50%">(D) ${processText(row.options?.D?.en)}</td></tr>
                                    </table>
                                </td>
                                <td width="2%" style="border-left: 1px solid #eee;"></td>
                                <td width="48%" style="vertical-align: top; padding-left: 15px; padding-bottom: 20px; font-family: 'Mangal', 'Arial Unicode MS';">
                                    <b>प्र. ${i + 1}.</b> ${processText(row.question_hi)}
                                    <table width="100%" style="margin-top: 5px; margin-left: 15px;">
                                        <tr><td width="50%">(A) ${processText(row.options?.A?.hi)}</td><td width="50%">(B) ${processText(row.options?.B?.hi)}</td></tr>
                                        <tr><td width="50%">(C) ${processText(row.options?.C?.hi)}</td><td width="50%">(D) ${processText(row.options?.D?.hi)}</td></tr>
                                    </table>
                                </td>
                            </tr>`;
                        }).join('')}
                    </table>
                `).join('')}
            `;
        } else {
            // Single Language Mode: Chunks with split columns
            const renderCol = (data) => data.map(row => {
                const i = rows.indexOf(row);
                return `
                <div style="margin-bottom: 20px; page-break-inside: avoid;">
                    <b>${i + 1}.</b> ${processText(row.question_en)}
                    <table width="100%" style="margin-top: 5px; margin-left: 15px;">
                        <tr><td width="50%">(A) ${processText(row.options?.A?.en)}</td><td width="50%">(B) ${processText(row.options?.B?.en)}</td></tr>
                        <tr><td width="50%">(C) ${processText(row.options?.C?.en)}</td><td width="50%">(D) ${processText(row.options?.D?.en)}</td></tr>
                    </table>
                </div>
            `}).join('');

            questionsHtml = chunks.map(chunk => {
                let html = '';
                if (chunk.subject) {
                    html += `<div style="text-align: center; font-weight: bold; font-size: 14pt; padding: 10px 0; border-top: 1px solid #000; border-bottom: 1px solid #000; text-transform: uppercase; margin: 20px 0;">${chunk.subject}</div>`;
                }
                const mid = Math.ceil(chunk.items.length / 2);
                const leftRows = chunk.items.slice(0, mid);
                const rightRows = chunk.items.slice(mid);
                
                html += `
                    <table width="100%" style="border-collapse: collapse;">
                        <tr>
                            <td width="48%" style="vertical-align: top; padding-right: 15px;">${renderCol(leftRows)}</td>
                            <td width="2%" style="border-left: 1px solid #eee;"></td>
                            <td width="48%" style="vertical-align: top; padding-left: 15px;">${renderCol(rightRows)}</td>
                        </tr>
                    </table>
                `;
                return html;
            }).join('');
        }

        const html = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <style>
                @page Section1 { size: 8.5in 11.0in; margin: 0.5in 0.5in 0.5in 0.5in; }
                div.Section1 { page: Section1; }
                body { font-family: 'Times New Roman', 'Arial', sans-serif; font-size: 12pt; line-height: 1.5; }
                .font-hindi { font-family: 'Mangal', 'Arial Unicode MS', serif; }
                img { max-width: 100%; height: auto; }
            </style>
        </head>
        <body>
            <div class="Section1">
                <table width="100%" style="border-bottom: 2px solid black; margin-bottom: 20px;">
                    <tr><td align="center" style="font-size: 18pt; font-weight: bold; text-transform: uppercase;">${paperHeader.institute}</td></tr>
                    <tr><td align="center" style="font-size: 14pt; font-weight: bold;">${paperHeader.exam}</td></tr>
                    <tr>
                        <td style="padding-top: 10px;">
                            <table width="100%">
                                <tr>
                                    <td align="left" width="33%"><b>TIME: ${paperHeader.time}</b></td>
                                    <td align="center" width="33%"><b>CLASS: ${paperHeader.classLevel}</b></td>
                                    <td align="right" width="33%"><b>MAX MARKS: ${paperHeader.marks}</b></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                ${questionsHtml}
            </div>
        </body>
        </html>
        `;

        const blob = new Blob([html], { type: 'application/msword' });
        saveAs(blob, (paperName || 'Question_Paper') + '.doc');
    };

    const printAnswerKey = () => {
        const printWindow = window.open('', '_blank');
        const paperTitle = paperName || paperHeader.exam;
        
        // Build a compact grid table (5 questions per row)
        const itemsPerRow = 5;
        let tableHtml = '<table class="ans-table"><tbody>';
        
        for (let i = 0; i < rows.length; i += itemsPerRow) {
            // Row for Question Numbers
            tableHtml += '<tr class="q-row">';
            for (let j = 0; j < itemsPerRow; j++) {
                const idx = i + j;
                tableHtml += `<td>${idx < rows.length ? 'Q.' + (idx + 1) : ''}</td>`;
            }
            tableHtml += '</tr>';
            
            // Row for Answers
            tableHtml += '<tr class="a-row">';
            for (let j = 0; j < itemsPerRow; j++) {
                const idx = i + j;
                tableHtml += `<td class="ans-cell">${idx < rows.length ? rows[idx].answer : ''}</td>`;
            }
            tableHtml += '</tr>';
            
            // Spacer row
            tableHtml += '<tr class="spacer"><td colspan="5"></td></tr>';
        }
        tableHtml += '</tbody></table>';

        // Prepare explanations
        let explList = '';
        rows.forEach((row, i) => {
            if (row.explanation_en || row.explanation_hi) {
                explList += `
                    <div class="expl-item">
                        <div class="q-num">Q. ${i + 1} Explanation:</div>
                        ${row.explanation_en ? `<div class="text"><strong>EN:</strong> ${row.explanation_en}</div>` : ''}
                        ${showHindi && row.explanation_hi ? `<div class="text font-hindi"><strong>HI:</strong> ${row.explanation_hi}</div>` : ''}
                    </div>
                `;
            }
        });

        printWindow.document.write(`
            <html>
                <head>
                    <title>Answer Key</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
                        .title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                        .ans-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; table-layout: fixed; }
                        .ans-table td { border: 1px solid #e2e8f0; padding: 10px; text-align: center; font-size: 14px; }
                        .q-row td { background-color: #f8fafc; font-weight: bold; color: #64748b; border-bottom: none; }
                        .a-row td { font-weight: 800; font-size: 16px; color: #1e293b; border-top: none; }
                        .ans-cell { background-color: #f0fdf4; }
                        .spacer td { border: none; height: 10px; }
                        
                        .expl-section { border-top: 1px solid #333; padding-top: 20px; }
                        .expl-title { font-size: 16px; font-weight: bold; margin-bottom: 20px; color: #1e293b; background: #eee; padding: 5px 10px; display: block; }
                        .expl-item { margin-bottom: 20px; page-break-inside: avoid; border-left: 3px solid #e2e8f0; padding-left: 15px; }
                        .q-num { font-weight: bold; color: #4f46e5; margin-bottom: 6px; font-size: 14px; }
                        .text { font-size: 13px; line-height: 1.6; color: #444; }
                        .font-hindi { font-family: 'Noto Sans Devanagari', sans-serif; }
                    </style>
                </head>
                <body>
                    <div class="title">ANSWER KEY: ${paperTitle}</div>
                    ${tableHtml}
                    
                    <div class="expl-section">
                        <div class="expl-title">DETAILED EXPLANATIONS</div>
                        ${explList || '<div class="text">No explanations provided.</div>'}
                    </div>
                    <script>window.print(); window.close();</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const extractTextAndMath = (html) => {
        if (!html) return "";
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const spans = temp.querySelectorAll('.math-inline');
        spans.forEach(span => {
            const latex = span.getAttribute('data-latex');
            span.replaceWith(` [Math: ${latex}] `);
        });
        return temp.textContent.trim();
    };

    const processRowsForDataExport = () => {
        let currentSubjectEn = "";
        let currentSubjectHi = "";
        const processedRows = [];
        rows.forEach(row => {
            if (row.isHeader) {
                currentSubjectEn = row.subjectName;
                currentSubjectHi = row.subjectName === "PHYSICS" ? "भौतिक विज्ञान" : row.subjectName === "CHEMISTRY" ? "रसायन विज्ञान" : row.subjectName === "MATHEMATICS" ? "गणित" : row.subjectName === "BIOLOGY" ? "जीव विज्ञान" : "";
            } else {
                processedRows.push({
                    ...row,
                    subject_en: row.subject_en || currentSubjectEn,
                    subject_hi: row.subject_hi || currentSubjectHi,
                });
            }
        });
        return processedRows;
    };

    const exportToExcel = () => {
        const dataToExport = processRowsForDataExport();
        const excelData = dataToExport.map(row => ({
            "QID": row.qid,
            "SUBJECT_EN": row.subject_en,
            "SUBJECT_HI": row.subject_hi,
            "TOPIC_EN": row.topic_en,
            "TOPIC_HI": row.topic_hi,
            "DIFFICULTY": row.difficulty,
            "QUESTION_EN": extractTextAndMath(row.question_en),
            "QUESTION_HI": extractTextAndMath(row.question_hi),
            "IMAGE_EN": row.image_en ? "Has Image" : "",
            "IMAGE_HI": row.image_hi ? "Has Image" : "",
            "OPTION_A_EN": extractTextAndMath(row.options.A.en),
            "OPTION_A_HI": extractTextAndMath(row.options.A.hi),
            "OPTION_B_EN": extractTextAndMath(row.options.B.en),
            "OPTION_B_HI": extractTextAndMath(row.options.B.hi),
            "OPTION_C_EN": extractTextAndMath(row.options.C.en),
            "OPTION_C_HI": extractTextAndMath(row.options.C.hi),
            "OPTION_D_EN": extractTextAndMath(row.options.D.en),
            "OPTION_D_HI": extractTextAndMath(row.options.D.hi),
            "ANSWER": row.answer,
            "EXPLANATION_EN": row.explanation_en,
            "EXPLANATION_HI": row.explanation_hi
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
        XLSX.writeFile(workbook, "Paper_Export.xlsx");
    };

    const uploadToDatabase = async () => {
        if (!paperName.trim()) {
            alert("Please enter a Paper Title before uploading.");
            return;
        }

        const token = localStorage.getItem("authToken") || localStorage.getItem("token") || localStorage.getItem("testToken");
        if (!token) {
            alert("Your session has expired. Please log in again to upload to the database.");
            return;
        }

        try {
            setIsUploading(true);
            const dataToUpload = processRowsForDataExport();
            const data = await saveToQuestionBank(dataToUpload, paperName);
            if (data.success) {
                alert(`Success! ${data.message}`);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Upload error", error);
            alert(error.response?.data?.message || "An error occurred while uploading to the database.");
        } finally {
            setIsUploading(false);
        }
    };

    const renderCellInput = ({ value, onChange, placeholder = "", isHindi = false, type = "textarea" }) => {
        const className = `w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm print:hidden ${isHindi ? 'font-hindi' : ''}`;
        return (
            <div className="min-w-[150px]">
                {type === 'input' ? (
                    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={className} />
                ) : (
                    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={className} rows={3} />
                )}
                <div className="hidden print:block whitespace-pre-wrap text-[11px] font-serif border border-gray-300 p-1 min-h-[20px]">
                    {value || '\u00A0'}
                </div>
            </div>
        );
    };

    const renderQuestionCell = ({ rowIndex, lang }) => {
        return (
            <InlineEditor 
                value={rows[rowIndex][`question_${lang}`]} 
                onChange={(val) => updateRow(rowIndex, `question_${lang}`, val)} 
                placeholder={`Q (${lang.toUpperCase()})`} 
                isHindi={lang === 'hi'}
                onRequestMath={(initVal, saveCb) => setMathModal({ isOpen: true, initialValue: initVal, onSave: saveCb })}
            />
        );
    };

    const renderImageCell = ({ rowIndex, lang }) => {
        const image = rows[rowIndex][`image_${lang}`];
        return (
            <div className="min-w-[120px]">
                <div className="print:hidden">
                    <label className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                        <ImageIcon size={20} className="text-gray-400 mb-1" />
                        <span className="text-[10px] text-gray-500">Upload Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(rowIndex, lang, e.target.files[0])} />
                    </label>
                    {image && (
                        <div className="mt-2 relative">
                            <img src={image} alt="Preview" className="w-full object-contain max-h-[100px] border rounded" />
                            <button onClick={() => updateRow(rowIndex, `image_${lang}`, '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                        </div>
                    )}
                </div>
                <div className="hidden print:block border border-gray-400 p-1 text-center">
                    {image ? <img src={image} alt="Img" style={{ maxWidth: '80px', maxHeight: '80px' }} /> : '\u00A0'}
                </div>
            </div>
        );
    };

    const renderOptionCell = ({ rowIndex, optKey, lang }) => {
        const optData = rows[rowIndex].options[optKey];
        const image = optData[`image_${lang}`];

        return (
            <div className="space-y-1">
                <div className="flex items-start gap-2">
                    <InlineEditor 
                        value={optData[lang]} 
                        onChange={(val) => updateRow(rowIndex, `options.${optKey}.${lang}`, val)} 
                        placeholder={`Opt ${optKey} ${lang.toUpperCase()}`} 
                        isHindi={lang === 'hi'}
                        onRequestMath={(initVal, saveCb) => setMathModal({ isOpen: true, initialValue: initVal, onSave: saveCb })}
                    />
                    <label className="shrink-0 mt-1 cursor-pointer hover:text-indigo-600 text-gray-400 transition-colors print:hidden">
                        <Plus size={14} className="border border-gray-200 rounded" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleOptionImageUpload(rowIndex, optKey, lang, e.target.files[0])} />
                    </label>
                </div>
                {image && (
                    <div className="relative inline-block mt-1">
                        <img src={image} alt="" className="max-h-24 max-w-full object-contain border rounded" />
                        <button 
                            onClick={() => updateRow(rowIndex, `options.${optKey}.image_${lang}`, '')} 
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] print:hidden"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`bg-gray-50 transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-[60] p-4 flex flex-col' : 'h-[calc(100vh-140px)] flex flex-col -m-4 md:-m-6'}`}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
                
                .font-hindi {
                    font-family: 'Noto Sans Devanagari', sans-serif;
                }

                @media print {
                    @page { size: A4; margin: 15mm; }
                    body {
                        visibility: hidden;
                        -webkit-print-color-adjust: exact;
                    }
                    #print-area, #print-area * { visibility: visible; }
                    #print-area { 
                        position: absolute; 
                        top: 0; 
                        left: 0; 
                        width: 100%;
                        transform: none;
                        transform-origin: top left;
                    }
                    .document-page {
                        box-shadow: none !important;
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                    input:not(.editable-header-input), textarea, button, select { display: none !important; }
                    .editable-header-input { display: inline-block !important; border: none !important; background: transparent !important; padding: 0 !important; }
                    .print\\:hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                }

                .document-page {
                    width: 280mm;
                    min-height: 297mm;
                    padding: 15mm;
                    margin: 20px auto;
                    background: white;
                    box-shadow: 0 0 30px rgba(0,0,0,0.15);
                    position: relative;
                    transition: width 0.3s ease;
                }

                .editable-header-input {
                    background: transparent;
                    border: 1px solid transparent;
                    text-align: center;
                    width: 100%;
                    padding: 2px;
                    transition: all 0.2s;
                }
                .editable-header-input:hover {
                    border-color: #e5e7eb;
                    background: #f9fafb;
                }
                .editable-header-input:focus {
                    border-color: #6366f1;
                    background: white;
                    outline: none;
                }
                `}
            </style>
            
            {/* ── Attractive Gradient Header ── */}
            <div className={`bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 shadow-xl border-b border-indigo-800/40 z-50 print:hidden shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${isHeaderCollapsed ? 'max-h-0 border-0 shadow-none' : 'max-h-[800px]'}`}>
                {/* Top Row: Brand + Back + Paper Title + Actions */}
                <div className="max-w-[100vw] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 px-3 py-2 rounded-xl transition-all text-xs font-bold shrink-0"
                        title="Go Back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        Back
                    </button>

                    {/* Brand */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="bg-indigo-500/20 border border-indigo-400/30 p-2 rounded-xl">
                            <FunctionSquare className="text-indigo-300" size={20} />
                        </div>
                        <div>
                            <h1 className="text-base font-black text-white tracking-tight leading-none">Paper Generator</h1>
                            <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-0.5">Bilingual Exam Builder</p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-white/10 mx-1 hidden md:block"></div>

                    {/* Paper Title Input */}
                    <input 
                        type="text" 
                        placeholder="Enter Paper Title..."
                        value={paperName}
                        onChange={(e) => setPaperName(e.target.value)}
                        className="text-sm font-semibold bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl focus:border-indigo-400 focus:bg-white/15 outline-none w-56 placeholder:text-white/30 transition-all"
                    />

                    <div className="flex-1" />

                    {/* Toggles Group */}
                    <div className="flex items-center gap-2">
                        {/* Hindi Toggle */}
                        <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2 rounded-xl">
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-wider">Hindi</span>
                            <button 
                                onClick={() => setShowHindi(!showHindi)}
                                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${showHindi ? 'bg-indigo-500' : 'bg-white/20'}`}
                            >
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${showHindi ? 'translate-x-4' : 'translate-x-0.5'}`} />
                            </button>
                        </div>

                        {/* Metadata Toggle */}
                        <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2 rounded-xl">
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-wider">Topic/Level</span>
                            <button 
                                onClick={() => setShowMetadata(!showMetadata)}
                                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${showMetadata ? 'bg-emerald-500' : 'bg-white/20'}`}
                            >
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${showMetadata ? 'translate-x-4' : 'translate-x-0.5'}`} />
                            </button>
                        </div>

                        <button 
                            onClick={() => setIsFullScreen(!isFullScreen)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-2 rounded-xl font-bold transition-all text-xs"
                        >
                            {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                            <span className="hidden sm:inline text-[10px] uppercase tracking-wider">{isFullScreen ? "Exit" : "Fullscreen"}</span>
                        </button>

                        {/* Collapse Header Button */}
                        <button
                            onClick={() => setIsHeaderCollapsed(true)}
                            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white/50 hover:text-white px-3 py-2 rounded-xl transition-all text-xs font-bold"
                            title="Hide toolbar (press ` to restore)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                            <span className="hidden sm:inline text-[10px] uppercase tracking-wider">Hide</span>
                        </button>
                    </div>

                </div>

                {/* Bottom Row: Tools */}
                <div className="border-t border-white/10 px-4 sm:px-6 py-2 flex flex-wrap items-center gap-2">
                    {/* Section Header Adder */}
                    <div className="flex items-center gap-1 bg-purple-500/20 border border-purple-400/30 rounded-lg p-0.5">
                        <select 
                            value={selectedSectionSubject} 
                            onChange={e => setSelectedSectionSubject(e.target.value)} 
                            className="bg-transparent text-purple-300 text-xs font-bold outline-none pl-2 py-1 pr-1"
                        >
                            <option value="PHYSICS">PHYSICS</option>
                            <option value="CHEMISTRY">CHEMISTRY</option>
                            <option value="MATHEMATICS">MATHEMATICS</option>
                            <option value="BIOLOGY">BIOLOGY</option>
                            <option value="MENTAL ABILITY">MENTAL ABILITY</option>
                            <option value="ENGLISH">ENGLISH</option>
                        </select>
                        <button 
                            onClick={() => {
                                const newHeader = { isHeader: true, subjectName: selectedSectionSubject };
                                if (rows.length === 1 && !rows[0].isHeader && !rows[0].question_en && !rows[0].question_hi) {
                                    setRows([newHeader, rows[0]]);
                                } else {
                                    setRows([...rows, newHeader]);
                                }
                            }} 
                            className="flex items-center gap-1 bg-purple-500 text-white px-2 py-1 rounded-md hover:bg-purple-600 font-black transition-colors text-[10px] tracking-wider uppercase"
                        >
                            <Plus size={12} /> Section
                        </button>
                    </div>

                    <button onClick={handleAddRow} className="flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/30 px-3 py-1.5 rounded-lg font-black transition-colors text-xs">
                        <Plus size={14} /> Add Question
                    </button>

                    <div className="h-5 w-px bg-white/10 mx-1"></div>

                    <button onClick={exportToWord} className="flex items-center gap-2 bg-[#2b579a]/80 border border-[#2b579a] text-white px-3 py-1.5 rounded-lg hover:bg-[#2b579a] font-bold transition-colors text-xs">
                        <FileText size={14} /> Export Word
                    </button>

                    <button 
                        onClick={uploadToDatabase} 
                        disabled={isUploading}
                        className={`flex items-center gap-2 text-white px-3 py-1.5 rounded-lg font-bold transition-colors text-xs border ${
                            isUploading 
                                ? 'bg-indigo-400/50 border-indigo-400/30 cursor-not-allowed' 
                                : 'bg-indigo-500/30 border-indigo-400/40 hover:bg-indigo-500/50'
                        }`}
                    >
                        {isUploading ? "Saving..." : "Save to DB"}
                    </button>

                    <button onClick={() => window.print()} className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 font-bold transition-colors text-xs">
                        <Printer size={14} /> Print
                    </button>

                    <button onClick={printAnswerKey} className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg font-bold transition-colors text-xs">
                        <FileJson size={14} /> Answer Key
                    </button>

                    <div className="h-5 w-px bg-white/10 mx-1"></div>

                    {/* Shortcuts Toggle */}
                    <button
                        onClick={() => setShowShortcuts(!showShortcuts)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-colors text-xs border ${
                            showShortcuts
                                ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-300'
                                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                        title="Symbol Shortcuts Reference"
                    >
                        ⌨ Shortcuts
                    </button>
                </div>

                {/* Shortcuts Panel */}
                {showShortcuts && (
                    <div className="border-t border-white/10 bg-slate-950/70">
                        {/* Tab Bar */}
                        <div className="flex border-b border-white/10 px-4 sm:px-6 pt-3 gap-1">
                            {[
                                { id: 'keyboard', label: '⌨ Keyboard', color: 'emerald' },
                                { id: 'text',     label: '/ Text',     color: 'yellow' },
                                { id: 'custom',   label: '✦ My Shortcuts', color: 'pink' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setShortcutTab(tab.id)}
                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-t-lg transition-all border-b-2 ${
                                        shortcutTab === tab.id
                                            ? `border-${tab.color}-400 text-${tab.color}-300 bg-white/5`
                                            : 'border-transparent text-white/40 hover:text-white/70'
                                    }`}
                                >
                                    {tab.label}
                                    {tab.id === 'custom' && customShortcuts.length > 0 && (
                                        <span className="ml-1.5 bg-pink-500/30 text-pink-300 px-1.5 py-0.5 rounded-full text-[8px]">
                                            {customShortcuts.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="px-4 sm:px-6 py-4">
                            {/* Tab: Keyboard Shortcuts */}
                            {shortcutTab === 'keyboard' && (
                                <div>
                                    <p className="text-[9px] text-white/30 mb-3">Press <kbd className="bg-white/10 text-white px-1.5 py-0.5 rounded font-mono">Ctrl+Shift+Key</kbd> while cursor is in any editor field to instantly insert the symbol.</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5">
                                        {KEYBOARD_SHORTCUTS.map(({ combo, symbol, name }) => (
                                            <div key={combo} className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg">
                                                <span className="text-white font-bold text-base shrink-0 w-6 text-center">{symbol}</span>
                                                <div className="min-w-0">
                                                    <div className="text-[9px] text-white/40 truncate">{name}</div>
                                                    <kbd className="text-[9px] font-mono bg-white/10 text-yellow-300 px-1.5 py-0.5 rounded whitespace-nowrap">{combo}</kbd>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab: Text Shortcuts */}
                            {shortcutTab === 'text' && (
                                <div>
                                    <p className="text-[9px] text-white/30 mb-3">Type the shortcut code in any editor field then press <kbd className="bg-white/10 text-white px-1.5 py-0.5 rounded font-mono">Space</kbd> — it auto-replaces. Click to copy symbol.</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {Object.entries(SYMBOL_SHORTCUTS).map(([key, sym]) => (
                                            <button
                                                key={key}
                                                onClick={() => navigator.clipboard.writeText(sym).then(() => {})}
                                                title={`Click to copy ${sym}`}
                                                className="flex items-center gap-1 bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-400/40 px-2 py-1 rounded-lg transition-all group"
                                            >
                                                <span className="text-yellow-300 font-mono text-[9px]">{key}</span>
                                                <span className="text-white/30 text-[9px]">→</span>
                                                <span className="text-white font-bold text-sm group-hover:scale-125 transition-transform inline-block">{sym}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab: My Custom Shortcuts */}
                            {shortcutTab === 'custom' && (
                                <div className="space-y-5">
                                    {/* Add new shortcut form */}
                                    <div className="bg-white/5 border border-pink-400/20 rounded-xl p-4 space-y-3">
                                        <p className="text-[10px] text-pink-300 font-black uppercase tracking-widest">Create New Shortcut</p>
                                        <div className="flex flex-wrap gap-2 items-end">
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">Key (1 letter)</label>
                                                <input
                                                    type="text"
                                                    maxLength={1}
                                                    placeholder="e.g. F"
                                                    value={newShortcut.key}
                                                    onChange={e => setNewShortcut(p => ({ ...p, key: e.target.value.toUpperCase() }))}
                                                    className="w-16 bg-white/10 border border-white/20 text-white text-center font-mono font-bold text-lg px-2 py-1.5 rounded-lg outline-none focus:border-pink-400 uppercase"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">Symbol / Text</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. ∵ or cm²"
                                                    value={newShortcut.symbol}
                                                    onChange={e => setNewShortcut(p => ({ ...p, symbol: e.target.value }))}
                                                    className="w-32 bg-white/10 border border-white/20 text-white font-bold text-lg px-3 py-1.5 rounded-lg outline-none focus:border-pink-400"
                                                />
                                            </div>
                                            <div className="space-y-1 flex-1 min-w-32">
                                                <label className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">Name / Label</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Because"
                                                    value={newShortcut.name}
                                                    onChange={e => setNewShortcut(p => ({ ...p, name: e.target.value }))}
                                                    className="w-full bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-lg outline-none focus:border-pink-400 text-sm"
                                                />
                                            </div>
                                            <button
                                                onClick={addCustomShortcut}
                                                disabled={!newShortcut.key || !newShortcut.symbol}
                                                className="flex items-center gap-1.5 bg-pink-500/30 hover:bg-pink-500/50 border border-pink-400/40 text-pink-200 font-black text-xs px-4 py-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={14} /> Add
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-white/30">Will be triggered with <kbd className="bg-white/10 text-white px-1 rounded font-mono">Ctrl+Shift+{newShortcut.key || '?'}</kbd></p>
                                    </div>

                                    {/* Existing custom shortcuts */}
                                    {customShortcuts.length === 0 ? (
                                        <div className="text-center py-6 text-white/30 text-sm">
                                            <p className="text-2xl mb-2">✦</p>
                                            <p>No custom shortcuts yet. Create your first one above!</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {customShortcuts.map((sc) => (
                                                <div key={sc.key} className="flex items-center gap-2 bg-white/5 border border-pink-400/20 px-3 py-2 rounded-lg group">
                                                    <span className="text-white font-bold text-xl shrink-0 w-8 text-center">{sc.symbol}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[9px] text-white/50 truncate">{sc.name}</div>
                                                        <kbd className="text-[9px] font-mono bg-white/10 text-pink-300 px-1.5 py-0.5 rounded">{sc.combo}</kbd>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteCustomShortcut(sc.key)}
                                                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1 rounded shrink-0"
                                                        title="Delete shortcut"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Restore Pill (only visible when collapsed) */}
            {isHeaderCollapsed && (
                <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] print:hidden">
                    <button 
                        onClick={() => setIsHeaderCollapsed(false)}
                        className="bg-slate-900/90 text-white border border-indigo-500/30 px-4 py-1 rounded-b-xl shadow-lg hover:bg-indigo-600 transition-all flex items-center gap-2 group animate-bounce-subtle"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70 group-hover:opacity-100">Show Toolbar</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><polyline points="18 15 12 9 6 15"/></svg>
                    </button>
                </div>
            )}

            <div className={`flex-1 overflow-auto bg-gray-100/50 ${isDocumentMode ? 'py-10' : 'p-4'} print:bg-white print:p-0 relative`}>
                {isDocumentMode ? (
                    /* WORD-LIKE DOCUMENT VIEW */
                    <div className="document-page" id="print-area">
                        {/* Paper Header */}
                        <div className="text-center space-y-1 mb-8 border-b-2 border-black pb-4">
                            <input 
                                className="editable-header-input text-2xl font-bold uppercase" 
                                value={paperHeader.institute}
                                onChange={(e) => setPaperHeader({...paperHeader, institute: e.target.value})}
                            />
                            <input 
                                className="editable-header-input text-xl font-semibold" 
                                value={paperHeader.exam}
                                onChange={(e) => setPaperHeader({...paperHeader, exam: e.target.value})}
                            />
                            <div className="flex justify-between items-center px-4 pt-2 font-bold text-sm">
                                <span>TIME: <input className="editable-header-input inline-block w-24 text-left font-bold" value={paperHeader.time} onChange={(e) => setPaperHeader({...paperHeader, time: e.target.value})} /></span>
                                <span>CLASS: <input className="editable-header-input inline-block w-24 text-center font-bold" value={paperHeader.classLevel} onChange={(e) => setPaperHeader({...paperHeader, classLevel: e.target.value})} /></span>
                                <span>MAX MARKS: <input className="editable-header-input inline-block w-20 text-right font-bold" value={paperHeader.marks} onChange={(e) => setPaperHeader({...paperHeader, marks: e.target.value})} /></span>
                            </div>
                        </div>
                        <div className="flex flex-col min-h-[1000px] w-full">
                            {(() => {
                                const chunks = [];
                                if (rows.length > 0) {
                                    let currentChunk = { subject: null, items: [], headerIndex: -1 };
                                    rows.forEach((row, idx) => {
                                        if (row.isHeader) {
                                            if (currentChunk.items.length > 0 || currentChunk.subject) {
                                                chunks.push(currentChunk);
                                            }
                                            currentChunk = { subject: row.subjectName, items: [], headerIndex: idx };
                                        } else {
                                            currentChunk.items.push(row);
                                        }
                                    });
                                    if (currentChunk.items.length > 0 || currentChunk.subject) {
                                        chunks.push(currentChunk);
                                    }
                                }

                                const renderQuestionEn = (row) => {
                                    const actualIndex = rows.indexOf(row);
                                    const questionNumber = rows.slice(0, actualIndex + 1).filter(r => !r.isHeader).length;
                                    return (
                                        <div key={`en-${actualIndex}`} className="relative group space-y-4 pb-6 border-b border-gray-50 last:border-0 break-inside-avoid">
                                            <div className="absolute -left-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 print:hidden z-10">
                                                <button onClick={() => handleDeleteRow(actualIndex)} className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100" title="Delete Question"><Trash2 size={12} /></button>
                                                <button onClick={() => {
                                                    const newRows = [...rows];
                                                    const questionCount = rows.filter(r => !r.isHeader).length;
                                                    newRows.splice(actualIndex + 1, 0, defaultRow(questionCount));
                                                    setRows(newRows);
                                                }} className="p-1.5 bg-indigo-50 text-indigo-500 rounded hover:bg-indigo-100" title="Add Question Below"><Plus size={12} /></button>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="font-bold shrink-0 text-sm">Q{questionNumber}.</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start gap-2">{renderQuestionCell({ rowIndex: actualIndex, lang: "en" })}
                                                        <label className="shrink-0 mt-1 cursor-pointer hover:text-indigo-600 text-gray-400 print:hidden"><ImageIcon size={18} className="border p-0.5 rounded bg-gray-50" /><input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(actualIndex, 'en', e.target.files[0])} /></label>
                                                    </div>
                                                    {row.image_en && <div className="mt-2 relative inline-block"><img src={row.image_en} className="max-h-40 border rounded" /><button onClick={() => updateRow(actualIndex, 'image_en', '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] print:hidden">×</button></div>}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pl-8">
                                                {['A', 'B', 'C', 'D'].map(opt => (
                                                    <div key={opt} className={`flex gap-1.5 items-start p-1.5 rounded ${row.answer === opt ? 'bg-green-50 ring-1 ring-green-200 print:bg-transparent print:ring-0' : ''}`}>
                                                        <button onClick={() => updateRow(actualIndex, 'answer', opt)} className={`font-bold text-xs mt-1 shrink-0 w-5 h-5 flex items-center justify-center rounded-full border ${row.answer === opt ? 'bg-green-600 border-green-600 text-white print:bg-white print:text-black print:border-black' : 'bg-gray-100 text-gray-500'}`}>{opt}</button>
                                                        <span className="hidden print:inline font-bold text-sm mt-0.5 mr-1">({opt})</span>
                                                        <div className="flex-1 min-w-0">{renderOptionCell({ rowIndex: actualIndex, optKey: opt, lang: "en" })}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 pl-8 pt-4 border-t border-gray-50 space-y-4 print:hidden">
                                                <div className="space-y-2">
                                                    <div className="text-indigo-600 font-bold text-[10px] uppercase">Explanation</div>
                                                    {renderCellInput({ value: row.explanation_en, onChange: (val) => updateRow(actualIndex, 'explanation_en', val), placeholder: "Explanation..." })}
                                                </div>
                                                {showMetadata && (
                                                    <div className="flex gap-4 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                                                        <div className="flex-1 space-y-1">
                                                            <div className="text-emerald-700 font-bold text-[10px] uppercase">Topic</div>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Enter topic..." 
                                                                value={row.topic_en || ''} 
                                                                onChange={(e) => updateRow(actualIndex, 'topic_en', e.target.value)}
                                                                className="w-full text-sm px-3 py-2 bg-white border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                                                            />
                                                        </div>
                                                        <div className="w-32 space-y-1">
                                                            <div className="text-emerald-700 font-bold text-[10px] uppercase">Level</div>
                                                            <select 
                                                                value={row.difficulty || 'Medium'} 
                                                                onChange={(e) => updateRow(actualIndex, 'difficulty', e.target.value)}
                                                                className="w-full text-sm px-3 py-2 bg-white border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all cursor-pointer"
                                                            >
                                                                <option value="Easy">Easy</option>
                                                                <option value="Medium">Medium</option>
                                                                <option value="Hard">Hard</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                };

                                const renderQuestionHi = (row) => {
                                    const actualIndex = rows.indexOf(row);
                                    const questionNumber = rows.slice(0, actualIndex + 1).filter(r => !r.isHeader).length;
                                    return (
                                        <div key={`hi-${actualIndex}`} className="relative group space-y-5 pb-6 border-b border-gray-50 last:border-0 break-inside-avoid">
                                            <div className="flex gap-2">
                                                <span className="font-bold shrink-0 text-sm">प्र. {questionNumber}.</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start gap-2">{renderQuestionCell({ rowIndex: actualIndex, lang: "hi" })}
                                                        <label className="shrink-0 mt-1 cursor-pointer hover:text-indigo-600 text-gray-400 print:hidden"><ImageIcon size={18} className="border p-0.5 rounded bg-gray-50" /><input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(actualIndex, 'hi', e.target.files[0])} /></label>
                                                    </div>
                                                    {row.image_hi && <div className="mt-2 relative inline-block"><img src={row.image_hi} className="max-h-40 border rounded" /><button onClick={() => updateRow(actualIndex, 'image_hi', '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] print:hidden">×</button></div>}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pl-8">
                                                {['A', 'B', 'C', 'D'].map(opt => (
                                                    <div key={opt} className={`flex gap-1.5 items-start p-1.5 rounded ${row.answer === opt ? 'bg-green-50 ring-1 ring-green-200 print:bg-transparent print:ring-0' : ''}`}>
                                                        <button onClick={() => updateRow(actualIndex, 'answer', opt)} className={`font-bold text-xs mt-1 shrink-0 w-5 h-5 flex items-center justify-center rounded-full border ${row.answer === opt ? 'bg-green-600 border-green-600 text-white print:bg-white print:text-black print:border-black' : 'bg-gray-100 text-gray-500'}`}>{opt}</button>
                                                        <span className="hidden print:inline font-bold text-sm mt-0.5 mr-1">({opt})</span>
                                                        <div className="flex-1 min-w-0">{renderOptionCell({ rowIndex: actualIndex, optKey: opt, lang: "hi" })}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 pl-8 pt-4 border-t border-gray-50 space-y-4 print:hidden">
                                                <div className="space-y-2">
                                                    <div className="text-indigo-600 font-bold text-[10px] uppercase">व्याख्या</div>
                                                    {renderCellInput({ value: row.explanation_hi, onChange: (val) => updateRow(actualIndex, 'explanation_hi', val), placeholder: "व्याख्या...", isHindi: true })}
                                                </div>
                                                {showMetadata && (
                                                    <div className="flex gap-4 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                                                        <div className="flex-1 space-y-1">
                                                            <div className="text-emerald-700 font-bold text-[10px] uppercase">Topic (HI)</div>
                                                            <input 
                                                                type="text" 
                                                                placeholder="विषय दर्ज करें..." 
                                                                value={row.topic_hi || ''} 
                                                                onChange={(e) => updateRow(actualIndex, 'topic_hi', e.target.value)}
                                                                className="w-full text-sm px-3 py-2 bg-white border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all font-hindi"
                                                            />
                                                        </div>
                                                        <div className="w-32 space-y-1">
                                                            <div className="text-emerald-700 font-bold text-[10px] uppercase">Level</div>
                                                            <select 
                                                                value={row.difficulty || 'Medium'} 
                                                                onChange={(e) => updateRow(actualIndex, 'difficulty', e.target.value)}
                                                                className="w-full text-sm px-3 py-2 bg-white border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all cursor-pointer"
                                                            >
                                                                <option value="Easy">Easy</option>
                                                                <option value="Medium">Medium</option>
                                                                <option value="Hard">Hard</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                };

                                return (
                                    <>
                                        {showHindi && (
                                            <div className="flex gap-10 border-b pb-2 mb-6">
                                                <div className="flex-1 text-center font-bold text-xs uppercase tracking-widest text-gray-400">English Version</div>
                                                <div className="flex-1 text-center font-bold text-xs uppercase tracking-widest text-gray-400">हिंदी संस्करण</div>
                                            </div>
                                        )}
                                        {chunks.map((chunk, cIdx) => (
                                            <div key={`chunk-${cIdx}`} className="mb-8 w-full">
                                                {chunk.subject && (
                                                    <div className="w-full my-6 relative group" style={{ columnSpan: 'all' }}>
                                                        <div className="absolute -left-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 print:hidden z-10">
                                                            <button onClick={() => handleDeleteRow(chunk.headerIndex)} className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100"><Trash2 size={12} /></button>
                                                        </div>
                                                        <input 
                                                            value={chunk.subject}
                                                            onChange={e => updateRow(chunk.headerIndex, 'subjectName', e.target.value)}
                                                            className="editable-header-input font-bold text-xl uppercase bg-gray-100 border-y-2 border-black py-3 text-center print:bg-transparent print:border-black print:border-y-2 w-full outline-none" 
                                                        />
                                                    </div>
                                                )}
                                                {showHindi ? (
                                                    <div className="w-full space-y-8">
                                                        {chunk.items.map(row => (
                                                            <div key={`birow-${rows.indexOf(row)}`} className="flex gap-10 w-full border-b border-gray-50 pb-4">
                                                                <div className="flex-1 min-w-0">
                                                                    {renderQuestionEn(row)}
                                                                </div>
                                                                <div className="flex-1 min-w-0 border-l border-gray-100 pl-10 font-hindi">
                                                                    {renderQuestionHi(row)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="columns-1 md:columns-2 gap-10 w-full">
                                                        {chunk.items.map(row => renderQuestionEn(row))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                );
                            })()}
                        </div>
                        
                        <div className="mt-10 pt-10 border-t border-gray-200 text-center text-gray-400 text-xs print:hidden">
                            --- End of Question Paper ---
                        </div>
                    </div>
                ) : (
                    /* TABLE VIEW - Hidden (kept for reference only) */
                    /* This view is no longer accessible from UI */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 print:border-none print:shadow-none print:rounded-none">
                        <table className="w-full text-left border-collapse print-table" id="print-area">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider print:bg-gray-200 print:text-[10px] sticky top-0 z-30">
                                    <th className="p-3 border-b font-medium print:border-black print:p-1 sticky left-0 z-20 bg-gray-50 print:static">QID</th>
                                    <th className="p-3 border-b font-medium print:border-black print:p-1">DIFFICULTY</th>
                                    <th className="p-3 border-b font-medium print:border-black print:p-1">SUBJECT_EN</th>
                                    <th className="p-3 border-b font-medium print:border-black print:p-1">TOPIC_EN</th>
                                    <th className="p-3 border-b font-medium print:border-black print:p-1">QUESTION_EN</th>
                                    <th className="p-3 border-b font-medium print:border-black print:p-1">IMAGE_EN</th>
                                    <th className="p-3 border-b font-medium print:border-black print:p-1">OPT_A_EN</th>
                                    <th className="p-3 border-b font-medium print:border-black print:p-1">OPT_B_EN</th>
                                    <th className="p-3 border-b font-medium print:border-black print:p-1">OPT_C_EN</th>
                                    <th className="p-3 border-b font-medium print:border-black print:p-1">OPT_D_EN</th>
                                    <th className="p-3 border-b font-medium print:border-black print:p-1">EXPL_EN</th>
                                    
                                    {showHindi && (
                                        <>
                                            <th className="p-3 border-b font-medium print:border-black print:p-1 bg-orange-50/50">SUBJECT_HI</th>
                                            <th className="p-3 border-b font-medium print:border-black print:p-1 bg-orange-50/50">TOPIC_HI</th>
                                            <th className="p-3 border-b font-medium print:border-black print:p-1 bg-orange-50/50">QUESTION_HI</th>
                                            <th className="p-3 border-b font-medium print:border-black print:p-1 bg-orange-50/50">IMAGE_HI</th>
                                            <th className="p-3 border-b font-medium print:border-black print:p-1 bg-orange-50/50">OPT_A_HI</th>
                                            <th className="p-3 border-b font-medium print:border-black print:p-1 bg-orange-50/50">OPT_B_HI</th>
                                            <th className="p-3 border-b font-medium print:border-black print:p-1 bg-orange-50/50">OPT_C_HI</th>
                                            <th className="p-3 border-b font-medium print:border-black print:p-1 bg-orange-50/50">OPT_D_HI</th>
                                            <th className="p-3 border-b font-medium print:border-black print:p-1 bg-orange-50/50">EXPL_HI</th>
                                        </>
                                    )}
                                    
                                    <th className="p-3 border-b font-medium print:border-black print:p-1">ANSWER</th>
                                    <th className="p-3 border-b font-medium print:border-black print:p-1 print:hidden">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {rows.map((row, index) => {
                                    if (row.isHeader) {
                                        return (
                                            <tr key={index} className="bg-purple-50 group hover:bg-purple-100 transition-colors">
                                                <td colSpan={showHindi ? "20" : "11"} className="p-3 print:p-1 font-bold text-purple-800 text-center uppercase relative">
                                                    <input 
                                                        value={row.subjectName} 
                                                        onChange={e => updateRow(index, 'subjectName', e.target.value)} 
                                                        className="bg-transparent text-center outline-none uppercase font-bold w-full" 
                                                    />
                                                    <button onClick={() => handleDeleteRow(index)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-200 rounded transition-opacity">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                    return (
                                    <tr key={index} className="hover:bg-gray-50/50 print:hover:bg-transparent transition-colors">
                                        <td className="p-3 print:p-1 align-top print:border-black sticky left-0 z-10 bg-white group-hover:bg-gray-50/50 print:static print:bg-transparent">
                                            {renderCellInput({ value: row.qid, onChange: (val) => updateRow(index, 'qid', val), type: "input" })}
                                        </td>
                                        <td className="p-3 print:p-1 align-top print:border-black">
                                            <div className="min-w-[120px]">
                                                <select 
                                                    value={row.difficulty} 
                                                    onChange={e => updateRow(index, 'difficulty', e.target.value)}
                                                    className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 text-sm print:hidden"
                                                >
                                                    <option value="Easy">Easy</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hard">Hard</option>
                                                </select>
                                                <div className="hidden print:block text-[11px] border border-gray-300 p-1">{row.difficulty}</div>
                                            </div>
                                        </td>
                                        <td className="p-3 print:p-1 align-top print:border-black">
                                            <select 
                                                value={row.subject_en || ""} 
                                                onChange={(e) => {
                                                    updateRow(index, 'subject_en', e.target.value);
                                                    if (showHindi) {
                                                        const hiTranslation = e.target.value === "PHYSICS" ? "भौतिक विज्ञान" : e.target.value === "CHEMISTRY" ? "रसायन विज्ञान" : e.target.value === "MATHEMATICS" ? "गणित" : e.target.value === "BIOLOGY" ? "जीव विज्ञान" : "";
                                                        if (hiTranslation) updateRow(index, 'subject_hi', hiTranslation);
                                                    }
                                                }}
                                                className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 text-sm print:hidden"
                                            >
                                                <option value="">No Subject</option>
                                                <option value="PHYSICS">PHYSICS</option>
                                                <option value="CHEMISTRY">CHEMISTRY</option>
                                                <option value="MATHEMATICS">MATHEMATICS</option>
                                                <option value="BIOLOGY">BIOLOGY</option>
                                                <option value="MENTAL ABILITY">MENTAL ABILITY</option>
                                            </select>
                                            <div className="hidden print:block text-[11px] p-1">{row.subject_en}</div>
                                        </td>
                                        <td className="p-3 print:p-1 align-top print:border-black">{renderCellInput({ value: row.topic_en, onChange: (val) => updateRow(index, 'topic_en', val), type: "input" })}</td>
                                        <td className="p-3 print:p-1 align-top print:border-black">{renderQuestionCell({ rowIndex: index, lang: "en" })}</td>
                                        <td className="p-3 print:p-1 align-top print:border-black">{renderImageCell({ rowIndex: index, lang: "en" })}</td>
                                        <td className="p-3 print:p-1 align-top print:border-black">{renderOptionCell({ rowIndex: index, optKey: "A", lang: "en" })}</td>
                                        <td className="p-3 print:p-1 align-top print:border-black">{renderOptionCell({ rowIndex: index, optKey: "B", lang: "en" })}</td>
                                        <td className="p-3 print:p-1 align-top print:border-black">{renderOptionCell({ rowIndex: index, optKey: "C", lang: "en" })}</td>
                                        <td className="p-3 print:p-1 align-top print:border-black">{renderOptionCell({ rowIndex: index, optKey: "D", lang: "en" })}</td>
                                        <td className="p-3 print:p-1 align-top print:border-black">{renderCellInput({ value: row.explanation_en, onChange: (val) => updateRow(index, 'explanation_en', val), placeholder: "Expl. EN" })}</td>

                                        {showHindi && (
                                            <>
                                                <td className="p-3 print:p-1 align-top print:border-black bg-orange-50/30">{renderCellInput({ value: row.subject_hi, onChange: (val) => updateRow(index, 'subject_hi', val), isHindi: true, type: "input" })}</td>
                                                <td className="p-3 print:p-1 align-top print:border-black bg-orange-50/30">{renderCellInput({ value: row.topic_hi, onChange: (val) => updateRow(index, 'topic_hi', val), isHindi: true, type: "input" })}</td>
                                                <td className="p-3 print:p-1 align-top print:border-black bg-orange-50/30">{renderQuestionCell({ rowIndex: index, lang: "hi" })}</td>
                                                <td className="p-3 print:p-1 align-top print:border-black bg-orange-50/30">{renderImageCell({ rowIndex: index, lang: "hi" })}</td>
                                                <td className="p-3 print:p-1 align-top print:border-black bg-orange-50/30">{renderOptionCell({ rowIndex: index, optKey: "A", lang: "hi" })}</td>
                                                <td className="p-3 print:p-1 align-top print:border-black bg-orange-50/30">{renderOptionCell({ rowIndex: index, optKey: "B", lang: "hi" })}</td>
                                                <td className="p-3 print:p-1 align-top print:border-black bg-orange-50/30">{renderOptionCell({ rowIndex: index, optKey: "C", lang: "hi" })}</td>
                                                <td className="p-3 print:p-1 align-top print:border-black bg-orange-50/30">{renderOptionCell({ rowIndex: index, optKey: "D", lang: "hi" })}</td>
                                                <td className="p-3 print:p-1 align-top print:border-black bg-orange-50/30">{renderCellInput({ value: row.explanation_hi, onChange: (val) => updateRow(index, 'explanation_hi', val), placeholder: "Expl. HI", isHindi: true })}</td>
                                            </>
                                        )}

                                        <td className="p-3 print:p-1 align-top print:border-black">
                                            <div className="min-w-[80px]">
                                                <select 
                                                    value={row.answer} 
                                                    onChange={e => updateRow(index, 'answer', e.target.value)}
                                                    className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 text-sm print:hidden"
                                                >
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="C">C</option>
                                                    <option value="D">D</option>
                                                </select>
                                                <div className="hidden print:block text-[11px] border border-gray-300 p-1 font-bold text-center">{row.answer}</div>
                                            </div>
                                        </td>
                                        <td className="p-3 print:p-1 align-top print:border-black print:hidden">
                                            <button 
                                                onClick={() => handleDeleteRow(index)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Row"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* HIDDEN ANSWER KEY AREA FOR PRINTING */}
            <div id="answer-key-area" className="hidden">
                <div className="title">ANSWER KEY: {paperName || paperHeader.exam}</div>
                {rows.map((row, index) => (
                    <div key={index} className="item">
                        <div>
                            <span className="q-num">Question {index + 1}:</span>
                            <span className="ans">Correct Answer: {row.answer}</span>
                        </div>
                        {(row.explanation_en || row.explanation_hi) && (
                            <div className="expl">
                                {row.explanation_en && <div className="mb-1"><strong>EN:</strong> {row.explanation_en}</div>}
                                {showHindi && row.explanation_hi && <div className="font-hindi"><strong>HI:</strong> {row.explanation_hi}</div>}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <MathEditorModal 
                isOpen={mathModal.isOpen}
                initialValue={mathModal.initialValue}
                onClose={() => setMathModal({ isOpen: false, initialValue: "", onSave: null })}
                onSave={(val) => {
                    if (mathModal.onSave) {
                        mathModal.onSave(val);
                    }
                    setMathModal({ isOpen: false, initialValue: "", onSave: null });
                }}
            />
        </div>
    );
}
