import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axios_client';
import { toast } from 'react-hot-toast';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { Camera, Image as ImageIcon, Upload, Edit, Download, CheckCircle, Search } from 'lucide-react';
import AdmitCardUI from '../components/AdmitCardUI';
// We need to import the excel file as a URL. Since Vite handles assets, we import it like this:
import excelFileUrl from '../assets/admitcard/Rajasthan Patrika admit card.xlsx?url';

export default function AdmitCardFlow() {
    const [step, setStep] = useState(1);
    const [mobileNumber, setMobileNumber] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExistingPhoto, setIsExistingPhoto] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const fileInputRef = useRef(null);
    const admitCardRef = useRef(null);
    const printRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Step 1: Search and Verify Mobile Number in static Excel
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!mobileNumber || mobileNumber.length < 10) {
            toast.error("Please enter a valid mobile number");
            return;
        }

        setIsLoading(true);
        setPhotoPreview(null);
        setStudentData(null);
        setIsExistingPhoto(false);

        try {
            // 1. Fetch and Parse Excel File
            const response = await fetch(excelFileUrl);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            
            // Assume data is in the first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

            // Find student by Respondent or WhatsAPP Number
            const student = data.find(row => 
                String(row['Respondent'] || '').trim() === mobileNumber.trim() || 
                String(row['WhatsAPP Number'] || '').trim() === mobileNumber.trim()
            );

            if (!student) {
                toast.error("No record found for this mobile number in the sheet.");
                setIsLoading(false);
                return;
            }

            setStudentData(student);

            // 2. Check Backend if photo already exists for this number
            try {
                // Check if photo exists
                const res = await axiosClient.get(`/admitcard/${mobileNumber}`);
                if (res.data.success && res.data.data) {
                    // Photo exists
                    setIsExistingPhoto(true);
                    setPhotoPreview(res.data.data.base64Image || res.data.data.photoUrl);
                    setStep(3); // Go straight to preview
                } else {
                    toast.success("Details Verified!");
                    setStep(2); // No photo, go to upload screen
                }
            } catch (err) {
                // Not found is fine (404)
                console.log("No existing photo found in DB");
                toast.success("Details Verified!");
                setStep(2); // No photo, go to upload screen
            }
        } catch (error) {
            console.error("Error reading Excel:", error);
            toast.error("Failed to read the student database.");
        } finally {
            setIsLoading(false);
        }
    };

    // Live Web Camera Functions
    const startCamera = async () => {
        setIsCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Important for iOS:
                videoRef.current.setAttribute('playsinline', true);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.error("Could not access camera. Please ensure permissions are allowed.");
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setIsCameraActive(false);
    };

    const captureLivePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setPhotoPreview(dataUrl);
            stopCamera();
            setStep(3);
        }
    };

    // Step 3: Upload to S3 & generate PDFhoto Selection
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Basic validation
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File size must be less than 5MB");
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error("Please upload a valid image file");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setIsExistingPhoto(false); // They selected a new photo
                setStep(3); // Move to preview step automatically after uploading
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Step 3: Save Photo to Backend (if new) and Generate PDF
    const handleFinalizeAndDownload = async () => {
        if (!photoPreview) {
            toast.error("Please upload a photo first");
            return;
        }

        setIsSaving(true);
        
        // 1. If photo is new, upload to backend
        if (!isExistingPhoto && photoPreview.startsWith('data:image')) {
            try {
                const uploadRes = await axiosClient.post(`/admitcard/upload`, {
                    mobileNumber: mobileNumber,
                    base64Image: photoPreview
                });
                
                if (uploadRes.data.success) {
                    toast.success("Photo saved successfully!");
                    setIsExistingPhoto(true); // Mark as saved
                    // We keep the data URL in preview for immediate rendering, but it's now saved.
                }
            } catch (err) {
                console.error("Upload error:", err);
                toast.error("Failed to save photo. Please try again.");
                setIsSaving(false);
                return; // Stop if upload fails
            }
        }

        // 2. Generate PDF
        toast.loading("Generating Admit Card PDF...", { id: 'pdf-gen' });
        try {
            const printElement = printRef.current;
            if (!printElement) return;

            // Generate image using html-to-image from the HIDDEN, perfect 800px element
            const imgData = await toPng(printElement, {
                quality: 1.0,
                pixelRatio: 2,
            });

            // Create PDF (A4 size is approx 210x297mm)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const margin = 10;
            const targetWidth = pdfWidth - (margin * 2);
            const targetHeight = (printElement.offsetHeight * targetWidth) / printElement.offsetWidth;

            // Add margin from top and left
            pdf.addImage(imgData, 'PNG', margin, margin, targetWidth, targetHeight);
            
            const studentName = studentData?.Name ? studentData.Name.replace(/\s+/g, '_') : mobileNumber;
            pdf.save(`Admit_Card_${studentName}.pdf`);
            
            toast.success("Admit Card Downloaded!", { id: 'pdf-gen' });
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Failed to generate PDF", { id: 'pdf-gen' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <div className="max-w-4xl w-full">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Entrance Test Admit Card</h1>
                    <p className="text-gray-500 mt-2">Verify details and download your admit card</p>
                </div>

                {/* Step 1: Mobile Verification */}
                {step === 1 && (
                    <div className="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto">
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Registered Mobile Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter 10-digit number"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-medium"
                            >
                                {isLoading ? 'Verifying...' : 'Search Details'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Dedicated Photo Upload Screen */}
                {step === 2 && studentData && !photoPreview && (
                    <div className="bg-white p-8 rounded-xl shadow-md max-w-lg mx-auto text-center space-y-6">
                        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Upload Photograph</h2>
                        <p className="text-gray-600 text-sm">
                            Please upload a recent, clear passport-size photograph to generate your admit card.
                        </p>
                        
                        {isCameraActive ? (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative w-full max-w-[300px] aspect-[3/4] bg-black rounded-lg overflow-hidden flex justify-center items-center">
                                    <video 
                                        ref={videoRef} 
                                        autoPlay 
                                        playsInline 
                                        className="h-full w-full object-cover transform -scale-x-100" 
                                    />
                                    <canvas ref={canvasRef} className="hidden" />
                                    {/* Face Guide Overlay */}
                                    <div className="absolute inset-0 border-4 border-dashed border-white/40 m-8 rounded-[40px] pointer-events-none flex items-center justify-center">
                                        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">Position your face here</span>
                                    </div>
                                </div>
                                <div className="flex space-x-4 w-full justify-center">
                                    <button 
                                        onClick={stopCamera}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={captureLivePhoto}
                                        className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Capture
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-3">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handlePhotoChange} 
                                    className="hidden" 
                                    accept="image/*"
                                />
                                
                                {/* Option 1: Live Browser Camera */}
                                <button
                                    onClick={startCamera}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 font-medium space-x-2"
                                >
                                    <Camera className="w-5 h-5" />
                                    <span>Take Photo (Camera)</span>
                                </button>

                                <div className="relative flex py-2 items-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Option 2: Gallery */}
                                <button
                                    onClick={() => {
                                        fileInputRef.current.removeAttribute('capture');
                                        fileInputRef.current.click();
                                    }}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 font-medium space-x-2"
                                >
                                    <ImageIcon className="w-5 h-5" />
                                    <span>Upload from Gallery</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Final Preview & Download */}
                {step === 3 && studentData && photoPreview && (
                    <div className="space-y-8 flex flex-col items-center">
                        
                        {/* Control Panel */}
                        <div className="bg-white p-4 rounded-xl shadow-sm w-full max-w-[800px] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-start">
                                <button 
                                    onClick={() => {
                                        setStep(1);
                                        setMobileNumber('');
                                        setPhotoPreview(null);
                                        setStudentData(null);
                                        setIsExistingPhoto(false);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-sm font-medium whitespace-nowrap"
                                >
                                    ← Back
                                </button>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <span className="text-sm text-gray-600 truncate">
                                    Student: <strong className="text-gray-900">{studentData.Name}</strong>
                                </span>
                            </div>

                            <div className="flex w-full sm:w-auto space-x-2 sm:space-x-3 justify-center sm:justify-end">
                                {/* Hidden File Input for "Change Photo" */}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handlePhotoChange} 
                                    className="hidden" 
                                    accept="image/*"
                                />

                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="flex-1 sm:flex-none flex justify-center items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                                    <span className="whitespace-nowrap">Change Photo</span>
                                </button>

                                <button
                                    onClick={handleFinalizeAndDownload}
                                    disabled={!photoPreview || isSaving}
                                    className="flex-1 sm:flex-none flex justify-center items-center space-x-1 sm:space-x-2 px-2 sm:px-6 py-2 border border-transparent rounded-lg text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    )}
                                    <span className="whitespace-nowrap">Download Admit Card</span>
                                </button>
                            </div>
                        </div>
                        
                        {isExistingPhoto && (
                            <div className="w-full max-w-[800px] bg-green-50 border-l-4 border-green-400 p-4 rounded flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                <p className="text-green-700 text-sm">
                                    We found your previously saved photograph. You can download directly or change it.
                                </p>
                            </div>
                        )}
                        {/* Visual Admit Card Wrapper - Removed justify-center which broke mobile scrolling */}
                        <div className="bg-white p-2 sm:p-4 rounded-xl shadow-xl w-full max-w-full overflow-x-auto">
                            <div className="min-w-[800px]">
                                {/* The component shown to the user */}
                                <AdmitCardUI 
                                    ref={admitCardRef} 
                                    data={studentData} 
                                    photoPreview={photoPreview} 
                                />
                            </div>
                        </div>

                        {/* Hidden Admit Card strictly for PDF generation to avoid mobile cropping bugs */}
                        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '800px' }}>
                            <AdmitCardUI 
                                ref={printRef} 
                                data={studentData} 
                                photoPreview={photoPreview} 
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
