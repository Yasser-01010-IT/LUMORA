import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Download, Upload, Image as ImageIcon, Check, Sliders, Layers, RefreshCw } from 'lucide-react';

interface ImageToPdfPanelProps {
    imageSrc: string | null;
    fileName: string;
}

type PageOrientation = 'p' | 'l'; // portrait / landscape
type PageFormat = 'a4' | 'letter' | 'fit';

export const ImageToPdfPanel: React.FC<ImageToPdfPanelProps> = ({ imageSrc: propImageSrc, fileName: propFileName }) => {
    const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
    const [customFileName, setCustomFileName] = useState<string>('document');
    const [orientation, setOrientation] = useState<PageOrientation>('p');
    const [format, setFormat] = useState<PageFormat>('fit');
    const [margin, setMargin] = useState<number>(0); // margins in mm
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const generateAndDownloadPdf = () => {
        if (!activeImageSrc) return;
        setIsGenerating(true);
        setSuccess(false);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const imgWidth = img.width;
            const imgHeight = img.height;

            let pdfWidth = 210; // A4 size defaults (mm)
            let pdfHeight = 297;

            if (format === 'letter') {
                pdfWidth = 215.9;
                pdfHeight = 279.4;
            }

            if (orientation === 'l' && format !== 'fit') {
                const temp = pdfWidth;
                pdfWidth = pdfHeight;
                pdfHeight = temp;
            }

            // Initialize PDF document
            let doc: jsPDF;
            if (format === 'fit') {
                // dynamic dimensions based on pixel size, translating px -> mm
                // 1px approx 0.264583mm
                const pxToMm = 0.264583;
                const mmW = imgWidth * pxToMm + margin * 2;
                const mmH = imgHeight * pxToMm + margin * 2;
                doc = new jsPDF({
                    orientation: imgWidth > imgHeight ? 'l' : 'p',
                    unit: 'mm',
                    format: [mmW, mmH],
                });
                pdfWidth = mmW;
                pdfHeight = mmH;
            } else {
                doc = new jsPDF({
                    orientation,
                    unit: 'mm',
                    format,
                });
            }

            // Calculate placement dimensions preserving aspect ratio
            const printableWidth = pdfWidth - margin * 2;
            const printableHeight = pdfHeight - margin * 2;
            const imgRatio = imgWidth / imgHeight;
            const printableRatio = printableWidth / printableHeight;

            let renderWidth = printableWidth;
            let renderHeight = printableHeight;

            if (imgRatio > printableRatio) {
                // landscape image relative to portrait ratio, scale by width limiting
                renderHeight = printableWidth / imgRatio;
            } else {
                renderWidth = printableHeight * imgRatio;
            }

            // Center the image within print bounds
            const xOffset = margin + (printableWidth - renderWidth) / 2;
            const yOffset = margin + (printableHeight - renderHeight) / 2;

            // Detect format from source string URL schema if possible
            let imgType = 'JPEG';
            if (activeImageSrc.startsWith('data:image/png')) {
                imgType = 'PNG';
            } else if (activeImageSrc.startsWith('data:image/webp')) {
                imgType = 'WEBP';
            }

            doc.addImage(activeImageSrc, imgType, xOffset, yOffset, renderWidth, renderHeight);
            doc.save(`${activeFileName}.pdf`);

            setIsGenerating(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        };
        img.src = activeImageSrc;
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
                        Upload Image to Convert to PDF
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>
                        Instantly package your scanned document or image file into a printable PDF
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
                            <ImageIcon size={16} style={{ color: '#7C3AED' }} />
                            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                                Active Image: <strong style={{ color: '#fff' }}>{activeFileName}</strong>
                            </span>
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem',
                                border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
                                color: '#7C3AED', cursor: 'pointer', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                            <Upload size={13} /> Change Image
                        </button>
                    </div>

                    {/* Config options */}
                    <div style={{
                        background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
                        padding: '1.25rem', marginBottom: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sliders size={16} style={{ color: '#7C3AED' }} />
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                                Page Setup & PDF Styling
                            </h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                            {/* Orientation */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'rgba(255,255,255,0.5)' }}>
                                    Orientation:
                                </label>
                                <select
                                    value={orientation}
                                    disabled={format === 'fit'}
                                    onChange={(e) => setOrientation(e.target.value as PageOrientation)}
                                    style={{
                                        width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)', background: '#0e0e18',
                                        color: format === 'fit' ? 'rgba(255,255,255,0.25)' : '#fff', fontSize: '0.85rem', outline: 'none', cursor: format === 'fit' ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    <option value="p">Portrait (Vertical)</option>
                                    <option value="l">Landscape (Horizontal)</option>
                                </select>
                            </div>

                            {/* Page Format */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'rgba(255,255,255,0.5)' }}>
                                    Page Dimensions:
                                </label>
                                <select
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value as PageFormat)}
                                    style={{
                                        width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)', background: '#0e0e18',
                                        color: '#fff', fontSize: '0.85rem', outline: 'none', cursor: 'pointer',
                                    }}
                                >
                                    <option value="fit">Auto-fit (Fit exactly to image proportions)</option>
                                    <option value="a4">Standard A4 paper</option>
                                    <option value="letter">Letter paper</option>
                                </select>
                            </div>

                            {/* Document Margin */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'rgba(255,255,255,0.5)' }}>
                                    Outer Margin (mm):
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={margin}
                                    onChange={(e) => setMargin(Math.max(0, parseInt(e.target.value) || 0))}
                                    style={{
                                        width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)', background: '#0e0e18',
                                        color: '#fff', fontSize: '0.85rem', outline: 'none',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Central Preview/Actions Area */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        {/* Scanned Image Preview */}
                        <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Preview source image
                            </h4>
                            <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }}>
                                <img
                                    src={activeImageSrc}
                                    alt="Source PDF conversion"
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                            </div>
                        </div>

                        {/* Config & Download Card */}
                        <div style={{
                            background: 'rgba(218, 119, 87, 0.02)', borderRadius: '16px',
                            border: '1px solid rgba(168,85,247,0.15)', padding: '1.5rem',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                            textAlign: 'center',
                        }}>
                            <div style={{
                                width: 54, height: 54, borderRadius: '50%',
                                background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
                            }}>
                                <Layers size={22} style={{ color: '#A855F7' }} />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                                Ready for PDF Export
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: 260 }}>
                                This processes purely inside your web browser. No files are uploaded to servers.
                            </p>

                            {success && (
                                <div style={{
                                    background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                                    color: '#34D399', padding: '0.6rem 1rem', borderRadius: '8px',
                                    marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    fontSize: '0.8rem', fontWeight: 600,
                                }}>
                                    <Check size={14} /> PDF compiled and downloaded successfully!
                                </div>
                            )}

                            <button
                                onClick={generateAndDownloadPdf}
                                disabled={isGenerating}
                                style={{
                                    padding: '0.75rem 2rem', borderRadius: '10px', border: 'none',
                                    background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: '#fff',
                                    cursor: isGenerating ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.88rem',
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)', transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { if (!isGenerating) e.currentTarget.style.boxShadow = '0 6px 24px rgba(124, 58, 237, 0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(124, 58, 237, 0.3)'; }}
                            >
                                {isGenerating ? (
                                    <RefreshCw size={15} style={{ animation: 'spin 1.8s linear infinite' }} />
                                ) : (
                                    <Download size={15} />
                                )}
                                {isGenerating ? 'Compiling PDF…' : 'Compile & Download PDF'}
                            </button>
                        </div>
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
        </div>
    );
};
