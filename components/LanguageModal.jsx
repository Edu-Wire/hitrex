"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"] });

const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "nl", label: "Nederlands", flag: "🇳🇱" },
];

export default function LanguageModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check for locale cookie
        const hasCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("NEXT_LOCALE="));

        if (!hasCookie) {
            setIsOpen(true);
        }
    }, []);

    const selectLanguage = (langCode) => {
        // Set cookie for 1 year
        document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000; SameSite=Lax`;
        setIsOpen(false);
        // Reload to apply language
        window.location.reload();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-md p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl opacity-50" />

                        <div className="relative z-10 text-center space-y-8">
                            <div className="space-y-2">
                                <span className="text-emerald-500 text-xs font-bold uppercase tracking-[0.2em]">Welcome / Bienvenue / Welkom</span>
                                <h2 className={`${oswald.className} text-3xl text-white font-bold uppercase tracking-tight`}>
                                    Choose Language
                                </h2>
                                <p className="text-zinc-400 text-sm">Please select your preferred language to continue.</p>
                            </div>

                            <div className="grid gap-3">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => selectLanguage(lang.code)}
                                        className="flex items-center justify-between px-6 py-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="text-2xl">{lang.flag}</span>
                                            <span className={`${oswald.className} text-lg text-zinc-200 uppercase font-medium group-hover:text-white transition-colors`}>
                                                {lang.label}
                                            </span>
                                        </span>
                                        <div className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-emerald-500 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
