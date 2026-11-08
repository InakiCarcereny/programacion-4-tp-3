export function getTableFromUrl(search: string): number | null {
  const raw = new URLSearchParams(search).get("mesa");

  if (raw === null || !/^\d+$/.test(raw)) {
    return null;
  }

  const table = Number(raw);
  return table > 0 ? table : null;
}
