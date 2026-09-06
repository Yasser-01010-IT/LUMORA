import React, { useState } from 'react';
import {
    X,
    Check,
    Zap,
    Crown,
    Building2,
    Star,
    Unlock
} from 'lucide-react';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    isProUser: boolean;
    setIsProUser: (val: boolean) => void;
    userPlan: string;
    setUserPlan: (plan: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
    isOpen,
    onClose,
    isProUser,
    setIsProUser,
    userPlan,
    setUserPlan,
}) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    if (!isOpen) return null;

    const handleSelectPlan = (planId: string) => {
        if (planId === 'free') {
            setIsProUser(false);
            setUserPlan('free');
        } else {
            setIsProUser(true);
            setUserPlan(planId);
        }
        onClose();
    };

    const handleToggleSimulatePro = () => {
        const nextState = !isProUser;
        setIsProUser(nextState);
        setUserPlan(nextState ? 'pro' : 'free');
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(10px)',
                animation: 'fadeIn 0.25s ease-out',
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '1100px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: '1.5rem',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                    padding: '2.5rem 2rem',
                    color: 'var(--color-text-primary)',
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.25rem',
                        right: '1.25rem',
                        background: 'var(--color-bg-primary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 1rem',
                            borderRadius: '2rem',
                            background: 'rgba(217, 119, 87, 0.12)',
                            color: 'var(--color-accent-primary)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            marginBottom: '1rem',
                        }}
                    >
                        <Crown size={16} /> Studio AI Unlimited Access
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
                        Débloquez la Puissance AI Studio Pro
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Accédez à l'exportation 4K Ultra HD, le traitement en lot, la gomme magique IA et la relumière studio.
                    </p>

                    {/* Billing Cycle Switch */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: 'var(--color-bg-primary)',
                            padding: '0.35rem',
                            borderRadius: '2rem',
                            border: '1px solid var(--color-border)',
                            marginTop: '1.5rem',
                            gap: '0.25rem',
                        }}
                    >
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '1.5rem',
                                border: 'none',
                                background: billingCycle === 'monthly' ? 'var(--color-accent-primary)' : 'transparent',
                                color: billingCycle === 'monthly' ? 'white' : 'var(--color-text-secondary)',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            Facturation Mensuelle
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '1.5rem',
                                border: 'none',
                                background: billingCycle === 'yearly' ? 'var(--color-accent-primary)' : 'transparent',
                                color: billingCycle === 'yearly' ? 'white' : 'var(--color-text-secondary)',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                            }}
                        >
                            Facturation Annuelle
                            <span
                                style={{
                                    background: 'rgba(255, 255, 255, 0.25)',
                                    color: 'white',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                }}
                            >
                                -25% OFF
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem',
                    }}
                >
                    {/* Free Starter Plan */}
                    <div
                        style={{
                            background: 'var(--color-bg-primary)',
                            borderRadius: '1.25rem',
                            padding: '1.75rem 1.5rem',
                            border: userPlan === 'free' ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                        }}
                    >
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Starter Free</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                                Idéal pour tester les fonctionnalités de base
                            </p>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>$0</span>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}> / pour toujours</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Détourage HD 1080p illimité
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Vectorisation SVG de base
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Scanner OCR Texte basique
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Modèles Hugging Face standards
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5, textDecoration: 'line-through' }}>
                                    <X size={16} style={{ color: 'var(--color-text-tertiary)' }} /> Exportation 4K Ultra HD
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5, textDecoration: 'line-through' }}>
                                    <X size={16} style={{ color: 'var(--color-text-tertiary)' }} /> Studio Batch en Lot
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => handleSelectPlan('free')}
                            style={{
                                marginTop: '1.75rem',
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--color-border)',
                                background: userPlan === 'free' ? 'var(--color-bg-secondary)' : 'transparent',
                                color: 'var(--color-text-primary)',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                            }}
                        >
                            {userPlan === 'free' ? 'Plan Actuel' : 'Passer à Starter'}
                        </button>
                    </div>

                    {/* Pro Studio Plan (POPULAR) */}
                    <div
                        style={{
                            background: 'linear-gradient(180deg, rgba(217, 119, 87, 0.08) 0%, var(--color-bg-primary) 100%)',
                            borderRadius: '1.25rem',
                            padding: '1.75rem 1.5rem',
                            border: '2px solid var(--color-accent-primary)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            boxShadow: '0 10px 25px -5px rgba(217, 119, 87, 0.25)',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-12px',
                                right: '1.5rem',
                                background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, #e89b7f 100%)',
                                color: 'white',
                                padding: '0.2rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                            }}
                        >
                            Plus Populaire
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                Pro Studio <Crown size={18} style={{ color: 'var(--color-accent-primary)' }} />
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                                Pour créateurs, designers et photographes
                            </p>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                                    ${billingCycle === 'yearly' ? '11.99' : '14.99'}
                                </span>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}> / mois</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                    <Check size={16} style={{ color: 'var(--color-accent-primary)' }} /> Exportation 4K Ultra HD sans compression
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                    <Check size={16} style={{ color: 'var(--color-accent-primary)' }} /> Studio Batch multi-images en masse
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                    <Check size={16} style={{ color: 'var(--color-accent-primary)' }} /> Gomme Magique IA (Object Eraser)
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                    <Check size={16} style={{ color: 'var(--color-accent-primary)' }} /> Générateur de Fonds Studio & Lumière IA
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: 'var(--color-accent-primary)' }} /> Exécution Hugging Face accélérée
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => handleSelectPlan('pro')}
                            style={{
                                marginTop: '1.75rem',
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                border: 'none',
                                background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(217, 119, 87, 0.4)',
                            }}
                        >
                            {userPlan === 'pro' ? 'Plan Pro Actif' : 'Obtenir Pro Studio (Essai 7j)'}
                        </button>
                    </div>

                    {/* Business Team Plan */}
                    <div
                        style={{
                            background: 'var(--color-bg-primary)',
                            borderRadius: '1.25rem',
                            padding: '1.75rem 1.5rem',
                            border: userPlan === 'business' ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                Business Team <Building2 size={18} />
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                                Pour agences et équipes e-commerce
                            </p>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                                    ${billingCycle === 'yearly' ? '31.99' : '39.99'}
                                </span>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}> / mois</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Tout dans Pro Studio
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> 5 Comptes d'équipe partagés
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Formats Vectoriels Pro (DXF, EPS)
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Licence Commerciale Complète
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Support Client Prioritaire 24/7
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => handleSelectPlan('business')}
                            style={{
                                marginTop: '1.75rem',
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--color-border)',
                                background: userPlan === 'business' ? 'var(--color-bg-secondary)' : 'transparent',
                                color: 'var(--color-text-primary)',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                            }}
                        >
                            {userPlan === 'business' ? 'Plan Business Actif' : 'Activer Business'}
                        </button>
                    </div>

                    {/* Enterprise Lifetime */}
                    <div
                        style={{
                            background: 'var(--color-bg-primary)',
                            borderRadius: '1.25rem',
                            padding: '1.75rem 1.5rem',
                            border: userPlan === 'lifetime' ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                Lifetime <Star size={18} style={{ color: '#eab308' }} />
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                                Accès à vie à toutes les futures IA
                            </p>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>$199</span>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}> / paiement unique</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Accès illimité à vie sans abonnement
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Mises à jour IA à vie garanties
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Quota API Hugging Face dédié
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} style={{ color: '#10b981' }} /> Traitement d'images 8K Ultra HD
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => handleSelectPlan('lifetime')}
                            style={{
                                marginTop: '1.75rem',
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--color-border)',
                                background: userPlan === 'lifetime' ? 'var(--color-bg-secondary)' : 'transparent',
                                color: 'var(--color-text-primary)',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                            }}
                        >
                            {userPlan === 'lifetime' ? 'Accès à Vie Actif' : 'Acheter à Vie'}
                        </button>
                    </div>
                </div>

                {/* Developer / Demo Instant Unlock Banner */}
                <div
                    style={{
                        background: isProUser
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(217, 119, 87, 0.08)',
                        border: `1px dashed ${isProUser ? '#10b981' : 'var(--color-accent-primary)'}`,
                        borderRadius: '1rem',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Unlock size={20} style={{ color: isProUser ? '#10b981' : 'var(--color-accent-primary)' }} />
                        <div>
                            <h4 style={{ margin: 0, fontSize: '0.925rem', fontWeight: 700 }}>
                                {isProUser ? 'Statut : Mode PRO Activé' : 'Mode Démonstration & Test Direct'}
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                {isProUser
                                    ? 'Vous bénéficiez de toutes les fonctionnalités Pro Studio (4K, Batch, Gomme Magique, Relighting).'
                                    : 'Basculez instantanément le mode PRO pour déverrouiller et tester toutes les fonctionnalités Premium dans l\'application.'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleToggleSimulatePro}
                        style={{
                            padding: '0.55rem 1.25rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: isProUser ? '#10b981' : 'var(--color-accent-primary)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <Zap size={15} />
                        {isProUser ? 'Désactiver le Mode Pro (Tester Free)' : 'Simuler le Déverrouillage PRO'}
                    </button>
                </div>
            </div>
        </div>
    );
};
