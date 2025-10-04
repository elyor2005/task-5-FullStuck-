// src/lib/utils.ts
/**
 * getUniqIdValue
 * important: returns a short unique id suitable for tokens or client ids
 * note: uses crypto.randomUUID() when available, otherwise falls back to timestamp+random
 * nota bene: keep this small and deterministic in behavior (no side effects)
 */
export function getUniqIdValue(): string {
  // important: prefer the secure built-in randomUUID if available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (globalThis as any).crypto?.randomUUID === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (globalThis as any).crypto.randomUUID();
  }

  // fallback (note: not cryptographically secure but acceptable for app ids)
  const ts = Date.now().toString(36);
  const rnd = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
  return `${ts}-${rnd}`;
}
