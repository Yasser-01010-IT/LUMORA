import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LightTunnel from './LightTunnel';

const features = [
    {
        icon: '✂️',
        title: 'Background Removal',
        desc: 'AI-powered background removal running 100% locally. No uploads, no API keys — pure privacy.',
        badge: 'Local AI',
        color: '#A855F7',
    },
    {
        icon: '🎨',
        title: 'SVG Vectorization',
        desc: 'Convert raster images to clean, scalable SVG vectors with advanced tracing algorithms.',
        badge: 'Open Source',
        color: '#6366F1',
    },
    {
        icon: '🔍',
        title: 'OCR Scanner',
        desc: 'Extract text from any image with Tesseract.js. Supports French, English, and more — fully offline.',
        badge: 'No API Key',
        color: '#8B5CF6',
    },
    {
        icon: '📄',
        title: 'Image to PDF',
        desc: 'Convert images to professional PDF documents with custom orientation, format, and margins.',
        badge: 'Free',
        color: '#7C3AED',
    },
    {
        icon: '🤖',
        title: 'Hugging Face AI',
        desc: 'Run 5 free Hugging Face models — image captioning, classification, detection, segmentation, depth.',
        badge: 'HF Free Tier',
        color: '#A855F7',
    },
    {
        icon: '🔒',
        title: 'Privacy First',
        desc: 'All processing is local or uses free public APIs. Your images never leave your machine.',
        badge: '100% Private',
        color: '#6366F1',
    },
];

const steps = [
    { num: '01', title: 'Upload Your Image', desc: 'Drag & drop or click to select any PNG, JPG or WebP image.' },
    { num: '02', title: 'Choose Your Tool', desc: 'Pick from 5 powerful AI tools — all free, all instant.' },
    { num: '03', title: 'Download Results', desc: 'Get your processed image, SVG, PDF, or extracted text in one click.' },
];

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#08080F',
            color: '#fff',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            overflowX: 'hidden',
        }}>
            
            {/* ───── NAVBAR ───── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 2.5rem',
                height: '68px',
                background: scrolled ? 'rgba(8,8,15,0.85)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(168,85,247,0.15)' : '1px solid transparent',
                transition: 'all 0.4s ease',
            }}>
                {/* Logo */}
               <div
    style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        cursor: 'pointer',
    }}
>
    {/* LUMORA Logo */}
    <div
        style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}
    >
        <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient
                    id="lumoraGradient"
                    x1="4"
                    y1="4"
                    x2="32"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#C084FC" />
                    <stop offset="0.5" stopColor="#A855F7" />
                    <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
            </defs>

            {/* Main geometric mark */}
            <path
                d="M18 3.5
                   C9.99 3.5 3.5 9.99 3.5 18
                   C3.5 26.01 9.99 32.5 18 32.5
                   C26.01 32.5 32.5 26.01 32.5 18
                   C32.5 9.99 26.01 3.5 18 3.5Z"
                fill="url(#lumoraGradient)"
            />

            {/* L / light beam */}
            <path
                d="M12 10.5V22.5C12 24.43 13.57 26 15.5 26H24"
                stroke="white"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* AI sparkle */}
            <path
                d="M24.5 10L25.15 11.85L27 12.5L25.15 13.15L24.5 15L23.85 13.15L22 12.5L23.85 11.85L24.5 10Z"
                fill="white"
            />
        </svg>
    </div>

    {/* Wordmark */}
    <span
        style={{
            fontFamily:
                'Inter, "Helvetica Neue", Arial, sans-serif',
            fontSize: '1.18rem',
            fontWeight: 700,
            letterSpacing: '-0.045em',
            color: '#FFFFFF',
        }}
    >
        Lumora
    </span>
</div>

                {/* Nav Links */}
                <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {[
                        { name: 'Features', id: 'features' },
                        { name: 'How it Works', id: 'how-it-works' },
                        { name: 'Pricing', id: 'pricing' }
                    ].map((item) => (
                        <a key={item.name}
                           href={`#${item.id}`}
                           onClick={(e) => {
                               e.preventDefault();
                               document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                           }}
                           style={{
                            color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 500,
                            textDecoration: 'none', transition: 'color 0.2s',
                            cursor: 'pointer', whiteSpace: 'nowrap'
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                        >{item.name}</a>
                    ))}
                </div>

                {/* Actions container */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                        onClick={() => navigate('/app')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            padding: '0.55rem 1.1rem',
                            minHeight: '36px',
                            borderRadius: '999px',
                            border: '1px solid rgba(255,255,255,0.75)',
                            background: '#FFFFFF',
                            color: '#171717',
                            fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
                            fontSize: '0.8rem',
                            fontWeight: 650,
                            letterSpacing: '-0.01em',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                            transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.background = '#F7F5FF';
                            e.currentTarget.style.boxShadow = '0 5px 16px rgba(168,85,247,0.18)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.background = '#FFFFFF';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
                        }}
                    >
                        Launch App
                        <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>→</span>
                    </button>

                    {/* Mobile Hamburger Toggle Button */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Mobile Menu"
                        style={{
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.18)',
                            background: 'rgba(255,255,255,0.06)',
                            color: '#FFFFFF',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                        }}
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Menu Drawer */}
            {mobileMenuOpen && (
                <div
                    className="mobile-dropdown-menu"
                    style={{
                        position: 'fixed',
                        top: '60px',
                        left: 0,
                        right: 0,
                        zIndex: 99,
                        background: 'rgba(8, 8, 15, 0.96)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        borderBottom: '1px solid rgba(168, 85, 247, 0.25)',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                        animation: 'fadeIn 0.2s ease',
                    }}
                >
                    {[
                        { name: 'Features', id: 'features' },
                        { name: 'How it Works', id: 'how-it-works' },
                        { name: 'Pricing', id: 'pricing' }
                    ].map((item) => (
                        <a
                            key={item.name}
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setMobileMenuOpen(false);
                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{
                                color: '#FFFFFF',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                padding: '0.6rem 0',
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            {item.name}
                            <span style={{ color: '#C084FC', fontSize: '0.9rem' }}>→</span>
                        </a>
                    ))}
                </div>
            )}

            {/* ───── HERO ───── */}
            <section style={{ position: 'relative', height: '100vh', minHeight: 680, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

                {/* LightTunnel background */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <LightTunnel
                        cableColor="#A855F7"
                        pulseColor="#C084FC"
                        tunnelColor="#5227FF"
                        tunnelOpacity={0}
                        speed={0.08}
                        flowDirection="outward"
                        pulseSpeed={1.8}
                        pulseLength={0.28}
                        pulseBlend={1}
                        pulseWidth={1}
                        cableCount={22}
                        thickness={0.32}
                        rimWidth={0.15}
                        waviness={0.25}
                        sway={0.4}
                        size={1.1}
                        centerX={0}
                        centerY={0}
                        glow={1.2}
                        fadeNear={0.35}
                        fadeFar={2.2}
                        brightness={1.1}
                        colorVariance
                        grain
                        grainIntensity={0.04}
                        opacity={1}
                        mouseInteraction
                        mouseStrength={0.08}
                    />
                </div>

                {/* Radial overlay for readability */}
                <div style={{
                   
                    position: 'absolute', inset: 0, zIndex: 1,
                    background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, rgba(8,8,15,0.75) 80%, rgba(8,8,15,0.97) 100%)',
                }} />

                {/* Hero content */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 1.5rem', maxWidth: 760, marginTop:"45px" }}>
                    {/* Badge */}
                   

                    <h1
    style={{
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',

        width: '100vw',
        maxWidth: '1800px',

        margin: '0 0 1.5rem',
        marginTop:"40px",
        fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
        fontSize: 'clamp(4rem, 8.5vw, 9rem)',
        fontWeight: 500,
        lineHeight: 0.9,
        letterSpacing: '-0.075em',

        textAlign: 'center',
        color: '#FFFFFF',

        whiteSpace: 'nowrap',
    }}
>
    Transform Images
    <br />
    <span
        style={{
            background:
                'linear-gradient(100deg, #FFFFFF 20%, #E9D5FF 48%, #C084FC 72%, #818CF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        }}
    >
        with AI — Instantly
    </span>
</h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.7,
                        maxWidth: 540,
                        margin: '0 auto 2.5rem',
                    }}>
                        Remove backgrounds, vectorize, extract text, convert to PDF, and run 5 free Hugging Face models — all in your browser, no API key needed.
                    </p>

                  <div
    style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.85rem',
        flexWrap: 'wrap',
    }}
>
    {/* PRIMARY BUTTON */}
    <button
        onClick={() => navigate('/app')}
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.55rem',

            padding: '0.95rem 1.8rem',
            minHeight: '52px',

            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.9)',

            background: '#FFFFFF',
            color: '#111111',

            fontFamily:
                'Inter, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 650,
            letterSpacing: '-0.01em',

            cursor: 'pointer',

            boxShadow:
                '0 2px 5px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.16)',

            transition:
                'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform =
                'translateY(-2px)';
            e.currentTarget.style.background = '#F7F5FF';
            e.currentTarget.style.boxShadow =
                '0 4px 10px rgba(0,0,0,0.12), 0 14px 38px rgba(168,85,247,0.18)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform =
                'translateY(0)';
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.boxShadow =
                '0 2px 5px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.16)';
        }}
    >
        Start for Free
        <span
            style={{
                fontSize: '1.05rem',
                lineHeight: 1,
            }}
        >
            →
        </span>
    </button>

    {/* SECONDARY BUTTON */}
    <button
        onClick={() =>
            document
                .getElementById('features')
                ?.scrollIntoView({
                    behavior: 'smooth',
                })
        }
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.55rem',

            padding: '0.95rem 1.8rem',
            minHeight: '52px',

            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.18)',

            background: 'rgba(255,255,255,0.045)',
            color: 'rgba(255,255,255,0.88)',

            fontFamily:
                'Inter, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',

            cursor: 'pointer',

            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',

            boxShadow:
                '0 4px 20px rgba(0,0,0,0.08)',

            transition:
                'transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform =
                'translateY(-2px)';
            e.currentTarget.style.background =
                'rgba(255,255,255,0.09)';
            e.currentTarget.style.borderColor =
                'rgba(255,255,255,0.32)';
            e.currentTarget.style.boxShadow =
                '0 8px 28px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform =
                'translateY(0)';
            e.currentTarget.style.background =
                'rgba(255,255,255,0.045)';
            e.currentTarget.style.borderColor =
                'rgba(255,255,255,0.18)';
            e.currentTarget.style.boxShadow =
                '0 4px 20px rgba(0,0,0,0.08)';
        }}
    >
        See Features
        <span
            style={{
                fontSize: '1rem',
                opacity: 0.65,
            }}
        >
            ↓
        </span>
    </button>
</div>

                    {/* Floating trust badges */}
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                        {['No signup required', 'Runs in your browser', '100% Open Source'].map(t => (
                            <span key={t} style={{
                                fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '0.35rem',
                            }}>
                                <span style={{ color: '#A855F7' }}>✓</span> {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div
                    className="hero-scroll-indicator"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    title="Scroll down to features"
                    style={{
                        position: 'absolute', bottom: '2.2rem', left: '50%', transform: 'translateX(-50%)',
                        zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem',
                        cursor: 'pointer', opacity: 0.85, transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateX(-50%) translateY(3px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.85';
                        e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';
                    }}
                >
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>Scroll</span>
                    <div style={{
                        width: 24, height: 38, border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 12,
                        display: 'flex', paddingTop: 6, justifyContent: 'center',
                        background: 'rgba(255,255,255,0.03)',
                        boxShadow: '0 0 12px rgba(168,85,247,0.15)',
                    }}>
                        <div style={{
                            width: 4, height: 8, borderRadius: 4,
                            background: '#A855F7',
                            animation: 'scrollDot 1.6s ease-in-out infinite',
                            boxShadow: '0 0 8px #A855F7',
                        }} />
                    </div>
                </div>
            </section>

            {/* ───── STATS ───── */}
{/* =========================================================
    PREMIUM CTA / PRODUCT HIGHLIGHTS SECTION
========================================================= */}

<section
    style={{
        position: 'relative',
        width: '100%',
        padding:
            'clamp(7rem, 12vw, 11rem) clamp(1.25rem, 5vw, 5rem)',
        overflow: 'hidden',
        background: '#08080D',
        boxSizing: 'border-box',
    }}
>
    {/* Subtle ambient glow */}
    <div
        style={{
            position: 'absolute',
            top: '-300px',
            left: '50%',
            transform: 'translateX(-50%)',

            width: '700px',
            height: '700px',

            background:
                'radial-gradient(circle, rgba(168,85,247,0.09) 0%, rgba(99,102,241,0.035) 40%, transparent 72%)',

            filter: 'blur(30px)',
            pointerEvents: 'none',
        }}
    />

    {/* Bottom ambient glow */}
    <div
        style={{
            position: 'absolute',
            bottom: '-300px',
            right: '-200px',

            width: '600px',
            height: '600px',

            background:
                'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',

            filter: 'blur(50px)',
            pointerEvents: 'none',
        }}
    />

    {/* Main container */}
    <div
        style={{
            width: '100%',
            maxWidth: '1280px',

            margin: '0 auto',

            position: 'relative',
            zIndex: 2,

            textAlign: 'center',
        }}
    >


        {/* =====================================================
            MAIN HEADLINE
        ===================================================== */}

        <h2
            style={{
                margin: 0,

                width: '100%',
                maxWidth: '1200px',

                marginLeft: 'auto',
                marginRight: 'auto',

                fontFamily:
                    'Inter, "Helvetica Neue", Arial, sans-serif',

                fontSize:
                    'clamp(3.8rem, 9vw, 8.8rem)',

                fontWeight: 500,

                lineHeight: 0.94,

                letterSpacing: '-0.065em',

                color: '#FFFFFF',

                textWrap: 'balance',
            }}
        >
            Let's build
            <br />

            <span
                style={{
                    background:
                        'linear-gradient(135deg, #FFFFFF 20%, #E9D5FF 55%, #A855F7 100%)',

                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
            >
                something great.
            </span>
        </h2>


        {/* =====================================================
            DESCRIPTION
        ===================================================== */}

        <p
            style={{
                maxWidth: '680px',

                margin:
                    'clamp(2rem, 4vw, 2.75rem) auto 0',

                fontFamily:
                    'Inter, "Helvetica Neue", Arial, sans-serif',

                fontSize:
                    'clamp(1rem, 1.8vw, 1.2rem)',

                lineHeight: 1.7,

                fontWeight: 400,

                color:
                    'rgba(255,255,255,0.55)',

                letterSpacing: '-0.015em',
            }}
        >
            A powerful image toolkit designed to make professional
            image processing simple, fast, and completely private.
        </p>


        {/* =====================================================
            CTA
        ===================================================== */}

        <div
            style={{
                display: 'flex',

                justifyContent: 'center',
                alignItems: 'center',

                marginTop:
                    'clamp(2rem, 4vw, 3rem)',
            }}
        >
            <button
                onClick={() => navigate('/app')}

                style={{
                    display: 'inline-flex',

                    alignItems: 'center',
                    justifyContent: 'center',

                    gap: '0.65rem',

                    minHeight: '58px',

                    padding:
                        '0.95rem 1.7rem 0.95rem 1.9rem',

                    borderRadius: '999px',

                    border:
                        '1px solid rgba(255,255,255,0.85)',

                    background: '#FFFFFF',

                    color: '#09090B',

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize: '1rem',

                    fontWeight: 650,

                    letterSpacing: '-0.015em',

                    cursor: 'pointer',

                    boxShadow:
                        '0 2px 4px rgba(0,0,0,0.12), 0 12px 35px rgba(0,0,0,0.25)',

                    transition:
                        'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
                }}

                onMouseEnter={(e) => {

                    e.currentTarget.style.transform =
                        'translateY(-2px)';

                    e.currentTarget.style.background =
                        '#F5F3FF';

                    e.currentTarget.style.boxShadow =
                        '0 6px 12px rgba(0,0,0,0.15), 0 18px 45px rgba(168,85,247,0.22)';
                }}

                onMouseLeave={(e) => {

                    e.currentTarget.style.transform =
                        'translateY(0)';

                    e.currentTarget.style.background =
                        '#FFFFFF';

                    e.currentTarget.style.boxShadow =
                        '0 2px 4px rgba(0,0,0,0.12), 0 12px 35px rgba(0,0,0,0.25)';
                }}
            >
                Get Started

                <span
                    style={{
                        display: 'inline-flex',

                        alignItems: 'center',
                        justifyContent: 'center',

                        width: '26px',
                        height: '26px',

                        borderRadius: '50%',

                        background: '#111114',

                        color: '#FFFFFF',

                        fontSize: '0.9rem',

                        lineHeight: 1,
                    }}
                >
                    →
                </span>
            </button>
        </div>


        {/* =====================================================
            PRODUCT STATS
        ===================================================== */}

        <div
            style={{
                width: '100%',
                maxWidth: '1120px',

                margin:
                    'clamp(5rem, 9vw, 7rem) auto 0',

                paddingTop:
                    'clamp(2.5rem, 5vw, 3.5rem)',

                borderTop:
                    '1px solid rgba(255,255,255,0.09)',

                display: 'grid',

                gridTemplateColumns:
                    'repeat(4, minmax(0, 1fr))',

                alignItems: 'stretch',
            }}
        >
            {[
                {
                    value: '6',
                    label: 'Image tools',
                },
                {
                    value: '5',
                    label: 'AI models',
                },
                {
                    value: '100%',
                    label: 'Private processing',
                },
                {
                    value: '0 $',
                    label: 'Forever free',
                },
            ].map((stat, i) => (

                <div
                    key={i}
                    style={{
                        position: 'relative',

                        padding:
                            '0 clamp(1rem, 3vw, 2.5rem)',

                        display: 'flex',

                        flexDirection: 'column',

                        alignItems: 'center',

                        justifyContent: 'center',

                        textAlign: 'center',

                        boxSizing: 'border-box',
                    }}
                >

                    {/* Vertical separator */}
                    {i !== 0 && (
                        <div
                            style={{
                                position: 'absolute',

                                left: 0,

                                top: '8%',

                                width: '1px',

                                height: '84%',

                                background:
                                    'rgba(255,255,255,0.08)',
                            }}
                        />
                    )}

                    {/* Number */}
                    <div
                        style={{
                            fontFamily:
                                'Inter, "Helvetica Neue", Arial, sans-serif',

                            fontSize:
                                'clamp(2.8rem, 5vw, 5rem)',

                            fontWeight: 500,

                            lineHeight: 0.95,

                            letterSpacing: '-0.06em',

                            color: '#FFFFFF',

                            whiteSpace: 'nowrap',
                        }}
                    >
                        {stat.value}
                    </div>

                    {/* Label */}
                    <div
                        style={{
                            marginTop: '0.8rem',

                            fontFamily:
                                'Inter, "Helvetica Neue", Arial, sans-serif',

                            fontSize:
                                'clamp(0.65rem, 0.9vw, 0.78rem)',

                            fontWeight: 500,

                            lineHeight: 1.3,

                            color:
                                'rgba(255,255,255,0.42)',

                            letterSpacing: '0.025em',

                            textTransform: 'uppercase',

                            whiteSpace: 'nowrap',
                        }}
                    >
                        {stat.label}
                    </div>

                </div>
            ))}
        </div>


        {/* =====================================================
            SMALL TRUST LINE
        ===================================================== */}

        <div
            style={{
                display: 'flex',

                justifyContent: 'center',
                alignItems: 'center',

                flexWrap: 'wrap',

                gap:
                    '0.6rem 1.75rem',

                marginTop:
                    'clamp(2.5rem, 5vw, 4rem)',

                fontFamily:
                    'Inter, "Helvetica Neue", Arial, sans-serif',

                fontSize: '0.75rem',

                fontWeight: 500,

                color:
                    'rgba(255,255,255,0.35)',
            }}
        >
            {[
                'No signup',
                'Runs locally',
                'Open source',
            ].map((item) => (
                <span
                    key={item}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                    }}
                >
                    <span
                        style={{
                            color: '#A855F7',
                            fontSize: '0.7rem',
                        }}
                    >
                        ✓
                    </span>

                    {item}
                </span>
            ))}
        </div>

    </div>
</section>

            {/* ───── FEATURES ───── */}
           {/* =========================================================
    TOOLS SECTION
========================================================= */}

<section
    id="features"
    style={{
        position: 'relative',
        width: '100%',
        padding:
            'clamp(8rem, 13vw, 14rem) clamp(1.5rem, 5vw, 6rem)',
        background: '#08080B',
        overflow: 'hidden',
    }}
>
    {/* =====================================================
        BACKGROUND ATMOSPHERE
    ===================================================== */}

    <div
        style={{
            position: 'absolute',
            top: '-350px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '700px',
            borderRadius: '50%',
            background:
                'radial-gradient(circle, rgba(168,85,247,0.09) 0%, rgba(99,102,241,0.035) 35%, transparent 72%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
        }}
    />

    <div
        style={{
            position: 'absolute',
            right: '-300px',
            bottom: '-300px',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background:
                'radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
        }}
    />


    {/* =====================================================
        MAIN CONTAINER
    ===================================================== */}

    <div
        style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '1700px',
            margin: '0 auto',
        }}
    >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom:
                    'clamp(5rem, 9vw, 9rem)',
            }}
        >

           


            {/* =================================================
                HUGE TITLE
            ================================================= */}

            <h2
                style={{
                    margin: 0,

                    maxWidth: '1500px',

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize:
                        'clamp(4.5rem, 10.5vw, 10rem)',

                    lineHeight: 0.9,

                    letterSpacing: '-0.075em',

                    fontWeight: 500,

                    color: '#FFFFFF',
                }}
            >
                6 Powerful Tools,
                <br />

                 <span
        style={{
            background:
                'linear-gradient(135deg, #FFFFFF 20%, #E9D5FF 55%, #A855F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
        }}
    >
        Zero Cost.
    </span>
            </h2>


            {/* Description */}

            <p
                style={{
                    margin:
                        '2.5rem auto 0',

                    maxWidth: '650px',

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize:
                        'clamp(1.05rem, 1.5vw, 1.3rem)',

                    lineHeight: 1.65,

                    letterSpacing: '-0.015em',

                    color:
                        'rgba(255,255,255,0.46)',
                }}
            >
                Everything you need to transform, analyze,
                and process images like a professional.
            </p>

        </div>


        {/* =================================================
            FEATURE GRID
        ================================================= */}

        <div
            style={{
                display: 'grid',

                gridTemplateColumns:
                    'repeat(12, minmax(0, 1fr))',

                gap:
                    '1px',

                background:
                    'rgba(255,255,255,0.08)',

                border:
                    '1px solid rgba(255,255,255,0.08)',

                borderRadius: '28px',

                overflow: 'hidden',
            }}
        >

            {features.map((f, i) => (

                <div
                    key={i}

                    onMouseEnter={() =>
                        setHoveredFeature(i)
                    }

                    onMouseLeave={() =>
                        setHoveredFeature(null)
                    }

                    style={{
                        position: 'relative',

                        gridColumn:
                            i === 0 ||
                            i === 3
                                ? 'span 6'
                                : 'span 3',

                        minHeight:
                            i === 0 ||
                            i === 3
                                ? '440px'
                                : '360px',

                        padding:
                            'clamp(2rem, 4vw, 3.5rem)',

                        background:
                            hoveredFeature === i
                                ? '#111016'
                                : '#0C0C10',

                        transition:
                            'background 0.35s ease',

                        cursor: 'default',

                        overflow: 'hidden',
                    }}
                >

                    {/* =================================================
                        HOVER LIGHT
                    ================================================= */}

                    <div
                        style={{
                            position: 'absolute',

                            top: '-180px',
                            right: '-180px',

                            width: '420px',
                            height: '420px',

                            borderRadius: '50%',

                            background:
                                `radial-gradient(circle, ${f.color}18 0%, transparent 68%)`,

                            filter: 'blur(35px)',

                            opacity:
                                hoveredFeature === i
                                    ? 1
                                    : 0,

                            transition:
                                'opacity 0.5s ease',

                            pointerEvents: 'none',
                        }}
                    />


                    {/* =================================================
                        TOP ROW
                    ================================================= */}

                    <div
                        style={{
                            position: 'relative',
                            zIndex: 2,

                            display: 'flex',

                            alignItems: 'center',

                            justifyContent:
                                'space-between',

                            marginBottom:
                                'clamp(3rem, 6vw, 5rem)',
                        }}
                    >

                        {/* Number */}

                        <span
                            style={{
                                fontFamily:
                                    'Inter, sans-serif',

                                fontSize: '0.75rem',

                                fontWeight: 600,

                                letterSpacing:
                                    '0.12em',

                                color:
                                    'rgba(255,255,255,0.28)',
                            }}
                        >
                            {String(i + 1).padStart(2, '0')}
                        </span>


                        {/* Icon */}

                        <div
                            style={{
                                width: '48px',
                                height: '48px',

                                display: 'flex',

                                alignItems: 'center',
                                justifyContent: 'center',

                                borderRadius: '50%',

                                border:
                                    hoveredFeature === i
                                        ? `1px solid ${f.color}50`
                                        : '1px solid rgba(255,255,255,0.12)',

                                background:
                                    hoveredFeature === i
                                        ? `${f.color}12`
                                        : 'rgba(255,255,255,0.025)',

                                fontSize: '1.25rem',

                                transition:
                                    'all 0.35s ease',
                            }}
                        >
                            {f.icon}
                        </div>

                    </div>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div
                        style={{
                            position: 'relative',
                            zIndex: 2,
                        }}
                    >

                        {/* Badge */}

                        <div
                            style={{
                                marginBottom: '1rem',

                                fontFamily:
                                    'Inter, sans-serif',

                                fontSize: '0.7rem',

                                fontWeight: 650,

                                letterSpacing:
                                    '0.13em',

                                textTransform:
                                    'uppercase',

                                color: f.color,
                            }}
                        >
                            {f.badge}
                        </div>


                        {/* TITLE */}

                        <h3
                            style={{
                                margin: 0,

                                marginBottom: '1rem',

                                fontFamily:
                                    'Inter, "Helvetica Neue", Arial, sans-serif',

                                fontSize:
                                    i === 0 ||
                                    i === 3
                                        ? 'clamp(2rem, 3.5vw, 3.25rem)'
                                        : 'clamp(1.7rem, 2.5vw, 2.4rem)',

                                lineHeight: 1.02,

                                letterSpacing:
                                    '-0.055em',

                                fontWeight: 500,

                                color: '#FFFFFF',
                            }}
                        >
                            {f.title}
                        </h3>


                        {/* DESCRIPTION */}

                        <p
                            style={{
                                margin: 0,

                                maxWidth:
                                    i === 0 ||
                                    i === 3
                                        ? '650px'
                                        : '430px',

                                fontFamily:
                                    'Inter, sans-serif',

                                fontSize:
                                    'clamp(0.95rem, 1.3vw, 1.12rem)',

                                lineHeight: 1.65,

                                letterSpacing:
                                    '-0.005em',

                                color:
                                    'rgba(255,255,255,0.42)',
                            }}
                        >
                            {f.desc}
                        </p>

                    </div>


                    {/* =================================================
                        BOTTOM LINE
                    ================================================= */}

                    <div
                        style={{
                            position: 'absolute',

                            left:
                                'clamp(2rem, 4vw, 3.5rem)',

                            right:
                                'clamp(2rem, 4vw, 3.5rem)',

                            bottom:
                                'clamp(2rem, 3vw, 2.5rem)',

                            display: 'flex',

                            alignItems: 'center',

                            justifyContent:
                                'space-between',
                        }}
                    >

                        {/* Progress */}

                        <div
                            style={{
                                width: '45px',
                                height: '1px',

                                background:
                                    hoveredFeature === i
                                        ? f.color
                                        : 'rgba(255,255,255,0.15)',

                                transition:
                                    'all 0.4s ease',
                            }}
                        />


                        {/* Arrow */}

                        <span
                            style={{
                                fontFamily:
                                    'Inter, sans-serif',

                                fontSize: '1rem',

                                color:
                                    hoveredFeature === i
                                        ? f.color
                                        : 'rgba(255,255,255,0.25)',

                                transform:
                                    hoveredFeature === i
                                        ? 'translate(3px, -3px)'
                                        : 'translate(0, 0)',

                                transition:
                                    'all 0.3s ease',
                            }}
                        >
                            ↗
                        </span>

                    </div>

                </div>

            ))}

        </div>


        {/* =================================================
            BOTTOM STATEMENT
        ================================================= */}

        <div
            style={{
                display: 'flex',

                justifyContent:
                    'space-between',

                alignItems: 'center',

                marginTop: '2rem',

                padding:
                    '0 0.5rem',

                color:
                    'rgba(255,255,255,0.28)',

                fontFamily:
                    'Inter, sans-serif',

                fontSize: '0.78rem',

                letterSpacing:
                    '0.02em',
            }}
        >

            <span>
                Built for speed. Designed for privacy.
            </span>

            <span>
                06 TOOLS / 01 PLATFORM
            </span>

        </div>

    </div>


    {/* =========================================================
        RESPONSIVE
    ========================================================= */}

    <style>{`

        @media (max-width: 1000px) {

            #features > div > div:nth-child(2) {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr)) !important;
            }

        }

        @media (max-width: 700px) {

            #features {
                padding-left: 1rem !important;
                padding-right: 1rem !important;
            }

            #features h2 {
                font-size:
                    clamp(4rem, 17vw, 7rem) !important;

                line-height: 0.9 !important;
            }

            #features > div > div:nth-child(2) {
                grid-template-columns:
                    1fr !important;
            }

            #features > div > div:nth-child(2) > div {
                grid-column: span 1 !important;
                min-height: 340px !important;
            }

        }

    `}</style>

</section>

            {/* ───── HOW IT WORKS ───── */}
{/* =========================================================
    HOW IT WORKS
========================================================= */}

{/* =========================================================
    HOW IT WORKS
========================================================= */}

<section
    id="how-it-works"
    style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding:
            'clamp(7rem, 11vw, 12rem) clamp(1.5rem, 5vw, 6rem)',
        background: '#08080B',
        overflow: 'hidden',
    }}
>
    {/* =====================================================
        AMBIENT BACKGROUND GLOW
    ===================================================== */}

    <div
        style={{
            position: 'absolute',
            width: '800px',
            height: '800px',
            top: '-500px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            pointerEvents: 'none',
        }}
    />

    <div
        style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            right: '-350px',
            bottom: '-300px',
            borderRadius: '50%',
            background:
                'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
        }}
    />

    {/* =====================================================
        MAIN CONTAINER
    ===================================================== */}

    <div
        style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '1700px',
            margin: '0 auto',
        }}
    >

        {/* =================================================
            SECTION TITLE — CENTER
        ================================================= */}

        <div
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom:
                    'clamp(5rem, 8vw, 8rem)',
            }}
        >

           


            {/* HUGE SECTION TITLE */}
            <h2
                style={{
                    margin: 0,

                    width: '100%',

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize:
                        'clamp(5rem, 11vw, 11rem)',

                    lineHeight: 0.88,

                    letterSpacing: '-0.075em',

                    fontWeight: 500,

                    color: '#FFFFFF',

                    textAlign: 'center',

                    whiteSpace: 'nowrap',
                }}
            >
                How It Works?
            </h2>


            {/* Decorative line */}
            <div
                style={{
                    width: '90px',
                    height: '1px',

                    marginTop: '3rem',

                    background:
                        'linear-gradient(90deg, transparent, #A855F7, transparent)',

                    opacity: 0.8,
                }}
            />

        </div>


        {/* =================================================
            CONTENT
            LEFT = BIG EDITORIAL TEXT
            RIGHT = CARD GRID
        ================================================= */}

        <div
            className="how-work-content"
            style={{
                display: 'grid',

                gridTemplateColumns:
                    'minmax(340px, 0.72fr) minmax(650px, 1.28fr)',

                gap:
                    'clamp(4rem, 8vw, 10rem)',

                alignItems: 'start',
            }}
        >

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div
                style={{
                    paddingTop: '0.5rem',
                    maxWidth: '560px',
                }}
            >

                {/* Section index */}
                <div
                    style={{
                        marginBottom: '2.5rem',

                        fontFamily:
                            'Inter, "Helvetica Neue", Arial, sans-serif',

                        fontSize: '0.82rem',

                        fontWeight: 600,

                        letterSpacing: '0.14em',

                        color:
                            'rgba(255,255,255,0.35)',
                    }}
                >
                    01 — HOW IT WORKS
                </div>


                {/* BIG PRIMARY TEXT */}
                <p
                    style={{
                        margin: 0,

                        fontFamily:
                            'Inter, "Helvetica Neue", Arial, sans-serif',

                        fontSize:
                            'clamp(1.8rem, 3vw, 3rem)',

                        lineHeight: 1.18,

                        letterSpacing: '-0.045em',

                        fontWeight: 400,

                        color: '#FFFFFF',
                    }}
                >
                    Three simple steps to transform your
                    images into professional results.
                </p>


                {/* SECONDARY DESCRIPTION */}
                <p
                    style={{
                        marginTop: '2rem',

                        marginBottom: 0,

                        maxWidth: '520px',

                        fontFamily:
                            'Inter, "Helvetica Neue", Arial, sans-serif',

                        fontSize:
                            'clamp(1.05rem, 1.45vw, 1.3rem)',

                        lineHeight: 1.7,

                        letterSpacing: '-0.015em',

                        fontWeight: 400,

                        color:
                            'rgba(255,255,255,0.48)',
                    }}
                >
                    Upload an image, choose the tool you
                    need, and let the processing happen
                    directly in your browser. No account.
                    No waiting. No unnecessary complexity.
                </p>


                {/* =================================================
                    FEATURE LIST
                ================================================= */}

                <div
                    style={{
                        marginTop: '3.5rem',

                        display: 'flex',
                        flexDirection: 'column',

                        gap: '1.25rem',
                    }}
                >

                    {[
                        'Runs directly in your browser',
                        'No account required',
                        'Your files stay private',
                    ].map((item) => (

                        <div
                            key={item}
                            style={{
                                display: 'flex',
                                alignItems: 'center',

                                gap: '0.9rem',

                                fontFamily:
                                    'Inter, "Helvetica Neue", Arial, sans-serif',

                                fontSize:
                                    'clamp(0.95rem, 1.2vw, 1.1rem)',

                                fontWeight: 500,

                                letterSpacing:
                                    '-0.01em',

                                color:
                                    'rgba(255,255,255,0.58)',
                            }}
                        >

                            {/* Check icon */}
                            <span
                                style={{
                                    flexShrink: 0,

                                    width: '25px',
                                    height: '25px',

                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                    borderRadius: '50%',

                                    background:
                                        'rgba(168,85,247,0.10)',

                                    border:
                                        '1px solid rgba(168,85,247,0.28)',

                                    color: '#C084FC',

                                    fontSize: '0.75rem',

                                    boxShadow:
                                        '0 0 18px rgba(168,85,247,0.08)',
                                }}
                            >
                                ✓
                            </span>

                            {item}

                        </div>
                    ))}

                </div>

            </div>


            {/* =================================================
                RIGHT — PREMIUM CARD GRID
            ================================================= */}

            <div
                className="how-work-grid"
                style={{
                    display: 'grid',

                    gridTemplateColumns:
                        'repeat(2, minmax(0, 1fr))',

                    gap: '1.25rem',
                }}
            >

                {steps.map((s, i) => (

                    <div
                        key={i}

                        style={{
                            position: 'relative',

                            minHeight:
                                i === 0
                                    ? '460px'
                                    : '350px',

                            padding:
                                'clamp(2rem, 3.5vw, 3.2rem)',

                            borderRadius: '26px',

                            border:
                                '1px solid rgba(255,255,255,0.085)',

                            background:
                                'linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))',

                            boxShadow:
                                '0 30px 100px rgba(0,0,0,0.3)',

                            overflow: 'hidden',

                            display: 'flex',

                            flexDirection: 'column',

                            justifyContent:
                                'space-between',

                            transition:
                                'transform .4s cubic-bezier(.16,1,.3,1), border-color .4s ease, box-shadow .4s ease',

                            cursor: 'default',

                            gridColumn:
                                i === 0
                                    ? '1 / -1'
                                    : 'auto',
                        }}

                        onMouseEnter={(e) => {

                            e.currentTarget.style.transform =
                                'translateY(-7px)';

                            e.currentTarget.style.borderColor =
                                'rgba(192,132,252,0.32)';

                            e.currentTarget.style.boxShadow =
                                '0 45px 120px rgba(0,0,0,0.45), 0 0 60px rgba(168,85,247,0.07)';
                        }}

                        onMouseLeave={(e) => {

                            e.currentTarget.style.transform =
                                'translateY(0)';

                            e.currentTarget.style.borderColor =
                                'rgba(255,255,255,0.085)';

                            e.currentTarget.style.boxShadow =
                                '0 30px 100px rgba(0,0,0,0.3)';
                        }}
                    >

                        {/* Card glow */}
                        <div
                            style={{
                                position: 'absolute',

                                width: '420px',
                                height: '420px',

                                top: '-250px',
                                right: '-120px',

                                borderRadius: '50%',

                                background:
                                    i === 0
                                        ? 'radial-gradient(circle, rgba(168,85,247,0.14), transparent 68%)'
                                        : 'radial-gradient(circle, rgba(255,255,255,0.045), transparent 68%)',

                                filter: 'blur(30px)',

                                pointerEvents: 'none',
                            }}
                        />


                        {/* =================================================
                            CARD TOP
                        ================================================= */}

                        <div
                            style={{
                                position: 'relative',
                                zIndex: 2,

                                display: 'flex',

                                alignItems: 'center',

                                justifyContent:
                                    'space-between',
                            }}
                        >

                            <span
                                style={{
                                    fontFamily:
                                        'Inter, sans-serif',

                                    fontSize: '0.8rem',

                                    fontWeight: 600,

                                    letterSpacing:
                                        '0.12em',

                                    color:
                                        'rgba(255,255,255,0.3)',
                                }}
                            >
                                {String(i + 1).padStart(
                                    2,
                                    '0'
                                )}
                            </span>


                            <div
                                style={{
                                    width: '42px',
                                    height: '42px',

                                    borderRadius: '50%',

                                    display: 'flex',

                                    alignItems: 'center',

                                    justifyContent: 'center',

                                    border:
                                        '1px solid rgba(255,255,255,0.1)',

                                    background:
                                        'rgba(255,255,255,0.035)',

                                    color:
                                        'rgba(255,255,255,0.65)',

                                    fontSize: '1.05rem',
                                }}
                            >
                                ↗
                            </div>

                        </div>


                        {/* =================================================
                            CARD CONTENT
                        ================================================= */}

                        <div
                            style={{
                                position: 'relative',
                                zIndex: 2,
                            }}
                        >

                            {/* Step */}
                            <div
                                style={{
                                    marginBottom: '1rem',

                                    fontFamily:
                                        'Inter, sans-serif',

                                    fontSize: '0.78rem',

                                    fontWeight: 700,

                                    letterSpacing:
                                        '0.12em',

                                    textTransform:
                                        'uppercase',

                                    color: '#C084FC',
                                }}
                            >
                                STEP {i + 1}
                            </div>


                            {/* BIG CARD TITLE */}
                            <h3
                                style={{
                                    margin: 0,

                                    marginBottom: '1.1rem',

                                    fontFamily:
                                        'Inter, "Helvetica Neue", Arial, sans-serif',

                                    fontSize:
                                        'clamp(2.1rem, 3.2vw, 3.4rem)',

                                    lineHeight: 1.02,

                                    letterSpacing:
                                        '-0.055em',

                                    fontWeight: 500,

                                    color: '#FFFFFF',
                                }}
                            >
                                {s.title}
                            </h3>


                            {/* CARD DESCRIPTION */}
                            <p
                                style={{
                                    margin: 0,

                                    maxWidth:
                                        i === 0
                                            ? '760px'
                                            : '520px',

                                    fontFamily:
                                        'Inter, sans-serif',

                                    fontSize:
                                        'clamp(1rem, 1.35vw, 1.25rem)',

                                    lineHeight: 1.55,

                                    letterSpacing:
                                        '-0.01em',

                                    fontWeight: 400,

                                    color:
                                        'rgba(255,255,255,0.48)',
                                }}
                            >
                                {s.desc}
                            </p>

                        </div>


                        {/* =================================================
                            CARD FOOTER
                        ================================================= */}

                        <div
                            style={{
                                position: 'relative',
                                zIndex: 2,

                                paddingTop: '1.25rem',

                                borderTop:
                                    '1px solid rgba(255,255,255,0.07)',

                                display: 'flex',

                                alignItems: 'center',

                                justifyContent:
                                    'space-between',
                            }}
                        >

                            <span
                                style={{
                                    fontFamily:
                                        'Inter, sans-serif',

                                    fontSize: '0.78rem',

                                    fontWeight: 500,

                                    color:
                                        'rgba(255,255,255,0.28)',
                                }}
                            >
                                {i === 0
                                    ? 'Start here'
                                    : i === 1
                                    ? 'Process'
                                    : 'Finish'}
                            </span>


                            <span
                                style={{
                                    fontFamily:
                                        'Inter, sans-serif',

                                    fontSize: '0.78rem',

                                    fontWeight: 500,

                                    letterSpacing:
                                        '0.08em',

                                    color:
                                        'rgba(255,255,255,0.25)',
                                }}
                            >
                                {String(i + 1).padStart(
                                    2,
                                    '0'
                                )}{' '}
                                / 03
                            </span>

                        </div>

                    </div>
                ))}

            </div>

        </div>

    </div>


    {/* =========================================================
        RESPONSIVE
    ========================================================= */}

    <style>{`

        @media (max-width: 1200px) {

            .how-work-content {
                grid-template-columns:
                    minmax(300px, 0.7fr)
                    minmax(550px, 1.3fr) !important;

                gap: 4rem !important;
            }

        }


        @media (max-width: 1050px) {

            .how-work-content {
                grid-template-columns: 1fr !important;

                gap: 5rem !important;
            }

            .how-work-content > div:first-child {
                max-width: 700px !important;
            }

        }


        @media (max-width: 800px) {

            .how-work-grid {
                grid-template-columns: 1fr !important;
            }

            .how-work-grid > div {
                grid-column: auto !important;

                min-height: 360px !important;
            }

        }


        @media (max-width: 600px) {

            #how-it-works {
                padding-left: 1.25rem !important;
                padding-right: 1.25rem !important;
            }

            #how-it-works h2 {
                font-size:
                    clamp(4rem, 18vw, 6rem) !important;

                white-space: normal !important;

                line-height: 0.9 !important;
            }

        }

    `}</style>

</section>




{/* =========================================================
    PRIVACY FIRST — LOCAL PROCESSING SECTION
========================================================= */}

<section
    id="privacy"
    style={{
        position: 'relative',
        width: '100%',
        padding:
            'clamp(7rem, 12vw, 12rem) clamp(1.25rem, 4vw, 4rem)',
        overflow: 'hidden',
        background: '#08080F',
    }}
>
    {/* Ambient glow */}
    <div
        style={{
            position: 'absolute',
            top: '10%',
            left: '-180px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
                'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
        }}
    />

    <div
        style={{
            position: 'absolute',
            bottom: '-200px',
            right: '-150px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
                'radial-gradient(circle, rgba(99,102,241,0.10), transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
        }}
    />

    {/* Container */}
    <div
        style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '1500px',
            margin: '0 auto',
        }}
    >

        {/* =====================================================
            TITLE
        ===================================================== */}

        <div
            style={{
                textAlign: 'center',
                marginBottom: 'clamp(4rem, 8vw, 7rem)',
            }}
        >
            {/* Eyebrow */}
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',

                    padding: '0.45rem 0.85rem',
                    marginBottom:
                        'clamp(1.8rem, 3vw, 2.5rem)',

                    borderRadius: '999px',

                    border:
                        '1px solid rgba(255,255,255,0.09)',

                    background:
                        'rgba(255,255,255,0.025)',

                    color:
                        'rgba(255,255,255,0.48)',

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize: '0.7rem',
                    fontWeight: 600,

                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',

                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                }}
            >
                <span
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#A855F7',
                        boxShadow:
                            '0 0 14px rgba(168,85,247,0.9)',
                    }}
                />

                Privacy by design
            </div>

            {/* Main title */}
            <h2
                style={{
                    margin: 0,
                    width: '100%',
                    maxWidth: '1800px',
                    marginLeft: 'auto',
                    marginRight: 'auto',

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize:
                        'clamp(4rem, 8.5vw, 8.5rem)',

                    fontWeight: 500,
                    lineHeight: 0.95,
                    letterSpacing: '-0.075em',

                    textAlign: 'center',

                    color: '#FFFFFF',

                    whiteSpace: 'nowrap',
                }}
            >
                Your images stay yours.
            </h2>

            {/* Gradient phrase */}
            <div
                style={{
                    marginTop: '0.2rem',

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize:
                        'clamp(4rem, 8.5vw, 8.5rem)',

                    fontWeight: 500,
                    lineHeight: 0.95,
                    letterSpacing: '-0.075em',

                    background:
                        'linear-gradient(100deg, #FFFFFF 15%, #E9D5FF 50%, #C084FC 75%, #818CF8 100%)',

                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',

                    whiteSpace: 'nowrap',
                }}
            >
                Always private.
            </div>

            <p
                style={{
                    maxWidth: '680px',

                    margin:
                        'clamp(2rem, 4vw, 2.75rem) auto 0',

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize:
                        'clamp(1rem, 1.8vw, 1.2rem)',

                    lineHeight: 1.7,
                    fontWeight: 400,

                    color:
                        'rgba(255,255,255,0.48)',

                    letterSpacing: '-0.015em',
                }}
            >
                Your files are processed directly in your browser.
                No account, no unnecessary uploads, and no cloud
                storage standing between you and your work.
            </p>
        </div>


        {/* =====================================================
            MAIN PRIVACY PANEL
        ===================================================== */}

        <div
            style={{
                display: 'grid',
                gridTemplateColumns:
                    'minmax(0, 1.25fr) minmax(320px, 0.75fr)',

                gap: '1px',

                background:
                    'rgba(255,255,255,0.08)',

                border:
                    '1px solid rgba(255,255,255,0.08)',

                borderRadius: '32px',
                overflow: 'hidden',

                boxShadow:
                    '0 40px 120px rgba(0,0,0,0.4)',
            }}
        >

            {/* =================================================
                LEFT — VISUAL
            ================================================= */}

            <div
                style={{
                    position: 'relative',
                    minHeight: '520px',

                    padding:
                        'clamp(2rem, 5vw, 4rem)',

                    background:
                        'linear-gradient(145deg, rgba(168,85,247,0.07), rgba(99,102,241,0.025))',

                    overflow: 'hidden',
                }}
            >

                {/* Large decorative circle */}
                <div
                    style={{
                        position: 'absolute',

                        width: '420px',
                        height: '420px',

                        top: '50%',
                        left: '50%',

                        transform:
                            'translate(-50%, -50%)',

                        borderRadius: '50%',

                        border:
                            '1px solid rgba(168,85,247,0.15)',

                        boxShadow:
                            '0 0 100px rgba(168,85,247,0.08), inset 0 0 100px rgba(168,85,247,0.04)',
                    }}
                />

                <div
                    style={{
                        position: 'absolute',

                        width: '280px',
                        height: '280px',

                        top: '50%',
                        left: '50%',

                        transform:
                            'translate(-50%, -50%)',

                        borderRadius: '50%',

                        border:
                            '1px solid rgba(192,132,252,0.18)',

                        boxShadow:
                            '0 0 80px rgba(168,85,247,0.12)',
                    }}
                />

                {/* Center */}
                <div
                    style={{
                        position: 'absolute',

                        top: '50%',
                        left: '50%',

                        transform:
                            'translate(-50%, -50%)',

                        width: '110px',
                        height: '110px',

                        borderRadius: '32px',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                        background:
                            'linear-gradient(145deg, rgba(168,85,247,0.18), rgba(99,102,241,0.12))',

                        border:
                            '1px solid rgba(192,132,252,0.25)',

                        boxShadow:
                            '0 0 70px rgba(168,85,247,0.22), inset 0 1px 0 rgba(255,255,255,0.1)',

                        color: '#FFFFFF',

                        fontSize: '2.4rem',
                    }}
                >
                    ◇
                </div>

                {/* Top label */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 2,

                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',

                        padding:
                            '0.55rem 0.8rem',

                        borderRadius: '999px',

                        background:
                            'rgba(255,255,255,0.035)',

                        border:
                            '1px solid rgba(255,255,255,0.08)',

                        color:
                            'rgba(255,255,255,0.55)',

                        fontSize: '0.75rem',
                        fontWeight: 600,

                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                    }}
                >
                    <span
                        style={{
                            color: '#A855F7',
                        }}
                    >
                        ●
                    </span>

                    Local processing
                </div>

                {/* Bottom text */}
                <div
                    style={{
                        position: 'absolute',
                        left:
                            'clamp(2rem, 5vw, 4rem)',
                        bottom:
                            'clamp(2rem, 5vw, 4rem)',
                    }}
                >
                    <div
                        style={{
                            fontFamily:
                                'Inter, sans-serif',

                            fontSize:
                                'clamp(1.7rem, 3vw, 2.5rem)',

                            fontWeight: 500,

                            letterSpacing:
                                '-0.045em',

                            color: '#FFFFFF',

                            marginBottom: '0.6rem',
                        }}
                    >
                        Processing happens here.
                    </div>

                    <div
                        style={{
                            color:
                                'rgba(255,255,255,0.4)',

                            fontSize: '0.95rem',

                            lineHeight: 1.6,
                        }}
                    >
                        Inside your browser.
                        <br />
                        On your device.
                    </div>
                </div>
            </div>


            {/* =================================================
                RIGHT — BENEFITS
            ================================================= */}

            <div
                style={{
                    padding:
                        'clamp(2rem, 5vw, 4rem)',

                    background:
                        'rgba(10,10,18,0.96)',

                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >

                {[
                    {
                        icon: '01',
                        title: 'No uploads',
                        text:
                            'Your images do not need to leave your device for everyday processing.',
                    },
                    {
                        icon: '02',
                        title: 'No account',
                        text:
                            'Open the app and start working immediately. Nothing to register.',
                    },
                    {
                        icon: '03',
                        title: 'No waiting',
                        text:
                            'Browser-based processing keeps your workflow fast and direct.',
                    },
                    {
                        icon: '04',
                        title: 'No limits',
                        text:
                            'Use the available tools without artificial processing quotas.',
                    },
                ].map((item, index) => (
                    <div
                        key={item.icon}
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                '48px 1fr',

                            gap: '1.2rem',

                            padding:
                                '1.6rem 0',

                            borderBottom:
                                index !== 3
                                    ? '1px solid rgba(255,255,255,0.07)'
                                    : 'none',
                        }}
                    >

                        {/* Number */}
                        <div
                            style={{
                                width: '42px',
                                height: '42px',

                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',

                                borderRadius: '12px',

                                background:
                                    'rgba(168,85,247,0.07)',

                                border:
                                    '1px solid rgba(168,85,247,0.14)',

                                color:
                                    '#C084FC',

                                fontSize: '0.72rem',
                                fontWeight: 700,

                                letterSpacing: '0.04em',
                            }}
                        >
                            {item.icon}
                        </div>

                        <div>
                            <h3
                                style={{
                                    margin: 0,
                                    marginBottom: '0.45rem',

                                    fontFamily:
                                        'Inter, sans-serif',

                                    fontSize:
                                        'clamp(1.1rem, 2vw, 1.3rem)',

                                    fontWeight: 500,

                                    letterSpacing:
                                        '-0.025em',

                                    color: '#FFFFFF',
                                }}
                            >
                                {item.title}
                            </h3>

                            <p
                                style={{
                                    margin: 0,

                                    fontSize:
                                        '0.9rem',

                                    lineHeight: 1.65,

                                    color:
                                        'rgba(255,255,255,0.4)',
                                }}
                            >
                                {item.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>


        {/* =====================================================
            BOTTOM TRUST LINE
        ===================================================== */}

        <div
            style={{
                marginTop:
                    'clamp(3rem, 6vw, 5rem)',

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

                flexWrap: 'wrap',

                gap:
                    'clamp(1.5rem, 4vw, 3rem)',

                color:
                    'rgba(255,255,255,0.35)',

                fontSize: '0.8rem',

                fontFamily:
                    'Inter, "Helvetica Neue", Arial, sans-serif',
            }}
        >
            {[
                'Private by default',
                'Browser-based processing',
                'No account required',
                'Your files stay yours',
            ].map((text) => (
                <span
                    key={text}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                    }}
                >
                    <span
                        style={{
                            color: '#A855F7',
                            fontWeight: 700,
                        }}
                    >
                        ✓
                    </span>

                    {text}
                </span>
            ))}
        </div>
    </div>
</section>




{/* =========================================================
    WORKFLOW / FORMATS SECTION
========================================================= */}

<section
    id="workflow"
    style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(7rem, 12vw, 13rem) clamp(1.25rem, 4vw, 4rem)',
        overflow: 'hidden',
        background: '#08080F',
    }}
>
    {/* Subtle ambient glow */}
    <div
        style={{
            position: 'absolute',
            top: '20%',
            right: '-180px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
                'radial-gradient(circle, rgba(168,85,247,0.10), transparent 70%)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
        }}
    />

    <div
        style={{
            position: 'absolute',
            bottom: '-200px',
            left: '-180px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
                'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
        }}
    />

    <div
        style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '1500px',
            margin: '0 auto',
        }}
    >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
            style={{
                display: 'grid',
                gridTemplateColumns:
                    'minmax(0, 1fr) minmax(320px, 0.75fr)',
                gap: 'clamp(2rem, 7vw, 8rem)',
                alignItems: 'end',
                marginBottom: 'clamp(4rem, 8vw, 7rem)',
            }}
        >
            {/* Left */}
            <div>

                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.55rem',

                        padding: '0.45rem 0.85rem',
                        marginBottom: '2rem',

                        borderRadius: '999px',

                        border:
                            '1px solid rgba(255,255,255,0.09)',

                        background:
                            'rgba(255,255,255,0.025)',

                        color:
                            'rgba(255,255,255,0.48)',

                        fontFamily:
                            'Inter, "Helvetica Neue", Arial, sans-serif',

                        fontSize: '0.7rem',
                        fontWeight: 600,

                        letterSpacing: '0.13em',
                        textTransform: 'uppercase',

                        backdropFilter: 'blur(12px)',
                    }}
                >
                    <span
                        style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#A855F7',
                            boxShadow:
                                '0 0 14px rgba(168,85,247,0.9)',
                        }}
                    />

                    Built for every workflow
                </div>

                <h2
                    style={{
                        margin: 0,

                        fontFamily:
                            'Inter, "Helvetica Neue", Arial, sans-serif',

                        fontSize:
                            'clamp(4rem, 8vw, 8rem)',

                        fontWeight: 500,
                        lineHeight: 0.94,
                        letterSpacing: '-0.075em',

                        color: '#FFFFFF',
                    }}
                >
                    One workflow.
                    <br />

                    <span
                        style={{
                            background:
                                'linear-gradient(100deg, #FFFFFF 20%, #E9D5FF 52%, #C084FC 75%, #818CF8 100%)',

                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Every format.
                    </span>
                </h2>
            </div>

            {/* Right */}
            <div
                style={{
                    paddingBottom: '0.5rem',
                }}
            >
                <p
                    style={{
                        margin: 0,

                        maxWidth: '540px',

                        fontFamily:
                            'Inter, "Helvetica Neue", Arial, sans-serif',

                        fontSize:
                            'clamp(1rem, 1.8vw, 1.2rem)',

                        lineHeight: 1.7,

                        color:
                            'rgba(255,255,255,0.48)',

                        letterSpacing: '-0.015em',
                    }}
                >
                    From a single image to a finished asset.
                    Transform, optimize, extract, convert, and
                    export without jumping between different tools.
                </p>
            </div>
        </div>


        {/* =====================================================
            WORKFLOW GRID
        ===================================================== */}

        <div
            style={{
                display: 'grid',

                gridTemplateColumns:
                    'repeat(12, minmax(0, 1fr))',

                gap: '1rem',
            }}
        >

            {/* =================================================
                CARD 01 — EDIT
            ================================================= */}

            <div
                style={{
                    gridColumn:
                        'span 7',

                    minHeight: '430px',

                    position: 'relative',

                    padding:
                        'clamp(2rem, 4vw, 3.5rem)',

                    borderRadius: '28px',

                    border:
                        '1px solid rgba(255,255,255,0.08)',

                    background:
                        'linear-gradient(145deg, rgba(168,85,247,0.08), rgba(255,255,255,0.025))',

                    overflow: 'hidden',

                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(168,85,247,0.25)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.08)';
                }}
            >

                <div
                    style={{
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    <span
                        style={{
                            color: '#C084FC',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                        }}
                    >
                        01 / EDIT
                    </span>

                    <h3
                        style={{
                            margin:
                                '1.5rem 0 0.75rem',

                            fontFamily:
                                'Inter, sans-serif',

                            fontSize:
                                'clamp(2rem, 4vw, 3.4rem)',

                            fontWeight: 500,

                            lineHeight: 1,

                            letterSpacing:
                                '-0.055em',

                            color: '#FFFFFF',
                        }}
                    >
                        Make the image
                        <br />
                        work for you.
                    </h3>

                    <p
                        style={{
                            maxWidth: '430px',

                            margin: 0,

                            color:
                                'rgba(255,255,255,0.42)',

                            fontSize: '0.95rem',

                            lineHeight: 1.7,
                        }}
                    >
                        Remove backgrounds, enhance visuals,
                        vectorize graphics, or extract the
                        information you need.
                    </p>
                </div>

                {/* Decorative image frame */}
                <div
                    style={{
                        position: 'absolute',

                        right: '-5%',
                        bottom: '-18%',

                        width: '55%',
                        height: '55%',

                        borderRadius: '28px',

                        border:
                            '1px solid rgba(192,132,252,0.18)',

                        background:
                            'linear-gradient(145deg, rgba(168,85,247,0.16), rgba(99,102,241,0.04))',

                        transform:
                            'rotate(-8deg)',

                        boxShadow:
                            '0 30px 80px rgba(0,0,0,0.3)',
                    }}
                />

                <div
                    style={{
                        position: 'absolute',

                        right: '8%',
                        bottom: '5%',

                        width: '38%',
                        height: '38%',

                        borderRadius: '20px',

                        background:
                            'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(168,85,247,0.08))',

                        border:
                            '1px solid rgba(255,255,255,0.10)',

                        transform:
                            'rotate(5deg)',

                        backdropFilter: 'blur(12px)',
                    }}
                />
            </div>


            {/* =================================================
                CARD 02 — EXTRACT
            ================================================= */}

            <div
                style={{
                    gridColumn:
                        'span 5',

                    minHeight: '430px',

                    padding:
                        'clamp(2rem, 4vw, 3.5rem)',

                    borderRadius: '28px',

                    border:
                        '1px solid rgba(255,255,255,0.08)',

                    background:
                        'rgba(255,255,255,0.025)',

                    position: 'relative',

                    overflow: 'hidden',

                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.18)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.08)';
                }}
            >

                <span
                    style={{
                        color:
                            'rgba(255,255,255,0.35)',

                        fontSize: '0.75rem',
                        fontWeight: 700,

                        letterSpacing: '0.12em',
                    }}
                >
                    02 / EXTRACT
                </span>

                <h3
                    style={{
                        margin:
                            '1.5rem 0 0.75rem',

                        fontFamily:
                            'Inter, sans-serif',

                        fontSize:
                            'clamp(2rem, 3.5vw, 3rem)',

                        fontWeight: 500,

                        lineHeight: 1,

                        letterSpacing:
                            '-0.05em',

                        color: '#FFFFFF',
                    }}
                >
                    Turn pixels
                    <br />
                    into data.
                </h3>

                <p
                    style={{
                        margin: 0,

                        color:
                            'rgba(255,255,255,0.42)',

                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                    }}
                >
                    Extract readable text from images with
                    browser-based OCR and turn visual information
                    into something you can actually use.
                </p>

                {/* OCR visual */}
                <div
                    style={{
                        position: 'absolute',

                        left: '12%',
                        right: '12%',
                        bottom: '8%',

                        padding: '1rem 1.2rem',

                        borderRadius: '14px',

                        background:
                            'rgba(255,255,255,0.035)',

                        border:
                            '1px solid rgba(255,255,255,0.08)',

                        fontFamily:
                            'ui-monospace, SFMono-Regular, Menlo, monospace',

                        fontSize: '0.75rem',

                        color:
                            'rgba(255,255,255,0.45)',
                    }}
                >
                    <span
                        style={{
                            color: '#C084FC',
                        }}
                    >
                        OCR
                    </span>

                    <span style={{ marginLeft: '1rem' }}>
                        text detected...
                    </span>
                </div>
            </div>


            {/* =================================================
                CARD 03 — EXPORT
            ================================================= */}

            <div
                style={{
                    gridColumn:
                        'span 5',

                    minHeight: '360px',

                    padding:
                        'clamp(2rem, 4vw, 3.5rem)',

                    borderRadius: '28px',

                    border:
                        '1px solid rgba(255,255,255,0.08)',

                    background:
                        'rgba(255,255,255,0.025)',

                    position: 'relative',

                    overflow: 'hidden',

                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.18)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.08)';
                }}
            >

                <span
                    style={{
                        color:
                            'rgba(255,255,255,0.35)',

                        fontSize: '0.75rem',
                        fontWeight: 700,

                        letterSpacing: '0.12em',
                    }}
                >
                    03 / EXPORT
                </span>

                <h3
                    style={{
                        margin:
                            '1.5rem 0 0.75rem',

                        fontFamily:
                            'Inter, sans-serif',

                        fontSize:
                            'clamp(2rem, 3.5vw, 3rem)',

                        fontWeight: 500,

                        lineHeight: 1,

                        letterSpacing:
                            '-0.05em',

                        color: '#FFFFFF',
                    }}
                >
                    Ready when
                    <br />
                    you are.
                </h3>

                <p
                    style={{
                        margin: 0,

                        maxWidth: '390px',

                        color:
                            'rgba(255,255,255,0.42)',

                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                    }}
                >
                    Convert your finished work into the format
                    you need and move straight to the next step.
                </p>

                {/* Format pills */}
                <div
                    style={{
                        position: 'absolute',

                        left:
                            'clamp(2rem, 4vw, 3.5rem)',

                        bottom:
                            'clamp(2rem, 4vw, 3rem)',

                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                    }}
                >
                    {['PNG', 'SVG', 'PDF', 'TXT'].map(
                        (format) => (
                            <span
                                key={format}
                                style={{
                                    padding:
                                        '0.5rem 0.75rem',

                                    borderRadius: '9px',

                                    border:
                                        '1px solid rgba(255,255,255,0.09)',

                                    background:
                                        'rgba(255,255,255,0.035)',

                                    color:
                                        'rgba(255,255,255,0.55)',

                                    fontSize: '0.7rem',

                                    fontWeight: 650,

                                    letterSpacing:
                                        '0.04em',
                                }}
                            >
                                {format}
                            </span>
                        )
                    )}
                </div>
            </div>


            {/* =================================================
                CARD 04 — FAST
            ================================================= */}

            <div
                style={{
                    gridColumn:
                        'span 7',

                    minHeight: '360px',

                    padding:
                        'clamp(2rem, 4vw, 3.5rem)',

                    borderRadius: '28px',

                    border:
                        '1px solid rgba(255,255,255,0.08)',

                    background:
                        'linear-gradient(145deg, rgba(99,102,241,0.06), rgba(255,255,255,0.025))',

                    position: 'relative',

                    overflow: 'hidden',

                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(129,140,248,0.25)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.08)';
                }}
            >

                <div
                    style={{
                        display: 'flex',
                        justifyContent:
                            'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <div>
                        <span
                            style={{
                                color: '#818CF8',

                                fontSize: '0.75rem',
                                fontWeight: 700,

                                letterSpacing:
                                    '0.12em',
                            }}
                        >
                            04 / FINISH
                        </span>

                        <h3
                            style={{
                                margin:
                                    '1.5rem 0 0.75rem',

                                fontFamily:
                                    'Inter, sans-serif',

                                fontSize:
                                    'clamp(2rem, 4vw, 3.4rem)',

                                fontWeight: 500,

                                lineHeight: 1,

                                letterSpacing:
                                    '-0.055em',

                                color: '#FFFFFF',
                            }}
                        >
                            Fast from
                            <br />
                            start to finish.
                        </h3>

                        <p
                            style={{
                                maxWidth: '430px',

                                margin: 0,

                                color:
                                    'rgba(255,255,255,0.42)',

                                fontSize: '0.95rem',

                                lineHeight: 1.7,
                            }}
                        >
                            No complicated workflow. No unnecessary
                            steps. Just choose a tool, process your
                            image, and keep moving.
                        </p>
                    </div>

                    {/* Speed indicator */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent:
                                'center',

                            width: '74px',
                            height: '74px',

                            borderRadius: '22px',

                            border:
                                '1px solid rgba(129,140,248,0.18)',

                            background:
                                'rgba(129,140,248,0.06)',

                            color: '#A5B4FC',

                            fontSize: '1.7rem',
                        }}
                    >
                        ↗
                    </div>
                </div>

                {/* Bottom line */}
                <div
                    style={{
                        position: 'absolute',

                        left:
                            'clamp(2rem, 4vw, 3.5rem)',
                        right:
                            'clamp(2rem, 4vw, 3.5rem)',
                        bottom:
                            'clamp(2rem, 4vw, 3rem)',

                        height: '1px',

                        background:
                            'linear-gradient(90deg, rgba(129,140,248,0.35), transparent)',
                    }}
                />
            </div>
        </div>


        {/* =====================================================
            BOTTOM STATEMENT
        ===================================================== */}

        <div
            style={{
                textAlign: 'center',

                marginTop:
                    'clamp(5rem, 9vw, 8rem)',
            }}
        >
            <p
                style={{
                    margin: 0,

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize:
                        'clamp(1.4rem, 3vw, 2.2rem)',

                    fontWeight: 400,

                    lineHeight: 1.35,

                    letterSpacing:
                        '-0.035em',

                    color:
                        'rgba(255,255,255,0.55)',
                }}
            >
                One image.
                <span style={{ color: '#FFFFFF' }}>
                    {' '}Multiple possibilities.
                </span>
            </p>
        </div>
    </div>
</section>




{/* =========================================================
    USE CASES — BUILT FOR YOUR WORKFLOW
========================================================= */}

<section
    id="use-cases"
    style={{
        position: 'relative',
        width: '100%',
        padding:
            'clamp(7rem, 12vw, 13rem) clamp(1.25rem, 4vw, 4rem)',
        overflow: 'hidden',
        background: '#08080F',
    }}
>
    {/* Ambient glow */}
    <div
        style={{
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '400px',
            borderRadius: '50%',
            background:
                'radial-gradient(ellipse, rgba(168,85,247,0.09), transparent 70%)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
        }}
    />

    <div
        style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '1500px',
            margin: '0 auto',
        }}
    >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
            style={{
                textAlign: 'center',
                marginBottom:
                    'clamp(4rem, 8vw, 7rem)',
            }}
        >
            {/* Eyebrow */}
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',

                    padding: '0.45rem 0.85rem',
                    marginBottom: '2rem',

                    borderRadius: '999px',

                    border:
                        '1px solid rgba(255,255,255,0.09)',

                    background:
                        'rgba(255,255,255,0.025)',

                    color:
                        'rgba(255,255,255,0.48)',

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize: '0.7rem',
                    fontWeight: 600,

                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',

                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                }}
            >
                <span
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#A855F7',
                        boxShadow:
                            '0 0 14px rgba(168,85,247,0.9)',
                    }}
                />

                Made for real work
            </div>

            {/* Main title */}
            <h2
                style={{
                    margin: 0,

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize:
                        'clamp(4rem, 8.5vw, 8.5rem)',

                    fontWeight: 500,
                    lineHeight: 0.94,
                    letterSpacing: '-0.075em',

                    color: '#FFFFFF',
                }}
            >
                Built for
                <br />

                <span
                    style={{
                        background:
                            'linear-gradient(100deg, #FFFFFF 20%, #E9D5FF 50%, #C084FC 75%, #818CF8 100%)',

                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    your workflow.
                </span>
            </h2>

            <p
                style={{
                    maxWidth: '650px',

                    margin:
                        'clamp(2rem, 4vw, 2.75rem) auto 0',

                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize:
                        'clamp(1rem, 1.8vw, 1.2rem)',

                    lineHeight: 1.7,
                    fontWeight: 400,

                    color:
                        'rgba(255,255,255,0.48)',

                    letterSpacing: '-0.015em',
                }}
            >
                Whether you're creating, building, studying, or
                running a business, powerful image processing
                should simply fit into the way you already work.
            </p>
        </div>


        {/* =====================================================
            USE CASE GRID
        ===================================================== */}

        <div
            style={{
                display: 'grid',

                gridTemplateColumns:
                    'repeat(2, minmax(0, 1fr))',

                gap: '1rem',
            }}
        >

            {/* =================================================
                CREATIVE
            ================================================= */}

            <div
                style={{
                    position: 'relative',

                    minHeight: '460px',

                    padding:
                        'clamp(2rem, 4vw, 3.5rem)',

                    borderRadius: '30px',

                    border:
                        '1px solid rgba(255,255,255,0.08)',

                    background:
                        'linear-gradient(145deg, rgba(168,85,247,0.09), rgba(255,255,255,0.025))',

                    overflow: 'hidden',

                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(168,85,247,0.25)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.08)';
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    <span
                        style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.13em',
                            color: '#C084FC',
                        }}
                    >
                        FOR CREATORS
                    </span>

                    <h3
                        style={{
                            margin:
                                '1.5rem 0 1rem',

                            fontFamily:
                                'Inter, sans-serif',

                            fontSize:
                                'clamp(2rem, 4vw, 3.2rem)',

                            fontWeight: 500,

                            lineHeight: 1,

                            letterSpacing:
                                '-0.055em',

                            color: '#FFFFFF',
                        }}
                    >
                        Create without
                        <br />
                        the busywork.
                    </h3>

                    <p
                        style={{
                            maxWidth: '420px',

                            margin: 0,

                            color:
                                'rgba(255,255,255,0.42)',

                            fontSize: '0.95rem',
                            lineHeight: 1.7,
                        }}
                    >
                        Clean up product images, remove backgrounds,
                        convert graphics, and prepare assets without
                        opening five different applications.
                    </p>
                </div>

                {/* Decorative composition */}
                <div
                    style={{
                        position: 'absolute',
                        right: '-30px',
                        bottom: '-70px',

                        width: '280px',
                        height: '280px',

                        borderRadius: '38px',

                        background:
                            'linear-gradient(145deg, rgba(168,85,247,0.18), rgba(99,102,241,0.04))',

                        border:
                            '1px solid rgba(192,132,252,0.18)',

                        transform:
                            'rotate(-12deg)',

                        boxShadow:
                            '0 30px 80px rgba(0,0,0,0.35)',
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        right: '70px',
                        bottom: '20px',

                        width: '150px',
                        height: '150px',

                        borderRadius: '28px',

                        background:
                            'rgba(255,255,255,0.055)',

                        border:
                            '1px solid rgba(255,255,255,0.12)',

                        transform:
                            'rotate(8deg)',

                        backdropFilter:
                            'blur(16px)',
                    }}
                />
            </div>


            {/* =================================================
                DEVELOPERS
            ================================================= */}

            <div
                style={{
                    position: 'relative',

                    minHeight: '460px',

                    padding:
                        'clamp(2rem, 4vw, 3.5rem)',

                    borderRadius: '30px',

                    border:
                        '1px solid rgba(255,255,255,0.08)',

                    background:
                        'rgba(255,255,255,0.025)',

                    overflow: 'hidden',

                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.18)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.08)';
                }}
            >
                <span
                    style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.13em',
                        color:
                            'rgba(255,255,255,0.38)',
                    }}
                >
                    FOR DEVELOPERS
                </span>

                <h3
                    style={{
                        margin:
                            '1.5rem 0 1rem',

                        fontFamily:
                            'Inter, sans-serif',

                        fontSize:
                            'clamp(2rem, 4vw, 3.2rem)',

                        fontWeight: 500,

                        lineHeight: 1,

                        letterSpacing:
                            '-0.055em',

                        color: '#FFFFFF',
                    }}
                >
                    Build faster.
                    <br />
                    Ship cleaner.
                </h3>

                <p
                    style={{
                        maxWidth: '420px',

                        margin: 0,

                        color:
                            'rgba(255,255,255,0.42)',

                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                    }}
                >
                    Give your projects a simple image toolkit
                    without forcing users through complicated
                    upload and account flows.
                </p>

                {/* Code-like visual */}
                <div
                    style={{
                        position: 'absolute',

                        left:
                            'clamp(2rem, 4vw, 3.5rem)',
                        right:
                            'clamp(2rem, 4vw, 3.5rem)',
                        bottom:
                            'clamp(2rem, 4vw, 3rem)',

                        padding: '1.2rem',

                        borderRadius: '16px',

                        background:
                            'rgba(0,0,0,0.28)',

                        border:
                            '1px solid rgba(255,255,255,0.07)',

                        fontFamily:
                            'ui-monospace, SFMono-Regular, Menlo, monospace',

                        fontSize: '0.75rem',

                        color:
                            'rgba(255,255,255,0.42)',
                    }}
                >
                    <span
                        style={{
                            color: '#C084FC',
                        }}
                    >
                        image
                    </span>

                    <span>
                        {' '}→{' '}
                    </span>

                    <span
                        style={{
                            color: '#818CF8',
                        }}
                    >
                        process
                    </span>

                    <span>
                        {' '}→{' '}
                    </span>

                    <span
                        style={{
                            color: '#FFFFFF',
                        }}
                    >
                        result
                    </span>
                </div>
            </div>


            {/* =================================================
                STUDENTS
            ================================================= */}

            <div
                style={{
                    position: 'relative',

                    minHeight: '380px',

                    padding:
                        'clamp(2rem, 4vw, 3.5rem)',

                    borderRadius: '30px',

                    border:
                        '1px solid rgba(255,255,255,0.08)',

                    background:
                        'rgba(255,255,255,0.025)',

                    overflow: 'hidden',

                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.18)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.08)';
                }}
            >
                <span
                    style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.13em',
                        color:
                            'rgba(255,255,255,0.38)',
                    }}
                >
                    FOR STUDENTS
                </span>

                <h3
                    style={{
                        margin:
                            '1.5rem 0 1rem',

                        fontFamily:
                            'Inter, sans-serif',

                        fontSize:
                            'clamp(2rem, 3.5vw, 2.8rem)',

                        fontWeight: 500,

                        lineHeight: 1,

                        letterSpacing:
                            '-0.05em',

                        color: '#FFFFFF',
                    }}
                >
                    Simple tools.
                    <br />
                    Zero friction.
                </h3>

                <p
                    style={{
                        maxWidth: '400px',

                        margin: 0,

                        color:
                            'rgba(255,255,255,0.42)',

                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                    }}
                >
                    Convert documents, extract text from screenshots,
                    prepare assignments, and work with images without
                    unnecessary setup.
                </p>

                <div
                    style={{
                        position: 'absolute',
                        right: '2rem',
                        bottom: '2rem',

                        fontSize: '4rem',
                        fontWeight: 300,

                        color:
                            'rgba(168,85,247,0.15)',

                        letterSpacing:
                            '-0.08em',
                    }}
                >
                    ∞
                </div>
            </div>


            {/* =================================================
                BUSINESS
            ================================================= */}

            <div
                style={{
                    position: 'relative',

                    minHeight: '380px',

                    padding:
                        'clamp(2rem, 4vw, 3.5rem)',

                    borderRadius: '30px',

                    border:
                        '1px solid rgba(255,255,255,0.08)',

                    background:
                        'linear-gradient(145deg, rgba(99,102,241,0.06), rgba(255,255,255,0.025))',

                    overflow: 'hidden',

                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(129,140,248,0.25)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.08)';
                }}
            >
                <span
                    style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.13em',
                        color: '#818CF8',
                    }}
                >
                    FOR TEAMS
                </span>

                <h3
                    style={{
                        margin:
                            '1.5rem 0 1rem',

                        fontFamily:
                            'Inter, sans-serif',

                        fontSize:
                            'clamp(2rem, 3.5vw, 2.8rem)',

                        fontWeight: 500,

                        lineHeight: 1,

                        letterSpacing:
                            '-0.05em',

                        color: '#FFFFFF',
                    }}
                >
                    Less tooling.
                    <br />
                    More doing.
                </h3>

                <p
                    style={{
                        maxWidth: '400px',

                        margin: 0,

                        color:
                            'rgba(255,255,255,0.42)',

                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                    }}
                >
                    Give your team one focused place for everyday
                    image operations and eliminate small repetitive
                    tasks from the workflow.
                </p>

                {/* Mini metrics */}
                <div
                    style={{
                        position: 'absolute',

                        left:
                            'clamp(2rem, 4vw, 3.5rem)',
                        bottom:
                            'clamp(2rem, 4vw, 3rem)',

                        display: 'flex',
                        gap: '2rem',
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: '1.8rem',
                                fontWeight: 500,
                                color: '#FFFFFF',
                                letterSpacing:
                                    '-0.04em',
                            }}
                        >
                            01
                        </div>

                        <div
                            style={{
                                marginTop: '0.3rem',
                                fontSize: '0.7rem',
                                color:
                                    'rgba(255,255,255,0.35)',
                                textTransform:
                                    'uppercase',
                                letterSpacing:
                                    '0.08em',
                            }}
                        >
                            workspace
                        </div>
                    </div>

                    <div>
                        <div
                            style={{
                                fontSize: '1.8rem',
                                fontWeight: 500,
                                color: '#FFFFFF',
                                letterSpacing:
                                    '-0.04em',
                            }}
                        >
                            ∞
                        </div>

                        <div
                            style={{
                                marginTop: '0.3rem',
                                fontSize: '0.7rem',
                                color:
                                    'rgba(255,255,255,0.35)',
                                textTransform:
                                    'uppercase',
                                letterSpacing:
                                    '0.08em',
                            }}
                        >
                            possibilities
                        </div>
                    </div>
                </div>
            </div>
        </div>


        {/* =====================================================
            FINAL STATEMENT
        ===================================================== */}

        <div
            style={{
                textAlign: 'center',

                marginTop:
                    'clamp(5rem, 9vw, 8rem)',
            }}
        >
            <div
                style={{
                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',

                    fontSize:
                        'clamp(1.5rem, 3vw, 2.3rem)',

                    fontWeight: 400,

                    lineHeight: 1.35,

                    letterSpacing:
                        '-0.04em',

                    color:
                        'rgba(255,255,255,0.48)',
                }}
            >
                Different workflows.
                <span
                    style={{
                        color: '#FFFFFF',
                    }}
                >
                    {' '}One powerful toolkit.
                </span>
            </div>
        </div>
    </div>
</section>






{/* ============================================================
    WORKFLOW / USE CASES SECTION
============================================================ */}
<section
    id="workflow"
    style={{
        position: 'relative',
        width: '100%',
        padding:
            'clamp(7rem, 14vw, 12rem) clamp(1.25rem, 4vw, 4rem)',
        overflow: 'hidden',
        background: '#08080F',
    }}
>
    {/* Ambient glow */}
    <div
        style={{
            position: 'absolute',
            top: '15%',
            left: '-15%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
                'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
        }}
    />

    <div
        style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
                'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
        }}
    />

    <div
        style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1500px',
            margin: '0 auto',
        }}
    >
        {/* Section Header */}
        <div
            style={{
                textAlign: 'center',
                marginBottom: 'clamp(4rem, 8vw, 7rem)',
            }}
        >
            {/* Eyebrow */}
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    marginBottom: '1.8rem',
                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 650,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.42)',
                }}
            >
                <span
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#A855F7',
                        boxShadow:
                            '0 0 14px rgba(168,85,247,0.8)',
                    }}
                />

                YOUR WORKFLOW
            </div>

            {/* Main Title */}
            <h2
                style={{
                    margin: 0,
                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',
                    fontSize:
                        'clamp(3.5rem, 8vw, 7.5rem)',
                    fontWeight: 500,
                    lineHeight: 0.95,
                    letterSpacing: '-0.065em',
                    color: '#FFFFFF',
                    textAlign: 'center',
                }}
            >
                Built for the way
                <br />
                <span
                    style={{
                        background:
                            'linear-gradient(135deg, #FFFFFF 20%, #E9D5FF 55%, #A855F7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    you create.
                </span>
            </h2>

            <p
                style={{
                    maxWidth: 650,
                    margin:
                        'clamp(1.75rem, 3vw, 2.5rem) auto 0',
                    fontFamily:
                        'Inter, "Helvetica Neue", Arial, sans-serif',
                    fontSize:
                        'clamp(1rem, 1.8vw, 1.2rem)',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.48)',
                    letterSpacing: '-0.015em',
                }}
            >
                From quick edits to complete image workflows,
                everything you need is designed to work together.
            </p>
        </div>

        {/* ====================================================
            FEATURE / WORKFLOW GRID
        ==================================================== */}
        <div
            style={{
                display: 'grid',
                gridTemplateColumns:
                    'repeat(12, minmax(0, 1fr))',
                gap: '1rem',
            }}
        >
            {/* CARD 01 — LARGE */}
            <div
                style={{
                    gridColumn:
                        'span 7',
                    minHeight:
                        'clamp(380px, 42vw, 560px)',
                    padding:
                        'clamp(2rem, 4vw, 3.5rem)',
                    borderRadius: '28px',
                    border:
                        '1px solid rgba(255,255,255,0.09)',
                    background:
                        'linear-gradient(145deg, rgba(168,85,247,0.10), rgba(255,255,255,0.025))',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(168,85,247,0.28)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.09)';
                }}
            >
                {/* Decorative visual */}
                <div
                    style={{
                        position: 'absolute',
                        right: '-80px',
                        bottom: '-120px',
                        width: 380,
                        height: 380,
                        borderRadius: '50%',
                        background:
                            'radial-gradient(circle, rgba(168,85,247,0.20), transparent 68%)',
                        filter: 'blur(20px)',
                    }}
                />

                <div style={{ position: 'relative' }}>
                    <span
                        style={{
                            fontFamily:
                                'Inter, sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color:
                                'rgba(255,255,255,0.35)',
                            letterSpacing: '0.12em',
                        }}
                    >
                        01
                    </span>

                    <h3
                        style={{
                            margin:
                                'clamp(3rem, 6vw, 5rem) 0 1rem',
                            maxWidth: 650,
                            fontFamily:
                                'Inter, "Helvetica Neue", Arial, sans-serif',
                            fontSize:
                                'clamp(2rem, 4vw, 4rem)',
                            fontWeight: 500,
                            lineHeight: 1.02,
                            letterSpacing: '-0.055em',
                            color: '#FFFFFF',
                        }}
                    >
                        Edit without
                        <br />
                        the overhead.
                    </h3>

                    <p
                        style={{
                            maxWidth: 500,
                            margin: 0,
                            fontFamily:
                                'Inter, sans-serif',
                            fontSize:
                                'clamp(1rem, 1.6vw, 1.15rem)',
                            lineHeight: 1.7,
                            color:
                                'rgba(255,255,255,0.48)',
                        }}
                    >
                        Remove backgrounds, extract text,
                        vectorize graphics and convert files
                        without leaving your browser.
                    </p>
                </div>

                {/* Bottom label */}
                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        color:
                            'rgba(255,255,255,0.5)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                    }}
                >
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#A855F7',
                            boxShadow:
                                '0 0 15px rgba(168,85,247,0.7)',
                        }}
                    />
                    Everything happens locally
                </div>
            </div>

            {/* CARD 02 */}
            <div
                style={{
                    gridColumn:
                        'span 5',
                    minHeight:
                        'clamp(380px, 42vw, 560px)',
                    padding:
                        'clamp(2rem, 4vw, 3.5rem)',
                    borderRadius: '28px',
                    border:
                        '1px solid rgba(255,255,255,0.09)',
                    background:
                        'rgba(255,255,255,0.025)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(99,102,241,0.30)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.09)';
                }}
            >
                <div>
                    <span
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color:
                                'rgba(255,255,255,0.35)',
                            letterSpacing: '0.12em',
                        }}
                    >
                        02
                    </span>

                    <div
                        style={{
                            width: 64,
                            height: 64,
                            marginTop: 'clamp(3rem, 6vw, 5rem)',
                            marginBottom: '2rem',
                            borderRadius: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border:
                                '1px solid rgba(168,85,247,0.18)',
                            background:
                                'rgba(168,85,247,0.08)',
                            fontSize: '1.7rem',
                        }}
                    >
                        ✦
                    </div>

                    <h3
                        style={{
                            margin: 0,
                            fontFamily:
                                'Inter, sans-serif',
                            fontSize:
                                'clamp(1.8rem, 3vw, 3rem)',
                            fontWeight: 500,
                            lineHeight: 1.05,
                            letterSpacing: '-0.05em',
                            color: '#FFFFFF',
                        }}
                    >
                        AI where
                        <br />
                        it matters.
                    </h3>
                </div>

                <p
                    style={{
                        margin: 0,
                        fontSize:
                            'clamp(0.95rem, 1.5vw, 1.05rem)',
                        lineHeight: 1.7,
                        color:
                            'rgba(255,255,255,0.45)',
                    }}
                >
                    Intelligent processing without
                    complicated workflows or unnecessary
                    setup.
                </p>
            </div>

            {/* CARD 03 */}
            <div
                style={{
                    gridColumn:
                        'span 5',
                    minHeight: 340,
                    padding:
                        'clamp(2rem, 4vw, 3rem)',
                    borderRadius: '28px',
                    border:
                        '1px solid rgba(255,255,255,0.09)',
                    background:
                        'rgba(255,255,255,0.025)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.20)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.09)';
                }}
            >
                <span
                    style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color:
                            'rgba(255,255,255,0.35)',
                        letterSpacing: '0.12em',
                    }}
                >
                    03
                </span>

                <div>
                    <h3
                        style={{
                            margin: '0 0 1rem',
                            fontFamily:
                                'Inter, sans-serif',
                            fontSize:
                                'clamp(1.8rem, 3vw, 2.8rem)',
                            fontWeight: 500,
                            lineHeight: 1.05,
                            letterSpacing: '-0.05em',
                            color: '#FFFFFF',
                        }}
                    >
                        Private
                        <br />
                        by design.
                    </h3>

                    <p
                        style={{
                            margin: 0,
                            maxWidth: 430,
                            fontSize:
                                'clamp(0.95rem, 1.5vw, 1.05rem)',
                            lineHeight: 1.7,
                            color:
                                'rgba(255,255,255,0.45)',
                        }}
                    >
                        Your images stay on your device.
                        No unnecessary uploads. No account
                        required.
                    </p>
                </div>
            </div>

            {/* CARD 04 — WIDE */}
            <div
                style={{
                    gridColumn:
                        'span 7',
                    minHeight: 340,
                    padding:
                        'clamp(2rem, 4vw, 3rem)',
                    borderRadius: '28px',
                    border:
                        '1px solid rgba(255,255,255,0.09)',
                    background:
                        'linear-gradient(135deg, rgba(99,102,241,0.07), rgba(255,255,255,0.025))',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: '2rem',
                    transition:
                        'transform 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-6px)';
                    e.currentTarget.style.borderColor =
                        'rgba(99,102,241,0.28)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0)';
                    e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.09)';
                }}
            >
                <div>
                    <span
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color:
                                'rgba(255,255,255,0.35)',
                            letterSpacing: '0.12em',
                        }}
                    >
                        04
                    </span>

                    <h3
                        style={{
                            margin:
                                '2.5rem 0 0.8rem',
                            fontFamily:
                                'Inter, sans-serif',
                            fontSize:
                                'clamp(1.8rem, 3.5vw, 3.4rem)',
                            fontWeight: 500,
                            lineHeight: 1.05,
                            letterSpacing: '-0.055em',
                            color: '#FFFFFF',
                        }}
                    >
                        One workspace.
                        <br />
                        Endless possibilities.
                    </h3>
                </div>

                <div
                    style={{
                        flexShrink: 0,
                        width: 110,
                        height: 110,
                        borderRadius: '50%',
                        border:
                            '1px solid rgba(255,255,255,0.10)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                            'radial-gradient(circle, rgba(168,85,247,0.16), rgba(168,85,247,0.02) 65%)',
                        boxShadow:
                            '0 0 60px rgba(168,85,247,0.12)',
                    }}
                >
                    <span
                        style={{
                            fontSize: '2rem',
                            color: '#C084FC',
                        }}
                    >
                        ∞
                    </span>
                </div>
            </div>
        </div>

        {/* Bottom statement */}
        <div
            style={{
                marginTop: 'clamp(4rem, 8vw, 7rem)',
                textAlign: 'center',
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontFamily:
                        'Inter, sans-serif',
                    fontSize:
                        'clamp(1rem, 2vw, 1.25rem)',
                    color:
                        'rgba(255,255,255,0.35)',
                    letterSpacing: '-0.015em',
                }}
            >
                Simple tools. Serious results.
            </p>
        </div>
    </div>

    {/* Responsive behavior */}
    <style>
        {`
            @media (max-width: 900px) {
                #workflow [style*="grid-column"] {
                    grid-column: span 12 !important;
                }
            }

            @media (max-width: 600px) {
                #workflow {
                    padding-left: 1rem !important;
                    padding-right: 1rem !important;
                }
            }
        `}
    </style>
</section>

            {/* ───── PRICING ───── */}
          
<section
    id="pricing"
    style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '7rem 1.5rem',
        textAlign: 'center',
    }}
>
    {/* SECTION HEADER */}
    <div
        style={{
            maxWidth: '760px',
            margin: '0 auto 3.5rem',
        }}
    >
        {/* Eyebrow */}
        

        {/* Main Title */}
   <div
    style={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        marginBottom: '2rem',
    }}
>
    <h2
        style={{
            margin: 0,
            width: '100%',
            fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
            fontSize: 'clamp(3.5rem, 7.5vw, 8rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.065em',
            fontWeight: 500,
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            textAlign: 'center',
        }}
    >
        Everything You Need.
    </h2>
</div>

        {/* Description */}
        <p
            style={{
                maxWidth: '600px',
                margin: '1.5rem auto 0',
                color: 'rgba(255,255,255,0.48)',
                fontFamily:
                    'Inter, system-ui, -apple-system, sans-serif',
                fontSize: '1rem',
                lineHeight: 1.7,
                letterSpacing: '-0.01em',
            }}
        >
            A complete toolkit for working with images.
            Fast, intelligent and designed with privacy at its core.
        </p>
    </div>

    {/* PRICING CARD */}
    <div
        style={{
            position: 'relative',
            maxWidth: '520px',
            margin: '0 auto',
            padding: '2.75rem',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.10)',
            background: `
                radial-gradient(
                    120% 80% at 50% 0%,
                    rgba(168,85,247,0.14) 0%,
                    rgba(99,102,241,0.06) 45%,
                    rgba(10,10,18,0.92) 100%
                )
            `,
            boxShadow: `
                0 24px 80px rgba(0,0,0,0.35),
                inset 0 1px 0 rgba(255,255,255,0.07)
            `,
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            textAlign: 'left',
        }}
    >
        {/* Ambient Glow */}
        <div
            style={{
                position: 'absolute',
                top: '-180px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '420px',
                height: '420px',
                borderRadius: '50%',
                background: 'rgba(168,85,247,0.10)',
                filter: 'blur(100px)',
                pointerEvents: 'none',
            }}
        />

        {/* Badge */}
        <div
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.7rem',
                marginBottom: '1.5rem',
                borderRadius: '999px',
                border: '1px solid rgba(168,85,247,0.22)',
                background: 'rgba(168,85,247,0.07)',
                color: '#D8B4FE',
                fontFamily:
                    'Inter, system-ui, sans-serif',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
            }}
        >
            <span
                style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#A855F7',
                    boxShadow:
                        '0 0 10px rgba(168,85,247,0.8)',
                }}
            />
            Free forever
        </div>

        {/* Price */}
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.7rem',
                }}
            >
                <span
                    style={{
                        fontFamily:
                            '"Clash Display", Inter, sans-serif',
                        fontSize: '4.5rem',
                        lineHeight: 1,
                        fontWeight: 700,
                        letterSpacing: '-0.075em',
                        background:
                            'linear-gradient(135deg, #FFFFFF 15%, #E9D5FF 55%, #A855F7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    $0
                </span>

                <span
                    style={{
                        color: 'rgba(255,255,255,0.35)',
                        fontFamily:
                            'Inter, system-ui, sans-serif',
                        fontSize: '0.85rem',
                    }}
                >
                    forever
                </span>
            </div>

            <p
                style={{
                    margin: '0.85rem 0 0',
                    color: 'rgba(255,255,255,0.52)',
                    fontFamily:
                        'Inter, system-ui, sans-serif',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                }}
            >
                Powerful image tools without subscriptions,
                accounts or unnecessary complexity.
            </p>
        </div>

        {/* Divider */}
        <div
            style={{
                height: '1px',
                margin: '2rem 0 1.5rem',
                background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
            }}
        />

        {/* Features */}
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.15rem',
                marginBottom: '2rem',
            }}
        >
            {[
                ['Background removal', 'Local AI'],
                ['SVG vectorization', 'Unlimited'],
                ['OCR text extraction', 'Tesseract.js'],
                ['Image to PDF', 'Instant'],
                ['AI image tools', '5 Hugging Face models'],
                ['Privacy first', 'No uploads · No account'],
            ].map(([title, detail]) => (
                <div
                    key={title}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        padding: '0.85rem 0.65rem',
                        borderRadius: '10px',
                        transition:
                            'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            'rgba(255,255,255,0.035)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                            'transparent';
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.7rem',
                        }}
                    >
                        <span
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background:
                                    'rgba(168,85,247,0.10)',
                                color: '#C084FC',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                            }}
                        >
                            ✓
                        </span>

                        <span
                            style={{
                                color:
                                    'rgba(255,255,255,0.82)',
                                fontFamily:
                                    'Inter, system-ui, sans-serif',
                                fontSize: '0.84rem',
                                fontWeight: 550,
                            }}
                        >
                            {title}
                        </span>
                    </div>

                    <span
                        style={{
                            color:
                                'rgba(255,255,255,0.30)',
                            fontFamily:
                                'Inter, system-ui, sans-serif',
                            fontSize: '0.7rem',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {detail}
                    </span>
                </div>
            ))}
        </div>

        {/* CTA */}
        <button
    onClick={() => navigate('/app')}
    style={{
        width: '100%',
        height: '56px',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.55rem',

        border: '1px solid rgba(255,255,255,0.9)',
        borderRadius: '999px',

        background: '#FFFFFF',
        color: '#111111',

        fontFamily:
            'Inter, "Helvetica Neue", Arial, sans-serif',
        fontSize: '0.92rem',
        fontWeight: 650,
        letterSpacing: '-0.01em',

        cursor: 'pointer',

        boxShadow:
            '0 2px 5px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.16)',

        transition:
            'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.transform =
            'translateY(-2px)';
        e.currentTarget.style.background =
            '#F7F5FF';
        e.currentTarget.style.boxShadow =
            '0 4px 10px rgba(0,0,0,0.12), 0 14px 38px rgba(168,85,247,0.18)';
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.transform =
            'translateY(0)';
        e.currentTarget.style.background =
            '#FFFFFF';
        e.currentTarget.style.boxShadow =
            '0 2px 5px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.16)';
    }}
>
    Get started for free

    <span
        style={{
            fontSize: '1.05rem',
            lineHeight: 1,
            marginLeft: '0.1rem',
        }}
    >
        →
    </span>
</button>

        {/* Trust */}
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                color: 'rgba(255,255,255,0.27)',
                fontFamily:
                    'Inter, system-ui, sans-serif',
                fontSize: '0.67rem',
            }}
        >
            <span>Private by default</span>
            <span>·</span>
            <span>No signup</span>
            <span>·</span>
            <span>No credit card</span>
        </div>
    </div>
</section>



            {/* ───── FINAL CTA ───── */}
            <section style={{ padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                   <h2 style={{ 
                fontSize: 'clamp(4rem, 14vw, 8.5rem)', 
                fontWeight: 400, 
                letterSpacing: '-0.04em', 
                marginBottom: 'clamp(2rem, 4vw, 3rem)',
                lineHeight: 1.15,
                color: '#ffffff',
                maxWidth: 1200,
                margin: '0 auto clamp(2rem, 4vw, 3rem)',
            }}>
                        Ready to transform your images?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '1.05rem' }}>Join thousands of creators using Lumora — completely free.</p>
                    <button
    onClick={() => navigate('/app')}
    style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',

        padding: '0.95rem 1.8rem',
        minHeight: '54px',

        borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.85)',

        background: '#FFFFFF',
        color: '#111118',

        fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
        fontSize: '0.95rem',
        fontWeight: 650,
        letterSpacing: '-0.01em',

        cursor: 'pointer',

        boxShadow:
            '0 1px 2px rgba(0,0,0,0.15), 0 8px 30px rgba(0,0,0,0.18)',

        transition:
            'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.background = '#F5F3FF';
        e.currentTarget.style.boxShadow =
            '0 4px 12px rgba(0,0,0,0.16), 0 12px 40px rgba(168,85,247,0.18)';
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = '#FFFFFF';
        e.currentTarget.style.boxShadow =
            '0 1px 2px rgba(0,0,0,0.15), 0 8px 30px rgba(0,0,0,0.18)';
    }}
>
    <span style={{ fontSize: '1rem' }}>✦</span>
    Launch Lumora
    <span
        style={{
            fontSize: '1.1rem',
            lineHeight: 1,
            marginLeft: '0.1rem',
        }}
    >
        →
    </span>
</button>
                </div>
            </section>

            {/* ───── FOOTER ───── */}
            <footer style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
            }}>
                <div
    style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
    }}
>
    {/* Lumora Logo */}
    <div
        style={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}
    >
        <svg
            width="28"
            height="28"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient
                    id="lumoraSmallGradient"
                    x1="4"
                    y1="4"
                    x2="32"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#C084FC" />
                    <stop offset="0.5" stopColor="#A855F7" />
                    <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
            </defs>

            {/* Main mark */}
            <path
                d="M18 3.5
                   C9.99 3.5 3.5 9.99 3.5 18
                   C3.5 26.01 9.99 32.5 18 32.5
                   C26.01 32.5 32.5 26.01 32.5 18
                   C32.5 9.99 26.01 3.5 18 3.5Z"
                fill="url(#lumoraSmallGradient)"
            />

            {/* L */}
            <path
                d="M12 10.5V22.5C12 24.43 13.57 26 15.5 26H24"
                stroke="white"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Spark */}
            <path
                d="M24.5 10L25.15 11.85L27 12.5L25.15 13.15L24.5 15L23.85 13.15L22 12.5L23.85 11.85L24.5 10Z"
                fill="white"
            />
        </svg>
    </div>

    {/* Brand name */}
    <span
        style={{
            fontFamily:
                'Inter, "Helvetica Neue", Arial, sans-serif',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '-0.035em',
            color: 'rgba(255,255,255,0.88)',
        }}
    >
        Lumora
    </span>
</div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>© 2026 Lumora. All processing runs locally in your browser.</span>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {['Privacy', 'GitHub', 'License'].map(l => (
                        <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#A855F7')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                        >{l}</a>
                    ))}
                </div>
            </footer>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.3; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        /* ========================================
           RESPONSIVE — TABLET (max-width: 1100px)
           ======================================== */
        @media (max-width: 1100px) {
          /* Privacy panel: stack to 1 column */
          #privacy > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          #privacy > div > div:nth-child(2) > div:first-child {
            min-height: 380px !important;
          }

          /* Workflow header: stack */
          #workflow > div > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }

          /* Use cases grid: single column */
          #use-cases > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          #use-cases > div > div:nth-child(2) > div {
            min-height: 340px !important;
          }
        }

        /* ========================================
           RESPONSIVE — SMALL TABLET (max-width: 900px)
           ======================================== */
        @media (max-width: 900px) {
          /* Workflow grids: full-width cards */
          #workflow div[style*="grid-template-columns: repeat(12"] > div {
            grid-column: span 12 !important;
          }
        }

        /* ========================================
           RESPONSIVE — MOBILE (max-width: 768px)
           ======================================== */
        @media (max-width: 768px) {
          /* ---- NAVBAR ---- */
          nav {
            padding: 0 1rem !important;
            height: 60px !important;
          }
          .nav-links {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }

          /* ---- HERO ---- */
          h1 {
            white-space: normal !important;
            font-size: clamp(2.6rem, 11vw, 4.8rem) !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .hero-scroll-indicator {
            bottom: 1.2rem !important;
            transform: translateX(-50%) scale(0.9) !important;
          }

          /* ---- STATS GRID ---- */
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem 0 !important;
          }

          /* ---- PRIVACY SECTION ---- */
          #privacy h2,
          #privacy h2 + div {
            white-space: normal !important;
            font-size: clamp(2.5rem, 10vw, 5rem) !important;
          }

          /* ---- HOW IT WORKS TITLE ---- */
          #how-it-works h2 {
            white-space: normal !important;
            font-size: clamp(3rem, 12vw, 5rem) !important;
          }

          /* ---- PRICING TITLE ---- */
          section > div > div > h2[style*="white-space: nowrap"],
          section > div > div > div > h2[style*="white-space: nowrap"],
          div[style*="width: 100vw"] h2 {
            white-space: normal !important;
            font-size: clamp(2.5rem, 9vw, 4.5rem) !important;
          }

          /* ---- FOOTER ---- */
          footer {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 1.5rem !important;
          }
        }

        /* ========================================
           RESPONSIVE — SMALL MOBILE (max-width: 480px)
           ======================================== */
        @media (max-width: 480px) {
          /* Tighter padding for nav */
          nav {
            padding: 0 0.85rem !important;
            height: 58px !important;
          }

          /* Hero title even smaller */
          h1 {
            font-size: clamp(2.1rem, 9.5vw, 3.2rem) !important;
            line-height: 0.95 !important;
          }

          .hero-scroll-indicator {
            bottom: 0.75rem !important;
            transform: translateX(-50%) scale(0.82) !important;
          }

          /* Stats: stack fully */
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr 1fr !important;
          }

          /* All section padding tighter */
          section {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          /* Pricing card padding */
          section > div[style*="max-width: 520px"] {
            padding: 1.75rem !important;
          }

          /* Feature cards: smaller min-height */
          #features > div > div:nth-child(2) > div {
            min-height: 300px !important;
          }

          /* Final CTA h2 */
          section > div > h2,
          section > div > div > h2 {
            font-size: clamp(2rem, 8vw, 3.5rem) !important;
            white-space: normal !important;
          }
        }

        /* Short screens (e.g. landscape or small laptops) */
        @media (max-height: 750px) {
          .hero-scroll-indicator {
            bottom: 0.5rem !important;
            transform: translateX(-50%) scale(0.8) !important;
          }
        }
      `}</style>
        </div>
    );
};

export default LandingPage;
