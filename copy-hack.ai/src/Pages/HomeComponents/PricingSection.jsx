import React from "react";
import { Link } from "react-router-dom";

export default function PricingSection() {
    return (
        <section className="py-24 px-4 relative border-t border-white/5" id="pricing">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#BFFF00]/5 blur-[120px] rounded-[100%] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Simple pricing. No seat fees.<br />
                        No surprise bills.
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-[#18181B]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-10 flex flex-col shadow-2xl ring-1 ring-white/5">
                        <div className="mb-8">
                            <span className="text-xs font-bold tracking-widest text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full uppercase mb-4 inline-block">Free Plan</span>
                            <div className="text-5xl font-bold text-white mb-2">$0<span className="text-xl text-zinc-500 font-normal">/month</span></div>
                            <p className="text-zinc-400">For trying it out</p>
                        </div>
                        
                        <div className="flex-grow">
                            <ul className="space-y-4 mb-8">
                                {[
                                    "10 generations per month",
                                    "1 voice profile",
                                    "Email generator",
                                    "Social post generator",
                                    "Critic Agent included"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-zinc-300">
                                        <svg className="w-5 h-5 text-zinc-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <Link to="/sign-up" className="w-full text-center bg-zinc-800 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-colors">
                            Start Free
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-[#18181B]/90 backdrop-blur-md border-2 border-[#BFFF00] rounded-3xl p-8 lg:p-10 flex flex-col relative shadow-[0_0_30px_rgba(191,255,0,0.15)]">
                        <div className="absolute top-0 right-10 transform -translate-y-1/2">
                            <span className="bg-[#BFFF00] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                        </div>
                        <div className="mb-8">
                            <span className="text-xs font-bold tracking-widest text-[#BFFF00] bg-[#BFFF00]/10 px-3 py-1 rounded-full uppercase mb-4 inline-block">Pro Plan</span>
                            <div className="text-5xl font-bold text-white mb-2">$29<span className="text-xl text-zinc-500 font-normal">/month</span></div>
                            <p className="text-zinc-400">For founders and creators who publish regularly</p>
                        </div>
                        
                        <div className="flex-grow">
                            <ul className="space-y-4 mb-8">
                                {[
                                    "300 generations",
                                    "Up to 5 voice profiles",
                                    "Email sequences (multi-step)",
                                    "Social posts across all platforms",
                                    "Critic Agent with auto-rewrite",
                                    "Generation history"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-zinc-300">
                                        <svg className="w-5 h-5 text-[#BFFF00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <Link to="/sign-up" className="w-full block text-center bg-[#BFFF00] text-black font-bold py-4 rounded-xl hover:bg-[#d4ff4d] transition-colors shadow-[0_0_15px_rgba(191,255,0,0.3)] mb-3">
                                Get Pro
                            </Link>
                            <p className="text-center text-xs text-zinc-500">Cancel anytime. No contracts.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
