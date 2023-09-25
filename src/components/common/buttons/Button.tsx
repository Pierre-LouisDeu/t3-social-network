import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  small?: boolean;
  red?: boolean;
  disabled?: boolean;
  className?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = ({
  small = false,
  red = false,
  disabled = false,
  className = "",
  ...props
}: ButtonProps) => {
  const sizeClasses = small ? "px-2 py-1" : "px-4 py-2 font-bold";
  const colorClasses = red
    ? "bg-red-500 hover:bg-red-400 focus-visible:bg-red-400"
    : disabled
    ? "bg-gray-500"
    : "bg-blue-400 hover:bg-blue-300 focus-visible:bg-blue-300";

  return (
    <button
      disabled={disabled}
      className={`rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses} ${colorClasses} ${className}`}
      {...props}
    />
  );
};
