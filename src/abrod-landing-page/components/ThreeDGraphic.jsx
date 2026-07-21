import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Layered Wireframe Cube
export const WireframeCube = ({ size = "w-32 h-32", delay = 0 }) => {
    return (
        <motion.div
            animate={{
                rotateX: [0, 360],
                rotateY: [0, 360],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                delay: delay
            }}
            className={`${size} relative flex items-center justify-center`}
            style={{ transformStyle: "preserve-3d" }}
        >
            {/* Outer Cube */}
            <div className="absolute inset-0 border-2 border-blue-400/40 rounded-lg"
                style={{ transform: "translateZ(40px)" }}></div>
            <div className="absolute inset-0 border-2 border-blue-500/50 rounded-lg"
                style={{ transform: "translateZ(20px)" }}></div>
            <div className="absolute inset-0 border-2 border-blue-600/60 rounded-lg"
                style={{ transform: "translateZ(0px)" }}></div>
            <div className="absolute inset-0 border-2 border-blue-700/40 rounded-lg"
                style={{ transform: "translateZ(-20px)" }}></div>

            {/* Center Glow */}
            <div className="w-4 h-4 bg-blue-400 rounded-full blur-md"></div>
        </motion.div>
    );
};

// Floating Rings (Layered)
export const FloatingRings = ({ size = "w-48 h-48", delay = 0 }) => {
    return (
        <div className={`${size} relative flex items-center justify-center`}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: delay }}
                className="absolute inset-0"
            >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#0047AB" strokeWidth="2" opacity="0.3" strokeDasharray="5,5" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="#82C8E5" strokeWidth="2" opacity="0.4" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="#000080" strokeWidth="3" opacity="0.5" />
                </svg>
            </motion.div>

            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: delay + 1 }}
                className="absolute inset-0"
            >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#0047AB" strokeWidth="1" opacity="0.2" />
                </svg>
            </motion.div>

            {/* Center Dot */}
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
            ></motion.div>
        </div>
    );
};

// Hexagon Network Grid
export const HexagonGrid = () => {
    return (
        <div className="absolute top-0 right-0 w-full h-full opacity-20 overflow-hidden pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Hexagons */}
                <motion.g
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <path d="M200 100 L240 120 L240 160 L200 180 L160 160 L160 120 Z" stroke="#0047AB" strokeWidth="2" />
                    <path d="M300 150 L340 170 L340 210 L300 230 L260 210 L260 170 Z" stroke="#82C8E5" strokeWidth="2" />
                    <path d="M400 100 L440 120 L440 160 L400 180 L360 160 L360 120 Z" stroke="#000080" strokeWidth="2" />
                    <path d="M500 200 L540 220 L540 260 L500 280 L460 260 L460 220 Z" stroke="#0047AB" strokeWidth="2" />
                </motion.g>

                {/* Connecting Lines */}
                <motion.g
                    animate={{ pathLength: [0, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    stroke="#82C8E5"
                    strokeWidth="1"
                    opacity="0.5"
                >
                    <line x1="220" y1="140" x2="280" y2="190" />
                    <line x1="320" y1="190" x2="380" y2="140" />
                    <line x1="420" y1="140" x2="480" y2="240" />
                </motion.g>
            </svg>
        </div>
    );
};

// Layered Card Stack (Improved)
export const LayeredCardStack = () => {
    return (
        <div className="relative w-48 h-48 mx-auto" style={{ perspective: "1000px" }}>
            <motion.div
                animate={{
                    y: [0, -8, 0],
                    rotateZ: [-2, 0, -2]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg border border-blue-300"
                style={{ transform: "rotateX(10deg) rotateY(-5deg) translateZ(-20px)" }}
            >
                <div className="p-4 text-blue-600 font-bold text-sm">Digital SAT</div>
            </motion.div>

            <motion.div
                animate={{
                    y: [0, -12, 0],
                    rotateZ: [2, 0, 2]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="absolute top-4 left-4 w-full h-40 bg-gradient-to-br from-[#0047AB] to-[#000080] rounded-2xl shadow-xl text-white"
                style={{ transform: "rotateX(10deg) rotateY(-5deg) translateZ(0px)" }}
            >
                <div className="p-4 flex flex-col justify-center h-full">
                    <div className="text-lg font-bold mb-2">Study Abroad</div>
                    <div className="text-xs opacity-80">Global Education</div>
                </div>
            </motion.div>

            <motion.div
                animate={{
                    y: [0, -16, 0],
                    rotateZ: [0, 1, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="absolute top-8 left-8 w-full h-40 bg-gradient-to-br from-[#82C8E5] to-blue-400 rounded-2xl shadow-2xl border-2 border-white/20"
                style={{ transform: "rotateX(10deg) rotateY(-5deg) translateZ(20px)" }}
            >
                <div className="p-4 text-white">
                    <div className="text-2xl font-bold">🎓</div>
                </div>
            </motion.div>
        </div>
    );
};

// Particle Network
export const ParticleNetwork = () => {
    return (
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 600 600">
                <defs>
                    <radialGradient id="particleGlow">
                        <stop offset="0%" stopColor="#0047AB" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#82C8E5" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {[...Array(8)].map((_, i) => (
                    <motion.circle
                        key={i}
                        cx={100 + i * 60}
                        cy={200 + Math.sin(i) * 100}
                        r="4"
                        fill="url(#particleGlow)"
                        animate={{
                            cy: [
                                200 + Math.sin(i) * 100,
                                200 + Math.sin(i + 1) * 120,
                                200 + Math.sin(i) * 100
                            ]
                        }}
                        transition={{
                            duration: 4 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </svg>
        </div>
    );
};

// Realistic Floating Golden Star Field using Canvas
export const CosmicStarField = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Handle resizing
        const setCanvasSize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.offsetWidth;
                canvas.height = parent.offsetHeight;
            }
        };
        setCanvasSize();

        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setCanvasSize, 200);
        };
        window.addEventListener('resize', handleResize);

        const stars = [];
        // Dense enough to fill space but not overwhelming (approx 1 star per 10k sq pixels)
        const calculateStars = () => Math.floor((canvas.width * canvas.height) / 8000);
        let numStars = calculateStars();

        const initStars = () => {
            stars.length = 0; // Clear existing
            numStars = calculateStars();
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    // Very small to slightly larger stars
                    radius: Math.random() * 1.5 + 0.5,
                    // Slow upward and slight horizontal drift
                    vy: -(Math.random() * 0.3 + 0.1),
                    vx: (Math.random() * 0.2 - 0.1),
                    // Twinkle/opacity setup
                    minAlpha: Math.random() * 0.2 + 0.1,
                    maxAlpha: Math.random() * 0.5 + 0.5,
                    alpha: Math.random() * 0.8 + 0.2,
                    alphaChange: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
                });
            }
        };

        initStars();

        // Re-init stars if window resizes heavily to avoid clumping
        const handleReinit = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setCanvasSize();
                initStars();
            }, 300);
        };
        window.addEventListener('resize', handleReinit);

        let animationFrameId;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                // Move star
                star.x += star.vx;
                star.y += star.vy;

                // Twinkle effect (change opacity)
                star.alpha += star.alphaChange;
                if (star.alpha <= star.minAlpha) {
                    star.alpha = star.minAlpha;
                    star.alphaChange *= -1;
                } else if (star.alpha >= star.maxAlpha) {
                    star.alpha = star.maxAlpha;
                    star.alphaChange *= -1;
                }

                // Wrap around edges
                if (star.y < 0) {
                    star.y = canvas.height;
                    star.x = Math.random() * canvas.width;
                }
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;

                // Draw star
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 215, 0, ${star.alpha})`; // Golden #FFD700
                ctx.fill();

                // Optional soft glow for larger stars
                if (star.radius > 1.2) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
                    const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 2.5);
                    // Light gold glow
                    gradient.addColorStop(0, `rgba(255, 215, 0, ${star.alpha * 0.3})`);
                    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('resize', handleReinit);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0 mix-blend-screen"
            style={{ display: 'block', width: '100%', height: '100%' }}
        />
    );
};
