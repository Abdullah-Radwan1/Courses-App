import { useEffect, useState } from "react";

const ProgressCircle = ({ progress }: { progress: number }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Animate to new progress
    setAnimatedProgress(progress);
  }, [progress]);

  return (
    <div className="relative w-14 h-14">
      <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted"
        />
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-primary transition-all duration-500 ease-out"
          strokeDasharray="100"
          strokeDashoffset={100 - animatedProgress}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-primary">
          {animatedProgress}%
        </span>
      </div>
    </div>
  );
};

export default ProgressCircle;
