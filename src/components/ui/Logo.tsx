
import { Code } from "lucide-react";

export const Logo = ({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div className={`rounded-md bg-primary text-primary-foreground flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <Code className="w-4 h-4" />
    </div>
  );
};
