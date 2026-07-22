import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export default function Logo({ className = 'h-8', textClassName = 'text-xl' }) {
  const { isSignedIn } = useAuth();
  const toPath = isSignedIn ? '/dashboard' : '/';

  return (
    <Link to={toPath} className={`flex items-center gap-3 hover:opacity-90 transition-opacity ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 81.8 18.2 A 45 45 0 1 0 81.8 81.8 L 64.1 64.1 A 20 20 0 1 1 64.1 35.9 Z" fill="#BFFF00" />
        <polygon points="85,15 50,25 30,50 20,80 50,70 75,50" fill="#FFFFFF" />
        <polygon points="85,15 50,50 75,50" fill="#BFFF00" />
        <polygon points="50,50 20,80 50,70" fill="#E5E5E5" />
        <line x1="85" y1="15" x2="20" y2="80" stroke="#09090b" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="4.5" fill="#09090b" />
      </svg>
      <span className={`text-white font-bold tracking-tight flex items-center ${textClassName}`}>
        Copy<span className="text-[#BFFF00]">Craft</span>
      </span>
    </Link>
  );
}
