import { useSession } from "next-auth/react";
import { BiComment } from "react-icons/bi";
import { IconHoverEffect } from "~/components/common/icons/IconHoverEffect";

type CommentButtonProps = {
  onClick: () => void;
  redirect?: boolean;
};

export const CommentButton = ({
  onClick,
  redirect = false,
}: CommentButtonProps) => {
  const session = useSession();

  if (redirect) {
    return (
      <button
        disabled={session.status !== "authenticated"}
        onClick={onClick}
        className="group flex items-center gap-1 self-start text-gray-500 transition-colors duration-200 hover:text-red-500 focus-visible:text-red-500"
      >
        <IconHoverEffect red>
          <BiComment className="fill-gray-500 transition-colors duration-200 group-hover:fill-red-500 group-focus-visible:fill-red-500" />
        </IconHoverEffect>
      </button>
    );
  }

  return (
    <button
      disabled={session.status !== "authenticated"}
      onClick={onClick}
      className="group flex items-center gap-1 self-start text-gray-500 transition-colors duration-200 hover:text-red-500 focus-visible:text-red-500"
    >
      <IconHoverEffect red>
        <BiComment className="fill-gray-500 transition-colors duration-200 group-hover:fill-red-500 group-focus-visible:fill-red-500" />
      </IconHoverEffect>
    </button>
  );
};
