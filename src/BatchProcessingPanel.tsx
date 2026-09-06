import React, { useState } from 'react';
import { Upload, Layers, Download, CheckCircle2, Play, Trash2, Loader, Sparkles } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

interface BatchItem {
    id: string;
    file: File;
    originalUrl: string;
    processedUrl: string | null;
    status: 'pending' | 'processing' | 'done' | 'error';
    errorMsg?: string;
}

export const BatchProcessingPanel: React.FC = () => {
    const [items, setItems] = useState<BatchItem[]>([]);
    const [isProcessingAll, setIsProcessingAll] = useState(false);

    const handleFilesSelect = (files: FileList | null) => {
        if (!files) return;
        const newItems: BatchItem[] = Array.from(files)
            .filter((f) => f.type.startsWith('image/'))
            .map((file) => ({
                id: Math.random().toString(36).substring(7),
                file,
                originalUrl: URL.createObjectURL(file),
                processedUrl: null,
                status: 'pending',
            }));

        setItems((prev) => [...prev, ...newItems]);
    };

    const handleRemoveItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const processBatch = async () => {
        setIsProcessingAll(true);

        for (const item of items) {
            if (item.status === 'done') continue;

            setItems((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, status: 'processing' } : i))
            );

            try {
                const blob = await removeBackground(item.originalUrl);
                const processedUrl = URL.createObjectURL(blob);

                setItems((prev) =>
                    prev.map((i) =>
                        i.id === item.id ? { ...i, status: 'done', processedUrl } : i
                    )
                );
            } catch (err: any) {
                setItems((prev) =>
                    prev.map((i) =>
                        i.id === item.id ? { ...i, status: 'error', errorMsg: err.message || 'Erreur' } : i
                    )
                );
            }
        }

        setIsProcessingAll(false);
    };

    const downloadItem = (item: BatchItem) => {
        if (!item.processedUrl) return;
        const a = document.createElement('a');
        a.href = item.processedUrl;
        a.download = `no-bg-${item.file.name.replace(/\.[^/.]+$/, '')}.png`;
        a.click();
    };

    const downloadAll = () => {
        items.forEach((item) => {
            if (item.status === 'done' && item.processedUrl) {
                downloadItem(item);
            }
        });
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Header banner */}
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
                        <Layers size={20} style={{ color: '#8B5CF6' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#F5F5F7' }}>
                            Studio Traitement par Lot (Batch Mode 100% Gratuit)
                            <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Sparkles size={12} /> ILLIMITÉ
                            </span>
                        </h3>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                        Importez et détourez plusieurs dizaines d'images simultanément en un seul clic.
                    </p>
                </div>
            </div>

            {/* Drop Zone */}
            <div
                onClick={() => document.getElementById('batch-file-input')?.click()}
                style={{
                    border: '2px dashed rgba(255,255,255,0.12)',
                    borderRadius: '0.75rem',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#12121A',
                    marginBottom: '1.5rem',
                    transition: 'all 0.2s ease',
                }}
            >
                <Upload size={40} style={{ color: '#8B5CF6', marginBottom: '0.75rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem 0', color: '#F5F5F7' }}>
                    Sélectionnez plusieurs images à détourer en masse
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>
                    Glissez-déposez ou cliquez ici pour importer des fichiers (PNG, JPG, WebP)
                </p>
                <input
                    id="batch-file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFilesSelect(e.target.files)}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Actions Bar */}
            {items.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F5F5F7' }}>
                        Fichiers en attente ({items.length})
                    </span>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={processBatch}
                            disabled={isProcessingAll}
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
                            }}
                        >
                            {isProcessingAll ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={16} />}
                            {isProcessingAll ? 'Traitement du lot...' : 'Détourer le Lot Complet'}
                        </button>

                        <button
                            onClick={downloadAll}
                            disabled={!items.some((i) => i.status === 'done')}
                            style={{
                                padding: '0.6rem 1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: '#12121A',
                                color: '#F5F5F7',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: items.some((i) => i.status === 'done') ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: items.some((i) => i.status === 'done') ? 1 : 0.5,
                            }}
                        >
                            <Download size={16} /> Tout Télécharger
                        </button>
                    </div>
                </div>
            )}

            {/* Batch Grid Items */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            background: '#12121A',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '0.75rem',
                            padding: '0.75rem',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        {/* Image Preview */}
                        <div
                            style={{
                                width: '100%',
                                height: '140px',
                                borderRadius: '0.5rem',
                                overflow: 'hidden',
                                background: '#0B0B0F',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '0.75rem',
                                position: 'relative',
                            }}
                        >
                            <img
                                src={item.processedUrl || item.originalUrl}
                                alt={item.file.name}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />

                            {/* Status Indicator overlay */}
                            {item.status === 'processing' && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                                </div>
                            )}

                            {item.status === 'done' && (
                                <span style={{ position: 'absolute', top: '6px', right: '6px', background: '#10b981', color: 'white', borderRadius: '50%', padding: '2px' }}>
                                    <CheckCircle2 size={16} />
                                </span>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F5F5F7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>
                                {item.file.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>
                                {(item.file.size / 1024).toFixed(0)} KB • {item.status.toUpperCase()}
                            </div>
                        </div>

                        {/* Item Footer actions */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '4px' }}
                            >
                                <Trash2 size={16} />
                            </button>

                            {item.status === 'done' && (
                                <button
                                    onClick={() => downloadItem(item)}
                                    style={{
                                        border: 'none',
                                        background: '#8B5CF6',
                                        color: 'white',
                                        borderRadius: '0.375rem',
                                        padding: '0.25rem 0.5rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                    }}
                                >
                                    <Download size={12} /> Télécharger
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
