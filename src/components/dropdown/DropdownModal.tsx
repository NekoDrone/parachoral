import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { useModalMousedownEffect } from "#/lib/hooks/useModalMousedownEffect";
import { useModalEscapeEffect } from "#/lib/hooks/useModalEscapeEffect";

export const DropdownModal = ({
    buttonComponent,
    children,
    className,
    ref,
    showDropdownState,
    setShowDropdownState,
}: {
    buttonComponent: ReactNode;
    children: ReactNode;
    className?: string;
    ref?: RefObject<HTMLDivElement>;
    showDropdownState?: boolean;
    setShowDropdownState?: Dispatch<SetStateAction<boolean>>;
}) => {
    const [showDropdown, setShowDropdown] =
        showDropdownState !== undefined && setShowDropdownState !== undefined
            ? [showDropdownState, setShowDropdownState]
            : useState(false);

    const dropdownRef = ref ?? useRef<HTMLDivElement>(null);

    useModalEscapeEffect({ setShowModal: setShowDropdown });
    useModalMousedownEffect({
        setShowModal: setShowDropdown,
        modalRef: dropdownRef,
    });

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <button
                onClick={() => setShowDropdown((prev) => !prev)}
            >
                {buttonComponent}
            </button>
            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        className={`absolute right-0 z-50 origin-top-right cursor-default shadow-xl ${className}`}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
