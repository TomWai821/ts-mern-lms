import { Request, Response } from "express"
import { ContactConfig, ContactType } from "../config/contactConfig";
import { validateContact } from "../middleware/Contact/ContactHelper";

import { ContactEvent, broadcast } from '../ws';

interface ContactEventMap 
{
    create: ContactEvent;
    update: ContactEvent;
    delete: ContactEvent;
}

const ContactEventMap: Record<ContactType, ContactEventMap> = 
{
    Author: 
    {
        create: ContactEvent.AUTHOR_CREATE,
        update: ContactEvent.AUTHOR_UPDATE,
        delete: ContactEvent.AUTHOR_DELETE
    },
    Publisher: 
    {
        create: ContactEvent.PUBLISHER_CREATE,
        update: ContactEvent.PUBLISHER_UPDATE,
        delete: ContactEvent.PUBLISHER_DELETE
    }
};


export const GetContactRecord = async (req: Request, res: Response) => 
{
    const type = req.params.type as ContactType;
    const config = ContactConfig[type];

    if (!config)
    {
        return res.status(400).json({ success: false, error: "Invalid Type" });
    }

    try 
    {
        const nameKey = config.field;
        const searchValue = req.query[nameKey] as string;

        let query = {};
        
        if (searchValue) 
        {
            query = { [nameKey]: { $regex: searchValue, $options: "i" } };
        }
        
        const getData = await config.get(query);

        if (!getData)  
        {
            return res.status(400).json({ success: false, error: "Failed to fetch data" });
        }

        return res.json({ success: true, foundContact: getData });
    } 
    catch (error) 
    {
        console.error("Get Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const CreateContactRecord = async (req: Request, res: Response) => 
{
    const { author, publisher, email, phoneNumber } = req.body;
    const type = req.params.type as ContactType;
    const config = ContactConfig[type];

    if (!config) 
    {
        return res.status(400).json({ success: false, error: "Invalid Type" });
    }

    try 
    {
        const nameKey = config.field;
        const checkName = type === "Author" ? author : publisher;

        const optionData = { name: checkName, email };
        await validateContact(config, type, optionData);

        const finalData: any = { email, phoneNumber, [nameKey]: checkName };

        const record = await config.create(finalData);

        if (!record) 
        {
            return res.status(400).json({ success: false, error: `Failed to create ${type}` });
        }

        broadcast(ContactEventMap[type].create, record);
        return res.json({ success: true, message: `Created ${type} successfully!` });
    } 
    catch (error: any) 
    {
        console.error("Create Error:", error);
        return res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
    }
};


export const UpdateContactRecord = async (req: Request, res: Response) => 
{
    const { id, author, publisher, email, phoneNumber } = req.body;
    const type = req.params.type as ContactType;
    const config = ContactConfig[type];

    if (!config) 
    {
        return res.status(400).json({ success: false, error: "Invalid Type" });
    }

    try 
    {
        const nameKey = config.field;
        const newName = type === "Author" ? author : publisher;

        // Validate the updated data (Including checking for duplicates if the name is being changed)
        const optionData = { id, name: newName, email };
        await validateContact(config, type, optionData);

        // Built updated data object dynamically (Based on provided fields)
        const finalData: any = { email, phoneNumber, [nameKey]: newName };

        const record = await config.update(id, finalData);

        if (!record) 
        {
            return res.status(404).json({ success: false, error: "Record not found!" });
        }

        broadcast(ContactEventMap[type].update, record);
        return res.json({ success: true, message: `Updated ${type} successfully!`, data: record });
    } 
    catch (error: any) 
    {
        console.error("Update Error:", error);
        return res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
    }
};


export const DeleteContactRecord = async (req: Request, res: Response) => 
{
    const { id } = req.body;
    const contactType = req.params.type as ContactType;
    const config = ContactConfig[contactType];

    if (!config)
    {
        return res.status(400).json({ success: false, error: "Invalid Type" });
    }

    try 
    {
        const deleteData = await config.delete(id);
        
        if (!deleteData) 
        {
            return res.status(400).json({ success: false, error: `Failed to delete ${contactType} data` });
        }

        broadcast(ContactEventMap[contactType].delete, id);
        return res.json({ success: true, message: `Delete ${contactType} Data successfully!` });
    } 
    catch (error) 
    {
        console.error(`Delete Error: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
