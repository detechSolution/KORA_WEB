// Time Formatter
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Date Formatter
/**
 * Formats a date.
 *
 * @example
 * formatDate("2026-05-29");
 * // May 29, 2026
 *
 * @example
 * formatDate("2026-05-29", "YYYY-MM-DD");
 * // 2026-05-29
 *
 * @example
 * formatDate("2026-05-29", "DD/MM/YYYY");
 * // 29/05/2026
 *
 * @example
 * formatDate("2026-05-29", "MM-DD-YYYY");
 * // 05-29-2026
 */
export const formatDate = (date: string | Date, format?: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  // Default behavior
  if (!format) {
    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day);
};

export const normalizeDateTime = (dateString: string): string => {
  return dateString.replace("Z", "").split(".")[0] ?? "";
};

// Price Formatter
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NP").format(price);
};
