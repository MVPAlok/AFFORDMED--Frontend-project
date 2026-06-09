import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

export default function DashboardAnalytics() {
    const { notifications, loading, error } = useNotifications();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F46E5]"></div>
            </div>
        );
    }
    
    if (error) {
        return <div className="text-red-500 font-bold p-10">{error}</div>;
    }

    const total = notifications.length;
    const read = notifications.filter(n => n.read).length;
    const unread = total - read;
    
    const placements = notifications.filter(n => n.type === 'Placement').length;
    const results = notifications.filter(n => n.type === 'Result').length;
    const events = notifications.filter(n => n.type === 'Event').length;

    const readPercentage = total ? Math.round((read / total) * 100) : 0;

    const topAlerts = [...notifications]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return (
        <div className="space-y-10 animate-fadeIn select-none">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">System Analytics</h1>
                <p className="text-[#64748B] text-xs font-bold mt-1.5">Parsed notice volumes, read ratios, and category ratios.</p>
            </div>

            {/* Micro stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total card */}
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-36">
                    <div>
                        <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-wider">Total notices</span>
                        <div className="text-3xl font-black text-[#0F172A] mt-2">{total}</div>
                        <p className="text-[#94A3B8] text-[10px] font-bold uppercase mt-1">Processed in Sem VIII</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#4F46E5] font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-ping" />
                        <span>12 updates today</span>
                    </div>
                </div>

                {/* Donut progress */}
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between h-36">
                    <div className="space-y-1">
                        <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-wider block">Read Ratio</span>
                        <div className="text-3xl font-black text-[#0F172A]">{readPercentage}%</div>
                        <p className="text-[#64748B] text-[10px] font-bold">{read} of {total} read</p>
                    </div>
                    
                    {/* Compact SVG Donut */}
                    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="26" stroke="#F1F5F9" strokeWidth="5.5" fill="transparent" />
                            <circle 
                                cx="32" 
                                cy="32" 
                                r="26" 
                                stroke="#4F46E5" 
                                strokeWidth="5.5" 
                                fill="transparent" 
                                strokeDasharray="163" 
                                strokeDashoffset={163 - (163 * readPercentage) / 100}
                                strokeLinecap="round" 
                            />
                        </svg>
                    </div>
                </div>

                {/* Average priority */}
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-36">
                    <div>
                        <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-wider">Average Priority</span>
                        <div className="text-3xl font-black text-[#0F172A] mt-2">
                            {total ? Math.round(notifications.reduce((acc, curr) => acc + curr.score, 0) / total) : 0}
                        </div>
                        <p className="text-[#94A3B8] text-[10px] font-bold uppercase mt-1">Co-efficiency index</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                        <span className="material-symbols-outlined text-sm font-black">arrow_upward</span>
                        <span>4.2% higher quality</span>
                    </div>
                </div>
            </div>

            {/* Main visual charts layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Area volume chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
                    <div>
                        <h3 className="font-black text-[#0F172A] text-sm tracking-tight">Notice Volume Analytics</h3>
                        <p className="text-[#94A3B8] text-[10px] font-bold uppercase mt-1">Alert counts parsed monthly</p>
                    </div>

                    <div className="relative h-44 w-full">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.22" />
                                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Horizontal guide grids */}
                            <line x1="0" y1="37" x2="500" y2="37" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3" />
                            <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3" />
                            <line x1="0" y1="112" x2="500" y2="112" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3" />

                            {/* Chart Area fill */}
                            <path 
                                d="M0,130 Q80,90 160,110 T320,50 T450,70 L500,30 L500,140 L0,140 Z" 
                                fill="url(#area-gradient)" 
                            />
                            {/* Chart Line stroke */}
                            <path 
                                d="M0,130 Q80,90 160,110 T320,50 T450,70 L500,30" 
                                fill="none" 
                                stroke="#4F46E5" 
                                strokeWidth="2.5" 
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Chart label tags */}
                        <div className="flex justify-between text-[9px] text-[#94A3B8] font-black uppercase mt-3">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                        </div>
                    </div>
                </div>

                {/* Category ratio sliders */}
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
                    <div>
                        <h3 className="font-black text-[#0F172A] text-sm tracking-tight">Category Distribution</h3>
                        <p className="text-[#94A3B8] text-[10px] font-bold uppercase mt-1">Notices split by departments</p>
                    </div>

                    <div className="space-y-4 pt-2">
                        {/* Placement */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-[#64748B]">
                                <span className="flex items-center gap-1.5 text-[#0F172A]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                                    Placements
                                </span>
                                <span>{placements} ({total ? Math.round((placements / total) * 100) : 0}%)</span>
                            </div>
                            <div className="w-full bg-[#F8FAFC] h-2 rounded-lg overflow-hidden border border-[#F1F5F9]">
                                <div className="bg-[#4F46E5] h-full rounded-lg" style={{ width: `${total ? (placements / total) * 100 : 0}%` }}></div>
                            </div>
                        </div>

                        {/* Result */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-[#64748B]">
                                <span className="flex items-center gap-1.5 text-[#0F172A]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Results
                                </span>
                                <span>{results} ({total ? Math.round((results / total) * 100) : 0}%)</span>
                            </div>
                            <div className="w-full bg-[#F8FAFC] h-2 rounded-lg overflow-hidden border border-[#F1F5F9]">
                                <div className="bg-amber-500 h-full rounded-lg" style={{ width: `${total ? (results / total) * 100 : 0}%` }}></div>
                            </div>
                        </div>

                        {/* Event */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-[#64748B]">
                                <span className="flex items-center gap-1.5 text-[#0F172A]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                    Events
                                </span>
                                <span>{events} ({total ? Math.round((events / total) * 100) : 0}%)</span>
                            </div>
                            <div className="w-full bg-[#F8FAFC] h-2 rounded-lg overflow-hidden border border-[#F1F5F9]">
                                <div className="bg-sky-500 h-full rounded-lg" style={{ width: `${total ? (events / total) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sleek Row Table for top alerts */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
                <div>
                    <h3 className="font-black text-[#0F172A] text-sm tracking-tight">Top Scoring Notices</h3>
                    <p className="text-[#94A3B8] text-[10px] font-bold uppercase mt-1">High significance notices computed by engine</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#F1F5F9] text-[9px] font-black uppercase text-[#94A3B8] tracking-widest pb-3">
                                <th className="pb-3">Title</th>
                                <th className="pb-3">Category</th>
                                <th className="pb-3">Score</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                            {topAlerts.map((alert) => (
                                <tr key={alert.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                                    <td className="py-3.5 font-black text-xs text-[#0F172A]">{alert.title}</td>
                                    <td className="py-3.5">
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-wider ${
                                            alert.type === 'Placement' 
                                                ? 'bg-[#4F46E5]/5 text-[#4F46E5] border-[#4F46E5]/10' 
                                                : alert.type === 'Result'
                                                    ? 'bg-amber-500/5 text-amber-600 border-amber-500/10'
                                                    : 'bg-sky-500/5 text-sky-600 border-sky-500/10'
                                        }`}>
                                            {alert.type}
                                        </span>
                                    </td>
                                    <td className="py-3.5 text-xs font-black text-[#0F172A]">{alert.score}</td>
                                    <td className="py-3.5 text-[11px] text-[#64748B] font-bold">{alert.date}</td>
                                    <td className="py-3.5 text-[11px] text-right font-black">
                                        <span className={alert.read ? 'text-[#94A3B8]' : 'text-[#4F46E5]'}>
                                            {alert.read ? 'READ' : 'UNREAD'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
