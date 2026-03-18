"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { theme } from "@/lib/styles";

export function WelcomeCard() {
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const qc = useQueryClient();

  const handleSeedRecipes = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/recipes/seed", { method: "POST" });
      if (res.ok) {
        setSeeded(true);
        qc.invalidateQueries({ queryKey: ["recipes"] });
      }
    } catch {
      // ignore
    }
    setSeeding(false);
  };

  if (seeded) return null;

  return (
    <Card className={`${theme.card} mb-4`}>
      <CardContent className="p-5 text-center">
        <h2 className="font-display text-lg text-amber-900 mb-2">Welcome to Dinner Table!</h2>
        <p className="font-display text-sm text-amber-700/70 mb-4">
          Get started by adding your family&apos;s favorite meals, or load some starter recipes to try things out.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/add">
            <Button className={`${theme.buttonPrimary} min-h-[44px] w-full sm:w-auto`}>
              <Plus className="size-4" /> Add a Recipe
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleSeedRecipes}
            disabled={seeding}
            className={`${theme.buttonOutline} min-h-[44px]`}
          >
            <Sparkles className="size-4" /> {seeding ? "Adding..." : "Add Starter Recipes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
