import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../index.css';

const LoadingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/workspace');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center font-mono text-accent z-[9999]">
            <div className="noise-bg" />

            <div className="w-64 space-y-4 relative z-10">
                {/* Progress Bar */}
                <div className="h-1 bg-white/10 w-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.2, ease: "easeInOut" }}
                        className="h-full bg-accent"
                    />
                </div>

                {/* Status Text */}
                <div className="flex justify-between text-[10px] uppercase tracking-widest">
                    <span>System_Boot</span>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                        [PROCESSING]
                    </motion.span>
                </div>

                {/* Console Log */}
                <div className="space-y-1 text-[10px] text-text-muted opacity-70 font-mono">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>&gt; INIT_KERNEL...</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>&gt; MOUNTING_VOLUMES...</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>&gt; CONNECTING_NEURAL_NET...</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>&gt; ESTABLISHING_UPLINK...</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-accent">&gt; ACCESS_GRANTED</motion.div>
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;
