import React, { useEffect } from 'react';

const RefundPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-6 flex items-center justify-center gap-3">
                        <span className="text-brand-blue">💰</span> Refund & Cancellation Policy
                    </h1>
                    <div className="h-1.5 w-24 bg-brand-blue mx-auto rounded-full"></div>
                    <p className="mt-4 text-[#4B5563] font-medium">Unacademy Kota Centre</p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none text-brand-dark">

                    <p className="text-lg mb-8 text-[#1F2937] font-medium border-l-4 border-brand-blue pl-4 bg-gray-50 py-4 rounded-r-lg">
                        Fee refunds, if applicable, are governed by Unacademy’s offline centre policies and communicated at the time of admission.
                    </p>

                    {/* Quick Summary / New Content */}
                    <div className="mb-12 space-y-4 text-brand-dark">
                        <p>
                            Refund requests are evaluated on a case-by-case basis as per applicable terms.
                        </p>
                        <p className="font-medium text-[#1F2937]">
                            Please contact the centre for detailed refund eligibility.
                        </p>
                    </div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">1</span>
                            Fee Payment
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>All fees must be paid through authorised payment modes only</li>
                            <li>Fee receipts and official confirmation will be provided upon successful payment</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">2</span>
                            Refund Policy
                        </h2>
                        <p className="mb-2">Fee refund requests are subject to the official refund policy shared at the centre at the time of admission.</p>
                        <p className="mb-2">Refund eligibility, amount, and timeline depend on:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Course type</li>
                            <li>Duration attended</li>
                            <li>Admission terms</li>
                        </ul>
                        <p className="mt-2">Any applicable deductions will be made as per policy.</p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">3</span>
                            Cancellation
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Admission cancellation requests must be submitted in writing at the centre</li>
                            <li>Verbal or informal requests will not be considered</li>
                            <li>Refund (if applicable) will be processed within the stipulated time mentioned in the policy</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">4</span>
                            Non-Refundable Cases
                        </h2>
                        <p className="mb-2">Fees may be non-refundable in cases including but not limited to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Late refund requests</li>
                            <li>Violation of centre rules</li>
                            <li>Partial course completion beyond the refund window</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">5</span>
                            Final Authority
                        </h2>
                        <p>
                            Unacademy Kota Centre management reserves the final right to approve or reject any refund or cancellation request.
                        </p>
                    </section>

                    <section className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">6</span>
                            Contact for Refund Queries
                        </h2>
                        <p className="text-[#4B5563]">
                            Please contact the admission office at <span className="font-bold text-brand-blue">Unacademy Kota Centre, Kota</span> for detailed assistance.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
