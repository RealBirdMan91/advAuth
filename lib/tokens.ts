import { nanoid } from "nanoid";
import { getVerificationTokenByEmail } from "@/data/verifivationToken";
import { db } from "./db";

export async function generateVerificationToken(email: string) {
  const token = nanoid(32);
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  const verificationToken = await getVerificationTokenByEmail(email);

  if (verificationToken) {
    await db.verificationToken.delete({ where: { email } });
  }
  await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}
