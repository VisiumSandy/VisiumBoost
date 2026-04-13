"use client";

import Icon from "@/components/Icon";

export default function StatCard({ icon, label, value, trend, color }) {
  return (
    <div className="card p-5 flex-1 min-w-[200px] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div
          className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
          style={{ background: `${color}14` }}
        >
          <Icon name={icon} size={20} color={color} />
        </div>
        {trend && (
          <span className="badge-success">{trend}</span>
        )}
      </div>
      <div>
        <div className="text-[28px] font-extrabold text-dark-900 tracking-tight leading-none">
          {value}
        </div>
        <div className="text-[13px] text-gray-400 font-medium mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}
