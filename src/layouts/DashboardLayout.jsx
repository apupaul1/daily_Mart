import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, LogOut, Menu, Store } from "lucide-react";
import Sidebar from "../Shared/DashboardComponent/Sidebar";
import DashboardAvatar from "../Shared/DashboardComponent/DashboardAvatar";
import useAuth from "../hooks/useAuth";
import UseUserRole from "../hooks/UseUserRole";
import { toast } from "sonner";

const pageTitles = {
  "/dashboard": "Overview",
  "/dashboard/myorder": "My orders",
  "/dashboard/myprofile": "My profile",
  "/dashboard/addproduct": "Add product",
  "/dashboard/my-products": "My products",
  "/dashboard/postadvertisement": "Post advertisement",
  "/dashboard/my-ads": "My advertisements",
  "/dashboard/watchlist": "Watchlist",
  "/dashboard/price-trends": "Price trends",
  "/dashboard/all-orders": "All orders",
  "/dashboard/all-products": "All products",
  "/dashboard/all-users": "All users",
  "/dashboard/all-ads": "All advertisements",
};

const roleLabels = {
  admin: "Administrator",
  vendor: "Vendor",
  user: "Shopper",
};

const getPageTitle = (pathname) => {
  if (pathname.startsWith("/dashboard/update-product")) {
    return "Update product";
  }
  if (pathname.startsWith("/dashboard/payment")) {
    return "Payment";
  }
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  const segment = pathname.split("/").filter(Boolean).pop();

  return segment
    ? segment.replace(/-/g, " ").replace(/^\w/, (char) => char.toUpperCase())
    : "Overview";
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, logOut } = useAuth();
  const { role } = UseUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const displayName =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    "DailyMart member";
  const pageTitle = getPageTitle(location.pathname);
  const roleLabel = roleLabels[role] ?? "Member";

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await logOut();
      navigate("/login", { replace: true });
      toast.success("Logout from account");
    } catch (error) {
      console.error(error);
      toast.error("We couldn't sign you out. Please try again.");
      setLoggingOut(false);
    }
  };

  const drawerTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className="min-h-dvh bg-base-200/50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </aside>

      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-base-300/70 bg-base-100/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 md:h-20 md:gap-4 md:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open dashboard menu"
              aria-expanded={sidebarOpen}
              aria-controls="dashboard-mobile-menu"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-base-300 bg-base-100 text-base-content/70 transition-colors duration-300 hover:border-primary/30 hover:text-primary lg:hidden"
            >
              <Menu className="size-5" strokeWidth={1.9} aria-hidden="true" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-ink-soft/40">
                Dashboard
              </p>
              <h1 className="truncate text-lg font-semibold leading-tight tracking-[-0.02em] text-base-content md:text-xl">
                {pageTitle}
              </h1>
            </div>

            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[12.5px] font-semibold text-ink-soft transition-colors duration-300 hover:bg-base-200 hover:text-primary lg:inline-flex"
            >
              <Store className="size-4" strokeWidth={1.9} aria-hidden="true" />
              Home
              <ArrowUpRight
                className="size-3.5 opacity-60"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>

            <div className="hidden items-center gap-2.5 rounded-full border border-base-300/80 bg-base-100 py-1.5 pl-1.5 pr-3 md:flex">
              <DashboardAvatar
                user={user}
                tone="light"
                className="size-8"
                textClassName="text-[10px]"
              />
              <div className="min-w-0 leading-tight">
                <p className="max-w-36 truncate text-[12px] font-bold text-base-content">
                  {displayName}
                </p>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-soft/50">
                  {roleLabel}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Log out"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-2 text-[12.5px] font-semibold text-ink-soft transition-colors duration-300 hover:border-error/30 hover:bg-error/5 hover:text-error disabled:opacity-50"
            >
              <LogOut className="size-4" strokeWidth={1.9} aria-hidden="true" />
              <span className="hidden md:inline">
                {loggingOut ? "Signing out…" : "Log out"}
              </span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100dvh_-_4rem)] px-4 py-5 md:min-h-[calc(100dvh_-_5rem)] md:px-6 md:py-7 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[100rem]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <Motion.div
            key="dashboard-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.2,
            }}
            className="fixed inset-0 z-50 bg-forest/55 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sidebarOpen && (
          <Motion.aside
            key="dashboard-drawer"
            id="dashboard-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard menu"
            initial={shouldReduceMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: "-100%" }}
            transition={drawerTransition}
            className="fixed inset-y-0 left-0 z-50 w-[19rem] max-w-[85vw] shadow-soft lg:hidden"
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </Motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
