import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoryCards = ({ onSelectCategory }) => {
    const navigate = useNavigate();
    const cards = [
        {
            id: 'foundation',
            title: "Foundation (6 to 10)",
            subtitle: "Build Strong Academic Foundations",
            image: new URL('../../assets/courses page/Foundation.png', import.meta.url).href,
            points: [
                "School Curriculum + Competitive Preparation",
                "Strong Academic Foundation",
                "Olympiad & Scholarship Exam Support",
                "Individual Student Monitoring",
                "Smart Learning Environment"
            ],
            color: "bg-indigo-50 border-indigo-100 text-indigo-600"
        },
        {
            id: 'iitjee',
            title: "IIT-JEE",
            subtitle: "Prepare for JEE Main & Advanced",
            image: new URL('../../assets/courses page/iit jee.png', import.meta.url).href,
            points: [
                "Strong Conceptual Foundation with Problem-Solving Framework",
                "Advanced Physics, Chemistry & Mathematics Modules",
                "Topic-wise & Full-Length Mock Tests with Performance Analytics",
                "JEE Advanced-Oriented Critical Thinking & Application-Based Learning",
                "Expert Faculty from Kota’s Premier Academic Ecosystem"
            ],
            color: "bg-blue-50 border-blue-100 text-blue-600"
        },
        {
            id: 'neetug',
            title: "NEET-UG",
            subtitle: "Crack NEET with Expert Guidance",
            image: new URL('../../assets/courses page/neet ug.png', import.meta.url).href,
            points: [
                "Structured NEET-UG Curriculum Aligned with Latest NTA Pattern",
                "In-Depth Physics, Chemistry & Biology Concept Building",
                "NCERT-Centric Framework with Advanced Problem-Solving Modules",
                "Chapter-wise & Full-Length Mock Tests with Detailed Analytics",
                "AI-Driven Performance Tracking & Improvement Plans"
            ],
            color: "bg-emerald-50 border-emerald-100 text-emerald-600"
        },
        {
            id: 'studyabroad',
            title: "Study Abroad (SAT & MBBS)",
            subtitle: "Turn Global Dreams Into Reality",
            image: new URL('../../assets/courses page/study abroad.png', import.meta.url).href,
            points: [
                "Complete Study Abroad Guidance",
                "University Selection Support",
                "Application & Admission Assistance",
                "Scholarship Guidance",
                "Expert Counselling Throughout The Journey"
            ],
            color: "bg-amber-50 border-amber-100 text-amber-600"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {/* Header */}
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Your Dream Career Starts With The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Right Preparation</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Prepare for IIT JEE, NEET & Foundation with Kota's top educators and a structured learning approach.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="w-full relative overflow-hidden bg-[#0C1222]">
                            <img
                                src={card.image}
                                alt={card.title}
                                className="w-full h-auto block transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{card.title}</h3>
                                <p className="text-sm text-gray-600">{card.subtitle}</p>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {card.points.map((point, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-600 leading-relaxed">
                                        <CheckCircle2 className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${card.color.split(' ')[2]}`} />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => {
                                    if (card.id === 'studyabroad') {
                                        navigate('/cosmos');
                                    } else {
                                        onSelectCategory(card.id);
                                    }
                                }}
                                className="w-full py-3 rounded-xl font-bold text-sm bg-gray-900 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 group-hover:gap-3"
                            >
                                Explore Now <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CategoryCards;
