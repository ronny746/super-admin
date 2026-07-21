import React from "react";
import { FaPlay } from 'react-icons/fa';
import thumb1 from '../assets/images/centre-image.jpeg'; // Placeholder
import thumb2 from '../assets/images/centre-image.jpeg'; // Placeholder

const DemoClasses = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-[1240px] mx-auto px-6">

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[28px] font-bold text-[#3C4852]">
                        Watch demo classes
                    </h2>
                    <div className="hidden md:flex gap-2">
                        <button className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"><span className="text-gray-500">‹</span></button>
                        <button className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"><span className="text-gray-500">›</span></button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <div>
                        <div className="relative rounded-[16px] overflow-hidden mb-4 group cursor-pointer">
                            <img src={thumb1} alt="Kinematics" className="w-full h-[240px] object-cover" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-[#7C4DFF] flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                                    <FaPlay className="pl-1 w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-gray-100 text-[10px] font-bold px-1.5 py-0.5 rounded text-gray-500">EN</span>
                            <span className="text-[11px] font-bold text-[#7C4DFF] tracking-wide uppercase">PHYSICS</span>
                        </div>
                        <h3 className="text-[18px] font-bold text-[#1A1A2E] mb-1">Kinematics</h3>
                        <p className="text-[#7A8B94] text-[14px]">Ajit Lulla</p>
                    </div>

                    {/* Card 2 */}
                    <div>
                        <div className="relative rounded-[16px] overflow-hidden mb-4 group cursor-pointer">
                            <img src={thumb2} alt="Quadratic Equations" className="w-full h-[240px] object-cover" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-[#7C4DFF] flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                                    <FaPlay className="pl-1 w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-gray-100 text-[10px] font-bold px-1.5 py-0.5 rounded text-gray-500">EN</span>
                            <span className="text-[11px] font-bold text-[#7C4DFF] tracking-wide uppercase">MATHEMATICS</span>
                        </div>
                        <h3 className="text-[18px] font-bold text-[#1A1A2E] mb-1">Quadratic Equations</h3>
                        <p className="text-[#7A8B94] text-[14px]">Devendra Belani</p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default DemoClasses;
