import React from "react";

export default function FeaturesSection() {
    return (
        <section className="py-16 md:py-24 px-4 relative border-t border-white/5" id="features">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[300px] md:h-[500px] bg-[#BFFF00]/5 blur-[120px] rounded-[100%] pointer-events-none"></div>
            
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-sm font-bold tracking-widest text-[#BFFF00] mb-4 block">STEP 01</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Two tools. One voice. No editing marathon.
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    {/* Feature 1: Email Generator */}
                    <div className="bg-[#18181B]/80 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8 lg:p-10 hover:border-[#BFFF00]/50 transition-colors">
                        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-3xl mb-8 shadow-inner">
                            ✉️
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Email Generator</h3>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Write cold outreach, welcome sequences, newsletters, and follow-ups — all in your brand voice.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Learns your tone from your own writing samples",
                                "Generates full email sequences, not just one-offs",
                                "Critic scores every email before delivery",
                                "Regenerate with one click based on Critic feedback",
                                "Saves your voice profile for every future email"
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-zinc-300">
                                    <svg className="w-6 h-6 text-[#BFFF00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="leading-snug">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Feature 2: Social Post Generator */}
                    <div className="bg-[#18181B]/80 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8 lg:p-10 hover:border-[#BFFF00]/50 transition-colors">
                        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-3xl mb-8 shadow-inner">
                            📱
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Social Post Generator</h3>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Create posts for LinkedIn, Twitter/X, and Instagram that actually sound like you wrote them.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Platform-aware formatting (hooks for LinkedIn, punchy for X)",
                                "Uses your brand voice profile automatically",
                                "Flags clichés, weak hooks, and off-brand phrases",
                                "Generate multiple variations and pick the best",
                                "Consistent voice across every platform, every time"
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-zinc-300">
                                    <svg className="w-6 h-6 text-[#BFFF00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="leading-snug">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
