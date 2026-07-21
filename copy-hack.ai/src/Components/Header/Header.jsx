import React from "react";
import { Link } from "react-router-dom";
import { SignedIn , SignedOut , UserButton } from "@clerk/clerk-react";

export default function Header() {
    return (
        <header className="sticky z-50 top-0 backdrop-blur-md bg-[#09090b]/80 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                    <span className="text-[#BFFF00]">&gt;_</span> COPYCRAFT
                </Link>

                <nav className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400 font-medium mr-4">
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>
                    
                    <SignedOut>
                        <Link to="/sign-in" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                           Log In
                        </Link>
                        <Link 
                            to="/sign-up" 
                            className="bg-[#BFFF00] text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#d4ff4d] transition-all shadow-[0_0_15px_rgba(191,255,0,0.2)] hover:shadow-[0_0_25px_rgba(191,255,0,0.4)]"
                        >
                            Start Writing
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link to="/dashboard" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors mr-4">
                           Dashboard
                        </Link>
                        <UserButton afterSignOutUrl="/"/>
                    </SignedIn>
                </nav>
            </div>
        </header>
    );
}