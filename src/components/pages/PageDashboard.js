"use client";

import { useApp } from "@/lib/context";
import { CHART_DATA_WEEK } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

export default function PageDashboard() {
  const { codes } = useApp();
  const usedCodes = codes.filter((c) => c.used).length;
  const convRate = codes.length > 0 ? Math.round((usedCodes / codes.length) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-dark-900 tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-gray-400 text-sm mt-1.5">
          Vue d&apos;ensemble de votre activité
        </p>
      </div>

      {/* Stats grid */}
      <div className="flex flex-wrap gap-4 mb-7">
        <StatCard icon="qr" label="Scans QR" value="505" trend="+12.5%" color="#6C5CE7" />
        <StatCard icon="star" label="Clics vers avis" value="370" trend="+8.2%" color="#0984E3" />
        <StatCard icon="code" label="Codes utilisés" value={String(usedCodes)} color="#00B894" />
        <StatCard icon="trendUp" label="Taux conversion" value={`${convRate}%`} color="#E17055" />
      </div>

      {/* Chart */}
      <div className="card p-7">
        <h3 className="text-base font-bold text-dark-900 mb-5">
          Activité hebdomadaire
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={CHART_DATA_WEEK}>
            <defs>
              <linearGradient id="gScans" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gAvis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B894" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#00B894" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: 12, fill: "#8b8da0" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{ fontSize: 12, fill: "#8b8da0" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #f0f0f5",
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <Area
              type="monotone"
              dataKey="scans"
              stroke="#6C5CE7"
              strokeWidth={2.5}
              fill="url(#gScans)"
              name="Scans QR"
            />
            <Area
              type="monotone"
              dataKey="avis"
              stroke="#00B894"
              strokeWidth={2.5}
              fill="url(#gAvis)"
              name="Clics avis"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex gap-6 mt-3 justify-center">
          {[
            ["Scans QR", "#6C5CE7"],
            ["Clics avis", "#00B894"],
          ].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
