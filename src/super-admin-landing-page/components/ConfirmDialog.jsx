import React from 'react';
import { AlertTriangle, CheckCircle, X, AlertCircle } from 'lucide-react';

/**
 * Modern Confirmation Dialog Component
 * @param {boolean} isOpen - Controls dialog visibility
 * @param {function} onClose - Close handler
 * @param {function} onConfirm - Confirm action handler
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} type - Dialog type: 'danger', 'warning', 'success', 'info'
 * @param {string} confirmText - Text for confirm button
 * @param {string} cancelText - Text for cancel button
 */
export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    type = "warning",
    confirmText = "Confirm",
    cancelText = "Cancel"
}) {
    if (!isOpen) return null;

    const typeConfig = {
        danger: {
            icon: AlertTriangle,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            gradient: 'from-red-500 to-pink-500',
            buttonBg: 'bg-red-600 hover:bg-red-700',
            borderColor: 'border-red-200'
        },
        warning: {
            icon: AlertCircle,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            gradient: 'from-yellow-500 to-orange-500',
            buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
            borderColor: 'border-yellow-200'
        },
        success: {
            icon: CheckCircle,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            gradient: 'from-green-500 to-emerald-500',
            buttonBg: 'bg-green-600 hover:bg-green-700',
            borderColor: 'border-green-200'
        },
        info: {
            icon: AlertCircle,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            gradient: 'from-blue-500 to-cyan-500',
            buttonBg: 'bg-blue-600 hover:bg-blue-700',
            borderColor: 'border-blue-200'
        }
    };

    const config = typeConfig[type] || typeConfig.warning;
    const Icon = config.icon;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto transform animate-scaleIn"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with gradient */}
                    <div className={`bg-gradient-to-r ${config.gradient} p-6 rounded-t-2xl`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`${config.iconBg} p-3 rounded-xl`}>
                                    <Icon className={`${config.iconColor} w-6 h-6`} />
                                </div>
                                <h3 className="text-xl font-bold text-white">{title}</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-gray-700 text-base leading-relaxed">{message}</p>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`px-6 py-2.5 rounded-xl ${config.buttonBg} text-white font-semibold shadow-lg transition-all hover:scale-105 active:scale-95`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
