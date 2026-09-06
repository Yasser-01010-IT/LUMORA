import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Download, Sliders, Sun, Upload } from 'lucide-react';

interface StudioBackgroundPanelProps {
    imageSrc: string | null;
}

const SAMPLE_STUDIO_IMAGES = [
    {
        name: 'Montre Luxe (Démo)',
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    },
    {
        name: 'Baskets Sport (Démo)',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    },
    {
        name: 'Parfum Flacon (Démo)',
        url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    },
];

const PRESET_BACKDROPS = [
    {
        id: 'marble',
        name: 'Marbre Minimaliste',
        bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        desc: 'Surface en marbre sombre pour e-commerce et cosmétiques',
    },
    {
        id: 'neon',
        name: 'Cyberpunk Néon',
        bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        desc: 'Éclairage néon violet et bleu futuriste',
    },
    {
        id: 'podium',
        name: 'Podium Studio Gold',
        bg: 'linear-gradient(135deg, #1f1c2c 0%, #475569 100%)',
        desc: 'Présentoir avec effets d\'ombres douces',
    },
    {
        id: 'nature',
        name: 'Lumière Botanique Solaire',
        bg: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
        desc: 'Ombres de feuillage naturelles et profondes',
    },
    {
        id: 'dark-luxury',
        name: 'Luxe Obscur',
        bg: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)',
        desc: 'Fond sombre élégant pour bijoux et montres',
    },
];

export const StudioBackgroundPanel: React.FC<StudioBackgroundPanelProps> = ({
    imageSrc: propImageSrc,
}) => {
    const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
    const [selectedBackdrop, setSelectedBackdrop] = useState(PRESET_BACKDROPS[0]);
    const [shadowSoftness, setShadowSoftness] = useState<number>(25);
    const [objectScale, setObjectScale] = useState<number>(70);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Active image source fallback chain: custom uploaded -> prop image -> sample demo image
    const activeSrc = customImageSrc || propImageSrc || SAMPLE_STUDIO_IMAGES[0].url;

    // Draw combined background and product image on canvas
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 1200;
        canvas.height = 800;

        // Function to render background gradient
        const renderBackground = () => {
            if (selectedBackdrop.id === 'marble') {
                const grad = ctx.createLinearGradient(0, 0, 1200, 800);
                grad.addColorStop(0, '#1e293b');
                grad.addColorStop(1, '#0f172a');
                ctx.fillStyle = grad;
            } else if (selectedBackdrop.id === 'neon') {
                const grad = ctx.createLinearGradient(0, 0, 1200, 800);
                grad.addColorStop(0, '#0f172a');
                grad.addColorStop(0.5, '#3b0764');
                grad.addColorStop(1, '#1e1b4b');
                ctx.fillStyle = grad;
            } else if (selectedBackdrop.id === 'podium') {
                const grad = ctx.createLinearGradient(0, 0, 1200, 800);
                grad.addColorStop(0, '#1f1c2c');
                grad.addColorStop(1, '#475569');
                ctx.fillStyle = grad;
            } else if (selectedBackdrop.id === 'nature') {
                const grad = ctx.createLinearGradient(0, 0, 1200, 800);
                grad.addColorStop(0, '#064e3b');
                grad.addColorStop(1, '#022c22');
                ctx.fillStyle = grad;
            } else {
                const grad = ctx.createLinearGradient(0, 0, 1200, 800);
                grad.addColorStop(0, '#09090b');
                grad.addColorStop(1, '#18181b');
                ctx.fillStyle = grad;
            }
            ctx.fillRect(0, 0, 1200, 800);
        };

        // Render base background
        renderBackground();

        if (activeSrc) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                renderBackground(); // Redraw background clear

                const targetWidth = (1200 * objectScale) / 100;
                const aspectRatio = img.height / img.width;
                const targetHeight = targetWidth * aspectRatio;
                const x = (1200 - targetWidth) / 2;
                const y = (800 - targetHeight) / 2;

                ctx.save();
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowBlur = shadowSoftness;
                ctx.shadowOffsetY = shadowSoftness / 1.4;

                ctx.drawImage(img, x, y, targetWidth, targetHeight);
                ctx.restore();
            };
            img.onerror = () => {
                renderBackground();
            };
            img.src = activeSrc;
        }
    }, [activeSrc, selectedBackdrop, shadowSoftness, objectScale]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `ai-studio-${selectedBackdrop.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const handleDirectFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setCustomImageSrc(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Header */}
            <div
                style={{
                    background: '#12121A',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <Sparkles size={20} style={{ color: '#f59e0b' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#F5F5F7' }}>
                            Générateur de Fonds & Éclairage Studio IA
                        </h3>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                        Placez vos produits dans des décors photoréalistes avec ombres portées et éclairage studio réglable.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        padding: '0.55rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(255,255,255,0.12)',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#F5F5F7',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                    }}
                >
                    <Upload size={15} /> Importer votre Image
                </button>
            </div>

            {/* Sample Demos selector */}
            <div style={{ marginBottom: '1.25rem', background: '#12121A', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '0.5rem' }}>
                    Ou essayez avec un produit de démonstration :
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {SAMPLE_STUDIO_IMAGES.map((sample, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setCustomImageSrc(sample.url)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.4rem 0.75rem',
                                borderRadius: '0.5rem',
                                border: customImageSrc === sample.url ? '1px solid #8B5CF6' : '1px solid rgba(255,255,255,0.12)',
                                background: '#0B0B0F',
                                color: '#F5F5F7',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}
                        >
                            <img src={sample.url} alt={sample.name} style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'cover' }} />
                            {sample.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Backdrops selector grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {PRESET_BACKDROPS.map((bd) => (
                    <button
                        key={bd.id}
                        type="button"
                        onClick={() => setSelectedBackdrop(bd)}
                        style={{
                            background: bd.bg,
                            borderRadius: '0.75rem',
                            padding: '1rem',
                            border: selectedBackdrop.id === bd.id ? '2px solid #8B5CF6' : '1px solid rgba(255,255,255,0.08)',
                            color: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100px',
                            boxShadow: selectedBackdrop.id === bd.id ? '0 4px 14px rgba(139, 92, 246, 0.4)' : 'none',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                            {bd.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.85, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                            {bd.desc}
                        </span>
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div
                style={{
                    background: '#12121A',
                    borderRadius: '0.75rem',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}
            >
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#F5F5F7' }}>
                        <Sun size={16} style={{ color: '#f59e0b' }} />
                        <span>Adoucissement Ombres : {shadowSoftness}px</span>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={shadowSoftness}
                            onChange={(e) => setShadowSoftness(Number(e.target.value))}
                            style={{ accentColor: '#f59e0b', cursor: 'pointer' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#F5F5F7' }}>
                        <Sliders size={16} style={{ color: '#f59e0b' }} />
                        <span>Taille de l'Objet : {objectScale}%</span>
                        <input
                            type="range"
                            min="30"
                            max="95"
                            value={objectScale}
                            onChange={(e) => setObjectScale(Number(e.target.value))}
                            style={{ accentColor: '#f59e0b', cursor: 'pointer' }}
                        />
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    style={{
                        padding: '0.6rem 1.25rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                    }}
                >
                    <Download size={16} /> Exporter Studio HD
                </button>
            </div>

            {/* Render Canvas Workspace */}
            <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)', background: '#000', display: 'flex', justifyContent: 'center' }}>
                <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
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
