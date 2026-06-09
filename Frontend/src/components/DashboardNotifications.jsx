import React, { useState } from 'react';

export default function DashboardNotifications({ notifications, setNotifications }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    // Filters
    const filtered = notifications.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                             n.body.toLowerCase().includes(search.toLowerCase()) || 
                             n.company.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'All' || n.type === category;
        return matchesSearch && matchesCategory;
    });

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    const toggleRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">All Notifications</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Browse, filter, and search all incoming college notices.</p>
                </div>
                <button 
                    onClick={markAllRead} 
                    className="self-start sm:self-center border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                >
                    <span className="material-symbols-outlined text-base">done_all</span>
                    Mark All As Read
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-4">
                {/* Search */}
                <div className="relative w-full md:flex-1">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input 
                        type="text" 
                        placeholder="Search notifications, companies, keywords..." 
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 font-medium text-sm focus:outline-none transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {['All', 'Placement', 'Result', 'Event'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setCategory(cat); setPage(1); }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                category === cat 
                                    ? 'bg-primary text-white border-primary shadow-sm shadow-primary/15' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {paginated.length > 0 ? (
                    paginated.map((item) => {
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
                                className={`bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-slate-300 transition-all relative flex flex-col md:flex-row justify-between gap-6 ${!item.read ? 'border-l-4 border-l-primary' : ''}`}
                            >
                                <div className="space-y-3 max-w-2xl">
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

                                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-bold border-t border-slate-100 pt-3 mt-1">
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
                                        <div className={`text-2xl font-black ${item.score >= 90 ? 'text-primary' : item.score >= 80 ? 'text-amber-500' : 'text-slate-400'}`}>
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
                    })
                ) : (
                    <div className="bg-white py-16 text-center rounded-3xl border border-slate-200/80">
                        <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                        <h3 className="font-bold text-slate-700 mt-2 text-base">No notifications found</h3>
                        <p className="text-slate-400 text-xs mt-1">Try refining your search terms or filters.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                    <span className="text-xs text-slate-400 font-bold">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} entries
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
