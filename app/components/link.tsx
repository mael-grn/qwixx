"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const MotionLink = motion.create(Link);

export interface ButtonParams {
    title: string;
    endpoint: string;
    delay?: number;
    small?: boolean;
}

export default function CLink({ title, endpoint, delay, small = false }: ButtonParams) {
    return (
        <MotionLink
            href={endpoint}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                delay: delay ?? 0,
                duration: 0.4,
                ease: "easeOut"
            }}
            whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{
                scale: 0.90,
                boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.4)",
                transition: { duration: 0.08, ease: "easeOut" }
            }}
            className={`relative flex items-center justify-center gap-1.5 font-bold rounded-full overflow-hidden cursor-pointer border border-white/25 bg-variant text-black select-none shadow-[0_6px_16px_rgba(0,0,0,0.3)] active:translate-y-0.5 ${
                small ? "px-3.5 py-1.5 text-sm" : "px-5 py-2.5 text-base"
            }`}
        >
            {/* Biseau supérieur (effet 3D de relief) */}
            <span
                className="absolute inset-x-0 top-0 h-[45%] rounded-t-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none"
            />

            {/* Ombrage interne inférieur pour creuser le relief */}
            <span
                className="absolute inset-x-0 bottom-0 h-[35%] rounded-b-full bg-gradient-to-t from-black/25 to-transparent pointer-events-none"
            />

            {/* Balayage de reflet brillant animé en boucle */}
            <motion.span
                className={`absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none ${
                    small ? "w-8" : "w-12"
                }`}
                initial={{ left: "-100%" }}
                animate={{ left: "200%" }}
                transition={{
                    repeat: Infinity,
                    repeatDelay: 3.5,
                    duration: 1.2,
                    ease: "easeInOut",
                    delay: (delay ?? 0) + 0.4
                }}
            />

            {/* Contenu textuel noir */}
            <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                {title}
            </span>
        </MotionLink>
    );
}