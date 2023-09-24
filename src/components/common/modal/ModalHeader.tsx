import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type ModalHeaderProps = {
  modalType: "warning" | "confirm";
  title: string;
  subTitle?: string;
};

export const ModalHeader = ({
  modalType,
  title,
  subTitle,
}: ModalHeaderProps) => {
  return (
    <div className="sm:flex sm:items-start">
      {modalType === "confirm" ? (
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
          <CheckIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
        </div>
      ) : (
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>
      )}
      <div className="mt-3 sm:ml-4 sm:mt-0 sm:text-left">
        <Dialog.Title
          as="h3"
          className="text-base font-semibold leading-6 text-gray-900"
        >
          {title}
        </Dialog.Title>
        <div className="mt-2">
          <p className="text-sm text-gray-500">{subTitle}</p>
        </div>
      </div>
    </div>
  );
};
