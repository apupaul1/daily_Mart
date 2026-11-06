import { useQuery } from "@tanstack/react-query";
import {
    ReceiptText,
    RotateCcw,
    ShoppingCart,
    TriangleAlert,
} from "lucide-react";
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

const AllOrder = () => {
    const axiosSecure = useAxiosSecure();

    const {
        isLoading,
        isError,
        error,
        refetch,
        data: payments = [],
    } = useQuery({
        queryKey: ["payments"],
        queryFn: async () => {
            const res = await axiosSecure.get("/payments");
            return res.data;
        },
    });

    return (
        <div className="space-y-6 md:space-y-8">
            <TablePageHeader
                eyebrow="Orders"
                icon={ReceiptText}
                title="All orders"
                description="Every completed marketplace payment in one place, with buyer, product, and transaction details."
            >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-[11px] font-semibold text-ink-soft">
                    <ShoppingCart
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
                <TableSkeleton rows={6} columns={8} />
            ) : isError ? (
                <TableEmpty
                    icon={TriangleAlert}
                    title="We couldn't load orders"
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
                    icon={ShoppingCart}
                    title="No orders yet"
                    description="Completed customer payments will appear here."
                />
            ) : (
                <TableShell>
                    <DataTable label="All orders" minWidthClass="md:min-w-[62rem]">
                        <DataTableHead>
                            <DataTableHeader>Buyer</DataTableHeader>
                            <DataTableHeader>Product</DataTableHeader>
                            <DataTableHeader>Market</DataTableHeader>
                            <DataTableHeader>Price</DataTableHeader>
                            <DataTableHeader>Qty</DataTableHeader>
                            <DataTableHeader>Amount</DataTableHeader>
                            <DataTableHeader>Transaction</DataTableHeader>
                            <DataTableHeader>Paid at</DataTableHeader>
                        </DataTableHead>

                        <DataTableBody>
                            {payments.map((payment, index) => (
                                <DataTableRow
                                    key={
                                        payment.id ||
                                        payment._id ||
                                        payment.transactionId ||
                                        index
                                    }
                                >
                                    <DataTableCell label="Buyer" emphasis>
                                        <span className="break-all">
                                            {payment.email || "—"}
                                        </span>
                                    </DataTableCell>

                                    <DataTableCell label="Product">
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
                                        <span className="font-display text-[15px] font-semibold text-primary">
                                            {formatCurrency(payment.amount)}
                                        </span>
                                    </DataTableCell>

                                    <DataTableCell label="Transaction">
                                        <span className="inline-block max-w-full break-all rounded-lg bg-base-200 px-2 py-1 font-mono text-[11px] text-ink-soft">
                                            {payment.transactionId || "—"}
                                        </span>
                                    </DataTableCell>

                                    <DataTableCell label="Paid at">
                                        {formatDateTime(payment.paid_at_string)}
                                    </DataTableCell>
                                </DataTableRow>
                            ))}
                        </DataTableBody>
                    </DataTable>
                </TableShell>
            )}
        </div>
    );
};

export default AllOrder;
