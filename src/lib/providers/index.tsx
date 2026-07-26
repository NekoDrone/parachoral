import { IconContext } from "@phosphor-icons/react";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <IconContext.Provider
            value={{ size: 16, weight: "light", color: "currentColor" }}
        >
            <MotionConfig reducedMotion="user" />
            {children}
        </IconContext.Provider>
    );
};
