export const chartColors = {
    forest: "#0b3d2e",
    forestSoft: "#12513d",
    citron: "#d9e45f",
    brass: "#b8863b",
    olive: "#7f9140",
    grid: "#e6e3d6",
    tick: "#55655e",
    cream: "#fbfaf6",
    error: "#b42318",
};

export const formatNumber = (value) => {
    const numeric = Number(value);

    return Number.isFinite(numeric)
        ? numeric.toLocaleString("en-US", { maximumFractionDigits: 2 })
        : "—";
};

export const formatCurrency = (value) => {
    const numeric = Number(value);

    return Number.isFinite(numeric)
        ? `৳${numeric.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
        : "—";
};

export const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export const truncate = (value, max = 14) => {
    const text = String(value ?? "").trim();

    if (text.length <= max) return text;

    return `${text.slice(0, max - 1).trimEnd()}…`;
};
