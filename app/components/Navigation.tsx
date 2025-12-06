"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-lg blur-sm group-hover:bg-primary/20 transition-colors"></div>
              <span className="relative text-lg font-bold text-foreground hidden sm:inline-block transition-colors group-hover:text-primary-solid">
                WhyYourIdeaSucks<span className="text-primary-solid">.ai</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link href="/directory">
              <Button
                variant={isActive("/directory") ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "gap-2 transition-all duration-200 font-medium",
                  isActive("/directory") && "bg-primary/15 text-primary-solid shadow-sm border border-border"
                )}
              >
                <span className="hidden sm:inline">Directory</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button
                variant={isActive("/settings") ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "gap-2 transition-all duration-200",
                  isActive("/settings") && "bg-primary/15 text-primary-solid shadow-sm border border-border"
                )}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
