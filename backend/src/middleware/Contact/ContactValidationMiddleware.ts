import { Request, Response, NextFunction } from "express";
import { ContactConfig, ContactType } from "../../config/contactConfig";

export const ContactTypeValidation = async (req: Request, res: Response, next: NextFunction) => 
{
    const contactType = req.params.type;

    const isValid = ContactConfig[contactType as ContactType];

    if (!isValid) return res.status(404).json({  success: false,  error: "Invalid contact type: " + contactType });

    next();
};

export const ContactDataValidation = async (req: Request, res: Response, next: NextFunction) => 
{
    const contactType = req.params.type as ContactType;
    const { author, publisher } = req.body;

    if (contactType === "Author" && publisher) 
    {
        return res.status(400).json({ success: false, error: "Invalid field: Authors cannot have a 'publisher' field" });
    }

    if (contactType === "Publisher" && author) 
    {
        return res.status(400).json({  success: false, error: "Invalid field: Publishers cannot have an 'author' field" });
    }

    next();
};

export const ContactQueryValidation = async (req: Request, res: Response, next: NextFunction) => 
{
    const contactType = req.params.type as ContactType;
    const { author, publisher } = req.query;

    try 
    {
        if (contactType === "Author" && publisher) 
        {
            return res.status(400).json({ success: false,  error: "Invalid query: You cannot search for 'publisher' when the type is Author" });
        }

        if (contactType === "Publisher" && author) 
        {
            return res.status(400).json({ success: false,  error: "Invalid query: You cannot search for 'author' when the type is Publisher"  });
        }

        next();
    } 
    catch (error) 
    {
        console.error("Query Validation Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
