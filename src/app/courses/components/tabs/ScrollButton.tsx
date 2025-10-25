"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function ScrollButton({
  targetId,
  icon,
}: {
  targetId: string;
  icon: React.ReactNode;
}) {
  const scrollToSection = () => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Button variant="outline" onClick={scrollToSection}>
      {icon}
    </Button>
  );
}
