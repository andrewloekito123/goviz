// app/contact/page.tsx
"use client";
import React from "react";
import { Mail, Instagram } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0f1a] to-[#1f2233] text-white font-sans px-6 py-20">
      {/* Hero / Intro */}
      <section className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Get in Touch
        </h1>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
          Have a project idea or want to collaborate? Reach out to us via email or social media. 
          We love turning ideas into immersive 3D experiences.
        </p>
      </section>

      {/* Contact Methods */}
      <section className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Email Card */}
        <a
          href="mailto:go.archiviz@gmail.com"
          className="flex flex-col items-center justify-center gap-4 bg-[#1f2233]/70 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:scale-105 transition-transform"
        >
          <Mail size={48} className="text-[#3a488a]" />
          <h2 className="text-2xl font-bold text-white">Email Us</h2>
          <p className="text-gray-300 underline">go.archiviz@gmail.com</p>
        </a>

        {/* Instagram Card */}
        <a
          href="https://www.instagram.com/govisualization/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-4 bg-[#1f2233]/70 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:scale-105 transition-transform"
        >
          <Instagram size={48} className="text-[#3a488a]" />
          <h2 className="text-2xl font-bold text-white">Instagram</h2>
          <p className="text-gray-300 underline">@govisualization</p>
        </a>
      </section>

      {/* Optional Background Accent */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-[#3a488a]/30 to-[#8b9ed0]/0 rounded-full blur-[180px] pointer-events-none -z-10" />
    </main>
  );
}
