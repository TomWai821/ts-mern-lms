import { Request, Response } from 'express'
import { AuthRequest } from '../model/requestInterface';
import { CreateAuthor, FindAuthorByIDAndDelete, FindAuthorByIDAndUpdate, GetAuthor } from '../schema/book/author';
import { CreatePublisher, FindPublisherByIDAndDelete, FindPublisherByIDAndUpdate, GetPublisher } from '../schema/book/publisher';

export const GetContactRecord = async (req: AuthRequest, res: Response) => 
{
    const contactType = req.params.type as keyof typeof contactHandler;
    const { author, publisher } = req.query;
    let success = false;

    try 
    {
        let getData: any;

        switch(contactType)
        {
            case "Author":
                getData = author ? await GetAuthor({"author": { $regex: author, $options: "i" }}) : await GetAuthor();
                break;

            case "Publisher":
                getData = publisher ? await GetPublisher({"publisher": { $regex: publisher, $options: "i" }}) : await GetPublisher();
                break;
        }

        if (!getData) 
        {
            return res.status(400).json({ success, error: `Failed to get ${contactType} data` });
        }

        success = true;
        return res.json({ success, foundContact: getData });
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success, error: "Internal Server Error" });
    }
};

export const CreateContactRecord = async (req: AuthRequest, res: Response) => 
{
    const contactType = req.params.type as keyof typeof contactHandler;

    switch(contactType)
    {
        case "Author":
            CreateAuthorRecord(req, res);
            break;

        case "Publisher":
            CreatePublisherRecord(req, res);
            break;
    }

    res.json({ success: true, message: `Create ${contactType} successfully!` });
}

const CreateAuthorRecord = async (req: AuthRequest, res: Response) => 
{
    const { author, phoneNumber, email } = req.body;
    const contactType = req.params.type as keyof typeof contactHandler;

    try 
    {
        const createAuthor = await CreateAuthor({author: author, phoneNumber: phoneNumber, email: email});

        if(!createAuthor)
        {
            return res.status(400).json({ success: false, error: `Failed to create ${contactType}` });
        }
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

const CreatePublisherRecord = async (req: AuthRequest, res: Response) => 
{
    const { publisher, phoneNumber, email } = req.body;
    const contactType = req.params.type as keyof typeof contactHandler;

    try 
    {
        const createPublisher = await CreatePublisher({publisher: publisher, phoneNumber: phoneNumber, email: email});

        if(!createPublisher)
        {
            return res.status(400).json({ success: false, error: `Failed to create ${contactType}` });
        }
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

export const UpdateContactRecord = async (req: AuthRequest, res: Response) => 
{
    const contactType = req.params.type as keyof typeof contactHandler;

    switch(contactType)
    {
        case "Author":
            UpdateAuthorRecord(req, res);
            break;

        case "Publisher":
            UpdatePublisherRecord(req, res);
            break;
    }

    res.json({ success: true, message: `Create ${contactType} successfully!` });
}

const UpdateAuthorRecord = async (req: AuthRequest, res: Response) => 
{
    const { id, author, phoneNumber, email } = req.body;

    try 
    {
        console.log({author: author, phoneNumber: phoneNumber, email: email});
        const updateAuthor = await FindAuthorByIDAndUpdate(id, {author: author, phoneNumber: phoneNumber, email: email});

        if(!updateAuthor)
        {
            return res.status(400).json({ success: false, error: `Failed to update Author Record` });
        }
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

const UpdatePublisherRecord = async (req: AuthRequest, res: Response) => 
{
    const { id, publisher, phoneNumber, email } = req.body;

    try 
    {
        const updatePublisher = await FindPublisherByIDAndUpdate(id, {publisher: publisher, phoneNumber: phoneNumber, email: email});

        if(!updatePublisher)
        {
            return res.status(400).json({ success: false, error: `Failed to update Publisher Record` });
        }
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

export const DeleteContactRecord = async (req: Request, res: Response) => 
{
    const { id } = req.body;
    const contactType = req.params.type as keyof typeof contactHandler;
    let success = false;

    try 
    {
        const deleteData = await contactHandler[contactType].Delete(id);
        
        if (!deleteData) 
        {
            return res.status(400).json({ success, error: `Failed to get ${contactType} data` });
        }

        success = true;
        return res.json({ success, message: `Delete ${contactType} Data successfully!` });
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success, error: "Internal Server Error" });
    }
};
    

export const contactHandler = 
{
    Author:
    {
        Get:GetAuthor,
        Delete:FindAuthorByIDAndDelete
    },
    Publisher:
    {
        Get:GetPublisher,
        Delete:FindPublisherByIDAndDelete
    }

}