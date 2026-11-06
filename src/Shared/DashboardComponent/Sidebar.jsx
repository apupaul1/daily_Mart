import { Link, NavLink } from "react-router";
import {
    ArrowUpRight,
    Heart,
    LayoutDashboard,
    Megaphone,
    Package,
    Plus,
    ShieldCheck,
    ShoppingCart,
    Store,
    TrendingUp,
    UserRound,
    Users,
    X,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import UseUserRole from "../../hooks/UseUserRole";
import DashboardAvatar from "./DashboardAvatar";

const adminLinks = [
    { label: "All users", to: "all-users", icon: Users },
    { label: "All products", to: "all-products", icon: Package },
    { label: "Advertisements", to: "all-ads", icon: Megaphone },
    { label: "All orders", to: "all-orders", icon: ShoppingCart },
];

const vendorLinks = [
    { label: "Add product", to: "addproduct", icon: Plus },
    { label: "My products", to: "my-products", icon: Package },
    { label: "Post advertisement", to: "postadvertisement", icon: Megaphone },
    { label: "My advertisements", to: "my-ads", icon: TrendingUp },
];

const buyerLinks = [
    { label: "Watchlist", to: "watchlist", icon: Heart },
    { label: "My orders", to: "myorder", icon: ShoppingCart },
    { label: "Price trends", to: "price-trends", icon: TrendingUp },
];

const roleMeta = {
    admin: { section: "Administration", label: "Administrator" },
    vendor: { section: "Storefront", label: "Vendor" },
    user: { section: "Shopping", label: "Shopper" },
};

const SidebarLink = ({ to, icon, label, end = false }) => {
    const Icon = icon;

    return (
        <li>
            <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                    [
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors duration-200",
                        isActive
                            ? "bg-citron/15 text-citron"
                            : "text-primary-content/60 hover:bg-primary-content/[0.07] hover:text-primary-content",
                    ].join(" ")
                }
            >
                {({ isActive }) => (
                    <>
                        <Icon
                            className={[
                                "size-4 shrink-0 transition-colors duration-200",
                                isActive
                                    ? "text-citron"
                                    : "text-primary-content/40 group-hover:text-primary-content/80",
                            ].join(" ")}
                            strokeWidth={1.85}
                            aria-hidden="true"
                        />
                        <span className="flex-1 truncate">{label}</span>
                        {isActive && (
                            <span
                                aria-hidden="true"
                                className="size-1.5 rounded-full bg-citron"
                            />
                        )}
                    </>
                )}
            </NavLink>
        </li>
    );
};

const Sidebar = ({ onClose }) => {
    const { user } = useAuth();
    const { role, roleLoading } = UseUserRole();

    const displayName =
        user?.displayName?.trim() ||
        user?.email?.split("@")[0] ||
        "DailyMart member";

    const meta = roleMeta[role] ?? { section: "Workspace", label: "Member" };
    const roleLinks =
        role === "admin"
            ? adminLinks
            : role === "vendor"
              ? vendorLinks
              : role === "user"
                ? buyerLinks
                : [];

    return (
        <div className="flex h-full flex-col bg-linear-to-b from-forest/90 via-forest/90 to-[#07291f] text-primary-content">
            {/* Brand */}
            <div className="flex items-center gap-3 px-4 pb-4 pt-4 md:px-5 md:pt-5">
                <Link
                    to="/"
                    className="flex min-w-0 items-center gap-3"
                >
                    <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-base-100 ring-1 ring-primary-content/15">
                        <img
                            src="/logo.png"
                            alt="DailyMart logo"
                            className="size-10 object-cover"
                        />
                    </span>
                    <span className="min-w-0">
                        <span className="block font-display text-lg font-semibold leading-none">
                            DailyMart
                        </span>
                        <span className="mt-1 block text-[8.5px] font-bold uppercase tracking-[0.24em] text-citron/70">
                            Dashboard
                        </span>
                    </span>
                </Link>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dashboard menu"
                        autoFocus
                        className="ml-auto grid size-9 shrink-0 place-items-center rounded-full border border-primary-content/15 text-primary-content/60 transition-colors duration-300 hover:bg-primary-content/10 hover:text-primary-content lg:hidden"
                    >
                        <X
                            className="size-4"
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </button>
                )}
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 [scrollbar-color:rgba(251,250,246,0.18)_transparent] [scrollbar-width:thin] md:px-4">
                {/* Profile */}
                <div className="rounded-2xl border border-primary-content/10 bg-primary-content/[0.05] p-3">
                    <div className="flex items-center gap-3">
                        <DashboardAvatar user={user} tone="dark" />

                        <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-primary-content">
                                {displayName}
                            </p>
                            <p className="truncate text-[11px] text-primary-content/45">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {roleLoading ? (
                        <span className="mt-3 block h-4 w-24 animate-pulse rounded-full bg-primary-content/10" />
                    ) : (
                        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-citron/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-citron">
                            <ShieldCheck
                                className="size-3"
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                            {meta.label}
                        </span>
                    )}
                </div>

                <nav aria-label="Dashboard" className="mt-5 space-y-5">
                    <div>
                        <p className="px-3 text-[9.5px] font-bold uppercase tracking-[0.2em] text-primary-content/30">
                            Workspace
                        </p>
                        <ul className="mt-2 space-y-0.5">
                            <SidebarLink
                                to="/dashboard"
                                end
                                icon={LayoutDashboard}
                                label="Overview"
                            />
                            <SidebarLink
                                to="myprofile"
                                icon={UserRound}
                                label="My profile"
                            />
                        </ul>
                    </div>

                    {roleLoading ? (
                        <div className="space-y-2 px-3">
                            <span className="block h-2.5 w-20 animate-pulse rounded-full bg-primary-content/10" />
                            {Array.from({ length: 3 }).map((_, index) => (
                                <span
                                    key={index}
                                    className="block h-9 w-full animate-pulse rounded-xl bg-primary-content/[0.06]"
                                />
                            ))}
                        </div>
                    ) : (
                        roleLinks.length > 0 && (
                            <div>
                                <p className="px-3 text-[9.5px] font-bold uppercase tracking-[0.2em] text-primary-content/30">
                                    {meta.section}
                                </p>
                                <ul className="mt-2 space-y-0.5">
                                    {roleLinks.map((item) => (
                                        <SidebarLink
                                            key={item.to}
                                            to={item.to}
                                            icon={item.icon}
                                            label={item.label}
                                        />
                                    ))}
                                </ul>
                            </div>
                        )
                    )}
                </nav>
            </div>

            {/* Footer */}
            <div className="border-t border-primary-content/10 p-3 md:p-4">
                <Link
                    to="/"
                    className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold text-primary-content/55 transition-colors duration-300 hover:bg-primary-content/[0.07] hover:text-primary-content"
                >
                    <span className="inline-flex items-center gap-2">
                        <Store
                            className="size-4"
                            strokeWidth={1.85}
                            aria-hidden="true"
                        />
                        Back to storefront
                    </span>
                    <ArrowUpRight
                        className="size-3.5 opacity-60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
