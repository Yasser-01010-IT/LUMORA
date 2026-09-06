import React, { useState, useEffect, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { FileText, Copy, Download, Check, Sparkles, RefreshCw, Upload, Image as ImageIcon, Sliders, Eye } from 'lucide-react';

interface OcrScannerPanelProps {
    imageSrc: string | null;
    fileName: string;
}

type ScanFilter = 'none' | 'magic-color' | 'bw' | 'grayscale' | 'contrast';

export const OcrScannerPanel: React.FC<OcrScannerPanelProps> = ({ imageSrc: propImageSrc, fileName: propFileName }) => {
    const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
    const [customFileName, setCustomFileName] = useState<string>('document');
    const [extractedText, setExtractedText] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [ocrProgress, setOcrProgress] = useState<number>(0);
    const [ocrStatusText, setOcrStatusText] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);
    const [scanFilter, setScanFilter] = useState<ScanFilter>('none');
    const [filteredImageSrc, setFilteredImageSrc] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const activeImageSrc = customImageSrc || propImageSrc;
    const activeFileName = customFileName !== 'document' ? customFileName : propFileName || 'document';

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

    // Apply scanner document filter to image
    const applyFilter = (src: string, filter: ScanFilter) => {
        if (!src) return;
        if (filter === 'none') {
            setFilteredImageSrc(src);
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                if (filter === 'grayscale') {
                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    data[i] = gray;
                    data[i + 1] = gray;
                    data[i + 2] = gray;
                } else if (filter === 'bw') {
                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    const bw = gray > 140 ? 255 : 0;
                    data[i] = bw;
                    data[i + 1] = bw;
                    data[i + 2] = bw;
                } else if (filter === 'magic-color') {
                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    data[i] = Math.min(255, Math.max(0, (r - gray) * 1.5 + gray * 1.1));
                    data[i + 1] = Math.min(255, Math.max(0, (g - gray) * 1.5 + gray * 1.1));
                    data[i + 2] = Math.min(255, Math.max(0, (b - gray) * 1.5 + gray * 1.1));
                } else if (filter === 'contrast') {
                    const factor = 1.6;
                    data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
                    data[i + 1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
                    data[i + 2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setFilteredImageSrc(canvas.toDataURL('image/png'));
        };
        img.src = src;
    };

    useEffect(() => {
        if (activeImageSrc) {
            applyFilter(activeImageSrc, scanFilter);
        }
    }, [activeImageSrc, scanFilter]);

    const runOcr = async () => {
        const imageToProcess = filteredImageSrc || activeImageSrc;
        if (!imageToProcess) return;

        setIsProcessing(true);
        setOcrProgress(0);
        setOcrStatusText('Initializing local OCR engine...');

        try {
            const worker = await createWorker('fra+eng', 1, {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        setOcrStatusText(`Reading text… ${Math.round((m.progress || 0) * 100)}%`);
                        setOcrProgress(Math.round((m.progress || 0) * 100));
                    } else {
                        setOcrStatusText(m.status);
                    }
                },
            });

            const { data } = await worker.recognize(imageToProcess);
            setExtractedText(data.text || 'No text could be extracted from this image.');
            await worker.terminate();
        } catch (err: any) {
            console.error('OCR Error:', err);
            setExtractedText('Error extracting text: ' + (err.message || 'OCR failed'));
        } finally {
            setIsProcessing(false);
        }
    };

    const copyText = () => {
        if (!extractedText) return;
        navigator.clipboard.writeText(extractedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const downloadTxt = () => {
        if (!extractedText) return;
        const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${activeFileName}-ocr.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {!activeImageSrc ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: '2px dashed rgba(168,85,247,0.25)',
                        borderRadius: '20px',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'rgba(255,255,255,0.02)',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#A855F7'; e.currentTarget.style.background = 'rgba(168,85,247,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                    <div style={{
                        width: 60, height: 60, borderRadius: '15px', margin: '0 auto 1.25rem',
                        background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Upload size={26} style={{ color: '#A855F7' }} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                        Upload Document for OCR Scan
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>
                        Convert any document or text screenshot into plain, editable text instantly
                    </p>
                </div>
            ) : (
                <>
                    {/* Header Info */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: '1.25rem', background: 'rgba(255,255,255,0.02)',
                        padding: '0.75rem 1.25rem', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap', gap: '0.75rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ImageIcon size={16} style={{ color: '#8B5CF6' }} />
                            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                                Active Document: <strong style={{ color: '#fff' }}>{activeFileName}</strong>
                            </span>
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem',
                                border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
                                color: '#8B5CF6', cursor: 'pointer', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                            <Upload size={13} /> Change Image
                        </button>
                    </div>

                    {/* Filters & Actions Panel */}
                    <div style={{
                        background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
                        padding: '1.25rem', marginBottom: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sliders size={16} style={{ color: '#8B5CF6' }} />
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                                Scanner Enhancements & OCR Settings
                            </h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'rgba(255,255,255,0.5)' }}>
                                    Visual enhancement filter:
                                </label>
                                <select
                                    value={scanFilter}
                                    onChange={(e) => setScanFilter(e.target.value as ScanFilter)}
                                    style={{
                                        width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)', background: '#0e0e18',
                                        color: '#fff', fontSize: '0.85rem', outline: 'none', cursor: 'pointer',
                                    }}
                                >
                                    <option value="none">Original (No Filter)</option>
                                    <option value="magic-color">Magic Color (Clean & Contrast)</option>
                                    <option value="bw">e-Paper (High-Contrast B&W)</option>
                                    <option value="grayscale">Grayscale</option>
                                    <option value="contrast">High Contrast</option>
                                </select>
                            </div>

                            <div>
                                <button
                                    onClick={runOcr}
                                    disabled={isProcessing}
                                    style={{
                                        width: '100%', padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none',
                                        background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: '#fff',
                                        fontWeight: 700, fontSize: '0.85rem', cursor: isProcessing ? 'not-allowed' : 'pointer',
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        transition: 'all 0.2s', opacity: isProcessing ? 0.6 : 1,
                                    }}
                                >
                                    {isProcessing ? (
                                        <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                                    ) : (
                                        <FileText size={15} />
                                    )}
                                    {isProcessing ? 'OCR Processing…' : 'Extract Document Text'}
                                </button>
                            </div>
                        </div>

                        {/* OCR Progress bar */}
                        {isProcessing && (
                            <div style={{ marginTop: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem', color: 'rgba(255,255,255,0.5)' }}>
                                    <span>{ocrStatusText}</span>
                                    <span>{ocrProgress}%</span>
                                </div>
                                <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${ocrProgress}%`, background: '#8B5CF6', transition: 'width 0.25s ease' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Left/Right Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        {/* Scanned Image Preview */}
                        <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                <Eye size={14} /> Scan Preview
                            </h4>
                            <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }}>
                                <img
                                    src={filteredImageSrc || activeImageSrc}
                                    alt="Scan Preview"
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                            </div>
                        </div>

                        {/* Extracted Editable Text */}
                        <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                <Sparkles size={14} style={{ color: '#8B5CF6' }} /> Extracted Text (Editable)
                            </h4>
                            <textarea
                                value={extractedText}
                                onChange={(e) => setExtractedText(e.target.value)}
                                placeholder="Results will appear here. Click 'Extract Document Text' above to begin optical character recognition..."
                                style={{
                                    width: '100%', flex: 1, minHeight: '260px', padding: '0.75rem',
                                    borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
                                    background: '#07070b', color: '#fff', fontSize: '0.875rem',
                                    resize: 'vertical', outline: 'none', fontFamily: 'monospace',
                                    lineHeight: '1.5',
                                }}
                            />
                        </div>
                    </div>

                    {/* Text Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={copyText}
                            disabled={!extractedText}
                            style={{
                                padding: '0.7rem 1.25rem', borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
                                color: '#fff', cursor: extractedText ? 'pointer' : 'not-allowed',
                                fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                opacity: extractedText ? 1 : 0.4, transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { if (extractedText) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                        >
                            {copied ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>

                        <button
                            onClick={downloadTxt}
                            disabled={!extractedText}
                            style={{
                                padding: '0.7rem 1.5rem', borderRadius: '10px', border: 'none',
                                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: '#fff',
                                cursor: extractedText ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '0.85rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: extractedText ? 1 : 0.4,
                                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { if (extractedText) e.currentTarget.style.boxShadow = '0 6px 18px rgba(139, 92, 246, 0.4)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)'; }}
                        >
                            <Download size={16} /> Download Text (.txt)
                        </button>
                    </div>
                </>
            )}

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
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};
