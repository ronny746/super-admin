import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, BookOpen, UserCheck, CheckCircle } from 'lucide-react';

const FeatureSections = ({ activeFeature, tabData }) => {
    if (!tabData) return null;

    const renderPrograms = () => {
        if (!tabData.programs || tabData.programs.length === 0) {
            return (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                    <p>Program details will be updated soon.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {tabData.programs.map((prog, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">{prog.title}</h4>
                        <ul className="space-y-3">
                            {prog.points.map((point, i) => (
                                <li key={i} className="flex items-start text-[15px] text-gray-700">
                                    <CheckCircle2 className="w-5 h-5 mr-3 text-blue-600 shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    };

    const renderBatches = () => {
        if (!tabData.batches || tabData.batches.length === 0) {
            return (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                    <p>No upcoming batches at the moment.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tabData.batches.map((batch, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-bold text-gray-900">{batch.name}</h4>
                            <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                {batch.mode}
                            </span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-6 flex-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="text-sm">Starts: <strong>{batch.startDate}</strong></span>
                        </div>
                        <a
                            href="https://unacademykotacentre.com/admin/form/enquiry-form-web"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            Enroll Now
                        </a>
                    </div>
                ))}
            </div>
        );
    };

    const renderFees = () => {
        if (!tabData.feeStructure || tabData.feeStructure.length === 0) {
            return (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                    <p>Fee structure will be updated soon.</p>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-700">
                        <thead className="bg-blue-900 text-white font-semibold">
                            <tr>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Goal</th>
                                <th className="px-6 py-4">Course Name</th>
                                <th className="px-6 py-4">Fee*</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tabData.feeStructure.map((fee, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{fee.class}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{fee.duration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{fee.goal}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{fee.courseName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{fee.fee}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-gray-50 text-xs text-gray-500 text-right">
                    *T&C applied
                </div>
            </div>
        );
    };

    const renderMethodologies = () => {
        if (!tabData.methodologies || tabData.methodologies.length === 0) {
            return (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                    <p>Methodologies will be updated soon.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tabData.methodologies.map((method, idx) => (
                    <div key={idx} className="flex items-center p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mr-4">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-gray-800 text-[15px]">{method}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
        >
            {activeFeature === 'programs' && renderPrograms()}
            {activeFeature === 'batches' && renderBatches()}
            {activeFeature === 'fees' && renderFees()}
            {activeFeature === 'methodologies' && renderMethodologies()}
        </motion.div>
    );
};

export default FeatureSections;
