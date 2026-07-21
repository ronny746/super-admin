import React, { useEffect } from 'react';

const TermsConditions = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-6">Terms & Conditions</h1>
                    <div className="h-1.5 w-24 bg-brand-blue mx-auto rounded-full"></div>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none text-brand-dark">

                    <p className="text-lg mb-8 text-[#1F2937] font-medium border-l-4 border-brand-blue pl-4 bg-gray-50 py-4 rounded-r-lg">
                        Welcome to <a href="https://unacademykotacentre.com" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-blue hover:underline">unacademykotacentre.com</a>. By accessing or using this website, you agree to be bound by the following Terms & Conditions. Please read them carefully before using our services.
                    </p>

                    {/* Quick Summary / Disclaimer */}
                    <div className="mb-12 space-y-4 text-brand-dark">
                        <p>
                            Information provided on this website is for general academic guidance purposes only.
                        </p>
                        <p>
                            Course structure, schedules, and fees are subject to change.
                        </p>
                        <p>
                            Admission does not guarantee exam results or ranks.
                        </p>
                        <p className="font-medium text-[#1F2937]">
                            Use of this website indicates acceptance of these terms.
                        </p>
                    </div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">1</span>
                            About Us
                        </h2>
                        <p>
                            Unacademy Kota Centre is an offline coaching and academic support centre located in Kota, Rajasthan, operating in association with Unacademy. This website is intended to provide information about courses, classroom programs, counselling, and related educational services offered at the Kota Centre.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">2</span>
                            Acceptance of Terms
                        </h2>
                        <p>
                            By accessing this website, submitting your details, or enrolling in any program, you confirm that you have read, understood, and agreed to these Terms & Conditions. If you do not agree, please do not use this website.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">3</span>
                            Website Use
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>The content on this website is for informational purposes only</li>
                            <li>You agree not to misuse the website or attempt to disrupt its functionality</li>
                            <li>Any unauthorized use of this website may result in legal action</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">4</span>
                            Course Information
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Course details, faculty, schedules, and fees displayed on the website are subject to change without prior notice</li>
                            <li>Final course offerings and pricing will be confirmed at the centre or through official communication</li>
                            <li>Admission is subject to eligibility criteria and seat availability</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">5</span>
                            Registration & Enquiries
                        </h2>
                        <p className="mb-2">By submitting your phone number, email, or other personal details:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You consent to be contacted by Unacademy Kota Centre via call, SMS, WhatsApp, or email for academic updates and counselling</li>
                            <li>You confirm that the information provided by you is accurate and complete</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">6</span>
                            Payments & Fees
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Fees once paid are governed by the refund policy shared at the centre or in official documentation</li>
                            <li>Online or offline payments must be made only through authorised payment methods</li>
                            <li>The centre is not responsible for payments made to unauthorised persons or platforms</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">7</span>
                            Intellectual Property
                        </h2>
                        <p className="mb-2">All content on this website including text, images, logos, design, and branding:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Is the property of Unacademy or Unacademy Kota Centre</li>
                            <li>May not be copied, reproduced, or distributed without written permission</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">8</span>
                            Third-Party Links
                        </h2>
                        <p>
                            This website may contain links to Unacademy’s official platforms or third-party websites. We are not responsible for the content, policies, or practices of any third-party websites.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">9</span>
                            Limitation of Liability
                        </h2>
                        <p className="mb-2">Unacademy Kota Centre shall not be held liable for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Any direct or indirect loss arising from the use of this website</li>
                            <li>Technical issues, downtime, or temporary unavailability of the website</li>
                            <li>Decisions made by users based solely on website information</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">10</span>
                            Privacy
                        </h2>
                        <p>
                            All personal information shared by users is handled in accordance with our Privacy Policy and applicable laws. We do not sell or misuse user data.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">11</span>
                            Changes to Terms
                        </h2>
                        <p>
                            We reserve the right to update or modify these Terms & Conditions at any time without prior notice. Continued use of the website signifies acceptance of the updated terms.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">12</span>
                            Governing Law
                        </h2>
                        <p>
                            These Terms & Conditions are governed by the laws of India, and any disputes shall be subject to the jurisdiction of Kota, Rajasthan courts.
                        </p>
                    </section>

                    <section className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-brand-blue flex items-center justify-center text-sm font-bold">13</span>
                            Contact Information
                        </h2>
                        <p className="mb-4">For any questions or concerns regarding these Terms & Conditions, please contact us:</p>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <p className="font-bold text-lg mb-2 text-brand-blue">Unacademy Kota Centre</p>
                            <p className="text-[#4B5563] mb-2">📍 Kota, Rajasthan</p>
                            <p className="text-[#4B5563]">🌐 Website: <a href="https://unacademykotacentre.com" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">unacademykotacentre.com</a></p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
