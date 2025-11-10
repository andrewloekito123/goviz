// components/Navbar.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex flex-row items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 text-[#032bff] font-bold text-2xl md:text-3xl hover:opacity-90 transition"
          >
            <Image
              src="/goviz.jpg"
              alt="govisualization logo"
              width={48}
              height={48}
              className="block"
            />
            <div className="mb-1">govisualization</div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group text-gray-700 hover:text-[#032bff] transition-colors duration-300"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#032bff] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-gray-700 hover:text-[#032bff] transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/90 backdrop-blur-md shadow-lg border-t border-[#032bff]/20 px-6 py-4 flex flex-col gap-3 text-sm font-medium"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 px-4 rounded-lg hover:bg-[#032bff]/10 hover:text-[#032bff] transition"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
