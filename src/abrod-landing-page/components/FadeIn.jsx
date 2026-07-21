import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

    const directionOffset = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
    };

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                ...directionOffset[direction]
            }}
            animate={isInView ? {
                opacity: 1,
                x: 0,
                y: 0
            } : {
                opacity: 0,
                ...directionOffset[direction]
            }}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.22, 1, 0.36, 1] // Custom cubic bezier for smooth "apple-like" motion
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
