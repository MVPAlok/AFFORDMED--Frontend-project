import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

export default function DashboardHome({ profile }) {
    const { notifications, loading, error, toggleReadStatus } = useNotifications();

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

    const unread = notifications.filter(n => !n.read).length;
    const placements = notifications.filter(n => n.type === 'Placement').length;
    const results = notifications.filter(n => n.type === 'Result').length;
    const events = notifications.filter(n => n.type === 'Event').length;

    const sortedPriority = [...notifications]
        .filter(n => n.score >= (profile?.threshold || 70))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    // Modern Sparkline with SVG gradient fill & glow
    const PremiumSparkLine = ({ color = '#4F46E5', points, id }) => (
        <svg className="w-20 h-8 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Gradient Fill under path */}
            <path d={`${points} L100,30 L0,30 Z`} fill={`url(#grad-${id})`} />
            {/* Precise Line */}
            <path d={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    return (
        <div className="space-y-12 animate-fadeIn select-none">
            {/* Header Greeting (Linear / Stripe Style: clean, bold, large typography) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-none">
                        Good Morning, {profile.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-[#64748B] mt-2.5 text-xs sm:text-sm font-bold flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#4F46E5] animate-ping"></span>
                        You have <span className="text-[#4F46E5] font-black">{unread} unread notices</span> in your priority inbox.
                    </p>
                </div>
                <div className="flex gap-2">
                    <a href="#dashboard/priority-inbox" className="bg-[#4F46E5] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#3B32C5] active:scale-98 transition-all shadow-md shadow-[#4F46E5]/15 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm font-black">electric_bolt</span>
                        Priority Inbox
                    </a>
                </div>
            </div>

            {/* Statistics Cards (Sleek minimalist containers with sparklines and thin borders) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Unread Alerts', val: unread, color: '#4F46E5', bg: 'bg-[#4F46E5]/5', text: 'text-[#4F46E5]', icon: 'mark_email_unread', spark: 'M0,22 Q25,8 50,18 T100,12', id: 'unread' },
                    { label: 'Placements', val: placements, color: '#10B981', bg: 'bg-[#10B981]/5', text: 'text-[#10B981]', icon: 'work', spark: 'M0,18 L25,12 L50,22 L75,8 L100,14', id: 'placement' },
                    { label: 'Results', val: results, color: '#F59E0B', bg: 'bg-[#F59E0B]/5', text: 'text-[#F59E0B]', icon: 'analytics', spark: 'M0,8 L30,22 L60,12 L100,24', id: 'result' },
                    { label: 'Events', val: events, color: '#0EA5E9', bg: 'bg-[#0EA5E9]/5', text: 'text-[#0EA5E9]', icon: 'event_upcoming', spark: 'M0,18 Q40,8 60,22 T100,10', id: 'event' }
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-[0_4px_20px_rgba(0,0,0,0.015)] transition-all duration-300 flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-wider">{stat.label}</span>
                            <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.text} flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-sm font-black">{stat.icon}</span>
                            </div>
                        </div>
                        <div className="flex items-end justify-between mt-auto">
                            <div className="text-2xl font-black text-[#0F172A]">{stat.val}</div>
                            <div className="w-20">
                                <PremiumSparkLine color={stat.color} points={stat.spark} id={stat.id} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Split: Priority surfaced rows vs modern timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Priority Row List (Linear style list row layout) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                        <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span>
                            <h2 className="text-base font-black text-[#0F172A] tracking-tight">Priority Feed</h2>
                        </div>
                        <a href="#dashboard/priority-inbox" className="text-xs text-[#4F46E5] font-black hover:underline flex items-center gap-0.5">
                            All Priorities <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>

                    <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        {sortedPriority.map((item) => {
                            const isPlacement = item.type === 'Placement';
                            const isResult = item.type === 'Result';
                            const badgeColor = isPlacement 
                                ? 'bg-[#4F46E5]/5 text-[#4F46E5] border-[#4F46E5]/10' 
                                : isResult 
                                    ? 'bg-amber-500/5 text-amber-600 border-amber-500/10' 
                                    : 'bg-sky-500/5 text-sky-650 border-sky-500/10';

                            return (
                                <div 
                                    key={item.id} 
                                    className={`p-5 hover:bg-[#F8FAFC]/60 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative group ${!item.read ? 'bg-white' : 'bg-white'}`}
                                >
                                    {/* Left indicators and text info */}
                                    <div className="flex items-start gap-4 min-w-0 flex-1">
                                        {/* Status Dot */}
                                        <div className="pt-1.5 flex-shrink-0">
                                            <div className={`w-2 h-2 rounded-full ${!item.read ? 'bg-[#4F46E5]' : 'bg-[#E2E8F0]'}`} />
                                        </div>
                                        <div className="space-y-1.5 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-wider ${badgeColor}`}>
                                                    {item.type}
                                                </span>
                                                <span className="text-[10px] text-[#94A3B8] font-bold">{item.timestamp}</span>
                                            </div>
                                            <h3 className="text-sm font-black text-[#0F172A] group-hover:text-[#4F46E5] transition-colors truncate">
                                                {item.title}
                                            </h3>
                                            <p className="text-[#64748B] text-xs leading-normal font-medium truncate max-w-md sm:max-w-lg">
                                                {item.body}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right actions and status */}
                                    <div className="flex items-center gap-4 self-stretch sm:self-center justify-between sm:justify-end flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                                        {/* Priority Chip */}
                                        <div className="flex items-center gap-1.5 bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 rounded-lg">
                                            <span className={`text-[11px] font-black ${item.score >= 90 ? 'text-[#4F46E5]' : item.score >= 80 ? 'text-amber-500' : 'text-[#64748B]'}`}>
                                                {item.score}
                                            </span>
                                            <span className="text-[8px] font-black text-[#94A3B8] uppercase">Score</span>
                                        </div>

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

                {/* Recent Activity Timeline Panel (clean linear tracking timeline) */}
                <div className="space-y-6">
                    <div className="border-b border-[#F1F5F9] pb-4">
                        <h2 className="text-base font-black text-[#0F172A] tracking-tight">System Events</h2>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-6 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        {/* Vertical line chain */}
                        <div className="absolute top-8 bottom-8 left-9 w-[1px] bg-[#E2E8F0]" />

                        {notifications.slice(0, 3).map((evt, idx) => (
                            <div key={evt.id || idx} className="flex gap-4 relative z-10">
                                <div className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center flex-shrink-0 shadow-sm relative">
                                    <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${evt.type === 'Result' ? 'bg-amber-500' : evt.type === 'Placement' ? 'bg-[#4F46E5]' : 'bg-sky-500'}`} />
                                    <span className="material-symbols-outlined text-sm text-[#94A3B8]">{evt.type === 'Result' ? 'analytics' : evt.type === 'Placement' ? 'work' : 'event'}</span>
                                </div>
                                <div className="space-y-0.5 pt-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-[#0F172A] truncate max-w-[120px]">{evt.title}</span>
                                        <span className="text-[9px] text-[#94A3B8] font-bold shrink-0">{evt.timestamp}</span>
                                    </div>
                                    <p className="text-[11px] text-[#64748B] font-medium truncate max-w-[160px] sm:max-w-xs">{evt.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
