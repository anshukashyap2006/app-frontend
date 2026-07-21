import React from "react";
import HeroSection from "./HomeComponents/HeroSection";
import CriticSection from "./HomeComponents/CriticSection";
import ComparisonSection from "./HomeComponents/ComparisonSection";
import FeaturesSection from "./HomeComponents/FeaturesSection";
import FAQSection from "./HomeComponents/FAQSection";
import PricingSection from "./HomeComponents/PricingSection";
import FinalCTASection from "./HomeComponents/FinalCTASection";

export default function Home() {
    return (
        <div className="bg-[#09090b] min-h-screen text-white font-sans selection:bg-[#BFFF00] selection:text-black">
            <HeroSection />
            <CriticSection />
            <ComparisonSection />
            <FeaturesSection />
            <FAQSection />
            <PricingSection />
            <FinalCTASection />
        </div>
    );
}