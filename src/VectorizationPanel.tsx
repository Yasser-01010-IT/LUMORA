import React, { useState, useEffect, useCallback, useRef } from 'react';
import ImageTracer, { ImageTracerOptions } from 'imagetracerjs';
import { Download, Copy, Check, Sliders, Layers, Code2, RefreshCw, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

interface VectorizationPanelProps {
    imageSrc: string | null;
    fileName: string;
}

type PresetKey = 'default' | 'detailed' | 'posterized1' | 'grayscale' | 'curvy' | 'sharp';

const SAMPLE_VECTOR_IMAGES = [
    {
        name: 'Logo Icone (Démo)',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    },
    {
        name: 'Illustration Art (Démo)',
        url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80',
    },
];

export const VectorizationPanel: React.FC<VectorizationPanelProps> = ({ imageSrc: propImageSrc, fileName: propFileName }) => {
    const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
    const [customFileName, setCustomFileName] = useState<string>('vector-source');
    const [svgOutput, setSvgOutput] = useState<string>('');
    const [isVectorizing, setIsVectorizing] = useState<boolean>(false);
    const [preset, setPreset] = useState<PresetKey>('default');
    const [numberOfColors, setNumberOfColors] = useState<number>(16);
    const [blurRadius, setBlurRadius] = useState<number>(0);
    const [showCode, setShowCode] = useState<boolean>(false);
    const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
    const [svgStats, setSvgStats] = useState({ pathCount: 0, size: '0 KB' });
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentImageSrc = customImageSrc || propImageSrc || SAMPLE_VECTOR_IMAGES[0].url;
    const currentFileName = customFileName !== 'vector-source' ? customFileName : propFileName || 'image';

    const handleDirectFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setCustomFileName(baseName);
        const reader = new FileReader();
        reader.onload = (e) => {
            setCustomImageSrc(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const vectorize = useCallback(async () => {
        if (!currentImageSrc) return;
        setIsVectorizing(true);
        setError(null);
        setSvgOutput('');

        try {
            // Step 1: Get a CORS-safe image source
            // For data: URLs (user uploads) we can use them directly.
            // For external http(s) URLs, fetch as blob to avoid canvas tainting.
            let safeSrc = currentImageSrc;

            if (currentImageSrc.startsWith('http')) {
                try {
                    const response = await fetch(currentImageSrc);
                    const blob = await response.blob();
                    safeSrc = URL.createObjectURL(blob);
                } catch {
                    // If fetch fails, try direct load as fallback
                    safeSrc = currentImageSrc;
                }
            }

            // Step 2: Load image from safe source
            const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = 'anonymous';
                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error('Image load failed'));
                image.src = safeSrc;
            });

            // Step 3: Draw to offscreen canvas and extract ImageData
            const canvas = document.createElement('canvas');
            const maxDimension = 800;
            let scale = 1;
            if (img.width > maxDimension || img.height > maxDimension) {
                scale = Math.min(maxDimension / img.width, maxDimension / img.height);
            }

            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Canvas 2D context unavailable');
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Revoke blob URL if we created one
            if (safeSrc !== currentImageSrc && safeSrc.startsWith('blob:')) {
                URL.revokeObjectURL(safeSrc);
            }

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Step 4: Setup ImageTracer options using library-compatible values
            // IMPORTANT: Do NOT pass `pal: []` — it crashes the tracer.
            // Let ImageTracer auto-generate the palette via colorsampling.
            const options: ImageTracerOptions = {
                colorsampling: 2,
                numberofcolors: numberOfColors,
                blurradius: blurRadius,
                mincolorratio: 0,
                colorquantcycles: 3,
                scale: 1,
                pathomit: 8,
                ltres: 1,
                qtres: 1,
                rightangleenhance: true,
                layering: 0,
                strokewidth: 1,
                roundcoords: 1,
            };

            if (preset === 'detailed') {
                options.numberofcolors = Math.max(numberOfColors, 64);
                options.blurradius = 0;
                options.ltres = 0.5;
                options.qtres = 0.5;
                options.pathomit = 0;
                options.roundcoords = 2;
            } else if (preset === 'posterized1') {
                options.numberofcolors = Math.min(numberOfColors, 4);
                options.blurradius = 5;
                options.colorsampling = 0;
                options.pathomit = 8;
            } else if (preset === 'grayscale') {
                options.numberofcolors = Math.min(numberOfColors, 7);
                options.colorsampling = 0;
                options.colorquantcycles = 1;
                options.blurradius = 0;
            } else if (preset === 'curvy') {
                options.ltres = 0.01;
                options.linefilter = true;
                options.rightangleenhance = false;
            } else if (preset === 'sharp') {
                options.qtres = 0.01;
                options.linefilter = false;
                options.pathomit = 2;
            }

            // Step 5: Run ImageTracer synchronously on extracted ImageData
            const svgstr = ImageTracer.imagedataToSVG(imageData, options);
            setSvgOutput(svgstr);

            const paths = (svgstr.match(/<path/g) || []).length;
            const sizeInKb = (svgstr.length / 1024).toFixed(1);
            setSvgStats({
                pathCount: paths,
                size: `${sizeInKb} KB`,
            });
        } catch (err: any) {
            console.error('Vectorization Error:', err);
            setError(`Erreur de vectorisation : ${err?.message || 'Inconnue'}. Essayez d'importer une image directement.`);
        } finally {
            setIsVectorizing(false);
        }
    }, [currentImageSrc, preset, numberOfColors, blurRadius]);

    useEffect(() => {
        if (currentImageSrc) {
            vectorize();
        }
    }, [currentImageSrc, preset, vectorize]);

    const downloadSvg = () => {
        if (!svgOutput) return;
        const blob = new Blob([svgStrWithXml(svgOutput)], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentFileName}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const copyCode = () => {
        if (!svgOutput) return;
        navigator.clipboard.writeText(svgStrWithXml(svgOutput));
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 2500);
    };

    const svgStrWithXml = (str: string) => {
        if (str.startsWith('<?xml')) return str;
        return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n${str}`;
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Header Info */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '1.25rem', background: '#12121A',
                padding: '0.85rem 1.25rem', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '0.75rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={18} style={{ color: '#818CF8' }} />
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                        Vectorisation SVG 100% Fonctionnelle : <strong style={{ color: '#fff' }}>{currentFileName}</strong>
                    </span>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem',
                        border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)',
                        color: '#818CF8', cursor: 'pointer', fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s',
                    }}
                >
                    <Upload size={14} /> Importer une Image
                </button>
            </div>

            {/* Config options */}
            <div style={{
                background: '#12121A', borderRadius: '16px',
                padding: '1.25rem', marginBottom: '1.5rem',
                border: '1px solid rgba(255,255,255,0.08)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Sliders size={16} style={{ color: '#818CF8' }} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                        Contrôles & Algorithmes de Vectorisation SVG
                    </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'rgba(255,255,255,0.6)' }}>
                            Style de Tracé :
                        </label>
                        <select
                            value={preset}
                            onChange={(e) => setPreset(e.target.value as PresetKey)}
                            style={{
                                width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.12)', background: '#0B0B0F',
                                color: '#fff', fontSize: '0.85rem', outline: 'none', cursor: 'pointer',
                            }}
                        >
                            <option value="detailed">Haute Précision (Couleurs Détaillées)</option>
                            <option value="default">Équilibré (Vectoriel Standard)</option>
                            <option value="posterized1">Pop Art / Poster (Formes simplifiées)</option>
                            <option value="grayscale">Silhouette Contraste (B&W)</option>
                            <option value="curvy">Formes Courbes / Organiques</option>
                            <option value="sharp">Angles Polygones Net</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'rgba(255,255,255,0.6)' }}>
                            <span>Couleurs Max :</span>
                            <span style={{ color: '#818CF8' }}>{numberOfColors}</span>
                        </label>
                        <input
                            type="range"
                            min="2"
                            max="64"
                            value={numberOfColors}
                            onChange={(e) => setNumberOfColors(parseInt(e.target.value, 10))}
                            style={{ width: '100%', accentColor: '#818CF8', cursor: 'pointer' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'rgba(255,255,255,0.6)' }}>
                            <span>Adoucissement (Blur) :</span>
                            <span style={{ color: '#818CF8' }}>{blurRadius} px</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="1"
                            value={blurRadius}
                            onChange={(e) => setBlurRadius(parseInt(e.target.value, 10))}
                            style={{ width: '100%', accentColor: '#818CF8', cursor: 'pointer' }}
                        />
                    </div>

                    <div>
                        <button
                            onClick={vectorize}
                            disabled={isVectorizing}
                            style={{
                                width: '100%', padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none',
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: '#fff',
                                fontWeight: 700, fontSize: '0.85rem', cursor: isVectorizing ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                transition: 'all 0.2s',
                            }}
                        >
                            <RefreshCw size={15} style={{ animation: isVectorizing ? 'spin 1.2s linear infinite' : 'none' }} />
                            {isVectorizing ? 'Vectorisation...' : 'Regénérer SVG'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '0.85rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                    {error}
                </div>
            )}

            {/* SVG Preview Card */}
            <div style={{
                background: '#12121A', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden',
                marginBottom: '1.5rem',
            }}>
                <div style={{
                    padding: '0.75rem 1.25rem', background: '#0B0B0F',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '0.5rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Layers size={13} /> Trajets Vectoriels SVG: <strong style={{ color: '#fff' }}>{svgStats.pathCount}</strong>
                        </span>
                        <span>•</span>
                        <span>Taille Fichier: <strong style={{ color: '#fff' }}>{svgStats.size}</strong></span>
                    </div>

                    <button
                        onClick={() => setShowCode(!showCode)}
                        style={{
                            padding: '0.35rem 0.65rem', borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: showCode ? 'rgba(99,102,241,0.2)' : 'transparent',
                            color: showCode ? '#a5b4fc' : 'rgba(255,255,255,0.6)',
                            fontSize: '0.75rem', fontWeight: 650, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s',
                        }}
                    >
                        <Code2 size={13} /> {showCode ? 'Masquer Code XML' : 'Afficher Code SVG'}
                    </button>
                </div>

                <div className="vec-preview-code-grid" style={{ display: 'grid', gridTemplateColumns: showCode ? '1fr 1fr' : '1fr', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
                    {/* Preview screen */}
                    <div style={{
                        background: '#050509', height: '400px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: '1rem',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {isVectorizing ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 40, height: 40, margin: '0 auto 0.75rem',
                                    borderRadius: '50%', border: '2px solid rgba(99,102,241,0.2)',
                                    borderTopColor: '#818CF8', animation: 'spin 0.8s linear infinite',
                                }} />
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Calcul des courbes mathématiques SVG...</p>
                            </div>
                        ) : svgOutput ? (
                            <div
                                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                dangerouslySetInnerHTML={{ __html: svgOutput }}
                            />
                        ) : (
                            <ImageIcon size={32} style={{ color: 'rgba(255,255,255,0.2)' }} />
                        )}
                    </div>

                    {/* Code Panel */}
                    {showCode && (
                        <div style={{ background: '#050508', height: '400px', display: 'flex', flexDirection: 'column' }}>
                            <textarea
                                readOnly
                                value={svgStrWithXml(svgOutput)}
                                style={{
                                    flex: 1, padding: '0.75rem', background: 'transparent',
                                    color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem',
                                    fontFamily: 'monospace', resize: 'none', border: 'none',
                                    outline: 'none', pointerEvents: isVectorizing ? 'none' : 'auto',
                                }}
                            />
                            <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={copyCode}
                                    style={{
                                        padding: '0.35rem 0.65rem', borderRadius: '4px',
                                        border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)',
                                        color: '#fff', fontSize: '0.72rem', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                                    }}
                                >
                                    {copiedSuccess ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                                    {copiedSuccess ? 'XML Copié !' : 'Copier Code SVG'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Export Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                    onClick={downloadSvg}
                    disabled={!svgOutput || isVectorizing}
                    style={{
                        padding: '0.75rem 2rem', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff',
                        cursor: (svgOutput && !isVectorizing) ? 'pointer' : 'not-allowed',
                        fontWeight: 700, fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)', transition: 'all 0.2s',
                        opacity: (svgOutput && !isVectorizing) ? 1 : 0.4,
                    }}
                >
                    <Download size={15} /> Télécharger Fichier Vectoriel (.svg)
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        handleDirectFile(e.target.files[0]);
                    }
                }}
                style={{ display: 'none' }}
            />
        </div>
    );
};
