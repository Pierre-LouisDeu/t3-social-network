import type { ReactNode } from "react";

type IconHoverEffectProps = {
  children: ReactNode;
  color?: "red" | "blue" | "gray";
  className?: string;
};

export function IconHoverEffect({
  children,
  color,
  className = "",
}: IconHoverEffectProps) {
  const colorClasses =
    color === "red"
      ? "outline-red-400 hover:bg-red-100 group-hover-bg-red-100 group-focus-visible:bg-red-100 focus-visible:bg-red-100"
      : color === "blue"
      ? "outline-blue-400 hover:bg-blue-100 group-hover-bg-blue-100 group-focus-visible:bg-blue-100 focus-visible:bg-blue-100"
      : "outline-gray-400 hover:bg-gray-100 group-hover-bg-gray-100 group-focus-visible:bg-gray-100 focus-visible:bg-gray-100";

  return (
    <div
      className={`rounded-full relative p-2 transition-colors duration-100 ${colorClasses} ${className}`}
    >
      {children}
    </div>
  );
}
