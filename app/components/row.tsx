"use client";

import { rowColor } from "@/app/types/rowColor";
import { useState, useEffect, useRef } from "react";
import { GameUtil } from "@/app/util/gameUtil";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export interface rowParams {
    color: rowColor;
    delay?: number;
}

const colorStyles: Record<
    rowColor,
    { bgContainer: string; bgChecked: string; borderBtn: string; textBtn: string; glowShadow: string }
> = {
    red: {
        bgContainer: "bg-red/75",
        bgChecked: "bg-red",
        borderBtn: "border-red",
        textBtn: "text-red",
        glowShadow: "rgba(239, 68, 68, 0.7)",
    },
    yellow: {
        bgContainer: "bg-yellow/75",
        bgChecked: "bg-yellow",
        borderBtn: "border-yellow",
        textBtn: "text-yellow",
        glowShadow: "rgba(234, 179, 8, 0.8)",
    },
    green: {
        bgContainer: "bg-green/75",
        bgChecked: "bg-green",
        borderBtn: "border-green",
        textBtn: "text-green",
        glowShadow: "rgba(34, 197, 94, 0.7)",
    },
    blue: {
        bgContainer: "bg-blue/75",
        bgChecked: "bg-blue",
        borderBtn: "border-blue",
        textBtn: "text-blue",
        glowShadow: "rgba(59, 130, 246, 0.7)",
    },
};

const getContainerVariants = (delayChildren: number = 0): Variants => ({
    hidden: { opacity: 0, x: -30 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delayChildren,
            staggerChildren: 0.05,
        },
    },
});

const buttonItemVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.7 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
        },
    },
};

export default function Row({ color, delay = 0 }: rowParams) {
    const [values, setValues] = useState<number[]>(() => {
        const checked = GameUtil.recoverChecked();
        return checked[color] ?? [];
    });
    const [rowFinished, setRowFinished] = useState(GameUtil.listFinished(color));

    const onToggle = (number: number) => {
        GameUtil.toggleCase(color, number);
        const checked = GameUtil.recoverChecked();
        const list = checked[color] ?? [];
        setValues(list);
        setRowFinished(GameUtil.listFinished(color));
    };

    const unFinishRow = () => {
        if (rowFinished) {
            if (["red", "yellow"].includes(color)) {
                GameUtil.toggleCase(color, 12);
            } else {
                GameUtil.toggleCase(color, 2);
            }
            const checked = GameUtil.recoverChecked();
            const list = checked[color] ?? [];
            setValues(list);
            setRowFinished(GameUtil.listFinished(color));
        }
    };

    const styles = colorStyles[color];
    const isDecreasing = color === "green" || color === "blue";
    const numbers = isDecreasing
        ? Array.from({ length: 11 }, (_, i) => 12 - i)
        : Array.from({ length: 11 }, (_, i) => i + 2);
    const lastNumber = isDecreasing ? 2 : 12;

    return (
        <motion.div
            variants={getContainerVariants(delay)}
            initial="hidden"
            animate="show"
            className={`flex w-fit relative overflow-hidden ${styles.bgContainer} gap-1 items-center p-1 rounded-2xl`}
        >
            {numbers.map((num) => (
                <RowButton
                    key={num}
                    color={color}
                    number={num}
                    checked={values.includes(num)}
                    canCheck={GameUtil.canCheck(color, num)}
                    onPress={() => onToggle(num)}
                />
            ))}

            <AnimatePresence>
                {rowFinished && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="w-full h-full bg-black/35 absolute left-0 top-0 pointer-events-none z-0"
                    />
                )}
            </AnimatePresence>

            <motion.div
                onClick={rowFinished ? unFinishRow : () => console.log("You cannot finish this row at the moment")}
                whileHover={rowFinished ? { scale: 1.1, rotate: 6 } : undefined}
                whileTap={rowFinished ? { scale: 0.9 } : undefined}
                className={`w-8 h-8 ml-4 rounded-full relative z-10 overflow-hidden border-2 shadow-sm ${styles.borderBtn} ${
                    rowFinished ? "bg-white cursor-pointer" : "bg-gray-300 cursor-not-allowed opacity-75"
                } flex items-center justify-center`}
            >
                <motion.img
                    src={rowFinished ? "lock-close.svg" : "lock-open.svg"}
                    alt="close row"
                    className="w-4 h-4"
                    animate={{ scale: rowFinished ? [0.7, 1] : 1, rotate: rowFinished ? [-30, 0] : 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 15 }}
                />
            </motion.div>
        </motion.div>
    );
}

interface buttonParams {
    color: rowColor;
    number: number;
    checked: boolean;
    canCheck: boolean;
    onPress: () => void;
}

function RowButton({ color, number, checked, canCheck, onPress }: buttonParams) {
    const styles = colorStyles[color];

    // Détection de la perte d'accessibilité et du passage à l'état coché
    const prevCanCheckRef = useRef(canCheck);
    const prevCheckedRef = useRef(checked);
    const [justLocked, setJustLocked] = useState(false);
    const [justChecked, setJustChecked] = useState(false);

    useEffect(() => {
        if (prevCanCheckRef.current && !canCheck && !checked) {
            setJustLocked(true);
            const timer = setTimeout(() => setJustLocked(false), 600);
            return () => clearTimeout(timer);
        }
        prevCanCheckRef.current = canCheck;
    }, [canCheck, checked]);

    useEffect(() => {
        if (!prevCheckedRef.current && checked) {
            setJustChecked(true);
            const timer = setTimeout(() => setJustChecked(false), 300);
            return () => clearTimeout(timer);
        }
        prevCheckedRef.current = checked;
    }, [checked]);

    const isLockedOut = !checked && !canCheck;

    return (
        <motion.div
            variants={buttonItemVariants}
            onClick={canCheck ? onPress : undefined}
            animate={
                justChecked
                    ? {
                        scale: [1, 1.15, 0.95, 1],
                        boxShadow: [
                            "0 1px 2px rgba(0,0,0,0.05)",
                            `0 0 14px 2px ${styles.glowShadow}`,
                            "0 1px 2px rgba(0,0,0,0.05)",
                        ],
                    }
                    : justLocked
                        ? {
                            x: [0, -5, 5, -4, 4, -2, 2, 0],
                            rotate: [0, -4, 4, -3, 3, 0],
                            scale: [1, 0.92, 1],
                        }
                        : { x: 0, rotate: 0, scale: 1, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }
            }
            transition={
                justChecked
                    ? { duration: 0.3, ease: "easeOut" }
                    : justLocked
                        ? { duration: 0.5, ease: "easeInOut" }
                        : { duration: 0.2 }
            }
            className={`w-10 h-10 rounded-xl relative z-10 overflow-hidden border-2 transition-colors duration-200 ${styles.borderBtn} ${
                checked ? styles.bgChecked : "bg-white"
            } ${canCheck ? "cursor-pointer" : "cursor-not-allowed"} flex items-center justify-center`}
        >
            {/* Voile sombre & croix de pénalité / perte */}
            <AnimatePresence>
                {isLockedOut && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 bg-neutral-950/60 z-20 flex items-center justify-center pointer-events-none"
                    >
                        {justLocked && (
                            <motion.div
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: 0 }}
                                transition={{ duration: 0.45 }}
                                className="absolute inset-0 bg-red-600 z-10"
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.p
                animate={justChecked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`text-xl ${checked ? "text-white" : styles.textBtn} font-bold relative z-10 select-none`}
            >
                {number}
            </motion.p>
        </motion.div>
    );
}