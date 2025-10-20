"use client";

import { BookOpen, Play, Star, Users, Clock, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const router = useRouter();

  const handleGoToCourse = () => {
    router.push("/dashboard");
  };

  const stats = [
    { icon: Clock, value: "8h 24m", label: "Total Duration" },
    { icon: BookOpen, value: "24", label: "Lessons" },
    { icon: Users, value: "1.2k", label: "Students" },
    { icon: Star, value: "4.9", label: "Rating" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-sidebar to-secondary/5 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              LearnHub
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            {["Home", "Courses", "Features", "Pricing"].map((item) => (
              <Button
                key={item}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                {item}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge
              variant="outline"
              className="border-border px-4 py-2 text-sm flex items-center w-fit"
            >
              <Star className="mr-2 h-4 w-4 text-primary" />
              Rated 4.9/5 by over 1,200 students
            </Badge>

            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Master Modern{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Web Development
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
              Join thousands of students learning the latest web technologies.
              From fundamentals to advanced concepts, we’ve got you covered with
              hands-on projects and expert guidance.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
              {stats.map((stat, i) => (
                <Card key={i} className="text-center shadow-sm">
                  <CardHeader className="flex flex-col items-center space-y-2 p-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-bold">
                      {stat.value}
                    </CardTitle>
                    <CardDescription>{stat.label}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="flex items-center gap-2 text-lg px-8 py-6"
                onClick={handleGoToCourse}
              >
                <Play className="h-5 w-5" />
                Start Learning Now
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 text-lg px-8 py-6"
              >
                Preview Course
              </Button>
            </div>

            {/* Trust Badges */}
            <Separator className="my-6" />
            <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span>Certificate of Completion</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>

          {/* Right Content - Course Preview Card */}
          <Card className="relative p-8 shadow-xl">
            <Badge
              variant="destructive"
              className="absolute -top-3 -right-3 rounded-full px-4 py-1 font-semibold"
            >
              Most Popular
            </Badge>

            <CardContent className="space-y-6 mt-4">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Course Preview
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <CardTitle className="text-2xl">What You’ll Learn</CardTitle>
                <ul className="space-y-3 text-muted-foreground">
                  {[
                    "Modern React & Next.js patterns",
                    "Responsive design principles",
                    "State management best practices",
                    "API integration techniques",
                    "Deployment & optimization",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/60 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          © 2025 LearnHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
