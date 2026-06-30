import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStars } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
  className,
}: StarRatingProps) {
  const stars = getStars(rating);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {stars.map((type, i) => (
          <Star
            key={i}
            className={cn(
              sizeMap[size],
              type === "full" && "fill-amber-400 text-amber-400",
              type === "half" && "fill-amber-200 text-amber-400",
              type === "empty" && "fill-gray-100 text-gray-300"
            )}
          />
        ))}
      </div>
      <span className={cn("font-semibold text-gray-800 dark:text-gray-200", size === "sm" ? "text-xs" : "text-sm")}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className={cn("text-gray-500", size === "sm" ? "text-xs" : "text-sm")}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
