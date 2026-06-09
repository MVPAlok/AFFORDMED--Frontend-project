import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';

export default function DashboardPriorityInbox({ profile }) {
    const { notifications, loading, error, toggleReadStatus } = useNotifications();
    const [topN, setTopN] = useState(10);

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

    const sorted = [...notifications]
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);

    // Score groupings for custom distributions
    const ranges = [
        { label: '90-100', count: notifications.filter(n => n.score >= 90 && n.score <= 100).length, color: '#4F46E5' },
        { label: '80-89', count: notifications.filter(n => n.score >= 80 && n.score < 90).length, color: '#F59E0B' },
        { label: '70-79', count: notifications.filter(n => n.score >= 70 && n.score < 80).length, color: '#6366F1' },
        { label: '60-69', count: notifications.filter(n => n.score >= 60 && n.score < 70).length, color: '#94A3B8' },
        { label: '<60', count: notifications.filter(n => n.score < 60).length, color: '#CBD5E1' }
    ];

    const maxVal = Math.max(...ranges.map(r => r.count), 1);

    return (
        <div className="space-y-10 animate-fadeIn select-none">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F5F9] pb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Priority Workspace</h1>
                    <p className="text-[#64748B] text-xs font-bold mt-1.5">A focus dashboard filtering notices based on eligibility thresholds and tags.</p>
                </div>

                {/* Top N Selector */}
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-wider pl-2.5 pr-1">Show top:</span>
                    {[10, 15, 20].map((n) => (
                        <button
                            key={n}
                            onClick={() => setTopN(n)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                topN === n 
                                    ? 'bg-[#0F172A] text-white shadow-sm' 
                                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            {/* Visual Distributions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Chart Panel */}
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div>
                        <h3 className="font-black text-[#0F172A] text-sm tracking-tight">Score Distribution</h3>
                        <p className="text-[#94A3B8] text-[10px] font-bold uppercase mt-1">Alert groups by relevance score</p>
                    </div>

                    <div className="space-y-3.5">
                        {ranges.map((rng) => {
                            const pct = (rng.count / maxVal) * 100;
                            return (
                                <div key={rng.label} className="space-y-1">
                                    <div className="flex justify-between items-center text-[11px] font-bold text-[#64748B]">
                                        <span>Scores {rng.label}</span>
                                        <span className="text-[#0F172A] font-black">{rng.count} alerts</span>
                                    </div>
                                    <div className="w-full bg-[#F8FAFC] border border-[#F1F5F9] h-2.5 rounded-lg overflow-hidden relative">
                                        <div 
                                            className="h-full rounded-lg transition-all duration-700"
                                            style={{ width: `${pct}%`, backgroundColor: rng.color }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Rules Details */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div>
                        <h3 className="font-black text-[#0F172A] text-sm tracking-tight">Prioritization Matrix</h3>
                        <p className="text-[#94A3B8] text-[10px] font-bold uppercase mt-1">How score coefficients are evaluated</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { name: 'Relevance (45%)', desc: 'Evaluates matching skill tags, branch fields, and semester profiles.', color: 'border-l-[#4F46E5] text-[#4F46E5]', icon: 'psychology' },
                            { name: 'Urgency (35%)', desc: 'Tracks OA calendar times, deadline parameters, and portal limits.', color: 'border-l-amber-500 text-amber-600', icon: 'schedule' },
                            { name: 'Eligibility (20%)', desc: 'Checks minimum CGPA cutoffs against your verified transcript metrics.', color: 'border-l-sky-500 text-sky-600', icon: 'school' }
                        ].map((m) => (
                            <div key={m.name} className={`border-l-4 ${m.color} bg-[#F8FAFC]/50 p-4 rounded-r-xl border border-y-[#E2E8F0] border-r-[#E2E8F0] space-y-2`}>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm font-semibold">{m.icon}</span>
                                    <div className="text-xs font-black text-[#0F172A]">{m.name}</div>
                                </div>
                                <p className="text-[#64748B] text-[11px] leading-relaxed font-medium">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Row sorted */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
                    <span className="material-symbols-outlined text-[#0F172A] text-sm font-black">sort</span>
                    <h2 className="text-sm font-black text-[#0F172A] tracking-tight">Ranked Alerts ({topN})</h2>
                </div>

                <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    {sorted.map((item, idx) => {
                        const isPlacement = item.type === 'Placement';
                        const isResult = item.type === 'Result';
                        const badgeColor = isPlacement 
                            ? 'bg-[#4F46E5]/5 text-[#4F46E5] border-[#4F46E5]/10' 
                            : isResult 
                                ? 'bg-amber-500/5 text-amber-600 border-amber-500/10' 
                                : 'bg-sky-500/5 text-sky-600 border-sky-500/10';

                        return (
                            <div 
                                key={item.id} 
                                className="p-5 hover:bg-[#F8FAFC]/60 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative group"
                            >
                                {/* Title and Rank */}
                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                    <div className="w-6 h-6 rounded-md bg-[#F1F5F9] text-[#64748B] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-1">
                                        #{idx + 1}
                                    </div>
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-wider ${badgeColor}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-[10px] text-[#94A3B8] font-bold">{item.date}</span>
                                            {!item.read && (
                                                <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full"></span>
                                            )}
                                        </div>
                                        <h3 className="text-sm font-black text-[#0F172A] group-hover:text-[#4F46E5] transition-colors truncate">
                                            {item.title}
                                        </h3>
                                        <p className="text-[#64748B] text-xs leading-normal font-medium max-w-xl truncate">
                                            {item.body}
                                        </p>
                                    </div>
                                </div>

                                {/* Score & Actions */}
                                <div className="flex items-center gap-4 self-stretch sm:self-center justify-between sm:justify-end flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                                    {/* Priority score widget */}
                                    <div className="flex items-center gap-1.5 bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 rounded-lg">
                                        <span className={`text-[11px] font-black ${item.score >= 90 ? 'text-[#4F46E5]' : item.score >= 80 ? 'text-amber-500' : 'text-[#64748B]'}`}>
                                            {item.score}
                                        </span>
                                        <span className="text-[8px] font-black text-[#94A3B8] uppercase">Score</span>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => toggleReadStatus(item.id)}
                                            className="w-8 h-8 rounded-lg border border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1] text-[#94A3B8] hover:text-[#0F172A] flex items-center justify-center transition-colors"
                                            title={item.read ? 'Mark as unread' : 'Mark as read'}
                                        >
                                            <span className="material-symbols-outlined text-[15px] font-black">
                                                {item.read ? 'mark_chat_unread' : 'mark_chat_read'}
                                            </span>
                                        </button>
                                        <button className="bg-[#0F172A] text-white hover:bg-[#4F46E5] text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                                            {item.actionLabel}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
