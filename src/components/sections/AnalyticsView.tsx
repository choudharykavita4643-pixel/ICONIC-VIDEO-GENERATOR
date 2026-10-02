import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Clock,
  Users,
  DollarSign,
  ArrowUpRight,
  Filter,
  Smartphone,
  Tv,
  Monitor,
} from 'lucide-react';
import { cyberpunkImg, jungleRobotImg, heroImg } from '../../services/storageService';

type TimeRange = '7d' | '28d' | '90d' | '365d';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('28d');

  const stats = {
    '7d': { views: '142.8K', watchHours: '4,120', subs: '+1,840', rpm: '$890', ctr: '11.4%' },
    '28d': { views: '489.2K', watchHours: '16,400', subs: '+6,200', rpm: '$3,420', ctr: '12.8%' },
    '90d': { views: '1.45M', watchHours: '52,800', subs: '+19,400', rpm: '$11,200', ctr: '10.9%' },
    '365d': { views: '4.89M', watchHours: '194,000', subs: '+64,800', rpm: '$42,500', ctr: '11.8%' },
  }[timeRange];

  // Daily views bar chart data
  const chartPoints = [
    { day: 'Day 1', val: 35 },
    { day: 'Day 3', val: 55 },
    { day: 'Day 6', val: 42 },
    { day: 'Day 9', val: 78 },
    { day: 'Day 12', val: 65 },
    { day: 'Day 15', val: 92 },
    { day: 'Day 18', val: 84 },
    { day: 'Day 21', val: 110 },
    { day: 'Day 24', val: 95 },
    { day: 'Day 28', val: 125 },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Channel & Content Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time performance metrics, audience retention, and revenue projections.
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          {(['7d', '28d', '90d', '365d'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                timeRange === r
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === '7d' ? '7 Days' : r === '28d' ? '28 Days' : r === '90d' ? '90 Days' : 'Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Metric Cards (Clean unboxed figures with tabular alignment) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#090D16] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Views</span>
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
            {stats.views}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <ArrowUpRight className="w-3 h-3" />
            <span>+24.8% vs prior</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090D16] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Watch Time</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
            {stats.watchHours} hrs
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18.2%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090D16] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Subscribers</span>
            <Users className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
            {stats.subs}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <ArrowUpRight className="w-3 h-3" />
            <span>+31.5%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090D16] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Est. Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-400">
            {stats.rpm}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <span>RPM: $6.98</span>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-[#090D16] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Impression CTR</span>
            <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
            {stats.ctr}
          </div>
          <div className="text-[11px] text-cyan-400 font-medium">
            <span>High viral velocity</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid: Growth Chart & Retention Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Daily Views Line / Bar Histogram */}
        <div className="lg:col-span-8 bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-white">Views Velocity Trend</span>
            <span className="text-[11px] font-mono text-cyan-400">Steady Growth (+34%)</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2">
            {chartPoints.map((pt, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600/40 via-cyan-500 to-cyan-400 transition-all group-hover:from-cyan-400 group-hover:to-cyan-200"
                  style={{ height: `${(pt.val / 130) * 100}%` }}
                />
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  {pt.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>YouTube Shorts Velocity: 68% of Total Traffic</span>
            <span className="font-mono text-slate-200">Peak: 125,000 views/day</span>
          </div>
        </div>

        {/* Right: Audience Retention Curve Breakdown */}
        <div className="lg:col-span-4 bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-white">Audience Retention Curve</span>
            <span className="text-[11px] font-mono text-emerald-400">82% Hook Retention</span>
          </div>

          {/* Simulated Retention Graph */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                <span>Hook Retention (0-5s)</span>
                <span className="font-mono font-bold text-cyan-400">88%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                <span>Mid-Video Pacing (5-30s)</span>
                <span className="font-mono font-bold text-indigo-400">74%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '74%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                <span>Call to Action Completion</span>
                <span className="font-mono font-bold text-purple-400">62%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            {/* Device breakdown */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Traffic by Device
              </span>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mobile (Shorts)</span>
                </div>
                <span className="font-mono font-semibold">74%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Desktop</span>
                </div>
                <span className="font-mono font-semibold">18%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-purple-400" />
                  <span>Living Room / TV</span>
                </div>
                <span className="font-mono font-semibold">8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
