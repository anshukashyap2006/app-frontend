import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-white font-sans selection:bg-[#BFFF00] selection:text-black relative z-0">
      {/* Subtle green ambient background glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#BFFF00]/[0.03] via-[#09090b]/80 to-[#09090b] pointer-events-none -z-10"></div>
      
      <Header />
      {/* The current route's component will render inside this main tag */}
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}