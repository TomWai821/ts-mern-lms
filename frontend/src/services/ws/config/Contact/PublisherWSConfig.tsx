import { PublisherAction } from "../../../../Reducer/Contact/PublisherReducer";

export enum PublisherEvent 
{
    PUBLISHER_CREATE = "publisher_create",
    PUBLISHER_UPDATE = "publisher_update",
    PUBLISHER_DELETE = "publisher_delete",
}

export const PublisherWSEventToAction: Record<PublisherEvent, PublisherAction["type"]> = 
{
    [PublisherEvent.PUBLISHER_CREATE]: "CREATE_PUBLISHER",
    [PublisherEvent.PUBLISHER_UPDATE]: "UPDATE_PUBLISHER",
    [PublisherEvent.PUBLISHER_DELETE]: "DELETE_PUBLISHER"
};