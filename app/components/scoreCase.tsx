"use client";

import { rowColor } from "@/app/types/rowColor";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export interface scoreCaseParams {
    color: rowColor | "gray" | "black";
    value: number;
}

const colorStyles: Record<rowColor | "gray" | "black", string> = {
    red: "bg-red",
    yellow: "bg-yellow",
    green: "bg-green",
    blue: "bg-blue",
    gray: "bg-gray-500",
    black: "bg-black",
};

const ITEM_HEIGHT = 32;

export default function ScoreCase({ color, value }: scoreCaseParams) {
    const [sequence, setSequence] = useState<number[]>([value]);
    const prevValueRef = useRef(value);

    useEffect(() => {
        if (value !== prevValueRef.current) {
            const prev = prevValueRef.current;
            const diff = value - prev;
            const step = diff > 0 ? 1 : -1;
            const newSeq: number[] = [];

            // Si le saut est grand, on limite à 8 étapes intermédiaires maximum
            if (Math.abs(diff) > 8) {
                const totalSteps = 6;
                for (let i = 0; i <= totalSteps; i++) {
                    newSeq.push(Math.round(prev + (diff * i) / totalSteps));
                }
            } else {
                for (let i = prev; step > 0 ? i <= value : i >= value; i += step) {
                    newSeq.push(i);
                }
            }

            setSequence(newSeq);
            prevValueRef.current = value;
        }
    }, [value]);

    const targetOffset = -((sequence.length - 1) * ITEM_HEIGHT);

    return (
        <div
            className={`${colorStyles[color]} rounded-xl px-3 min-w-[3rem] h-8 relative overflow-hidden flex items-center justify-center shadow-sm select-none`}
        >
            <div className="relative h-8 w-full overflow-hidden flex items-start justify-center">
                <motion.div
                    key={`${sequence[0]}-${sequence[sequence.length - 1]}`}
                    initial={{ y: 0 }}
                    animate={{ y: targetOffset }}
                    transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 24,
                        mass: 0.7,
                    }}
                    className="absolute top-0 left-0 right-0 flex flex-col items-center"
                >
                    {sequence.map((num, i) => (
                        <div
                            key={i}
                            className="h-8 flex items-center justify-center w-full"
                        >
                            <span className="font-bold text-white text-lg tabular-nums leading-none">
                                {num}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}