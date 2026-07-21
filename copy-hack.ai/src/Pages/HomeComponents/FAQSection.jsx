import React, { useState } from "react";

const faqs = [
    {
        q: "Can't I just prompt ChatGPT to write in my style?",
        a: "You can — and you'll spend 20 minutes writing the prompt, get output that's 70% there, then edit the rest yourself. There's also a deeper problem: when you load a prompt with heavy style instructions, AI models suffer from what researchers call the \"lost in the middle\" problem — details buried in the middle of a long prompt get systematically ignored. So your most specific voice instructions, the ones that actually make your writing yours, are exactly what the model drops. CopyCraft doesn't use a prompt to fake your voice. It stores your voice as a structured profile and loads it as dedicated context every single generation — so nothing gets lost, nothing gets forgotten, and you're not re-explaining yourself every time you open a new chat."
    },
    {
        q: "What makes the Critic feature different from just regenerating?",
        a: "Regenerating randomly is a coin flip. The Critic tells you why the draft failed — weak hook, off-brand phrase, vague CTA — and rewrites targeting those exact issues. You're not hoping the next version is better. You know why it will be."
    },
    {
        q: "I'm a solo founder, not a copywriter. Will this work for me?",
        a: "That's exactly who it's built for. You don't need to know what makes copy good — the Critic does. Just tell it what you're selling, paste in a few samples of how you write, and it handles the rest."
    },
    {
        q: "What if I don't have writing samples to train the voice on?",
        a: "CopyCraft also builds your voice profile through a short questionnaire — tone, audience, words you hate, phrases you never use. Takes 5 minutes and it works."
    },
    {
        q: "Is the output actually usable or does it still need editing?",
        a: "The Critic's job is to make sure you're not editing. If a draft scores below threshold, it auto-rewrites before you see it. Most users publish within one or two generations."
    },
    {
        q: "How is this different from Jasper or Copy.ai?",
        a: "Those tools generate from scratch every time with no memory of your brand. CopyCraft's voice profile is persistent — every output is already filtered through who you are. Plus neither of them have a Critic that reviews and rewrites the AI's own output."
    }
];

export default function FAQSection() {
    return (
        <section className="py-24 px-4 relative border-t border-white/5 bg-gray-950">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Why CopyCraft and not just ChatGPT?
                    </h2>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-[#18181B]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-[#18181B]/80 transition-colors">
                            <h3 className="text-xl font-bold text-white mb-4 flex gap-4">
                                <span className="text-[#BFFF00]">Q:</span>
                                {faq.q}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed flex gap-4">
                                <span className="text-zinc-600 font-bold">A:</span>
                                <span>{faq.a}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
