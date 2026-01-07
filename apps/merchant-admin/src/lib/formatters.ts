/**
 * Formats a number as a currency string.
 * @param amount - The amount to format.
 * @param currency - The ISO currency code (default: 'NGN').
 * @param locale - The locale to use (default: 'en-NG').
 */
export function formatCurrency(amount: number, currency = "NGN", locale = "en-NG") {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Formats a date string or object into a readable date.
 * @param date - The date to format.
 * @param locale - The locale to use (default: 'en-NG').
 */
export function formatDate(date: string | Date | number, locale = "en-GB") {
    const d = new Date(date);
    return d.toLocaleDateString(locale, {
        day: "numeric",
        month: "short", // Jan, Feb
        year: "numeric",
    });
}

/**
 * Formats a date string or object into a relative time (e.g. "2 hours ago").
 * Simple implementation for now.
 */
export function formatRelativeTime(date: string | Date | number) {
    const now = new Date();
    const d = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return formatDate(d);
}
