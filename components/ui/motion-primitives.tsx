"use client"

import React from 'react';
import { motion, HTMLMotionProps, useScroll, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

// --- FadeIn ---
interface FadeInProps extends HTMLMotionProps<"div"> {
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
    fullWidth?: boolean;
}

export const FadeIn = ({
    children,
    delay = 0,
    direction = 'up',
    duration = 0.5,
    fullWidth = false,
    className,
    ...props
}: FadeInProps) => {
    const directions = {
        up: { y: 20 },
        down: { y: -20 },
        left: { x: 20 },
        right: { x: -20 },
        none: {}
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
            style={{ width: fullWidth ? '100%' : 'auto' }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// --- ScaleTap (Button Wrapper) ---
export const ScaleTap = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02 }}
        className={className}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
        {children}
    </motion.div>
);

// --- Magnetic (Premium Hover) ---
// Note: Requires more complex mouse tracking, implementing simple version for now
export const Magnetic = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
            {children}
        </motion.div>
    );
};

// --- ScrollProgress (Page Reading Indicator) ---
export const ScrollProgress = ({ className }: { className?: string }) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className={className}
            style={{ scaleX, transformOrigin: "0%" }}
        />
    );
};

// --- Parallax (Scroll Effect) ---
export const Parallax = ({ children, offset = 50, className }: { children: React.ReactNode, offset?: number, className?: string }) => {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

    return (
        <div ref={ref} className={cn("relative overflow-hidden", className)}>
            <motion.div style={{ y }}>
                {children}
            </motion.div>
        </div>
    );
};
