import { Popover } from "@headlessui/react";
import { type Dispatch, type SetStateAction } from "react";
import dayjs from "dayjs";

type DatePopoverProps = {
  tweetDate: string;
  createdAt: Date;
  popoverOpenDate: boolean;
  setPopoverOpenDate: Dispatch<SetStateAction<boolean>>;
  first?: boolean;
};

export const DatePopover = ({
  tweetDate,
  createdAt,
  popoverOpenDate,
  setPopoverOpenDate,
  first = false,
}: DatePopoverProps) => {
  return (
    <Popover className="relative inline-block text-left">
      <span
        className="h-5 w-5 cursor-pointer fill-blue-400 hover:underline focus-visible:underline"
        onMouseEnter={() => setPopoverOpenDate(true)}
        onMouseLeave={() => setPopoverOpenDate(false)}
      >
        {tweetDate}
      </span>
      {popoverOpenDate && (
        <Popover.Panel
          static
          className={`absolute ${
            !first ? "bottom-full" : ""
          } z-20 mb-2 w-52 rounded-md bg-white/80 px-3 py-2 text-xs text-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-md focus:outline-none`}
        >
          {dayjs(createdAt).format("h:mm A - MMMM D, YYYY")}
        </Popover.Panel>
      )}
    </Popover>
  );
};
