// app/about/page.tsx
"use client";
import React from "react";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="bg-gray-50 font-sans text-gray-900">
      {/* Hero */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0b0f1a] to-[#1f2233] text-white">
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Envisioning Spaces, Crafting Experiences
          </h1>
          <p className="text-lg md:text-xl text-gray-300/80 mb-8">
            We are a premium Architectural Visualization Studio, transforming
            ideas into immersive, photorealistic 3D experiences.
          </p>
        </div>
        {/* Abstract floating shapes */}
        <div className="absolute top-0 left-1/2 w-[900px] h-[900px] -translate-x-1/2 bg-gradient-to-tr from-[#3a488a]/30 to-[#8b9ed0]/0 rounded-full blur-[180px] pointer-events-none" />
      </section>

      {/* About Story */}
      <section className="relative max-w-7xl mx-auto px-6 py-32 flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl font-bold text-[#3a488a] relative inline-block">
            Our Vision
            <span className="absolute -bottom-2 left-0 w-16 h-1 bg-[#3a488a] rounded-full"></span>
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We focus on transforming architectural ideas into immersive visual narratives. Every render,
            animation, and walkthrough we create tells the story of the space and its potential.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our philosophy blends precision, light mastery, and storytelling to convey the true essence of the design.
          </p>
        </div>
        <div className="md:w-1/2 relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
          <Image
            src="/renders/about-hero.jpg"
            alt="Architectural render"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Capabilities / Skills */}
      <section className="relative bg-[#f3f4f8] py-32">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {/* 3D Rendering */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h3 className="text-3xl font-bold text-[#3a488a] mb-4">Photorealistic Rendering</h3>
              <p className="text-gray-700 leading-relaxed">
                High-detail 3D renders capturing materials, light, and architectural intent.
              </p>
            </div>
            <div className="md:w-1/2 relative h-[300px] rounded-2xl overflow-hidden shadow-lg">
              <Image src="/renders/render1.jpg" alt="Render" fill className="object-cover" />
            </div>
          </div>

          {/* Animation / Walkthrough */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <h3 className="text-3xl font-bold text-[#3a488a] mb-4">Animations & Walkthroughs</h3>
              <p className="text-gray-700 leading-relaxed">
                Cinematic flythroughs that communicate scale, flow, and ambiance.
              </p>
            </div>
            <div className="md:w-1/2 relative h-[300px] rounded-2xl overflow-hidden shadow-lg">
              <Image src="/renders/render2.jpg" alt="Animation" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
