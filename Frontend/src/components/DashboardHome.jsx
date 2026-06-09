import React from 'react';

export default function DashboardHome({ notifications, setNotifications, profile }) {
    // Basic stats calculation
    const unread = notifications.filter(n => !n.read).length;
    const placements = notifications.filter(n => n.type === 'Placement').length;
    const results = notifications.filter(n => n.type === 'Result').length;
    const events = notifications.filter(n => n.type === 'Event').length;

    // Filter by threshold
    const sortedPriority = [...notifications]
        .filter(n => n.score >= (profile.threshold || 70))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    const toggleRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
    };

    // Simple line sparks using SVG
    const SparkLine = ({ color = '#4F46E5', points }) => (
        <svg className="w-16 h-6 overflow-visible" viewBox="0 0 100 30">
            <path d={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header Greeting */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Good Morning, {profile.name.split(' ')[0]} 👋</h1>
                <p className="text-slate-500 mt-2 text-base font-medium">
                    You have <span className="text-primary font-bold">{unread} unread</span> notifications today.
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex items-center justify-between group">
                    <div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Unread Alerts</span>
                        <div className="text-3xl font-black text-slate-900 mt-2">{unread}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <span className="material-symbols-outlined text-xl">mark_email_unread</span>
                        </div>
                        <SparkLine points="M0,25 Q25,5 50,15 T100,10" color="#4F46E5" />
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex items-center justify-between group">
                    <div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Placements</span>
                        <div className="text-3xl font-black text-slate-900 mt-2">{placements}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <span className="material-symbols-outlined text-xl">work</span>
                        </div>
                        <SparkLine points="M0,20 L25,10 L50,25 L75,5 L100,15" color="#10B981" />
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex items-center justify-between group">
                    <div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Results</span>
                        <div className="text-3xl font-black text-slate-900 mt-2">{results}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <span className="material-symbols-outlined text-xl">analytics</span>
                        </div>
                        <SparkLine points="M0,5 L30,25 L60,10 L100,28" color="#F59E0B" />
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex items-center justify-between group">
                    <div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Events</span>
                        <div className="text-3xl font-black text-slate-900 mt-2">{events}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                            <span className="material-symbols-outlined text-xl">event_upcoming</span>
                        </div>
                        <SparkLine points="M0,20 Q40,5 60,25 T100,8" color="#0EA5E9" />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Priority Inbox Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                            <h2 className="text-xl font-black text-slate-900">Priority Surfaced Items</h2>
                        </div>
                        <a href="#dashboard/priority-inbox" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                            Open Priority Inbox <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>

                    <div className="space-y-4">
                        {sortedPriority.map((item) => {
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
                                    className={`bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.04)] hover:border-primary/40 transition-all duration-300 relative group flex flex-col md:flex-row justify-between gap-6 ${!item.read ? 'border-l-4 border-l-primary' : ''}`}
                                >
                                    <div className="space-y-3 max-w-xl">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${badgeColor}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-semibold">{item.timestamp}</span>
                                            {!item.read && (
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors">
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
                                                <span className="material-symbols-outlined text-sm text-slate-400">visibility</span>
                                                {item.views} views
                                            </span>
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

                                        {/* Action buttons */}
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
                                            <button className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-primary transition-all shadow-sm">
                                                {item.actionLabel}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity Panel */}
                <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-black text-slate-900">Recent Activity</h2>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-6 relative">
                        {/* Timeline Vertical Line */}
                        <div className="absolute top-8 bottom-8 left-10 w-0.5 bg-slate-100"></div>

                        {/* Event 1 */}
                        <div className="flex gap-4 relative z-10">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 border-4 border-white shadow-sm flex items-center justify-center text-emerald-600 flex-shrink-0">
                                <span className="material-symbols-outlined text-sm font-black">check_circle</span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs font-black text-slate-800">Result Published</div>
                                <p className="text-xs text-slate-400 font-medium">Semester VIII Final transcript files</p>
                                <span className="block text-[10px] text-slate-400 font-bold">1 hour ago</span>
                            </div>
                        </div>

                        {/* Event 2 */}
                        <div className="flex gap-4 relative z-10">
                            <div className="w-9 h-9 rounded-full bg-indigo-50 border-4 border-white shadow-sm flex items-center justify-center text-indigo-600 flex-shrink-0">
                                <span className="material-symbols-outlined text-sm font-black">work</span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs font-black text-slate-800">Placement Alert</div>
                                <p className="text-xs text-slate-400 font-medium">Google SDE internship eligibility list generated</p>
                                <span className="block text-[10px] text-slate-400 font-bold">3 hours ago</span>
                            </div>
                        </div>

                        {/* Event 3 */}
                        <div className="flex gap-4 relative z-10">
                            <div className="w-9 h-9 rounded-full bg-sky-50 border-4 border-white shadow-sm flex items-center justify-center text-sky-600 flex-shrink-0">
                                <span className="material-symbols-outlined text-sm font-black">event</span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs font-black text-slate-800">Event Reminder</div>
                                <p className="text-xs text-slate-400 font-medium">Microsoft mentorship webinar starts tomorrow</p>
                                <span className="block text-[10px] text-slate-400 font-bold">Yesterday</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
