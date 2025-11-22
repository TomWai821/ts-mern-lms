import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import { AuthRequest } from '../model/requestInterface';

dotenv.config({ debug: false });
const JWT_SECRET:string = process.env.JWT_SECRET as string;

export const bcryptHash = async(password:string) => 
{
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export const comparePassword = async(inputPassword:string, comparePassword:string) =>
{
    return bcrypt.compare(inputPassword, comparePassword);
}

export const jwtSign = async(UserID:Record<string, any>) => 
{
    return jwt.sign(UserID, JWT_SECRET);
}

export const jwtVerify = async(token:string) =>
{
    return jwt.verify(token, JWT_SECRET) as AuthRequest;
}