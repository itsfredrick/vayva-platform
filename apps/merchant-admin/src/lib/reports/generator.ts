import { format } from "date-fns";

/**
 * Converts an array of objects to a CSV string.
 * @param data Array of objects (flat structure preferred)
 * @param headers Optional mapping of keys to display names
 */
export function generateCSV(data: any[], headers?: Record<string, string>): string {
    if (!data || data.length === 0) return "";

    // 1. Determine Headers
    const keys = Object.keys(data[0]);
    const headerRow = keys.map(k => headers?.[k] || k).join(",");

    // 2. Generate Rows
    const rows = data.map(row => {
        return keys.map(k => {
            let val = row[k];

            // Handle formatting
            if (val instanceof Date) {
                val = format(val, "yyyy-MM-dd HH:mm:ss");
            } else if (typeof val === "object" && val !== null) {
                val = JSON.stringify(val).replace(/"/g, '""'); // Escape inner quotes
            } else if (typeof val === "string") {
                val = val.replace(/"/g, '""'); // Escape quotes
            }

            // Quote strings if they contain commas or quotes
            if (typeof val === "string" && (val.includes(",") || val.includes('"') || val.includes("\n"))) {
                return `"${val}"`;
            }
            return val;
        }).join(",");
    });

    return [headerRow, ...rows].join("\n");
}
