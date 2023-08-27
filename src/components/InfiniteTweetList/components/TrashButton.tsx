import { useSession } from "next-auth/react";
import { VscTrash } from "react-icons/vsc";
import { IconHoverEffect } from "~/components/IconHoverEffect copy";

type HeartButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  likedByMe: boolean;
};

export const TrashButton = ({
  isLoading,
  onClick,
  likedByMe,
}: HeartButtonProps) => {
  const session = useSession();

  if (session.status !== "authenticated") {
    return null;
  }

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`group -ml-2 flex items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
      }`}
    >
      <IconHoverEffect red>
        <VscTrash
          className={`transition-colors duration-200 ${
            likedByMe
              ? "fill-red-500"
              : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
          }`}
        />
      </IconHoverEffect>
    </button>
  );
};
