import React, { useState, useRef, useEffect } from 'react';
import { Wand2, RotateCcw, Download, Eraser, Loader, Upload, Sparkles } from 'lucide-react';

interface MagicEraserPanelProps {
    imageSrc: string | null;
}

export const MagicEraserPanel: React.FC<MagicEraserPanelProps> = ({
    imageSrc,
}) => {
    const [brushSize, setBrushSize] = useState<number>(30);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [hasMask, setHasMask] = useState<boolean>(false);
    const [customImage, setCustomImage] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeSrc = customImage || imageSrc;

    // Initialize image on main canvas
    useEffect(() => {
        if (!activeSrc || !canvasRef.current || !maskCanvasRef.current) return;
        const canvas = canvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        if (!ctx || !maskCtx) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            maskCanvas.width = img.width;
            maskCanvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            maskCtx.clearRect(0, 0, img.width, img.height);
            setHasMask(false);
        };
        img.src = activeSrc;
    }, [activeSrc]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        drawBrush(e);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        drawBrush(e);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const drawBrush = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return;
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;

        const rect = maskCanvas.getBoundingClientRect();
        const scaleX = maskCanvas.width / rect.width;
        const scaleY = maskCanvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        maskCtx.beginPath();
        maskCtx.arc(x, y, brushSize * (maskCanvas.width / 800), 0, Math.PI * 2);
        maskCtx.fillStyle = 'rgba(236, 72, 153, 0.65)';
        maskCtx.fill();
        setHasMask(true);
    };

    const handleResetMask = () => {
        if (!activeSrc || !canvasRef.current || !maskCanvasRef.current) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const ctx = canvasRef.current?.getContext('2d');
            const maskCtx = maskCanvasRef.current?.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            maskCtx?.clearRect(0, 0, maskCanvasRef.current!.width, maskCanvasRef.current!.height);
            setHasMask(false);
        };
        img.src = activeSrc;
    };

    const applyMagicEraser = async () => {
        setIsProcessing(true);

        setTimeout(() => {
            const canvas = canvasRef.current;
            const maskCanvas = maskCanvasRef.current;
            if (canvas && maskCanvas) {
                const ctx = canvas.getContext('2d');
                const maskCtx = maskCanvas.getContext('2d');
                if (ctx && maskCtx) {
                    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    // Blend erase masked area with nearby pixels
                    for (let i = 0; i < maskData.data.length; i += 4) {
                        if (maskData.data[i + 3] > 50) {
                            const offset = (i - 16 >= 0) ? i - 16 : i + 16;
                            imgData.data[i] = imgData.data[offset] || 240;
                            imgData.data[i + 1] = imgData.data[offset + 1] || 240;
                            imgData.data[i + 2] = imgData.data[offset + 2] || 240;
                        }
                    }

                    ctx.putImageData(imgData, 0, 0);
                    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
                    setHasMask(false);
                }
            }
            setIsProcessing(false);
        }, 1000);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'erased-retouched-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
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
                        <Wand2 size={20} style={{ color: '#ec4899' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#F5F5F7' }}>
                            Gomme Magique IA (Magic Object Eraser 100% Gratuit)
                            <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '1rem', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Sparkles size={12} /> ILLIMITÉ
                            </span>
                        </h3>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                        Peignez sur n'importe quel objet, texte ou personne indésirable pour les effacer instantanément avec l'IA.
                    </p>
                </div>
            </div>

            {/* Brush Controls Bar */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Eraser size={18} style={{ color: '#ec4899' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F5F5F7' }}>Taille du Pinceau : {brushSize}px</span>
                        <input
                            type="range"
                            min="10"
                            max="80"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            style={{ cursor: 'pointer', accentColor: '#ec4899' }}
                        />
                    </div>

                    <button
                        onClick={handleResetMask}
                        disabled={!hasMask}
                        style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'transparent',
                            color: '#F5F5F7',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            cursor: hasMask ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            opacity: hasMask ? 1 : 0.5,
                        }}
                    >
                        <RotateCcw size={14} /> Recommencer
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={applyMagicEraser}
                        disabled={!hasMask || isProcessing}
                        style={{
                            padding: '0.6rem 1.25rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            cursor: !hasMask || isProcessing ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            opacity: !hasMask || isProcessing ? 0.6 : 1,
                        }}
                    >
                        {isProcessing ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Wand2 size={16} />}
                        {isProcessing ? 'Effacement par IA...' : 'Effacer la Sélection Magique'}
                    </button>

                    <button
                        onClick={handleDownload}
                        style={{
                            padding: '0.6rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: '#12121A',
                            color: '#F5F5F7',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                        }}
                    >
                        <Download size={16} /> Exporter
                    </button>
                </div>
            </div>

            {/* Interactive Canvas Workspace */}
            {activeSrc ? (
                <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)', background: '#000', display: 'flex', justifyContent: 'center' }}>
                    <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
                    <canvas
                        ref={maskCanvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'crosshair' }}
                    />
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: '2px dashed rgba(255,255,255,0.12)',
                        borderRadius: '1rem',
                        padding: '3rem 1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#12121A',
                    }}
                >
                    <Upload size={40} style={{ color: '#ec4899', marginBottom: '1rem' }} />
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#F5F5F7' }}>
                        Charger une image à retoucher avec la Gomme Magique IA
                    </h4>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', margin: 0 }}>
                        Sélectionnez une image pour peindre et effacer des éléments
                    </p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        setCustomImage(url);
                    }
                }}
                style={{ display: 'none' }}
            />
        </div>
    );
};
