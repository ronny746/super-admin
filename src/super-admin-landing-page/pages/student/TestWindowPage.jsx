import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { startTest, saveAnswer, submitTest, logViolation, uploadSnapshot } from "../../api/testSystemApi";
import { Clock, AlertTriangle, Monitor, Wifi, WifiOff, Camera, Maximize, CheckCircle, ChevronLeft, ChevronRight, Menu, VideoOff, Send, XCircle, RotateCcw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import socketService from "../../utils/socketService";

export default function TestWindowPage() {
    const { testId } = useParams();
    const navigate = useNavigate();

    // State 
    const [loading, setLoading] = useState(true);
    const [testData, setTestData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
    const [markedQuestions, setMarkedQuestions] = useState({}); // { questionId: true/false }
    const [remainingTime, setRemainingTime] = useState(0); // seconds
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [finalSubmitType, setFinalSubmitType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [testResponseId, setTestResponseId] = useState(null);
    const [testStudentId, setTestStudentId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [violationWarning, setViolationWarning] = useState(null);
    const [languageMode, setLanguageMode] = useState("EN");

    // Webcam States
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);

    // Refs for intervals and detection
    const timerRef = useRef(null);
    const snapshotIntervalRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const lastViolationTimeRef = useRef(0);

    // Initialize webcam
    const initWebcam = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 320, height: 240 },
                audio: false
            });

            setCameraStream(stream);
            setCameraActive(true);
            setCameraError(false);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setCameraError(true);
            setCameraActive(false);
            // Log as violation
            if (testResponseId) {
                handleViolation("CAMERA_OFF");
            }
        }
    }, [testResponseId]);

    // Capture and upload snapshot
    const captureSnapshot = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || !testResponseId || !cameraActive || isSubmitted || isSubmitting) {
            return;
        }

        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 240;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL("image/jpeg", 0.7);

            console.log("Uploading snapshot...", { size: imageData.length });

            await uploadSnapshot({
                testResponseId,
                imageData
            });

            console.log("Snapshot uploaded successfully");
        } catch (err) {
            console.error("Snapshot upload failed:", err);
        }
    }, [testResponseId, cameraActive, isSubmitted, isSubmitting]);

    // Initial Load
    useEffect(() => {
        const initTest = async () => {
            try {
                const response = await startTest();
                if (response.success) {
                    const { test, questions, testResponse, savedAnswers, serverTime } = response.data;
                    // Sort questions by subject priority
                    const subjectPriority = { physics: 1, chemistry: 2, mathematics: 3, biology: 4, mat: 5 };
                    const sortedQuestions = questions.sort((a, b) => {
                        const subjA = (a.subject || 'physics').toLowerCase();
                        const subjB = (b.subject || 'physics').toLowerCase();
                        return (subjectPriority[subjA] || 99) - (subjectPriority[subjB] || 99);
                    });

                    setTestData(test);
                    setQuestions(sortedQuestions);
                    setTestResponseId(testResponse._id || testResponse.id);
                    setTestStudentId(testResponse.testStudentId);

                    // Restore answers
                    const initialAnswers = {};
                    const initialMarked = {};
                    savedAnswers.forEach(ans => {
                        initialAnswers[ans.questionId] = ans.selectedOption;
                        if (ans.markedForReview) {
                            initialMarked[ans.questionId] = true;
                        }
                    });
                    setAnswers(initialAnswers);
                    setMarkedQuestions(initialMarked);

                    // Calc remaining time (Using serverTime for precision)
                    const now = serverTime ? new Date(serverTime) : new Date();
                    const elapsed = Math.floor((now - new Date(testResponse.startTime)) / 1000);
                    const totalSeconds = test.duration * 60;
                    const left = Math.max(0, totalSeconds - elapsed);
                    setRemainingTime(left);

                    // Connect to Socket and notify Admin
                    const socket = socketService.connect();

                    const handleSocketConnect = () => {
                        setSocketConnected(true);
                        socketService.studentStartedTest({
                            testStudentId: testResponse.testStudentId,
                            testId: testResponse.testId,
                            testResponseId: testResponse._id || testResponse.id,
                            userId: testResponse.userId
                        });
                    };

                    const handleSocketDisconnect = () => {
                        setSocketConnected(false);
                    };

                    if (socket.connected) {
                        handleSocketConnect();
                    }

                    socket.on("connect", handleSocketConnect);
                    socket.on("disconnect", handleSocketDisconnect);
                    socket.on("connect_error", handleSocketDisconnect);

                    // Handle Admin Actions
                    socketService.onTerminateTest((data) => {
                        console.log("Test terminated by admin:", data.reason);
                        // Stop camera
                        if (cameraStream) {
                            cameraStream.getTracks().forEach(track => track.stop());
                        }
                        setFinalSubmitType("auto-violation"); // Treat as violation for UI
                        setIsSubmitted(true);
                        localStorage.removeItem("testToken");
                        toast.error(`Crucial: Your test has been terminated by the administrator.\nReason: ${data.reason} `, { duration: 10000 });
                    });

                    socketService.onWarningFromAdmin((data) => {
                        toast.error(` WARNING FROM ADMINISTRATOR: \n\n${data.message} \n\nPlease follow the guidelines to avoid termination.`, { duration: 8000, icon: '⚠️' });
                    });

                    setLoading(false);
                }
            } catch (err) {
                console.error("Start Test Error:", err);
                const backendMsg = err.response?.data?.message;
                const status = err.response?.status;
                const fallback = err.message || "Unknown error occurred";
                setError(backendMsg ? `${backendMsg} (Status: ${status})` : `Failed to start: ${fallback}`);
                setLoading(false);
            }
        };

        const token = localStorage.getItem("testToken");
        if (!token) {
            navigate(`/test/${testId}`);
            return;
        }

        initTest();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
        };
    }, [testId, navigate]);

    // Initialize webcam after test loads
    useEffect(() => {
        if (!loading && testResponseId) {
            initWebcam();
        }

        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [loading, testResponseId]);

    // Set up video ref when stream changes
    useEffect(() => {
        if (videoRef.current && cameraStream) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [cameraStream]);

    // Periodic snapshot capture (every 45 seconds) + Camera Status Watcher
    useEffect(() => {
        if (!loading && cameraActive && testResponseId && !isSubmitted && !isSubmitting) {
            // Capture initial snapshot
            setTimeout(() => captureSnapshot(), 3000);

            // Set up interval for periodic snapshots and camera health check
            snapshotIntervalRef.current = setInterval(() => {
                // Check if camera is still actually active
                if (cameraStream) {
                    const videoTrack = cameraStream.getVideoTracks()[0];
                    if (!videoTrack || !videoTrack.enabled || videoTrack.readyState === 'ended') {
                        console.error("Camera track lost or disabled!");
                        handleViolation("CAMERA_OFF");
                        return;
                    }
                }
                captureSnapshot();
            }, 5000); // Every 5 seconds
        }

        return () => {
            if (snapshotIntervalRef.current) {
                clearInterval(snapshotIntervalRef.current);
            }
        };
    }, [loading, cameraActive, testResponseId, captureSnapshot, isSubmitted, isSubmitting]);

    // Timer
    useEffect(() => {
        if (!loading && remainingTime > 0) {
            timerRef.current = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleSubmitTest("auto-time");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [loading, remainingTime]);

    // Tab Switch Monitoring (Full screen removed as per user request)
    useEffect(() => {
        if (loading || isSubmitted || isSubmitting) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation("TAB_SWITCH");
            }
        };

        const handleWindowBlur = () => {
            handleViolation("TAB_SWITCH");
        };

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "Are you sure you want to leave the test? This may submit your attempt.";
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleWindowBlur);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleWindowBlur);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [loading, testResponseId, isSubmitted, isSubmitting]);

    const handleViolation = async (type) => {
        if (isSubmitted || isSubmitting) return;

        const now = Date.now();
        if (now - lastViolationTimeRef.current < 2000) {
            return; // Prevent duplicate rapid fires for the same tab switch event
        }
        lastViolationTimeRef.current = now;

        try {
            const res = await logViolation({
                testResponseId,
                violationType: type,
                metadata: { timestamp: new Date() }
            });

            console.log("Violation Response:", res);

            // Handle potential nested data structure in case the live server uses it
            const isAutoSubmitted = res.autoSubmitted || (res.data && res.data.autoSubmitted);

            if (isAutoSubmitted) {
                // Notify via Socket
                socketService.notifyAutoSubmit({
                    testStudentId,
                    testResponseId,
                    reason: `${type} violation(Fatal)`
                });

                // Stop camera safely
                try {
                    if (cameraStream) {
                        cameraStream.getTracks().forEach(track => track.stop());
                    }
                } catch (camErr) {
                    console.error("Camera stop error:", camErr);
                }
                setFinalSubmitType("auto-violation");
                setIsSubmitted(true);
                localStorage.removeItem("testToken");
                toast.error(`Crucial: Your test has been auto-submitted due to a ${type} violation.`, { duration: 10000 });
            } else {
                // Notify violation via socket
                socketService.sendViolation({
                    testStudentId,
                    testResponseId,
                    violationType: type,
                    metadata: { timestamp: new Date() }
                });

                const warningCount = res.warningCount || (res.data && res.data.warningCount);
                const warningMsg = res.warning?.message || (res.data && res.data.warning?.message);

                if (warningCount) {
                    setViolationWarning({
                        count: warningCount,
                        message: warningMsg || `Warning ${warningCount}: Tab switching detected!`
                    });

                    // Still show toast for immediate feedback
                    toast.error(`${warningMsg || 'Violation detected!'} \nPlease avoid this action to prevent auto-submission.`, { duration: 8000, icon: '⚠️' });
                    console.warn("Violation logged:", type);
                }
            } // End else
        } catch (e) {
            console.error("Failed to log violation", e);
            toast.error("Failed to log violation.");
        }
    };

    const handleClearAnswer = async () => {
        const currentQ = questions[currentQuestionIndex];
        const currentQId = currentQ._id || currentQ.id;
        const prevAnswer = answers[currentQId];
        if (!prevAnswer) return;

        setAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[currentQId];
            return newAnswers;
        });

        // Call backend to clear answer (save with null option)
        try {
            await saveAnswer({
                testResponseId,
                questionId: currentQId,
                selectedOption: null, // This triggers the removal in backend
                markedForReview: markedQuestions[currentQId] || false,
                timeSpent: 0
            });
            toast.success("Selection cleared");
        } catch (e) {
            console.error("Failed to clear answer", e);
            toast.error("Failed to update server.");
        }
    };

    const handleAnswerSelect = async (option) => {
        const currentQ = questions[currentQuestionIndex];
        const qId = currentQ?._id || currentQ?.id;

        if (!qId) {
            console.error("Missing Question ID for answer save");
            return;
        }

        let finalOption = option;

        if (currentQ?.questionType === "MSQ") {
            const currentSelected = answers[qId] ? answers[qId].split(",").filter(Boolean) : [];
            if (currentSelected.includes(option)) {
                // remove
                finalOption = currentSelected.filter(o => o !== option).sort().join(",");
            } else {
                // add
                finalOption = [...currentSelected, option].sort().join(",");
            }
        }

        setAnswers(prev => ({ ...prev, [qId]: finalOption }));

        try {
            await saveAnswer({
                testResponseId,
                questionId: qId,
                selectedOption: finalOption,
                markedForReview: markedQuestions[qId] || false,
                timeSpent: 0
            });
        } catch (e) {
            console.error("Failed to save answer", e);
            toast.error("Failed to save answer.");
        }
    };

    const handleTextAnswerChange = (e) => {
        const currentQ = questions[currentQuestionIndex];
        const qId = currentQ?._id || currentQ?.id;
        if (!qId) return;
        setAnswers(prev => ({ ...prev, [qId]: e.target.value }));
    };

    const handleTextAnswerBlur = async () => {
        const currentQ = questions[currentQuestionIndex];
        const qId = currentQ?._id || currentQ?.id;
        if (!qId) return;
        
        try {
            await saveAnswer({
                testResponseId,
                questionId: qId,
                selectedOption: answers[qId] || "",
                markedForReview: markedQuestions[qId] || false,
                timeSpent: 0
            });
        } catch (e) {
            console.error("Failed to save text answer", e);
        }
    };

    const handleMarkReview = async () => {
        const currentQ = questions[currentQuestionIndex];
        const qId = currentQ._id || currentQ.id;
        const newMarkedStatus = !markedQuestions[qId];

        setMarkedQuestions(prev => ({ ...prev, [qId]: newMarkedStatus }));

        // If an answer exists, update the backend record with the new marked status
        if (answers[qId]) {
            try {
                await saveAnswer({
                    testResponseId,
                    questionId: qId,
                    selectedOption: answers[qId],
                    markedForReview: newMarkedStatus,
                    timeSpent: 0
                });
            } catch (e) {
                console.error("Failed to save mark status", e);
            }
        }
        toast.success(newMarkedStatus ? "Marked for review" : "Unmarked");
    };

    const handleSubmitTest = async (type = "manual") => {
        setIsSubmitting(true);

        // Capture final snapshot before submitting
        if (cameraActive) {
            await captureSnapshot();
        }

        try {
            await submitTest({
                testResponseId,
                submitType: type
            });

            // Stop camera
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }

            localStorage.removeItem("testToken");
            setFinalSubmitType(type);
            setIsSubmitted(true);
            toast.success("Test submitted successfully!");
        } catch (e) {
            toast.error("Submission failed: " + e.message);
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isSubmitted) {
        const handleClose = () => {
            try {
                window.close();
            } catch (e) {
                console.log("Could not close window via script");
            }
            // Fallback content if script cannot close
            document.body.innerHTML = "<div style='display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;'><h1>You can now close this tab.</h1></div>";
        };

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-lg w-full">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
                    <p className="text-gray-600 mb-6">Your test has been submitted successfully.</p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
                        <p className="text-sm text-gray-500 mb-1">Submission Type</p>
                        <p className="font-mono font-medium text-gray-800">
                            {finalSubmitType === "manual" ? "Manually Submitted" :
                                finalSubmitType === "auto-time" ? "Auto-Submitted (Time Up)" :
                                    finalSubmitType === "auto-violation" ? "Auto-Submitted (Violation)" : "Submitted"}
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl transition transform hover:scale-[1.02] shadow-lg"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600">{error}</p>
                    <button onClick={() => navigate(`/test/${testId}`)} className="mt-4 text-blue-600 hover:underline">
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestionIndex];
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')} `;
    };

    const handleManualSubmit = () => {
        setShowSubmitModal(true);
    };

    const handleSaveNext = () => {
        setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
            <style>
                {`
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin-slow {
                        animation: spin-slow 8s linear infinite;
                    }
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #E5E7EB;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #D1D5DB;
                    }
                    .option-glow {
                        box-shadow: 0 0 20px -5px rgba(37, 99, 235, 0.15);
                    }
                `}
            </style>
            {/* Hidden canvas for snapshot capture */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-2.5 rounded-2xl shadow-sm shadow-blue-200">
                        <Monitor className="text-white" size={22} />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 text-lg leading-tight">
                            {testData?.title}
                        </h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {testData?.className} • Set {testData?.paperSet || 'A'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Status Indicators */}
                    <div className="hidden lg:flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100">
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${socketConnected
                            ? "bg-white text-blue-700 shadow-sm shadow-blue-100"
                            : "bg-red-50 text-red-700"
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${socketConnected ? "bg-blue-500 animate-pulse" : "bg-red-500"}`}></div>
                            <span>{socketConnected ? "Proctoring Active" : "Connection Lost"}</span>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${cameraActive
                            ? "bg-white text-green-700 shadow-sm shadow-green-100"
                            : "bg-red-50 text-red-700"
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${cameraActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                            <span>{cameraActive ? "Camera Live" : "Camera Error"}</span>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className={`flex items-center gap-2 font-mono text-xl font-black px-6 py-2.5 rounded-2xl shadow-sm transition-all border-2 ${remainingTime < 300
                        ? 'bg-red-50 text-red-600 border-red-100 animate-pulse'
                        : 'bg-white text-gray-900 border-gray-900'
                        }`}>
                        <Clock size={20} className={remainingTime < 300 ? "animate-spin-slow" : ""} />
                        {formatTime(remainingTime)}
                    </div>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-2xl border border-gray-200 transition-colors"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Question Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center">
                    <div className="max-w-4xl w-full">
                        {/* Subject Tabs */}
                        <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-2">
                            {[...new Set(questions.map(q => (q.subject || 'physics').toLowerCase()))].map(subj => {
                                const firstIdx = questions.findIndex(q => (q.subject || 'physics').toLowerCase() === subj);
                                const isCurrent = (questions[currentQuestionIndex]?.subject || 'physics').toLowerCase() === subj;
                                return (
                                    <button 
                                        key={subj} 
                                        onClick={() => setCurrentQuestionIndex(firstIdx)}
                                        className={`px-6 py-2.5 rounded-t-xl font-black text-xs uppercase tracking-widest transition-all ${isCurrent ? 'bg-white text-blue-600 border-t-[3px] border-blue-600 shadow-sm' : 'bg-gray-100/50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 border-t-[3px] border-transparent'}`}
                                    >
                                        {subj}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-2xl rounded-tl-none shadow-sm border border-gray-100 p-8 md:p-10 transition-all">
                            <div className="mb-10">
                                <div className="flex justify-between items-start gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest rounded-full">
                                            Question {currentQuestionIndex + 1}
                                        </span>
                                        {currentQ?.subject && currentQ.subject !== 'general' && (
                                            <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full ${currentQ.subject === 'physics' ? 'bg-blue-50 text-blue-600' :
                                                currentQ.subject === 'chemistry' ? 'bg-purple-50 text-purple-600' :
                                                    currentQ.subject === 'mathematics' ? 'bg-green-50 text-green-600' :
                                                        currentQ.subject === 'biology' ? 'bg-red-50 text-red-600' :
                                                            currentQ.subject === 'mat' ? 'bg-indigo-50 text-indigo-600' :
                                                                'bg-gray-50 text-gray-600'
                                                }`}>
                                                {currentQ.subject.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {questions.some(q => q.question_hi) && (
                                            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                                                <button onClick={() => setLanguageMode("EN")} className={`px-4 py-1.5 text-xs font-black tracking-wider uppercase rounded-md transition-all ${languageMode === "EN" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>EN</button>
                                                <button onClick={() => setLanguageMode("HI")} className={`px-4 py-1.5 text-xs font-black tracking-wider uppercase rounded-md transition-all ${languageMode === "HI" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>HI</button>
                                            </div>
                                        )}
                                        {answers[currentQ?._id || currentQ?.id] && (
                                            <button
                                                onClick={handleClearAnswer}
                                                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all group"
                                            >
                                                <RotateCcw size={14} className="group-hover:-rotate-45 transition-transform" />
                                                Clear Selection
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {(() => {
                                    const isHindi = languageMode === "HI" && currentQ?.question_hi;
                                    const displayQuestion = isHindi ? currentQ.question_hi : currentQ?.question;
                                    const displayImage = isHindi ? currentQ.image_hi : currentQ?.questionImage;
                                    
                                    return (
                                        <>
                                            <h2 className={`text-3xl font-black text-gray-900 tracking-tight ${isHindi ? 'font-hindi' : ''}`} dangerouslySetInnerHTML={{ __html: displayQuestion || '' }}>
                                            </h2>    
                                            {displayImage && (
                                                <div className="mt-8 rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 flex justify-center p-4">
                                                    <img
                                                        src={displayImage}
                                                        alt="Question Illustration"
                                                        className="max-h-80 object-contain drop-shadow-md"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="flex flex-col gap-4">
                                {currentQ?.questionType === "SUBJECTIVE" ? (
                                    <div className="w-full">
                                        <textarea
                                            value={answers[currentQ?._id || currentQ?.id] || ""}
                                            onChange={handleTextAnswerChange}
                                            onBlur={handleTextAnswerBlur}
                                            placeholder="Type your detailed answer here..."
                                            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none min-h-[200px] resize-y text-lg text-gray-800"
                                        />
                                    </div>
                                ) : currentQ?.questionType === "INTEGER" ? (
                                    <div className="w-full max-w-sm">
                                        <input
                                            type="text"
                                            value={answers[currentQ?._id || currentQ?.id] || ""}
                                            onChange={handleTextAnswerChange}
                                            onBlur={handleTextAnswerBlur}
                                            placeholder="Enter numeric answer"
                                            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-mono text-xl text-gray-800 tracking-wider"
                                        />
                                    </div>
                                ) : (
                                    /* Check if we have new options array or legacy fields */
                                    (() => {
                                        const isHindi = languageMode === "HI";
                                    
                                    // 1. Get Base Options (English)
                                    let baseOptions = [];
                                    if (currentQ?.options && currentQ.options.length > 0) {
                                        baseOptions = currentQ.options.map((opt, i) => ({ 
                                            ...opt, 
                                            label: opt.label || String.fromCharCode(65 + i),
                                            text: opt.text || ""
                                        }));
                                    } else {
                                        baseOptions = ['A', 'B', 'C', 'D'].map(label => ({ 
                                            label, 
                                            text: currentQ?.[`option${label}`] || "", 
                                            image: null 
                                        }));
                                    }

                                    // 2. Get Display Options (Apply Hindi if needed)
                                    let displayOptions = baseOptions;
                                    if (isHindi) {
                                        if (currentQ?.options_hi && currentQ.options_hi.length > 0) {
                                            displayOptions = currentQ.options_hi.map((opt, i) => ({
                                                ...opt,
                                                label: opt.label || baseOptions[i].label,
                                                text: opt.text || baseOptions[i].text,
                                                image: opt.image || baseOptions[i].image
                                            }));
                                        } else {
                                            // Fallback to legacy Hindi fields if array doesn't exist
                                            displayOptions = baseOptions.map(opt => ({
                                                ...opt,
                                                text: currentQ?.[`option${opt.label}_hi`] || currentQ?.[`option${opt.label}`] || opt.text
                                            }));
                                        }
                                    }

                                    return displayOptions;
                                })().map((opt, idx) => {
                                    const qId = currentQ?._id || currentQ?.id;
                                    const isMSQ = currentQ?.questionType === "MSQ";
                                    const currentAnswer = answers[qId] || "";
                                    const isSelected = isMSQ ? currentAnswer.split(",").includes(opt.label) : currentAnswer === opt.label;

                                    return (
                                        <label
                                            key={idx}
                                            className={`
                                                group flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden w-full
                                                ${isSelected
                                                    ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50 option-glow'
                                                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50/80'
                                                }
                                            `}
                                        >
                                            <input
                                                type={isMSQ ? "checkbox" : "radio"}
                                                name={`q-${qId || 'unknown'}${isMSQ ? '-' + opt.label : ''}`}
                                                value={opt.label}
                                                checked={isSelected}
                                                onChange={() => handleAnswerSelect(opt.label)}
                                                className="hidden"
                                            />
                                            <div className="flex items-center gap-4 w-full">
                                                <div className={`
                                                    w-10 h-10 min-w-10 rounded-xl flex items-center justify-center font-black text-md transition-all
                                                    ${isSelected
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                        : 'bg-white border-2 border-gray-100 text-gray-400 group-hover:border-blue-200 group-hover:text-blue-400'
                                                    }
                                                `}>
                                                    {opt.label}
                                                </div>

                                                <div className="flex-1">
                                                    <div className={`text-lg transition-colors ${isSelected ? 'text-blue-900 font-bold' : 'text-gray-700 font-medium'} ${languageMode === 'HI' ? 'font-hindi' : ''}`} dangerouslySetInnerHTML={{ __html: opt.text || '' }} />
                                                    {opt.image && (
                                                        <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 bg-white p-2 w-fit">
                                                            <img
                                                                src={opt.image}
                                                                alt={`Option ${opt.label}`}
                                                                className="max-h-48 object-contain"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Selection Checkmark */}
                                                {isSelected && (
                                                    <div className="text-blue-600 animate-in fade-in zoom-in duration-300">
                                                        <CheckCircle size={24} fill="currentColor" className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })
                                )}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between mt-10 w-full">
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold border-2 border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={22} /> Previous
                            </button>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleManualSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-3 px-10 py-4 rounded-3xl font-black text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed mr-4"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Final Submit <CheckCircle size={24} />
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleMarkReview}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-3xl font-bold transition-all transform hover:-translate-y-1 active:translate-y-0 ${markedQuestions[currentQ?._id || currentQ?.id]
                                        ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-200"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {markedQuestions[currentQ?._id || currentQ?.id] ? "Marked" : "Mark for Review"}
                                </button>

                                {currentQuestionIndex < questions.length - 1 ? (
                                    <button
                                        onClick={handleSaveNext}
                                        disabled={loading}
                                        className="flex items-center gap-3 px-10 py-4 rounded-3xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed group ml-4"
                                    >
                                        Save & Next
                                        <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAnswerSelect(answers[currentQ?._id || currentQ?.id])} // Just save current selection
                                        disabled={loading}
                                        className="flex items-center gap-3 px-10 py-4 rounded-3xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed group ml-4"
                                    >
                                        Save
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Sidebar (Question Palette) */}
                <aside className={`
                    fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-100 shadow-2xl transform transition-transform duration-500 z-20
                    lg:relative lg:transform-none lg:shadow-none
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}>
                    <div className="h-full flex flex-col p-6">
                        <div className="flex justify-between items-center mb-6 lg:hidden">
                            <div>
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Palette</h3>
                                <p className="text-[10px] text-blue-600 font-bold mt-1">
                                    {Object.keys(answers).length} / {questions.length} Answered
                                </p>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <Menu size={20} />
                            </button>
                        </div>

                        {/* Progress Stats for Desktop */}
                        <div className="hidden lg:block mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Progress</h3>
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                    {Math.round((Object.keys(answers).length / questions.length) * 100)}%
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-500"
                                    style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Webcam Preview */}
                        <div className="mb-6 rounded-4xl overflow-hidden bg-gray-900 relative group border-4 border-white shadow-xl">
                            {cameraActive ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full aspect-video object-cover transform scale-x-[-1] transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full aspect-video flex items-center justify-center bg-gray-100">
                                    <div className="text-center">
                                        <VideoOff size={40} className="mx-auto mb-3 text-red-200" />
                                        <p className="text-[10px] font-black uppercase text-red-400 tracking-widest">Feed Offline</p>
                                        <button
                                            onClick={initWebcam}
                                            className="mt-4 text-[10px] font-bold bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-black transition-all shadow-lg shadow-blue-100"
                                        >
                                            Restart Camera
                                        </button>
                                    </div>
                                </div>
                            )}
                            {cameraActive && (
                                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg animate-pulse">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    LIVE FEED
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {/* Group questions by Subject for display */}
                            {(() => {
                                const colorPalette = ['blue', 'purple', 'green', 'red', 'indigo', 'orange', 'teal', 'pink'];
                                const predefinedColors = {
                                    'physics': 'blue',
                                    'chemistry': 'purple',
                                    'mathematics': 'green',
                                    'maths': 'green',
                                    'biology': 'red',
                                    'mat': 'indigo',
                                    'general': 'gray'
                                };

                                const uniqueSubjects = [...new Set(questions.map(q => (q.subject || 'general').toLowerCase()))];
                                
                                const dynamicSubjects = uniqueSubjects.map((subj, index) => ({
                                    id: subj,
                                    name: subj.toUpperCase(),
                                    color: predefinedColors[subj] || colorPalette[index % colorPalette.length]
                                }));

                                const grouped = {};
                                dynamicSubjects.forEach(s => grouped[s.id] = []);

                                questions.forEach((q, originalIdx) => {
                                    const subj = (q.subject || 'general').toLowerCase();
                                    if (grouped[subj]) {
                                        grouped[subj].push({ ...q, originalIdx });
                                    }
                                });

                                return dynamicSubjects.map(subject => {
                                    if (!grouped[subject.id] || grouped[subject.id].length === 0) return null;

                                    return (
                                        <div key={subject.id} className="mb-8">
                                            {subject.id !== 'general' && (
                                                <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full bg-${subject.color}-600`}></span>
                                                    {subject.name}
                                                </h4>
                                            )}
                                            {subject.id === 'general' && (
                                                 <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full bg-gray-600`}></span>
                                                    Miscellaneous
                                                </h4>
                                            )}
                                            <div className="grid grid-cols-4 gap-4 px-2">
                                                {grouped[subject.id].sort((a, b) => a.originalIdx - b.originalIdx).map((q) => {
                                                    const idx = q.originalIdx;
                                                    const qId = q?._id || q?.id;
                                                    const isAnswered = qId ? answers[qId] : false;
                                                    const isCurrent = currentQuestionIndex === idx;

                                                    return (
                                                        <button
                                                            key={qId || idx}
                                                            onClick={() => {
                                                                setCurrentQuestionIndex(idx);
                                                                setSidebarOpen(false);
                                                            }}
                                                            className={`
                                                                aspect-square rounded-2xl font-black text-xs flex items-center justify-center transition-all duration-300 transform active:scale-95
                                                                ${isCurrent ? `ring-4 ring-${subject.color}-600 ring-offset-2` : ''}
                                                                ${isAnswered
                                                                    ? ((qId && markedQuestions[qId])
                                                                        ? `bg-yellow-500 text-white shadow-lg shadow-yellow-100` // Answered & Marked
                                                                        : `bg-green-600 text-white shadow-lg shadow-green-100`)
                                                                    : ((qId && markedQuestions[qId])
                                                                        ? `bg-yellow-100 text-yellow-600 border-2 border-yellow-200` // Unanswered & Marked
                                                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100')
                                                                }
                                                            `}
                                                        >
                                                            {idx + 1}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })
                            })()}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2.5 p-3 bg-blue-50/50 rounded-2xl">
                                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                <span className="text-[10px] font-black text-green-900 uppercase tracking-widest">Answered</span>
                            </div>
                            <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-2xl">
                                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending</span>
                            </div>
                            <div className="flex items-center gap-2.5 p-3 bg-yellow-50 rounded-2xl col-span-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                                <span className="text-[10px] font-black text-yellow-900 uppercase tracking-widest">Marked for Review</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Custom Submit Confirmation Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-100">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Assessment?</h3>
                            <p className="text-gray-500 mb-6">
                                You have answered <span className="font-bold text-blue-600">{Object.keys(answers).length}</span> out of <span className="font-bold text-gray-800">{questions.length}</span> questions.
                                <br />
                                <span className="text-xs mt-2 block text-gray-400">Are you sure you want to finish the test?</span>
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSubmitModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSubmitModal(false);
                                        handleSubmitTest("manual");
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.02]"
                                >
                                    Confirm Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Violation Warning Modal */}
            {violationWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-red-100">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100 animate-pulse">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Proctoring Alert</h3>
                            <p className="text-red-600 font-medium text-lg mb-2">
                                {Number(violationWarning.count) === 1 ? "1st Warning" : Number(violationWarning.count) === 2 ? "2nd Warning" : "Final Warning"}
                            </p>
                            <p className="text-gray-600 mb-6">
                                {violationWarning.message}
                                <br />
                                <span className="text-xs mt-3 block text-gray-500 font-semibold">
                                    Continuing to leave the test window will result in automatic submission.
                                </span>
                            </p>

                            <button
                                onClick={() => setViolationWarning(null)}
                                className="w-full px-4 py-3 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-[0.98]"
                            >
                                I Understand & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
