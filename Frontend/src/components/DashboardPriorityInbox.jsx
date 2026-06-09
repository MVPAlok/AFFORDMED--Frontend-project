import React, { useState } from 'react';

export default function DashboardPriorityInbox({ notifications, setNotifications }) {
    const [topN, setTopN] = useState(10);
    const [hoveredScore, setHoveredScore] = useState(null);

    // Sort notifications strictly by score desc
    const sorted = [...notifications]
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);

    const toggleRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
    };

    // Calculate score distribution counts for chart
    const scoreRanges = [
        { label: '90-100', count: notifications.filter(n => n.score >= 90 && n.score <= 100).length, color: 'bg-primary' },
        { label: '80-89', count: notifications.filter(n => n.score >= 80 && n.score < 90).length, color: 'bg-amber-500' },
        { label: '70-79', count: notifications.filter(n => n.score >= 70 && n.score < 80).length, color: 'bg-indigo-400' },
        { label: '60-69', count: notifications.filter(n => n.score >= 60 && n.score < 70).length, color: 'bg-slate-400' },
        { label: '<60', count: notifications.filter(n => n.score < 60).length, color: 'bg-slate-300' }
    ];

    const maxCount = Math.max(...scoreRanges.map(r => r.count), 1);

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Priority Inbox
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">
                        Notifications prioritized using semantic scoring matching your student profile details.
                    </p>
                </div>
                
                {/* Top N Selector */}
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                    <span className="text-xs text-slate-400 font-bold pl-3">Top Alerts:</span>
                    {[10, 15, 20].map((n) => (
                        <button
                            key={n}
                            onClick={() => setTopN(n)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                topN === n 
                                    ? 'bg-primary text-white shadow-sm shadow-primary/15' 
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            {/* High-Fidelity Chart & Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ranking Chart Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-6">
                    <div>
                        <h3 className="font-black text-slate-900 text-base">Alert Score Distribution</h3>
                        <p className="text-slate-400 text-xs mt-1">Counts of active alerts grouped by Priority Score ranges.</p>
                    </div>

                    {/* Chart Bars */}
                    <div className="space-y-4">
                        {scoreRanges.map((range) => {
                            const percent = (range.count / maxCount) * 100;
                            return (
                                <div key={range.label} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                        <span>Score {range.label}</span>
                                        <span>{range.count} {range.count === 1 ? 'alert' : 'alerts'}</span>
                                    </div>
                                    <div className="w-full bg-slate-50 border border-slate-100 h-3 rounded-full overflow-hidden">
                                        <div 
                                            className={`${range.color} h-full rounded-full transition-all duration-1000`} 
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Score Breakdown Card */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-6">
                    <div>
                        <h3 className="font-black text-slate-900 text-base">How Scores Are Derived</h3>
                        <p className="text-slate-400 text-xs mt-1">Our intelligent prioritization engine computes scores across three criteria.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Criteria 1 */}
                        <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 space-y-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">psychology</span>
                            </div>
                            <div className="text-sm font-black text-slate-800">Relevance (45%)</div>
                            <p className="text-slate-500 text-xs leading-relaxed font-medium">Matches alert text against your branch, semester, projects, and skills profiles.</p>
                        </div>

                        {/* Criteria 2 */}
                        <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 space-y-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">timer</span>
                            </div>
                            <div className="text-sm font-black text-slate-800">Urgency (35%)</div>
                            <p className="text-slate-500 text-xs leading-relaxed font-medium">Derived from calendar dates, response portals, and application deadlines detected.</p>
                        </div>

                        {/* Criteria 3 */}
                        <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 space-y-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">school</span>
                            </div>
                            <div className="text-sm font-black text-slate-800">Eligibility (20%)</div>
                            <p className="text-slate-500 text-xs leading-relaxed font-medium">Calculates match logic based on your academic CGPA requirements.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sorted Ranked Cards */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="material-symbols-outlined text-primary text-xl">sort</span>
                    <h2 className="text-lg font-black text-slate-900">Ranked Alerts List</h2>
                </div>

                {sorted.map((item, index) => {
                    const isPlacement = item.type === 'Placement';
                    const isResult = item.type === 'Result';
                    const badgeColor = isPlacement 
                        ? 'bg-primary/5 text-primary border-primary/10' 
                        : isResult 
                            ? 'bg-amber-500/5 text-amber-600 border-amber-500/10' 
                            : 'bg-sky-500/5 text-sky-600 border-sky-500/10';

                    return (
                        <div 
                            key={item.id} 
                            className={`bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-primary/35 transition-all duration-200 relative flex flex-col md:flex-row justify-between gap-6 ${!item.read ? 'border-l-4 border-l-primary' : ''}`}
                        >
                            <div className="flex items-start gap-4 flex-1">
                                {/* Rank circle */}
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                    #{index + 1}
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${badgeColor}`}>
                                            {item.type}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-semibold">{item.date}</span>
                                        {!item.read && (
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-black text-slate-900">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                        {item.body}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-6 text-[11px] text-slate-400 font-bold border-t border-slate-100 pt-3 mt-1">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm text-slate-400">group</span>
                                            {item.criteria}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm text-slate-400">speed</span>
                                            Urgency Score: {item.score >= 90 ? '9.5/10' : item.score >= 80 ? '8.2/10' : '6.4/10'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex md:flex-col items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                                {/* Score Widget */}
                                <div className="text-right flex items-center md:flex-col gap-2 md:gap-0">
                                    <div className={`text-3xl font-black ${item.score >= 90 ? 'text-primary' : item.score >= 80 ? 'text-amber-500' : 'text-slate-400'}`}>
                                        {item.score}
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Score</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => toggleRead(item.id)}
                                        title={item.read ? 'Mark as unread' : 'Mark as read'} 
                                        className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            {item.read ? 'mark_chat_unread' : 'mark_chat_read'}
                                        </span>
                                    </button>
                                    <button className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-primary transition-all">
                                        {item.actionLabel}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
