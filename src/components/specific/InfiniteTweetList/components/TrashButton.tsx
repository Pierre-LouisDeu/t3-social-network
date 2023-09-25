import { VscTrash } from "react-icons/vsc";
import { IconHoverEffect } from "~/components/common/icons/IconHoverEffect";
import { notifySuccess } from "~/components/common/toasts/toast";
import { Modal } from "~/components/common/modal/Modal";
import { ModalHeader } from "~/components/common/modal/ModalHeader";
import { ModalFooter } from "~/components/common/modal/ModalFooter";
import useModal from "~/hooks/useModal";

type HeartButtonProps = {
  onClick: () => void;
};

export const TrashButton = ({ onClick }: HeartButtonProps) => {
  const { open, setOpen, initialFocus } = useModal();

  const confirm = () => {
    onClick();
    notifySuccess({ message: "Tweet deleted" });
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-1 self-start text-gray-500 transition-colors duration-200 hover:text-red-500 focus-visible:text-red-500"
      >
        <IconHoverEffect color="red">
          <VscTrash className="fill-gray-500 transition-colors duration-200 group-hover:fill-red-500 group-focus-visible:fill-red-500" />
        </IconHoverEffect>
      </button>
      <Modal open={open} setOpen={setOpen} initialFocus={initialFocus}>
        <ModalHeader
          modalType="warning"
          title="Delete tweet"
          subTitle="Are you sure you want to delete this tweet?"
        />
        <ModalFooter
          modalType="warning"
          title="Delete"
          confirm={confirm}
          setOpen={setOpen}
          initialFocus={initialFocus}
        />
      </Modal>
    </>
  );
};
