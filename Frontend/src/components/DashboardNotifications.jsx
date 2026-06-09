import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

export default function DashboardNotifications() {
    const { 
        loading, error,
        searchQuery: search, setSearchQuery: setSearch, 
        filter: category, setFilter: setCategory, 
        currentPage: page, setCurrentPage: setPage,
        totalPages, paginatedNotifications: paginated, filteredNotifications: filtered,
        toggleReadStatus: toggleRead, markAllAsRead: markAllRead
    } = useNotifications();

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

    return (
        <div className="space-y-8 animate-fadeIn select-none">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Notifications Feed</h1>
                    <p className="text-[#64748B] text-xs font-bold mt-1.5">Search and view academic, placement, and event notices.</p>
                </div>
                <button 
                    onClick={markAllRead} 
                    className="self-start sm:self-center border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-[#0F172A] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#F8FAFC] active:scale-98 transition-all flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                    <span className="material-symbols-outlined text-base">done_all</span>
                    Mark All Read
                </button>
            </div>

            {/* Filter and Search Bar (Notion and Raycast Style: clean flat grid) */}
            <div className="bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative w-full md:flex-1">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-base font-semibold">search</span>
                    <input 
                        type="text" 
                        placeholder="Search alerts, events, CGPA cutoffs..." 
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F46E5] focus:bg-white rounded-xl pl-11 pr-4 py-2 text-xs font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/5 transition-all"
                    />
                </div>

                {/* Filters (Sleek category tabs) */}
                <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto border-t md:border-t-0 border-[#F1F5F9] pt-3 md:pt-0">
                    {['All', 'Placement', 'Result', 'Event'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setCategory(cat); setPage(1); }}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                category === cat 
                                    ? 'bg-[#0F172A] text-white shadow-sm' 
                                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* List Row Output (Linear issue layout inside container) */}
            <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                {paginated.length > 0 ? (
                    paginated.map((item) => {
                        const isPlacement = item.type === 'Placement';
                        const isResult = item.type === 'Result';
                        const badgeColor = isPlacement 
                            ? 'bg-[#4F46E5]/5 text-[#4F46E5] border-[#4F46E5]/10' 
                            : isResult 
                                ? 'bg-amber-500/5 text-amber-600 border-amber-500/10' 
                                : 'bg-sky-500/5 text-sky-655 border-sky-500/10';

                        return (
                            <div 
                                key={item.id} 
                                className="p-5 hover:bg-[#F8FAFC]/60 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative group"
                            >
                                {/* Left contents */}
                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                    <div className="pt-1.5 flex-shrink-0">
                                        <div className={`w-2 h-2 rounded-full ${!item.read ? 'bg-[#4F46E5]' : 'bg-[#E2E8F0]'}`} />
                                    </div>
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-wider ${badgeColor}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-[10px] text-[#94A3B8] font-bold">{item.date}</span>
                                        </div>
                                        <h3 className="text-sm font-black text-[#0F172A] group-hover:text-[#4F46E5] transition-colors truncate">
                                            {item.title}
                                        </h3>
                                        <p className="text-[#64748B] text-xs leading-normal font-medium max-w-xl">
                                            {item.body}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center gap-5 text-[10px] text-[#94A3B8] font-bold border-t border-[#F1F5F9] pt-2 mt-2">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[13px] font-black">group</span>
                                                {item.criteria}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[13px] font-black">visibility</span>
                                                {item.views} reads
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right score & actions */}
                                <div className="flex items-center gap-4 self-stretch sm:self-center justify-between sm:justify-end flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                                    {/* Score Widget */}
                                    <div className="flex items-center gap-1.5 bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 rounded-lg">
                                        <span className={`text-[11px] font-black ${item.score >= 90 ? 'text-[#4F46E5]' : item.score >= 80 ? 'text-amber-500' : 'text-[#64748B]'}`}>
                                            {item.score}
                                        </span>
                                        <span className="text-[8px] font-black text-[#94A3B8] uppercase">Score</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => toggleRead(item.id)}
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
                    })
                ) : (
                    <div className="bg-white py-20 text-center flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-[#94A3B8] animate-pulse">explore_off</span>
                        <h3 className="font-black text-slate-800 mt-3 text-sm">No Notices Found</h3>
                        <p className="text-slate-400 text-xs mt-1 font-medium">Try broadening your search keywords.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-wider">
                        Page {page} of {totalPages} ({filtered.length} items)
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0F172A] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0F172A] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
