import React, { useState } from 'react';
import { initialNotifications, initialProfile } from './mockData';
import DashboardHome from './DashboardHome';
import DashboardNotifications from './DashboardNotifications';
import DashboardPriorityInbox from './DashboardPriorityInbox';
import DashboardAnalytics from './DashboardAnalytics';
import DashboardSettings from './DashboardSettings';

export default function Dashboard({ currentRoute }) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [profile, setProfile] = useState(initialProfile);
    const [searchQuery, setSearchQuery] = useState('');

    const unreadCount = notifications.filter(n => !n.read).length;

    // Sub-route parsing
    const subRoute = currentRoute.replace('#dashboard', '');

    // Sidebar navigation items
    const navItems = [
        { label: 'Dashboard', hash: '#dashboard', icon: 'dashboard', view: '' },
        { label: 'Notifications', hash: '#dashboard/notifications', icon: 'notifications', view: '/notifications' },
        { label: 'Priority Inbox', hash: '#dashboard/priority-inbox', icon: 'crisis_alert', view: '/priority-inbox', badge: unreadCount },
        { label: 'Analytics', hash: '#dashboard/analytics', icon: 'analytics', view: '/analytics' },
        { label: 'Settings', hash: '#dashboard/settings', icon: 'settings', view: '/settings' }
    ];

    // Current date formatted beautifully
    const formattedDate = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const renderActiveView = () => {
        switch (subRoute) {
            case '/notifications':
                return <DashboardNotifications notifications={notifications} setNotifications={setNotifications} />;
            case '/priority-inbox':
                return <DashboardPriorityInbox notifications={notifications} setNotifications={setNotifications} profile={profile} />;
            case '/analytics':
                return <DashboardAnalytics notifications={notifications} />;
            case '/settings':
                return <DashboardSettings profile={profile} setProfile={setProfile} />;
            case '':
            case '/':
            default:
                return <DashboardHome notifications={notifications} setNotifications={setNotifications} profile={profile} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex bg-blueprint-grid">
            {/* Ambient mesh gradient lights */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.04),transparent_60%)] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.02),transparent_70%)] pointer-events-none"></div>

            {/* Sidebar (Arc Browser / Notion Style: Clean, Floating, Light borders) */}
            <aside className="w-64 border-r border-slate-200/80 bg-white/70 backdrop-blur-md hidden md:flex flex-col justify-between p-6 h-screen sticky top-0 z-30">
                <div className="space-y-8">
                    {/* Logo & CampusPulse branding */}
                    <div className="flex items-center gap-3">
                        <a href="#" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/25 group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-base font-black" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    pulse_alert
                                </span>
                            </div>
                            <span className="text-lg font-black tracking-tight text-slate-800">CampusPulse</span>
                        </a>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = subRoute === item.view || (subRoute === '/' && item.view === '') || (subRoute === '' && item.view === '');
                            return (
                                <a
                                    key={item.label}
                                    href={item.hash}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                        isActive
                                            ? 'bg-primary text-white shadow-md shadow-primary/15'
                                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`material-symbols-outlined text-lg ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                    </div>
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${isActive ? 'bg-white text-primary' : 'bg-primary/10 text-primary'}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </a>
                            );
                        })}
                    </nav>
                </div>

                {/* Profile quick-peek at bottom */}
                <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-sm shadow-inner uppercase">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-xs font-black text-slate-800 truncate">{profile.name}</div>
                        <div className="text-[10px] text-slate-400 font-semibold truncate">{profile.rollNumber}</div>
                    </div>
                    <a href="#dashboard/settings" title="Edit Profile" className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                    </a>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Top bar (Glassmorphism & Raycast clean search style) */}
                <header className="h-16 border-b border-slate-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between px-6 sm:px-10 sticky top-0 z-20">
                    {/* Left: Search Bar (Raycast command style) */}
                    <div className="relative w-72 sm:w-96">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                        <input
                            type="text"
                            placeholder="Find placement oa, semesters, result pdfs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={() => window.location.hash = '#dashboard/notifications'}
                            className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-850 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary transition-all"
                        />
                    </div>

                    {/* Right: Date, Notifications Bell & Avatar */}
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] text-slate-400 font-bold hidden sm:inline-block">
                            {formattedDate}
                        </span>

                        {/* Notifications Bell */}
                        <a href="#dashboard/priority-inbox" className="relative w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
                            <span className="material-symbols-outlined text-lg">notifications</span>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center shadow shadow-primary/20">
                                    {unreadCount}
                                </span>
                            )}
                        </a>

                        {/* Mobile Navigation Menu button */}
                        <div className="md:hidden dropdown relative group">
                            <button className="w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
                                <span className="material-symbols-outlined text-lg">menu</span>
                            </button>
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 hidden group-hover:block animate-fadeIn">
                                {navItems.map((item) => (
                                    <a 
                                        key={item.label} 
                                        href={item.hash} 
                                        className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">{item.icon}</span>
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Profile Avatar */}
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xs shadow-inner">
                            {profile.name.split(' ').map(n => n[0]).join('')}
                        </div>
                    </div>
                </header>

                {/* Dashboard Sub-content wrapper */}
                <main className="flex-1 p-6 sm:p-10 max-w-5xl w-full mx-auto pb-24">
                    {renderActiveView()}
                </main>
            </div>
        </div>
    );
}
