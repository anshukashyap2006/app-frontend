import React from "react";
import { Link } from "react-router-dom";
import { SignedIn , SignedOut , UserButton } from "@clerk/clerk-react";


export default function Header() {
    return (
        <header className="shadow sticky z-50 top-0">
            <Link to="/" className="text-xl font-bold text-gray-900">
               CopyCraft
            </Link>

            <nav>
                <SignedOut>
                    {/* shows only to logged out users */}
                    <Link to="/sign-in" className="text-grey-600 hover:text-grey-900 font-medium">
                       Log In
                    </Link>

                    <Link 
                        to="/sign-up" 
                        className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Start for free
                    </Link>
                </SignedOut>

                <SignedIn>
                    {/* Shows only to logged in users */}
                    <Link to="/dashboard" className="text-grey-600 hover:text-grey-900 font-medium">
                       Dashboard
                    </Link>
                    <UserButton afterSignOutUrl="/"/>
                </SignedIn>
            </nav>
        </header>
    );
}