export const toRomanYear = (date: Date): string => {
    const numerals: Array<[number, string]> = [
        [1000, "M"],
        [900, "CM"],
        [500, "D"],
        [400, "CD"],
        [100, "C"],
        [90, "XC"],
        [50, "L"],
        [40, "XL"],
        [10, "X"],
        [9, "IX"],
        [5, "V"],
        [4, "IV"],
        [1, "I"],
    ];

    let year = date.getFullYear();
    let result = "";

    for (const [value, symbol] of numerals) {
        while (year >= value) {
            result += symbol;
            year -= value;
        }
    }

    return result;
};
