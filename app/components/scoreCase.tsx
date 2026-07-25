import { rowColor } from "@/app/types/rowColor";

export interface scoreCaseParams {
    color: rowColor|"gray";
    value: number;
}

const colorStyles: Record<rowColor|"gray", string> = {
    red: "border-red-500 text-red-500",
    yellow: "border-yellow-500 text-yellow-500",
    green: "border-green-500 text-green-500",
    blue: "border-blue-500 text-blue-500",
    gray: "border-gray-500 text-gray-500"
};

export default function ScoreCase({ color, value }: scoreCaseParams) {
    return (
        <div className={`${colorStyles[color]} border-2 rounded-xl px-3 py-1`}>
            <p className="font-bold text-center">{value}</p>
        </div>
    );
}