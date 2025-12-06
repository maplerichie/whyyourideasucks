"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "B2B/SaaS",
  "B2C app",
  "Marketplace",
  "Dev tool",
  "Consumer hardware",
  "Other",
];

function getScoreColor(score: number): string {
  if (score >= 7) return "score-good";
  if (score >= 5) return "score-medium";
  return "score-poor";
}

function getScoreBgColor(score: number): string {
  if (score >= 7) return "score-good-bg";
  if (score >= 5) return "score-medium-bg";
  return "score-poor-bg";
}

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minScore, setMinScore] = useState<number | undefined>(undefined);
  const [maxScore, setMaxScore] = useState<number | undefined>(undefined);

  const publicRoasts = useQuery(
    api.roasts.getAllRoasts,
    selectedCategory !== "All"
      ? {
        category: selectedCategory,
        minScore,
        maxScore,
        limit: 100,
      }
      : {
        minScore,
        maxScore,
        limit: 100,
      }
  );

  const searchResults = useQuery(
    api.roasts.searchRoasts,
    searchTerm ? { searchTerm, limit: 100 } : "skip"
  );

  const roastsToDisplay = searchTerm
    ? searchResults || []
    : publicRoasts || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-10 animate-fade-in-up">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Idea Directory</h1>
            <p className="text-base text-muted-foreground">
              Browse all roasts and learn from other ideas
            </p>
          </div>
        </header>

        {/* Filters */}
        <Card className="mb-8 shadow-elevated border-2 border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search ideas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Min score"
                  value={minScore || ""}
                  onChange={(e) =>
                    setMinScore(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-[120px]"
                />
                <Input
                  type="number"
                  placeholder="Max score"
                  value={maxScore || ""}
                  onChange={(e) =>
                    setMaxScore(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-[120px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {roastsToDisplay.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No results found. Try a different search term."
                : "No roasts yet. Be the first to share your idea!"}
            </p>
            <Link href="/roast">
              <Button className="mt-4">Get Your Idea Roasted</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roastsToDisplay.map((publicRoast) => (
              <Link
                key={publicRoast._id}
                href={`/roast/${publicRoast.roastId}`}
                className="block h-full"
              >
                <Card className={cn(
                  "h-full transition-all duration-300 hover:border-primary/40 hover-lift group border-2 bg-card/80 backdrop-blur-sm",
                  getScoreBgColor(publicRoast.avgScore)
                )}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="shadow-sm border-2 bg-background/50">{publicRoast.category}</Badge>
                      <div className={cn("text-2xl font-bold", getScoreColor(publicRoast.avgScore))}>
                        {publicRoast.avgScore.toFixed(1)}
                      </div>
                    </div>
                    <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors duration-200 font-semibold">
                      {publicRoast.pitch.substring(0, 100)}
                      {publicRoast.pitch.length > 100 ? "..." : ""}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                      {publicRoast.verdict}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                      {new Date(publicRoast.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
