import React from "react";

export default function CriticSection() {
    return (
        <section className="py-24 px-4 relative border-t border-white/5 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#162d0a_0%,#0a1208_100%)] border border-[#1e3a12] rounded-2xl" id="how-it-works">
            <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">

                {/* Critic Simulation Mockup */}
                <div className="w-full max-w-4xl bg-[#18181B]/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl mb-16 ring-1 ring-white/5">
                    {/* Fake window header */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#09090b]/50 border-b border-white/10">
                        <div className="w-3 h-3 rounded-full bg-[#BFFF00]"></div>
                        <span className="text-xs font-mono text-zinc-400 tracking-wider">CRITIC AGENT</span>
                    </div>
                    {/* Mockup content */}
                    <div className="grid md:grid-cols-2 gap-px bg-zinc-800">
                        {/* Left Side: Draft */}
                        <div className="bg-zinc-900 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xs font-mono text-zinc-500">GENERATED DRAFT</span>
                                <span className="text-xs text-red-400 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    5 issues flagged
                                </span>
                            </div>
                            <div className="font-serif text-lg text-zinc-300 leading-relaxed space-y-4">
                                <p>
                                    In today's <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-1 rounded">fast-paced digital landscape</span>, our <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-1 rounded">revolutionary</span> platform helps you leverage <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-1 rounded">best-in-class</span> AI solutions to <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-1 rounded">supercharge</span> your content creation workflow and drive <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-1 rounded">synergistic growth</span>.
                                </p>
                            </div>

                            <div className="mt-8 p-4 bg-red-950/30 border border-red-900/50 rounded-lg flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-lg border border-red-500/30">
                                    33
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-red-400">OVERALL SCORE</div>
                                    <div className="text-xs text-zinc-400">Below threshold — auto-rewrite triggered</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Scores & Notes */}
                        <div className="bg-zinc-900 p-6 flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-mono text-zinc-500 mb-6 block">CRITIC SCORES</span>
                                <div className="space-y-6">
                                    {/* Score Bar 1 */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-zinc-400">Hook Strength</span>
                                            <span className="text-red-400">34/100</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 w-[34%] rounded-full"></div>
                                        </div>
                                    </div>
                                    {/* Score Bar 2 */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-zinc-400">Specificity</span>
                                            <span className="text-red-400">21/100</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 w-[21%] rounded-full"></div>
                                        </div>
                                    </div>
                                    {/* Score Bar 3 */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-zinc-400">CTA Clarity</span>
                                            <span className="text-orange-400">58/100</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500 w-[58%] rounded-full"></div>
                                        </div>
                                    </div>
                                    {/* Score Bar 4 */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-zinc-400">Voice Match</span>
                                            <span className="text-red-400">17/100</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 w-[17%] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
                                    <span className="text-xs font-mono text-zinc-500 mb-3 block">CRITIC NOTES</span>
                                    <ul className="text-sm text-zinc-300 space-y-2">
                                        <li className="flex gap-2"><span className="text-red-400">›</span> Hook opens with a time-cliché. Cut it.</li>
                                        <li className="flex gap-2"><span className="text-red-400">›</span> "Synergistic" — forbidden phrase from your profile.</li>
                                        <li className="flex gap-2"><span className="text-red-400">›</span> No concrete benefit or number in first sentence.</li>
                                    </ul>
                                </div>
                                <button className="w-full mt-4 bg-[#BFFF00] text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#d4ff4d] transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                    Enhance Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Your AI draft just scored a 33.<br />
                        <span className="text-zinc-500">Here's why that's a good thing.</span>
                    </h2>
                    <p className="text-lg text-zinc-400 mb-6 leading-relaxed">
                        Most AI tools hand you the output and walk away. CopyCraft's Critic Agent reviews every draft before you read it — scoring Hook Strength, Specificity, CTA Clarity, and Voice Match. If it's below threshold, it rewrites automatically. You only see copy worth using.
                    </p>
                    <p className="text-sm text-zinc-500 italic">
                        "Hook opens with a time-cliché. Cut it." — that's your Critic talking, not you editing at midnight.
                    </p>
                </div>
            </div>
        </section>
    );
}
