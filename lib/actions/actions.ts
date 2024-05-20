"use server";

import { createMindeeClient } from "@/utils/mindee/client";
import { createClient } from "@/utils/supabase/server";
import * as mindee from "mindee";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return JSON.stringify({ data: null, error: error });
  }

  revalidatePath("/", "layout");
  redirect("/for-approval");
}

export async function signUp(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return JSON.stringify({ data: null, error: error });
  }

  revalidatePath("/", "layout");
  redirect("/for-approval");
}

export async function mindeeScan(fileUrl: string) {
  const mindeeClient = createMindeeClient();

  const inputSource = await mindeeClient.docFromUrl(fileUrl);
  const respPromise = await mindeeClient.parse(
    mindee.product.InvoiceV4,
    inputSource,
  );

  console.log(respPromise.document.inference.prediction);
  return JSON.stringify(respPromise);
}
