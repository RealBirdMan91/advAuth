"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  return (
    <span onClick={() => signOut()} className="cursor-pointer">
      {children}
    </span>
  );
};
