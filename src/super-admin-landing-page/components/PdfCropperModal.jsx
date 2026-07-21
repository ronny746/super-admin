import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { X, Check, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Scissors, Type, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

// Setup worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfCropperModal({ file, onCropComplete, onClose, initialPage = 1 }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(initialPage);
    const [scale, setScale] = useState(1.5);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [pageImage, setPageImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('crop'); // 'crop' or 'text'

    // Convert PDF page to image for cropping
    const onRenderSuccess = () => {
        setTimeout(() => {
            const canvas = document.querySelector('.react-pdf__Page__canvas');
            if (canvas) {
                setPageImage(canvas.toDataURL('image/png', 1.0));
                setLoading(false);
            }
        }, 300);
    };

    const handleConfirm = () => {
        if (!completedCrop || !completedCrop.width || !completedCrop.height || !pageImage) {
            toast.error("Please draw a box to crop the question");
            return;
        }

        const image = new Image();
        image.src = pageImage;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            // We rendered the PDF at a certain scale, but the crop box is relative to the displayed image size
            // react-image-crop gives coordinates in percentages or pixels relative to the DOM element
            
            // To be safe, we'll draw the cropped area
            const imgElement = document.querySelector('.ReactCrop__image');
            if (!imgElement) return;

            const scaleX = image.naturalWidth / imgElement.width;
            const scaleY = image.naturalHeight / imgElement.height;

            canvas.width = completedCrop.width * scaleX;
            canvas.height = completedCrop.height * scaleY;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                image,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY
            );

            const base64Image = canvas.toDataURL('image/png');
            onCropComplete(base64Image, pageNumber);
            onClose();
        };
    };

    const openOriginalPdf = () => {
        if (file) {
            const url = URL.createObjectURL(file);
            window.open(url, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-indigo-400" />
                    <h2 className="font-semibold text-lg">PDF Assistant</h2>
                </div>
                <div className="flex bg-slate-800 rounded-xl p-1">
                    <button 
                        onClick={() => setMode('crop')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'crop' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Scissors className="w-4 h-4" />
                        Crop Image
                    </button>
                    <button 
                        onClick={() => setMode('text')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'text' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Type className="w-4 h-4" />
                        Select Text
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-800 rounded-lg p-1">
                        <button 
                            onClick={() => { setPageNumber(prev => Math.max(1, prev - 1)); setPageImage(null); setLoading(true); }}
                            disabled={pageNumber <= 1}
                            className="p-1 hover:bg-slate-700 rounded disabled:opacity-50"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-1 px-2">
                            <input 
                                type="number"
                                min="1"
                                max={numPages || 1}
                                value={pageNumber}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val >= 1 && val <= (numPages || val)) {
                                        setPageNumber(val);
                                        setPageImage(null);
                                        setLoading(true);
                                    }
                                }}
                                className="w-12 bg-slate-900 border border-slate-700 rounded text-center text-sm py-0.5 focus:outline-hidden focus:border-indigo-500"
                            />
                            <span className="text-slate-500 text-xs font-medium">/ {numPages || '?'}</span>
                        </div>

                        <button 
                            onClick={() => { setPageNumber(prev => Math.min(numPages || prev, prev + 1)); setPageImage(null); setLoading(true); }}
                            disabled={pageNumber >= (numPages || 1)}
                            className="p-1 hover:bg-slate-700 rounded disabled:opacity-50"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="h-6 w-px bg-slate-700"></div>
                    
                    <button 
                        onClick={openOriginalPdf}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-sm font-medium transition-all border border-slate-700"
                        title="Open PDF in new tab for perfect text selection"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Original PDF</span>
                    </button>

                    <div className="h-6 w-px bg-slate-700"></div>
                    <button 
                        onClick={() => { setScale(s => s + 0.2); setPageImage(null); setLoading(true); }}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => { setScale(s => Math.max(0.5, s - 0.2)); setPageImage(null); setLoading(true); }}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <div className="h-6 w-px bg-slate-700"></div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto p-8 flex items-start justify-center relative bg-slate-950">
                {/* PDF Document Rendering */}
                <div className={`${mode === 'text' ? 'block' : 'absolute top-0 left-0 opacity-0 pointer-events-none'}`} style={{ zIndex: mode === 'text' ? 1 : -1 }}>
                    <Document
                        file={file}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={null}
                    >
                        <Page 
                            pageNumber={pageNumber} 
                            scale={scale} 
                            onRenderSuccess={onRenderSuccess}
                            renderTextLayer={true}
                            renderAnnotationLayer={false}
                        />
                    </Document>
                </div>

                {/* Display Image for Cropping (only in crop mode) */}
                {mode === 'crop' && (
                    <>
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 z-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        )}
                        
                        {pageImage && (
                            <div className="bg-white shadow-2xl rounded-sm overflow-hidden">
                                <ReactCrop
                                    crop={crop}
                                    onChange={c => setCrop(c)}
                                    onComplete={c => setCompletedCrop(c)}
                                    className="max-w-full"
                                >
                                    <img src={pageImage} className="max-w-full h-auto ReactCrop__image" alt="PDF Page" />
                                </ReactCrop>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-700 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={!completedCrop?.width}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:text-indigo-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                    <Check className="w-4 h-4" />
                    Confirm Crop
                </button>
            </div>
        </div>
    );
}
