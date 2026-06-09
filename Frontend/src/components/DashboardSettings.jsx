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
        <div className="space-y-10 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Configure your student profile details, channels, and prioritization thresholds.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Settings Card */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <div>
                        <h3 className="font-black text-slate-900 text-lg">Academic Profile</h3>
                        <p className="text-slate-400 text-xs mt-1">These details feed directly into the Placement and Result eligibility filters.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 block">Full Name</label>
                            <input 
                                type="text" 
                                value={profile.name} 
                                onChange={(e) => handleProfileChange('name', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-medium text-sm focus:outline-none transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 block">Email Address</label>
                            <input 
                                type="email" 
                                value={profile.email} 
                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-medium text-sm focus:outline-none transition-all"
                            />
                        </div>

                        {/* Roll Number */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 block">Roll Number</label>
                            <input 
                                type="text" 
                                value={profile.rollNumber} 
                                onChange={(e) => handleProfileChange('rollNumber', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-medium text-sm focus:outline-none transition-all"
                            />
                        </div>

                        {/* CGPA */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 block">Current CGPA</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                max="10" 
                                value={profile.cgpa} 
                                onChange={(e) => handleProfileChange('cgpa', parseFloat(e.target.value) || 0)}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-medium text-sm focus:outline-none transition-all"
                            />
                        </div>

                        {/* Branch */}
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-xs font-bold text-slate-600 block">Academic Department</label>
                            <input 
                                type="text" 
                                value={profile.branch} 
                                onChange={(e) => handleProfileChange('branch', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-medium text-sm focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Rules Card */}
                <div className="space-y-8">
                    {/* Rules */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                        <div>
                            <h3 className="font-black text-slate-900 text-lg">Ranking Rules</h3>
                            <p className="text-slate-400 text-xs mt-1">Tune how notifications are ranked or filtered in your feed.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                                <span>Priority Threshold</span>
                                <span className="text-primary font-black">{profile.threshold}</span>
                            </div>
                            <input 
                                type="range" 
                                min="50" 
                                max="95" 
                                value={profile.threshold} 
                                onChange={handleThresholdChange}
                                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary focus:outline-none"
                            />
                            <div className="text-[10px] text-slate-400 leading-relaxed font-bold">
                                Alerts below Score <span className="text-slate-600">{profile.threshold}</span> will not trigger mobile push alerts or show on your surfaced home feed.
                            </div>
                        </div>
                    </div>

                    {/* Channels */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                        <div>
                            <h3 className="font-black text-slate-900 text-lg">Alert Channels</h3>
                            <p className="text-slate-400 text-xs mt-1">Configure where priority notifications are dispatched.</p>
                        </div>

                        <div className="space-y-4">
                            {/* Push */}
                            <div className="flex items-center justify-between py-2 border-b border-slate-50">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-black text-slate-800">Browser Push Alerts</div>
                                    <div className="text-[10px] text-slate-400 font-semibold">Immediate push notices</div>
                                </div>
                                <button 
                                    onClick={() => handleChannelToggle('push')}
                                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${profile.channels.push ? 'bg-primary' : 'bg-slate-200'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${profile.channels.push ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            {/* Email */}
                            <div className="flex items-center justify-between py-2 border-b border-slate-50">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-black text-slate-800">Email Digest</div>
                                    <div className="text-[10px] text-slate-400 font-semibold">Daily summary of urgents</div>
                                </div>
                                <button 
                                    onClick={() => handleChannelToggle('email')}
                                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${profile.channels.email ? 'bg-primary' : 'bg-slate-200'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${profile.channels.email ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            {/* Slack */}
                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-black text-slate-800">Slack Integration</div>
                                    <div className="text-[10px] text-slate-400 font-semibold">Post alert streams to channel</div>
                                </div>
                                <button 
                                    onClick={() => handleChannelToggle('slack')}
                                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${profile.channels.slack ? 'bg-primary' : 'bg-slate-200'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${profile.channels.slack ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
