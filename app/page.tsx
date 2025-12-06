"use client";

import { Card, CardContent } from "@/components/ui/card";
import { QuickRoastForm } from "@/app/components/QuickRoastForm";
import { Sparkles, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-18 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-foreground text-balance">
            Most ideas die in silence.
            <br />
            <span className="text-primary">
              Let yours die quickly.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed text-balance">
            Get viability scores, fatal flaws, and concrete pivots in 60 seconds.
          </p>
        </div>

        {/* Quick Roast Form */}
        <div className="mb-20 md:mb-24 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <QuickRoastForm />
        </div>

        {/* Selling Points */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8">
          <Card className="animate-fade-in-up hover-lift border-2 border-border bg-primary/20 backdrop-blur-sm shadow-card hover:shadow-primary" style={{ animationDelay: '0.15s' }}>
            <CardContent className="pt-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/30 mb-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg border border-primary/20">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">60-second crash test</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get a structured evaluation in about 60 seconds—viability scores, fatal flaws, and concrete pivots.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up hover-lift border-2 border-border bg-primary/20 backdrop-blur-sm shadow-card hover:shadow-primary" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/30 mb-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg border border-primary/20">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Brutal honesty with fixes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reveals fatal flaws early (distribution, market, monetization, defensibility) and suggests concrete pivots.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up hover-lift border-2 border-border bg-primary/20 backdrop-blur-sm shadow-card hover:shadow-primary" style={{ animationDelay: '0.25s' }}>
            <CardContent className="pt-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/30 mb-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg border border-primary/20">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Quick due diligence</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fast-track deal screening with structured risk analysis. Identify red flags in minutes, not hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
