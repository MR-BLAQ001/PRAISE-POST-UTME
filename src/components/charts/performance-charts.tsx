"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { subjectName } from "@/lib/subjects";

const TOOLTIP_STYLE = {
  backgroundColor: "rgb(13 20 46)",
  border: "1px solid rgba(148,163,184,.2)",
  borderRadius: 12,
  color: "#e9efff",
  fontSize: 12,
  padding: "8px 12px"
};

export function ScoreTrendChart({
  data
}: {
  data: { label: string; score: number }[];
}) {
  return (
    <div className="h-64 w-full" role="img" aria-label="Score trend over recent examinations">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="score-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3384ff" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#3384ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.12)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#94a3c7", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#94a3c7", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: "rgba(51,132,255,.4)" }} />
          <Area
            type="monotone"
            dataKey="score"
            name="Score"
            stroke="#59a6ff"
            strokeWidth={2.5}
            fill="url(#score-fill)"
            dot={{ fill: "#59a6ff", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubjectAccuracyChart({
  data
}: {
  data: { subject: string; accuracy: number; attempted: number }[];
}) {
  const rows = data.slice(0, 8).map((row) => ({
    ...row,
    name: subjectName(row.subject)
  }));
  return (
    <div className="h-72 w-full" role="img" aria-label="Accuracy by subject">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.1)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: "#94a3c7", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <YAxis
            type="category"
            dataKey="name"
            width={96}
            tick={{ fill: "#94a3c7", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(148,163,184,.06)" }} />
          <Bar dataKey="accuracy" name="Accuracy" radius={[0, 6, 6, 0]} maxBarSize={18}>
            {rows.map((row) => (
              <Cell
                key={row.subject}
                fill={row.accuracy >= 70 ? "#34d399" : row.accuracy >= 50 ? "#f5c451" : "#fb7185"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
