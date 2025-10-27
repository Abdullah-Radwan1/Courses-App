import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className=" bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary animate-bounce">
            404
          </h1>
        </div>

        {/* Main Content */}
        <div className="card p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-2">
              Page Not Found
            </h2>
            <p className="text-muted-foreground">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. The
              page might have been moved, deleted, or you entered an incorrect
              URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="btn-primary px-6 py-3 rounded-md font-medium transition-all duration-200 hover:scale-105"
            >
              Go Home
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link
              href="/contact"
              className="text-primary hover:text-primary-hover underline underline-offset-4 transition-colors"
            >
              Contact our support team
            </Link>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 opacity-50">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
