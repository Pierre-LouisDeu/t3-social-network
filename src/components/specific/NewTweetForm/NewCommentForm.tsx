import { useSession } from "next-auth/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ProfileImage } from "../../common/icons/ProfileImage";
import { Button } from "../../common/buttons/Button";
import { LoadingSpinner } from "~/components/common/icons/LoadingSpinner";
import { notifyError } from "~/components/common/toasts/toast";
import { useCreateComment } from "./hooks/useCreateComment";

type NewCommentFormProps = {
  tweetId: string;
};

export function NewCommentForm({ tweetId }: NewCommentFormProps) {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  return <Form tweetId={tweetId} />;
}

function Form({ tweetId }: NewCommentFormProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);
  const session = useSession();
  const { handleCreateComment, isLoading, error } = useCreateComment({
    inputValue,
    tweetId,
    setInputValue,
  });

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const validTweet = inputValue.length === 0 || inputValue.length > 280;

  if (session.status !== "authenticated") return null;

  if (error) {
    notifyError({ message: error });
    return null;
  }

  return (
    <form
      onSubmit={handleCreateComment}
      className="flex flex-col gap-2 border-b px-4 py-2"
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
          placeholder="Add a comment..."
        />
      </div>
      <Button className="w-26 h-10 self-end" disabled={validTweet}>
        {isLoading ? <LoadingSpinner size={6} /> : "Comment"}
      </Button>
    </form>
  );
}

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return;
    textArea.style.height = "0";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }
  