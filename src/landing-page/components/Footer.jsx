import React from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/images/unacademy-centre-logo.jpeg';

const Footer = () => {
    const footerLinks = {
        company: [
            { label: 'About us', href: '/about-us' },
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms and Conditions', href: '/terms-conditions' },
            { label: 'Refund Policy', href: '/refund-policy' },
            { label: 'Disclaimer', href: '/disclaimer' },
        ]
    };

    return (
        <footer className="bg-[var(--color-una-navy)] text-white una-texture">
            {/* Main Footer */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-1">
                        <a href="/" className="flex items-center mb-6">
                            <img src={logo} alt="Unacademy" className="h-10 mr-3 rounded-lg" />
                            <span className="text-2xl font-bold">unacademy</span>
                        </a>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            India's largest learning platform with top educators, world-class infrastructure,
                            and technology-driven learning experience.
                        </p>

                        {/* App Download */}
                        <div className="flex flex-wrap gap-3">
                            <a href="https://apps.apple.com/in/app/unacademy-learner-app/id1342565069" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 flex items-center transition-colors">
                                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-xs text-gray-400">Download on</div>
                                    <div className="text-sm font-medium">App Store</div>
                                </div>
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=com.unacademyapp&hl=en_IN" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 flex items-center transition-colors">
                                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.609 1.814L13.792 12 3.609 22.186a.998.998 0 01-.609-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-xs text-gray-400">Get it on</div>
                                    <div className="text-sm font-medium">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link, idx) => (
                                <li key={idx}>
                                    {link.href.startsWith('/') ? (
                                        <Link
                                            to={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-white transition-colors text-sm"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            target={link.href.startsWith('http') ? "_blank" : "_self"}
                                            rel={link.href.startsWith('http') ? "noopener noreferrer" : ""}
                                            className="text-gray-400 hover:text-white transition-colors text-sm"
                                        >
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h4 className="font-bold mb-4">Contact Us</h4>
                        <div className="space-y-4 text-sm text-gray-400">

                            {/* Phone */}
                            <a href="tel:+916366527093" className="flex items-center gap-2 hover:text-white transition-colors">
                                <span className="text-lg">📞</span>
                                <span>+91 6366527093</span>
                            </a>

                            {/* WhatsApp */}
                            <a href="https://wa.me/918764820042" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                <span className="text-lg flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#25D366]">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                </span>
                                <span>+91 8764820042</span>
                            </a>

                            {/* Email */}
                            <a href="mailto:Support@unacademykotacentre.com" className="flex items-center gap-2 hover:text-white transition-colors">
                                <span className="text-lg">📧</span>
                                <span className="break-all">Support@unacademykotacentre.com</span>
                            </a>

                            {/* Address */}
                            {/* <div className="flex gap-2">
                                <span className="text-lg">📍</span>
                                <div>
                                    <p>Unacademy Tower, B-21, Road No. 2,</p>
                                    <p>Indraprastha Industrial Area, Kota, Rajasthan</p>
                                    <br />
                                    <p>Prathmesh, Plot No. 11, (Old Om Cine Plex),</p>
                                    <p>Special Indira Vihar, Kota</p>
                                </div>
                            </div> */}

                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-gray-400 text-sm">
                                Unacademy   Kota Centre, powered by Arkee Scholars
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center space-x-4">
                            {/* Facebook - Commented out */}
                            {/* <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a> */}

                            {/* Instagram 1 */}
                            <a href="https://www.instagram.com/unacademyfoundationschool?igsh=ODc1MTltdm1zZWky" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Unacademy Foundation School Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>

                            {/* Instagram 2 */}
                            <a href="https://www.instagram.com/kotapulsebyunacademy?igsh=MTdwNmlvZjZ3aWt1Zw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Kota Pulse by Unacademy Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>

                            {/* YouTube 1 */}
                            <a href="https://youtube.com/@kotapulsebyunacademy2638?si=oT8dqbv6EEPXSOVV" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Kota Pulse by Unacademy YouTube">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                            </a>

                            {/* YouTube 2 */}
                            <a href="https://youtube.com/@unacademyfoundation82?si=_bkVjwJHaND_o_tK" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Unacademy Foundation YouTube">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                            </a>

                            {/* LinkedIn - Commented out */}
                            {/* <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
