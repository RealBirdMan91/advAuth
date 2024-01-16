import React from "react";
import { auth } from "@/auth";

async function SettingsPage() {
  const session = await auth();
  return <h1 className="2-xl">{JSON.stringify(session)}</h1>;
}

export default SettingsPage;
