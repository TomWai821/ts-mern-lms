import mongoose from "mongoose";
import { CreateUserInterface } from "./requestInterface";

export interface IDInterface
{
    _id: mongoose.Schema.Types.ObjectId;
}

export interface UserInterface extends IDInterface, CreateUserInterface
{
    email: string;
    password: string;
}

export interface RoleInterface extends IDInterface
{
    role:string;
}

export interface GenderInterface extends IDInterface
{
    gender:string;
}

export interface StatusInterface extends IDInterface
{
    status:string;
    description:string;
}

export interface SuspendListInterface extends IDInterface
{
    userID: mongoose.Schema.Types.ObjectId;
    startDate: Date;
    dueDate: Date;
    unSuspendDate: Date | null;
    description: string;
    status:string;
}