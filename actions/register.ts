"use server";

import { RegisterSchema, TRegisterSchema } from "@/schemas";

export const register = async (values: TRegisterSchema) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  return { success: "Email send" };
};
