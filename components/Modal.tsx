"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
// Modal component props
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg";
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
    // Lock page scrolling while the modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        // Modal overlay 
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={cn(
                    "relative bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full",
                    size === "sm" && "max-w-sm",
                    size === "md" && "max-w-md",
                    size === "lg" && "max-w-2xl"
                )}
            >
                {/* Modal header */}
                {title && (
                    <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-800">
                        <h2 className="font-semibold text-neutral-900 dark:text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {/* Modal content */}
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}
