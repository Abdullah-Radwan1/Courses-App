import {
  BookOpen,
  Play,
  Star,
  Users,
  Clock,
  Award,
  ArrowRight,
} from "lucide-react";
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
import { EnrollButton } from "@/components/actionButtons/EnrollButton";
import { isUserEnrolled } from "@/lib/actions/userAction";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const stats = [
    { icon: Clock, value: "8 Weeks", label: "Total Duration" },
    { icon: BookOpen, value: "24", label: "Lessons" },
    { icon: Users, value: "1.2k", label: "Students" },
    { icon: Star, value: "4.9", label: "Rating" },
  ]; //hard coded

  const courseId = "353b6d90-7f3f-45c6-9795-f5f7f8fd5a46";
  const enrolled = await isUserEnrolled(courseId);

  return (
    <div className=" bg-background flex flex-col">
      {/* Hero Section */}
      <main className=" container mx-auto px-6 py-16">
        <div className="grid xl:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge className="px-4 py-2 text-sm flex items-center w-fit">
              <Star className="mr-2 h-4 w-4 " />
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
              From fundamentals to advanced concepts, we've got you covered with
              hands-on projects and expert guidance.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
              {stats.map((stat, i) => (
                <Card key={i} className="text-center border-border">
                  <CardHeader className="flex flex-col items-center space-y-2 p-4">
                    <stat.icon size={40} className=" text-primary" />
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {stat.label}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {enrolled ? (
                <div className="flex items-center gap-1 text">
                  <Link
                    className="flex items-center gap-1"
                    href={`/courses/${courseId}`}
                  >
                    <Button variant="default" size="lg">
                      {" "}
                      Preview Course <ArrowRight />
                    </Button>
                  </Link>
                </div>
              ) : (
                <EnrollButton courseId={courseId} />
              )}
            </div>

            {/* Trust Badges */}
            <Separator className="my-6 bg-border" />
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
          <Card className="relative p-8 border-border bg-card">
            <Badge className="absolute -top-3 -right-3 rounded-full px-4 py-1 font-semibold bg-secondary text-secondary-foreground">
              Most Popular
            </Badge>

            <CardContent className="space-y-6 mt-4">
              <div className="relative aspect-video rounded-xl  bg-muted flex items-center justify-center">
                <Image
                  alt="Course Promotion"
                  src={"/Course_Promotion.jpg"}
                  fill
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-4">
                <CardTitle className="text-2xl text-card-foreground">
                  What You'll Learn
                </CardTitle>
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
    </div>
  );
}
