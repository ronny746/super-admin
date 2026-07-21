import React from 'react';
import topNeuronLogo from '../assets/admitcard/TopNeurons-Horizontal-1.png';
import uaIcon from '../assets/admitcard/Unacademy-logo.png';
import sealImg from '../assets/seal.png';

const AdmitCardUI = React.forwardRef(({ data, photoPreview }, ref) => {
    return (
        <div ref={ref} className="w-[800px] bg-white border border-gray-300 rounded-lg overflow-hidden font-sans text-sm p-4 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-indigo-900">
                <div className="flex items-center space-x-2">
                    <img src={uaIcon} alt="Unacademy Icon" className="w-10 h-10 object-contain" />
                    <div>
                        <div className="text-3xl font-extrabold text-gray-800 tracking-tight lowercase">Unacademy</div>
                        <div className="text-sm font-bold text-blue-800 tracking-widest mt-0.5">KOTA CENTRE 2.0</div>
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-blue-900 uppercase tracking-wider">Admit Card</h1>
                    <div className="flex items-center justify-center mt-1">
                        <div className="h-px bg-blue-900 w-12"></div>
                        <span className="mx-2 text-blue-600 font-bold tracking-widest text-sm">ENTRANCE TEST</span>
                        <div className="h-px bg-blue-900 w-12"></div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="text-right">
                        <img src={topNeuronLogo} alt="Top Neuron" className="h-14 object-contain" />
                    </div>
                </div>
            </div>

            {/* Blue Banner */}
            <div className="bg-[#0b1f5f] text-white text-center py-2 font-bold mb-6 tracking-wide text-sm rounded">
                JOINT ENTRANCE ORGANISED BY <span className="text-green-400">UNACADEMY KOTA CENTRE 2.0</span> & <span className="text-green-400">TOP NEURON</span>
            </div>

            <div className="flex gap-6">
                {/* Left Column - Photo & Instructions */}
                <div className="w-[30%] flex flex-col space-y-4">
                    {/* Photo Box */}
                    <div className="border border-dashed border-gray-400 rounded-lg p-2 h-48 flex items-center justify-center text-center text-gray-500 relative overflow-hidden bg-gray-50">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Candidate" className="w-full h-full object-cover rounded" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-xs">
                                <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
                                <div className="w-24 h-12 bg-gray-300 rounded-t-full"></div>
                                <p className="mt-4">Paste your recent<br />passport size<br />photograph here</p>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="border border-blue-900 rounded-lg overflow-hidden">
                        <div className="bg-[#0b1f5f] text-white text-center py-1.5 font-bold text-sm">
                            IMPORTANT INSTRUCTIONS
                        </div>
                        <div className="p-3 text-[11px] leading-snug space-y-2 bg-white">
                            <p>1. Carry this Admit Card along with a valid photo ID proof.</p>
                            <p>2. Reach the exam centre at least 30 minutes before the reporting time.</p>
                            <p>3. You will not be allowed to enter the exam hall after the gate closing time.</p>
                            <p>4. Use of mobile phone, smartwatch, calculator or any electronic device is strictly prohibited.</p>
                            <p>5. Follow all the instructions given by the invigilator.</p>
                        </div>
                    </div>

                    {/* Signatory */}
                    <div className="text-center pt-4">
                        <div className="w-32 h-16 mx-auto mb-1 flex items-end justify-center">
                            <img src={sealImg} alt="Signature/Seal" className="h-full object-contain" />
                        </div>
                        <p className="text-xs font-bold text-gray-800">Authorised Signatory</p>
                        <p className="text-[10px] text-gray-600">Unacademy Kota Centre 2.0<br />& Top Neuron</p>
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="w-[70%] flex flex-col justify-between">
                    <div className="space-y-5 px-4 pt-2">
                        {/* Detail Rows */}
                        <div className="flex items-center">
                            <div className="w-1/3 flex items-center space-x-3 text-gray-700 font-medium">
                                <div className="text-blue-600 text-lg">👤</div>
                                <span>Candidate Name</span>
                            </div>
                            <div className="w-8 text-center text-gray-600">:</div>
                            <div className="w-2/3 border-b border-gray-400 pb-1 font-bold text-gray-800 uppercase pl-2">
                                {data?.Name || ''}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-1/3 flex items-center space-x-3 text-gray-700 font-medium">
                                <div className="text-blue-600 text-lg">🪪</div>
                                <span>Father's Name</span>
                            </div>
                            <div className="w-8 text-center text-gray-600">:</div>
                            <div className="w-2/3 border-b border-gray-400 pb-1 font-bold text-gray-800 uppercase pl-2">
                                {data?.["Father's Name"] || ''}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-1/3 flex items-center space-x-3 text-gray-700 font-medium">
                                <div className="text-blue-600 text-lg">📱</div>
                                <span>Mobile Number</span>
                            </div>
                            <div className="w-8 text-center text-gray-600">:</div>
                            <div className="w-2/3 border-b border-gray-400 pb-1 font-bold text-gray-800 pl-2">
                                {data?.Respondent || data?.["WhatsAPP Number"] || ''}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-1/3 flex items-center space-x-3 text-gray-700 font-medium">
                                <div className="text-blue-600 text-lg">🏫</div>
                                <span>Class & Board</span>
                            </div>
                            <div className="w-8 text-center text-gray-600">:</div>
                            <div className="w-2/3 border-b border-gray-400 pb-1 font-bold text-gray-800 pl-2">
                                {data?.Class || ''} {data?.Board ? `(${data.Board})` : ''}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-1/3 flex items-center space-x-3 text-gray-700 font-medium">
                                <div className="text-blue-600 text-lg">📅</div>
                                <span>Exam Date</span>
                            </div>
                            <div className="w-8 text-center text-gray-600">:</div>
                            <div className="w-2/3 border-b border-gray-400 pb-1 font-bold text-gray-800 pl-2">
                                {data?.Date || ''}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-1/3 flex items-center space-x-3 text-gray-700 font-medium">
                                <div className="text-blue-600 text-lg">🕒</div>
                                <span>Reporting Time</span>
                            </div>
                            <div className="w-8 text-center text-gray-600">:</div>
                            <div className="w-2/3 border-b border-gray-400 pb-1 font-bold text-gray-800 pl-2">
                                {data?.["Reporting Time"] || ''}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-1/3 flex items-center space-x-3 text-gray-700 font-medium">
                                <div className="text-blue-600 text-lg">⏱️</div>
                                <span>Exam Time</span>
                            </div>
                            <div className="w-8 text-center text-gray-600">:</div>
                            <div className="w-2/3 border-b border-gray-400 pb-1 font-bold text-gray-800 pl-2">
                                {data?.Timing || ''}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-1/3 flex items-center space-x-3 text-gray-700 font-medium mt-1">
                                <div className="text-blue-600 text-lg">📍</div>
                                <span>Exam Centre</span>
                            </div>
                            <div className="w-8 text-center text-gray-600 mt-1">:</div>
                            <div className="w-2/3 border-b border-gray-400 pb-1 font-bold text-gray-800 pl-2 min-h-[2rem]">
                                {data?.Venue || ''}
                            </div>
                        </div>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="flex justify-end items-end mt-8 pr-4">
                        <div className="text-center">
                            <div className="w-48 h-8 border-b border-gray-400 mb-1"></div>
                            <p className="text-xs font-bold text-gray-800">Candidate Signature</p>
                            <p className="text-[10px] text-gray-600">(To be signed in the presence<br />of invigilator)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AdmitCardUI;
