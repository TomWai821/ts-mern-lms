import { LanguageAction } from "../../../../Reducer/Definition/LanguageReducer";

export type LanguageEvent = "language_create" | "language_update" | "language_delete";

export const LanguageWSEventToAction: Record<LanguageEvent, LanguageAction["type"]> = 
{
    language_create: "CREATE_LANGUAGE",
    language_update: "UPDATE_LANGUAGE",
    language_delete: "DELETE_LANGUAGE"
};