import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1 mr-1">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="font-semibold text-xl">蓝博</span>
          </div>
          <nav className="flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <Button variant="outline">Log In</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </SignedIn>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container flex flex-col items-center text-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              <span className="text-primary">Lanbo 蓝博</span> - Receipt Tracking Made Simple
            </h1>
            <p className="max-w-[800px] text-gray-600 md:text-xl">
              Effortlessly track, manage, and analyze your receipts with AI-powered extraction.
              Upload PDFs and instantly get organized data.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <SignedOut>
                <SignUpButton>
                  <Button size="lg">Get Started</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
                <h3 className="text-xl font-bold mb-2">AI-Powered Extraction</h3>
                <p className="text-gray-600">
                  Extract merchant info, line items, dates, and totals automatically from PDFs.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
                <h3 className="text-xl font-bold mb-2">Real-Time Dashboard</h3>
                <p className="text-gray-600">
                  Track your spending with beautiful, real-time visualizations and summaries.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
                <h3 className="text-xl font-bold mb-2">Flexible Plans</h3>
                <p className="text-gray-600">
                  Choose the perfect plan for your needs, from Free to Pro with advanced features.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-primary rounded-md p-1 mr-1">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="font-semibold text-xl">蓝博</span>
          </div>
          <p className="text-gray-600 text-sm">© 2025 Lanbo 蓝博. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
