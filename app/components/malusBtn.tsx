"use client";

import { useState } from "react";
import { GameUtil } from "@/app/util/gameUtil";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export interface MalusBtnParams {
    initChecked: boolean;
}

const lineVariants1: Variants = {
    hidden: { scaleX: 0, rotate: 45, opacity: 0 },
    show: {
        scaleX: 1,
        rotate: 45,
        opacity: 1,
        transition: { type: "spring", stiffness: 500, damping: 25 },
    },
    exit: { scaleX: 0, opacity: 0, transition: { duration: 0.15 } },
};

const lineVariants2: Variants = {
    hidden: { scaleX: 0, rotate: -45, opacity: 0 },
    show: {
        scaleX: 1,
        rotate: -45,
        opacity: 1,
        transition: { type: "spring", stiffness: 500, damping: 25, delay: 0.05 },
    },
    exit: { scaleX: 0, opacity: 0, transition: { duration: 0.15 } },
};

export default function MalusBtn({ initChecked }: MalusBtnParams) {
    const [checked, setChecked] = useState(initChecked);

    const onClick = () => {
        if (checked) {
            GameUtil.decrementMalus();
            setChecked(false);
        } else {
            GameUtil.incrementMalus();
            setChecked(true);
        }
    };

    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            animate={
                checked
                    ? {
                        scale: [1, 1.25, 0.95, 1],
                        rotate: [0, -8, 8, 0],
                        backgroundColor: "#fecaca",
                    }
                    : {
                        scale: 1,
                        rotate: 0,
                        backgroundColor: "#e5e7eb",
                    }
            }
            transition={
                checked
                    ? { duration: 0.35, ease: "easeInOut" }
                    : { type: "spring", stiffness: 400, damping: 15 }
            }
            className="w-6 h-6 cursor-pointer rounded-lg overflow-hidden relative flex items-center justify-center select-none shadow-sm border border-gray-300"
        >
            <AnimatePresence>
                {checked && (
                    <>
                        <motion.span
                            variants={lineVariants1}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="h-0.5 w-4 absolute bg-red-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center rounded-full"
                        />
                        <motion.span
                            variants={lineVariants2}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="h-0.5 w-4 absolute bg-red-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center rounded-full"
                        />
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}