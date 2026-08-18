"use client"

import CLink from "@/app/components/link";
import {GameUtil} from "@/app/util/gameUtil";
import { motion } from "framer-motion";

export default function Home() {
  return <motion.div
      initial={{background: "linear-gradient(to top, #011c3a, #011c3a)"}}
      animate={{background: "linear-gradient(to top, #011c3a, #026ba5)"}}
      transition={{duration: 1}}
      className={"flex justify-center items-center w-full h-screen gap-4 flex-col"}>
    <motion.img
        initial={{translateY: -100, opacity: 0}}
        animate={{translateY: 0, opacity: 1}}
        src={"qwixx.png"}
        alt={"logo"}
        className={"w-3/4 max-w-72 mb-10"}
    />
    <CLink title={"Nouvelle partie"} endpoint={"/play?reset=true"}/>
    {
      GameUtil.gameAlreadyStarted() ? <CLink delay={0.1} title={"Reprendre la partie"} endpoint={"/play"}/> : <></>
    }
  </motion.div>;
}
