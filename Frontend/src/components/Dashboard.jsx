import React, { useState } from 'react';
import { initialProfile } from './mockData';
import DashboardHome from './DashboardHome';
import DashboardNotifications from './DashboardNotifications';
import DashboardPriorityInbox from './DashboardPriorityInbox';
import DashboardAnalytics from './DashboardAnalytics';
import DashboardSettings from './DashboardSettings';
import { NotificationProvider, useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';

function DashboardLayout({ currentRoute, profile, setProfile }) {
    const { notifications, searchQuery, setSearchQuery, isPolling } = useNotifications();
    const { logout } = useAuth();
    const unreadCount = notifications.filter(n => !n.read).length;
    const subRoute = currentRoute.replace('#dashboard', '');

    const navItems = [
        { label: 'Dashboard', hash: '#dashboard', icon: 'grid_view', view: '' },
        { label: 'Notifications', hash: '#dashboard/notifications', icon: 'notifications', view: '/notifications' },
        { label: 'Priority Inbox', hash: '#dashboard/priority-inbox', icon: 'explore', view: '/priority-inbox', badge: unreadCount },
        { label: 'Analytics', hash: '#dashboard/analytics', icon: 'bubble_chart', view: '/analytics' },
        { label: 'Settings', hash: '#dashboard/settings', icon: 'tune', view: '/settings' }
    ];

    const formattedDate = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    const renderActiveView = () => {
        switch (subRoute) {
            case '/notifications':
                return <DashboardNotifications />;
            case '/priority-inbox':
                return <DashboardPriorityInbox profile={profile} />;
            case '/analytics':
                return <DashboardAnalytics />;
            case '/settings':
                return <DashboardSettings profile={profile} setProfile={setProfile} />;
            case '':
            case '/':
            default:
                return <DashboardHome profile={profile} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] font-sans antialiased flex">
            {/* Subtle premium mesh gradient overlays */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_70%_20%,rgba(79,70,229,0.03),transparent_60%)] pointer-events-none z-0"></div>
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.015),transparent_50%)] pointer-events-none z-0"></div>

            {/* Sidebar (Arc Browser / Stripe Premium style: clean off-white border, minimal active states) */}
            <aside className="w-64 border-r border-[#E2E8F0] bg-white hidden md:flex flex-col justify-between p-5 h-screen sticky top-0 z-30 select-none">
                <div className="space-y-8">
                    {/* Logo & Branding */}
                    <div className="flex items-center gap-3 px-2 pt-2">
                        <a href="#" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 bg-[#4F46E5] rounded-[10px] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(79,70,229,0.2)] group-hover:scale-105 transition-transform duration-300">
                                <span className="material-symbols-outlined text-[15px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    pulse_alert
                                </span>
                            </div>
                            <span className="text-base font-black tracking-tight text-[#0F172A]">CampusPulse</span>
                        </a>
                        <span className="text-[10px] font-black tracking-widest text-[#4F46E5] bg-[#4F46E5]/5 px-2 py-0.5 rounded-md border border-[#4F46E5]/10">SAAS</span>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = subRoute === item.view || (subRoute === '/' && item.view === '') || (subRoute === '' && item.view === '');
                            return (
                                <a
                                    key={item.label}
                                    href={item.hash}
                                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                                        isActive
                                            ? 'text-[#4F46E5] bg-[#4F46E5]/5 border border-[#4F46E5]/10 shadow-[0_2px_8px_rgba(79,70,229,0.02)]'
                                            : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`material-symbols-outlined text-lg transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-[#4F46E5]' : 'text-[#94A3B8]'}`}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                    </div>
                                    
                                    {/* Sidebar badge */}
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                                            isActive 
                                                ? 'bg-[#4F46E5] text-white shadow-sm shadow-[#4F46E5]/10' 
                                                : 'bg-[#64748B]/10 text-[#64748B]'
                                        }`}>
                                            {item.badge}
                                        </span>
                                    )}

                                    {/* Active Left Indicator Strip */}
                                    {isActive && (
                                        <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#4F46E5] rounded-r-full"></div>
                                    )}
                                </a>
                            );
                        })}
                    </nav>
                </div>

                {/* Profile Widget & Logout */}
                <div className="border-t border-[#F1F5F9] pt-4 flex flex-col gap-3 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#4F46E5]/5 border border-[#4F46E5]/10 flex items-center justify-center font-black text-[#4F46E5] text-xs shadow-inner">
                            {profile.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-xs font-black text-[#0F172A] truncate">{profile.name}</div>
                            <div className="text-[9px] text-[#64748B] font-bold truncate">{profile.rollNumber}</div>
                        </div>
                        <a href="#dashboard/settings" title="Edit Profile" className="text-[#94A3B8] hover:text-[#4F46E5] transition-colors">
                            <span className="material-symbols-outlined text-base">settings_accessibility</span>
                        </a>
                    </div>
                    <button 
                        onClick={logout} 
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Section */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                {/* Header Topbar (Clean, Flat, Minimalist layout) */}
                <header className="h-14 border-b border-[#E2E8F0] bg-white/60 backdrop-blur-md flex items-center justify-between px-6 sm:px-10 sticky top-0 z-20">
                    {/* Command bar style search */}
                    <div className="relative w-64 sm:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm font-semibold">search</span>
                        <input
                            type="text"
                            placeholder="Type a command or search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={() => window.location.hash = '#dashboard/notifications'}
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F46E5] focus:bg-white rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/5 transition-all"
                        />
                    </div>

                    {/* Actions and items */}
                    <div className="flex items-center gap-5">
                        {/* Live Polling Indicator */}
                        <div className={`flex items-center gap-2 transition-opacity duration-300 ${isPolling ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
                            <span className="text-[9px] font-black text-primary uppercase tracking-wider hidden sm:block">Syncing Live</span>
                        </div>

                        <span className="text-[10px] text-[#64748B] font-black uppercase tracking-wider hidden sm:inline-block bg-[#F1F5F9] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                            {formattedDate}
                        </span>

                        {/* Bell */}
                        <a href="#dashboard/priority-inbox" className="relative w-8 h-8 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] transition-colors">
                            <span className="material-symbols-outlined text-base">notifications</span>
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#4F46E5] text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-md shadow-[#4F46E5]/25">
                                    {unreadCount}
                                </span>
                            )}
                        </a>

                        {/* Profile Pill */}
                        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-full text-xs font-black text-[#0F172A]">
                            <div className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[9px] font-black">
                                {profile.name[0]}
                            </div>
                            <span className="hidden sm:inline">{profile.name.split(' ')[0]}</span>
                        </div>

                        {/* Mobile Hamburguer */}
                        <div className="md:hidden dropdown relative group">
                            <button className="w-8 h-8 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B]">
                                <span className="material-symbols-outlined text-base">menu</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl py-2 hidden group-hover:block animate-fadeIn">
                                {navItems.map((item) => (
                                    <a 
                                        key={item.label} 
                                        href={item.hash} 
                                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#4F46E5]"
                                    >
                                        <span className="material-symbols-outlined text-base">{item.icon}</span>
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content area */}
                <main className="flex-1 p-6 sm:p-10 max-w-5xl w-full mx-auto pb-24 relative z-10">
                    {renderActiveView()}
                </main>
            </div>
        </div>
    );
}

export default function Dashboard({ currentRoute }) {
    const [profile, setProfile] = useState(initialProfile);

    return (
        <NotificationProvider profile={profile}>
            <DashboardLayout currentRoute={currentRoute} profile={profile} setProfile={setProfile} />
        </NotificationProvider>
    );
}
