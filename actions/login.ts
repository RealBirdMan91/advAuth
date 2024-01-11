"use server";

import { LoginSchema, TLoginSchema } from "@/schemas";

export const login = async (values: TLoginSchema) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  return { success: "Email send" };
};
