import { Instagram, Mail } from "lucide-react";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo / Brand */}
        <div className="text-center md:text-left">
          <Image
            src="/goviz.jpg"
            alt="govisualization logo"
            width={48}
            height={48}
          />
          <h3 className="text-2xl font-bold">govisualization</h3>
          <p className="mt-2 text-gray-400 text-sm">
            Architectural Visualization Studio specializing in 3D rendering &
            animation
          </p>
        </div>

        {/* Contact Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="mailto:go.archiviz@gmail.com"
            className="flex items-center justify-center gap-2 px-5 py-2 bg-[#032bff] rounded-lg hover:shadow-lg transition"
          >
            <Mail size={18} /> Email Us
          </a>
          <a
            href="https://www.instagram.com/govisualization/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-2 border border-[#032bff] text-[#032bff] rounded-lg hover:bg-[#032bff] hover:text-white transition"
          >
            <Instagram size={18} /> Instagram
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} govisualization. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
