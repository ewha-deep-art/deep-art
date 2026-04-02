"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LogEntry } from "@/lib/logger";

const LEVEL_STYLE: Record<string, string> = {
  info: "text-green-400",
  error: "text-red-400",
  warn: "text-yellow-400",
};

const LEVEL_BADGE: Record<string, string> = {
  info: "bg-green-900 text-green-300",
  error: "bg-red-900 text-red-300",
  warn: "bg-yellow-900 text-yellow-300",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
}

export default function LogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState<"all" | "info" | "error" | "warn">("all");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchLogs() {
    const res = await fetch("/api/logs");
    if (!res.ok) return;
    const data = await res.json();
    setLogs(data.logs);
  }

  async function clearLogs() {
    await fetch("/api/logs", { method: "DELETE" });
    setLogs([]);
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchLogs, 2000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh]);

  const displayed = useMemo(
    () => (filter === "all" ? logs : logs.filter((l) => l.level === filter)),
    [logs, filter],
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">서버 로그</h1>
            <p className="text-xs text-gray-500 mt-0.5">최신 {displayed.length}건 표시 · 최대 500건 보관</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded px-2 py-1"
            >
              <option value="all">전체</option>
              <option value="info">INFO</option>
              <option value="warn">WARN</option>
              <option value="error">ERROR</option>
            </select>

            <button
              onClick={() => setAutoRefresh((v) => !v)}
              className={`text-xs px-3 py-1 rounded border ${
                autoRefresh
                  ? "bg-blue-900 border-blue-700 text-blue-300"
                  : "bg-gray-800 border-gray-700 text-gray-400"
              }`}
            >
              {autoRefresh ? "자동갱신 ON" : "자동갱신 OFF"}
            </button>

            <button
              onClick={fetchLogs}
              className="text-xs px-3 py-1 rounded border bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              새로고침
            </button>

            <button
              onClick={clearLogs}
              className="text-xs px-3 py-1 rounded border bg-red-950 border-red-800 text-red-400 hover:bg-red-900"
            >
              초기화
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {displayed.length === 0 ? (
            <p className="text-gray-600 text-sm p-6 text-center">로그가 없습니다.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500">
                  <th className="text-left px-4 py-2 w-44">시간</th>
                  <th className="text-left px-4 py-2 w-16">레벨</th>
                  <th className="text-left px-4 py-2 w-48">소스</th>
                  <th className="text-left px-4 py-2">메시지</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-800/50 hover:bg-gray-800/40">
                    <td className="px-4 py-1.5 text-gray-500 whitespace-nowrap">
                      {formatTime(entry.timestamp)}
                    </td>
                    <td className="px-4 py-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${LEVEL_BADGE[entry.level]}`}>
                        {entry.level}
                      </span>
                    </td>
                    <td className="px-4 py-1.5 text-gray-400 whitespace-nowrap">{entry.source}</td>
                    <td className={`px-4 py-1.5 break-all ${LEVEL_STYLE[entry.level]}`}>
                      {entry.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
