import React, { useState, useRef, useEffect } from 'react';
import { Type, Download, Upload } from 'lucide-react';

interface TextStudioPanelProps {
    imageSrc: string | null;
}

const GOOGLE_FONTS = [
    { name: 'Montserrat (Bold Poster)', family: "'Montserrat', sans-serif", weights: ['400', '700', '900'] },
    { name: 'Bebas Neue (Heavy Impact)', family: "'Bebas Neue', sans-serif", weights: ['400'] },
    { name: 'Cinzel (Luxury Serif)', family: "'Cinzel', serif", weights: ['400', '700'] },
    { name: 'Playfair Display (Editorial)', family: "'Playfair Display', serif", weights: ['400', '700', '900'] },
    { name: 'Outfit (Futuristic Geo)', family: "'Outfit', sans-serif", weights: ['400', '700', '900'] },
    { name: 'Pacifico (Creative Script)', family: "'Pacifico', cursive", weights: ['400'] },
    { name: 'Permanent Marker (Graffiti)', family: "'Permanent Marker', cursive", weights: ['400'] },
    { name: 'Inter (Clean Studio)', family: "'Inter', sans-serif", weights: ['400', '600', '800'] },
];

const PRESET_COLORS = [
    '#ffffff',
    '#000000',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#e11d48',
    '#ffd700',
];

export const TextStudioPanel: React.FC<TextStudioPanelProps> = ({
    imageSrc: propImageSrc,
}) => {
    const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
    const [text, setText] = useState<string>('PIXELMIND CREATIVE');
    const [selectedFont, setSelectedFont] = useState(GOOGLE_FONTS[0]);
    const [fontSize, setFontSize] = useState<number>(64);
    const [fontWeight, setFontWeight] = useState<string>('700');
    const [textColor, setTextColor] = useState<string>('#ffffff');
    const [letterSpacing] = useState<number>(4);
    const [shadowBlur, setShadowBlur] = useState<number>(20);
    const [shadowColor] = useState<string>('#000000');
    const [strokeWidth] = useState<number>(0);
    const [strokeColor] = useState<string>('#000000');

    // Position controls
    const [positionY, setPositionY] = useState<number>(50); // % from top
    const [positionX, setPositionX] = useState<number>(50); // % from left

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeSrc = customImageSrc || propImageSrc || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

    // Inject Google Fonts dynamically
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@400;700&family=Montserrat:wght@400;700;900&family=Outfit:wght@400;700;900&family=Pacifico&family=Permanent+Marker&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }, []);

    // Draw image and text overlay on canvas
    useEffect(() => {
        if (!canvasRef.current || !activeSrc) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            // 1. Draw base image
            ctx.drawImage(img, 0, 0);

            if (!text.trim()) return;

            // 2. Configure font styles
            ctx.save();
            ctx.font = `${fontWeight} ${fontSize * (img.width / 1000)}px ${selectedFont.family}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const xPos = (img.width * positionX) / 100;
            const yPos = (img.height * positionY) / 100;

            // 3. Configure shadow / glow
            if (shadowBlur > 0) {
                ctx.shadowColor = shadowColor;
                ctx.shadowBlur = shadowBlur * (img.width / 1000);
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4 * (img.width / 1000);
            }

            // 4. Draw stroke outline if specified
            if (strokeWidth > 0) {
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = strokeWidth * (img.width / 1000);
                ctx.strokeText(text, xPos, yPos);
            }

            // 5. Fill main text
            ctx.fillStyle = textColor;
            ctx.fillText(text, xPos, yPos);
            ctx.restore();
        };
        img.src = activeSrc;
    }, [activeSrc, text, selectedFont, fontSize, fontWeight, textColor, letterSpacing, shadowBlur, shadowColor, strokeWidth, strokeColor, positionX, positionY]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'photoshop-text-design.png';
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
                        <Type size={20} style={{ color: '#8B5CF6' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#F5F5F7' }}>
                            Studio Typographie & Text Overlay (Qualité Photoshop)
                        </h3>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                        Ajoutez du texte, titres et filigranes sur vos images avec les plus belles polices Google Fonts et des effets d'ombrage.
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
                    <Upload size={15} /> Importer une Image
                </button>
            </div>

            {/* Controls Panel */}
            <div
                style={{
                    background: '#12121A',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                }}
            >
                {/* Text input */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '0.35rem' }}>
                        Saisir le Texte :
                    </label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Entrez votre texte ici..."
                        style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: '#0B0B0F',
                            color: '#F5F5F7',
                            fontSize: '1rem',
                            fontWeight: 600,
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Grid controls */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                    {/* Font Selector */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '0.35rem' }}>
                            Police Photoshop / Style :
                        </label>
                        <select
                            value={selectedFont.name}
                            onChange={(e) => {
                                const found = GOOGLE_FONTS.find((f) => f.name === e.target.value);
                                if (found) setSelectedFont(found);
                            }}
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: '#0B0B0F',
                                color: '#F5F5F7',
                                fontSize: '0.875rem',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {GOOGLE_FONTS.map((font) => (
                                <option key={font.name} value={font.name}>
                                    {font.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Font Size & Weight */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '0.35rem' }}>
                                Taille : {fontSize}px
                            </label>
                            <input
                                type="range"
                                min="20"
                                max="160"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#8B5CF6', cursor: 'pointer' }}
                            />
                        </div>

                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '0.35rem' }}>
                                Graisse : {fontWeight}
                            </label>
                            <select
                                value={fontWeight}
                                onChange={(e) => setFontWeight(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 0.5rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    background: '#0B0B0F',
                                    color: '#F5F5F7',
                                    fontSize: '0.85rem',
                                }}
                            >
                                <option value="400">Regular 400</option>
                                <option value="700">Bold 700</option>
                                <option value="900">Black 900</option>
                            </select>
                        </div>
                    </div>

                    {/* Color Swatches */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '0.35rem' }}>
                            Couleur du Texte :
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                style={{ width: '36px', height: '36px', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', background: 'transparent' }}
                            />
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                {PRESET_COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setTextColor(c)}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: c,
                                            border: textColor === c ? '2px solid #8B5CF6' : '1px solid rgba(255,255,255,0.2)',
                                            cursor: 'pointer',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Position & Shadow Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '0.35rem' }}>
                            Position Hauteur (Y) : {positionY}%
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="90"
                            value={positionY}
                            onChange={(e) => setPositionY(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#8B5CF6', cursor: 'pointer' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '0.35rem' }}>
                            Position Horizontale (X) : {positionX}%
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="90"
                            value={positionX}
                            onChange={(e) => setPositionX(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#8B5CF6', cursor: 'pointer' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '0.35rem' }}>
                            Ombre & Flou (Glow) : {shadowBlur}px
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={shadowBlur}
                            onChange={(e) => setShadowBlur(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#8B5CF6', cursor: 'pointer' }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                        onClick={handleDownload}
                        style={{
                            padding: '0.65rem 1.5rem',
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
                        <Download size={16} /> Exporter Image avec Texte HD
                    </button>
                </div>
            </div>

            {/* Canvas Output Display */}
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
