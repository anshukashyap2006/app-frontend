import React from "react";
import { Link } from "react-router-dom";


export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
            <h1>
                Sounds like You. <br /> Converts like Pro.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-10">
                The AI-powered copywriting tool that learns your unique voice profile and critiques its own work. Perfect for bootstrapped founders and solo copywriters.
            </p>
            <Link to="/sign-up" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 shadow-lg transition-all">
                Build Your Voice Profile Now!
            </Link>

        </div>
    )
}