"use client"

import CLink from "@/app/components/link";
import {GameUtil} from "@/app/util/gameUtil";

export default function Home() {
  return <div className={"flex justify-center items-center w-full h-screen gap-4 flex-col"}>
    <img src={"qwixx.png"} alt={"logo"} className={"w-48 mb-10"}/>
    <CLink title={GameUtil.gameAlreadyStarted() ? "Reprendre la partie" : "Nouvelle partie"} endpoint={"/play"}/>
    <CLink title={"Tableau des scores"} endpoint={"/rank"}/>
  </div>;
}
