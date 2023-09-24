import { type MutableRefObject } from "react";

type ModalFooterProps = {
  modalType: "warning" | "confirm";
  title: string;
  confirm?: () => void;
  setOpen: (open: boolean) => void;
  initialFocus?: MutableRefObject<null>;
};

export const ModalFooter = ({
  modalType,
  title,
  confirm,
  setOpen,
  initialFocus,
}: ModalFooterProps) => {
  return (
    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
      {confirm && title && (
        <button
          type="button"
          className={`inline-flex w-full justify-center rounded-md ${
            modalType === "confirm" ? "bg-blue-400" : "bg-red-400"
          } px-3 py-2 text-sm font-semibold text-white shadow-sm ${
            modalType === "confirm" ? "hover:bg-blue-300" : "hover:bg-red-300"
          } sm:ml-3 sm:w-auto`}
          onClick={confirm}
          ref={initialFocus}
        >
          {title}
        </button>
      )}
      <button
        type="button"
        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        onClick={() => setOpen(false)}
      >
        Cancel
      </button>
    </div>
  );
};
