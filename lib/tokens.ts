import { nanoid } from "nanoid";
import { getVerificationTokenByEmail } from "@/data/verificationToken";
import { db } from "./db";

export const generateVerificationToken = async (email: string) => {
  const token = nanoid(32);
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verficationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verficationToken;
};
