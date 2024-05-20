"use server";

import { createMindeeClient } from "@/utils/mindee/client";
import * as mindee from "mindee";

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
