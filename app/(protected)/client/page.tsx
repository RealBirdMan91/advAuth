"use client";
import { UserInfo } from "@/components/UserInfo";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getCurrentUser } from "@/lib/auth";
import React from "react";

function ClientPage() {
  const user = useCurrentUser();

  return <UserInfo user={user} label="Client Page" />;
}

export default ClientPage;
