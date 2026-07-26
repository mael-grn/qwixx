"use client"

import { rowColor } from "@/app/types/rowColor";
import { useState } from "react";
import { GameUtil } from "@/app/util/gameUtil";

export interface rowParams {
    color: rowColor;
}

// 1. Dictionnaire des classes Tailwind explicites
const colorStyles: Record<rowColor, { bgContainer: string; bgChecked: string; borderBtn: string; textBtn: string }> = {
    red: {
        bgContainer: "bg-red-500/70",
        bgChecked: "bg-red-500",
        borderBtn: "border-red-500",
        textBtn: "text-red-500",
    },
    yellow: {
        bgContainer: "bg-yellow-500/70",
        bgChecked: "bg-yellow-500",
        borderBtn: "border-yellow-500",
        textBtn: "text-yellow-500",
    },
    green: {
        bgContainer: "bg-green-500/70",
        bgChecked: "bg-green-500",
        borderBtn: "border-green-500",
        textBtn: "text-green-500",
    },
    blue: {
        bgContainer: "bg-blue-500/70",
        bgChecked: "bg-blue-500",
        borderBtn: "border-blue-500",
        textBtn: "text-blue-500",
    },
};

export default function Row({ color }: rowParams) {
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
        // Vérifie et met à jour l'état verrouillé
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

    return (
        <div className={`flex w-fit relative overflow-hidden ${styles.bgContainer} gap-1 items-center p-1 rounded-xl`}>
            {(color === "green" || color === "blue"
                    ? Array.from({ length: 11 }, (_, i) => 12 - i) // 12 à 2
                    : Array.from({ length: 11 }, (_, i) => i + 2)  // 2 à 12
            ).map((num) => (
                <RowButton
                    key={num}
                    color={color}
                    number={num}
                    checked={values.includes(num)}
                    canCheck={GameUtil.canCheck(color, num)}
                    onPress={() => onToggle(num)}
                />
            ))}
            {
                rowFinished && <span className={"w-full h-full bg-black/35 absolute left-0 top-0"}/>
            }
            <div onClick={rowFinished ? unFinishRow : () => console.log("You cannot finish this row at the moment")} className={`w-8 h-8 ml-4 rounded-full relative overflow-hidden border-2 ${styles.borderBtn} ${
                rowFinished ? "bg-white cursor-pointer" : "bg-gray-300 cursor-not-allowed"
            } flex items-center justify-center`}>
                <img src={rowFinished ? "lock-close.svg" : "lock-open.svg"} alt="close row" className={" w-4 h-4"} />
            </div>
        </div>
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

    return (
        <div
            onClick={canCheck ? onPress : undefined}
            className={`w-10 h-10 rounded-2xl relative overflow-hidden border-2 ${styles.borderBtn} ${
                checked ? styles.bgChecked : canCheck ? "bg-white" : "bg-gray-300"
            } ${canCheck ? "cursor-pointer" : "cursor-not-allowed"} flex items-center justify-center`}
        >
            <p className={`text-xl ${checked ? "text-white" : styles.textBtn} font-bold`}>{number}</p>
        </div>
    );
}