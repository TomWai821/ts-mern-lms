import { PublisherAction } from "../../../../Reducer/Contact/PublisherReducer";

export type PublisherEvent = "publisher_create" | "publisher_update" | "publisher_delete";

export const PublisherWSEventToAction: Record<PublisherEvent, PublisherAction["type"]> = 
{
    publisher_create: "CREATE_PUBLISHER",
    publisher_update: "UPDATE_PUBLISHER",
    publisher_delete: "DELETE_PUBLISHER"
};