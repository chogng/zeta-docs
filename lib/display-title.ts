import type { ZetaDoc } from "@/lib/types";

export function displayTitle(doc: Pick<ZetaDoc, "slug" | "title">) {
  return doc.title;
}
