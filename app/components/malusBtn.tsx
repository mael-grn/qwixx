import {useState} from "react";
import {GameUtil} from "@/app/util/gameUtil";

export interface MalusBtnParams {
    initChecked: boolean;
}

export default function MalusBtn({ initChecked }: MalusBtnParams) {

    const [checked, setChecked] = useState(initChecked);

    const onClick = () => {
        if (checked) {
            GameUtil.decrementMalus()
            setChecked(false)
        } else {
            GameUtil.incrementMalus()
            setChecked(true)
        }
    }
    return (
        <div
            onClick={onClick}
            className="w-6 h-6 cursor-pointer rounded-lg bg-gray-300 active:bg-gray-400 overflow-hidden relative flex items-center justify-center select-none"
        >
            {checked && (
                <>
                    <span className="h-0.5 w-4 absolute bg-black top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full" />
                    <span className="h-0.5 w-4 absolute bg-black top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full" />
                </>
            )}
        </div>
    );
}