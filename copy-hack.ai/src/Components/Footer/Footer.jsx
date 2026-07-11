import React from "react";


export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 text-center text-gray-500">
      <p>© {new Date().getFullYear()} CopyCraft. Built for solo copywriters.</p>
    </footer>
  );
}