import { Popover } from "@headlessui/react";
import { type Dispatch, type SetStateAction } from "react";
import { IconHoverEffect } from "../icons/IconHoverEffect";
import { IoLocationSharp } from "react-icons/io5";

type LocationPopoverProps = {
  address: {
    road: string | null;
    town: string | null;
    country: string | null;
  };
  popoverOpenLoc: boolean;
  setPopoverOpenLoc: Dispatch<SetStateAction<boolean>>;
  first?: boolean;
};

export const LocationPopover = ({
  address,
  popoverOpenLoc,
  setPopoverOpenLoc,
  first = false,
}: LocationPopoverProps) => {
  return (
    <Popover className="relative inline-block text-left">
      <IconHoverEffect color="blue" className="relative right-2">
        <IoLocationSharp
          className="h-5 w-5 cursor-pointer fill-blue-400"
          onMouseEnter={() => setPopoverOpenLoc(true)}
          onMouseLeave={() => setPopoverOpenLoc(false)}
        />
      </IconHoverEffect>
      {popoverOpenLoc && (
        <Popover.Panel
          static
          className={`absolute ${
            !first ? "bottom-full" : ""
          } z-20 mb-2 w-44 rounded-md bg-white/80 shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-md focus:outline-none`}
        >
          {address.road && (
            <div className="block px-4 py-2 text-sm text-gray-700">
              {address.road}
            </div>
          )}
          {address.town && (
            <div className="block px-4 py-2 text-sm text-gray-700">
              {address.town}
            </div>
          )}
          {address.country && (
            <div className="block px-4 py-2 text-sm text-gray-700">
              {address.country}
            </div>
          )}
        </Popover.Panel>
      )}
    </Popover>
  );
};
