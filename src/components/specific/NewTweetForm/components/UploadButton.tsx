import { VscCloudUpload } from "react-icons/vsc";
import { notifyError, notifySuccess } from "~/components/common/toasts/toast";
import { Modal } from "~/components/common/modal/Modal";
import { ModalHeader } from "~/components/common/modal/ModalHeader";
import { ModalFooter } from "~/components/common/modal/ModalFooter";
import useModal from "~/hooks/useModal";
import { UploadDropzone } from "~/utils/uploadthing";
import { type Json, type UploadThingError } from "@uploadthing/shared";
import { type UploadFileResponse } from "uploadthing/client";
import { getPlural } from "~/utils/utils";

type UploadImageButtonProps = {
  onUpload: (imageUrl: UploadFileResponse[]) => void;
};

export const UploadImageButton = ({ onUpload }: UploadImageButtonProps) => {
  const { open, setOpen, initialFocus } = useModal();

  const confirmUpload = (images: UploadFileResponse[]) => {
    onUpload(images);
    notifySuccess({
      message: getPlural(images.length, "Image uploaded", "Images uploaded"),
    });
    setOpen(false);
  };

  const handleUploadError = (error: UploadThingError<Json>) => {
    notifyError({ message: error.message });
    console.warn(error);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-24 items-center justify-center"
      >
        <VscCloudUpload className="h-8 w-8 fill-blue-400 stroke-blue-400 hover:fill-blue-300" />
      </button>
      <Modal open={open} setOpen={setOpen} initialFocus={initialFocus}>
        <ModalHeader
          modalType="confirm"
          title="Upload Image"
          subTitle="Upload an image to your tweet."
        />
        <div className="pb-6 pt-8">
          <UploadDropzone
            className="ut-button:mt-4 ut-button:w-32 ut-button:bg-blue-400 ut-button:p-2 ut-button:text-sm ut-allowed-content:text-sm ut-allowed-content:text-blue-400 ut-label:text-sm ut-label:font-normal ut-label:text-gray-500 ut-upload-icon:text-blue-400"
            endpoint="imageUploader"
            onClientUploadComplete={(res: UploadFileResponse[] | undefined) =>
              confirmUpload(res ?? [])
            }
            onUploadError={(error) => handleUploadError(error)}
          />
        </div>
        <ModalFooter
          modalType="confirm"
          title="Upload"
          setOpen={setOpen}
          initialFocus={initialFocus}
        />
      </Modal>
    </>
  );
};
