import { AtmosphereContext } from "#/lib/providers/atmosphere";
import { useContext, useEffect } from "react";

/** Read and imperatively change the top atmosphere colour. */
export const useAtmosphere = () => {
    const context = useContext(AtmosphereContext);
    if (!context) {
        throw new Error(
            "useAtmosphere must be used within an AtmosphereProvider",
        );
    }
    return context;
};

/**
 * Tint the top atmosphere for as long as the calling component is mounted,
 * restoring the default on unmount.
 */
export const useAtmosphereColor = (color: string) => {
    const { setColor, resetColor } = useAtmosphere();

    useEffect(() => {
        setColor(color);
        return resetColor;
    }, [color, setColor, resetColor]);
};
