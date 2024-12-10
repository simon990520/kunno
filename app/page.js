import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import AnimatedHero from "./_components/AnimatedHero";
import AnimatedFeatures from "./_components/AnimatedFeatures";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] relative overflow-hidden">
      {/* Header */}
      <nav className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg grid place-items-center">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          </div>
          <span className="font-semibold text-xl">ChronoTask</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
          <Link href="#solutions" className="text-gray-600 hover:text-gray-900">Solutions</Link>
          <Link href="#resources" className="text-gray-600 hover:text-gray-900">Resources</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign in</Link>
          <Link href="/download" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Get demo
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-32">
        <AnimatedHero />
        <AnimatedFeatures />
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-50">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-50 rounded-full filter blur-3xl"></div>
      </div>
    </main>
  );
}
