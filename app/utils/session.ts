export function getSessionSlug(name: string): string {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "session";
}

export function getSessionPath(name: string, id: string | number): string {
  return `/session/${getSessionSlug(name)}/${id}`;
}
