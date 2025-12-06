"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

type JudgeIdea = {
  id: string;
  pitch: string;
  roastId?: string;
  scores?: {
    market: number;
    distribution: number;
    monetization: number;
    defensibility: number;
    founder_fit: number;
    hackathon: number;
  };
  avgScore?: number;
  verdict?: string;
};

export default function JudgeModePage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<JudgeIdea[]>([]);
  const [currentPitch, setCurrentPitch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const generateRoast = useAction(api.roast.generateRoast);
  const submitIdea = useMutation(api.ideas.submitIdea);
  const saveRoast = useMutation(api.roasts.saveRoast);

  const addIdea = () => {
    if (!currentPitch.trim()) return;

    const newIdea: JudgeIdea = {
      id: Date.now().toString(),
      pitch: currentPitch.trim(),
    };

    setIdeas([...ideas, newIdea]);
    setCurrentPitch("");
  };

  const roastIdea = async (ideaId: string) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea || idea.roastId) return;

    setIsProcessing(true);
    setProcessingId(ideaId);

    try {
      // Create minimal idea data
      const ideaData = {
        pitch: idea.pitch,
        category: "Other",
        stage: "Hackathon demo",
        targetUser: "Not specified",
        tam: 1000000,
        problemUrgency: 5,
        alternatives: "Not specified",
        distribution: "Not specified",
        distributionChannels: [],
        unfairEdge: "Not specified",
        monetization: "Not specified",
        monetizationModel: "Other" as const,
        teamFit: "Not specified",
        brutality: "honest" as const,
      };

      // Submit idea
      const submittedIdeaId = await submitIdea(ideaData);

      // Generate roast
      const roastResult = await generateRoast({ ideaData });

      // Save roast
      const roastId = await saveRoast({
        ideaId: submittedIdeaId,
        verdict: roastResult.verdict,
        brutality: "honest",
        scores: roastResult.scores,
        pivots: roastResult.pivots,
        next7days: roastResult.next7days,
      });

      // Calculate average score
      const scores = roastResult.scores;
      const avgScore =
        (scores.market.score +
          scores.distribution.score +
          scores.monetization.score +
          scores.defensibility.score +
          scores.founder_fit.score +
          scores.hackathon.score) /
        6;

      // Update idea with roast results
      setIdeas(
        ideas.map((i) =>
          i.id === ideaId
            ? {
                ...i,
                roastId: roastId as string,
                scores: {
                  market: scores.market.score,
                  distribution: scores.distribution.score,
                  monetization: scores.monetization.score,
                  defensibility: scores.defensibility.score,
                  founder_fit: scores.founder_fit.score,
                  hackathon: scores.hackathon.score,
                },
                avgScore: Math.round(avgScore * 10) / 10,
                verdict: roastResult.verdict,
              }
            : i
        )
      );
    } catch (error) {
      console.error("Error roasting idea:", error);
      alert("Failed to roast idea. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
    }
  };

  const roastAll = async () => {
    const unroasted = ideas.filter((i) => !i.roastId);
    for (const idea of unroasted) {
      await roastIdea(idea.id);
    }
  };

  const sortedIdeas = [...ideas].sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0));

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">Judge Mode</h1>
          <p className="text-lg text-muted-foreground">
            Paste hackathon team ideas and get instant structured critiques for ranking
          </p>
        </div>

        {/* Add Idea Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Add Team Idea</CardTitle>
            <CardDescription>Paste an idea pitch to evaluate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="judge-pitch">Idea Pitch</Label>
                <Textarea
                  id="judge-pitch"
                  value={currentPitch}
                  onChange={(e) => setCurrentPitch(e.target.value)}
                  placeholder="Paste team idea pitch here..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addIdea} disabled={!currentPitch.trim()}>
                  Add Idea
                </Button>
                {ideas.length > 0 && (
                  <Button
                    onClick={roastAll}
                    variant="outline"
                    disabled={isProcessing || ideas.every((i) => i.roastId)}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Roast All"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ideas Table */}
        {ideas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Ideas Ranking ({ideas.length} total)</CardTitle>
              <CardDescription>
                Sorted by average score. Click "Roast" to evaluate each idea.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Idea</TableHead>
                    <TableHead className="text-center">Avg Score</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Dist.</TableHead>
                    <TableHead>Monet.</TableHead>
                    <TableHead>Def.</TableHead>
                    <TableHead>Fit</TableHead>
                    <TableHead>Hack</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedIdeas.map((idea, idx) => (
                    <TableRow key={idea.id}>
                      <TableCell className="font-bold">#{idx + 1}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm line-clamp-2">{idea.pitch}</p>
                        {idea.verdict && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {idea.verdict}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {idea.avgScore ? (
                          <Badge variant={idea.avgScore >= 7 ? "default" : idea.avgScore >= 5 ? "secondary" : "destructive"}>
                            {idea.avgScore.toFixed(1)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {idea.scores?.market || "-"}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {idea.scores?.distribution || "-"}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {idea.scores?.monetization || "-"}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {idea.scores?.defensibility || "-"}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {idea.scores?.founder_fit || "-"}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {idea.scores?.hackathon || "-"}
                      </TableCell>
                      <TableCell>
                        {idea.roastId ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/roast/${idea.roastId}`)}
                          >
                            View
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => roastIdea(idea.id)}
                            disabled={isProcessing}
                          >
                            {processingId === idea.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Roast"
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

