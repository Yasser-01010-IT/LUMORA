import React, { useState, useRef, useEffect } from 'react';
import { HfInference } from '@huggingface/inference';
import {
    Cpu,
    Key,
    Play,
    Loader,
    CheckCircle2,
    AlertTriangle,
    Tag,
    Upload,
    Copy,
    Check,
    Sparkles
} from 'lucide-react';

interface HuggingFacePanelProps {
    imageSrc: string | null;
}

type ModelOption =
    | 'Salesforce/blip-image-captioning-large'
    | 'briaai/RMBG-1.4'
    | 'facebook/detr-resnet-50'
    | 'google/vit-base-patch16-224'
    | 'LiheYoung/depth-anything-small-hf';

const SAMPLE_IMAGES = [
    {
        name: 'Portrait Studio',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    {
        name: 'Produit E-commerce',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    },
    {
        name: 'Paysage Nature',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    },
];

export const HuggingFacePanel: React.FC<HuggingFacePanelProps> = ({ imageSrc: propImageSrc }) => {
    const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<ModelOption>('Salesforce/blip-image-captioning-large');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const activeImageSrc = customImageSrc || propImageSrc;

    const handleDirectFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setCustomImageSrc(e.target?.result as string);
            setResult(null);
        };
        reader.readAsDataURL(file);
    };

    // Draw object detection bounding boxes when detection result changes
    useEffect(() => {
        if (result && result.type === 'detection' && activeImageSrc && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw background image
                ctx.drawImage(img, 0, 0);

                // Draw bounding boxes
                const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#6366F1'];

                if (Array.isArray(result.data)) {
                    result.data.forEach((item: any, idx: number) => {
                        const { box, label, score } = item;
                        if (!box) return;

                        const color = colors[idx % colors.length];
                        const { xmin, ymin, xmax, ymax } = box;
                        const width = xmax - xmin;
                        const height = ymax - ymin;

                        // Draw Rectangle
                        ctx.strokeStyle = color;
                        ctx.lineWidth = Math.max(3, Math.round(img.width / 200));
                        ctx.strokeRect(xmin, ymin, width, height);

                        // Fill semi-transparent overlay
                        ctx.fillStyle = `${color}25`;
                        ctx.fillRect(xmin, ymin, width, height);

                        // Draw Label Badge background
                        const fontSize = Math.max(14, Math.round(img.width / 40));
                        ctx.font = `bold ${fontSize}px sans-serif`;
                        const text = `${label} (${(score * 100).toFixed(0)}%)`;
                        const textWidth = ctx.measureText(text).width;

                        ctx.fillStyle = color;
                        ctx.fillRect(xmin, Math.max(0, ymin - fontSize - 8), textWidth + 12, fontSize + 8);

                        // Draw Text
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(text, xmin + 6, Math.max(fontSize, ymin - 6));
                    });
                }
            };
            img.src = activeImageSrc;
        }
    }, [result, activeImageSrc]);

    const runHuggingFaceInference = async () => {
        if (!activeImageSrc) {
            setError('Veuillez fournir une image avant d\'exécuter le modèle.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const hf = new HfInference(apiKey.trim() || undefined);
            const response = await fetch(activeImageSrc);
            const blob = await response.blob();

            if (selectedModel === 'Salesforce/blip-image-captioning-large') {
                const captionResult = await hf.imageToText({
                    data: blob,
                    model: selectedModel,
                } as any);
                setResult({ type: 'caption', data: captionResult });
            } else if (selectedModel === 'facebook/detr-resnet-50') {
                const objectDetectionResult = await hf.objectDetection({
                    data: blob,
                    model: selectedModel,
                } as any);
                setResult({ type: 'detection', data: objectDetectionResult });
            } else if (selectedModel === 'google/vit-base-patch16-224') {
                const classificationResult = await (hf as any).imageClassification({
                    data: blob,
                    model: selectedModel,
                });
                setResult({ type: 'classification', data: classificationResult });
            } else if (selectedModel === 'briaai/RMBG-1.4') {
                const imageResult = await hf.imageSegmentation({
                    data: blob,
                    model: selectedModel,
                } as any);
                setResult({ type: 'segmentation', data: imageResult });
            } else if (selectedModel === 'LiheYoung/depth-anything-small-hf') {
                const depthResult = await (hf as any).depthEstimation({
                    data: blob,
                    model: selectedModel,
                });
                setResult({ type: 'depth', data: depthResult });
            }
        } catch (err: any) {
            console.error('Hugging Face Inference Error:', err);
            setError(
                err.message ||
                'Une erreur est survenue avec l\'API Hugging Face. Vérifiez votre jeton API ou réessayez.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Header / Intro */}
            <div
                style={{
                    background: '#12121A',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Cpu size={20} style={{ color: '#8B5CF6' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#F5F5F7' }}>
                            Modèles IA Hugging Face 100% Gratuits & Illimités
                        </h3>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Sparkles size={12} /> Public HF Inference API
                    </span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1.25rem' }}>
                    Exécutez directement les meilleurs modèles open source hébergés sur Hugging Face Hub pour sous-titrer, analyser, détecter des objets et estimer la profondeur 3D de vos images.
                </p>

                {/* Preset sample images if no image uploaded */}
                {!activeImageSrc && (
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '0.5rem' }}>
                            Ou choisissez une image de démonstration :
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {SAMPLE_IMAGES.map((sample, idx) => (
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
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        background: '#0B0B0F',
                                        color: '#F5F5F7',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img src={sample.url} alt={sample.name} style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }} />
                                    {sample.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Direct Image selector badge */}
                {activeImageSrc ? (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1rem',
                            background: '#0B0B0F',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={activeImageSrc} alt="Preview" style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F5F5F7' }}>
                                Image chargée et prête pour analyse IA
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.8rem',
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'transparent',
                                color: '#8B5CF6',
                                cursor: 'pointer',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                            }}
                        >
                            <Upload size={14} /> Changer d'image
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: '2px dashed rgba(255,255,255,0.12)',
                            borderRadius: '0.75rem',
                            padding: '2rem 1rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: '#0B0B0F',
                            marginBottom: '1.25rem',
                        }}
                    >
                        <Upload size={32} style={{ color: '#8B5CF6', marginBottom: '0.5rem' }} />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.25rem 0', color: '#F5F5F7' }}>
                            Cliquez pour choisir une image à analyser par l'IA
                        </h4>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0 }}>
                            Format PNG, JPG, WebP jusqu'à 20 Mo
                        </p>
                    </div>
                )}

                {/* Model selection & API token */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'rgba(255,255,255,0.65)' }}>
                            Sélectionner un Modèle Hugging Face :
                        </label>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value as ModelOption)}
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: '#0B0B0F',
                                color: '#F5F5F7',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                outline: 'none',
                            }}
                        >
                            <option value="Salesforce/blip-image-captioning-large">
                                📝 Image Captioning & Tags (Salesforce BLIP Large)
                            </option>
                            <option value="facebook/detr-resnet-50">
                                🎯 Détection d'Objets & Bounding Boxes (DETR ResNet-50)
                            </option>
                            <option value="google/vit-base-patch16-224">
                                🏷️ Classification Visuelle & Reconnaissance (Google ViT)
                            </option>
                            <option value="briaai/RMBG-1.4">
                                ✂️ Segmentation & Détourage IA (BRIA RMBG-1.4)
                            </option>
                            <option value="LiheYoung/depth-anything-small-hf">
                                🗺️ Carte de Profondeur 3D (Depth Anything Small)
                            </option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'rgba(255,255,255,0.65)' }}>
                            <Key size={14} /> Jeton API HF Personal (Optionnel) :
                        </label>
                        <input
                            type="password"
                            placeholder="hf_... (laissez vide pour quota gratuit)"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: '#0B0B0F',
                                color: '#F5F5F7',
                                fontSize: '0.875rem',
                                outline: 'none',
                            }}
                        />
                    </div>
                </div>

                {/* Execute Button */}
                <button
                    onClick={runHuggingFaceInference}
                    disabled={isLoading || !activeImageSrc}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: isLoading || !activeImageSrc ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: isLoading || !activeImageSrc ? 0.6 : 1,
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                    }}
                >
                    {isLoading ? (
                        <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                        <Play size={18} />
                    )}
                    {isLoading ? 'Inférence HF en cours...' : 'Exécuter le Modèle Hugging Face'}
                </button>
            </div>

            {/* Error Message Display */}
            {error && (
                <div
                    style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid #ef4444',
                        color: '#f87171',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.875rem',
                    }}
                >
                    <AlertTriangle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Interactive Visual Results Output */}
            {result && (
                <div
                    style={{
                        background: '#12121A',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        animation: 'fadeIn 0.3s ease',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                            <CheckCircle2 size={20} />
                            <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: '#F5F5F7' }}>
                                Résultat de l'IA Hugging Face
                            </h4>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                            Modèle : {selectedModel}
                        </span>
                    </div>

                    {/* 1. BLIP Image Captioning Output */}
                    {result.type === 'caption' && (
                        <div style={{ background: '#0B0B0F', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8B5CF6' }}>
                                    <Tag size={18} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Description IA de l'image (Generated Caption) :</span>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(result.data?.generated_text || '')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        background: '#12121A',
                                        color: '#F5F5F7',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                                    {copied ? 'Copié !' : 'Copier Description'}
                                </button>
                            </div>
                            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem 0', color: '#F5F5F7', fontStyle: 'italic', lineHeight: 1.5 }}>
                                "{result.data?.generated_text || JSON.stringify(result.data)}"
                            </p>

                            {/* Tags list generated from caption */}
                            <div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>
                                    Mots-clés IA extraits :
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                    {(result.data?.generated_text || '').split(' ').map((word: string, i: number) => {
                                        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                                        if (cleanWord.length < 3) return null;
                                        return (
                                            <span key={i} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
                                                #{cleanWord}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. DETR Object Detection Visual Bounding Box Output */}
                    {result.type === 'detection' && (
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1rem' }}>
                                {Array.isArray(result.data) ? result.data.length : 0} objet(s) localisé(s) et encadré(s) automatiquement :
                            </p>
                            <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', background: '#000', display: 'flex', justifyContent: 'center' }}>
                                <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
                            </div>
                        </div>
                    )}

                    {/* 3. ViT Image Classification Meter Bars */}
                    {result.type === 'classification' && (
                        <div style={{ background: '#0B0B0F', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#8B5CF6' }}>
                                <Tag size={18} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Classifications & Prédictions d'Objets :</span>
                            </div>
                            {Array.isArray(result.data) ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {result.data.slice(0, 5).map((item: any, idx: number) => (
                                        <div key={idx}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                                                <span style={{ fontWeight: 600, color: '#F5F5F7' }}>{item.label}</span>
                                                <span style={{ fontWeight: 700, color: '#8B5CF6' }}>{(item.score * 100).toFixed(1)}%</span>
                                            </div>
                                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div
                                                    style={{
                                                        height: '100%',
                                                        width: `${(item.score * 100).toFixed(0)}%`,
                                                        background: 'linear-gradient(90deg, #8B5CF6 0%, #6366F1 100%)',
                                                        borderRadius: '4px',
                                                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <pre style={{ maxHeight: '250px', overflow: 'auto', background: '#09090d', color: '#a6adc8', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem' }}>
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            )}
                        </div>
                    )}

                    {/* 4. Segmentation / Mask Output */}
                    {result.type === 'segmentation' && (
                        <div style={{ background: '#0B0B0F', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '0.75rem', color: '#F5F5F7' }}>
                                Masque de Détourage IA Généré :
                            </span>
                            <pre style={{ maxHeight: '250px', overflow: 'auto', background: '#09090d', color: '#a6adc8', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem', margin: 0 }}>
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* 5. Depth Estimation Output */}
                    {result.type === 'depth' && (
                        <div style={{ background: '#0B0B0F', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '0.75rem', color: '#F5F5F7' }}>
                                Estimation de Profondeur 3D (Depth Map) :
                            </span>
                            <pre style={{ maxHeight: '250px', overflow: 'auto', background: '#09090d', color: '#a6adc8', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem', margin: 0 }}>
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
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
