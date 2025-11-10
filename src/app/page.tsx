// app/page.tsx - Home Page
"use client";

import React from "react";
import { Mail, Instagram } from "lucide-react";
import BeamsWrapper from "@/components/BeamsWrapper";
import MagicBento from "@/components/MagicBento";
import Masonry from "@/components/Masonry";
import TiltedCard from "@/components/TiltedCard";
import MasonryWrapper from "@/components/MasonryWrapper";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#032bff]/40 to-transparent overflow-hidden">
        {/* Beams Background */}
        <BeamsWrapper />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Envisioning Great Ideas
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md">
            govisualization is an architectural visualization studio
            specializing in high-quality 3D rendering, animation, and concept
            visuals.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/about"
              className="px-6 py-3 bg-[#032bff] text-white rounded-xl hover:shadow-lg transition"
            >
              Learn More
            </a>
            <a
              href="/contact"
              className="px-6 py-3 border border-white text-white rounded-xl hover:bg-white hover:text-[#032bff] transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: `
      radial-gradient(circle at top left, rgba(58, 72, 138, 0.15), transparent 50%),
      radial-gradient(circle at bottom right, rgba(80, 102, 170, 0.1), transparent 50%),
      linear-gradient(135deg, #e8ebf7, #c7d0f0, #a0aadf)
    `,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Projects
          </h2>

          {/* BentoGrid Showcase */}
          <div className="mb-16">
            <MagicBento
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={12}
              glowColor="3, 43, 255"
            />
          </div>

          {/* MasonryGrid Showcase */}
          <div className="mb-16">
            <MasonryWrapper />
          </div>

          {/* TiltCards Showcase */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              3D Tilt Cards
            </h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <TiltedCard
                    key={idx}
                    imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
                    altText="Example Project"
                    captionText={`Project ${idx + 1}`}
                    containerHeight="300px"
                    containerWidth="300px"
                    imageHeight="300px"
                    imageWidth="300px"
                    rotateAmplitude={12}
                    scaleOnHover={1.2}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={true}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <Footer />
    </main>
  );
}
