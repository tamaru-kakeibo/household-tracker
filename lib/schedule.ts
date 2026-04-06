import { Task, TASKS } from './tasks';

/** Day-of-month for the Nth occurrence of a weekday in a given month */
function nthWeekdayDate(year: number, month: number, weekday: number, nth: number): number {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (weekday - firstDay + 7) % 7;
  return 1 + offset + (nth - 1) * 7;
}

function isNthWeekday(date: Date, weekday: number, nth: number): boolean {
  if (date.getDay() !== weekday) return false;
  return date.getDate() === nthWeekdayDate(date.getFullYear(), date.getMonth(), weekday, nth);
}

export function getTasksForDate(date: Date): Task[] {
  const dow = date.getDay();   // 0=Sun … 6=Sat
  const mon = date.getMonth(); // 0-indexed
  const tasks: Task[] = [];

  // ── Daily ─────────────────────────────────────────────
  tasks.push(TASKS.b1);

  // ── Weekly (weekday tasks) ────────────────────────────
  if (dow === 1) tasks.push(TASKS.l1);
  if (dow === 2) tasks.push(TASKS.k2, TASKS.k3);
  if (dow === 3) tasks.push(TASKS.b4, TASKS.m1);
  if (dow === 4) tasks.push(TASKS.b5, TASKS.b6);
  if (dow === 5) tasks.push(TASKS.l3);

  // ── Saturdays ────────────────────────────────────────
  if (dow === 6) {
    // 1st Sat: 冷蔵庫 + お風呂排水口
    if (isNthWeekday(date, 6, 1)) tasks.push(TASKS.k4, TASKS.b3);

    // 2nd Sat: 電子レンジ [+ 窓 quarterly] [+ カーテン semi-annual]
    if (isNthWeekday(date, 6, 2)) {
      tasks.push(TASKS.k5);
      if ([2, 5, 8, 11].includes(mon)) tasks.push(TASKS.l4); // Mar/Jun/Sep/Dec
      if ([3, 9].includes(mon))        tasks.push(TASKS.l5); // Apr/Oct
    }

    // 3rd Sat: 換気扇 + お風呂排水口
    if (isNthWeekday(date, 6, 3)) tasks.push(TASKS.k1, TASKS.b3);

    // 4th Sat: 棚埃払い [+ 給湯器 quarterly]
    if (isNthWeekday(date, 6, 4)) {
      tasks.push(TASKS.l2);
      if ([1, 4, 7, 10].includes(mon)) tasks.push(TASKS.m5); // Feb/May/Aug/Nov
    }
  }

  // ── Sundays ──────────────────────────────────────────
  if (dow === 0) {
    if (isNthWeekday(date, 0, 1)) tasks.push(TASKS.b2);
    if (isNthWeekday(date, 0, 2)) tasks.push(TASKS.m4);
    if (isNthWeekday(date, 0, 3)) tasks.push(TASKS.m2, TASKS.m3);
    if (isNthWeekday(date, 0, 4)) tasks.push(TASKS.m4);
  }

  return tasks;
}

export function getTotalMinutes(tasks: Task[]): number {
  return tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `約${minutes}分`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `約${h}時間${m}分` : `約${h}時間`;
}
