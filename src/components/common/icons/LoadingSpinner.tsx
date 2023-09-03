import { VscRefresh } from "react-icons/vsc";

type LoadingSpinnerProps = {
  size?: number;
};

export function LoadingSpinner({ size }: LoadingSpinnerProps) {
  const sizeClasses = size ? `w-${size} h-${size}` : "w-10 h-10";

  return (
    <div className="flex h-full items-center justify-center p-2">
      <VscRefresh className={`animate-spin ${sizeClasses}`} />
    </div>
  );
}
