"use client";

import Icon from "@/components/Icon";

export default function StatCard({ icon, label, value, sub, color = "#3B82F6" }) {
  return (
    <div className="card p-4 flex-1" style={{ minWidth: 0 }}>
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}12` }}
        >
          <Icon name={icon} size={18} color={color} />
        </div>
      </div>
      <div className="text-[26px] font-bold text-slate-900 tracking-tight leading-none mb-1">
        {value}
      </div>
      <div className="text-[13px] text-slate-500 font-medium">{label}</div>
      {sub && (
        <div className="text-[12px] text-slate-400 mt-0.5">{sub}</div>
      )}
    </div>
  );
}
