"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Game from "@/app/components/game";
import { GameUtil } from "@/app/util/gameUtil";

function PlayContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const hasReset = useRef(false);

    const isReset = searchParams.get("reset") === "true";

    // Réinitialisation synchrone avant l'initialisation des states de <Game />
    if (isReset && !hasReset.current) {
        hasReset.current = true;
        GameUtil.reset();
    }

    useEffect(() => {
        if (isReset) {
            // Nettoie l'URL pour retirer "?reset=true"
            const params = new URLSearchParams(searchParams.toString());
            params.delete("reset");
            const nextQuery = params.toString();
            router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
        }
    }, [isReset, searchParams, router, pathname]);

    // La clé force le remontage propre du composant dès le reset
    return <Game key={isReset ? "reset-game" : "saved-game"} />;
}

export default function Play() {
    return (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center" />}>
            <PlayContent />
        </Suspense>
    );
}