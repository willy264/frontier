/** Read the exact ship ID returned by build_ship without racing a finality view. */
export function builtShipId(status: unknown): string | null {
  if (!status || typeof status !== "object" || !("SuccessValue" in status)) return null;
  const value = status.SuccessValue;
  if (typeof value !== "string") return null;
  try {
    const id: unknown = JSON.parse(atob(value));
    return typeof id === "number" && Number.isSafeInteger(id) && id > 0 ? String(id) : null;
  } catch {
    return null;
  }
}
