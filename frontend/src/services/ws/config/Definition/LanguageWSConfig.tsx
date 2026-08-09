import { LanguageAction } from "../../../../Reducer/Definition/LanguageReducer";

enum LanguageEvent 
{
    LANGUAGE_CREATE = "language_create",
    LANGUAGE_UPDATE = "language_update",
    LANGUAGE_DELETE = "language_delete"
}

export const LanguageWSEventToAction: Record<LanguageEvent, LanguageAction["type"]> = 
{
    [LanguageEvent.LANGUAGE_CREATE]: "CREATE_LANGUAGE",
    [LanguageEvent.LANGUAGE_UPDATE]: "UPDATE_LANGUAGE",
    [LanguageEvent.LANGUAGE_DELETE]: "DELETE_LANGUAGE"
};