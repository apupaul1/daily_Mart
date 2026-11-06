import { NavLink, Outlet } from "react-router";
import { ArrowLeft } from "lucide-react";

const accountLinkClass = ({ isActive }) =>
  [
    "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors duration-300 md:px-4 md:text-[13px]",
    isActive
      ? "bg-primary text-primary-content"
      : "text-ink-soft hover:text-primary",
  ].join(" ");

const AuthLayout = () => {
  return (
    <div className="flex min-h-svh flex-col bg-base-100 text-base-content">
      <header className="sticky top-0 z-30 border-b border-base-300/60 bg-base-100/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-5 md:h-20 md:px-8 lg:px-10">
          <NavLink to="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="grid size-9 place-items-center overflow-hidden rounded-full ring-1 ring-forest/15 transition-transform duration-300 group-hover:-translate-y-0.5 md:size-10">
              <img
                src="/logo.png"
                alt=""
                className="size-9 object-cover md:size-10"
              />
            </span>

            <span className="flex flex-col">
              <span className="font-display text-[20px] font-semibold leading-none tracking-[-0.02em] md:text-[23px]">
                DailyMart
              </span>
              <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.24em] text-primary/55 md:text-[8.5px]">
                Fresh · Local · Daily
              </span>
            </span>
          </NavLink>

          <nav
            aria-label="Account access"
            className="flex items-center gap-2 md:gap-3"
          >
            <NavLink
              to="/"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-ink-soft transition-colors duration-300 hover:text-primary md:inline-flex"
            >
              <ArrowLeft
                className="size-3.5"
                strokeWidth={2}
                aria-hidden="true"
              />
              Home
            </NavLink>

            <div className="flex items-center gap-1 rounded-full border border-base-300/80 bg-base-200/60 p-1">
              <NavLink to="/login" className={accountLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={accountLinkClass}>
                Sign up
              </NavLink>
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8 md:py-10 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
