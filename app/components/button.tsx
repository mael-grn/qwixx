
export interface ButtonParams {
    title: string;
    onClickAction: () => void;
}
export default function Button({title, onClickAction}: ButtonParams) {
    return <button className={"flex justify-center px-2 cursor-pointer py-1 items-center gap-2 border-0 rounded-xl bg-gray-300 active:bg-gray-400"} onClick={onClickAction}>
        {title}
    </button>
}