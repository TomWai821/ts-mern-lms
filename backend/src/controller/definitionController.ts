import { Request, Response } from "express"
import { CreateGenre, FindGenreByIDAndDelete, FindGenreByIDAndUpdate, GetGenre } from "../schema/book/genre";
import { CreateLanguage, FindLanguageByIDAndDelete, FindLanguageByIDAndUpdate, GetLanguage } from "../schema/book/language";

export const GetDefinition = async (req: Request, res: Response) => 
{
    const definitionType = req.params.type as keyof typeof definitionHandlers;
    const {name} = req.query;
    let success = false;
    let getData;

    try 
    {
        if(!name)
        {
            getData = await definitionHandlers[definitionType].getAll();
        }
        else
        {
            switch(definitionType)
            {
                case "Genre":
                    getData = await GetGenre({ "genre": { $regex: name, $options: "i" } });
                    break;

                case "Language":
                    getData = await GetLanguage({ "language": { $regex: name, $options: "i" } });
                    break;
            }
        }

        if (!getData) 
        {
            return res.status(400).json({ success, error: `Failed to get ${definitionType} data` });
        }
        

        success = true;
        return res.json({ success, foundDefinition: getData });
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success, error: "Internal Server Error" });
    }
};

export const CreateDefinitionData = async (req: Request, res: Response) => 
{
    const definitionType = req.params.type as keyof typeof definitionHandlers;
    const { genre, language, shortName } = req.body;
    let success = false;
   
    try 
    {
        const createData = await definitionHandlers[definitionType].create({ genre, language, shortName });

        if (!createData) 
        {
            return res.status(400).json({ success, error: `Failed to create ${definitionType}` });
        }

        success = true;
        return res.json({ success, message: `Create ${definitionType} successfully!` });
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success, error: "Internal Server Error" });
    }
};

export const EditDefinitionData = async (req: Request, res: Response) => 
{
    const definitionType = req.params.type as keyof typeof definitionHandlers;
    const { id, genre, language, shortName } = req.body;
    let success = false;
    let editData:any;

    try 
    {
        switch(definitionType)
        {
            case "Genre":
                editData = await FindGenreByIDAndUpdate(id, {genre, shortName});
                break;

            case "Language":
                editData = await FindLanguageByIDAndUpdate(id, {language, shortName});
                break;
        }

        if (!editData) 
        {
            return res.status(400).json({ success, error: `Failed to Edit ${definitionType} data!` });
        }

        success = true;
        return res.json({ success, message: `Update ${definitionType} data successfully!` });
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success, error: "Internal Server Error" });
    }
};
    
export const DeleteDefinitionData = async (req: Request, res: Response) => 
{
    const definitionType = req.params.type as keyof typeof definitionHandlers;
    const { id } = req.body;
    let success = false;

    try 
    {
        const deleteData = await definitionHandlers[definitionType].delete(id);

        if (!deleteData) 
        {
            return res.status(400).json({ success, error: `Failed to Delete ${definitionType} data!` });
        }

        success = true;
        return res.json({ success, message: `Delete ${definitionType} data successfully!` });
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success, error: "Internal Server Error" });
    }
};

export const definitionHandlers = 
{
    Genre:
    {
        getAll:GetGenre,
        create:CreateGenre,
        delete:FindGenreByIDAndDelete
    },
    Language:
    {
        getAll:GetLanguage,
        create:CreateLanguage,
        delete:FindLanguageByIDAndDelete
    }
}