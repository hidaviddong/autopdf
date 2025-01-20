import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { AUTO_PDF_OPENAI_API_KEY } from "@/lib/utils";

export const apiKeyAtom = atomWithStorage(AUTO_PDF_OPENAI_API_KEY, "");
export const showApiKeyAlertAtom = atom((get) => !get(apiKeyAtom));

export const removeApiKeyAtom = atom(null, (get, set) => {
  set(apiKeyAtom, "");
});
