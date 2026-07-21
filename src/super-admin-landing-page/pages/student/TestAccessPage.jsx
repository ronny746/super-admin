import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { requestOTP, verifyOTP, getPublicTestInfo, guestLogin } from "../../api/testSystemApi";
import { Lock, User, ArrowRight, ShieldCheck, Clock, AlertTriangle, Camera, CheckCircle, XCircle, Video, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";



export default function TestAccessPage() {
    const { testId } = useParams();
    const navigate = useNavigate();


    const [searchParams] = useSearchParams();
    const userIdFromUrl = searchParams.get("userId");

    const [step, setStep] = useState(1); // 1: Login, 2: OTP, 3: Instructions, 4: Permission Check
    const [userId, setUserId] = useState(userIdFromUrl || "");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [studentInfo, setStudentInfo] = useState(null);
    const [testInfo, setTestInfo] = useState(null);
    const [timeLeftToStart, setTimeLeftToStart] = useState(null); // seconds
    const [isPublicTest, setIsPublicTest] = useState(false);
    const [guestData, setGuestData] = useState({ name: "", email: "", mobileNumber: "" });

    // Single declaration checkbox
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Webcam permission state
    const [cameraPermission, setCameraPermission] = useState("pending"); // pending, granted, denied, checking
    const [cameraStream, setCameraStream] = useState(null);
    const [cameraError, setCameraError] = useState(""); // Specific error message for camera issues
    const videoRef = useRef(null);

    // Check if already logged in or has pre-filled ID
    useEffect(() => {
        const token = localStorage.getItem("testToken");
        const storedTestId = localStorage.getItem("currentTestId");

        if (token && storedTestId === testId) {
            setStep(3);
            try {
                const storedStudent = JSON.parse(localStorage.getItem("testStudentInfo"));
                if (storedStudent) setStudentInfo(storedStudent);
                const storedTest = JSON.parse(localStorage.getItem("testInfo"));
                if (storedTest) setTestInfo(storedTest);
            } catch (e) { }
        }

        // Check Public Status first
        const checkPublicStatus = async () => {
            try {
                const res = await getPublicTestInfo(testId);
                if (res.data?.isPublic) {
                    setIsPublicTest(true);
                }
            } catch (err) {
                console.error("Failed to fetch public test info", err);
            }
        };

        checkPublicStatus();

        // Pre-fill userId from URL if available
        const urlUserId = searchParams.get("userId");
        if (urlUserId) {
            setUserId(urlUserId);
        }
    }, [testId, searchParams]);

    // Cleanup camera stream on unmount
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    // Countdown Timer Logic
    useEffect(() => {
        if (step !== 3 || !testInfo?.startTime) return;

        const calculateTimeLeft = () => {
            const offset = parseInt(localStorage.getItem("serverTimeOffset") || "0");
            const now = new Date(new Date().getTime() + offset);
            const start = new Date(testInfo.startTime);
            const diff = Math.floor((start - now) / 1000);
            return diff > 0 ? diff : 0;
        };

        const initialDiff = calculateTimeLeft();
        setTimeLeftToStart(initialDiff);

        if (initialDiff <= 0) return;

        const timer = setInterval(() => {
            const diff = calculateTimeLeft();
            setTimeLeftToStart(diff);
            if (diff <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [step, testInfo]);

    // Set video source when stream is available
    useEffect(() => {
        if (videoRef.current && cameraStream) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [cameraStream]);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await requestOTP(userId, testId);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP. Check your ID.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await verifyOTP(userId, otp);
            const { token, testStudent, test, serverTime } = response.data;

            // Calculate Skew
            if (serverTime) {
                const offset = new Date(serverTime).getTime() - Date.now();
                localStorage.setItem("serverTimeOffset", offset.toString());
            }

            // Save session 
            localStorage.setItem("testToken", token);
            localStorage.setItem("testStudentInfo", JSON.stringify(testStudent));
            localStorage.setItem("testInfo", JSON.stringify(test));
            localStorage.setItem("currentTestId", testId);

            setStudentInfo(testStudent);
            setTestInfo(test);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await guestLogin({
                testId,
                name: guestData.name,
                email: guestData.email,
                mobileNumber: guestData.mobileNumber
            });
            const { token, testStudent, test, serverTime } = response.data;

            if (serverTime) {
                const offset = new Date(serverTime).getTime() - Date.now();
                localStorage.setItem("serverTimeOffset", offset.toString());
            }

            localStorage.setItem("testToken", token);
            localStorage.setItem("testStudentInfo", JSON.stringify(testStudent));
            localStorage.setItem("testInfo", JSON.stringify(test));
            localStorage.setItem("currentTestId", testId);

            setStudentInfo(testStudent);
            setTestInfo(test);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to join test");
        } finally {
            setLoading(false);
        }
    };

    const handleProceedToPermissions = () => {
        setStep(4);
        requestCameraPermission();
    };

    const requestCameraPermission = async () => {
        setCameraPermission("checking");
        setCameraError(""); // Clear previous camera errors

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("MediaDevices API not found. This might be due to a non-secure context (HTTP) or unsupported browser.");
            setCameraPermission("denied");
            const msg = "Camera API is not accessible. Please ensure you are using HTTPS or localhost, and that your browser supports camera access.";
            setCameraError(msg);
            toast.error(msg);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 640, height: 480 },
                audio: false // Can enable if audio monitoring is needed
            });

            setCameraStream(stream);
            setCameraPermission("granted");
        } catch (err) {
            console.error("Camera permission error:", err);
            setCameraPermission("denied");

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                const msg = "Camera access denied. Please allow camera permissions in your browser settings to continue.";
                setCameraError(msg);
                toast.error(msg);
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                const msg = "No camera found. A working camera is required for this test.";
                setCameraError(msg);
                toast.error(msg);
            } else {
                const msg = "Failed to access camera: " + err.message;
                setCameraError(msg);
                toast.error(msg);
            }
        }
    };

    const handleRetryCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        requestCameraPermission();
    };

    const handleStartTest = () => {
        // Stop the camera stream before navigating (will be re-initialized in test window)
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
        navigate(`/admin/exam/${testId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
            <div className={`w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all ${step === 3 ? 'max-w-7xl' : 'max-w-md'}`}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
                    <h1 className="text-2xl font-bold text-white">Online Examination</h1>
                    <p className="text-blue-100 text-sm mt-1">Secure Assessment Platform</p>
                </div>

                <div className="p-8">
                    {step === 1 && (
                        isPublicTest ? (
                            <form onSubmit={handleGuestLogin} className="space-y-6">
                                <div className="text-center mb-8">
                                    <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                        <User className="text-blue-600" size={32} />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Guest Registration</h2>
                                    <p className="text-gray-500 text-sm">Please provide your details to take this public test</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={guestData.name}
                                            onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={guestData.email}
                                            onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={guestData.mobileNumber}
                                            onChange={(e) => setGuestData({ ...guestData, mobileNumber: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                            placeholder="Your phone number"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                                >
                                    {loading ? "Joining..." : "Start Test"} <ArrowRight size={18} />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRequestOTP} className="space-y-6">
                                <div className="text-center mb-8">
                                    <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                        <User className="text-blue-600" size={32} />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Student Login</h2>
                                    <p className="text-gray-500 text-sm">Enter your Student Authorization ID</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                        placeholder="e.g. STU-123456"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? "Sending..." : "Proceed"} <ArrowRight size={18} />
                                </button>
                            </form>
                        )
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="text-center mb-8">
                                <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                    <Lock className="text-indigo-600" size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Verify Identity</h2>
                                <p className="text-gray-500 text-sm">Enter the OTP sent to your registered email</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">One-Time Password</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
                                    placeholder="• • • • • •"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition shadow-md disabled:opacity-70"
                            >
                                {loading ? "Verifying..." : "Verify & Continue"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-gray-500 text-sm hover:text-gray-700"
                            >
                                Back to Login
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 px-6 py-6">
                            <style>
                                {`
                                    .custom-scrollbar::-webkit-scrollbar {
                                        width: 8px;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-track {
                                        background: #f1f1f1;
                                        border-radius: 10px;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-thumb {
                                        background: #cbd5e0;
                                        border-radius: 10px;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                        background: #a0aec0;
                                    }
                                `}
                            </style>

                            {/* Header */}
                            <div className="text-center pb-4 border-b-2 border-gray-100">
                                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                    <ShieldCheck className="text-white" size={40} />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-1">Test Instructions & Guidelines</h2>
                                <p className="text-gray-600 text-sm font-medium">Please read all instructions carefully before proceeding</p>
                            </div>

                            {/* Student Info Card - Full Width */}
                            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 rounded-2xl p-6 shadow-sm">
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-2">Candidate Name</p>
                                        <p className="font-black text-gray-900 text-xl">{studentInfo?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-2">Student ID</p>
                                        <p className="font-mono font-black text-gray-900 text-xl">{studentInfo?.userId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-2">Test Date</p>
                                        <p className="font-bold text-gray-900 text-lg">{new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Two Column Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column - 2/3 width */}
                                <div className="lg:col-span-2 space-y-6">

                                    {/* Test Details */}
                                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                                        <h3 className="font-black text-gray-900 flex items-center gap-2 text-base uppercase tracking-wide border-b-2 border-gray-200 pb-3 mb-4">
                                            <Clock className="text-blue-600" size={22} />
                                            Test Specification
                                        </h3>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                                <p className="text-xs text-blue-700 font-bold mb-2">Duration</p>
                                                <p className="font-black text-gray-900 text-2xl">{testInfo?.duration || 180}</p>
                                                <p className="text-xs text-blue-600 font-medium">Minutes</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                                                <p className="text-xs text-purple-700 font-bold mb-2">Questions</p>
                                                <p className="font-black text-gray-900 text-2xl">60</p>
                                                <p className="text-xs text-purple-600 font-medium">MCQs</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                                <p className="text-xs text-green-700 font-bold mb-2">Max Marks</p>
                                                <p className="font-black text-gray-900 text-2xl">240</p>
                                                <p className="text-xs text-green-600 font-medium">Points</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                                                <p className="text-xs text-orange-700 font-bold mb-2">Subjects</p>
                                                <p className="font-black text-gray-900 text-2xl">3-4</p>
                                                <p className="text-xs text-orange-600 font-medium">Topics</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* General Instructions */}
                                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                                        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-base uppercase tracking-wide border-b-2 border-gray-200 pb-3">
                                            <AlertTriangle className="text-orange-600" size={22} />
                                            General Instructions
                                        </h3>
                                        <ol className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="font-black text-blue-600 min-w-[24px] text-base">1.</span>
                                                <span>The test contains <strong>Multiple Choice Questions (MCQs)</strong> with four options (A, B, C, D). Only <strong>one option</strong> is correct for each question.</span>
                                            </li>
                                            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="font-black text-blue-600 min-w-[24px] text-base">2.</span>
                                                <span><strong className="text-red-600">Negative marking is applicable:</strong> Each correct answer awards <strong className="text-green-600">+4 marks</strong> and each incorrect answer deducts <strong className="text-red-600">-1 mark</strong>. Unattempted questions carry <strong>0 marks</strong>.</span>
                                            </li>
                                            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="font-black text-blue-600 min-w-[24px] text-base">3.</span>
                                                <span>The clock is <strong>server-synchronized</strong> and will count down in real-time. The test will <strong>auto-submit</strong> when the timer reaches zero.</span>
                                            </li>
                                            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="font-black text-blue-600 min-w-[24px] text-base">4.</span>
                                                <span>Use the <strong>question palette</strong> on the right to navigate. Questions are color-coded: <span className="text-green-600 font-bold">Green (Answered)</span>, <span className="text-yellow-600 font-bold">Yellow (Marked for Review)</span>, <span className="text-gray-600 font-bold">Gray (Not Visited)</span>.</span>
                                            </li>
                                            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="font-black text-blue-600 min-w-[24px] text-base">5.</span>
                                                <span>Answers are <strong>automatically saved</strong> the moment you select an option. Use <strong>"Save & Next"</strong> button to move to the next question.</span>
                                            </li>
                                            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="font-black text-blue-600 min-w-[24px] text-base">6.</span>
                                                <span>You can <strong>clear your selection</strong> or change answers anytime before final submission. Once you click <strong>"Final Submit"</strong>, no changes are allowed.</span>
                                            </li>
                                            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="font-black text-blue-600 min-w-[24px] text-base">7.</span>
                                                <span>Questions can be <strong>marked for review</strong> to revisit later. You can submit with marked questions - they will be evaluated based on your selected answer.</span>
                                            </li>
                                            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="font-black text-blue-600 min-w-[24px] text-base">8.</span>
                                                <span>In case of <strong>technical issues</strong>, immediately contact the test administrator. Do NOT refresh the page as your session may be lost.</span>
                                            </li>
                                        </ol>
                                    </div>
                                </div>

                                {/* Right Column - 1/3 width */}
                                <div className="space-y-6">

                                    {/* Marking Scheme */}
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-5 shadow-sm">
                                        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide border-b-2 border-purple-300 pb-2">
                                            <CheckCircle className="text-purple-600" size={20} />
                                            Marking Scheme
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="bg-white rounded-xl p-4 border-2 border-green-300 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                        <CheckCircle className="text-green-600" size={18} />
                                                        Correct Answer
                                                    </span>
                                                </div>
                                                <span className="font-black text-green-600 text-3xl">+4</span>
                                                <p className="text-xs text-green-700 mt-1">marks awarded</p>
                                            </div>
                                            <div className="bg-white rounded-xl p-4 border-2 border-red-300 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                        <XCircle className="text-red-600" size={18} />
                                                        Wrong Answer
                                                    </span>
                                                </div>
                                                <span className="font-black text-red-600 text-3xl">-1</span>
                                                <p className="text-xs text-red-700 mt-1">mark deducted</p>
                                            </div>
                                            <div className="bg-white rounded-xl p-4 border-2 border-gray-300 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                                                        Not Attempted
                                                    </span>
                                                </div>
                                                <span className="font-black text-gray-600 text-3xl">0</span>
                                                <p className="text-xs text-gray-600 mt-1">no marks</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-purple-100 border border-purple-300 rounded-xl p-3 text-center">
                                            <p className="text-xs font-black text-purple-900">
                                                📊 Total Score = (Correct × 4) - (Wrong × 1)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Important Notes */}
                                    <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5 shadow-sm">
                                        <h3 className="font-black text-blue-900 mb-3 text-sm uppercase tracking-wide">📌 Important Notes</h3>
                                        <ul className="space-y-2 text-xs text-blue-900">
                                            <li className="flex items-start gap-2">
                                                <span className="mt-1">•</span>
                                                <span>Test cannot be paused once started</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="mt-1">•</span>
                                                <span>Results will be available within 24-48 hours</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="mt-1">•</span>
                                                <span>Screenshot/screen recording is prohibited</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="mt-1">•</span>
                                                <span>Any malpractice will lead to permanent ban</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Technical Requirements */}
                                    <div className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-5 shadow-sm">
                                        <h3 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wide">💻 System Requirements</h3>
                                        <ul className="space-y-2 text-xs text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-600 mt-0.5">✓</span>
                                                <span>Chrome/Firefox (latest)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-600 mt-0.5">✓</span>
                                                <span>Minimum 2 Mbps internet</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-600 mt-0.5">✓</span>
                                                <span>Working webcam (mandatory)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-600 mt-0.5">✓</span>
                                                <span>Desktop/Laptop (no mobile)</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* DO's and DON'Ts - Full Width Row */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Do's */}
                                <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-5 shadow-sm">
                                    <h3 className="font-black text-green-900 mb-4 flex items-center gap-2 text-base uppercase tracking-wide border-b-2 border-green-300 pb-2">
                                        <CheckCircle className="text-green-600" size={22} />
                                        DO's (Recommended Actions)
                                    </h3>
                                    <ul className="space-y-2.5 text-sm text-green-900">
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-green-600 mt-0.5 font-bold">✓</span>
                                            <span>Keep your <strong>webcam ON</strong> and visible throughout the entire test duration</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-green-600 mt-0.5 font-bold">✓</span>
                                            <span>Ensure a <strong>stable internet connection</strong> (broadband or 4G recommended)</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-green-600 mt-0.5 font-bold">✓</span>
                                            <span>Sit in a <strong>well-lit, quiet room</strong> with no one else present</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-green-600 mt-0.5 font-bold">✓</span>
                                            <span>Keep your <strong>desk clear</strong> of all materials except permitted items</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-green-600 mt-0.5 font-bold">✓</span>
                                            <span>Use <strong>Google Chrome or Firefox</strong> (latest version) for best experience</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-green-600 mt-0.5 font-bold">✓</span>
                                            <span>Review all questions systematically before final submission</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-green-600 mt-0.5 font-bold">✓</span>
                                            <span>Make strategic use of the <strong>"Mark for Review"</strong> feature</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Don'ts */}
                                <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-5 shadow-sm">
                                    <h3 className="font-black text-red-900 mb-4 flex items-center gap-2 text-base uppercase tracking-wide border-b-2 border-red-300 pb-2">
                                        <XCircle className="text-red-600" size={22} />
                                        DON'Ts (Prohibited Actions)
                                    </h3>
                                    <ul className="space-y-2.5 text-sm text-red-900">
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-red-600 mt-0.5 font-bold">✗</span>
                                            <span><strong>Do NOT switch tabs</strong>, minimize window, or open other applications</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-red-600 mt-0.5 font-bold">✗</span>
                                            <span><strong>Do NOT use any external help</strong> (books, notes, internet, other persons)</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-red-600 mt-0.5 font-bold">✗</span>
                                            <span><strong>Do NOT cover or disable</strong> your camera at any point</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-red-600 mt-0.5 font-bold">✗</span>
                                            <span><strong>Do NOT use mobile phones</strong>, smartwatches, or any electronic devices</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-red-600 mt-0.5 font-bold">✗</span>
                                            <span><strong>Do NOT refresh or reload</strong> the browser during the test</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-red-600 mt-0.5 font-bold">✗</span>
                                            <span><strong>Do NOT talk, look away</strong> from screen, or engage in suspicious behavior</span>
                                        </li>
                                        <li className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                            <span className="text-red-600 mt-0.5 font-bold">✗</span>
                                            <span><strong>Do NOT use calculators</strong> unless explicitly permitted</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Proctoring Notice - Full Width */}
                            <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-2 border-yellow-400 rounded-2xl p-6 shadow-md">
                                <div className="flex items-start gap-4">
                                    <Camera className="text-yellow-700 mt-1 shrink-0" size={32} />
                                    <div className="flex-1">
                                        <h3 className="font-black text-yellow-900 mb-3 text-base">⚠️ Proctoring & AI Monitoring System</h3>
                                        <div className="space-y-2 text-sm text-yellow-900">
                                            <p className="leading-relaxed">
                                                This examination is <strong>remotely proctored</strong> using advanced AI monitoring. Your <strong>webcam snapshots</strong> are captured and analyzed at random intervals throughout the test.
                                            </p>
                                            <p className="leading-relaxed">
                                                All <strong>tab switches, window minimization, suspicious eye movements, multiple faces detection, and absence from camera</strong> are automatically logged and flagged.
                                            </p>
                                            <p className="leading-relaxed font-bold text-red-900">
                                                ⚠️ Multiple violations will result in <strong>immediate test termination</strong> and automatic disqualification. All logs are reviewed by administrators.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Declaration Checkbox - Full Width Bottom */}
                            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 text-base flex items-center gap-2">
                                    <ShieldCheck className="text-blue-600" size={22} />
                                    Candidate Declaration
                                </h3>

                                <label className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 cursor-pointer transition-all">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-800 leading-relaxed">
                                        I hereby declare that I have read and understood all the instructions, rules, and guidelines. I agree to the marking scheme and consent to webcam monitoring throughout the test. I will not engage in any form of malpractice and confirm that my system meets the technical requirements.
                                    </span>
                                </label>

                                {/* Start Button or Timer */}
                                <div className="mt-5">
                                    {timeLeftToStart > 0 ? (
                                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-6 text-center">
                                            <p className="text-amber-900 font-black mb-4 flex items-center justify-center gap-2 text-base uppercase tracking-wide">
                                                <Clock size={24} className="animate-pulse" />
                                                Test Will Start In
                                            </p>
                                            <div className="text-5xl font-black text-amber-900 font-mono tracking-wider mb-3">
                                                {(() => {
                                                    const h = Math.floor(timeLeftToStart / 3600);
                                                    const m = Math.floor((timeLeftToStart % 3600) / 60);
                                                    const s = timeLeftToStart % 60;
                                                    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                                                })()}
                                            </div>
                                            <p className="text-sm text-amber-800 font-bold">
                                                Scheduled Start: {new Date(testInfo.startTime).toLocaleString("en-IN", {
                                                    timeZone: "Asia/Kolkata",
                                                    dateStyle: "full",
                                                    timeStyle: "short"
                                                })}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleProceedToPermissions}
                                                disabled={!agreedToTerms}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-5 rounded-xl transition-all shadow-lg transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                            >
                                                <Camera size={26} />
                                                {agreedToTerms ? 'PROCEED TO CAMERA SETUP' : 'PLEASE ACCEPT THE DECLARATION'}
                                                <ArrowRight size={26} />
                                            </button>

                                            {!agreedToTerms && (
                                                <p className="text-center text-red-600 text-sm font-medium mt-3">
                                                    ⚠️ You must accept the declaration to proceed
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="text-center mb-4">
                                <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                                    <Video className="text-purple-600" size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Camera Setup</h2>
                                <p className="text-gray-500 text-sm">Allow camera access to proceed</p>
                            </div>

                            {/* Camera Preview */}
                            <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                                {cameraPermission === "checking" && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                    </div>
                                )}

                                {cameraPermission === "granted" && (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover transform scale-x-[-1]"
                                    />
                                )}

                                {cameraPermission === "denied" && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                                        <XCircle size={48} className="text-red-400 mb-3" />
                                        <p className="text-center text-sm">Camera access denied</p>
                                    </div>
                                )}

                                {/* Status indicator */}
                                {cameraPermission === "granted" && (
                                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        Camera Active
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-medium">Permission Required</p>
                                            <p className="text-xs mt-1">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Permission Status */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Camera size={20} className="text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Camera Access</span>
                                    </div>
                                    {cameraPermission === "granted" && (
                                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                            <CheckCircle size={16} /> Granted
                                        </span>
                                    )}
                                    {cameraPermission === "denied" && (
                                        <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                                            <XCircle size={16} /> Denied
                                        </span>
                                    )}
                                    {cameraPermission === "checking" && (
                                        <span className="text-gray-500 text-sm">Checking...</span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            {cameraPermission === "denied" && (
                                <button
                                    onClick={handleRetryCamera}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition"
                                >
                                    Retry Camera Access
                                </button>
                            )}

                            <button
                                onClick={handleStartTest}
                                disabled={cameraPermission !== "granted"}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={20} />
                                Start Test Now
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="w-full text-gray-500 text-sm hover:text-gray-700"
                            >
                                Back to Instructions
                            </button>
                        </div>
                    )}
                </div>
            </div >

            <p className="mt-8 text-gray-400 text-xs">
                &copy; {new Date().getFullYear()} Online Examination System. All rights reserved.
            </p>
        </div >
    );
}
