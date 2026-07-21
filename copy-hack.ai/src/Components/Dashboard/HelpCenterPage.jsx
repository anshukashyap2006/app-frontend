import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const faqsData = {
  "faqs": [
    {
      "id": 1,
      "category": "Getting Started",
      "question": "What is WitchPen AI?",
      "answer": "WitchPen AI is an AI-powered copywriting platform that helps you generate high-converting emails, social posts, VSL scripts, and other marketing content while adapting to your brand voice."
    },
    {
      "id": 2,
      "category": "Getting Started",
      "question": "How do I create my first project?",
      "answer": "After signing in, click 'New Project', enter your project details, and save it. You can then generate content within that project."
    },
    {
      "id": 3,
      "category": "Getting Started",
      "question": "How do I create a Brand Voice?",
      "answer": "Navigate to the Brand Voice section and upload writing samples or paste your existing content. The more consistent and representative your samples are, the better the AI can learn your writing style."
    },
    {
      "id": 4,
      "category": "AI Generation",
      "question": "Why doesn't the generated copy sound like my brand?",
      "answer": "Your Brand Voice may need more high-quality examples. Upload 5-10 writing samples that accurately represent your tone, audience, and messaging. Avoid mixing different writing styles."
    },
    {
      "id": 5,
      "category": "AI Generation",
      "question": "Can I edit AI-generated content?",
      "answer": "Yes. All generated content is fully editable. AI should be treated as a starting point, and we recommend reviewing every draft before publishing."
    },
    {
      "id": 6,
      "category": "AI Generation",
      "question": "Can I regenerate content?",
      "answer": "Yes. You can regenerate content as many times as your available credits allow."
    },
    {
      "id": 7,
      "category": "AI Generation",
      "question": "What types of content can I generate?",
      "answer": "Depending on your subscription, you can generate emails, social media posts, sales pages, VSL scripts, product descriptions, ad copy, and other marketing content."
    },
    {
      "id": 8,
      "category": "Credits",
      "question": "How do credits work?",
      "answer": "Each AI generation consumes credits. The number of credits used depends on the content type and generation size."
    },
    {
      "id": 9,
      "category": "Credits",
      "question": "What happens if I run out of credits?",
      "answer": "You won't be able to generate new content until your credits renew or you upgrade your subscription."
    },
    {
      "id": 10,
      "category": "Credits",
      "question": "Do unused credits roll over?",
      "answer": "No. Unused monthly credits expire at the end of your billing cycle unless your subscription explicitly supports rollover."
    },
    {
      "id": 11,
      "category": "Billing",
      "question": "Can I upgrade my subscription?",
      "answer": "Yes. You can upgrade your subscription at any time from the Billing section of your account."
    },
    {
      "id": 12,
      "category": "Billing",
      "question": "Can I downgrade my subscription?",
      "answer": "Yes. Your new plan will take effect according to your billing cycle."
    },
    {
      "id": 13,
      "category": "Billing",
      "question": "Can I cancel my subscription anytime?",
      "answer": "Yes. You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
    },
    {
      "id": 14,
      "category": "Billing",
      "question": "Do you offer refunds?",
      "answer": "Refund requests are evaluated according to our Refund Policy. Please contact support if you believe you're eligible."
    },
    {
      "id": 15,
      "category": "Account",
      "question": "How do I change my email address?",
      "answer": "You can update your email address from your Account Settings if supported by your authentication provider."
    },
    {
      "id": 16,
      "category": "Account",
      "question": "How do I reset my password?",
      "answer": "Click 'Forgot Password' on the login page and follow the instructions sent to your registered email."
    },
    {
      "id": 17,
      "category": "Account",
      "question": "Can I delete my account?",
      "answer": "Yes. You can permanently delete your account from Account Settings. This action cannot be undone."
    },
    {
      "id": 18,
      "category": "Privacy & Security",
      "question": "Who owns the generated content?",
      "answer": "You retain ownership of the content generated using your account, subject to our Terms of Service."
    },
    {
      "id": 19,
      "category": "Privacy & Security",
      "question": "Is my data secure?",
      "answer": "Yes. We use industry-standard security practices to protect your account and data during transmission and storage."
    },
    {
      "id": 20,
      "category": "Privacy & Security",
      "question": "Do you sell my data?",
      "answer": "No. We do not sell your personal information or project data."
    },
    {
      "id": 21,
      "category": "Troubleshooting",
      "question": "Why did my generation fail?",
      "answer": "Generation failures may occur due to temporary server issues, internet connectivity problems, insufficient credits, or unexpected AI service interruptions. Please try again after a few moments."
    },
    {
      "id": 22,
      "category": "Troubleshooting",
      "question": "The AI is taking too long to respond. What should I do?",
      "answer": "Large requests may take longer to process. If the request appears stuck, refresh the page and try again after a few minutes."
    },
    {
      "id": 23,
      "category": "Troubleshooting",
      "question": "Why can't I log in?",
      "answer": "Verify your email address, ensure you're using the correct sign-in method, and try clearing your browser cache if the issue persists."
    },
    {
      "id": 24,
      "category": "Troubleshooting",
      "question": "Why isn't my Brand Voice updating?",
      "answer": "Brand Voice updates may take a short time to process. If changes aren't reflected after several minutes, try saving the profile again."
    },
    {
      "id": 25,
      "category": "Features",
      "question": "Can I request a new feature?",
      "answer": "Absolutely. We welcome feature suggestions and prioritize requests based on user demand and product roadmap."
    },
    {
      "id": 26,
      "category": "Support",
      "question": "How can I report a bug?",
      "answer": "Use the 'Report a Bug' form in the Help Center. Including screenshots and steps to reproduce the issue helps us investigate more quickly."
    },
    {
      "id": 27,
      "category": "Support",
      "question": "How do I contact support?",
      "answer": "You can contact our support team through the Help Center or by emailing our support address. We aim to respond as quickly as possible."
    },
    {
      "id": 28,
      "category": "Support",
      "question": "How long does support usually take to respond?",
      "answer": "Most support requests receive a response within 24-48 business hours, although response times may vary depending on volume."
    },
    {
      "id": 29,
      "category": "AI",
      "question": "Does AI always generate accurate content?",
      "answer": "While we strive for high-quality results, AI-generated content may occasionally contain inaccuracies. Always review and verify important content before publishing."
    },
    {
      "id": 30,
      "category": "Usage",
      "question": "Can I use WitchPen AI for commercial purposes?",
      "answer": "Yes. Content generated through WitchPen AI may be used for commercial purposes, subject to our Terms of Service."
    }
  ]
};

const SIDEBAR_OPTIONS = [
  { id: "getting-started", label: "🚀 Getting Started" },
  { id: "faq", label: "❓ FAQ" },
  { id: "billing", label: "💳 Billing" },
  { id: "troubleshooting", label: "🛠 Troubleshooting" },
  { id: "report-bug", label: "🐞 Report a Bug" },
  { id: "request-feature", label: "💡 Request a Feature" },
  { id: "tutorials", label: "📚 Tutorials" },
  { id: "changelog", label: "📜 Changelog" },
  { id: "legal", label: "📄 Legal" },
  { id: "contact", label: "📧 Contact Support" },
];

export function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const filteredFaqs = useMemo(() => {
    return faqsData.faqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      if (activeCategory === "getting-started") matchesCategory = faq.category === "Getting Started";
      if (activeCategory === "faq") matchesCategory = ["AI Generation", "Credits", "Account", "Privacy & Security", "Features", "Support", "AI", "Usage"].includes(faq.category);
      if (activeCategory === "billing") matchesCategory = faq.category === "Billing";
      if (activeCategory === "troubleshooting") matchesCategory = faq.category === "Troubleshooting";

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Group filtered faqs by category for display
  const groupedFaqs = useMemo(() => {
    return filteredFaqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {});
  }, [filteredFaqs]);

  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-zinc-800/60 pb-6 md:pb-0 md:pr-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Help Center</h1>
          <p className="text-zinc-500 text-sm">How can we help you today?</p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search FAQs..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveCategory("all");
            }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all"
          />
        </div>

        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150 whitespace-nowrap md:whitespace-normal text-left
              ${activeCategory === "all" ? "bg-zinc-800/70 text-white border-l-2 border-[#BFFF00] pl-[10px]" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"}`}
          >
            🔍 All Topics
          </button>
          
          {SIDEBAR_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveCategory(option.id)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150 whitespace-nowrap md:whitespace-normal text-left
                ${activeCategory === option.id ? "bg-zinc-800/70 text-white border-l-2 border-[#BFFF00] pl-[10px]" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"}`}
            >
              {option.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        
        {/* Placeholder screens for non-FAQ sections */}
        {["report-bug", "request-feature", "contact"].includes(activeCategory) && (
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-2xl mb-4">
              {SIDEBAR_OPTIONS.find(o => o.id === activeCategory)?.label.split(' ')[0]}
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{SIDEBAR_OPTIONS.find(o => o.id === activeCategory)?.label.split(' ').slice(1).join(' ')}</h2>
            <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-6">
              This feature will be integrated soon. In the meantime, you can reach out directly to our team via email.
            </p>
            <button className="px-5 py-2.5 rounded-lg bg-zinc-800 text-white text-sm font-medium hover:bg-zinc-700 transition-colors">
              Contact us via Email
            </button>
          </div>
        )}

        {["tutorials", "changelog", "legal"].includes(activeCategory) && (
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-2xl mb-4">
              {SIDEBAR_OPTIONS.find(o => o.id === activeCategory)?.label.split(' ')[0]}
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{SIDEBAR_OPTIONS.find(o => o.id === activeCategory)?.label.split(' ').slice(1).join(' ')}</h2>
            <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-6">
              Content for this section is currently being written and will be published shortly.
            </p>
          </div>
        )}

        {/* FAQ Display */}
        {!["report-bug", "request-feature", "contact", "tutorials", "changelog", "legal"].includes(activeCategory) && (
          <div className="space-y-10">
            {Object.keys(groupedFaqs).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-500 font-mono">No results found for your search.</p>
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="mt-4 text-[#BFFF00] text-sm hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              Object.entries(groupedFaqs).map(([category, faqs]) => (
                <div key={category} className="animate-in fade-in duration-300">
                  <h2 className="text-lg font-semibold text-white mb-4 border-b border-zinc-800/60 pb-2">{category}</h2>
                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <div 
                        key={faq.id} 
                        className={`border rounded-lg transition-colors overflow-hidden ${
                          expandedFaq === faq.id ? 'border-[#BFFF00]/30 bg-[#BFFF00]/5' : 'border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                          className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                        >
                          <span className={`text-sm font-medium ${expandedFaq === faq.id ? 'text-[#BFFF00]' : 'text-zinc-200'}`}>
                            {faq.question}
                          </span>
                          <span className={`text-zinc-500 transition-transform duration-200 ${expandedFaq === faq.id ? 'rotate-180 text-[#BFFF00]' : ''}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </span>
                        </button>
                        
                        {expandedFaq === faq.id && (
                          <div className="p-4 pt-0 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 mt-2 bg-zinc-900/20">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
