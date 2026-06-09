import React, { useEffect, useRef } from 'react';

// Premium Canvas-based interactive background animation for the hero section
function CanvasBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        
        const handleResize = () => {
            if (canvas) {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        
        const particleCount = 45;
        const particles = [];
        const maxDistance = 120;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1
            });
        }
        
        let mouseX = null;
        let mouseY = null;
        
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };
        
        const handleMouseLeave = () => {
            mouseX = null;
            mouseY = null;
        };
        
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        
        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Draw particles
            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                
                // Wrap around boundaries
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(79, 70, 229, 0.35)';
                ctx.fill();
            }
            
            // Draw connections between close particles
            for (let i = 0; i < particleCount; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particleCount; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
                
                // Draw connections to cursor
                if (mouseX !== null && mouseY !== null) {
                    const dx = p1.x - mouseX;
                    const dy = p1.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 160) {
                        const alpha = (1 - dist / 160) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            
            animationFrameId = requestAnimationFrame(draw);
        };
        
        draw();
        
        return () => {
            window.removeEventListener('resize', handleResize);
            if (canvas) {
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mouseleave', handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    
    return <canvas ref={canvasRef} className="w-full h-full block" />;
}

function LandingPage() {
    useEffect(() => {
        // Smooth scroll for navigation links
        const handleAnchorClick = (e) => {
            const href = e.currentTarget.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        };

        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', handleAnchorClick);
        });

        // IntersectionObserver reveal on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-12');
                }
            });
        }, observerOptions);

        const animatedEls = document.querySelectorAll('.bento-card, .group, section > div > div');
        animatedEls.forEach(el => {
            el.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-12');
            revealObserver.observe(el);
        });

        return () => {
            anchors.forEach(anchor => {
                anchor.removeEventListener('click', handleAnchorClick);
            });
            animatedEls.forEach(el => {
                revealObserver.unobserve(el);
            });
        };
    }, []);

    return (
        <>
            {/* Navigation */}
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
                <header className="glass-nav rounded-full max-w-4xl w-full h-16 flex items-center px-8">
                    <nav className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    pulse_alert
                                </span>
                            </div>
                            <span className="text-lg font-bold tracking-tight">CampusPulse</span>
                        </div>
                        <div className="hidden md:flex items-center gap-10">
                            <a className="nav-link text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#features">
                                Features
                            </a>
                            <a className="nav-link text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#how-it-works">
                                Process
                            </a>
                            <a className="nav-link text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#why">
                                Comparison
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => window.location.hash = '#login'}
                                className="hidden sm:block text-sm font-semibold text-on-surface-variant hover:text-primary px-4"
                            >
                                Sign in
                            </button>
                            <button 
                                onClick={() => window.location.hash = '#login'}
                                className="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                            >
                                Get Started
                            </button>
                        </div>
                    </nav>
                </header>
            </div>

            <main>
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 px-6 lg:px-margin-desktop bg-white overflow-hidden bg-dot-grid">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.08),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.06),transparent_55%)] pointer-events-none"></div>
                    
                    {/* Render the high-fidelity interactive Canvas Background */}
                    <div className="shader-bg">
                        <CanvasBackground />
                    </div>

                    <div className="max-w-container-max mx-auto relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2 text-left">
                                <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full text-xs font-bold text-primary mb-8 border border-primary/10">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    Unified Priority Hub
                                </div>
                                <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-8">
                                    Never Miss a <span className="hero-gradient-text">Placement</span> Again.
                                </h1>
                                <p className="text-xl text-on-surface-variant mb-12 leading-relaxed max-w-xl">
                                    CampusPulse automatically ranks campus notifications by importance and urgency, ensuring
                                    students always see the updates that matter most.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-5">
                                    <button 
                                        onClick={() => window.location.hash = '#login'}
                                        className="w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all"
                                    >
                                        Open Dashboard
                                    </button>
                                    <button 
                                        onClick={() => window.location.hash = '#login'}
                                        className="w-full sm:w-auto bg-white border border-outline-variant px-10 py-5 rounded-2xl font-bold text-lg hover:bg-surface-dim hover:border-primary transition-all text-on-background"
                                    >
                                        See Priority Inbox
                                    </button>
                                </div>
                            </div>
                            <div className="lg:w-1/2 relative">
                                {/* Floating Glassmorphic Notification Cards overlapping slightly outside monitor */}
                                <div className="absolute -top-10 -left-6 md:-left-16 floating-tag-gentle z-30 glass-card rounded-2xl p-4 border border-white/50 flex items-center gap-3 shadow-[0_16px_36px_rgba(79,70,229,0.12)]">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Placement Alert</div>
                                        <div className="text-sm font-black">Google SDE Drive</div>
                                    </div>
                                    <div className="ml-2 bg-emerald-500/10 text-emerald-700 text-xs font-black px-2 py-1 rounded-lg border border-emerald-500/20">
                                        Score 98
                                    </div>
                                </div>
                                <div className="absolute top-1/3 -right-6 md:-right-12 floating-tag-opposite z-30 glass-card rounded-2xl p-4 border border-white/50 flex items-center gap-3 shadow-[0_16px_36px_rgba(79,70,229,0.12)]">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-lg">description</span>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Result Published</div>
                                        <div className="text-sm font-black">Semester VIII Finals</div>
                                    </div>
                                    <div className="ml-2 bg-primary/10 text-primary text-xs font-black px-2 py-1 rounded-lg border border-primary/20">
                                        Score 92
                                    </div>
                                </div>
                                <div className="absolute -bottom-8 left-4 md:left-12 floating-tag-gentle z-30 glass-card rounded-2xl p-4 border border-white/50 flex items-center gap-3 shadow-[0_16px_36px_rgba(79,70,229,0.12)]" style={{ animationDelay: '1.5s' }}>
                                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                                        <span className="material-symbols-outlined text-lg">event</span>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Event Reminder</div>
                                        <div className="text-sm font-black">Tech Hackathon 2024</div>
                                    </div>
                                    <div className="ml-2 bg-amber-500/10 text-amber-700 text-xs font-black px-2 py-1 rounded-lg border border-amber-500/20">
                                        Score 81
                                    </div>
                                </div>
                                
                                {/* Dashboard Mockup Wrapper with Ambient Glow */}
                                <div className="relative bg-white rounded-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-outline-variant p-2.5 z-10">
                                    {/* Ambient Glow layer */}
                                    <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.18),transparent_65%)] blur-2xl -z-10 animate-pulse-glow"></div>
                                    <img alt="CampusPulse Dashboard" className="w-full h-auto rounded-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZq0XolWt88T-03Ea6fjY_YG3M5_sjMHSABDZkBOMM2--0H3fSb8VTE7HuvsvA1DFuuFH73lz4gLw_yh6zFixJUvai3rlGho5j-3sZ8us2NG_5dHsjnz64oPm6UkysQGfyPX2CJxA5dOM-H3KGwW2AXH_ma4ricb6ZEgPOFRGQzbPuZREnm-TRdYRYXgKSDR7g7qFIp-gCVvw9G1ct1Aux_f0RT4n28AjOviKg3wjSP_3k6wvInNzPjiM29QR88jVcQVcVxbqaNI2-" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Section Transition Hero to Organize */}
                <div className="relative w-full overflow-hidden leading-[0] select-none pointer-events-none -mt-[60px] z-20">
                    <svg className="relative block w-full h-[60px] text-surface-container-low fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z" />
                    </svg>
                </div>

                {/* Organize Section */}
                <section className="py-32 bg-surface-container-low relative overflow-hidden bg-blueprint-grid">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(79,70,229,0.04),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.03),transparent_50%)] pointer-events-none"></div>
                    <div className="max-w-container-max mx-auto px-6 relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-black mb-6">What CampusPulse Organizes</h2>
                            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">From high-stakes placements to daily events, we bring structure to the chaos of campus life.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Card 1 */}
                            <div className="bg-white p-8 rounded-3xl border border-outline-variant hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">work</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4">Placement Alerts</h3>
                                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Job descriptions, eligibility scores, and interview schedules pined to the top.</p>
                                <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                                    <div className="h-2 w-20 bg-primary/20 rounded-full"></div>
                                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">URGENT</span>
                                </div>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-white p-8 rounded-3xl border border-outline-variant hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-8 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">analytics</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4">Exam Results</h3>
                                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Semantic extraction of marks and rank updates from complex PDFs.</p>
                                <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                                    <div className="h-2 w-24 bg-amber-200 rounded-full"></div>
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">8.8 CGPA</span>
                                </div>
                            </div>
                            {/* Card 3 */}
                            <div className="bg-white p-8 rounded-3xl border border-outline-variant hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">calendar_month</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4">Campus Events</h3>
                                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Workshops, hackathons, and guest lectures synced to your calendar.</p>
                                <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                                    <div className="h-2 w-16 bg-blue-200 rounded-full"></div>
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">TOMORROW</span>
                                </div>
                            </div>
                            {/* Card 4 */}
                            <div className="bg-white p-8 rounded-3xl border border-outline-variant hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">priority</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4">Priority Inbox</h3>
                                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">A curated stream of what actually requires your immediate attention.</p>
                                <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                                    <div className="h-2 w-12 bg-emerald-200 rounded-full"></div>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">READY</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section Transition Organize to Bento Grid */}
                <div className="relative w-full overflow-hidden leading-[0] select-none pointer-events-none -mt-1 z-20">
                    <svg className="relative block w-full h-[60px] text-white fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1200,120 L0,120 L0,0 C300,90 900,90 1200,0 Z" />
                    </svg>
                </div>

                {/* Bento Grid Section */}
                <section className="py-32 bg-white relative overflow-hidden bg-dot-grid" id="features">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(79,70,229,0.06),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(139,92,246,0.05),transparent_50%)] pointer-events-none"></div>
                    <div className="max-w-container-max mx-auto px-6 relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-black mb-6">Precision Engineering</h2>
                            <p className="text-on-surface-variant text-lg">Every feature is designed to reduce noise and amplify signals.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-6 h-auto md:h-[800px]">
                            {/* Bento Item 1: Priority Inbox */}
                            <div className="md:col-span-3 bento-card rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                                        <span className="material-symbols-outlined">inbox</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Priority Inbox</h3>
                                    <p className="text-on-surface-variant text-sm max-w-sm mb-6">Your single source of truth. Cleaned, sorted, and ready for action. No cluttered feeds, just clarity.</p>
                                </div>
                                
                                {/* Rich Visuals: Mini Dashboard Notification List + Sparkline */}
                                <div className="relative z-10 mt-2 bg-surface-container/60 backdrop-blur-sm rounded-2xl p-5 border border-outline-variant/40">
                                    <div className="flex items-center justify-between mb-4 border-b border-outline-variant/30 pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span className="text-xs font-bold text-on-surface-variant">Live Priority Feed</span>
                                        </div>
                                        {/* Micro Sparkline Chart */}
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] text-outline font-semibold mr-1">Inbox Efficiency</span>
                                            <svg className="w-16 h-6" viewBox="0 0 100 30">
                                                <path d="M0,25 Q15,5 30,18 T60,5 T90,15 L100,10" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round"></path>
                                                <path d="M0,25 Q15,5 30,18 T60,5 T90,15 L100,10 L100,30 L0,30 Z" fill="url(#sparkline-grad)" opacity="0.1"></path>
                                                <defs>
                                                    <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#4f46e5" />
                                                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-outline-variant/40 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <span className="material-symbols-outlined text-sm">work</span>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold">Uber SDE Internship Referral</div>
                                                    <div className="text-[9px] text-outline">Closes in 2 hours • #Placements</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Score 98</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-outline-variant/40 shadow-sm opacity-75">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                                                    <span className="material-symbols-outlined text-sm">event</span>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold">ACM Guest Lecture RSVP</div>
                                                    <div className="text-[9px] text-outline">Tomorrow 10 AM • #Events</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">Score 67</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bento Item 2: Smart Ranking */}
                            <div className="md:col-span-3 bento-card rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                                        <span className="material-symbols-outlined">trending_up</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Smart Ranking</h3>
                                    <p className="text-on-surface-variant text-sm max-w-sm mb-6">AI-driven scoring based on university context, department importance, and eligibility metrics.</p>
                                </div>
                                
                                {/* Rich Visuals: Mini eligibility status + priority bar charts */}
                                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 bg-surface-container/60 backdrop-blur-sm rounded-2xl p-5 border border-outline-variant/40">
                                    {/* Left: Circular Gauge Mockup */}
                                    <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-outline-variant/30 shadow-sm">
                                        <div className="relative w-20 h-20 flex items-center justify-center">
                                            {/* SVG Circle Gauge */}
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="40" cy="40" r="32" stroke="#eaedff" strokeWidth="6" fill="transparent" />
                                                <circle cx="40" cy="40" r="32" stroke="#4f46e5" strokeWidth="6" fill="transparent" strokeDasharray="201" strokeDashoffset="12" strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute text-center">
                                                <span className="text-sm font-black text-on-background">96%</span>
                                                <span className="block text-[7px] text-outline uppercase font-semibold">Match</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] text-outline font-bold mt-2">Eligibility Status: Pass</span>
                                    </div>
                                    
                                    {/* Right: Priority Score Distributions */}
                                    <div className="flex flex-col justify-between bg-white p-3 rounded-xl border border-outline-variant/30 shadow-sm">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-[9px] font-bold">
                                                <span>High Priority</span>
                                                <span className="text-primary">82%</span>
                                            </div>
                                            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full rounded-full" style={{ width: '82%' }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mt-2">
                                            <div className="flex items-center justify-between text-[9px] font-bold">
                                                <span>Exams Match</span>
                                                <span className="text-amber-500">95%</span>
                                            </div>
                                            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-amber-500 h-full rounded-full" style={{ width: '95%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bento Item 3: Unread Tracking */}
                            <div className="md:col-span-2 bento-card rounded-3xl p-6 flex flex-col justify-between overflow-hidden relative group">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                                        <span className="material-symbols-outlined">visibility</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Unread Tracking</h3>
                                    <p className="text-on-surface-variant text-xs mb-6">Visual indicators guide your eyes to what you haven't seen, reducing scan time.</p>
                                </div>
                                
                                {/* Rich Visuals: Message items with unread indicators */}
                                <div className="relative z-10 space-y-3 bg-surface-container/60 backdrop-blur-sm rounded-xl p-4 border border-outline-variant/40">
                                    <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-outline-variant/30 shadow-sm relative">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                            <div>
                                                <div className="text-[10px] font-bold">Microsoft SDE Criteria</div>
                                                <div className="text-[8px] text-outline">2 mins ago</div>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-primary bg-primary/5 px-1.5 py-0.5 rounded">Score 94</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-outline-variant/30 shadow-sm opacity-60">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                            <div>
                                                <div className="text-[10px] font-bold">Library Notice</div>
                                                <div className="text-[8px] text-outline">1 day ago</div>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Score 12</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bento Item 4: Category Filters */}
                            <div className="md:col-span-2 bento-card rounded-3xl p-6 flex flex-col justify-between overflow-hidden relative group">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                        <span className="material-symbols-outlined">category</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Category Filters</h3>
                                    <p className="text-on-surface-variant text-xs mb-6">Auto-tagging for Academics, Placements, Exams and Social threads.</p>
                                </div>
                                
                                {/* Rich Visuals: Categories tags with small graphs */}
                                <div className="relative z-10 space-y-2 bg-surface-container/60 backdrop-blur-sm rounded-xl p-4 border border-outline-variant/40">
                                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-outline-variant/30 shadow-sm">
                                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">#Placements</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[8px] text-outline font-bold">12 new</span>
                                            <svg className="w-8 h-3" viewBox="0 0 40 15">
                                                <path d="M0,10 L10,5 L20,12 L30,3 L40,8" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-outline-variant/30 shadow-sm">
                                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">#Exams</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[8px] text-outline font-bold">3 new</span>
                                            <svg className="w-8 h-3" viewBox="0 0 40 15">
                                                <path d="M0,12 L10,12 L20,5 L30,5 L40,2" fill="none" stroke="#059669" strokeWidth="1.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bento Item 5: Mobile Experience */}
                            <div className="md:col-span-2 bento-card rounded-3xl p-6 flex flex-col justify-between overflow-hidden relative group">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                                        <span className="material-symbols-outlined">smartphone</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Mobile Alerts</h3>
                                    <p className="text-on-surface-variant text-xs mb-6">Critical push notifications that cut through lock screen noise on your phone.</p>
                                </div>
                                
                                {/* Rich Visuals: Phone Notification Card */}
                                <div className="relative z-10 mt-1 bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl overflow-hidden">
                                    <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
                                    
                                    {/* Phone Top Bar */}
                                    <div className="flex items-center justify-between text-[7px] text-slate-500 font-bold mb-2 border-b border-slate-800 pb-1.5">
                                        <span>CampusPulse Live</span>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[8px]">wifi</span>
                                            <span className="material-symbols-outlined text-[8px]">battery_very_low</span>
                                        </div>
                                    </div>
                                    
                                    {/* Glass Notification Card inside phone screen */}
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4 h-4 rounded-md bg-primary flex items-center justify-center text-white">
                                                    <span className="material-symbols-outlined text-[8px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                        pulse_alert
                                                    </span>
                                                </div>
                                                <span className="text-[8px] font-bold text-white uppercase tracking-wider">Priority Alert</span>
                                            </div>
                                            <span className="text-[7px] text-slate-400">Now</span>
                                        </div>
                                        <div className="text-[9px] font-black text-white leading-tight">Google Portal Closes soon!</div>
                                        <div className="text-[8px] text-slate-300 leading-normal">Your profile matches SDE Intern criteria. Eligibility: 98.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Section Transition Bento to Storytelling */}
                <div className="relative w-full overflow-hidden leading-[0] select-none pointer-events-none -mt-1 z-20">
                    <svg className="relative block w-full h-[60px] text-[#131b2e] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z" />
                    </svg>
                </div>

                {/* Storytelling Section */}
                <section className="py-32 bg-on-background text-white overflow-hidden relative" id="why">
                    {/* Background lights */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="max-w-container-max mx-auto px-6 relative z-10">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Why CampusPulse Exists</h2>
                            <p className="text-white/60 text-xl max-w-2xl mx-auto">The difference between a career-defining opportunity and a missed deadline is clarity.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
                            {/* Without (The Chaos) */}
                            <div className="relative p-12 rounded-[40px] border border-red-500/20 bg-red-950/10 flex flex-col justify-between overflow-hidden group shadow-[0_0_50px_rgba(239,68,68,0.05)]">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 blur-[80px]"></div>
                                <div className="absolute inset-0 bg-blueprint-grid opacity-5 pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="inline-block px-4 py-1.5 bg-red-500/20 text-red-400 rounded-full text-xs font-bold mb-8 tracking-widest uppercase border border-red-500/30">
                                        The Chaos
                                    </div>
                                    <h3 className="text-3xl font-bold mb-8">Before CampusPulse</h3>
                                    <div className="space-y-4 mb-12 relative">
                                        {/* Messy Notifications Mix */}
                                        <div className="p-5 bg-white/5 rounded-2xl border border-red-500/10 flex items-center justify-between opacity-80">
                                            <div className="flex items-center gap-4">
                                                <span className="material-symbols-outlined text-red-400">mail</span>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-300">Dean's speech video link</div>
                                                    <div className="text-[10px] text-slate-500">Inbox • 1 min ago</div>
                                                </div>
                                            </div>
                                            <span className="text-slate-500 text-[10px] font-bold">Unsorted</span>
                                        </div>
                                        
                                        <div className="p-5 bg-red-500/10 rounded-2xl border border-red-500/30 flex items-center justify-between relative scale-95 origin-left">
                                            <div className="absolute -right-2 -top-2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase animate-pulse">Missed</div>
                                            <div className="flex items-center gap-4">
                                                <span className="material-symbols-outlined text-red-500">warning</span>
                                                <div>
                                                    <div className="font-bold text-sm text-red-200">URGENT: Microsoft SDE Application</div>
                                                    <div className="text-[10px] text-red-400">Closed 1 hour ago</div>
                                                </div>
                                            </div>
                                            <span className="text-red-400 text-[10px] font-bold">Buried</span>
                                        </div>

                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between opacity-40 -translate-x-3">
                                            <div className="flex items-center gap-4">
                                                <span className="material-symbols-outlined text-slate-400">info</span>
                                                <div>
                                                    <div className="font-bold text-sm">Cafeteria Menu: Biryani Friday</div>
                                                    <div className="text-[10px] text-slate-500">General • 4 hours ago</div>
                                                </div>
                                            </div>
                                            <span className="text-slate-500 text-[10px] font-bold">Unsorted</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-white/60 text-lg leading-relaxed italic border-t border-white/10 pt-6 mt-6">"I missed the Microsoft referral deadline because it was buried under 50 department memos. I felt helpless."</p>
                            </div>
                            
                            {/* With (The Clarity) */}
                            <div className="relative p-12 rounded-[40px] border border-primary/30 bg-primary/10 flex flex-col justify-between overflow-hidden group shadow-[0_0_100px_rgba(79,70,229,0.2)]">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 blur-[80px]"></div>
                                <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="inline-block px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold mb-8 tracking-widest uppercase border border-primary/40">
                                        The Clarity
                                    </div>
                                    <h3 className="text-3xl font-bold mb-8">With CampusPulse</h3>
                                    <div className="space-y-4 mb-12">
                                        {/* Clean prioritised inbox cards */}
                                        <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-between shadow-2xl scale-105 transition-transform duration-300 hover:scale-110">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                                    <span className="material-symbols-outlined text-lg">bolt</span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">Microsoft Referral Drive</div>
                                                    <div className="text-[10px] text-primary-container font-semibold">Closes in 4 hours • #Placements</div>
                                                </div>
                                            </div>
                                            <span className="bg-white text-primary px-3 py-1 rounded-lg text-xs font-black shadow-md">98 SCORE</span>
                                        </div>

                                        <div className="p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-between opacity-80">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                                                    <span className="material-symbols-outlined text-lg">event</span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-200">End-Sem Lab Venue Change</div>
                                                    <div className="text-[10px] text-slate-400">Today • #Academics</div>
                                                </div>
                                            </div>
                                            <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-lg text-xs font-bold border border-amber-500/30">84 SCORE</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-white/80 text-lg leading-relaxed italic border-t border-white/10 pt-6 mt-6">"Now I wake up and know exactly what requires my attention. No stress, just execution."</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Section Transition Storytelling to Workflow */}
                <div className="relative w-full overflow-hidden leading-[0] select-none pointer-events-none -mt-1 z-20">
                    <svg className="relative block w-full h-[60px] text-surface fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1200,120 L0,120 L0,0 C300,90 900,90 1200,0 Z" />
                    </svg>
                </div>

                {/* Interactive Workflow */}
                <section className="py-32 bg-surface relative overflow-hidden bg-dot-grid" id="how-it-works">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_60%)] pointer-events-none"></div>
                    <div className="max-w-container-max mx-auto px-6 relative z-10">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl font-black mb-6">How Priority Ranking Works</h2>
                            <p className="text-on-surface-variant text-lg">Our engine processes data at the speed of thought, converting noise into rank-ordered tasks.</p>
                        </div>
                        
                        <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 max-w-5xl mx-auto px-4">
                            {/* SVG Curved Connection lines with Animated Data flow */}
                            <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
                                <svg className="w-full h-full" viewBox="0 0 896 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Curved Background lines */}
                                    <path d="M 128,110 C 260,30 280,190 412,110" stroke="rgba(79,70,229,0.15)" strokeWidth="4" strokeDasharray="6 6" fill="none" />
                                    <path d="M 484,110 C 610,30 630,190 762,110" stroke="rgba(16,185,129,0.15)" strokeWidth="4" strokeDasharray="6 6" fill="none" />
                                    
                                    {/* Animated flowing gradient paths */}
                                    <path d="M 128,110 C 260,30 280,190 412,110" stroke="url(#flow-grad-left)" strokeWidth="4" strokeLinecap="round" fill="none" />
                                    <path d="M 484,110 C 610,30 630,190 762,110" stroke="url(#flow-grad-right)" strokeWidth="4" strokeLinecap="round" fill="none" />
                                    
                                    {/* Flowing Score particles (Priority 98 & 84) */}
                                    <g>
                                        <circle r="16" fill="#4f46e5" opacity="0.15">
                                            <animateMotion dur="3.5s" repeatCount="indefinite" path="M 128,110 C 260,30 280,190 412,110" />
                                        </circle>
                                        <circle r="5" fill="#4f46e5">
                                            <animateMotion dur="3.5s" repeatCount="indefinite" path="M 128,110 C 260,30 280,190 412,110" />
                                        </circle>
                                    </g>
                                    <g>
                                        <circle r="16" fill="#10b981" opacity="0.15">
                                            <animateMotion dur="3.5s" begin="1.75s" repeatCount="indefinite" path="M 484,110 C 610,30 630,190 762,110" />
                                        </circle>
                                        <circle r="5" fill="#10b981">
                                            <animateMotion dur="3.5s" begin="1.75s" repeatCount="indefinite" path="M 484,110 C 610,30 630,190 762,110" />
                                        </circle>
                                    </g>
                                    
                                    <defs>
                                        <linearGradient id="flow-grad-left" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0" />
                                            <stop offset="50%" stopColor="#4f46e5" />
                                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                                        </linearGradient>
                                        <linearGradient id="flow-grad-right" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0" />
                                            <stop offset="50%" stopColor="#10b981" />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            {/* Step 1 */}
                            <div className="z-10 bg-white p-7 rounded-3xl border border-outline-variant/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] text-center w-64 hover:border-primary transition-colors group">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">inbox_customize</span>
                                </div>
                                <h4 className="font-bold mb-2">Notification Scraper</h4>
                                <p className="text-xs text-on-surface-variant leading-relaxed">Ingests department emails, portals, and PDFs via secure API connections.</p>
                            </div>

                            {/* Step 2 */}
                            <div className="z-10 bg-primary p-8 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.25)] text-center text-white w-72 scale-105 border border-primary-container relative">
                                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">Active</div>
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/10 animate-ping rounded-2xl"></div>
                                    <span className="material-symbols-outlined text-2xl">memory</span>
                                </div>
                                <h4 className="font-bold mb-2 text-lg">Intelligent Ranking Engine</h4>
                                <p className="text-xs text-white/80 leading-relaxed">Performs semantic analysis, keyword matching, and checks student eligibility rules.</p>
                            </div>

                            {/* Step 3 */}
                            <div className="z-10 bg-white p-7 rounded-3xl border border-outline-variant/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] text-center w-64 hover:border-primary transition-colors group">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">notifications_active</span>
                                </div>
                                <h4 className="font-bold mb-2">Smart Actionable Alert</h4>
                                <p className="text-xs text-on-surface-variant leading-relaxed">Delivers pinned alerts containing a high-contrast eligibility score (e.g. 98).</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Showcase Section */}
                <section className="py-32 bg-white overflow-hidden border-y border-outline-variant relative bg-dot-grid">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.04),transparent_50%)] pointer-events-none"></div>
                    <div className="max-w-container-max mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-20">
                            <div className="lg:w-1/3">
                                <h2 className="text-4xl font-black mb-8 leading-tight">See Priority Ranking <br /><span className="text-primary">In Action.</span></h2>
                                <p className="text-on-surface-variant leading-relaxed">Watch how the engine distinguishes between general chatter and career-critical updates in real-time.</p>
                                <div className="mt-10 flex items-center gap-4 text-sm font-bold text-primary">
                                    <span>Dynamic Scoring</span>
                                    <div className="h-[1px] flex-1 bg-primary/20"></div>
                                </div>
                            </div>
                            <div className="lg:w-2/3 flex flex-col gap-4">
                                <div className="flex items-center justify-between p-6 bg-surface-container rounded-3xl border border-outline-variant hover:border-primary transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-primary">rocket_launch</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Amazon Interview Invitation</h4>
                                            <p className="text-xs text-on-surface-variant">Round 1 scheduling portal open</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-primary">98</div>
                                        <div className="text-[10px] font-bold text-on-surface-variant uppercase">CRITICAL</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-6 bg-surface-container rounded-3xl border border-outline-variant opacity-70">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-amber-500">warning</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">End Sem Lab Schedule</h4>
                                            <p className="text-xs text-on-surface-variant">Venue changes for CS304</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-amber-500">81</div>
                                        <div className="text-[10px] font-bold text-on-surface-variant uppercase">IMPORTANT</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-6 bg-surface-container rounded-3xl border border-outline-variant opacity-40">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-slate-400">coffee</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Alumni Coffee Chat</h4>
                                            <p className="text-xs text-on-surface-variant">Informal session in the cafeteria</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-slate-400">34</div>
                                        <div className="text-[10px] font-bold text-on-surface-variant uppercase">OPTIONAL</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Transition Showcase to Benefits */}
                <div className="relative w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-10 bg-primary/15 blur-2xl rounded-full pointer-events-none"></div>
                </div>

                {/* Visual Benefit Cards */}
                <section className="py-32 bg-surface-container-low relative overflow-hidden bg-blueprint-grid">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.03),transparent_50%)] pointer-events-none"></div>
                    <div className="max-w-container-max mx-auto px-6 relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-black mb-6">Why Students Trust Us</h2>
                            <p className="text-on-surface-variant text-lg">Designed for the modern, high-achieving student profile.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-1 rounded-3xl border border-outline-variant shadow-sm hover:shadow-xl transition-all overflow-hidden">
                                <div className="h-48 bg-slate-100 p-6 flex items-center justify-center relative overflow-hidden">
                                    <div className="bg-white p-4 rounded-xl shadow-lg border border-outline-variant w-full max-w-[200px]">
                                        <div className="h-2 w-1/2 bg-primary/10 rounded mb-2"></div>
                                        <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <span className="material-symbols-outlined text-8xl">verified_user</span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h4 className="text-xl font-bold mb-4">Zero Data Leakage</h4>
                                    <p className="text-sm text-on-surface-variant">Your campus credentials are encrypted locally. We only process content, never store identities.</p>
                                </div>
                            </div>
                            <div className="bg-white p-1 rounded-3xl border border-outline-variant shadow-sm hover:shadow-xl transition-all overflow-hidden">
                                <div className="h-48 bg-indigo-50 p-6 flex items-center justify-center relative overflow-hidden">
                                    <div className="flex gap-2">
                                        <div className="w-12 h-12 rounded-lg bg-primary/20"></div>
                                        <div className="w-12 h-12 rounded-lg bg-primary shadow-lg flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined">notifications</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-lg bg-primary/20"></div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h4 className="text-xl font-bold mb-4">Focus-First Design</h4>
                                    <p className="text-sm text-on-surface-variant">Interface optimized for quick scanning and task completion. No infinite feeds, just efficiency.</p>
                                </div>
                            </div>
                            <div className="bg-white p-1 rounded-3xl border border-outline-variant shadow-sm hover:shadow-xl transition-all overflow-hidden">
                                <div className="h-48 bg-emerald-50 p-6 flex items-center justify-center relative overflow-hidden">
                                    <div className="flex items-center gap-3 bg-white p-4 rounded-full shadow-lg border border-emerald-100">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <div className="h-2 w-24 bg-emerald-50 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h4 className="text-xl font-bold mb-4">99% Accuracy</h4>
                                    <p className="text-sm text-on-surface-variant">Our models are trained specifically on university communication patterns and acronyms.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Transition Benefits to Preview */}
                <div className="relative w-full overflow-hidden leading-[0] select-none pointer-events-none -mt-1 z-20">
                    <svg className="relative block w-full h-[60px] text-white fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z" />
                    </svg>
                </div>

                {/* Live Product Preview */}
                <section className="py-32 bg-white relative overflow-hidden bg-dot-grid">
                    <div className="max-w-container-max mx-auto px-6 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black mb-12">One Dashboard to Rule Them All.</h2>
                        <div className="relative max-w-6xl mx-auto">
                            {/* Glow behind monitor */}
                            <div className="absolute -inset-16 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15),transparent_70%)] blur-[100px] rounded-full -z-10 animate-pulse-glow"></div>
                            
                            {/* Floating high-fidelity analytics cards */}
                            <div className="absolute -top-8 -left-6 md:-left-16 z-20 floating-tag-gentle glass-card p-4 rounded-2xl flex flex-col gap-1.5 border border-white/50 shadow-[0_20px_50px_rgba(79,70,229,0.12)] text-left">
                                <span className="text-[9px] text-primary font-black uppercase tracking-wider">Placement Analytics</span>
                                <div className="text-xl font-black text-on-background">98% Fit</div>
                                <span className="text-[10px] text-on-surface-variant font-bold">12 qualified listings</span>
                                {/* Sparkline widget */}
                                <svg className="w-24 h-6 mt-1" viewBox="0 0 100 30">
                                    <path d="M0,20 L20,10 L40,25 L60,5 L80,18 L100,2" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round"></path>
                                </svg>
                            </div>

                            {/* Floating unread status indicators and scores */}
                            <div className="absolute top-1/2 -right-6 md:-right-20 z-20 floating-tag-opposite glass-card p-4 rounded-2xl flex items-center gap-3 border border-white/50 shadow-[0_20px_50px_rgba(79,70,229,0.12)] text-left" style={{ animationDelay: '1.5s' }}>
                                <div className="relative">
                                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center animate-bounce">3</span>
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-xl">notifications</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-outline uppercase tracking-wider">Unread Urgents</div>
                                    <div className="text-xs font-black text-on-background">Scores: 98, 92, 84</div>
                                </div>
                            </div>

                            {/* Floating sync badge */}
                            <div className="absolute -bottom-6 left-1/3 z-20 floating-tag-gentle glass-card py-2 px-4 rounded-full flex items-center gap-2 border border-white/50 shadow-xl" style={{ animationDelay: '0.8s' }}>
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                                <span className="text-xs font-bold text-emerald-700">Priority Sync: Active</span>
                            </div>

                            <div className="relative bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-outline-variant p-4">
                                <div className="bg-surface-container rounded-[32px] overflow-hidden">
                                    <img alt="Full Dashboard View" className="w-full h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZq0XolWt88T-03Ea6fjY_YG3M5_sjMHSABDZkBOMM2--0H3fSb8VTE7HuvsvA1DFuuFH73lz4gLw_yh6zFixJUvai3rlGho5j-3sZ8us2NG_5dHsjnz64oPm6UkysQGfyPX2CJxA5dOM-H3KGwW2AXH_ma4ricb6ZEgPOFRGQzbPuZREnm-TRdYRYXgKSDR7g7qFIp-gCVvw9G1ct1Aux_f0RT4n28AjOviKg3wjSP_3k6wvInNzPjiM29QR88jVcQVcVxbqaNI2-" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Final CTA */}
                <section className="py-32 px-6 relative overflow-hidden bg-dot-grid">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.05),transparent_50%)] pointer-events-none"></div>
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="bg-gradient-to-br from-primary via-[#3323cc] to-[#1e1199] rounded-[48px] py-20 px-8 md:px-20 text-center text-white relative overflow-hidden shadow-3xl shadow-primary/40 border border-primary/20">
                            
                            {/* Intense Launch Spotlight Gradient lighting */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.4),transparent_65%),radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.35),transparent_65%)] pointer-events-none opacity-90 blur-2xl -z-10"></div>
                            
                            {/* Subtle Particle Effects */}
                            <div className="absolute inset-0 pointer-events-none z-0 opacity-50">
                                <span className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse-glow"></span>
                                <span className="absolute top-3/4 left-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse-glow" style={{ animationDelay: '1.2s' }}></span>
                                <span className="absolute top-1/3 right-1/4 w-1 h-1 bg-amber-400 rounded-full animate-pulse-glow" style={{ animationDelay: '2.5s' }}></span>
                                <span className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse-glow" style={{ animationDelay: '0.8s' }}></span>
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">Stay Ahead Of Every <br />Campus Update.</h2>
                                <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">Join 50,000+ students across premium campuses who never miss an opportunity.</p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <button 
                                        onClick={() => window.location.hash = '#dashboard'}
                                        className="w-full sm:w-auto bg-white text-primary px-12 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-black/10"
                                    >
                                        Open Dashboard
                                    </button>
                                    <button className="w-full sm:w-auto bg-white/10 border border-white/20 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                                        Request Demo
                                    </button>
                                </div>
                            </div>

                            {/* Floating Glassmorphic Priority Badges (Launch Trails) */}
                            <div className="absolute top-8 left-10 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl -rotate-12 opacity-90 hidden md:flex items-center gap-2 shadow-2xl floating-tag-gentle">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                                    <span className="material-symbols-outlined text-xs">check_circle</span>
                                </div>
                                <div className="text-left">
                                    <div className="text-[8px] text-white/50 uppercase font-black tracking-wider">Placement</div>
                                    <div className="text-xs font-black text-white">Score 98</div>
                                </div>
                            </div>
                            <div className="absolute bottom-8 right-10 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl rotate-12 opacity-90 hidden md:flex items-center gap-2 shadow-2xl floating-tag-opposite">
                                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300">
                                    <span className="material-symbols-outlined text-xs">event</span>
                                </div>
                                <div className="text-left">
                                    <div className="text-[8px] text-white/50 uppercase font-black tracking-wider">Event</div>
                                    <div className="text-xs font-black text-white">Score 81</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t border-outline-variant py-24">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-margin-desktop">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        pulse_alert
                                    </span>
                                </div>
                                <span className="text-2xl font-bold tracking-tight">CampusPulse</span>
                            </div>
                            <p className="text-on-surface-variant text-lg max-w-sm mb-10 leading-relaxed">
                                Empowering students through intelligent notification management and priority surfacing. Built for the future of education.
                            </p>
                            <div className="flex gap-4">
                                <a className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" href="#">
                                    <span className="material-symbols-outlined text-sm">alternate_email</span>
                                </a>
                                <a className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" href="#">
                                    <span className="material-symbols-outlined text-sm">share</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h5 className="font-bold text-lg mb-6">Product</h5>
                            <ul className="space-y-4 text-on-surface-variant font-medium">
                                <li><a className="hover:text-primary transition-colors" href="#">Priority Inbox</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Placement Engine</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Mobile Experience</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">API Access</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-lg mb-6">Company</h5>
                            <ul className="space-y-4 text-on-surface-variant font-medium">
                                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-outline-variant flex flex-col md:row justify-between items-center gap-6">
                        <p className="text-sm text-on-surface-variant font-medium">© 2024 CampusPulse. All rights reserved.</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-primary">
                            Built for High Achievers <span className="material-symbols-outlined text-base">favorite</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default LandingPage;
