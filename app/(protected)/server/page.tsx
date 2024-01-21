import { UserInfo } from "@/components/UserInfo";
import { getCurrentUser } from "@/lib/auth";
import React from "react";

async function ServerPage() {
  const user = await getCurrentUser();

  return <UserInfo user={user} label="Server Page" />;
}

export default ServerPage;
