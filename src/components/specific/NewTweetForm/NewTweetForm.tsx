import { useSession } from "next-auth/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useCreateTweet } from "./hooks/useCreateTweet";
import { ProfileImage } from "../../common/icons/ProfileImage";
import { Button } from "../../common/buttons/Button";
import { useLocation } from "./hooks/useLocation";
import { LoadingSpinner } from "~/components/common/icons/LoadingSpinner";
import { notifyError } from "~/components/common/toasts/toast";
import { UploadImageButton } from "./components/UploadButton";
import { type UploadFileResponse } from "uploadthing/client";
import Image from "next/image";

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
  const [inputValue, setInputValue] = useState<string>("");
  const [imagesUploaded, setImagesUploaded] = useState<UploadFileResponse[]>(
    []
  );
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const { handleCreateTweet, isLoading, error } = useCreateTweet({
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

  const invalidTweet = inputValue.length === 0 || inputValue.length > 280;

  if (session.status !== "authenticated") return null;

  if (error) {
    notifyError({ message: error });
    return null;
  }

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
          className="flex-grow resize-none overflow-hidden border-0 border-transparent p-4 text-lg focus:ring-0"
          placeholder="What's happening?"
        />
      </div>
      <div className="ml-16 flex flex-row flex-wrap gap-4 px-4">
        {imagesUploaded.map((image) => (
          <Image
            key={image.key}
            src={image.url}
            width={250}
            height={250}
            alt="Imported image"
          />
        ))}
      </div>
      <div className="flex gap-2 self-end">
        <UploadImageButton onUpload={setImagesUploaded} />
        <Button
          className="h-10 w-24"
          disabled={invalidTweet || !imagesUploaded}
          onClick={handleCreateTweet}
        >
          {isLoading ? <LoadingSpinner size={6} /> : "Tweet"}
        </Button>
      </div>
    </div>
  );
}
