import { BookWSEventToAction } from "./Book/AllBookWSConfig";
import { LoanBooKWSEventToAction } from "./Book/LoanBookWSConfig";
import { AuthorWSEventToAction } from "./Contact/AuthorWSConfig";
import { PublisherWSEventToAction } from "./Contact/PublisherWSConfig";

import { GenreWSEventToAction } from "./Definition/GenreWSConfig";
import { LanguageWSEventToAction } from "./Definition/LanguageWSConfig";

import { SuspendUserWSEventToAction } from "./User/SuspendWSConfig";
import { UserWSEventToAction } from "./User/UserWSConfig";

export const DefinitionwsEventToActionMap = 
{
    ...GenreWSEventToAction,
    ...LanguageWSEventToAction
};

export const ContactwsEventToActionMap = 
{
    ...AuthorWSEventToAction,
    ...PublisherWSEventToAction
};

export const UserRecordwsEventToActionMap = 
{
    ...UserWSEventToAction,
    ...SuspendUserWSEventToAction
}

export const BookRecordwsEventToActionMap = 
{
    ...BookWSEventToAction,
    ...LoanBooKWSEventToAction
}