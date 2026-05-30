/*
import { GenericRepository } from "./GenericRepository";
import { User } from "../schema/user/user";
import { SuspendUser } from "../schema/user/suspendList";
import { Book } from "../schema/book/book";
import { LoanedBook } from "../schema/book/bookLoaned";
import { Favourite } from "../schema/book/bookFavourite";
import { Author } from "../schema/contact/author";
import { Publisher } from "../schema/contact/publisher";
import { Genre } from "../schema/definition/genre";
import { Language } from "../schema/definition/language";

type RepositoryType = "User" | "SuspendUser" | "Book" | "LoanedBook" | "FavouriteBook" | "Author" | "Publisher" | "Genre" | "Language";

const RepositoryMap: Record<RepositoryType, GenericRepository<any>> = 
{
    "User": new GenericRepository(User),
    "SuspendUser": new GenericRepository(SuspendUser),
    "Book": new GenericRepository(Book),
    "LoanedBook": new GenericRepository(LoanedBook),
    "FavouriteBook": new GenericRepository(Favourite),
    "Author": new GenericRepository(Author),
    "Publisher": new GenericRepository(Publisher),
    "Genre": new GenericRepository(Genre),
    "Language": new GenericRepository(Language)
};

export const getRepository = <T>(type: RepositoryType): GenericRepository<T> =>
{
    const repository = RepositoryMap[type];
    return repository as GenericRepository<T>;
}
*/