import { useSession } from "next-auth/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useCreateTweet } from "./hooks/useCreateTweet";
import { ProfileImage } from "../../common/icons/ProfileImage";
import { Button } from "../../common/buttons/Button";
import { useLocation } from "./hooks/useLocation";
import { LoadingSpinner } from "~/components/common/icons/LoadingSpinner";
import { UploadImageButton } from "./components/UploadButton";
import { MdCancel } from "react-icons/md";
import { type UploadFileResponse } from "uploadthing/client";
import Image from "next/image";
import { useDeleteImages } from "../InfiniteTweetList/hooks/useDeleteImages";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

export function NewTweetForm() {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  return <Form />;
}

function Form() {
  const session = useSession();
  const { address } = useLocation();
  const { handleDeleteImages } = useDeleteImages();
  const [inputValue, setInputValue] = useState<string>("");
  const [imagesUploaded, setImagesUploaded] = useState<UploadFileResponse[]>(
    []
  );
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const { handleCreateTweet, isLoading } = useCreateTweet({
    address,
    inputValue,
    setInputValue,
    imagesUploaded,
    setImagesUploaded,
  });

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const invalidTweet =
    (inputValue.length === 0 && imagesUploaded.length === 0) ||
    inputValue.length > 280;

  if (session.status !== "authenticated") return null;

  const removeImage = (key: string) => {
    handleDeleteImages(key);
    const updatedImages = imagesUploaded.filter((image) => image.key !== key);
    setImagesUploaded(updatedImages);
  };

  return (
    <div className="flex flex-col gap-2 border-y px-4 py-2">
      <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          id="comment"
          name="comment"
          ref={inputRef}
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What's happening?"
          className="flex-grow resize-none overflow-hidden border-0 border-transparent p-4 text-lg focus:ring-0"
        />
      </div>
      <div className="pl-20">
        <div className="flex flex-row flex-wrap gap-4">
          {imagesUploaded.map((image) => (
            <div key={image.key} className="relative rounded-lg">
              <Image
                className="rounded-lg"
                src={image.url}
                width={250}
                height={250}
                alt="Imported image"
              />
              <MdCancel
                className="absolute right-2 top-2 h-6 w-6 cursor-pointer text-gray-700 hover:text-gray-600"
                onClick={() => void removeImage(image.key)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-2 pt-2">
          <UploadImageButton onUpload={setImagesUploaded} />
          <div>
            <Button
              className="h-10 w-24"
              disabled={invalidTweet}
              onClick={handleCreateTweet}
            >
              {isLoading ? <LoadingSpinner size={6} /> : "Tweet"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
