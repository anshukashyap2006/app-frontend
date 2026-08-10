import React from "react";
import { Link } from "react-router-dom";

export default function FinalCTASection() {
    return (
        <section className="py-20 md:py-32 px-4 relative border-t border-white/5 overflow-hidden">
            {/* Background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] md:w-[800px] h-[200px] md:h-[400px] bg-[#BFFF00] opacity-10 blur-[150px] rounded-[100%] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                    Your next email shouldn't sound like AI wrote it.
                </h2>

                <p className="text-lg md:text-xl text-zinc-400 mb-8 md:mb-12 max-w-2xl mx-auto">
                    Start free. Build your voice profile in 5 minutes. See the difference before you pay anything.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link to="/sign-up" className="w-full sm:w-auto bg-[#BFFF00] text-black px-8 md:px-10 py-4 md:py-5 rounded-lg text-base md:text-lg font-bold hover:bg-[#d4ff4d] transition-all shadow-[0_0_20px_rgba(191,255,0,0.3)] hover:shadow-[0_0_30px_rgba(191,255,0,0.5)]">
                        Start Writing for Free
                    </Link>
                    <a href="#demo" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-lg text-base md:text-lg font-medium text-white hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700">
                        Watch a 60-second Demo
                    </a>
                </div>
            </div>
        </section>
    );
}
