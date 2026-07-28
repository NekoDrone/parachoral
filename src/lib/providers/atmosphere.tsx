import { DEFAULT_ATMOSPHERE_COLOR } from "#/lib/utils/color";
import { createContext, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type AtmosphereContextValue = {
    color: string;
    setColor: (color: string) => void;
    resetColor: () => void;
};

export const AtmosphereContext = createContext<AtmosphereContextValue | null>(
    null,
);

export const AtmosphereProvider = ({ children }: { children: ReactNode }) => {
    const [color, setColor] = useState(DEFAULT_ATMOSPHERE_COLOR);

    const resetColor = useCallback(
        () => setColor(DEFAULT_ATMOSPHERE_COLOR),
        [],
    );

    const value = useMemo(
        () => ({ color, setColor, resetColor }),
        [color, resetColor],
    );

    return (
        <AtmosphereContext.Provider value={value}>
            {children}
        </AtmosphereContext.Provider>
    );
};
