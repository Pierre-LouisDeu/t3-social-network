import { VscTrash } from "react-icons/vsc";
import { IconHoverEffect } from "~/components/IconHoverEffect";

type HeartButtonProps = {
  onClick: () => void;
};

export const TrashButton = ({ onClick }: HeartButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="group -ml-2 flex items-center gap-1 self-start text-gray-500 transition-colors duration-200 hover:text-red-500 focus-visible:text-red-500"
    >
      <IconHoverEffect red>
        <VscTrash className="fill-gray-500 transition-colors duration-200 group-hover:fill-red-500 group-focus-visible:fill-red-500" />
      </IconHoverEffect>
    </button>
  );
};
