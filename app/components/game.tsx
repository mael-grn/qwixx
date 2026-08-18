"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Button from "@/app/components/button";
import { GameUtil } from "@/app/util/gameUtil";
import MalusBtn from "@/app/components/malusBtn";
import ScoreCase from "@/app/components/scoreCase";
import { motion } from "framer-motion";
import CLink from "@/app/components/link";

const Row = dynamic(() => import('@/app/components/row'), { ssr: false });

export default function Game() {
    const [resetKey, setResetKey] = useState(0);
    const [, setTick] = useState(0);
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const handleUpdate = () => setTick((t) => t + 1);

        const handleResize = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        // Vérification initiale de l'orientation
        handleResize();

        window.addEventListener("storage", handleUpdate);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("storage", handleUpdate);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleReset = () => {
        GameUtil.reset();
        setResetKey((prev) => prev + 1);
    };

    return (
        <motion.div
            initial={{background: "linear-gradient(to top, #011c3a, #011c3a)"}}
            animate={{background: "linear-gradient(to top, #011c3a, #026ba5)"}}
            transition={{duration: 1}}
            className="flex min-h-screen w-full justify-center items-center overflow-hidden">
            <div
                className={`flex flex-col justify-center items-center gap-2 p-2 transition-transform duration-300 ${
                    isPortrait ? "rotate-90 scale-90" : ""
                }`}
            >
                <div className={"flex self-end items-center justify-center gap-2"}>
                    <CLink small={true} title={"Accueil"} endpoint={"/"}/>
                </div>

                <div className="flex flex-col items-center gap-2 w-fit">

                    <Row key={`red-${resetKey}`} color="red" />
                    <Row key={`yellow-${resetKey}`} color="yellow" delay={0.2}/>
                    <Row key={`green-${resetKey}`} color="green" delay={0.4}/>
                    <Row key={`blue-${resetKey}`} color="blue" delay={0.6}/>

                    <div className="flex text-white font-bold justify-end items-center gap-2 w-fit self-end">
                        <p>Malus</p>
                        {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
                            <MalusBtn key={`malus-${num}-${resetKey}`} initChecked={GameUtil.getMalus() >= num} />
                        ))}
                    </div>

                    <div className="flex justify-start items-center gap-2 w-full">
                        <ScoreCase color={"red"} value={GameUtil.totalRow("red")} />
                        <p>+</p>
                        <ScoreCase color={"yellow"} value={GameUtil.totalRow("yellow")} />
                        <p>+</p>
                        <ScoreCase color={"green"} value={GameUtil.totalRow("green")} />
                        <p>+</p>
                        <ScoreCase color={"blue"} value={GameUtil.totalRow("blue")} />
                        <p>-</p>
                        <ScoreCase color={"gray"} value={GameUtil.totalMalus()} />
                        <p>=</p>
                        <ScoreCase color={"black"} value={GameUtil.total()} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}