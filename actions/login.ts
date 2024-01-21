"use server";

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation";
import {
  getTwoFactorTokenByEmail,
  getTwoFactorTokenByToken,
} from "@/data/twoFactorToken";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema, TLoginSchema } from "@/schemas";
import { AuthError } from "next-auth";

export const login = async (values: TLoginSchema) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    if (!verificationToken) return { error: "Something went wrong!" };
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken?.token
    );

    return { success: "Email send" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (!code) {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }

    const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
    if (!twoFactorToken) return { error: "invalid code" };

    if (twoFactorToken.token !== code) return { error: "invalid code" };

    const hasExpired = new Date(twoFactorToken.expires) < new Date();
    if (hasExpired) return { error: "expired code" };

    await db.twoFactorToken.delete({
      where: { id: twoFactorToken.id },
    });

    const existingConfirmation = await getTwoFactorConfirmationByUserId(
      existingUser.id
    );

    if (existingConfirmation) {
      await db.twoFactorConfirmation.delete({
        where: { id: existingConfirmation.id },
      });
    }

    await db.twoFactorConfirmation.create({
      data: {
        userId: existingUser.id,
      },
    });
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw err;
  }
};
