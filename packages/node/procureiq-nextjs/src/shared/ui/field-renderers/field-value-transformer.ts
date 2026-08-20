export function parseFieldValue(rawValue: string): string | number {
  const trimmed = rawValue.trim();
  if (trimmed === "") return rawValue;
  const num = Number(trimmed);
  return !isNaN(num) ? num : rawValue;
}

export function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}
