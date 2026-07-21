import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getFormById, getFormBySlug, submitResponse, uploadFile, sendOtp, verifyOtp, updateResponseVerification, createPaymentOrder, updateResponsePayment } from '../../api/formApi';
import UALogo from '../../../landing-page/assets/images/Unacademy-logo.png';
import UALogoH from '../../../landing-page/assets/images/UA_LOGO_Color.png';
import 'react-quill-new/dist/quill.snow.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

export default function FormView({ formId, formSlug, onSuccess, showHeader = true, showFooter = true }) {
    const params = useParams();
    const id = formId || params.id;
    const slug = formSlug || params.slug;

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [respondentEmail, setRespondentEmail] = useState('');
    const [respondentPhone, setRespondentPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [currentResponseId, setCurrentResponseId] = useState(null);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showLandingPage, setShowLandingPage] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState({}); // Track uploading state by question ID

    useEffect(() => {
        fetchForm();
    }, [id, slug]);

    // Auto-rotate images
    useEffect(() => {
        if (form?.images?.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % form.images.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [form?.images]);

    const fetchForm = async () => {
        try {
            let data;
            if (slug) {
                data = await getFormBySlug(slug);
            } else {
                data = await getFormById(id);
            }
            if (data.success) {
                setForm(data.data);
                if (data.data.settings?.landingPage?.enabled) {
                    setShowLandingPage(true);
                }
            } else {
                toast.error('Form not found');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (qId, value) => {
        setAnswers(prev => ({
            ...prev,
            [qId]: value
        }));
    };

    const handleCheckboxChange = (qId, option, checked) => {
        setAnswers(prev => {
            const current = prev[qId] || [];
            if (checked) {
                return { ...prev, [qId]: [...current, option] };
            } else {
                return { ...prev, [qId]: current.filter(item => item !== option) };
            }
        });
    };

    const checkQuestionVisibility = (q) => {
        // Case 1: Root-level question (Standard or Branching)
        if (!q.logic?.targetQuestionId || q.isBranching) {
            if (!q.logic?.targetQuestionId) return true;

            const parentAnswer = answers[q.logic.targetQuestionId];
            return Array.isArray(parentAnswer)
                ? parentAnswer?.includes(q.logic.targetValue)
                : parentAnswer === q.logic.targetValue;
        }

        // Case 2: Nested Child Question
        const parent = form.questions.find(pq => pq.id === q.logic.targetQuestionId);
        if (!parent) return false;

        // Recursive check: Parent must be visible
        if (!checkQuestionVisibility(parent)) return false;

        // Condition check: Parent answer must match logic
        const parentAnswer = answers[parent.id];
        return Array.isArray(parentAnswer)
            ? parentAnswer?.includes(q.logic.targetValue)
            : parentAnswer === q.logic.targetValue;
    };

    const [validationErrors, setValidationErrors] = useState({});

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (responseId = null) => {
        setIsSubmitting(true);
        const toastId = toast.loading('Initiating Payment...');

        try {
            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

            if (!res) {
                toast.error("Razorpay SDK failed to load. Are you online?", { id: toastId });
                setIsSubmitting(false);
                return;
            }

            const orderData = await createPaymentOrder(form.settings.paymentAmount, form.settings.currency || 'INR');

            if (!orderData.success) {
                toast.error(orderData.message || "Failed to create order", { id: toastId });
                setIsSubmitting(false);
                return;
            }

            const options = {
                key: orderData.key,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: form.title,
                description: "Form Submission Fee",
                order_id: orderData.order.id,
                handler: async function (paymentResponse) {
                    toast.dismiss(toastId);
                    toast.success('Payment Successful!');

                    // Update response with payment details
                    if (responseId) {
                        try {
                            await updateResponsePayment(responseId, paymentResponse);
                        } catch (err) {
                            console.error('Failed to update payment status:', err);
                        }
                    }

                    // Proceed to OTP flow or Success
                    initiateOtpFlow(responseId);
                },
                prefill: {
                    name: answers['name'] || '',
                    email: respondentEmail || '',
                    contact: respondentPhone || ''
                },
                notes: {
                    formId: form._id,
                    responseId: responseId
                },
                theme: {
                    color: "#3399cc"
                },
                modal: {
                    ondismiss: function () {
                        toast.dismiss(toastId);
                        // Proceed to OTP flow silently even if payment is cancelled
                        initiateOtpFlow(responseId);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            toast.error('Payment initiation failed. Form submitted as Pending Payment.', { id: toastId });
            setIsSubmitting(false);
            handleSuccess();
        }
    };

    const handleSuccess = () => {
        if (onSuccess) {
            onSuccess({
                thankYou: {
                    ...form.settings?.thankYou,
                    isFormSubmission: true
                }
            });
        } else {
            navigate('thank-you', {
                state: {
                    thankYou: {
                        ...form.settings?.thankYou,
                        isFormSubmission: true
                    }
                }
            });
        }
    };
    const initiateOtpFlow = (responseId) => {
        if (form.settings?.verifyPhone) {
            setCurrentResponseId(responseId);
            setOtpSent(false);
            setShowOtpModal(true);
            handleSendOtp();
        } else {
            handleSuccess();
        }
    };

    const finalizeSubmission = async () => {
        setIsSubmitting(true);

        const trackingData = {
            gclid: searchParams.get('gclid') || undefined,
            utm_source: searchParams.get('utm_source') || undefined,
            utm_medium: searchParams.get('utm_medium') || undefined,
            utm_campaign: searchParams.get('utm_campaign') || undefined,
            utm_term: searchParams.get('utm_term') || undefined
        };

        try {
            const data = await submitResponse({
                formId: form._id,
                answers: Object.keys(answers).map(key => ({ questionId: key, answer: answers[key] })),
                respondentEmail,
                respondentPhone: form.settings?.verifyPhone ? respondentPhone : undefined,
                verificationStatus: form.settings?.verifyPhone ? 'Pending' : 'Not Required',
                trackingData
            });

            if (data.success) {
                if (typeof window !== 'undefined' && window.gtag_report_conversion) {
                    window.gtag_report_conversion();
                }
                const responseId = data.responseId;

                if (form.settings?.collectPayment && form.settings?.paymentAmount > 0) {
                    await handlePayment(responseId);
                } else {
                    initiateOtpFlow(responseId);
                }
            } else {
                toast.error(data.message || 'Submission failed');
                setIsSubmitting(false);
            }
        } catch (error) {
            toast.error('Error submitting form');
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss(); // Dismiss any existing toasts immediately

        const newValidationErrors = {};
        let firstErrorId = null;

        // specific check for phone number if verifyPhone is enabled
        if (form.settings?.verifyPhone) {
            if (!respondentPhone || respondentPhone.length !== 10) {
                newValidationErrors['phone_collection'] = true;
                if (!firstErrorId) firstErrorId = 'phone-collection-section';
            }
        }

        form.questions.forEach(q => {
            // Only validate if question is required AND visible
            if (q.required && checkQuestionVisibility(q)) {
                const val = answers[q.id];
                if (!val || (Array.isArray(val) && val.length === 0)) {
                    newValidationErrors[q.id] = true;
                    if (!firstErrorId) firstErrorId = q.id;
                }
            }
        });

        if (Object.keys(newValidationErrors).length > 0) {
            setValidationErrors(newValidationErrors);

            // Modern Error Toast with ID to prevent duplicates (though dismiss handles it mostly)
            toast.error(
                "Please fill in all required fields marked in red.",
                {
                    id: 'validation-error', // Ensures only one instance exists
                    style: {
                        borderRadius: '12px',
                        background: '#333',
                        color: '#fff',
                    },
                    icon: '⚠️',
                }
            );

            // Scroll to the first error with offset
            if (firstErrorId) {
                // Determine if it is a question ID (which needs 'question-' prefix) or a static section ID
                const elementId = firstErrorId === 'phone-collection-section' ? firstErrorId : `question-${firstErrorId}`;
                const element = document.getElementById(elementId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            return;
        }

        // Clear errors if valid
        setValidationErrors({});

        // CHECK FOR PAYMENT
        // NOW: Submission happens first, then payment is requested.
        await finalizeSubmission();
    };

    const handleSendOtp = async () => {
        if (!respondentPhone || respondentPhone.length !== 10) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }
        setOtpLoading(true);
        try {
            const res = await sendOtp(respondentPhone);
            if (res.success) {
                setOtpSent(true);
                toast.success('OTP sent successfully');
            } else {
                toast.error(res.message || 'Failed to send OTP');
            }
        } catch (error) {
            toast.error('Error sending OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error('Please enter OTP');
            return;
        }
        setOtpLoading(true);
        try {
            const res = await verifyOtp(respondentPhone, otp);

            if (res.success) {
                if (currentResponseId) {
                    await updateResponseVerification(currentResponseId, 'Verified');
                }
                setPhoneVerified(true);
                setShowOtpModal(false);
                toast.success('Phone Verified & Response Recorded');
                if (onSuccess) {
                    onSuccess({
                        thankYou: {
                            ...form.settings?.thankYou,
                            isFormSubmission: true
                        }
                    });
                } else {
                    navigate('thank-you', {
                        state: {
                            thankYou: {
                                ...form.settings?.thankYou,
                                isFormSubmission: true
                            }
                        }
                    });
                }
            } else {
                if (res.debug) {
                    toast.error(`Invalid OTP. Exp: ${res.debug.storedOtp}, You: ${res.debug.inputOtp}`, { duration: 5000 });
                } else {
                    toast.error(res.message || 'Invalid OTP');
                }
            }
        } catch (error) {
            console.error('OTP Verification Error:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error verifying OTP');
            }
        } finally {
            setOtpLoading(false);
        }
    };

    const handleFileUpload = async (qId, files) => {
        if (!files || files.length === 0) return;
        const file = files[0];

        if (file.size > 20 * 1024 * 1024) {
            toast.error('File size exceeds 20MB limit');
            return;
        }

        const loadingToast = toast.loading('Uploading file...');
        setUploadingFiles(prev => ({ ...prev, [qId]: true }));

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result;
                try {
                    const data = await uploadFile(base64);
                    if (data.success) {
                        handleAnswerChange(qId, data.url);
                        toast.success('File uploaded successfully', { id: loadingToast });
                    } else {
                        toast.error(data.message || 'Upload failed', { id: loadingToast });
                    }
                } catch (err) {
                    toast.error('Upload failed. large files may check server timeout.', { id: loadingToast });
                } finally {
                    setUploadingFiles(prev => ({ ...prev, [qId]: false }));
                }
            };
            reader.onerror = () => {
                toast.error('Error reading file', { id: loadingToast });
                setUploadingFiles(prev => ({ ...prev, [qId]: false }));
            };
        } catch (error) {
            console.error(error);
            toast.error('Upload failed', { id: loadingToast });
            setUploadingFiles(prev => ({ ...prev, [qId]: false }));
        }
    };

    const renderQuestion = (q, index) => {
        // Skip rendering if question is hidden
        console.log(`Render Question [${q.id}]: isActive=${q.isActive}`);
        if (q.isActive === false) return null;

        const isChild = !!q.logic?.targetQuestionId && !q.isBranching;
        const hasError = validationErrors[q.id];

        return (
            <div
                key={q.id}
                id={`question-${q.id}`}
                className={`transition-all duration-300 ${isChild
                    ? 'mt-3 sm:mt-4 ml-3 sm:ml-4 pl-4 sm:pl-5 border-l-2 border-cyan-300/50 animate-slideDown'
                    : `bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg shadow-slate-200/50 border transition-all duration-300 ${hasError
                        ? 'border-rose-400 ring-2 ring-rose-100 shadow-rose-100'
                        : 'border-white/60 hover:shadow-xl hover:shadow-cyan-100/30'
                    }`
                    }`}
            >
                {/* Question Header */}
                <div className="flex items-start gap-4 mb-5">
                    {!isChild && index && (
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-300/40">
                            {index}
                        </div>
                    )}
                    <div className="flex-1 pt-1">
                        <h3 className={`font-semibold text-slate-800 leading-relaxed ${isChild ? 'text-base' : 'text-lg'}`}>
                            {q.questionText}
                            {q.required && <span className="text-rose-500 ml-1.5 text-sm">*</span>}
                        </h3>
                    </div>
                </div>

                {/* Short Answer */}
                {q.type === 'short_answer' && (
                    <input
                        type="text"
                        className="w-full px-5 py-4 bg-white/90 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 transition-all duration-200 placeholder:text-slate-400 text-slate-700"
                        placeholder="Type your answer..."
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                )}

                {/* Paragraph */}
                {q.type === 'paragraph' && (
                    <textarea
                        className="w-full px-5 py-4 bg-white/90 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 transition-all duration-200 resize-none placeholder:text-slate-400 text-slate-700"
                        placeholder="Write your detailed response..."
                        rows={4}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                )}

                {/* Phone */}
                {q.type === 'phone' && (
                    <div className="flex bg-white/90 border-2 border-slate-100 rounded-xl focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-50 transition-all duration-200 overflow-hidden">
                        <div className="bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4 text-slate-600 font-semibold border-r border-slate-100 flex items-center gap-2">
                            <span className="text-xl">🇮🇳</span>
                            <span>+91</span>
                        </div>
                        <input
                            type="tel"
                            className="w-full px-5 py-4 focus:outline-none bg-transparent placeholder:text-slate-400 text-slate-700"
                            placeholder="Enter 10 digit number"
                            maxLength={10}
                            value={answers[q.id] || ''}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                handleAnswerChange(q.id, val);
                            }}
                        />
                    </div>
                )}

                {/* Date (Text input to support explicit DD-MM-YYYY format visually if needed, or stick to date type which forces browser locale) */}
                {/* Note: Browser <input type="date"> format is determined by user's OS locale, not code. 
                    To FORCE DD-MM-YYYY, we must use type="text" with pattern or a library. 
                    Switching to text input for explicit format control. */}
                {q.type === 'date' && (
                    <input
                        type="date"
                        className="w-full px-5 py-4 bg-white/90 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 transition-all duration-200 text-slate-700 placeholder-slate-400"
                        placeholder="dd/mm/yyyy"
                        min="1900-01-01"
                        max="2100-12-31"
                        style={{ colorScheme: 'light' }} // Helps Force light mode calendar on some browsers
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                )}

                {/* Time */}
                {q.type === 'time' && (
                    <input
                        type="time"
                        className="w-full px-5 py-4 bg-white/90 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 transition-all duration-200 text-slate-700"
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                )}

                {/* Multiple Choice */}
                {q.type === 'multiple_choice' && (
                    <div className="space-y-3">
                        {q.options.map((opt, idx) => {
                            const isSelected = answers[q.id] === opt;
                            const childQuestions = form.questions.filter(child => child.logic?.targetQuestionId === q.id && child.logic?.targetValue === opt && !child.isBranching);

                            return (
                                <div key={idx}>
                                    <label className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${isSelected
                                        ? 'bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 border-cyan-300 shadow-lg shadow-cyan-100/50'
                                        : 'bg-white/70 border-slate-100 hover:border-cyan-200 hover:bg-white hover:shadow-md'
                                        }`}>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                                            ? 'border-cyan-500 bg-gradient-to-br from-cyan-400 to-blue-500'
                                            : 'border-slate-300 group-hover:border-cyan-400'
                                            }`}>
                                            {isSelected && (
                                                <div className="w-2 h-2 bg-white rounded-full animate-scaleIn"></div>
                                            )}
                                        </div>
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={opt}
                                            className="hidden"
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            checked={isSelected}
                                        />
                                        <span className={`font-medium transition-colors ${isSelected ? 'text-cyan-700' : 'text-slate-700 group-hover:text-slate-900'}`}>{opt}</span>
                                    </label>

                                    {isSelected && childQuestions.length > 0 && (
                                        <div className="mt-3">
                                            {childQuestions.map(childQ => renderQuestion(childQ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* File Upload */}
                {q.type === 'file_upload' && (
                    <div className="space-y-2">
                        <label className="block w-full">
                            <input
                                type="file"
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={(e) => handleFileUpload(q.id, e.target.files)}
                                disabled={uploadingFiles[q.id]}
                                className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2.5 file:px-6
                                    file:rounded-xl file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-cyan-50 file:text-cyan-700
                                    hover:file:bg-cyan-100 transition-all cursor-pointer bg-slate-50/50 rounded-xl border border-slate-200 disabled:opacity-50 disabled:cursor-wait"
                            />
                        </label>
                        {uploadingFiles[q.id] && (
                            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 w-fit">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Uploading...</span>
                            </div>
                        )}
                        {!uploadingFiles[q.id] && answers[q.id] && (
                            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 w-fit">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>File uploaded</span>
                                <a href={answers[q.id]} target="_blank" rel="noopener noreferrer" className="ml-1 font-medium text-emerald-700 hover:underline flex items-center gap-1">
                                    View File
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </div>
                        )}
                        <p className="text-xs text-slate-400 pl-1">Max size: 20MB. Formats: Images, PDF, Docs</p>
                    </div>
                )}

                {/* Checkbox */}
                {q.type === 'checkbox' && (
                    <div className="space-y-3">
                        {q.options.map((opt, idx) => {
                            const isSelected = answers[q.id]?.includes(opt);
                            const childQuestions = form.questions.filter(child => child.logic?.targetQuestionId === q.id && child.logic?.targetValue === opt && !child.isBranching);

                            return (
                                <div key={idx}>
                                    <label className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${isSelected
                                        ? 'bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 border-cyan-300 shadow-lg shadow-cyan-100/50'
                                        : 'bg-white/70 border-slate-100 hover:border-cyan-200 hover:bg-white hover:shadow-md'
                                        }`}>
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                                            ? 'border-cyan-500 bg-gradient-to-br from-cyan-400 to-blue-500'
                                            : 'border-slate-300 group-hover:border-cyan-400'
                                            }`}>
                                            {isSelected && (
                                                <svg className="w-4 h-4 text-white animate-scaleIn" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            onChange={(e) => handleCheckboxChange(q.id, opt, e.target.checked)}
                                            checked={isSelected || false}
                                        />
                                        <span className={`font-medium transition-colors ${isSelected ? 'text-cyan-700' : 'text-slate-700 group-hover:text-slate-900'}`}>{opt}</span>
                                    </label>

                                    {isSelected && childQuestions.length > 0 && (
                                        <div className="mt-3">
                                            {childQuestions.map(childQ => renderQuestion(childQ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Dropdown */}
                {q.type === 'dropdown' && (
                    <div className="space-y-4">
                        <div className="relative">
                            <select
                                className="w-full px-5 py-4 bg-white/90 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 transition-all duration-200 appearance-none cursor-pointer text-slate-700 pr-12"
                                value={answers[q.id] || ''}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            >
                                <option value="">Select an option...</option>
                                {q.options.map((opt, idx) => (
                                    <option key={idx} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {answers[q.id] && form.questions.filter(child => child.logic?.targetQuestionId === q.id && child.logic?.targetValue === answers[q.id] && !child.isBranching).map(childQ => (
                            <div key={childQ.id}>
                                {renderQuestion(childQ)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Loading State
    if (loading) {
        return (
            <div className={showHeader || showFooter ? "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4" : "flex flex-col items-center justify-center p-8 w-full"}>
                <div className="relative flex items-center justify-center mb-8">
                    {/* Logo Container */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-xl shadow-blue-100 flex items-center justify-center relative z-10 p-4 sm:p-5">
                        <img
                            src={UALogo}
                            alt="Loading..."
                            className="w-full h-full object-contain animate-pulse"
                        />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Please Wait
                    </h3>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Not Found State
    if (!form) {
        return (
            <div className={showHeader || showFooter ? "min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-6" : "flex items-center justify-center p-6 w-full"}>
                <div className={`${showHeader || showFooter ? "bg-white/90 backdrop-blur-xl border border-white" : ""} p-8 sm:p-12 rounded-3xl shadow-2xl text-center max-w-md w-full`}>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">Form Not Found</h2>
                    <p className="text-sm sm:text-base text-slate-600">This form doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    // Success State
    if (submitted) {
        const thankYou = form.settings?.thankYou || {};
        const title = thankYou.title || 'Thank You!';
        const message = thankYou.message || 'Your response has been recorded successfully.';
        const buttons = thankYou.buttons || [];

        const handleButtonClick = (url) => {
            if (url) {
                window.location.href = url;
            } else {
                window.location.reload();
            }
        };

        const getButtonStyles = (style) => {
            switch (style) {
                case 'primary':
                    return 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-200 hover:shadow-xl';
                case 'secondary':
                    return 'bg-slate-700 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 hover:shadow-xl';
                case 'outline':
                    return 'bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50';
                default:
                    return 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-200 hover:shadow-xl';
            }
        };

        return (
            <div className={showHeader || showFooter ? "min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6" : "flex items-center justify-center p-4 sm:p-6 w-full"}>
                <div className={`${showHeader || showFooter ? "bg-white/90 backdrop-blur-xl border border-white shadow-2xl" : ""} p-6 sm:p-10 rounded-3xl text-center max-w-lg w-full`}>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200 animate-bounce">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">{title}</h2>
                    <p className="text-base sm:text-lg text-slate-600 mb-8 whitespace-pre-wrap">{message}</p>

                    {/* Multiple Buttons */}
                    {buttons.length > 0 && (
                        <div className="space-y-3">
                            {buttons.map((btn, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleButtonClick(btn.url)}
                                    className={`w-full font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${getButtonStyles(btn.style)}`}
                                >
                                    {btn.text || 'Click Here'}
                                    {btn.url && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Default button if no buttons configured */}
                    {buttons.length === 0 && (
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl transition-all duration-300"
                        >
                            Submit Another Response
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Form Closed State
    if (!form.isActive) {
        return (
            <div className={showHeader || showFooter ? "min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-6" : "flex items-center justify-center p-6 w-full"}>
                <div className={`${showHeader || showFooter ? "bg-white/90 backdrop-blur-xl border border-white" : ""} p-12 rounded-3xl shadow-2xl text-center max-w-md`}>
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Form Closed</h2>
                    <p className="text-slate-600">This form is no longer accepting responses.</p>
                </div>
            </div>
        );
    }

    // Landing Page State
    if (showLandingPage) {
        const lp = form.settings.landingPage;

        // Helper to render video player
        const renderVideo = () => {
            if (!lp.videoUrl) return null;

            // Check if it's a YouTube URL
            const isYouTube = lp.videoUrl.includes('youtube.com') || lp.videoUrl.includes('youtu.be');
            const isVimeo = lp.videoUrl.includes('vimeo.com');

            if (isYouTube) {
                const videoId = lp.videoUrl.split('v=')[1] || lp.videoUrl.split('youtu.be/')[1];
                const cleanId = videoId?.split('&')[0];
                return (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100 mb-8 bg-slate-900">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${cleanId}?autoplay=1&mute=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                );
            }

            if (isVimeo) {
                const videoId = lp.videoUrl.split('vimeo.com/')[1];
                return (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100 mb-8 bg-slate-900">
                        <iframe
                            src={`https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&muted=1`}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                );
            }

            // Assume it's a direct video link (e.g. S3 upload)
            return (
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100 mb-8 bg-slate-900">
                    <video
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        muted
                        playsInline
                        src={lp.videoUrl}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        };

        const hasVideo = !!lp.videoUrl;
        const hasContent = !!lp.content;
        const bannerImagesList = lp.bannerImages && lp.bannerImages.length > 0 ? lp.bannerImages : (lp.bannerImage ? [lp.bannerImage] : []);
        const hasBanner = bannerImagesList.length > 0;

        return (
            <div className="min-h-screen bg-white font-sans flex flex-col w-full selection:bg-blue-100 selection:text-blue-900">

                {/* LANDING PAGE NAVBAR */}
                <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-0 z-50 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16 sm:h-20">
                            {/* Left: Form Title */}
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent tracking-tight truncate max-w-[200px] sm:max-w-md">
                                    {form.title}
                                </h1>
                            </div>

                            {/* Right: Proceed Button */}
                            <div className="flex items-center">
                                <button
                                    onClick={() => setShowLandingPage(false)}
                                    className="inline-flex items-center justify-center px-6 py-2.5 text-sm sm:text-base font-bold text-white transition-all duration-300 ease-out bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    {lp.buttonText || 'Proceed to Form'}
                                    <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* 2. MEDIA SHOWCASE (Slider) */}
                {hasBanner && (
                    <section className="w-full bg-slate-50 animate-fadeIn border-b border-slate-200/50 py-6 sm:py-10">
                        <style>{`
                            .modern-swiper .swiper-button-next,
                            .modern-swiper .swiper-button-prev {
                                background: transparent;
                                width: 48px; height: 48px;
                                color: rgba(15, 23, 42, 0.6);
                                border: none;
                                box-shadow: none;
                                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                opacity: 0;
                            }
                            .modern-swiper:hover .swiper-button-next,
                            .modern-swiper:hover .swiper-button-prev {
                                opacity: 0.8;
                            }
                            .modern-swiper .swiper-button-next:hover,
                            .modern-swiper .swiper-button-prev:hover {
                                background: transparent;
                                color: rgba(15, 23, 42, 1);
                                transform: scale(1.2);
                                opacity: 1;
                            }
                            .modern-swiper .swiper-button-next::after,
                            .modern-swiper .swiper-button-prev::after {
                                font-size: 24px;
                                font-weight: 900;
                                text-shadow: 0 0 15px rgba(255, 255, 255, 0.9);
                            }
                        `}</style>
                        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[40vh] sm:h-[55vh] lg:h-[70vh] group">
                            <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-200/60 relative">
                                <Swiper
                                    modules={[Autoplay, EffectFade, Navigation]}
                                    effect="fade"
                                    speed={1200}
                                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                                    loop={bannerImagesList.length > 1}
                                    navigation={bannerImagesList.length > 1}
                                    className="w-full h-full modern-swiper"
                                >
                                    {bannerImagesList.map((img, idx) => (
                                        <SwiperSlide key={idx} className="w-full h-full flex items-center justify-center bg-slate-100/50">
                                            <img
                                                src={img}
                                                alt={`Landing Page Banner ${idx + 1}`}
                                                className="w-full h-full object-contain sm:object-cover transition-transform duration-[15000ms] ease-linear hover:scale-105"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. CONTENT & VIDEO SECTION */}
                {(hasContent || hasVideo) && (
                    <section className="w-full bg-white py-12 sm:py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {(() => {
                                if (hasContent && lp.content.includes('{{VIDEO}}')) {
                                    const parts = lp.content.split('{{VIDEO}}');
                                    return (
                                        <div className="w-full">
                                            {parts.map((part, index) => (
                                                <React.Fragment key={index}>
                                                    {part && (
                                                        <div
                                                            className="prose prose-slate prose-lg sm:prose-xl max-w-none text-slate-700 leading-relaxed ql-editor px-0"
                                                            dangerouslySetInnerHTML={{ __html: part }}
                                                        ></div>
                                                    )}
                                                    {index < parts.length - 1 && hasVideo && (
                                                        <div className="my-10 w-full flex flex-col justify-center items-center shadow-2xl rounded-2xl overflow-hidden border-4 border-slate-900 bg-slate-900">
                                                            {renderVideo()}
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    );
                                }

                                return (
                                    <div className={`flex flex-col ${hasVideo && hasContent ? 'lg:flex-row gap-12 lg:gap-20 items-start' : 'items-center'}`}>
                                        {/* Rich Text Content */}
                                        {hasContent && (
                                            <div className={`${hasVideo && hasContent ? 'lg:w-1/2' : 'w-full'}`}>
                                                <div
                                                    className="prose prose-slate prose-lg sm:prose-xl max-w-none text-slate-700 leading-relaxed ql-editor px-0"
                                                    dangerouslySetInnerHTML={{ __html: lp.content }}
                                                ></div>
                                            </div>
                                        )}

                                        {/* Video Player */}
                                        {hasVideo && (
                                            <div className={`${hasVideo && hasContent ? 'lg:w-1/2' : 'w-full max-w-2xl mx-auto'} flex flex-col justify-center`}>
                                                {renderVideo()}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </section>
                )}

                {/* 4. FINAL CTA SECTION */}
                <section className="w-full bg-slate-900 py-20 sm:py-32 flex flex-col items-center text-center px-4">
                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-8 tracking-tight">{lp.ctaTitle || 'Ready to get started?'}</h2>
                    <button
                        onClick={() => setShowLandingPage(false)}
                        className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-slate-900 bg-white rounded-full hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 focus:outline-none focus:ring-4 focus:ring-slate-400"
                    >
                        {lp.buttonText || 'Proceed to Form'}
                    </button>
                </section>

            </div>
        );
    }

    const rootQuestions = form ? form.questions.filter(q => (!q.logic?.targetQuestionId || q.isBranching) && q.isActive !== false) : [];
    const visibleQuestions = rootQuestions.filter(q => {
        if (!q.logic?.targetQuestionId) return true;
        const parentAnswer = answers[q.logic.targetQuestionId];
        return Array.isArray(parentAnswer)
            ? parentAnswer?.includes(q.logic.targetValue)
            : parentAnswer === q.logic.targetValue;
    });

    return (
        <div className={showHeader || showFooter ? "min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/50 to-blue-100/50 flex flex-col" : "flex flex-col w-full"}>
            {/* Background Decoration */}
            {(showHeader || showFooter) && (
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/3 -left-32 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/15 rounded-full blur-3xl"></div>
                </div>
            )}

            {/* HEADER */}
            {showHeader && (
                <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <div className="flex items-center">
                                <img src={UALogoH} alt="Unacademy Centre Kota" className="h-8 sm:h-10 object-contain" />
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center gap-4">

                            </div>
                        </div>
                    </div>
                </header>
            )}

            {/* MAIN CONTENT */}
            <main className="flex-1 relative">
                <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {form.images && form.images.length > 0 && (
                        <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 relative bg-slate-100 group">
                            {/* 
                                DYNAMIC ASPECT RATIO STRATEGY:
                                We use an invisible copy of the current image to force the container 
                                to exactly match the image's natural aspect ratio.
                                This guarantees:
                                1. Full Width (w-full)
                                2. No Cropping (container height adapts to image height)
                                3. Responsive on all devices
                            */}
                            <img
                                src={form.images[currentImageIndex]}
                                className="w-full h-auto opacity-0 pointer-events-none relative z-0"
                                aria-hidden="true"
                                alt="spacer"
                            />

                            <div className="absolute inset-0 w-full h-full">
                                {form.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                                        style={{ opacity: idx === currentImageIndex ? 1 : 0, zIndex: idx === currentImageIndex ? 10 : 0 }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Banner ${idx + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent"></div>
                                    </div>
                                ))}

                                {/* Navigation Dots */}
                                {form.images.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                        {form.images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60 w-1.5'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Form Title Card */}
                    <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-xl shadow-slate-200/30 border border-white/60">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/40 flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">{form.title}</h1>
                            </div>
                        </div>
                        {form.description && (
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap pl-0 sm:pl-16">{form.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-slate-100 pl-0 sm:pl-16">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Takes ~{Math.max(1, Math.ceil(rootQuestions.length * 0.5))} min</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Your data is secure</span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Email Collection */}
                        {form.settings?.collectEmail && (
                            <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 border border-white/60 mb-6">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-200/40">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="pt-1">
                                        <h3 className="text-lg font-semibold text-slate-800">Email Address <span className="text-rose-500 text-sm">*</span></h3>
                                    </div>
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-5 py-4 bg-white/90 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 transition-all duration-200 placeholder:text-slate-400 text-slate-700"
                                    placeholder="your.email@example.com"
                                    value={respondentEmail}
                                    onChange={e => setRespondentEmail(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Phone Collection (Simple) */}
                        {form.settings?.verifyPhone && (
                            <div
                                id="phone-collection-section"
                                className={`bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 border mb-6 transition-all duration-300 ${validationErrors['phone_collection']
                                    ? 'border-rose-400 ring-2 ring-rose-100 shadow-rose-100'
                                    : 'border-white/60'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-200/40">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="pt-1">
                                        <h3 className="text-lg font-semibold text-slate-800">Mobile Number <span className="text-rose-500 text-sm">*</span></h3>
                                        <p className="text-sm text-slate-500">Required for verification</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <span className="text-slate-500 font-medium">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        className="w-full pl-14 pr-5 py-4 bg-white/90 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 transition-all duration-200 placeholder:text-slate-400 text-slate-700 tracking-wide font-medium"
                                        placeholder="00000 00000"
                                        value={respondentPhone}
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setRespondentPhone(val);
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Questions */}
                        <div className="flex flex-col gap-6 mb-6">
                            {visibleQuestions.map((q, index) => renderQuestion(q, index + 1))}
                        </div>

                        {/* Submit Section */}
                        <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 border border-white/60">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-10 rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Response'}
                                    {!isSubmitting && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowClearConfirm(true)}
                                    className="text-slate-500 hover:text-slate-700 font-medium transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Clear all
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            {/* Clear Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Clear Form?</h3>
                            <p className="text-slate-500 text-sm mb-6">Are you sure you want to clear all your answers? This action cannot be undone.</p>
                            <div className="flex w-full gap-3">
                                <button
                                    onClick={() => setShowClearConfirm(false)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setAnswers({});
                                        setRespondentEmail('');
                                        setRespondentPhone('');
                                        setShowClearConfirm(false);
                                        toast.success('Form cleared');
                                    }}
                                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-rose-200"
                                >
                                    Yes, Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            {showFooter && (
                <footer className="relative mt-16 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
                    {/* Wave Decoration */}
                    <div className="absolute -top-px left-0 right-0 overflow-hidden">
                        <svg className="w-full h-12 sm:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="text-slate-100"></path>
                        </svg>
                    </div>

                    <div className="max-w-5xl mx-auto px-6 pt-20 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                            {/* Brand */}
                            <div className="md:col-span-2">
                                <div className="mb-4">
                                    <img src={UALogoH} alt="Unacademy Centre Kota" className="h-10 object-contain brightness-0 invert" />
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                                    India's largest learning platform with top educators, world-class infrastructure, and technology-driven learning experience.
                                </p>
                                <div className="flex gap-3">
                                    {/* Instagram 1 */}
                                    <a href="https://www.instagram.com/unacademyfoundationschool?igsh=ODc1MTltdm1zZWky" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-cyan-500 rounded-xl flex items-center justify-center transition-colors" title="Unacademy Foundation School">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                    </a>
                                    {/* Instagram 2 */}
                                    <a href="https://www.instagram.com/kotapulsebyunacademy?igsh=MTdwNmlvZjZ3aWt1Zw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-cyan-500 rounded-xl flex items-center justify-center transition-colors" title="Kota Pulse">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                    </a>
                                    {/* YouTube 1 */}
                                    <a href="https://youtube.com/@kotapulsebyunacademy2638?si=oT8dqbv6EEPXSOVV" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-cyan-500 rounded-xl flex items-center justify-center transition-colors" title="Kota Pulse YouTube">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                    </a>
                                    {/* YouTube 2 */}
                                    <a href="https://youtube.com/@unacademyfoundation82?si=_bkVjwJHaND_o_tK" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-cyan-500 rounded-xl flex items-center justify-center transition-colors" title="Unacademy Foundation YouTube">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="font-semibold mb-4 text-white">Company</h4>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    <li><a href="/" className="hover:text-cyan-400 transition-colors">About us</a></li>
                                    <li><a href="/privacy-policy" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                                    <li><a href="/terms-conditions" className="hover:text-cyan-400 transition-colors">Terms and Conditions</a></li>
                                    <li><a href="/refund-policy" className="hover:text-cyan-400 transition-colors">Refund Policy</a></li>
                                    <li><a href="/disclaimer" className="hover:text-cyan-400 transition-colors">Disclaimer</a></li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h4 className="font-semibold mb-4 text-white">Contact</h4>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        +91 6366527093
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-slate-500">© Unacademy Centre, kota powered by ACADEMIC EXCELLENCE CONSULTANTS</p>
                        </div>
                    </div>
                </footer>
            )}

            {/* Custom Animations */}
            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { transform: scale(0); }
                    to { transform: scale(1); }
                }
                .animate-slideDown { animation: slideDown 0.3s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
            `}</style>
            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
                        <div className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600">
                            <h3 className="text-xl font-bold text-white text-center">Verify Your Phone</h3>
                            <p className="text-blue-100 text-center text-sm mt-1">We sent an OTP to +91 {respondentPhone}</p>
                        </div>
                        <div className="p-8">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Enter OTP</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 text-center tracking-[0.5em] text-2xl font-bold text-slate-800"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={handleVerifyOtp}
                                disabled={otpLoading || otp.length < 4}
                                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {otpLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Verifying...
                                    </>
                                ) : 'Verify & Submit'}
                            </button>
                            <div className="mt-6 flex flex-col gap-3 text-center">
                                <button
                                    onClick={handleSendOtp}
                                    disabled={otpLoading}
                                    className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm transition-colors"
                                >
                                    Resend OTP
                                </button>
                                <button
                                    onClick={() => {
                                        setSubmitted(true);
                                    }}
                                    className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                                >
                                    Skip Verification
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
