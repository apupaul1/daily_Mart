import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Clock,
  Mail,
  MailCheck,
  MailX,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import UseUserRole from "../../../hooks/UseUserRole";
import DashboardAvatar from "../../../Shared/DashboardComponent/DashboardAvatar";
import { TablePageHeader } from "../../../Shared/DashboardComponent/DataTable";
import { Panel } from "../../../Shared/DashboardComponent/DashboardUI";

const roleCtas = {
  admin: {
    to: "/dashboard/all-users",
    label: "Manage users",
    icon: Users,
  },
  vendor: {
    to: "/dashboard/my-products",
    label: "Manage products",
    icon: Store,
  },
  user: {
    to: "/allproducts",
    label: "Browse products",
    icon: ShoppingBag,
  },
};

const formatDateTime = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const InfoItem = ({ icon, label, value, className = "" }) => {
  const Icon = icon;

  return (
    <div
      className={[
        "flex items-start gap-3 rounded-2xl border border-base-300/60 bg-base-200/20 p-3.5 md:p-4",
        className,
      ].join(" ")}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/[0.06] text-primary">
        <Icon className="size-4" strokeWidth={1.9} aria-hidden="true" />
      </span>

      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft/60">
          {label}
        </dt>
        <dd className="mt-1 break-words text-sm font-medium text-base-content">
          {value}
        </dd>
      </div>
    </div>
  );
};

const MyProfile = () => {
  const { user } = useAuth();
  const { role } = UseUserRole();

  const roleCta = roleCtas[role] ?? roleCtas.user;
  const CtaIcon = roleCta.icon;

  const emailVerified = Boolean(user?.emailVerified);
  const providerId = user?.providerData?.[0]?.providerId;
  const providerLabel =
    providerId === "google.com"
      ? "Google"
      : providerId === "password"
        ? "Email & password"
        : providerId || "Email & password";

  const infoItems = [
    {
      icon: Mail,
      label: "Email",
      value: user?.email || "Not provided",
    },
    {
      icon: Phone,
      label: "Phone",
      value: user?.phoneNumber || "Not added",
    },
    {
      icon: MapPin,
      label: "Address",
      value: user?.address || "Not added",
      className: "md:col-span-2",
    },
  ];

  const activityItems = [
    {
      icon: Clock,
      label: "Last sign-in",
      value: formatDateTime(user?.metadata?.lastSignInTime),
    },
    {
      icon: CalendarDays,
      label: "Member since",
      value: formatDate(user?.metadata?.creationTime),
    },
    {
      icon: ShieldCheck,
      label: "Sign-in method",
      value: providerLabel,
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <TablePageHeader
        title={
          <>
            My <em className="italic text-primary">profile.</em>
          </>
        }
        description="The personal details and sign-in activity linked to your DailyMart account."
      ></TablePageHeader>

      <div className="grid gap-4 md:gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section className=" relative overflow-hidden rounded-[1.5rem] border border-base-300/70 bg-base-100 shadow-[0_1px_2px_rgba(18,35,28,0.04)]">
          <div className="z-10 h-28 overflow-hidden bg-primary md:h-36" />

          <div className="px-5 pb-5 md:px-6 md:pb-6 z-99">
            <div className="-mt-12 flex items-end gap-4 md:-mt-14">
              <div className="w-fit shrink-0 rounded-full border-4 border-base-100 bg-base-100 shadow-card">
                <DashboardAvatar
                  user={user}
                  tone="light"
                  className="size-24 md:size-28"
                  textClassName="text-2xl"
                />
              </div>

              <div className="min-w-0 pb-1">
                <h2 className="truncate text-xl font-semibold tracking-[-0.02em] text-base-content md:text-2xl">
                  {user?.displayName || "DailyMart member"}
                </h2>
                <p className="mt-1 truncate text-sm text-ink-soft">
                  {user?.email || "No email provided"}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-base-300/60 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-base-content">
                  Contact information
                </h3>

                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                    emailVerified
                      ? "bg-primary/10 text-primary"
                      : "bg-citron/30 text-forest",
                  ].join(" ")}
                >
                  {emailVerified ? (
                    <MailCheck
                      className="size-3.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ) : (
                    <MailX
                      className="size-3.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                  {emailVerified ? "Email verified" : "Email unverified"}
                </span>
              </div>

              <dl className="mt-4 grid gap-3 md:grid-cols-2">
                {infoItems.map((item) => (
                  <InfoItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                    className={item.className}
                  />
                ))}
              </dl>
            </div>
          </div>
        </section>

        <Panel
          icon={ShieldCheck}
          title="Account details"
          description="Sign-in activity for this account."
          className="lg:sticky lg:top-24"
        >
          <dl className="space-y-4">
            {activityItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-base-200/70 text-ink-soft">
                    <Icon
                      className="size-4"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0">
                    <dt className="text-xs text-ink-soft">{item.label}</dt>
                    <dd className="mt-0.5 break-words text-sm font-semibold text-base-content">
                      {item.value}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </Panel>
      </div>
    </div>
  );
};

export default MyProfile;
