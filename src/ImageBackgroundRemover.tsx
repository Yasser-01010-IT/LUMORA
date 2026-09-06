import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Download,
  RefreshCw,
  Sparkles,
  Cpu,
  Layers,
  FileText,
  FileSpreadsheet,
  ArrowLeft,
  ShieldCheck,
  Wand2,
  Sliders,
  Type,
  Crown,
} from 'lucide-react';

import { removeBackground } from '@imgly/background-removal';

import { VectorizationPanel } from './VectorizationPanel';
import { HuggingFacePanel } from './HuggingFacePanel';
import { OcrScannerPanel } from './OcrScannerPanel';
import { ImageToPdfPanel } from './ImageToPdfPanel';
import { BatchProcessingPanel } from './BatchProcessingPanel';
import { MagicEraserPanel } from './MagicEraserPanel';
import { StudioBackgroundPanel } from './StudioBackgroundPanel';
import { TextStudioPanel } from './TextStudioPanel';

type Status =
  | 'idle'
  | 'loading-model'
  | 'ready'
  | 'processing'
  | 'done'
  | 'error';

type PreviewBg = 'checkerboard' | 'dark' | 'white';

type ActiveTab =
  | 'remover'
  | 'vectorizer'
  | 'ocr'
  | 'pdf'
  | 'huggingface'
  | 'batch'
  | 'eraser'
  | 'studio'
  | 'text';

const TABS: {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  desc: string;
  color: string;
  badge?: string;
}[] = [
  {
    id: 'remover',
    label: 'Background Removal',
    shortLabel: 'Remove BG',
    icon: <Layers size={17} strokeWidth={1.8} />,
    desc: 'Remove backgrounds with local AI',
    color: '#8B5CF6',
  },
  {
    id: 'text',
    label: 'Text & Typography',
    shortLabel: 'Add Text AI',
    icon: <Type size={17} strokeWidth={1.8} />,
    desc: 'Photoshop quality text overlays & fonts',
    color: '#3b82f6',
    badge: 'NEW',
  },
  {
    id: 'vectorizer',
    label: 'SVG Vectorize',
    shortLabel: 'Vectorize SVG',
    icon: <Sparkles size={17} strokeWidth={1.8} />,
    desc: 'Convert images into scalable vectors',
    color: '#6366F1',
  },
  {
    id: 'ocr',
    label: 'OCR Scanner',
    shortLabel: 'OCR Text',
    icon: <FileText size={17} strokeWidth={1.8} />,
    desc: 'Extract text from images',
    color: '#7C3AED',
  },
  {
    id: 'pdf',
    label: 'Image → PDF',
    shortLabel: 'Image to PDF',
    icon: <FileSpreadsheet size={17} strokeWidth={1.8} />,
    desc: 'Turn images into polished documents',
    color: '#6D5CE7',
  },
  {
    id: 'huggingface',
    label: 'AI Models (HF)',
    shortLabel: 'HF Models',
    icon: <Cpu size={17} strokeWidth={1.8} />,
    desc: 'Free open source AI models on HF',
    color: '#8B5CF6',
    badge: 'FREE',
  },
  {
    id: 'batch',
    label: 'Batch Mode Studio',
    shortLabel: 'Batch Mode',
    icon: <Layers size={17} strokeWidth={1.8} />,
    desc: 'Bulk process multiple images',
    color: '#10b981',
    badge: 'FREE',
  },
  {
    id: 'eraser',
    label: 'Magic Eraser AI',
    shortLabel: 'Magic Eraser',
    icon: <Wand2 size={17} strokeWidth={1.8} />,
    desc: 'Erase unwanted objects with AI',
    color: '#ec4899',
    badge: 'FREE',
  },
  {
    id: 'studio',
    label: 'AI Studio Backdrops',
    shortLabel: 'AI Backdrops',
    icon: <Sliders size={17} strokeWidth={1.8} />,
    desc: 'Studio product backdrops & lighting',
    color: '#f59e0b',
    badge: 'FREE',
  },
];

const ImageBackgroundRemover: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ActiveTab>('remover');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [previewBg, setPreviewBg] = useState<PreviewBg>('checkerboard');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToastMsg('Veuillez importer une image valide (PNG, JPG, WebP).');
      setStatus('error');
      return;
    }

    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    setFileName(baseName);
    setStatus('loading-model');
    setProgress(0);
    setProcessedImage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setStatus('processing');
      const blob = await removeBackground(file, {
        output: {
          format: 'image/png',
          quality: 1,
        },
        progress: (_key: string, current: number, total: number) => {
          setProgress(total > 0 ? Math.round((current / total) * 100) : 0);
        },
      });

      setProcessedImage(URL.createObjectURL(blob));
      setStatus('done');
    } catch (err) {
      console.error(err);
      setToastMsg('Le détourage a échoué. Essayez avec une autre image.');
      setStatus('error');
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const downloadTransparentImage = () => {
    if (!processedImage) return;
    const a = document.createElement('a');
    a.href = processedImage;
    a.download = `${fileName}-no-bg.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setToastMsg('PNG Téléchargé avec succès en haute définition !');
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const download4KUltraHD = () => {
    downloadTransparentImage();
  };

  const reset = () => {
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
    }
    setOriginalImage(null);
    setProcessedImage(null);
    setStatus('idle');
    setProgress(0);
    setToastMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showUpload = !originalImage || status === 'idle';
  const isProcessing = status === 'processing' || status === 'loading-model';

  const getPreviewStyle = (): React.CSSProperties => {
    if (previewBg === 'dark') return { background: '#111116' };
    if (previewBg === 'white') return { background: '#ffffff' };
    return {
      backgroundColor: '#f1f1f4',
      backgroundImage: `
        linear-gradient(45deg, #d7d7dc 25%, transparent 25%),
        linear-gradient(-45deg, #d7d7dc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #d7d7dc 75%),
        linear-gradient(-45deg, transparent 75%, #d7d7dc 75%)
      `,
      backgroundSize: '18px 18px',
      backgroundPosition: '0 0, 0 9px, 9px -9px, -9px 0px',
    };
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B0B0F',
        color: '#F5F5F7',
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #0B0B0F; color: #F5F5F7; }
        button, input { font: inherit; }
        button { -webkit-tap-highlight-color: transparent; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }

        .pm-sidebar-item {
          transition: background 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease;
        }
        .pm-sidebar-item:hover {
          background: rgba(255,255,255,0.055) !important;
          color: #fff !important;
        }
        .pm-upload {
          transition: border-color 200ms ease, background 200ms ease, transform 200ms ease, box-shadow 200ms ease;
        }
        .pm-upload:hover {
          border-color: rgba(139,92,246,0.65) !important;
          background: rgba(139,92,246,0.055) !important;
        }
        .pm-upload.dragging {
          border-color: #8B5CF6 !important;
          background: rgba(139,92,246,0.10) !important;
          transform: scale(1.008);
          box-shadow: 0 20px 70px rgba(0,0,0,0.25), 0 0 0 4px rgba(139,92,246,0.08);
        }

        /* RESPONSIVE TABLET (max-width: 900px) */
        @media (max-width: 900px) {
          .pm-layout { grid-template-columns: 80px minmax(0, 1fr) !important; }
          .pm-sidebar { width: 80px !important; padding: 1rem 0.5rem !important; }
          .pm-sidebar-item { justify-content: center !important; }
          .pm-sidebar-label { display: none !important; }
          .pm-sidebar-description { display: none !important; }
          .pm-sidebar-header { display: none !important; }
        }

        /* RESPONSIVE MOBILE (max-width: 768px) */
        @media (max-width: 768px) {
          .pm-topbar { padding: 0 1rem !important; height: 56px !important; }
          .pm-layout { grid-template-columns: 1fr !important; min-height: calc(100vh - 56px) !important; }
          .pm-sidebar {
            width: 100% !important;
            height: auto !important;
            position: sticky !important;
            top: 56px !important;
            z-index: 90 !important;
            padding: 0.5rem 0.75rem !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.08) !important;
            background: #0B0B0F !important;
            overflow-x: auto !important;
            white-space: nowrap !important;
            -webkit-overflow-scrolling: touch;
          }
          .pm-sidebar-tools {
            flex-direction: row !important;
            gap: 0.5rem !important;
          }
          .pm-sidebar-item {
            width: auto !important;
            flex-shrink: 0 !important;
            padding: 0.5rem 0.85rem !important;
            gap: 6px !important;
            align-items: center !important;
          }
          .pm-sidebar-label {
            display: inline-block !important;
          }
          .pm-sidebar-description {
            display: none !important;
          }
          .pm-sidebar-header {
            display: none !important;
          }
          .pm-content {
            padding: 1rem 0.75rem !important;
          }
          .vec-preview-code-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* RESPONSIVE SMALL MOBILE (max-width: 480px) */
        @media (max-width: 480px) {
          .pm-topbar { padding: 0 0.75rem !important; }
          .pm-content { padding: 0.85rem 0.5rem !important; }
          .pm-upload { padding: 1.5rem 1rem !important; min-height: 320px !important; }
          .pm-upload h2 { font-size: 1.1rem !important; }
        }
      `}</style>

      {/* TOP BAR */}
      <header
        className="pm-topbar"
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(11,11,15,0.92)',
          backdropFilter: 'blur(24px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <button
            onClick={() => navigate('/')}
            aria-label="Back to home"
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.035)',
              color: 'rgba(255,255,255,0.65)',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
          </button>

          <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.08)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="lumoraGradientApp"
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
                <path
                  d="M18 3.5
                     C9.99 3.5 3.5 9.99 3.5 18
                     C3.5 26.01 9.99 32.5 18 32.5
                     C26.01 32.5 32.5 26.01 32.5 18
                     C32.5 9.99 26.01 3.5 18 3.5Z"
                  fill="url(#lumoraGradientApp)"
                />
                <path
                  d="M12 10.5V22.5C12 24.43 13.57 26 15.5 26H24"
                  stroke="white"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24.5 10L25.15 11.85L27 12.5L25.15 13.15L24.5 15L23.85 13.15L22 12.5L23.85 11.85L24.5 10Z"
                  fill="white"
                />
              </svg>
            </div>

            <span
              style={{
                fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
                fontSize: '1.05rem',
                fontWeight: 700,
                letterSpacing: '-0.045em',
                color: '#FFFFFF',
              }}
            >
              Lumora
            </span>
          </div>
        </div>
      </header>

      {/* MAIN APP LAYOUT */}
      <div
        className="pm-layout"
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '230px minmax(0, 1fr)',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* SIDEBAR */}
        <aside
          className="pm-sidebar"
          style={{
            width: 230,
            padding: '1.5rem 0.9rem',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            position: 'sticky',
            top: 64,
            height: 'calc(100vh - 64px)',
            alignSelf: 'start',
            overflowY: 'auto',
            background: '#0B0B0F',
          }}
        >
          <div className="pm-sidebar-header" style={{ padding: '0.5rem 0.65rem 1rem' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.27)', marginBottom: 7 }}>
              AI Studio Workspace
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', lineHeight: 1.5 }}>
              Outils IA professionnels & Modèles Hugging Face.
            </div>
          </div>

          <div className="pm-sidebar-tools" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className="pm-sidebar-item"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    borderRadius: 10,
                    border: active ? '1px solid rgba(139,92,246,0.18)' : '1px solid transparent',
                    background: active ? 'rgba(139,92,246,0.105)' : 'transparent',
                    color: active ? '#fff' : 'rgba(255,255,255,0.47)',
                    padding: '0.7rem 0.65rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      width: 29,
                      height: 29,
                      flexShrink: 0,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: active ? `${tab.color}18` : 'rgba(255,255,255,0.035)',
                      color: active ? tab.color : 'rgba(255,255,255,0.42)',
                    }}
                  >
                    {tab.icon}
                  </span>

                  <span className="pm-sidebar-label" style={{ minWidth: 0, paddingTop: 1, flex: 1 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: active ? 600 : 500, lineHeight: 1.35 }}>
                      {tab.shortLabel}
                      {tab.badge && (
                        <span style={{ fontSize: 8, padding: '0.1rem 0.35rem', borderRadius: '4px', background: tab.badge === 'NEW' ? '#3b82f6' : 'rgba(16, 185, 129, 0.15)', color: tab.badge === 'NEW' ? 'white' : '#10b981', fontWeight: 700 }}>
                          {tab.badge}
                        </span>
                      )}
                    </span>
                    <span className="pm-sidebar-description" style={{ display: 'block', fontSize: 10, lineHeight: 1.35, marginTop: 3, color: active ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.25)' }}>
                      {tab.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Privacy card */}
          <div className="pm-sidebar-header" style={{ marginTop: 24, padding: '0.8rem 0.75rem', borderRadius: 11, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.025)' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 7 }}>
              <ShieldCheck size={14} color="#A78BFA" />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>100% Confidentiel</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>
              Vos photos restent privées dans votre navigateur.
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="pm-content" style={{ padding: '2rem', background: '#0B0B0F' }}>
          {/* 1. BACKGROUND REMOVER TAB */}
          {activeTab === 'remover' && (
            <div style={{ maxWidth: 880, margin: '0 auto', animation: 'fadeUp 350ms ease' }}>
              {showUpload ? (
                <div
                  className={`pm-upload ${isDragging ? 'dragging' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    minHeight: 'clamp(390px, 55vh, 510px)',
                    border: '1px dashed rgba(255,255,255,0.14)',
                    borderRadius: 18,
                    background: 'rgba(255,255,255,0.022)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'relative', width: 68, height: 68, borderRadius: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.20)', color: '#A78BFA', marginBottom: 22 }}>
                    <Upload size={28} strokeWidth={1.6} />
                  </div>
                  <h2 style={{ position: 'relative', margin: 0, fontSize: 20, fontWeight: 600, color: '#F5F5F7' }}>
                    Importer une photo pour détourer
                  </h2>
                  <p style={{ position: 'relative', margin: '0.65rem 0 1.35rem', fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>
                    Cliquez ou glissez-déposez une image ici
                  </p>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['PNG', 'JPG', 'WebP', 'HEIC'].map((format) => (
                      <span key={format} style={{ padding: '0.32rem 0.55rem', borderRadius: 6, background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: 600 }}>
                        {format}
                      </span>
                    ))}
                  </div>

                  {toastMsg && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginTop: '1.25rem', fontSize: '0.85rem' }}>
                      {toastMsg}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* Results preview component */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* Original */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '0.75rem' }}>Original Image</span>
                      <img src={originalImage!} alt="Original" style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', display: 'block' }} />
                    </div>

                    {/* Result */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981' }}>Résultat Sans Fond</span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button onClick={() => setPreviewBg('checkerboard')} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: 'none', background: previewBg === 'checkerboard' ? '#8B5CF6' : 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.7rem', cursor: 'pointer' }}>Damier</button>
                          <button onClick={() => setPreviewBg('dark')} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: 'none', background: previewBg === 'dark' ? '#8B5CF6' : 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.7rem', cursor: 'pointer' }}>Noir</button>
                          <button onClick={() => setPreviewBg('white')} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: 'none', background: previewBg === 'white' ? '#8B5CF6' : 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.7rem', cursor: 'pointer' }}>Blanc</button>
                        </div>
                      </div>

                      <div style={{ ...getPreviewStyle(), borderRadius: '0.5rem', overflow: 'hidden', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isProcessing ? (
                          <div style={{ textAlign: 'center', color: '#A78BFA' }}>
                            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
                            <div>Traitement IA {progress}%...</div>
                          </div>
                        ) : (
                          <img src={processedImage!} alt="No bg result" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        )}
                      </div>
                    </div>
                  </div>

                  {toastMsg && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', textAlign: 'center' }}>
                      {toastMsg}
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={reset} style={{ padding: '0.65rem 1.25rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <RefreshCw size={16} /> Nouvelle Image
                    </button>
                    <button onClick={downloadTransparentImage} style={{ padding: '0.65rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#8B5CF6', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Download size={16} /> Télécharger PNG HD
                    </button>
                    <button onClick={download4KUltraHD} style={{ padding: '0.65rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Crown size={16} /> Exportation 4K Ultra HD (Gratuit)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. TEXT & TYPOGRAPHY STUDIO TAB */}
          {activeTab === 'text' && (
            <div style={{ maxWidth: 880, margin: '0 auto', animation: 'fadeUp 300ms ease' }}>
              <TextStudioPanel imageSrc={processedImage || originalImage} />
            </div>
          )}

          {/* 3. VECTORIZER TAB */}
          {activeTab === 'vectorizer' && (
            <div style={{ maxWidth: 880, margin: '0 auto', animation: 'fadeUp 300ms ease' }}>
              <VectorizationPanel imageSrc={processedImage || originalImage} fileName={fileName} />
            </div>
          )}

          {/* 4. OCR SCANNER TAB */}
          {activeTab === 'ocr' && (
            <div style={{ maxWidth: 880, margin: '0 auto', animation: 'fadeUp 300ms ease' }}>
              <OcrScannerPanel imageSrc={processedImage || originalImage} fileName={fileName} />
            </div>
          )}

          {/* 5. IMAGE TO PDF TAB */}
          {activeTab === 'pdf' && (
            <div style={{ maxWidth: 880, margin: '0 auto', animation: 'fadeUp 300ms ease' }}>
              <ImageToPdfPanel imageSrc={processedImage || originalImage} fileName={fileName} />
            </div>
          )}

          {/* 6. HUGGING FACE FREE AI MODELS TAB */}
          {activeTab === 'huggingface' && (
            <div style={{ maxWidth: 880, margin: '0 auto', animation: 'fadeUp 300ms ease' }}>
              <HuggingFacePanel imageSrc={processedImage || originalImage} />
            </div>
          )}

          {/* 7. BATCH MODE STUDIO TAB */}
          {activeTab === 'batch' && (
            <div style={{ maxWidth: 880, margin: '0 auto', animation: 'fadeUp 300ms ease' }}>
              <BatchProcessingPanel />
            </div>
          )}

          {/* 8. MAGIC ERASER TAB */}
          {activeTab === 'eraser' && (
            <div style={{ maxWidth: 880, margin: '0 auto', animation: 'fadeUp 300ms ease' }}>
              <MagicEraserPanel imageSrc={processedImage || originalImage} />
            </div>
          )}

          {/* 9. AI STUDIO BACKDROPS TAB */}
          {activeTab === 'studio' && (
            <div style={{ maxWidth: 880, margin: '0 auto', animation: 'fadeUp 300ms ease' }}>
              <StudioBackgroundPanel imageSrc={processedImage || originalImage} />
            </div>
          )}

          {/* FOOTER */}
          <footer
            style={{
              maxWidth: 880,
              margin: '3.5rem auto 0',
              paddingTop: 18,
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              color: 'rgba(255,255,255,0.20)',
              fontSize: 9,
              flexWrap: 'wrap',
            }}
          >
            <span>Lumora AI Studio</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <ShieldCheck size={11} /> Traitement 100% sécurisé et gratuit sur votre appareil
            </span>
            <span>Lumora — Hugging Face Inference API & Local AI</span>
          </footer>
        </main>
      </div>

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageBackgroundRemover;