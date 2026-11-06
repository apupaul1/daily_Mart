import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
    Eye,
    RotateCcw,
    ShoppingBag,
    TriangleAlert,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableHead,
    DataTableHeader,
    DataTableRow,
    TableAction,
    TableEmpty,
    TableLink,
    TablePageHeader,
    TableShell,
    TableSkeleton,
} from "../../../Shared/DashboardComponent/DataTable";

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "—";

    const numeric = Number(value);

    return Number.isNaN(numeric)
        ? String(value)
        : `৳${numeric.toLocaleString("en-US")}`;
};

const formatDateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const MyOrderList = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const {
        data: payments = [],
        isPending,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["payments", user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/payments?email=${user.email}`,
            );
            return res.data;
        },
    });

    const handleViewDetails = (productId) => {
        navigate(`/details/${productId}`);
    };

    const isLoading = loading || isPending;

    return (
        <div className="space-y-6 md:space-y-8">
            <TablePageHeader
                eyebrow="Purchases"
                icon={ShoppingBag}
                title="My orders"
                description="Track your completed purchases, payment amounts, and transaction references."
            >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-[11px] font-semibold text-ink-soft">
                    <ShoppingBag
                        className="size-4 text-primary"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    {isLoading
                        ? "Loading orders…"
                        : `${payments.length} order${payments.length === 1 ? "" : "s"}`}
                </span>
            </TablePageHeader>

            {isLoading ? (
                <TableSkeleton rows={5} columns={8} />
            ) : isError ? (
                <TableEmpty
                    icon={TriangleAlert}
                    title="We couldn't load your orders"
                    description={
                        error?.message ||
                        "Please check your connection and try again."
                    }
                    action={
                        <TableAction
                            icon={RotateCcw}
                            tone="primary"
                            onClick={() => refetch()}
                        >
                            Try again
                        </TableAction>
                    }
                />
            ) : payments.length === 0 ? (
                <TableEmpty
                    icon={ShoppingBag}
                    title="No orders yet"
                    description="Once you complete a purchase, your order details and transaction reference will show up here."
                    action={
                        <TableLink
                            to="/allproducts"
                            icon={ShoppingBag}
                            tone="primary"
                        >
                            Browse products
                        </TableLink>
                    }
                />
            ) : (
                <TableShell>
                    <DataTable
                        label="My orders"
                        minWidthClass="md:min-w-[62rem]"
                    >
                        <DataTableHead>
                            <DataTableHeader>Product</DataTableHeader>
                            <DataTableHeader>Market</DataTableHeader>
                            <DataTableHeader>Price</DataTableHeader>
                            <DataTableHeader>Qty</DataTableHeader>
                            <DataTableHeader>Amount</DataTableHeader>
                            <DataTableHeader>Transaction</DataTableHeader>
                            <DataTableHeader>Paid at</DataTableHeader>
                            <DataTableHeader className="text-right">
                                Actions
                            </DataTableHeader>
                        </DataTableHead>

                        <DataTableBody>
                            {payments.map((payment, index) => {
                                const transactionId = String(
                                    payment.transactionId || "",
                                );

                                return (
                                    <DataTableRow
                                        key={
                                            payment.id ||
                                            payment._id ||
                                            transactionId ||
                                            index
                                        }
                                    >
                                        <DataTableCell
                                            label="Product"
                                            emphasis
                                        >
                                            {payment.productName || "—"}
                                        </DataTableCell>

                                        <DataTableCell label="Market">
                                            {payment.marketName || "—"}
                                        </DataTableCell>

                                        <DataTableCell label="Price">
                                            {formatCurrency(payment.price)}
                                        </DataTableCell>

                                        <DataTableCell label="Quantity">
                                            {payment.quantity ?? "—"}
                                        </DataTableCell>

                                        <DataTableCell label="Amount">
                                            <span className="text-[15px] font-semibold text-primary">
                                                {formatCurrency(payment.amount)}
                                            </span>
                                        </DataTableCell>

                                        <DataTableCell label="Transaction">
                                            <span
                                                title={transactionId}
                                                className="inline-block max-w-full break-all rounded-lg bg-base-200 px-2 py-1 font-mono text-[11px] text-ink-soft"
                                            >
                                                {transactionId
                                                    ? `${transactionId.slice(0, 12)}…`
                                                    : "—"}
                                            </span>
                                        </DataTableCell>

                                        <DataTableCell label="Paid at">
                                            {formatDateTime(
                                                payment.paid_at_string,
                                            )}
                                        </DataTableCell>

                                        <DataTableCell
                                            label="Actions"
                                            align="end"
                                        >
                                            <div className="flex flex-wrap gap-2 md:justify-end">
                                                <TableAction
                                                    icon={Eye}
                                                    tone="primary"
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            payment.productId,
                                                        )
                                                    }
                                                >
                                                    View details
                                                </TableAction>
                                            </div>
                                        </DataTableCell>
                                    </DataTableRow>
                                );
                            })}
                        </DataTableBody>
                    </DataTable>
                </TableShell>
            )}
        </div>
    );
};

export default MyOrderList;
