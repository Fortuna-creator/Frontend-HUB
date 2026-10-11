import React, { type ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        // Overlay gelap — title ditampilkan di atas kotak putih (kiri atas)
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70">
            <div className="w-full max-w-md">

                {/* Judul di atas modal (pada overlay) */}
                {title && (
                    <p className="text-white text-sm font-medium mb-2 pl-1">{title}</p>
                )}

                {/* Kotak putih modal */}
                <div className="bg-white rounded w-full shadow-2xl">
                    {/* Tombol tutup pojok kanan atas */}
                    <div className="flex justify-end pt-3 pr-4">
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-700 text-xl leading-none font-light transition-colors"
                            aria-label="Tutup"
                        >
                            ×
                        </button>
                    </div>

                    {/* Konten */}
                    <div className="px-8 pb-8 pt-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
