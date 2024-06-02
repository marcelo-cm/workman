"use server";

import { createMindeeClient } from "@/utils/mindee/client";
import * as mindee from "mindee";

import { createClient } from "@/utils/supabase/server";
import { Nango } from "@nangohq/node";

const supabase = createClient();
const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function mindeeScan(fileUrl: string) {
  const mindeeClient = createMindeeClient();

  const inputSource = await mindeeClient.docFromUrl(fileUrl);
  const respPromise = await mindeeClient.parse(
    mindee.product.InvoiceV4,
    inputSource,
  );

  return JSON.stringify(respPromise);
}

export async function getGoogleMailToken() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("User not found");
  }

  const token = await nango.getToken("google-mail", data.user?.id);

  return token;
}

export async function getQuickBooksToken() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("User not found");
  }
  const token = await nango.getToken("quickbooks", data.user.id);

  return token;
}
