import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import logo from "../assets/images/UA_LOGO_Color.png";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState(null);
    const location = useLocation();

    const links = [
        { name: 'ABOUT US', href: '/about-us' },
        {
            name: 'COURSES',
            href: '/courses',
            hasDropdown: true,
            dropdownItems: [
                {
                    name: 'IIT JEE',
                    href: '/courses?category=iitjee',
                    subItems: [
                        { name: 'Class 11', href: '/courses?category=iitjee&tab=class11' },
                        { name: 'Class 12', href: '/courses?category=iitjee&tab=class12' },
                        { name: 'Dropper', href: '/courses?category=iitjee&tab=dropper' },
                    ]
                },
                {
                    name: 'NEET UG',
                    href: '/courses?category=neetug',
                    subItems: [
                        { name: 'Class 11', href: '/courses?category=neetug&tab=class11' },
                        { name: 'Class 12', href: '/courses?category=neetug&tab=class12' },
                        { name: 'Dropper', href: '/courses?category=neetug&tab=dropper' },
                    ]
                },
                {
                    name: 'Foundation',
                    href: '/courses?category=foundation',
                    subItems: [
                        { name: 'Class 6', href: '/courses?category=foundation&tab=class6' },
                        { name: 'Class 7', href: '/courses?category=foundation&tab=class7' },
                        { name: 'Class 8', href: '/courses?category=foundation&tab=class8' },
                        { name: 'Class 9', href: '/courses?category=foundation&tab=class9' },
                        { name: 'Class 10', href: '/courses?category=foundation&tab=class10' },
                    ]
                },
                {
                    name: 'Study Abroad',
                    href: '/cosmos',
                    subItems: [
                        { name: 'MBBS', href: '/cosmos' },
                        { name: 'SAT', href: '/cosmos' },
                    ]
                },
            ]
        },
        { name: 'COSMOS DIVISION', href: '/cosmos' },
        {
            name: 'SCHOLARSHIPS',
            href: '#',
            hasDropdown: true,
            dropdownItems: [
                { name: 'USAT', href: '/scholarship' },
                { name: 'UNLOCK YOUR SCHOLARSHIP', href: '/unlock-your-scholarship' }
            ]
        },
        { name: 'PAY FEE', href: '/pay-fee' }
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

                    {/* Left Section: Mobile Menu + Logo */}
                    <div className="shrink-0 flex items-center gap-2 lg:gap-0">
                        {/* Mobile Hamburger Button - Visible on lg and below */}
                        <button
                            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 group">
                            <img
                                src={logo}
                                alt="Unacademy Centre"
                                className="h-4 md:h-5 lg:h-[22px] xl:h-6 object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </a>
                    </div>

                    {/* Center Section: Navigation Links - Visible only on lg+ */}
                    <div className="hidden lg:flex flex-1 items-center justify-center gap-3 xl:gap-6">
                        {links.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <div key={link.name} className="relative group">
                                    <a
                                        href={link.href}
                                        className={`
                                            flex items-center gap-1 text-[12px] xl:text-[14px] font-bold transition-colors duration-200 py-6 whitespace-nowrap
                                            ${active ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}
                                        `}
                                    >
                                        {link.name}
                                        {link.hasDropdown && (
                                            <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                        <span
                                            className={`
                                                absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform transition-transform duration-200 origin-left
                                                ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                                            `}
                                        ></span>
                                    </a>
                                    {link.hasDropdown && (
                                        <div className="absolute top-full left-0 w-64 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50 overflow-visible">
                                            <div className="py-2">
                                                {link.dropdownItems.map(item => (
                                                    <div key={item.name} className="relative group/sub">
                                                        <a
                                                            href={item.href}
                                                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors whitespace-nowrap"
                                                        >
                                                            {item.name}
                                                            {item.subItems && (
                                                                <svg className="w-4 h-4 text-gray-400 group-hover/sub:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            )}
                                                        </a>

                                                        {/* Nested Sub-Menu */}
                                                        {item.subItems && (
                                                            <div className="absolute top-0 left-[100%] w-48 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 -translate-x-2 group-hover/sub:translate-x-0 z-50 overflow-hidden ml-1">
                                                                <div className="py-2">
                                                                    {item.subItems.map(sub => (
                                                                        <a
                                                                            key={sub.name}
                                                                            href={sub.href}
                                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                                        >
                                                                            {sub.name}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Section: Buttons - Visible only on lg+ (Desktop) */}
                    <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
                        {/* Contact Numbers */}
                        <div className="flex flex-col items-start gap-1 mr-1 xl:mr-2">
                            <a 
                                href="tel:+916366527093" 
                                className="flex items-center gap-1.5 xl:gap-2 text-[13px] xl:text-[15px] font-bold text-gray-700 hover:text-blue-600 transition-colors group"
                            >
                                <Phone className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
                                +91 6366527093
                            </a>
                            <a 
                                href="https://wa.me/918764820042" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 xl:gap-2 text-[13px] xl:text-[15px] font-bold text-gray-700 hover:text-[#25D366] transition-colors group"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                +91 8764820042
                            </a>
                        </div>

                        <a
                            href="https://unacademykotacentre.com/admin/form/enquiry-form-2026-27"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-una-primary !text-[13px] !py-2 !px-4 xl:!text-[15px] xl:!py-3 xl:!px-7"
                        >
                            Enquire Now
                        </a>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown (Slide Down) - Visible on lg and below */}
            <div
                className={`
                    lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl 
                    transition-all duration-300 ease-in-out origin-top z-40 overflow-y-auto overflow-x-hidden
                    ${isMenuOpen ? 'max-h-[calc(100vh-4rem)] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}
                `}
            >
                <div className="px-4 py-6 flex flex-col space-y-2">
                    {/* Dropdowns in Mobile Menu */}
                    {links.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <div key={link.name}>
                                <a
                                    href={link.href}
                                    className={`
                                            block px-4 py-3 text-base font-medium rounded-lg transition-colors border-l-4 
                                            ${active
                                            ? 'bg-blue-50 text-blue-700 border-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-transparent'
                                        }
                                        `}
                                    onClick={(e) => {
                                        if (link.hasDropdown) {
                                            e.preventDefault();
                                            setExpandedMenu(expandedMenu === link.name ? null : link.name);
                                        } else {
                                            setIsMenuOpen(false);
                                        }
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{link.name}</span>
                                        {link.hasDropdown && (
                                            <svg
                                                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedMenu === link.name ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </div>
                                </a>
                                {link.hasDropdown && (
                                    <div
                                        className={`
                                                pl-8 pr-4 space-y-2 border-l border-gray-100 ml-4 overflow-hidden transition-all duration-300
                                                ${expandedMenu === link.name ? 'max-h-[500px] py-2 mb-2 opacity-100' : 'max-h-0 py-0 mb-0 opacity-0'}
                                            `}
                                    >
                                        {link.dropdownItems.map(item => (
                                            <div key={item.name} className="flex flex-col">
                                                <a
                                                    href={item.href}
                                                    className="block py-2 text-sm text-gray-700 font-medium hover:text-blue-600"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {item.name}
                                                </a>
                                                {/* Mobile Nested Sub-Menu */}
                                                {item.subItems && (
                                                    <div className="pl-4 border-l-2 border-gray-100 ml-2 flex flex-col space-y-1 py-1 mb-2">
                                                        {item.subItems.map(sub => (
                                                            <a
                                                                key={sub.name}
                                                                href={sub.href}
                                                                className="block py-1.5 text-sm text-gray-500 hover:text-blue-600"
                                                                onClick={() => setIsMenuOpen(false)}
                                                            >
                                                                {sub.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="pt-2 pb-2 flex flex-col space-y-2 px-4">
                    </div>

                    {/* Contact Numbers - Mobile Menu */}
                    <div className="pt-4 border-t border-gray-100 px-4 flex flex-col gap-2 mb-3">
                        <a 
                            href="tel:+916366527093" 
                            className="flex items-center justify-center gap-2 w-full py-3 text-base font-bold text-gray-800 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <Phone className="w-5 h-5 text-blue-600" />
                            +91 6366527093
                        </a>
                        <a 
                            href="https://wa.me/918764820042" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 text-base font-bold text-gray-800 bg-[#25D366]/10 rounded-xl hover:bg-[#25D366]/20 transition-colors"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#25D366]">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            +91 8764820042
                        </a>
                    </div>

                    {/* Enquire Now Button - Prominent in Mobile Menu */}
                    <div className="px-4 pb-4">
                        <a
                            href="https://unacademykotacentre.com/admin/form/enquiry-form-2026-27"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                flex items-center justify-center w-full
                                btn-una-primary py-3.5
                            "
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Enquire Now
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
