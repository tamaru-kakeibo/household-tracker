const KEY      = 'household-tracker-v1';
const START_KEY = 'household-tracker-start';

export function dateKey(date: Date, taskId: string): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}__${taskId}`;
}

export function loadCompletions(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function saveCompletions(data: Record<string, boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage full — ignore
  }
}

const MEMO_KEY = 'household-tracker-memos';

export function memoDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function loadMemos(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MEMO_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function saveMemo(date: Date, text: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = memoDateKey(date);
    const all = loadMemos();
    if (text.trim() === '') {
      delete all[key];
    } else {
      all[key] = text;
    }
    localStorage.setItem(MEMO_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

const DISABLED_KEY = 'household-tracker-disabled';

export function loadDisabledTasks(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(DISABLED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function saveDisabledTasks(disabled: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISABLED_KEY, JSON.stringify(Array.from(disabled)));
  } catch {
    // ignore
  }
}

/** Returns the stored start date, or null if not set */
export function loadStartDate(): Date | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(START_KEY);
    if (!raw) return null;
    // Parse as local time (not UTC) to avoid timezone issues
    const [y, m, d] = raw.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  } catch {
    return null;
  }
}

/** Stores start date as ISO date string (YYYY-MM-DD) */
export function saveStartDate(date: Date): void {
  if (typeof window === 'undefined') return;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  localStorage.setItem(START_KEY, `${y}-${m}-${d}`);
}
