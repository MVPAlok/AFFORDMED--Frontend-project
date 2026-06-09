import React from 'react';

export default function DashboardAnalytics({ notifications }) {
    // Math
    const total = notifications.length;
    const read = notifications.filter(n => n.read).length;
    const unread = total - read;
    
    const placements = notifications.filter(n => n.type === 'Placement').length;
    const results = notifications.filter(n => n.type === 'Result').length;
    const events = notifications.filter(n => n.type === 'Event').length;

    const readPercentage = total ? Math.round((read / total) * 100) : 0;
    const unreadPercentage = 100 - readPercentage;

    // Highest score alerts
    const topAlerts = [...notifications]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Analytics</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Insights into notification volume, response behaviors, and placement opportunities.</p>
            </div>

            {/* Top row cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Volume Alert */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Notices</span>
                        <div className="text-4xl font-black text-slate-900 mt-2">{total}</div>
                        <p className="text-slate-400 text-xs font-semibold mt-1">Processed in Semester VIII</p>
                    </div>
                    <div className="mt-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                        <span className="text-xs text-primary font-bold">12 parsed today</span>
                    </div>
                </div>

                {/* Donut Ratio Alert */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Read vs Unread Ratio</span>
                    
                    <div className="flex items-center gap-6 mt-4">
                        {/* Circular progress with SVG */}
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="40" cy="40" r="32" stroke="#eaedff" strokeWidth="6" fill="transparent" />
                                <circle 
                                    cx="40" 
                                    cy="40" 
                                    r="32" 
                                    stroke="#4f46e5" 
                                    strokeWidth="6" 
                                    fill="transparent" 
                                    strokeDasharray="201" 
                                    strokeDashoffset={201 - (201 * readPercentage) / 100}
                                    strokeLinecap="round" 
                                />
                            </svg>
                            <span className="absolute text-sm font-black text-slate-900">{readPercentage}%</span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                <span className="w-2.5 h-2.5 bg-primary rounded"></span>
                                <span>Read ({read})</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                <span className="w-2.5 h-2.5 bg-slate-200 rounded"></span>
                                <span>Unread ({unread})</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Engagement Index */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Priority Score</span>
                        <div className="text-4xl font-black text-slate-900 mt-2">
                            {total ? Math.round(notifications.reduce((acc, curr) => acc + curr.score, 0) / total) : 0}
                        </div>
                        <p className="text-slate-400 text-xs font-semibold mt-1">Score quality indicates high relevance.</p>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                        <span className="material-symbols-outlined text-sm font-black">arrow_upward</span>
                        <span>4.2% higher relevance score</span>
                    </div>
                </div>
            </div>

            {/* Interactive Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Area Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <div>
                        <h3 className="font-black text-slate-900 text-base">Notice Parsing Volume</h3>
                        <p className="text-slate-400 text-xs mt-1">Monthly frequency of notifications processed by CampusPulse.</p>
                    </div>

                    {/* Area SVG Line Chart */}
                    <div className="relative h-60 w-full pt-4">
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" />

                            {/* Filled Area */}
                            <path 
                                d="M0,170 Q70,120 140,140 T280,60 T420,80 L500,40 L500,200 L0,200 Z" 
                                fill="url(#area-grad)" 
                                opacity="0.4"
                            />
                            
                            {/* Smooth Stroke */}
                            <path 
                                d="M0,170 Q70,120 140,140 T280,60 T420,80 L500,40" 
                                fill="none" 
                                stroke="#4f46e5" 
                                strokeWidth="3" 
                                strokeLinecap="round"
                            />

                            <defs>
                                <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4f46e5" />
                                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Chart Axis Labels */}
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                        </div>
                    </div>
                </div>

                {/* Category distribution */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <div>
                        <h3 className="font-black text-slate-900 text-base">Category Distribution</h3>
                        <p className="text-slate-400 text-xs mt-1">Comparison of notice types parsed into your dashboard.</p>
                    </div>

                    <div className="space-y-4 pt-4">
                        {/* Placement */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    Placements
                                </span>
                                <span>{placements} ({total ? Math.round((placements / total) * 100) : 0}%)</span>
                            </div>
                            <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${total ? (placements / total) * 100 : 0}%` }}></div>
                            </div>
                        </div>

                        {/* Result */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Academic Results
                                </span>
                                <span>{results} ({total ? Math.round((results / total) * 100) : 0}%)</span>
                            </div>
                            <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${total ? (results / total) * 100 : 0}%` }}></div>
                            </div>
                        </div>

                        {/* Event */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                    Campus Events
                                </span>
                                <span>{events} ({total ? Math.round((events / total) * 100) : 0}%)</span>
                            </div>
                            <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-sky-500 h-full rounded-full" style={{ width: `${total ? (events / total) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Most Important Alerts Table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div>
                    <h3 className="font-black text-slate-900 text-base">High-Value Opportunities Surfaced</h3>
                    <p className="text-slate-400 text-xs mt-1">Listing of top notifications ranked by the priority scoring algorithm.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                <th className="pb-3 font-black">Notification Title</th>
                                <th className="pb-3 font-black">Category</th>
                                <th className="pb-3 font-black">Score</th>
                                <th className="pb-3 font-black">Date Processed</th>
                                <th className="pb-3 font-black text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topAlerts.map((alert) => (
                                <tr key={alert.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 font-black text-slate-800 text-sm">{alert.title}</td>
                                    <td className="py-4 text-xs font-bold">
                                        <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${
                                            alert.type === 'Placement' 
                                                ? 'bg-primary/5 text-primary border-primary/10' 
                                                : alert.type === 'Result'
                                                    ? 'bg-amber-500/5 text-amber-600 border-amber-500/10'
                                                    : 'bg-sky-500/5 text-sky-600 border-sky-500/10'
                                        }`}>
                                            {alert.type}
                                        </span>
                                    </td>
                                    <td className="py-4 font-black text-slate-900 text-sm">{alert.score}</td>
                                    <td className="py-4 text-xs text-slate-500 font-semibold">{alert.date}</td>
                                    <td className="py-4 text-xs text-right font-black">
                                        <span className={alert.read ? 'text-slate-400' : 'text-primary'}>
                                            {alert.read ? 'Read' : 'Unread'}
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
