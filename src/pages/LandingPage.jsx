import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Stars } from '@react-three/drei';
import { Box, ArrowRight, Zap, Layers, Infinity, Command } from 'lucide-react';
import '../index.css';

// --- 3D Components ---

const FluidObject = () => {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.1;
            meshRef.current.rotation.y = t * 0.15;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh ref={meshRef} scale={2.5}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    color="#ffffff"
                    emissive="#111"
                    roughness={0.1}
                    metalness={0.9}
                    distort={0.4}
                    speed={2}
                />
            </mesh>
        </Float>
    );
};

const Scene = () => {
    return (
        <Canvas className="absolute inset-0 z-0" camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <FluidObject />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="city" />
        </Canvas>
    );
};

// --- Landing Page Component ---

const LandingPage = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    const yFeatures = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);
    const opacityFeatures = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

    const handleInitialize = (e) => {
        e.preventDefault();
        navigate('/loading');
    };

    return (
        <div ref={containerRef} className="relative bg-bg-app text-text-main font-sans selection:bg-accent selection:text-black overflow-x-hidden">
            {/* Global Noise Overlay */}
            <div className="noise-bg" />

            {/* 3D Background Layer */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen">
                <Scene />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto mix-blend-difference">
                <div className="flex items-center gap-2">
                    <Box className="text-white" size={24} />
                    <span className="font-bold text-lg tracking-tighter font-mono">THINKSPACE_v2</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/workspace">
                        <button className="text-sm font-medium hover:text-accent transition-colors font-mono">
                            [LOG_IN]
                        </button>
                    </Link>
                    <button
                        onClick={handleInitialize}
                        className="bg-white text-black px-5 py-2 rounded-none text-sm font-bold hover:bg-gray-200 transition-colors uppercase tracking-wide"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10">
                <motion.div
                    style={{ y: yHero, opacity: opacityHero }}
                    className="text-center max-w-5xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-black/50 backdrop-blur-md text-xs text-text-muted mb-8 mx-auto font-mono">
                        <span className="w-1.5 h-1.5 bg-accent-secondary animate-pulse"></span>
                        <span>SYSTEM_ONLINE</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.85] mix-blend-overlay">
                        FLUID <br />
                        INTELLIGENCE
                    </h1>

                    <p className="text-xl text-text-muted max-w-xl mx-auto mb-12 leading-relaxed tracking-tight font-light">
                        The workspace that adapts to your mind. <br />
                        <span className="text-white">Infinite canvas</span> for chaos. <span className="text-white">Structured grid</span> for order.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleInitialize}
                            className="group px-8 py-4 bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2 rounded-none uppercase tracking-wider"
                        >
                            Initialize
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex items-center gap-2 text-sm text-text-muted px-4 font-mono">
                            <Command size={14} /> + K
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 text-text-muted text-xs font-mono uppercase tracking-widest opacity-50"
                >
                    Scroll to Explore
                </motion.div>
            </section>

            {/* Scrollytelling Features Section */}
            <section className="relative py-32 px-6 max-w-7xl mx-auto z-10 min-h-[150vh]">
                <motion.div style={{ y: yFeatures, opacity: opacityFeatures }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[600px]">

                        {/* Large Feature */}
                        <div className="md:col-span-2 md:row-span-2 bg-bg-panel/50 backdrop-blur-md border border-white/10 p-10 flex flex-col justify-between group hover:border-white/30 transition-colors relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-6 bg-black">
                                    <Infinity size={24} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight mb-4 font-mono uppercase">Liquid Interface</h3>
                                <p className="text-text-muted max-w-md text-lg">
                                    Stop fighting your tools. Thinkspace automatically switches between a freeform whiteboard and a structured grid based on your intent.
                                </p>
                            </div>

                            {/* Visual Abstraction */}
                            <div className="mt-10 h-64 w-full bg-black border border-white/10 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 grid grid-cols-12 gap-px bg-white/5 opacity-20">
                                    {[...Array(144)].map((_, i) => <div key={i} className="bg-black" />)}
                                </div>
                                <div className="w-full h-full absolute bg-gradient-to-t from-black via-transparent to-transparent" />
                            </div>
                        </div>

                        {/* Side Feature 1 */}
                        <div className="bg-bg-panel/50 backdrop-blur-md border border-white/10 p-8 flex flex-col justify-between hover:border-white/30 transition-colors">
                            <div>
                                <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-4 bg-black">
                                    <Zap size={20} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight mb-2 font-mono uppercase">AI Co-pilot</h3>
                                <p className="text-sm text-text-muted">Real-time design suggestions that understand your context.</p>
                            </div>
                        </div>

                        {/* Side Feature 2 */}
                        <div className="bg-bg-panel/50 backdrop-blur-md border border-white/10 p-8 flex flex-col justify-between hover:border-white/30 transition-colors">
                            <div>
                                <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-4 bg-black">
                                    <Layers size={20} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight mb-2 font-mono uppercase">Smart Assets</h3>
                                <p className="text-sm text-text-muted">A unified library that grows with your project.</p>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-12 text-center text-text-muted text-xs font-mono border-t border-white/10 bg-black z-10 relative">
                <p>THINKSPACE_SYSTEMS &copy; 2025 // ALL RIGHTS RESERVED</p>
            </footer>
        </div>
    );
};

export default LandingPage;
