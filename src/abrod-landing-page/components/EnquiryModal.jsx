import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormView from '../../super-admin-landing-page/pages/forms/FormView';

const EnquiryModal = ({ isOpen, onClose, slug = 'sat' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-100 cursor-pointer"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-x-auto md:top-10 md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl bg-white rounded-3xl shadow-2xl z-101 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#000080]">Enquiry Form</h3>
                                <p className="text-sm text-slate-500">Fill in the details below to get started</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
                            <div className="max-w-2xl mx-auto">
                                <FormView 
                                    formSlug={slug} 
                                    showHeader={false}
                                    showFooter={false}
                                    onSuccess={() => {
                                        // You could handle different success states here
                                        // FormView handles its own success UI now if onSuccess is present
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EnquiryModal;
