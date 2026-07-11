import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { useState,useEffect } from "react";
import apiClient from "../../Api/api"

export default function Dashboard() {
    const { isLoaded, isSignedIn } = useAuth();
    const [dbUser,setDbUser] = useState(null)
    const [loading , setLoading] = useState(true)
    const [error , setError] = useState(null)

    useEffect(()=>{
        const fetchUserData = async() => {
            if (!isSignedIn) return;

            try {
                setLoading(true);
                const reposne = await apiClient.get("/auth/me");
                setDbUser(response.data);
                setError(null)
            } catch (error) {
                console.error(error)
                setError("Failed to load your profile. Please try refreshing.")
            } finally {
                setLoading(false)
            }
        };
        if (isLoaded) {
            fetchUserData();
        }
    },[isLoaded,isSignedIn])

    if (!isLoaded || loading) {
        return (
        <div className="p-10 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-40 bg-gray-100 rounded-xl w-full"></div>
        </div>
        );
    }
    if (error) {
        return <div className="p-10 text-red-600 font-medium">{error}</div>;
    }

    return (
        <div className="p-10 max-w-6xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {dbUser?.full_name || 'Copywriter'}
                </h1>
                <p className="text-gray-500 mt-2">Here is your current workspace status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Subscription Stats Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-4">AI Generations</h3>
                <div className="text-4xl font-black text-blue-600">
                    {dbUser?.subscription?.generations_used || 0}
                    <span className="text-lg text-gray-400 font-normal"> / {dbUser?.subscription?.generations_limit || 20}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Credits used this billing cycle</p>
                </div>

                {/* Placeholder for Voice Profiles count */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-4">Active Voice Profiles</h3>
                <div className="text-4xl font-black text-gray-900">0</div>
                <button className="text-sm text-blue-600 mt-2 hover:underline">Manage Profiles &rarr;</button>
                </div>

                {/* Placeholder for Brand Briefs */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-4">Brand Briefs</h3>
                <div className="text-4xl font-black text-gray-900">0</div>
                <button className="text-sm text-blue-600 mt-2 hover:underline">Manage Briefs &rarr;</button>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-lg font-bold mb-4">Recent Projects</h2>
                <p className="text-gray-500 text-sm">You haven't created any projects yet. Start by generating a new copy asset.</p>
                <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                + New Project
                </button>
            </div>
        </div>
    )
}