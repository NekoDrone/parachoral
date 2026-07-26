/**
 * If given an object's `typeof`, turns it into an enum-like type.
 * e.g.
 *```typescript
 * const LogLevel = {
 *   DEBUG: "DEBUG",
 *   WARNING: "WARNING",
 *   ERROR: "ERROR",
 * } as const
 * type LogLevel = Enumify<typeof LogLevel>;
 * ```
 * Which is a better way (imo) of declaring a typescript enum.
 */
export type Enumify<T> = T[keyof T];

export const toRomanYear = (date: Date): string => {
    return toRomanNumeral(date.getFullYear());
};

export const toRomanNumeral = (num: number): string => {
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

    let result = "";

    for (const [value, symbol] of numerals) {
        while (num >= value) {
            result += symbol;
            num -= value;
        }
    }

    return result;
};
