import Link from "next/link";

export interface ButtonParams {
    title: string;
    endpoint: string;
}
export default function CLink({title, endpoint}: ButtonParams) {
    return <Link href={endpoint} className={"flex justify-center px-2 cursor-pointer py-1 items-center gap-2 border-0 rounded-xl bg-gray-400 active:bg-gray-300"}>
        {title}
    </Link>
}