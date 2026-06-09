import React from 'react';

export default function DashboardSettings({ profile, setProfile }) {
    const handleProfileChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleChannelToggle = (channel) => {
        setProfile(prev => ({
            ...prev,
            channels: {
                ...prev.channels,
                [channel]: !prev.channels[channel]
            }
        }));
    };

    const handleThresholdChange = (e) => {
        const threshold = parseInt(e.target.value, 10);
        setProfile(prev => ({ ...prev, threshold }));
    };

    return (
        <div className="space-y-10 animate-fadeIn select-none">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">System Settings</h1>
                <p className="text-[#64748B] text-xs font-bold mt-1.5">Configure your student profile variables and custom priority thresholds.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Academic Profile */}
                <div className="lg:col-span-2 bg-white p-7 rounded-2xl border border-[#E2E8F0] space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div>
                        <h3 className="font-black text-[#0F172A] text-base tracking-tight">Academic Profile</h3>
                        <p className="text-[#94A3B8] text-[10px] font-bold uppercase mt-1">Details used by the placement scraper engine</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Full Name</label>
                            <input 
                                type="text" 
                                value={profile.name} 
                                onChange={(e) => handleProfileChange('name', e.target.value)}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F46E5] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/5 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Email Address</label>
                            <input 
                                type="email" 
                                value={profile.email} 
                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F46E5] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/5 transition-all"
                            />
                        </div>

                        {/* Roll */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Roll Number</label>
                            <input 
                                type="text" 
                                value={profile.rollNumber} 
                                onChange={(e) => handleProfileChange('rollNumber', e.target.value)}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F46E5] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/5 transition-all"
                            />
                        </div>

                        {/* CGPA */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Verified CGPA</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                max="10" 
                                value={profile.cgpa} 
                                onChange={(e) => handleProfileChange('cgpa', parseFloat(e.target.value) || 0)}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F46E5] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/5 transition-all"
                            />
                        </div>

                        {/* Department */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Academic Department</label>
                            <input 
                                type="text" 
                                value={profile.branch} 
                                onChange={(e) => handleProfileChange('branch', e.target.value)}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F46E5] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/5 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Settings controls */}
                <div className="space-y-6">
                    {/* Rules details */}
                    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        <div>
                            <h3 className="font-black text-[#0F172A] text-sm tracking-tight">Priority Filters</h3>
                            <p className="text-[#94A3B8] text-[10px] font-bold uppercase mt-1">Configure minimum priority score</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold text-[#64748B]">
                                <span>Score Cutoff</span>
                                <span className="text-[#4F46E5] font-black">{profile.threshold}</span>
                            </div>
                            <input 
                                type="range" 
                                min="50" 
                                max="95" 
                                value={profile.threshold} 
                                onChange={handleThresholdChange}
                                className="w-full h-1 bg-[#F1F5F9] rounded-lg appearance-none cursor-pointer accent-[#4F46E5] focus:outline-none"
                            />
                            <div className="text-[9px] text-[#94A3B8] font-bold leading-normal">
                                Alerts below Score <span className="text-[#64748B]">{profile.threshold}</span> will not trigger push alerts or be sorted on home prioritizations.
                            </div>
                        </div>
                    </div>

                    {/* API Integration Settings */}
                    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        <div>
                            <h3 className="font-black text-[#0F172A] text-sm tracking-tight">API Integration</h3>
                            <p className="text-[#94A3B8] text-[10px] font-bold uppercase mt-1">Configure external campus notification API</p>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">API Authorization Token (Bearer)</label>
                                <input 
                                    type="text" 
                                    value={profile.apiToken || ''} 
                                    onChange={(e) => handleProfileChange('apiToken', e.target.value)}
                                    placeholder="Paste Bearer token here..."
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F46E5] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/5 transition-all"
                                />
                            </div>
                            <p className="text-[9px] text-[#94A3B8] font-bold leading-normal">
                                If empty, the dashboard will fall back to local high-fidelity mock data.
                            </p>
                        </div>
                    </div>

                    {/* Channels toggles */}
                    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        <div>
                            <h3 className="font-black text-[#0F172A] text-sm tracking-tight">Notification Channels</h3>
                            <p className="text-[#94A3B8] text-[10px] font-bold uppercase mt-1">Alert dispatch channels</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: 'push', label: 'Push Notifications', sub: 'Immediate browser notices' },
                                { id: 'email', label: 'Email Digest', sub: 'Daily summary of notices' },
                                { id: 'slack', label: 'Slack Webhook', sub: 'Integrates stream to slack' }
                            ].map((c) => (
                                <div key={c.id} className="flex items-center justify-between py-1.5 border-b border-[#F8FAFC] last:border-b-0">
                                    <div className="min-w-0">
                                        <div className="text-xs font-black text-[#0F172A]">{c.label}</div>
                                        <div className="text-[9px] text-[#94A3B8] font-bold mt-0.5">{c.sub}</div>
                                    </div>
                                    <button 
                                        onClick={() => handleChannelToggle(c.id)}
                                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex-shrink-0 ${profile.channels[c.id] ? 'bg-[#4F46E5]' : 'bg-[#E2E8F0]'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${profile.channels[c.id] ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
