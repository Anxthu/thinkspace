import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutGrid,
    Infinity,
    Sparkles,
    Box,
    Type,
    Image as ImageIcon,
    Settings,
    Command,
    ChevronRight,
    MousePointer2,
    Maximize2,
    Grid3X3,
    ArrowLeft,
    Plus,
    Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box as Box3D } from '@react-three/drei';
import LiquidGrid from '../components/LiquidGrid';
import '../index.css';

function Workspace() {
    const [viewMode, setViewMode] = useState('whiteboard'); // 'whiteboard' | 'grid'
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    // Infinite Canvas State
    const [canvasState, setCanvasState] = useState({ x: 0, y: 0, scale: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const containerRef = useRef(null);

    // Interactive State
    const [items, setItems] = useState([
        { id: 1, type: 'note', content: 'SYSTEM_INIT // BRAINSTORM', x: 100, y: 100, width: 256, height: 160 },
        { id: 2, type: 'note', content: 'VISUAL_DATA // MOODBOARD', x: 400, y: 100, width: 256, height: 256 },
        { id: 3, type: 'note', content: 'LOG_ENTRY_001', x: 100, y: 300, width: 192, height: 192 },
        { id: 4, type: '3d', content: 'CUBE_REF_01', x: 600, y: 200, width: 200, height: 200 },
    ]);
    const [selectedId, setSelectedId] = useState(null);

    // Simulation of AI Co-pilot
    useEffect(() => {
        if (prompt.length > 3) {
            const timer = setTimeout(() => {
                setSuggestions([
                    "GENERATE_LOGIN_FORM",
                    "INSERT_HERO_SECTION",
                    "CREATE_PRICING_TABLE"
                ].filter(s => s.toLowerCase().includes(prompt.toLowerCase()) || prompt.length < 5));
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
        }
    }, [prompt]);

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!prompt) return;
        setIsGenerating(true);

        // Simulate generation
        setTimeout(() => {
            setIsGenerating(false);
            setPrompt('');
            setSuggestions([]);
            // Add a generated item
            addItem('note', `AI_OUTPUT: ${prompt.toUpperCase()}`);
        }, 1500);
    };

    const addItem = (type, content = 'NEW_OBJECT') => {
        const newItem = {
            id: Date.now(),
            type,
            content,
            // Add relative to center of screen accounting for canvas offset
            x: (-canvasState.x + window.innerWidth / 2) / canvasState.scale,
            y: (-canvasState.y + window.innerHeight / 2) / canvasState.scale,
            width: type === 'note' ? 200 : (type === '3d' ? 200 : 150),
            height: type === 'note' ? 150 : (type === '3d' ? 200 : 150),
        };
        setItems([...items, newItem]);
    };

    const updateItemPosition = (id, x, y) => {
        setItems(items.map(item => item.id === id ? { ...item, x, y } : item));
    };

    // --- Infinite Canvas Logic ---

    const handleWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
            // Zoom
            e.preventDefault();
            const zoomSensitivity = 0.001;
            const newScale = Math.min(Math.max(0.1, canvasState.scale - e.deltaY * zoomSensitivity), 5);
            setCanvasState(prev => ({ ...prev, scale: newScale }));
        } else {
            // Pan
            setCanvasState(prev => ({
                ...prev,
                x: prev.x - e.deltaX,
                y: prev.y - e.deltaY
            }));
        }
    };

    const handleMouseDown = (e) => {
        if (e.button === 1 || (e.button === 0 && e.spaceKey)) { // Middle click or Space+Left
            setIsPanning(true);
        }
    };

    const handleMouseMove = (e) => {
        if (isPanning) {
            setCanvasState(prev => ({
                ...prev,
                x: prev.x + e.movementX,
                y: prev.y + e.movementY
            }));
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    return (
        <div className="flex h-screen w-full bg-bg-app text-text-main overflow-hidden font-sans selection:bg-accent selection:text-black relative">
            {/* Liquid Grid Background */}
            <LiquidGrid zoom={canvasState.scale} offset={{ x: canvasState.x, y: canvasState.y }} />

            {/* Global Noise Overlay */}
            <div className="noise-bg" style={{ zIndex: 0, pointerEvents: 'none' }} />

            {/* Navigation Sidebar */}
            <nav className="w-16 flex flex-col items-center py-6 gap-6 z-50 border-r border-white/10 bg-bg-panel relative">
                <Link to="/" className="text-white mb-4 hover:scale-110 transition-transform">
                    <Box size={28} />
                </Link>

                <NavIcon icon={<MousePointer2 size={20} />} active={true} onClick={() => setSelectedId(null)} />
                <NavIcon icon={<LayoutGrid size={20} />} onClick={() => addItem('box', 'CONTAINER')} />
                <NavIcon icon={<Type size={20} />} onClick={() => addItem('note', 'TEXT_NODE')} />
                <NavIcon icon={<Box3DIcon size={20} />} onClick={() => addItem('3d', '3D_OBJECT')} />
                <NavIcon icon={<ImageIcon size={20} />} onClick={() => addItem('image', 'IMG_PLACEHOLDER')} />

                <div className="mt-auto">
                    <NavIcon icon={<Settings size={20} />} />
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden z-10">

                {/* Top Bar */}
                <header className="h-14 flex items-center justify-between px-6 z-50 border-b border-white/10 bg-bg-panel/80 backdrop-blur-md relative">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-text-muted hover:text-white transition-colors">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-sm font-bold tracking-wide font-mono uppercase">Untitled_Project_01</h1>
                        <span className="text-black text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent font-mono">DRAFT</span>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-md p-1">
                        <button
                            onClick={() => setCanvasState(prev => ({ ...prev, scale: Math.max(0.1, prev.scale - 0.1) }))}
                            className="p-1 hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="text-[10px] font-mono text-text-muted w-12 text-center">
                            {Math.round(canvasState.scale * 100)}%
                        </span>
                        <button
                            onClick={() => setCanvasState(prev => ({ ...prev, scale: Math.min(5, prev.scale + 0.1) }))}
                            className="p-1 hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-black"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-black"></div>
                        </div>
                        <button className="bg-white text-black px-4 py-1.5 text-xs font-bold hover:bg-gray-200 transition-colors uppercase tracking-wider">
                            Share
                        </button>
                    </div>
                </header>

                {/* Canvas Area */}
                <div
                    ref={containerRef}
                    className={`relative flex-1 overflow-hidden z-20 ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={() => setSelectedId(null)}
                >
                    {/* Infinite Canvas Container */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full origin-top-left"
                        style={{
                            x: canvasState.x,
                            y: canvasState.y,
                            scale: canvasState.scale
                        }}
                    >
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                drag
                                dragMomentum={false} // Disable momentum for precise placement on infinite canvas
                                onDragEnd={(e, info) => {
                                    // Adjust drag delta by scale
                                    updateItemPosition(item.id, item.x + info.offset.x / canvasState.scale, item.y + info.offset.y / canvasState.scale);
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedId(item.id);
                                }}
                                className={`absolute flex flex-col p-0 rounded-none backdrop-blur-md border transition-all z-30 ${selectedId === item.id
                                    ? 'border-accent shadow-[0_0_15px_rgba(255,255,255,0.1)] bg-black'
                                    : 'border-white/20 bg-black/80 hover:border-white/40'
                                    }`}
                                style={{
                                    width: item.width,
                                    height: item.height,
                                    left: item.x,
                                    top: item.y,
                                }}
                            >
                                {/* Item Header */}
                                <div className={`h-6 flex items-center px-2 border-b ${selectedId === item.id ? 'border-accent bg-accent text-black' : 'border-white/10 bg-white/5'}`}>
                                    <span className="text-[10px] font-mono uppercase tracking-wider truncate flex-1">{item.type.toUpperCase()}_ID_{item.id}</span>
                                    {selectedId === item.id && <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />}
                                </div>

                                {/* Item Content */}
                                <div className="flex-1 relative overflow-hidden">
                                    {item.type === '3d' ? (
                                        <Canvas>
                                            <ambientLight intensity={0.5} />
                                            <pointLight position={[10, 10, 10]} />
                                            <Box3D args={[2, 2, 2]}>
                                                <meshStandardMaterial color={selectedId === item.id ? "white" : "#333"} wireframe />
                                            </Box3D>
                                            <OrbitControls enableZoom={false} />
                                        </Canvas>
                                    ) : (
                                        <div className="p-3 flex items-center justify-center h-full">
                                            <span className="text-xs font-mono text-text-muted pointer-events-none select-none text-center leading-relaxed">
                                                {item.content}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Selection Handles */}
                                {selectedId === item.id && (
                                    <>
                                        <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-accent" />
                                        <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent" />
                                        <div className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-accent" />
                                        <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-accent" />
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Co-pilot Floating Bar */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[600px] z-40" onClick={e => e.stopPropagation()}>
                        {suggestions.length > 0 && (
                            <div className="flex gap-2 mb-3 justify-center">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        className="px-3 py-1.5 bg-black border border-accent/50 text-accent text-[10px] font-mono hover:bg-accent hover:text-black transition-colors uppercase"
                                        onClick={() => setPrompt(s)}
                                    >
                                        <Sparkles size={10} className="inline mr-1" /> {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="bg-black/90 border border-white/20 p-1.5 flex items-center gap-3 shadow-2xl backdrop-blur-xl">
                            <div className="p-2 bg-white/10 text-white">
                                <Command size={16} />
                            </div>
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="COMMAND_LINE_INTERFACE..."
                                className="bg-transparent border-none outline-none text-sm font-mono text-white flex-1 placeholder-gray-600 h-10 uppercase"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={!prompt || isGenerating}
                                className="bg-white text-black p-2 hover:bg-gray-200 disabled:opacity-50 transition-all"
                            >
                                {isGenerating ? <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div> : <ChevronRight size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Minimap */}
                    <Minimap items={items} canvasState={canvasState} />
                </div>
            </main>

            {/* Properties Panel */}
            <aside className="w-72 p-6 z-50 border-l border-white/10 bg-bg-panel relative">
                <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-mono">Properties</span>
                    <Maximize2 size={14} className="text-text-muted" />
                </div>

                {selectedId ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="p-4 bg-white/5 border border-white/10">
                            <h3 className="text-xs font-bold text-white mb-1 font-mono uppercase">OBJ_REF_#{selectedId}</h3>
                            <p className="text-[10px] text-text-muted font-mono">SELECTED_ENTITY</p>
                        </div>
                        <PropertyGroup label="COORDINATES">
                            <div className="grid grid-cols-2 gap-2">
                                <PropertyInput label="X" value={Math.round(items.find(i => i.id === selectedId)?.x || 0)} />
                                <PropertyInput label="Y" value={Math.round(items.find(i => i.id === selectedId)?.y || 0)} />
                                <PropertyInput label="W" value={items.find(i => i.id === selectedId)?.width} />
                                <PropertyInput label="H" value={items.find(i => i.id === selectedId)?.height} />
                            </div>
                        </PropertyGroup>
                        <button
                            onClick={() => {
                                setItems(items.filter(i => i.id !== selectedId));
                                setSelectedId(null);
                            }}
                            className="w-full py-2 bg-red-500/10 text-red-500 text-[10px] font-bold hover:bg-red-500 hover:text-white transition-colors border border-red-500/50 uppercase tracking-wider font-mono"
                        >
                            DELETE_ENTITY
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-text-muted text-center opacity-50">
                        <MousePointer2 size={32} className="mb-4" />
                        <p className="text-xs font-mono uppercase">No Selection</p>
                    </div>
                )}
            </aside>
        </div>
    );
}

// --- Subcomponents ---

const Minimap = ({ items, canvasState }) => {
    // Simple minimap implementation
    const scale = 0.1;
    return (
        <div className="absolute bottom-6 right-6 w-48 h-32 bg-black border border-white/10 z-50 overflow-hidden opacity-80 pointer-events-none">
            <div className="relative w-full h-full">
                {items.map(item => (
                    <div
                        key={item.id}
                        className="absolute bg-white/50"
                        style={{
                            left: (item.x * scale) + 24 + (canvasState.x * scale * 0.1), // Simplified projection
                            top: (item.y * scale) + 16 + (canvasState.y * scale * 0.1),
                            width: item.width * scale,
                            height: item.height * scale
                        }}
                    />
                ))}
                {/* Viewport Indicator */}
                <div
                    className="absolute border border-accent/50"
                    style={{
                        left: 24 - (canvasState.x * scale * 0.1), // Inverse logic for viewport
                        top: 16 - (canvasState.y * scale * 0.1),
                        width: window.innerWidth * scale / canvasState.scale,
                        height: window.innerHeight * scale / canvasState.scale
                    }}
                />
            </div>
            <div className="absolute bottom-1 right-2 text-[8px] font-mono text-text-muted">MINIMAP_SYS</div>
        </div>
    );
};

const Box3DIcon = ({ size, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);

// ... (Keep other subcomponents: NavIcon, ModeToggle, PropertyGroup, PropertyInput)
const NavIcon = ({ icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-3 transition-all rounded-none ${active ? 'bg-white text-black' : 'text-text-muted hover:text-white hover:bg-white/10'}`}
    >
        {icon}
    </button>
);

const ModeToggle = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold transition-all uppercase tracking-wider ${active ? 'bg-white text-black' : 'text-text-muted hover:text-white'}`}
    >
        {icon}
        {label}
    </button>
);

const PropertyGroup = ({ label, children }) => (
    <div className="space-y-3">
        <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider font-mono">{label}</label>
        {children}
    </div>
);

const PropertyInput = ({ label, value }) => (
    <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-muted font-mono">{label}</span>
        <input
            type="text"
            value={value}
            readOnly
            className="w-full bg-black border border-white/10 pl-6 pr-2 py-1.5 text-xs text-white focus:border-white outline-none font-mono"
        />
    </div>
);

export default Workspace;
