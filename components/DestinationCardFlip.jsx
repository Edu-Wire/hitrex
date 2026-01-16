"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import { FaMountain, FaRoute, FaClock } from "react-icons/fa";

const oswald = Oswald({ subsets: ["latin"] });

export default function DestinationCardFlip({ dest, index }) {
    return (
        <div
            className="group/card h-[480px] sm:h-[480px] lg:h-[520px] perspective-[1500px]"
        >
            <div className="relative h-full w-full transition-transform duration-700 transform-3d group-hover/card:transform-[rotateY(180deg)]">
                {/* FRONT */}
                <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-xl">
                    <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-6 sm:bottom-8 left-5 sm:left-6">
                        <h3
                            className={`${oswald.className} text-2xl sm:text-3xl text-white font-bold`}
                        >
                            {dest.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-300">{dest.location}</p>
                    </div>
                </div>

                {/* BACK */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-zinc-900 p-6 flex flex-col justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FaMountain className="text-emerald-500" />
                            Technical Intel
                        </h4>

                        <p className="text-sm text-zinc-400 italic line-clamp-4">
                            {dest.description}
                        </p>

                        <div className="mt-6 space-y-3">
                            <Info icon={<FaRoute />} label="Route" value="Scrambling" />
                            <Info icon={<FaClock />} label="Duration" value="14–18 Days" />
                        </div>
                    </div>

                    <Link
                        href={`/page/destination/${dest._id || dest.id}`}
                        className="bg-emerald-600 hover:bg-emerald-500 transition text-white py-3 rounded-lg text-xs uppercase tracking-widest block text-center"
                    >
                        Initialize Booking
                    </Link>
                </div>
            </div>
        </div>
    );
}

function Info({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 text-sm text-white">
            <span className="text-emerald-500">{icon}</span>
            <span className="text-zinc-400">{label}:</span>
            <span>{value}</span>
        </div>
    );
}
