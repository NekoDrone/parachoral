import { motion } from "motion/react";

export const Diamond = ({
    filled = true,
    size = 7,
    className,
}: {
    filled?: boolean;
    size?: number;
    className?: string;
}) => {
    return (
        <span
            aria-hidden="true"
            className={"relative inline-block align-middle border border-solid border-accent rounded-[1px] " + className}
            style={{ width: size, height: size, rotate: "45deg" }}
        >
            <motion.span
                className="absolute inset-0 bg-accent rounded-[0.5px]"
                initial={false}
                animate={{ scale: filled ? 1 : 0, opacity: filled ? 1 : 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    mass: 0.5,
                    duration: 0.1,
                }}
            />
        </span>
    );
};
