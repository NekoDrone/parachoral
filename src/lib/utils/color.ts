/** `--color-haze` at 13% — the resting tint of the top atmosphere. */
export const DEFAULT_ATMOSPHERE_COLOR = "rgba(97, 126, 180, 0.13)";

export const RELEASE_ATMORPHSERE_COLOR: Record<string, string> = {
    "0_music-of-the-spheres": "#4d140145",
    "1_d1-vanilla": "#617eb421",
    "2_the-dark-below": "#9bffbb27",
    "3_house-of-wolves": "#09b0ff29",
    "4_the-taken-king": "#b024582c",
    "5_rise-of-iron": "",
} as const;

export const isRgbColor = (value: string) => /^rgba?\(/i.test(value.trim());

export const hexToRgba = (hex: string, opacity?: number): string => {
    let normalized = hex.replace("#", "").trim();
    if (normalized.length === 3 || normalized.length === 4) {
        normalized = normalized
            .split("")
            .map((c) => c + c)
            .join("");
    }
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const hasAlphaChannel = normalized.length === 8;
    const alpha =
        opacity ??
        (hasAlphaChannel ? parseInt(normalized.slice(6, 8), 16) / 255 : 1);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
