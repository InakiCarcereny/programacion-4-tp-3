export const MAX_MESAS = 20;

export function isValidTable(mesaId: number): boolean {
  return Number.isInteger(mesaId) && mesaId >= 1 && mesaId <= MAX_MESAS;
}
