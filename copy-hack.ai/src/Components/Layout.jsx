import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* The current route's component will render inside this main tag */}
      <main className="grow bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}