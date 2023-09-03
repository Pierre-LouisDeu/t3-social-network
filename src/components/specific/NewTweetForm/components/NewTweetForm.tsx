import { useSession } from "next-auth/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useCreateTweet } from "../hooks/useCreateTweet";
import { ProfileImage } from "../../../common/icons/ProfileImage";
import { Button } from "../../../common/buttons/Button";
import { useLocation } from "../hooks/useLocation";

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
  const [inputValue, setInputValue] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);
  const session = useSession();
  const { address } = useLocation();
  const { handleCreateTweet } = useCreateTweet({
    address,
    inputValue,
    setInputValue,
  });

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const validTweet = inputValue.length === 0 || inputValue.length > 280;

  if (session.status !== "authenticated") return null;

  return (
    <form
      onSubmit={handleCreateTweet}
      className="flex flex-col gap-2 border-y px-4 py-2"
    >
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
      <Button className="self-end" disabled={validTweet}>
        Tweet
      </Button>
    </form>
  );
}
