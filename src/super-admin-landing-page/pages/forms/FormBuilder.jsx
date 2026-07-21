import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, GripVertical, Copy, ArrowLeft, CornerDownRight, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { createForm, getFormById, updateForm } from '../../api/formApi';
import { useAppContext } from '../../context/AppContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction',
    'align',
    'link', 'image', 'video'
];

export default function FormBuilder() {
    const { id } = useParams();
    const { user } = useAppContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Prevent creation for Sub-Admins
        if (!id && (user?.role === 'SUB_ADMIN' || user?.role === 'COUNSELOR')) {
            toast.error("You don't have permission to create new forms");
            navigate('/admin/forms');
            return;
        }
    }, [id, user, navigate]);
    const [formData, setFormData] = useState({
        title: 'Untitled Form',
        description: '',
        questions: [],
        isActive: true,
        slug: '',
        images: []
    });

    useEffect(() => {
        if (id) {
            fetchForm();
        } else {
            // Add one default question to start with
            addQuestion();
        }
    }, [id]);

    const fetchForm = async () => {
        try {
            setLoading(true);
            const data = await getFormById(id);
            if (data.success) {
                console.log('Raw API Questions:', data.data.questions.map(q => ({ id: q.id, isActive: q.isActive })));

                // DATA NORMALIZATION: Ensure isActive is boolean true by default if missing
                const normalizedQuestions = data.data.questions.map(q => ({
                    ...q,
                    isActive: q.isActive !== false // Sets to true if undefined/null/true
                }));

                setFormData({
                    ...data.data,
                    questions: normalizedQuestions
                });
            } else {
                toast.error('Failed to load form');
                navigate('/admin/forms');
            }
        } catch (error) {
            toast.error('Error fetching form details');
        } finally {
            setLoading(false);
        }
    };

    const updateFormHeader = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    id: Date.now().toString(), // simplistic ID for UI key
                    type: 'short_answer',
                    questionText: 'Question',
                    options: ['Option 1'],
                    required: false,
                    isActive: true,
                    logic: {}
                }
            ]
        }));
    };

    const updateQuestion = (index, key, value) => {
        setFormData(prev => {
            let newQuestions = [...prev.questions];
            
            // If setting a question as the Student Name, unset it for all others
            if (key === 'isStudentName' && value === true) {
                newQuestions = newQuestions.map((q, i) => ({
                    ...q,
                    isStudentName: i === index
                }));
            } else {
                newQuestions[index] = { ...newQuestions[index], [key]: value };
            }
            
            return { ...prev, questions: newQuestions };
        });
    };

    const removeQuestion = (index) => {
        const newQuestions = [...formData.questions];
        newQuestions.splice(index, 1);
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const duplicateQuestion = (index) => {
        const newQuestions = [...formData.questions];
        const qToCopy = { ...newQuestions[index], id: Date.now().toString() };
        newQuestions.splice(index + 1, 0, qToCopy);
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    }

    const addOption = (qIndex) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options.push(`Option ${newQuestions[qIndex].options.length + 1}`);
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const updateOption = (qIndex, oIndex, val) => {
        const newQuestions = [...formData.questions];
        const oldVal = newQuestions[qIndex].options[oIndex];
        newQuestions[qIndex].options[oIndex] = val;

        // Also update any dependent questions
        newQuestions.forEach(q => {
            if (q.logic?.targetQuestionId === newQuestions[qIndex].id && q.logic?.targetValue === oldVal) {
                q.logic.targetValue = val;
            }
        });

        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };
    const addConditionalQuestion = (parentIndex, optionValue) => {
        setFormData(prev => {
            const newQuestions = [...prev.questions];
            const parentQ = newQuestions[parentIndex];

            const newQ = {
                id: Date.now().toString(),
                type: 'short_answer',
                questionText: 'Question',
                options: ['Option 1'],
                required: false,
                logic: {
                    targetQuestionId: parentQ.id,
                    targetValue: optionValue,
                    condition: 'equals'
                },
                isActive: true,
                isBranching: true
            };

            // Insert immediately after parent
            newQuestions.splice(parentIndex + 1, 0, newQ);

            return {
                ...prev,
                questions: newQuestions
            };
        });
        toast.success(`Added new question linked to "${optionValue}"`);
    };


    const addSubQuestion = (parentIndex, optionValue) => {
        setFormData(prev => {
            const newQuestions = [...prev.questions];
            const parentQ = newQuestions[parentIndex];

            const newQ = {
                id: Date.now().toString(),
                type: parentQ.type === 'short_answer' || parentQ.type === 'paragraph' ? 'short_answer' : parentQ.type, // Inherit type if possible
                questionText: `Details for ${optionValue}`, // More generic label
                options: ['Option 1'],
                required: false,
                logic: {
                    targetQuestionId: parentQ.id,
                    targetValue: optionValue,
                    condition: 'equals'
                },
                isActive: true
            };

            // Insert immediately after parent
            newQuestions.splice(parentIndex + 1, 0, newQ);

            return {
                ...prev,
                questions: newQuestions
            };
        });
        toast.success(`Added follow-up question for "${optionValue}"`);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const loadingToast = toast.loading(`Uploading ${files.length} image(s)...`);

        try {
            // Convert images to base64 for upload
            const base64Images = await Promise.all(
                files.map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                })
            );

            // Upload to Cloudinary
            const { uploadFormImages } = await import('../../api/formApi');
            const response = await uploadFormImages(base64Images);

            if (response.success) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...response.imageUrls]
                }));
                toast.success(`${files.length} image(s) uploaded successfully!`, { id: loadingToast });
            } else {
                toast.error('Failed to upload images', { id: loadingToast });
            }
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload images to cloud', { id: loadingToast });
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        toast.success('Image removed');
    };

    const handleLandingPageFileUpload = async (e, type) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const { uploadFile } = await import('../../api/formApi');

        if (type === 'video') {
            const file = files[0];
            if (file.size > 50 * 1024 * 1024) return toast.error('Video size must be less than 50MB');

            const loadingToast = toast.loading('Uploading video...');
            try {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const data = await uploadFile(reader.result);
                    if (data.success) {
                        setFormData(prev => ({
                            ...prev,
                            settings: {
                                ...prev.settings,
                                landingPage: { ...prev.settings?.landingPage, videoUrl: data.url }
                            }
                        }));
                        toast.success('Video uploaded successfully!', { id: loadingToast });
                    } else {
                        toast.error('Failed to upload video', { id: loadingToast });
                    }
                };
            } catch (error) {
                console.error('Upload error:', error);
                toast.error('Failed to upload video', { id: loadingToast });
            }
        } else if (type === 'image') {
            const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
            if (validFiles.length < files.length) {
                toast.error('Some images were skipped (max 5MB).');
            }
            if (!validFiles.length) return;

            const loadingToast = toast.loading(`Uploading ${validFiles.length} images...`);
            try {
                const newUrls = [];
                for (const file of validFiles) {
                    const base64 = await new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                    });
                    const data = await uploadFile(base64);
                    if (data.success) newUrls.push(data.url);
                }

                if (newUrls.length > 0) {
                    setFormData(prev => {
                        const existingImages = prev.settings?.landingPage?.bannerImages || [];
                        const legacyImage = prev.settings?.landingPage?.bannerImage;
                        const mergedImages = [...existingImages];

                        if (legacyImage && !mergedImages.includes(legacyImage)) {
                            mergedImages.push(legacyImage);
                        }

                        return {
                            ...prev,
                            settings: {
                                ...prev.settings,
                                landingPage: {
                                    ...prev.settings?.landingPage,
                                    bannerImages: [...mergedImages, ...newUrls],
                                    bannerImage: ''
                                }
                            }
                        };
                    });
                    toast.success('Images uploaded successfully!', { id: loadingToast });
                } else {
                    toast.error('Failed to upload images', { id: loadingToast });
                }
            } catch (error) {
                console.error('Upload error:', error);
                toast.error('Error uploading images', { id: loadingToast });
            }
        }
    };

    const saveForm = async () => {
        if (!formData.title.trim()) {
            return toast.error("Form title is required");
        }

        try {
            setLoading(true);

            // Clean payload
            const payload = { ...formData };
            if (!payload.slug || !payload.slug.trim()) {
                delete payload.slug;
            }

            // Ensure isActive is strictly boolean for all questions
            payload.questions = payload.questions.map(q => ({
                ...q,
                isActive: q.isActive !== false // Normalizes undefined/true -> true, false -> false
            }));

            console.log('Final Payload Questions:', payload.questions.map(q => ({ id: q.id, isActive: q.isActive })));

            let data;
            if (id) {
                data = await updateForm(id, payload);
            } else {
                data = await createForm(payload);
            }

            if (data.success) {
                toast.success(id ? 'Form updated successfully' : 'Form created successfully');
                if (!id) navigate('/admin/forms');
            } else {
                toast.error(data.message || 'Error saving form');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to save form');
        } finally {
            setLoading(false);
        }
    };

    const renderQuestionCard = (q) => {
        // Find the original index for update handlers
        const qIndex = formData.questions.findIndex(item => item.id === q.id);
        if (qIndex === -1) return null;

        return (
            <div key={q.id} className={`relative group transition-all duration-200 ${q.logic?.targetQuestionId && !q.isBranching ? 'mt-2 ml-8 pl-4 border-l-2 border-indigo-300' : 'bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md'}`}>

                {/* Visual Connector for Child Questions */}
                {q.logic?.targetQuestionId && (
                    <div className="absolute -left-6 top-8 w-6 h-8 border-l-2 border-b-2 border-indigo-200 rounded-bl-xl"></div>
                )}

                {/* Left Indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity ${q.logic?.targetQuestionId ? 'bg-indigo-500' : 'bg-blue-600'}`}></div>

                {/* Drag Handle (Visual only for now) */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-gray-300 cursor-move md:hidden">
                    <GripVertical size={20} />
                </div>

                {/* Question Header */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        {q.logic?.targetQuestionId && (
                            <div className="text-xs text-indigo-500 font-medium mb-1 flex items-center gap-1.5 opacity-80">
                                <CornerDownRight size={12} />
                                <span className="mr-1">Linked to:</span>
                                <span className="font-semibold">
                                    {/* Look up parent question text */}
                                    {formData.questions.find(p => p.id === q.logic.targetQuestionId)?.questionText || 'Parent Question'}
                                </span>
                                <span className="text-indigo-300">→</span>
                                <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">
                                    {q.logic.targetValue}
                                </span>
                            </div>
                        )}
                        <input
                            type="text"
                            className={`w-full transition-all font-medium ${q.logic?.targetQuestionId
                                ? 'bg-transparent border-b border-gray-300 hover:border-blue-400 focus:border-blue-600 focus:outline-none py-2 text-sm text-gray-700'
                                : 'bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-md p-3'
                                }`}
                            placeholder={q.logic?.targetQuestionId ? "Sub-option detail..." : "Question Text"}
                            value={q.questionText}
                            onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-60">
                        <select
                            className="w-full bg-white border border-gray-200 rounded-md p-3 focus:border-blue-500 focus:outline-none shadow-sm"
                            value={q.type}
                            onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                        >
                            <option value="short_answer">Short Answer</option>
                            <option value="paragraph">Paragraph</option>
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="checkbox">Checkboxes</option>
                            <option value="dropdown">Dropdown</option>
                            <option value="date">Date</option>
                            <option value="time">Time</option>
                            <option value="phone">Phone Number (+91)</option>
                            <option value="file_upload">File Upload</option>
                        </select>
                    </div>
                </div>

                {/* Question Body */}
                <div className="mb-4">
                    {/* Text Preview */}
                    {(q.type === 'short_answer' || q.type === 'paragraph' || q.type === 'date' || q.type === 'time' || q.type === 'phone' || q.type === 'file_upload') && (
                        <div className="border-b border-dotted border-gray-300 p-2 text-gray-400 text-sm">
                            {q.type === 'short_answer' && 'Short answer text'}
                            {q.type === 'paragraph' && 'Long answer text'}
                            {q.type === 'date' && 'Day, Month, Year'}
                            {q.type === 'time' && 'Time'}
                            {q.type === 'phone' && '+91 XXXXX XXXXX'}
                            {q.type === 'file_upload' && 'File Upload Input (Max 20MB)'}
                        </div>
                    )}

                    {/* Options Preview with Recursion */}
                    {(q.type === 'multiple_choice' || q.type === 'checkbox' || q.type === 'dropdown') && (
                        <div className="space-y-2">
                            {q.options.map((option, oIndex) => {
                                // Find any child questions for this specific option
                                const childQuestions = formData.questions.filter(
                                    child => child.logic?.targetQuestionId === q.id && child.logic?.targetValue === option && !child.isBranching
                                );

                                return (
                                    <div key={oIndex} className="block">
                                        <div className="flex items-center gap-2 group/option relative">
                                            {q.type === 'multiple_choice' && <div className="w-4 h-4 rounded-full border border-gray-400"></div>}
                                            {q.type === 'checkbox' && <div className="w-4 h-4 rounded border border-gray-400"></div>}
                                            {q.type === 'dropdown' && <span className="text-gray-400 text-sm">{oIndex + 1}.</span>}

                                            <input
                                                type="text"
                                                className="flex-1 border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:outline-none p-1 text-sm form-input"
                                                value={option}
                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                            />

                                            <button
                                                onClick={() => addSubQuestion(qIndex, option)}
                                                className="text-gray-400 hover:text-blue-600 opacity-0 group-hover/option:opacity-100 transition p-1"
                                                title="Add Follow-up Question"
                                            >
                                                <CornerDownRight size={16} />
                                            </button>

                                            <button
                                                onClick={() => addConditionalQuestion(qIndex, option)}
                                                className="text-gray-400 hover:text-emerald-600 opacity-0 group-hover/option:opacity-100 transition p-1"
                                                title="Add New Question Logic"
                                            >
                                                <PlusCircle size={16} />
                                            </button>

                                            {q.options.length > 1 && (
                                                <button onClick={() => removeOption(qIndex, oIndex)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover/option:opacity-100 transition">
                                                    <XSmallIcon />
                                                </button>
                                            )}
                                        </div>

                                        {/* Recursive Rendering of Children */}
                                        {childQuestions.length > 0 && (
                                            <div className="ml-6 mt-2 pl-4 border-l-2 border-indigo-100">
                                                {childQuestions.map(childQ => renderQuestionCard(childQ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <button onClick={() => addOption(qIndex)} className="text-blue-600 text-sm hover:underline font-medium pl-6">
                                + Add Option
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end items-center gap-4 border-t border-gray-100 pt-4 mt-4">
                    <button
                        onClick={() => duplicateQuestion(qIndex)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full hover:text-gray-700 transition"
                        title="Duplicate">
                        <Copy size={18} />
                    </button>
                    <button
                        onClick={() => removeQuestion(qIndex)}
                        className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition"
                        title="Delete">
                        <Trash2 size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 font-medium" title="Map this to the Lead's Name">
                            Student Name Field?
                        </label>
                        <div
                            onClick={() => updateQuestion(qIndex, 'isStudentName', !q.isStudentName)}
                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${q.isStudentName ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            title="Mark this as the Student Name field"
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${q.isStudentName ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 font-medium">{q.isActive === false ? 'Hidden' : 'Visible'}</label>
                        <div
                            onClick={() => updateQuestion(qIndex, 'isActive', q.isActive === false ? true : false)}
                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${q.isActive !== false ? 'bg-green-500' : 'bg-gray-300'}`}
                            title="Hide/Show Question"
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${q.isActive !== false ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 font-medium">Required</label>
                        <div
                            onClick={() => updateQuestion(qIndex, 'required', !q.required)}
                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${q.required ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${q.required ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading && id && formData.questions.length === 0) {
        return <div className="p-10 text-center">Loading Builder...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 mb-6 flex justify-between items-center rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/forms')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {id ? 'Edit Form' : 'New Form'}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Status Toggle */}
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                        <span className={`text-sm font-medium ${formData.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                            {formData.isActive ? 'Accepting Responses' : 'Not Accepting Responses'}
                        </span>
                        <button
                            onClick={() => updateFormHeader('isActive', !formData.isActive)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="h-8 w-px bg-gray-200"></div>

                    <button
                        onClick={saveForm}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 hover:shadow-lg transition transform hover:-translate-y-0.5 font-medium"
                    >
                        <Save size={18} />
                        {loading ? 'Saving...' : 'Save Form'}
                    </button>
                </div>
            </div>

            {/* Form Title Card */}
            <div className="bg-white rounded-xl shadow-sm border-t-8 border-t-blue-600 border border-gray-200 p-6 mb-6">
                <input
                    type="text"
                    className="w-full text-3xl font-bold border-b-2 border-transparent hover:border-gray-200 focus:border-blue-600 focus:outline-none p-2 mb-2 transition-colors"
                    placeholder="Form Title"
                    value={formData.title}
                    onChange={(e) => updateFormHeader('title', e.target.value)}
                />
                <textarea
                    className="w-full text-gray-600 border-b border-transparent hover:border-gray-200 focus:border-blue-600 focus:outline-none p-2 resize-none transition-colors"
                    placeholder="Form Description"
                    rows="2"
                    value={formData.description}
                    onChange={(e) => updateFormHeader('description', e.target.value)}
                />

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                    {/* Slug Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Form URL Slug <span className="text-gray-500">(Optional - creates a custom URL)</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">/form/</span>
                            <input
                                type="text"
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="my-awesome-form"
                                value={formData.slug}
                                onChange={(e) => updateFormHeader('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                            />
                        </div>
                        {formData.slug && (
                            <p className="mt-1 text-xs text-blue-600">
                                Form will be accessible at: <span className="font-mono">{window.location.origin}/form/{formData.slug}</span>
                            </p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Banner Images <span className="text-gray-500">(Multiple images will show as a slider)</span>
                            <p className="text-xs text-indigo-600 mt-1 font-normal">
                                💡 Recommended Size: <strong>1500x500 px (3:1)</strong> for sleek banners, or <strong>1200x600 px</strong> for taller view.
                            </p>
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md border border-blue-200 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                📸 Upload Images
                            </label>
                            {formData.images.length > 0 && (
                                <span className="text-sm text-gray-600">{formData.images.length} image(s) uploaded</span>
                            )}
                        </div>

                        {/* Image Preview */}
                        {formData.images.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={img}
                                            alt={`Banner ${idx + 1}`}
                                            className="w-full h-24 object-cover rounded-md border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        ⚙️ Form Settings
                    </h3>
                    <div className="space-y-3">
                        {/* <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.settings?.collectEmail}
                                onChange={e => setFormData(prev => ({ ...prev, settings: { ...prev.settings, collectEmail: e.target.checked } }))}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <div>
                                <span className="text-sm font-medium text-gray-700 block">Collect Email Addresses</span>
                                <span className="text-xs text-gray-500">Require users to provide their email</span>
                            </div>
                        </label> */}

                        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.settings?.verifyPhone}
                                onChange={e => setFormData(prev => ({ ...prev, settings: { ...prev.settings, verifyPhone: e.target.checked } }))}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <div>
                                <span className="text-xs text-gray-500">Require OTP verification before submission</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors bg-emerald-50/50">
                            <input
                                type="checkbox"
                                checked={formData.settings?.collectPayment}
                                onChange={e => setFormData(prev => ({ ...prev, settings: { ...prev.settings, collectPayment: e.target.checked } }))}
                                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                            />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-800 block flex items-center gap-2">
                                    💰 Collect Payment
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded border border-emerald-200 uppercase font-bold">Razorpay</span>
                                </span>
                                <span className="text-xs text-gray-500">Require payment before submission</span>
                            </div>
                        </label>

                        {formData.settings?.collectPayment && (
                            <div className="ml-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100 animate-fadeIn">
                                <label className="block text-xs font-semibold text-emerald-800 mb-1">Amount to Collect (INR)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full pl-8 pr-4 py-2 border border-emerald-200 rounded-md focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                                        placeholder="Enter amount (e.g. 500)"
                                        value={formData.settings?.paymentAmount || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            settings: {
                                                ...prev.settings,
                                                paymentAmount: parseInt(e.target.value) || 0
                                            }
                                        }))}
                                    />
                                </div>
                                <p className="text-[10px] text-emerald-600 mt-2">
                                    Note: Users will be redirected to Razorpay checkout. Ensure Razorpay keys are configured in backend.
                                </p>
                            </div>
                        )}

                        {/* <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.settings?.limitOneResponse}
                                onChange={e => setFormData(prev => ({ ...prev, settings: { ...prev.settings, limitOneResponse: e.target.checked } }))}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <div>
                                <span className="text-sm font-medium text-gray-700 block">Limit to One Response</span>
                                <span className="text-xs text-gray-500">Based on browser cookie/local storage</span>
                            </div>
                        </label> */}
                    </div>
                </div>

                {/* Landing Page Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            📄 Landing Page Settings
                        </h3>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm font-medium text-gray-600">Enable Landing Page</span>
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.settings?.landingPage?.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData.settings?.landingPage?.enabled || false}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        settings: {
                                            ...prev.settings,
                                            landingPage: {
                                                ...prev.settings?.landingPage,
                                                enabled: e.target.checked
                                            }
                                        }
                                    }))}
                                />
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.settings?.landingPage?.enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                    </div>

                    {formData.settings?.landingPage?.enabled && (
                        <div className="space-y-4 border-t border-gray-100 pt-4 animate-fadeIn">
                            {/* Banner Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Images (Slider)</label>
                                <p className="text-xs text-gray-500 mb-3">
                                    Recommended size: <strong>1920 x 1080 pixels (16:9 aspect ratio)</strong>. Use images with the same dimensions to prevent cropping or awkward spacing on the landing page.
                                </p>
                                <div className="flex items-center gap-4 mb-3">
                                    <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md border border-blue-200 transition-colors text-sm">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => handleLandingPageFileUpload(e, 'image')}
                                        />
                                        📸 Upload Banners
                                    </label>
                                </div>

                                {/* Render Grid of Banners */}
                                {formData.settings?.landingPage?.bannerImages && formData.settings.landingPage.bannerImages.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                                        {formData.settings.landingPage.bannerImages.map((imgUrl, idx) => (
                                            <div key={idx} className="relative group rounded border border-gray-200 overflow-hidden h-24">
                                                <img src={imgUrl} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            settings: {
                                                                ...prev.settings,
                                                                landingPage: {
                                                                    ...prev.settings.landingPage,
                                                                    bannerImages: prev.settings.landingPage.bannerImages.filter((_, i) => i !== idx)
                                                                }
                                                            }
                                                        }))}
                                                        className="text-white hover:text-red-400 bg-white/10 p-2 rounded-full"
                                                        title="Remove Banner"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Video */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Video (URL or Upload)</label>
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        placeholder="Paste YouTube/Vimeo URL here..."
                                        value={formData.settings?.landingPage?.videoUrl || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            settings: {
                                                ...prev.settings,
                                                landingPage: { ...prev.settings?.landingPage, videoUrl: e.target.value }
                                            }
                                        }))}
                                    />
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 font-medium">OR</span>
                                        <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md border border-slate-200 transition-colors text-xs font-medium">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                className="hidden"
                                                onChange={(e) => handleLandingPageFileUpload(e, 'video')}
                                            />
                                            🎥 Upload Video (Max 50MB)
                                        </label>
                                        {formData.settings?.landingPage?.videoUrl && formData.settings?.landingPage?.videoUrl.includes('s3') && (
                                            <span className="text-xs text-green-600">Video Uploaded!</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content / Description
                                    <span className="ml-2 text-xs text-blue-600 font-normal">
                                        (Tip: Type <strong className="font-bold bg-blue-50 px-1 rounded">{"{{VIDEO}}"}</strong> anywhere to place your uploaded video inside the text!)
                                    </span>
                                </label>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.settings?.landingPage?.content || ''}
                                    onChange={(content, delta, source) => {
                                        if (source === 'user') {
                                            setFormData(prev => ({
                                                ...prev,
                                                settings: {
                                                    ...prev.settings,
                                                    landingPage: { ...prev.settings?.landingPage, content }
                                                }
                                            }))
                                        }
                                    }}
                                    className="bg-white rounded-b-lg"
                                    style={{ height: '300px', marginBottom: '50px' }}
                                />
                            </div>

                            {/* CTA Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    placeholder="e.g. Ready to get started?"
                                    value={formData.settings?.landingPage?.ctaTitle || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        settings: {
                                            ...prev.settings,
                                            landingPage: { ...prev.settings?.landingPage, ctaTitle: e.target.value }
                                        }
                                    }))}
                                />
                            </div>

                            {/* Button Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Action Button Text</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    placeholder="e.g. Proceed to Form"
                                    value={formData.settings?.landingPage?.buttonText || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        settings: {
                                            ...prev.settings,
                                            landingPage: { ...prev.settings?.landingPage, buttonText: e.target.value }
                                        }
                                    }))}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Thank You Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        🎉 Thank You Page Settings
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">Customize what users see after submitting the form</p>

                    <div className="space-y-4">
                        {/* Thank You Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thank You Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                placeholder="Thank You!"
                                value={formData.settings?.thankYou?.title || 'Thank You!'}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    settings: {
                                        ...prev.settings,
                                        thankYou: {
                                            ...prev.settings?.thankYou,
                                            title: e.target.value
                                        }
                                    }
                                }))}
                            />
                        </div>

                        {/* Thank You Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thank You Message</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
                                rows={2}
                                placeholder="Your response has been recorded successfully."
                                value={formData.settings?.thankYou?.message || 'Your response has been recorded successfully.'}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    settings: {
                                        ...prev.settings,
                                        thankYou: {
                                            ...prev.settings?.thankYou,
                                            message: e.target.value
                                        }
                                    }
                                }))}
                            />
                        </div>

                        {/* Action Buttons Section */}
                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Action Buttons</label>
                                    <p className="text-xs text-gray-500">Add buttons to show after thank you message</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        settings: {
                                            ...prev.settings,
                                            thankYou: {
                                                ...prev.settings?.thankYou,
                                                buttons: [
                                                    ...(prev.settings?.thankYou?.buttons || []),
                                                    { text: 'New Button', url: '', style: 'primary' }
                                                ]
                                            }
                                        }
                                    }))}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <Plus size={16} />
                                    Add Button
                                </button>
                            </div>

                            {/* Buttons List */}
                            <div className="space-y-3">
                                {(formData.settings?.thankYou?.buttons || []).map((btn, btnIndex) => (
                                    <div key={btnIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">Button {btnIndex + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    settings: {
                                                        ...prev.settings,
                                                        thankYou: {
                                                            ...prev.settings?.thankYou,
                                                            buttons: prev.settings?.thankYou?.buttons?.filter((_, i) => i !== btnIndex) || []
                                                        }
                                                    }
                                                }))}
                                                className="text-red-500 hover:text-red-600 p-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {/* Button Text */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                                    placeholder="Click Here"
                                                    value={btn.text || ''}
                                                    onChange={(e) => {
                                                        const newButtons = [...(formData.settings?.thankYou?.buttons || [])];
                                                        newButtons[btnIndex] = { ...newButtons[btnIndex], text: e.target.value };
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            settings: {
                                                                ...prev.settings,
                                                                thankYou: { ...prev.settings?.thankYou, buttons: newButtons }
                                                            }
                                                        }));
                                                    }}
                                                />
                                            </div>

                                            {/* Button URL */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">URL (optional)</label>
                                                <input
                                                    type="url"
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                                    placeholder="https://... or leave empty"
                                                    value={btn.url || ''}
                                                    onChange={(e) => {
                                                        const newButtons = [...(formData.settings?.thankYou?.buttons || [])];
                                                        newButtons[btnIndex] = { ...newButtons[btnIndex], url: e.target.value };
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            settings: {
                                                                ...prev.settings,
                                                                thankYou: { ...prev.settings?.thankYou, buttons: newButtons }
                                                            }
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Button Style */}
                                        <div className="mt-3">
                                            <label className="block text-xs font-medium text-gray-600 mb-2">Style</label>
                                            <div className="flex gap-2">
                                                {['primary', 'secondary', 'outline'].map(style => (
                                                    <button
                                                        key={style}
                                                        type="button"
                                                        onClick={() => {
                                                            const newButtons = [...(formData.settings?.thankYou?.buttons || [])];
                                                            newButtons[btnIndex] = { ...newButtons[btnIndex], style };
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                settings: {
                                                                    ...prev.settings,
                                                                    thankYou: { ...prev.settings?.thankYou, buttons: newButtons }
                                                                }
                                                            }));
                                                        }}
                                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${btn.style === style
                                                            ? style === 'primary' ? 'bg-emerald-500 text-white border-emerald-500'
                                                                : style === 'secondary' ? 'bg-gray-600 text-white border-gray-600'
                                                                    : 'bg-white text-gray-700 border-gray-400 ring-2 ring-gray-200'
                                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {style.charAt(0).toUpperCase() + style.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Empty State */}
                                {(!formData.settings?.thankYou?.buttons || formData.settings?.thankYou?.buttons.length === 0) && (
                                    <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p className="text-sm">No buttons added yet</p>
                                        <p className="text-xs mt-1">Click "Add Button" to create one</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {formData.questions
                    .filter(q => !q.logic?.targetQuestionId || q.isBranching) // Render both independent and branching questions at root
                    .map(q => renderQuestionCard(q))
                }
            </div>

            {/* Floating Add Button */}
            {/* Or static bottom button */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={addQuestion}
                    className="flex items-center justify-center p-4 rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition group"
                    title="Add Question"
                >
                    <Plus size={24} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>

        </div >
    );
}

const XSmallIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
