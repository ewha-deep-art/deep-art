export type LogLevel = "info" | "error" | "warn";

export interface LogEntry {
  id: number;
  level: LogLevel;
  source: string;
  message: string;
  timestamp: string;
}

// Global singleton — persists across hot-reloads in dev via globalThis
const g = globalThis as typeof globalThis & {
  __deepart_logs?: LogEntry[];
  __deepart_log_id?: number;
};

if (!g.__deepart_logs) g.__deepart_logs = [];
if (g.__deepart_log_id === undefined) g.__deepart_log_id = 0;

const MAX_LOGS = 500;

function append(level: LogLevel, source: string, message: string) {
  const id = (g.__deepart_log_id = (g.__deepart_log_id ?? 0) + 1);
  const entry: LogEntry = {
    id,
    level,
    source,
    message,
    timestamp: new Date().toISOString(),
  };
  g.__deepart_logs!.push(entry);
  if (g.__deepart_logs!.length > MAX_LOGS) g.__deepart_logs!.shift();
}

export const logger = {
  log(source: string, message: string) {
    console.log(`[${source}] ${message}`);
    append("info", source, message);
  },
  error(source: string, message: string) {
    console.error(`[${source}] ${message}`);
    append("error", source, message);
  },
  warn(source: string, message: string) {
    console.warn(`[${source}] ${message}`);
    append("warn", source, message);
  },
  getLogs(): LogEntry[] {
    return [...(g.__deepart_logs ?? [])].reverse();
  },
  clear() {
    g.__deepart_logs = [];
  },
};
