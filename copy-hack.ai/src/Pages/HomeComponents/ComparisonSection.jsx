import React from "react";

export default function ComparisonSection() {
    return (
        <section className="py-24 px-4 relative border-t border-white/5 bg-gray-950">
            <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10">

                <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
                    AI copy is recognisable in 3 seconds.
                </h2>
                <p className="text-xl text-zinc-500 mb-16 text-center">
                    "In today's fast-paced digital landscape…" <span className="text-red-500/80">(Gross.)</span>
                </p>

                <div className="grid md:grid-cols-2 gap-6 w-full mb-16">
                    {/* Left Card: Generic AI */}
                    <div className="bg-[#120a0a]/80 backdrop-blur-md border border-red-900/50 rounded-2xl p-8 flex flex-col shadow-xl">
                        <div className="flex justify-end mb-4">
                            <span className="text-[10px] font-bold tracking-widest text-red-500/60 bg-red-500/10 px-2 py-1 rounded">GENERIC AI</span>
                        </div>
                        <p className="text-lg text-zinc-500 italic font-serif leading-relaxed flex-grow">
                            "Unleash the power of our revolutionary new paradigm-shifting platform designed to elevate your synergy and streamline your workflows seamlessly."
                        </p>
                        <div className="flex flex-wrap gap-2 mt-8">
                            <span className="text-xs bg-zinc-900 text-zinc-600 px-3 py-1 rounded-full border border-zinc-800">Corporate</span>
                            <span className="text-xs bg-zinc-900 text-zinc-600 px-3 py-1 rounded-full border border-zinc-800">Bland</span>
                            <span className="text-xs bg-zinc-900 text-zinc-600 px-3 py-1 rounded-full border border-zinc-800">Skipped</span>
                        </div>
                    </div>

                    {/* Right Card: CopyCraft */}
                    <div className="bg-[#18181B]/80 backdrop-blur-md border border-[#BFFF00]/50 rounded-2xl p-8 flex flex-col shadow-[0_0_30px_rgba(191,255,0,0.1)] relative overflow-hidden ring-1 ring-white/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#BFFF00] opacity-10 blur-3xl rounded-full"></div>
                        <div className="flex justify-end mb-4">
                            <span className="text-[10px] font-bold tracking-widest text-[#BFFF00] bg-[#BFFF00]/10 px-2 py-1 rounded">COPYCRAFT</span>
                        </div>
                        <p className="text-lg text-zinc-200 font-medium leading-relaxed flex-grow z-10">
                            "We don't write for everyone. If you're still doing X the old way, this isn't for you — but if you're done with that, here's what we built."
                        </p>
                        <div className="flex flex-wrap gap-2 mt-8 z-10">
                            <span className="text-xs bg-[#BFFF00]/10 text-[#BFFF00] px-3 py-1 rounded-full border border-[#BFFF00]/20">Direct</span>
                            <span className="text-xs bg-[#BFFF00]/10 text-[#BFFF00] px-3 py-1 rounded-full border border-[#BFFF00]/20">On-brand</span>
                            <span className="text-xs bg-[#BFFF00]/10 text-[#BFFF00] px-3 py-1 rounded-full border border-[#BFFF00]/20">Converts</span>
                        </div>
                    </div>
                </div>

                <div className="text-center max-w-2xl">
                    <p className="text-lg text-zinc-400">
                        The difference isn't the AI model. <br className="hidden sm:block" />
                        <span className="text-white font-medium">It's whether the AI knows your voice before it starts writing.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
