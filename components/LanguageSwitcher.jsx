"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "nl", label: "Nederlands", flag: "🇳🇱" },
];

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const locale = useLocale();
    const containerRef = useRef(null);

    const currentLang = languages.find((l) => l.code === locale) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const changeLanguage = (langCode) => {
        document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000; SameSite=Lax`;
        window.location.reload();
    };

    return (
        <div className="fixed top-6 right-6 z-[100]" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl hover:bg-black/60 transition-all group shadow-2xl"
            >
                <div className="w-6 h-6 flex items-center justify-center text-lg">
                    {currentLang.flag}
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                    {currentLang.code}
                </span>
                <svg
                    className={`w-3.5 h-3.5 text-emerald-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-48 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden p-2"
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${locale === lang.code
                                        ? "text-emerald-500 bg-emerald-500/5"
                                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <span>{lang.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
