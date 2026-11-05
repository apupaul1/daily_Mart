import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const navItems = [
  { label: "Home", to: "/" },
  { label: "All Products", to: "/allproducts" },
  { label: "Blog", to: "/blogs" },
  { label: "Discount Items", to: "/discount-product" },
  { label: "Dashboard", to: "/dashboard", authOnly: true },
];

const menuItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "My watchlist", to: "/dashboard/watchlist", icon: Heart },
  { label: "My profile", to: "/dashboard/myprofile", icon: UserRound },
];

const Navbar = () => {
  const { user, logOut } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  const visibleNavItems = navItems.filter((item) => !item.authOnly || user);

  const displayName =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    "DailyMart member";

  const firstName = displayName.split(" ")[0];
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showAvatar = Boolean(user?.photoURL);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    try {
      await logOut();
    } catch (error) {
      console.error(error);
    }
  };

  const desktopLinkClass = ({ isActive }) =>
    [
      "group relative flex items-center gap-2 rounded-full px-3.5 py-2",
      "text-[14.5px] font-semibold tracking-[-0.01em] transition-all duration-300",
      isActive
        ? "bg-primary/[0.07] text-primary"
        : "text-base-content/65 hover:bg-base-200 hover:text-base-content",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50">
      {/* Main bar */}
      <div
        className={[
          "relative border-b border-base-300/80 bg-base-100/90 backdrop-blur-xl",
          "transition-shadow duration-300",
          scrolled ? "shadow-[0_16px_40px_-32px_rgba(11,61,46,0.55)]" : "",
        ].join(" ")}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-20 lg:px-8"
        >
          {/* Brand */}
          <NavLink to="/" className="group flex shrink-0 items-center gap-3">
            <span className="relative grid size-10 place-items-center overflow-hidden rounded-full ring-1 ring-forest/15 transition-transform duration-300 group-hover:-translate-y-0.5 md:size-12">
              <img
                src="/logo.png"
                alt="DailyMart logo"
                className="size-10 object-cover md:size-12"
              />
              <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-[22px] font-semibold leading-none tracking-[-0.02em] text-base-content md:text-[26px]">
                DailyMart
              </span>
              <span className="mt-1.5 text-[8.5px] font-bold uppercase tracking-[0.26em] text-primary/55 md:text-[9px]">
                Fresh · Local · Daily
              </span>
            </span>
          </NavLink>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {visibleNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={desktopLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="size-1.5 rounded-full bg-citron ring-1 ring-primary/25" />
                      )}
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <NavLink
                  to="/dashboard/watchlist"
                  aria-label="My watchlist"
                  className="hidden size-10 place-items-center rounded-full border border-base-300 text-base-content/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-base-200 hover:text-primary sm:grid"
                >
                  <Heart className="size-[18px]" strokeWidth={1.75} />
                </NavLink>

                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((open) => !open)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-2 rounded-full border border-base-300 bg-base-100 py-1.5 pl-1.5 pr-2.5 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_10px_24px_-18px_rgba(11,61,46,0.55)]"
                  >
                    <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-primary/10 text-[11px] font-bold text-primary ring-1 ring-inset ring-primary/15 md:size-9">
                      {showAvatar ? (
                        <img
                          src={user.photoURL}
                          alt={displayName}
                          onError={() => setAvatarFailed(true)}
                          className="size-full object-cover"
                        />
                      ) : (
                        initials || <UserRound className="size-4" />
                      )}
                    </span>
                    <span className="hidden max-w-[7.5rem] truncate text-left text-[13px] font-semibold text-base-content md:block">
                      {firstName}
                    </span>
                    <ChevronDown
                      className={[
                        "size-3.5 text-base-content/45 transition-transform duration-300",
                        userMenuOpen ? "rotate-180" : "",
                      ].join(" ")}
                      strokeWidth={2}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <Motion.div
                        role="menu"
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{
                          duration: 0.18,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="absolute right-0 top-[calc(100%+0.6rem)] w-64 origin-top-right overflow-hidden rounded-2xl border border-base-300/80 bg-base-100 p-2 shadow-soft"
                      >
                        <div className="flex items-center gap-3 rounded-xl bg-base-200/60 px-3 py-3">
                          <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-[11px] font-bold text-primary ring-1 ring-inset ring-primary/15">
                            {showAvatar ? (
                              <img
                                src={user.photoURL}
                                alt=""
                                className="size-full object-cover"
                              />
                            ) : (
                              initials || <UserRound className="size-4" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-base-content">
                              {displayName}
                            </p>
                            <p className="truncate text-[11px] text-base-content/50">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 space-y-0.5">
                          {menuItems.map((item) => {
                            const MenuIcon = item.icon;
                            return (
                              <NavLink
                                key={item.to}
                                to={item.to}
                                role="menuitem"
                                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-base-content/70 transition-colors hover:bg-base-200 hover:text-primary"
                              >
                                <MenuIcon
                                  className="size-4"
                                  strokeWidth={1.9}
                                />
                                {item.label}
                              </NavLink>
                            );
                          })}
                        </div>

                        <div className="mt-2 border-t border-base-300/70 pt-2">
                          <button
                            type="button"
                            role="menuitem"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-error transition-colors hover:bg-error/10"
                          >
                            <LogOut className="size-4" strokeWidth={1.9} />
                            Log out
                          </button>
                        </div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <NavLink
                  to="/login"
                  className="rounded-full px-4 py-2.5 text-[13.5px] font-semibold text-base-content/65 transition-colors hover:text-primary"
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/register"
                  className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-primary-content shadow-[0_14px_30px_-16px_rgba(11,61,46,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-soft hover:shadow-[0_18px_34px_-16px_rgba(11,61,46,0.75)]"
                >
                  Create account
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </NavLink>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="grid size-10 place-items-center rounded-full border border-base-300 text-base-content/70 transition-colors hover:border-primary/30 hover:text-primary lg:hidden"
            >
              {mobileOpen ? (
                <X className="size-5" strokeWidth={1.9} />
              ) : (
                <Menu className="size-5" strokeWidth={1.9} />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <Motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-base-300/80 bg-base-100 shadow-soft lg:hidden"
            >
              <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
                <ul className="space-y-1">
                  {visibleNavItems.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                          [
                            "flex items-center justify-between rounded-xl px-3.5 py-3",
                            "text-[15px] font-semibold transition-colors",
                            isActive
                              ? "bg-primary/[0.07] text-primary"
                              : "text-base-content/70 hover:bg-base-200 hover:text-base-content",
                          ].join(" ")
                        }
                      >
                        {item.label}
                        <ChevronRight
                          className="size-4 opacity-40"
                          strokeWidth={1.9}
                        />
                      </NavLink>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t border-base-300/70 pt-4">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl bg-base-200/60 px-3 py-3">
                        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-inset ring-primary/15">
                          {showAvatar ? (
                            <img
                              src={user.photoURL}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            initials || <UserRound className="size-4" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-base-content">
                            {displayName}
                          </p>
                          <p className="truncate text-[11px] text-base-content/50">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-error/25 bg-error/5 px-5 py-3 text-sm font-semibold text-error transition-colors hover:bg-error/10"
                      >
                        <LogOut className="size-4" strokeWidth={1.9} />
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <NavLink
                        to="/login"
                        className="flex items-center justify-center rounded-full border border-base-300 px-4 py-3 text-sm font-semibold text-base-content/75 transition-colors hover:border-primary/30 hover:text-primary"
                      >
                        Sign in
                      </NavLink>
                      <NavLink
                        to="/register"
                        className="flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-content transition-colors hover:bg-forest-soft"
                      >
                        Create account
                        <ArrowUpRight className="size-4" strokeWidth={2} />
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
