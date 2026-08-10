import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
    return (
        <section className="relative flex flex-col items-center justify-center pt-16 pb-20 md:pt-24 md:pb-32 px-4 text-center overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,#1c3d0a_0%,#080d08_60%,#060908_100%)] min-h-[80vh] md:min-h-screen">
            {/* Strong greenish background effect from the bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[200px] md:h-[400px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#BFFF00]/20 via-[#BFFF00]/5 to-transparent blur-[80px] pointer-events-none"></div>

            <div className="z-10 max-w-4xl mx-auto flex flex-col items-center">
                <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#BFFF00] bg-[#BFFF00]/10 backdrop-blur-sm text-xs sm:text-sm font-mono font-bold text-[#BFFF00] mb-6 sm:mb-8 shadow-[0_0_15px_rgba(191,255,0,0.2)]">
                    <span className="w-2 h-2 rounded-full bg-[#BFFF00] animate-pulse shadow-[0_0_8px_#BFFF00]"></span>
                    Stop sounding like a robot wrote it.
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                    AI copy that sounds like you.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BFFF00] to-[#5c9900]">
                        Not like everyone else's
                    </span>
                </h1>

                <p className="text-base md:text-xl text-zinc-400 max-w-2xl mb-8 md:mb-10 leading-relaxed font-medium">
                    Generate emails and social media posts that sound exactly like you, with a built-in Critic that flags weak copy before you ever read it.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link to="/sign-up" className="bg-[#BFFF00] text-black px-8 py-3.5 rounded-md text-base font-bold hover:bg-[#d4ff4d] transition-all shadow-[0_0_15px_rgba(191,255,0,0.2)] hover:shadow-[0_0_25px_rgba(191,255,0,0.4)]">
                        Build your Voice Profile &rarr;
                    </Link>
                    <a href="#pricing" className="px-6 py-3.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        $29/mo. Cancel anytime.
                    </a>
                </div>
            </div>
        </section>
    );
}
