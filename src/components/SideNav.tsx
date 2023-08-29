import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  VscSearch,
  VscAccount,
  VscHome,
  VscSignIn,
  VscSignOut,
} from "react-icons/vsc";

import { IconHoverEffect } from "./IconHoverEffect";
import { useState } from "react";
import FullTextSearchInput from "./FullTextSearchInut";

export function SideNav() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky top-0 px-8 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <FullTextSearchInput openModal={openModal} />
          <IconHoverEffect>
            <span className="flex items-center gap-4">
              <VscSearch className="h-6 w-6" />
              <button
                className="hidden text-lg md:inline"
                onClick={() => setOpenModal(!openModal)}
              >
                Search
              </button>
            </span>
          </IconHoverEffect>
        </li>
        <li>
          <Link href="/">
            <IconHoverEffect>
              <span className="flex items-center gap-4">
                <VscHome className="h-6 w-6" />
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        {user != null && (
          <li>
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscAccount className="h-6 w-6" />
                  <span className="hidden text-lg md:inline">Profile</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>
        )}
        {user == null ? (
          <li>
            <button onClick={() => void signIn()}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignIn className="h-8 w-8 fill-green-700" />
                  <span className="hidden text-lg text-green-700 md:inline">
                    Log In
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        ) : (
          <li>
            <button onClick={() => void signOut()}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignOut className="h-6 w-6 fill-red-700" />
                  <span className="hidden text-lg text-red-700 md:inline">
                    Log Out
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
