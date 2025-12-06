import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuickRoastForm } from "@/app/components/QuickRoastForm";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Header */}
        <header className="mb-12 md:mb-20 animate-fade-in-up">
          <nav className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">
              WhyYourIdeaSucks.ai
            </h1>
            <div className="flex gap-3">
              <Link href="/directory">
                <Button variant="ghost" className="text-sm md:text-base">Browse Ideas</Button>
              </Link>
              <Link href="/judge">
                <Button variant="ghost" className="text-sm md:text-base">Judge Mode</Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight">
            <span className="block mb-2">Most ideas die in</span>
            <span className="gradient-text block">silence.</span>
            <span className="block mt-4 text-3xl md:text-5xl lg:text-6xl">
              Let yours die <span className="gradient-text-accent">quickly.</span>
            </span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
            Brutal, fast startup idea crash test: Get viability scores, fatal flaws, and concrete pivots in 60 seconds.
          </p>
        </div>

        {/* Quick Roast Form */}
        <div className="mb-20 md:mb-28 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <QuickRoastForm />
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20 md:mb-28">
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Roast Report</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                6 core scores + "why it sucks" + actionable fixes
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Adaptive Brutality</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose your pain level: Gentle, Honest, or Savage
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-primary mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Pivot Generator</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                2-3 sharper versions of your idea
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up glow-orange" style={{ animationDelay: '0.6s' }}>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-orange-500 mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Investor Due Diligence</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fast-track deal screening with structured risk analysis
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
            YC-style grilling meets modern AI—perfect for hackathons, founders, investors, and idea-killers.
          </p>
          <p className="text-base text-accent mb-8 font-medium">
            Investors: Use as a due diligence tool to quickly assess deal viability and identify red flags.
          </p>
          <Link href="/roast">
            <Button size="lg" className="text-base md:text-lg px-8 py-6">
              Start Your Roast
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
