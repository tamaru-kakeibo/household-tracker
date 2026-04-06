'use client';

import { useState, useEffect, useMemo } from 'react';
import { getTasksForDate, getTotalMinutes, formatMinutes } from '@/lib/schedule';
import { Task, TASKS, Category, CATEGORY_CONFIG } from '@/lib/tasks';
import { dateKey, loadCompletions, saveCompletions, loadStartDate, saveStartDate, loadDisabledTasks, saveDisabledTasks, memoDateKey, loadMemos, saveMemo } from '@/lib/storage';

// ─── Date helpers ────────────────────────────────────────────────────────────

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

function calendarGrid(y: number, m: number): (Date | null)[] {
  const startDow = new Date(y, m, 1).getDay();
  const total = daysInMonth(y, m);
  const cells: (Date | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const MONTH_JP = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const DOW_JP   = ['日','月','火','水','木','金','土'];
const DOW_FULL = ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'];

// ─── Overdue helpers ─────────────────────────────────────────────────────────

interface OverdueItem {
  task: Task;
  scheduledDate: Date;
  daysOverdue: number;
}

/** Return tasks for a date, filtered by disabled set */
function getActive(date: Date, disabled: Set<string>): Task[] {
  return getTasksForDate(date).filter(t => !disabled.has(t.id));
}

/** Look back up to 30 days (but not before startDate) and collect incomplete non-daily tasks */
function computeOverdue(
  today: Date,
  completions: Record<string, boolean>,
  startDate: Date | null,
  disabled: Set<string>,
): OverdueItem[] {
  const result: OverdueItem[] = [];
  const seenIds = new Set<string>();

  for (let d = 1; d <= 30; d++) {
    const past = new Date(today.getFullYear(), today.getMonth(), today.getDate() - d);
    if (startDate && past < startDate) break;
    for (const task of getActive(past, disabled)) {
      if (task.id === 'b1') continue;
      if (seenIds.has(task.id)) continue;
      if (!completions[dateKey(past, task.id)]) {
        seenIds.add(task.id);
        result.push({ task, scheduledDate: past, daysOverdue: d });
      }
    }
  }

  return result.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  );
}

function WarnIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Task row (shared) ───────────────────────────────────────────────────────

function TaskRow({
  task,
  done,
  onToggle,
  overdueLabel,
}: {
  task: Task;
  done: boolean;
  onToggle: () => void;
  overdueLabel?: string;
}) {
  const cfg = CATEGORY_CONFIG[task.category];
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-cream-50 transition-colors ${done ? 'opacity-55' : ''}`}
    >
      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200
        ${done ? 'bg-sage-400 border-sage-400' : overdueLabel ? 'border-amber-400' : 'border-blush-400'}`}>
        {done && <CheckIcon className="w-3 h-3 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${done ? 'line-through text-warm-700' : 'text-warm-900'}`}>
          {task.name}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-warm-700">{task.estimatedMinutes}分</span>
          {overdueLabel && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              {overdueLabel}
            </span>
          )}
        </div>
        {task.tip && (
          <p className="mt-1.5 text-xs text-warm-700 bg-cream-100 rounded-lg px-2.5 py-1.5">
            {task.tip}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Day panel ───────────────────────────────────────────────────────────────

function DayPanel({
  date,
  tasks,
  overdue,
  completions,
  memo,
  onToggle,
  onToggleOverdue,
  onMemoChange,
}: {
  date: Date;
  tasks: Task[];
  overdue: OverdueItem[];
  completions: Record<string, boolean>;
  memo: string;
  onToggle: (id: string) => void;
  onToggleOverdue: (taskId: string, scheduledDate: Date) => void;
  onMemoChange: (text: string) => void;
}) {
  const scheduledMin = getTotalMinutes(tasks);
  const overdueMin   = getTotalMinutes(overdue.map(o => o.task));
  const totalMin     = scheduledMin + overdueMin;

  const scheduledDone = tasks.filter(t => completions[dateKey(date, t.id)]).length;
  const overdueDone   = overdue.filter(o => completions[dateKey(o.scheduledDate, o.task.id)]).length;
  const totalTasks    = tasks.length + overdue.length;
  const totalDone     = scheduledDone + overdueDone;
  const allDone       = totalTasks > 0 && totalDone === totalTasks;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-cream-300 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 transition-colors duration-500" style={{ background: allDone ? '#8BAF8B' : '#5C8AA8' }}>
        <p className="text-white/80 text-sm">
          {date.getMonth() + 1}月{date.getDate()}日（{DOW_FULL[date.getDay()]}）
        </p>
        <p className="text-white font-medium mt-0.5">
          {allDone
            ? 'すべて完了！お疲れさまでした'
            : `${formatMinutes(totalMin)} ・ ${totalTasks}タスク`}
        </p>
        {totalTasks > 0 && (
          <div className="mt-2 h-1 rounded-full bg-white/25">
            <div
              className="h-1 rounded-full bg-white transition-all duration-300"
              style={{ width: `${(totalDone / totalTasks) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Overdue section */}
      {overdue.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-100">
          <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
            <WarnIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs font-medium text-amber-700">
              持ち越しタスク — 早めに対応しましょう
            </p>
          </div>
          <div className="divide-y divide-amber-100">
            {overdue.map(o => (
              <TaskRow
                key={`overdue-${o.task.id}`}
                task={o.task}
                done={!!completions[dateKey(o.scheduledDate, o.task.id)]}
                onToggle={() => onToggleOverdue(o.task.id, o.scheduledDate)}
                overdueLabel={`${o.daysOverdue}日未完了`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scheduled task list */}
      <div className="divide-y divide-cream-200 overflow-y-auto scrollbar-hide">
        {tasks.length === 0 && overdue.length === 0 ? (
          <div className="p-10 text-center text-warm-700">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-cream-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blush-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
            </div>
            <p className="text-sm font-medium text-warm-900">今日はお休みの日</p>
            <p className="text-xs mt-1">ゆっくり休んでください</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              done={!!completions[dateKey(date, task.id)]}
              onToggle={() => onToggle(task.id)}
            />
          ))
        )}
      </div>
      {/* Memo input */}
      <div className="px-4 py-3 border-t border-cream-200">
        <p className="text-xs text-warm-700 mb-1.5">メモ（自由記入）</p>
        <textarea
          value={memo}
          onChange={e => onMemoChange(e.target.value)}
          placeholder="今日やったこと、気づいたことなど..."
          rows={2}
          className="w-full text-sm text-warm-900 placeholder-warm-700/50 bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-blush-400 focus:ring-1 focus:ring-blush-200 transition-colors"
        />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Page() {
  const today = useMemo(() => new Date(), []);
  const [viewY, setViewY] = useState(today.getFullYear());
  const [viewM, setViewM] = useState(today.getMonth());
  const [selected, setSelected] = useState<Date>(today);
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [panelOpen, setPanelOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [startDateInput, setStartDateInput] = useState('');
  const [memos, setMemos] = useState<Record<string, string>>({});
  const [disabledTasks, setDisabledTasks] = useState<Set<string>>(new Set());
  const [disabledInput, setDisabledInput] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCompletions(loadCompletions());
    setMemos(loadMemos());
    const disabled = loadDisabledTasks();
    setDisabledTasks(disabled);
    setDisabledInput(new Set(disabled));
    const sd = loadStartDate();
    if (sd) {
      setStartDate(sd);
      setStartDateInput(toInputValue(sd));
    }
  }, []);

  function toInputValue(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  function openSettings() {
    setStartDateInput(startDate ? toInputValue(startDate) : toInputValue(today));
    setDisabledInput(new Set(disabledTasks));
    setSettingsOpen(true);
  }

  function saveSettings() {
    if (startDateInput) {
      const [y, m, d] = startDateInput.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      setStartDate(date);
      saveStartDate(date);
    }
    setDisabledTasks(new Set(disabledInput));
    saveDisabledTasks(disabledInput);
    setSettingsOpen(false);
  }

  function toggleTaskDisabled(id: string) {
    setDisabledInput(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const grid          = useMemo(() => calendarGrid(viewY, viewM), [viewY, viewM]);
  const selectedTasks = useMemo(() => getActive(selected, disabledTasks), [selected, disabledTasks]);

  // Overdue tasks — only shown when viewing today, respects startDate and disabled tasks
  const overdueTasks = useMemo(
    () => sameDay(selected, today)
      ? computeOverdue(today, completions, startDate, disabledTasks)
      : [],
    [selected, today, completions, startDate, disabledTasks]
  );

  // Monthly progress — exclude days before startDate, exclude disabled tasks
  const { monthTotal, monthDone } = useMemo(() => {
    let monthTotal = 0, monthDone = 0;
    const dim = daysInMonth(viewY, viewM);
    for (let d = 1; d <= dim; d++) {
      const dt = new Date(viewY, viewM, d);
      if (startDate && dt < startDate) continue;
      const ts = getActive(dt, disabledTasks);
      monthTotal += ts.length;
      monthDone  += ts.filter(t => completions[dateKey(dt, t.id)]).length;
    }
    return { monthTotal, monthDone };
  }, [viewY, viewM, completions, startDate, disabledTasks]);

  const pct = monthTotal > 0 ? Math.round((monthDone / monthTotal) * 100) : 0;

  function prevMonth() {
    if (viewM === 0) { setViewY(y => y - 1); setViewM(11); }
    else setViewM(m => m - 1);
  }
  function nextMonth() {
    if (viewM === 11) { setViewY(y => y + 1); setViewM(0); }
    else setViewM(m => m + 1);
  }

  function applyToggle(key: string) {
    setCompletions(prev => {
      const next = { ...prev, [key]: !prev[key] };
      saveCompletions(next);
      return next;
    });
  }

  function toggleTask(taskId: string) {
    applyToggle(dateKey(selected, taskId));
  }

  function toggleOverdue(taskId: string, scheduledDate: Date) {
    applyToggle(dateKey(scheduledDate, taskId));
  }

  function selectDate(d: Date) {
    setSelected(d);
    setPanelOpen(true);
  }

  function handleMemoChange(text: string) {
    const key = memoDateKey(selected);
    setMemos(prev => ({ ...prev, [key]: text }));
    saveMemo(selected, text);
  }

  const sharedPanelProps = {
    date: selected,
    tasks: selectedTasks,
    overdue: overdueTasks,
    completions,
    memo: memos[memoDateKey(selected)] ?? '',
    onToggle: toggleTask,
    onToggleOverdue: toggleOverdue,
    onMemoChange: handleMemoChange,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8F2F8' }}>

      {/* ── Header ── */}
      <header className="bg-white border-b border-cream-300 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-medium text-warm-900 tracking-wide">家事カレンダー</h1>
            <p className="text-xs text-warm-700">毎日30分〜1時間で、無理なく続ける</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openSettings}
              className="w-8 h-8 flex items-center justify-center rounded-full text-warm-700 hover:bg-cream-200 transition-colors"
              aria-label="設定"
            >
              <GearIcon className="w-4 h-4" />
            </button>
            <div className="relative w-11 h-11">
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EDE5DD" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none"
                  stroke="#5C8AA8" strokeWidth="3"
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeLinecap="round" />
              </svg>
              <p className="absolute inset-0 flex items-center justify-center text-[8px] text-blush-500 font-medium leading-none text-center">
                {monthDone}<br /><span className="text-warm-700">/</span>{monthTotal}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-start">

          {/* ── Calendar ── */}
          <div className="w-full md:w-3/5 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full text-warm-700 hover:bg-cream-200 text-lg transition-colors"
                aria-label="前の月">‹</button>
              <h2 className="text-sm font-medium text-warm-900">{viewY}年{MONTH_JP[viewM]}</h2>
              <button onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full text-warm-700 hover:bg-cream-200 text-lg transition-colors"
                aria-label="次の月">›</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-cream-300 overflow-hidden">
              <div className="grid grid-cols-7 border-b border-cream-200">
                {DOW_JP.map((label, i) => (
                  <div key={label} className={`text-center py-2 text-xs font-medium
                    ${i === 0 ? 'text-rose-400' : i === 6 ? 'text-sky-400' : 'text-warm-700'}`}>
                    {label}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {grid.map((date, idx) => {
                  if (!date) return (
                    <div key={`pad-${idx}`} className="min-h-[54px] sm:min-h-[68px] border-t border-cream-100" />
                  );

                  const tasks     = getActive(date, disabledTasks);
                  const doneCount = tasks.filter(t => completions[dateKey(date, t.id)]).length;
                  const allDone   = tasks.length > 0 && doneCount === tasks.length;
                  const cats      = [...new Set(tasks.map(t => t.category))];
                  const isTodayD   = sameDay(date, today);
                  const isSel      = sameDay(date, selected);
                  const beforeStart = startDate ? date < startDate : false;
                  const isPast     = date < today && !isTodayD;
                  const hasIncomp  = isPast && !beforeStart &&
                    tasks.some(t => !completions[dateKey(date, t.id)] && t.id !== 'b1');

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => selectDate(date)}
                      className={`relative flex flex-col items-center pt-1.5 pb-1 min-h-[54px] sm:min-h-[68px]
                        border-t border-cream-100 transition-colors
                        ${isSel ? 'bg-blush-50' : 'hover:bg-cream-50'}`}
                    >
                      <span className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-xs sm:text-sm
                        ${isTodayD
                          ? 'bg-blush-500 text-white font-medium'
                          : isSel
                            ? 'bg-blush-100 text-blush-600 font-medium'
                            : date.getDay() === 0 ? 'text-rose-400'
                            : date.getDay() === 6 ? 'text-sky-500'
                            : 'text-warm-900'}`}>
                        {date.getDate()}
                      </span>

                      {tasks.length > 0 && !beforeStart && (
                        <div className="flex gap-0.5 mt-1 flex-wrap justify-center max-w-[36px]">
                          {allDone ? (
                            <div className="w-3.5 h-3.5 rounded-full bg-sage-400 flex items-center justify-center">
                              <CheckIcon className="w-2 h-2 text-white" />
                            </div>
                          ) : hasIncomp ? (
                            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center">
                              <WarnIcon className="w-2.5 h-2.5 text-white" />
                            </div>
                          ) : (
                            cats.slice(0, 4).map(cat => (
                              <div key={cat} className={`w-1.5 h-1.5 rounded-full ${CATEGORY_CONFIG[cat].dot}`} />
                            ))
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-3 mt-2.5 flex-wrap px-1">
              {(Object.entries(CATEGORY_CONFIG) as [string, typeof CATEGORY_CONFIG[keyof typeof CATEGORY_CONFIG]][]).map(([, cfg]) => (
                <div key={cfg.label} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className="text-xs text-warm-700">{cfg.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-full bg-sage-400 flex items-center justify-center">
                  <CheckIcon className="w-2 h-2 text-white" />
                </div>
                <span className="text-xs text-warm-700">完了</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center">
                  <WarnIcon className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-xs text-warm-700">未完了あり</span>
              </div>
            </div>
          </div>

          {/* ── Day panel: desktop ── */}
          <div className="hidden md:block w-full md:w-2/5 sticky top-20">
            <DayPanel {...sharedPanelProps} />
          </div>
        </div>
      </div>

      {/* ── Day panel: mobile bottom sheet ── */}
      <div className={`fixed inset-x-0 bottom-0 z-30 md:hidden transition-transform duration-300
        ${panelOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-white rounded-t-2xl shadow-2xl max-h-[75vh] flex flex-col">
          {/* Handle bar + close — clearly separated white strip */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-cream-200 bg-white rounded-t-2xl">
            <div className="w-8" />
            <div className="w-10 h-1 rounded-full bg-cream-300" />
            <button
              onClick={() => setPanelOpen(false)}
              className="text-xs font-medium text-warm-700 hover:text-warm-900 bg-cream-100 hover:bg-cream-200 px-3 py-1 rounded-full transition-colors"
            >
              閉じる
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <DayPanel {...sharedPanelProps} />
          </div>
        </div>
      </div>

      {panelOpen && (
        <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setPanelOpen(false)} />
      )}

      {/* ── Settings modal ── */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col max-h-[85vh]">
            <div className="p-6 pb-4 flex-shrink-0">
              <h3 className="text-base font-medium text-warm-900">設定</h3>
            </div>

            <div className="overflow-y-auto scrollbar-hide px-6 flex-1">
              {/* Start date */}
              <p className="text-xs font-medium text-warm-700 mb-1.5">使い始めの日</p>
              <p className="text-xs text-warm-700/70 mb-2">この日より前は未完了・持ち越しの対象外になります</p>
              <input
                type="date"
                value={startDateInput}
                max={toInputValue(today)}
                onChange={e => setStartDateInput(e.target.value)}
                className="w-full border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-warm-900
                  focus:outline-none focus:border-blush-400 focus:ring-1 focus:ring-blush-200"
              />

              {/* Task toggles */}
              <div className="mt-5 border-t border-cream-200 pt-4">
                <p className="text-xs font-medium text-warm-700 mb-3">表示するタスク</p>
                {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(([cat, cfg]) => {
                  const catTasks = Object.values(TASKS).filter(t => t.category === cat);
                  return (
                    <div key={cat} className="mb-4">
                      <p className={`text-xs font-medium mb-2 ${cfg.text}`}>{cfg.label}</p>
                      <div className="space-y-2">
                        {catTasks.map(task => (
                          <label key={task.id} className="flex items-center gap-2.5 cursor-pointer group">
                            <div
                              onClick={() => toggleTaskDisabled(task.id)}
                              className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 cursor-pointer relative
                                ${disabledInput.has(task.id) ? 'bg-cream-300' : 'bg-blush-400'}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
                                ${disabledInput.has(task.id) ? 'translate-x-0.5' : 'translate-x-[18px]'}`} />
                            </div>
                            <span className={`text-sm leading-tight ${disabledInput.has(task.id) ? 'text-warm-700/50 line-through' : 'text-warm-900'}`}>
                              {task.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 p-6 pt-4 border-t border-cream-200 flex-shrink-0">
              <button
                onClick={() => setSettingsOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-cream-300 text-sm text-warm-700 hover:bg-cream-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={saveSettings}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-colors"
                style={{ background: '#5C8AA8' }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
