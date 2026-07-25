"use client"

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Button from "@/app/components/button";
import { GameUtil } from "@/app/util/gameUtil";
import MalusBtn from "@/app/components/malusBtn";
import ScoreCase from "@/app/components/scoreCase";

const Row = dynamic(() => import('@/app/components/row'), { ssr: false });

export default function Game() {
    const [resetKey, setResetKey] = useState(0);
    const [, setTick] = useState(0);

    useEffect(() => {
        const handleUpdate = () => setTick((t) => t + 1);
        window.addEventListener("storage", handleUpdate);
        return () => window.removeEventListener("storage", handleUpdate);
    }, []);

    const handleReset = () => {
        GameUtil.reset();
        setResetKey((prev) => prev + 1);
    };

    return (
        <div className="flex flex-col justify-center items-center gap-2 p-2">
            <div className="flex flex-col items-center gap-2 w-fit">
                <div className="flex justify-end items-center gap-2 w-full">
                    <Button title="Reset" onClickAction={handleReset} />
                </div>

                <Row key={`red-${resetKey}`} color="red" />
                <Row key={`yellow-${resetKey}`} color="yellow" />
                <Row key={`green-${resetKey}`} color="green" />
                <Row key={`blue-${resetKey}`} color="blue" />

                <div className="flex justify-end items-center gap-2 w-full">
                    <p>Malus : </p>
                    {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
                        <MalusBtn key={num} initChecked={GameUtil.getMalus() >= num} />
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
                </div>
            </div>
        </div>
    );
}