import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuickRoastForm } from "@/app/components/QuickRoastForm";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
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
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight">
            <span className="block mb-2">Most ideas die in</span>
            <span className="gradient-text block">silence.</span>
            <span className="block mt-4 text-3xl md:text-5xl lg:text-6xl">
              Let yours die <span className="gradient-text-accent">quickly.</span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto">
            Get viability scores, fatal flaws, and concrete pivots in 60 seconds.
          </p>
        </div>

        {/* Quick Roast Form */}
        <div className="mb-16 md:mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <QuickRoastForm />
        </div>

        {/* Selling Points */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          <Card className="glass animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary mb-4 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">60-second idea crash test</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get a structured evaluation in about 60 seconds—viability scores, fatal flaws, and concrete pivots. Faster than traditional feedback loops.
              </p>
            </CardContent>
          </Card>

          <Card className="glass animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent mb-4 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Brutal honesty with actionable fixes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reveals fatal flaws early (distribution, market, monetization, defensibility, founder fit) and suggests concrete pivots. YC-style grilling, automated.
              </p>
            </CardContent>
          </Card>

          <Card className="glass animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary mb-4 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Quick due diligence</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fast-track deal screening with structured risk analysis. Identify red flags and viability gaps in minutes, not hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
