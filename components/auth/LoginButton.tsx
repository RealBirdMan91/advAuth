"use client";

import React from "react";
import { useRouter } from "next/navigation";

type LoginButtonProps = {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
};

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return <div>Todo Modal</div>;
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;