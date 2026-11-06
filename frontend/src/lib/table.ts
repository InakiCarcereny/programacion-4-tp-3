export function getMesaFromUrl(search: string): number | null {
  const raw = new URLSearchParams(search).get("mesa");

  if (raw === null || !/^\d+$/.test(raw)) {
    return null;
  }

  const mesa = Number(raw);
  return mesa > 0 ? mesa : null;
}
