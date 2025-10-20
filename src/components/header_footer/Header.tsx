import { BookOpen } from "lucide-react";
import React from "react";
import { getServerSession } from "next-auth";
import SignoutButton from "@/lib/auth/SignoutButton";

const Header = async () => {
  const session = await getServerSession();
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            LearnHub
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xl">
          {session && (
            <>
              <div className="text-foreground">
                Hi{" "}
                <span className="text-primary font-medium">
                  {session?.user?.name}!
                </span>
              </div>
              <SignoutButton />
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
