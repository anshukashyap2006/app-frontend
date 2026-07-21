import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#BFFF00] py-8 text-center text-black font-bold text-lg border-t border-[#a8e600]">
      <p>© {new Date().getFullYear()} CopyCraft. Built for solo copywriters.</p>
    </footer>
  );
}