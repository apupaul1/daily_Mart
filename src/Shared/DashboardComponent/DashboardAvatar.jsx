import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

const toneClasses = {
    dark: "bg-citron/15 text-citron ring-citron/25",
    light: "bg-primary/10 text-primary ring-primary/15",
};

const getInitials = (user) => {
    const name =
        user?.displayName?.trim() || user?.email?.split("@")[0] || "";

    return name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

const DashboardAvatar = ({
    user,
    tone = "light",
    className = "size-10",
    textClassName = "text-[11px]",
}) => {
    const [failed, setFailed] = useState(false);
    const src = user?.photoURL;

    useEffect(() => {
        setFailed(false);
    }, [src]);

    const initials = getInitials(user);

    return (
        <span
            className={[
                "grid shrink-0 place-items-center overflow-hidden rounded-full font-bold ring-1 ring-inset",
                toneClasses[tone] ?? toneClasses.light,
                textClassName,
                className,
            ].join(" ")}
        >
            {src && !failed ? (
                <img
                    src={src}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={() => setFailed(true)}
                    className="size-full object-cover"
                />
            ) : initials ? (
                initials
            ) : (
                <UserRound
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            )}
        </span>
    );
};

export default DashboardAvatar;
