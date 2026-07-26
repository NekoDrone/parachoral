export const Dia = ({ filled = true, size = 7 }) => {
    return (
        <span
            aria-hidden="true"
            className={
                "inline-block rotate-45 align-middle" + filled
                    ? "bg-accent"
                    : "border border-accent bg-transparent"
            }
            style={{ width: size, height: size }}
        />
    );
};
