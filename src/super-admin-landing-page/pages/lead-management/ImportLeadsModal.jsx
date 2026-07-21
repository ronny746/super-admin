import React, { useState } from 'react';
import { UploadCloud, X, Download, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { importLeads } from '../../api/leadApi';
import * as xlsx from 'xlsx';

export default function ImportLeadsModal({ isOpen, onClose, onImportSuccess }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDownloadSample = () => {
        // Create sample data
        const sampleData = [
            {
                "First Name": "John",
                "Last Name": "Doe",
                "Mobile Number": "9876543210",
                "Email": "john@example.com",
                "Course": "JEE",
                "Class": "11th",
                "Parent Name": "Jane Doe",
                "Parent Mobile": "9876543211",
                "City": "Pune",
                "Address": "Koregaon Park",
                "Source": "",
                "Status": "",
                "Stage": ""
            }
        ];

        // Create workbook and worksheet
        const ws = xlsx.utils.json_to_sheet(sampleData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "Sample Leads");

        // Generate Excel file
        xlsx.writeFile(wb, "Sample_Leads_Template.xlsx");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file to upload");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await importLeads(formData);
            if (res.success) {
                toast.success(res.message, { duration: 5000 });
                onImportSuccess();
                onClose();
                setFile(null);
            } else {
                toast.error(res.message || "Failed to import leads");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload file");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">Import Leads from Excel</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
                        <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">How to import:</p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Ensure your file is in <strong>.xlsx</strong> or <strong>.csv</strong> format.</li>
                                <li><strong>First Name</strong> and <strong>Mobile Number</strong> are required. Other fields can be left blank.</li>
                                <li>Lead numbers will be generated automatically.</li>
                                <li><strong>Status</strong> defaults to "New" and <strong>Stage</strong> will be empty by default.</li>
                            </ul>
                        </div>
                    </div>

                    <button 
                        type="button" 
                        onClick={handleDownloadSample}
                        className="w-full flex items-center justify-center gap-2 py-2 mb-6 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Download size={16} />
                        Download Sample Template
                    </button>

                    {/* File Dropzone */}
                    <div 
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'}`}
                    >
                        {file ? (
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                                    <UploadCloud size={24} />
                                </div>
                                <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                                <button 
                                    onClick={() => setFile(null)} 
                                    className="mt-4 text-sm text-red-500 hover:text-red-700 font-medium"
                                >
                                    Remove File
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                    <UploadCloud size={24} />
                                </div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Drag and drop your file here</p>
                                <p className="text-xs text-gray-500 mb-4">or click to browse</p>
                                <input 
                                    type="file" 
                                    accept=".xlsx, .csv" 
                                    className="hidden" 
                                    id="file-upload" 
                                    onChange={handleFileChange}
                                />
                                <label 
                                    htmlFor="file-upload" 
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-colors"
                                >
                                    Browse Files
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!file || loading}
                        className={`px-6 py-2.5 rounded-xl font-semibold text-white shadow-sm transition-all flex items-center gap-2 ${
                            !file || loading 
                                ? 'bg-blue-400 cursor-not-allowed opacity-70' 
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Importing...
                            </>
                        ) : (
                            'Import Leads'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
