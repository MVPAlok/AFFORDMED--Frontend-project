import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const { login } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!fullName || !email || !password) {
            setError('Please enter your full name, email and password.');
            return;
        }

        setIsLoading(true);
        try {
            await login(fullName, email, password);
            window.location.hash = '#dashboard';
        } catch (err) {
            setError(err.message || 'Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 bg-dot-grid relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.1),transparent_50%),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none"></div>
            
            <div className="w-full max-w-md z-10">
                {/* Logo Area */}
                <div className="flex flex-col items-center justify-center mb-10 cursor-pointer" onClick={() => window.location.hash = '#'}>
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            pulse_alert
                        </span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">CampusPulse</h1>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-[#0F172A]">Welcome back</h2>
                        <p className="text-sm text-[#64748B] font-medium mt-1">Sign in to access your priority workspace</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Full Name</label>
                            <input 
                                type="text" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. John Doe"
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-primary focus:bg-white rounded-xl px-4 py-3 text-sm font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Student Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@campus.edu"
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-primary focus:bg-white rounded-xl px-4 py-3 text-sm font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-primary focus:bg-white rounded-xl px-4 py-3 text-sm font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                            />
                        </div>

                        <div className="flex items-center justify-between pb-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded text-primary border-[#E2E8F0] focus:ring-primary focus:ring-offset-0" />
                                <span className="text-xs font-semibold text-[#64748B] group-hover:text-[#0F172A] transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-xs font-bold text-primary hover:text-indigo-700 transition-colors">Forgot password?</a>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-80 scale-[0.98]' : 'hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-95'}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign in to Dashboard'
                            )}
                        </button>
                    </form>
                </div>
                
                <p className="text-center text-xs font-semibold text-[#94A3B8] mt-8">
                    Don't have an account? <a href="#" className="text-primary hover:text-indigo-700 transition-colors">Request access</a>
                </p>
            </div>
        </div>
    );
}
