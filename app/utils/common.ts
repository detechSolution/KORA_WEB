/**
 * Builds a query string from an object of parameters
 * @param params - Object with query parameters (values can be string, number, boolean, null, or undefined)
 * @returns URL-encoded query string (e.g., "page=1&limit=10&search=test")
 */
export function buildQueryString(params: Record<string, string | number | boolean | null | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    // Include the value if it's not undefined, null, or empty string
    // Note: boolean false and 0 are valid values and should be included
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}
