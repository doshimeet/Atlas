import React from "react";
import { LivingAtlasHero } from "@/components/home/LivingAtlasHero";
import { ConnectSandbox } from "@/components/home/ConnectSandbox";
import { StoryCards } from "@/components/home/StoryCards";
import { EvidenceStrip } from "@/components/home/EvidenceStrip";

export default function HomePage() {
  return (
    <div className="w-full bg-background text-foreground pb-12">
      {/* 1. Interactive 2D constellation canvas hero with auto-narrated thread */}
      <LivingAtlasHero />

      {/* 2. Interactive "Connect two things" sandbox */}
      <ConnectSandbox />

      {/* 3. Three real inquiry story cards with interactive SVG mini-graphs */}
      <StoryCards />

      {/* 4. Verified live telemetry and evidence strip */}
      <EvidenceStrip />
    </div>
  );
}

