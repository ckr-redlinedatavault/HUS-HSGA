'use client';

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-600 flex flex-col font-sans">

      <Navbar />

      {/* Main Content Area - Split Layout */}
      <main className="flex-grow flex flex-col lg:flex-row w-full">

        {/* Left Side: Text Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-white">
          <div className="max-w-xl w-full text-left space-y-8">

            {/* Simple Status Badge */}
            <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs tracking-wide border border-orange-100">
              Welcome to HSGA Unified Systems
            </span>

            {/* Main Heading - Light Fonts */}
            <h1 className="text-5xl lg:text-7xl text-gray-900 leading-[1.1] font-light tracking-tight">
              Hindustan Scouts <br />
              and Guides <br />
              <span className="text-orange-600 font-normal">Telangana State</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-500 font-light leading-relaxed">
              Empowering youth through service, unity, and discipline.
              Access the unified management system to connect and serve better.
            </p>

            {/* Buttons - Clean & Flat */}
            <div className="flex flex-row items-center gap-4 pt-4">
              <Link
                href="/get-started"
                className="h-12 px-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-normal transition-colors flex items-center justify-center"
              >
                Get Started
              </Link>
              <button className="h-12 px-8 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-normal transition-colors flex items-center justify-center">
                Learn More
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: Image - No Effects, Just Clean Image */}
        <div className="w-full lg:w-1/2 relative h-[400px] lg:h-auto bg-gray-50">
          <Image
            src="https://res.cloudinary.com/dq2suftps/image/upload/v1722516890/18_botahw.jpg"
            alt="HSGA Leadership"
            fill
            className="object-cover"
            priority
          />
        </div>

      </main>

      {/* Simple Orange Footer */}
      <footer className="w-full bg-orange-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-normal">HSGA Telangana State</h2>
            <p className="text-white/80 text-xs mt-1 font-light">
              Service • Unity • Discipline
            </p>
          </div>

          <div className="text-xs text-white/80 font-light">
            © {new Date().getFullYear()} Hindustan Scouts and Guides Association.
          </div>
        </div>
      </footer>

    </div>
  );
}