import { rowColor } from "@/app/types/rowColor";
import { checkedMatrice } from "@/app/types/checkedMatrice";

export class GameUtil {

    static getEmptyMatrice(): checkedMatrice {
        return {
            red: [],
            yellow: [],
            green: [],
            blue: []
        };
    }

    private static dispatchStorageEvent() {
        if (typeof window === "undefined") return;
        window.dispatchEvent(new Event("storage"));
    }

    static reset(): void {
        if (typeof window === "undefined") return;
        localStorage.removeItem("checked");
        localStorage.removeItem("malus");
        this.dispatchStorageEvent();
    }

    static recoverChecked(): checkedMatrice {
        if (typeof window === "undefined") return this.getEmptyMatrice();

        const data = localStorage.getItem("checked");
        if (data == null) {
            return this.getEmptyMatrice();
        }
        try {
            return JSON.parse(data);
        } catch {
            return this.getEmptyMatrice();
        }
    }

    static saveChecked(checked: checkedMatrice) {
        if (typeof window === "undefined") return;
        localStorage.setItem("checked", JSON.stringify(checked));
        this.dispatchStorageEvent();
    }

    static toggleCase(color: rowColor, number: number) {
        const checked = this.recoverChecked();
        const list = checked[color] ?? [];

        let updatedList: number[];
        if (list.includes(number)) {
            updatedList = list.filter((n) => n !== number);
        } else {
            updatedList = [...list, number];
        }

        const newChecked: checkedMatrice = {
            ...checked,
            [color]: updatedList
        };

        this.saveChecked(newChecked);
    }

    static isChecked(color: rowColor, number: number) {
        const checked = this.recoverChecked();
        const list = checked[color] ?? [];
        return list.includes(number);
    }

    static listFinished(color: rowColor) {
        const checked = this.recoverChecked();
        const list = checked[color] ?? [];
        return (
            list.length >= 5 &&
            ((["red", "yellow"].includes(color) && list.includes(12)) ||
                (["green", "blue"].includes(color) && list.includes(2)))
        );
    }

    static canCheck(color: rowColor, number: number) {
        const checked = this.recoverChecked();
        const list = checked[color] ?? [];

        if (["red", "yellow"].includes(color) && number === 12 && list.length < 5) {
            return false;
        }

        if (["green", "blue"].includes(color) && number === 2 && list.length < 5) {
            return false;
        }

        if (["red", "yellow"].includes(color) && list.some((n) => n > number)) {
            return false;
        }

        if (["green", "blue"].includes(color) && list.some((n) => n < number)) {
            return false;
        }

        return true;
    }

    static totalRow(color: rowColor): number {
        const checked = this.recoverChecked();
        const list = checked[color] ?? [];
        let count = list.length;

        if (count >= 5 && (list.includes(12) || list.includes(2))) {
            count++;
        }

        return (count * (count + 1)) / 2;
    }

    static getMalus(): number {
        if (typeof window === "undefined") return 0;

        const data = localStorage.getItem("malus");
        if (data == null) return 0;
        try {
            return JSON.parse(data);
        } catch {
            return 0;
        }
    }

    static setMalus(nb: number) {
        if (typeof window === "undefined") return;
        if (nb < 0 || nb > 4) return;
        localStorage.setItem("malus", JSON.stringify(nb));
        this.dispatchStorageEvent();
    }

    static incrementMalus() {
        if (typeof window === "undefined") return;
        let malus = this.getMalus();
        if (malus >= 4) return;
        malus++;
        localStorage.setItem("malus", JSON.stringify(malus));
        this.dispatchStorageEvent();
    }

    static decrementMalus() {
        if (typeof window === "undefined") return;
        let malus = this.getMalus();
        if (malus <= 0) return;
        malus--;
        localStorage.setItem("malus", JSON.stringify(malus));
        this.dispatchStorageEvent();
    }

    static totalMalus() {
        const malus = this.getMalus();
        return 5 * malus;
    }

    static total() {
        const totalMalus = this.totalMalus();
        const totalRed = this.totalRow("red");
        const totalYellow = this.totalRow("yellow");
        const totalGreen = this.totalRow("green");
        const totalBlue = this.totalRow("blue");

        return totalRed + totalYellow + totalGreen + totalBlue - totalMalus;
    }
}