import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-6">Privacy Policy</h1>
                    <div className="h-1.5 w-24 bg-brand-blue mx-auto rounded-full"></div>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none text-brand-dark">

                    <p className="text-lg mb-8 text-[#1F2937] font-medium border-l-4 border-brand-blue pl-4 bg-gray-50 py-4 rounded-r-lg">
                        At <a href="https://unacademykotacentre.com" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-blue hover:underline">unacademykotacentre.com</a>, we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
                    </p>

                    {/* Quick Summary */}
                    <div className="mb-12 space-y-4 text-brand-dark">
                        <p>
                            We respect your privacy. Any information submitted on this website such as name, phone number, or email is used only for academic counselling, course-related communication, and student support.
                        </p>
                        <p>
                            We do not sell or share personal information with third parties.
                        </p>
                        <p>
                            Data may be used internally to improve services and communication.
                        </p>
                        <p className="font-medium text-[#1F2937]">
                            By using this website, you consent to this privacy policy.
                        </p>
                    </div>

                    {/* Section 1: Information We Collect */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">1</span>
                            Information We Collect
                        </h2>
                        <p className="mb-2">We may collect the following information when you visit our website or submit a form:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Name</li>
                            <li>Phone number</li>
                            <li>Email address</li>
                            <li>Course interest and academic details</li>
                            <li>Any other information voluntarily provided by you</li>
                        </ul>
                    </section>

                    {/* Section 2: How We Use Your Information */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">2</span>
                            How We Use Your Information
                        </h2>
                        <p className="mb-2">Your information is used to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide course details, counselling, and admission support</li>
                            <li>Contact you via call, SMS, WhatsApp, or email regarding academic updates</li>
                            <li>Improve our services and user experience</li>
                            <li>Maintain internal records</li>
                        </ul>
                    </section>

                    {/* Section 3: Data Protection */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">3</span>
                            Data Protection
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>We implement reasonable security measures to protect your data</li>
                            <li>Your information is accessible only to authorised personnel</li>
                            <li>We do not sell, rent, or trade your personal information to third parties</li>
                        </ul>
                    </section>

                    {/* Section 4: Cookies */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">4</span>
                            Cookies
                        </h2>
                        <p className="mb-2">This website may use cookies to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Improve site performance</li>
                            <li>Analyse traffic and user behaviour</li>
                        </ul>
                        <p className="mt-2">You may disable cookies in your browser settings if you prefer.</p>
                    </section>

                    {/* Section 5: Third-Party Platforms */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">5</span>
                            Third-Party Platforms
                        </h2>
                        <p>
                            Our website may link to Unacademy’s official platforms or third-party websites. We are not responsible for their privacy practices or content.
                        </p>
                    </section>

                    {/* Section 6: Consent */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">6</span>
                            Consent
                        </h2>
                        <p>
                            By using this website and submitting your details, you consent to this Privacy Policy.
                        </p>
                    </section>

                    {/* Section 7: Policy Updates */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">7</span>
                            Policy Updates
                        </h2>
                        <p>
                            We reserve the right to update this Privacy Policy at any time. Changes will be effective immediately upon posting.
                        </p>
                    </section>

                    {/* Section 8: Contact */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">8</span>
                            Contact
                        </h2>
                        <p>For privacy-related queries, contact:</p>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 inline-block mt-2">
                            <p className="font-semibold text-[#1F2937]">Unacademy Kota Centre – Kota, Rajasthan</p>
                        </div>
                    </section>

                    {/* (Sections Removed) */}

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
