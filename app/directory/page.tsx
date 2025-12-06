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

const CATEGORIES = [
  "All",
  "B2B/SaaS",
  "B2C app",
  "Marketplace",
  "Dev tool",
  "Consumer hardware",
  "Other",
];

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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">Idea Directory</h1>
              <p className="text-lg text-muted-foreground">
                Browse all roasts and learn from other ideas
              </p>
            </div>
            <Link href="/">
              <Button variant="ghost">← Home</Button>
            </Link>
          </div>
        </header>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roastsToDisplay.map((publicRoast) => (
              <Link
                key={publicRoast._id}
                href={`/roast/${publicRoast.roastId}`}
              >
                <Card className="glass h-full hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{publicRoast.category}</Badge>
                      <div className="text-2xl font-bold">
                        {publicRoast.avgScore.toFixed(1)}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">
                      {publicRoast.pitch.substring(0, 100)}
                      {publicRoast.pitch.length > 100 ? "..." : ""}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">
                      {publicRoast.verdict}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-4">
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

