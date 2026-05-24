import { Request, Response, NextFunction } from "express";
import { DefinitionConfig, DefinitionType } from "../../config/definitionConfig";

export const DefinitionTypeValidation = async (req: Request, res: Response, next: NextFunction) => 
{
    const definitionType = req.params.type;

    const isValid = DefinitionConfig[definitionType as DefinitionType];

    if (!isValid) 
    {
        return res.status(404).json({  success: false,  error: "Invalid definition type: " + definitionType });
    }

    next();
};

export const DefinitionDataValidation = async (req: Request, res: Response, next: NextFunction) => 
{
    const definitionType = req.params.type as DefinitionType;
    const { language, genre } = req.body;

    if (definitionType === "Genre" && language) 
    {
        return res.status(400).json({ success: false, error: "Invalid field: Genre record cannot contain a 'language' field" });
    }

    if (definitionType === "Language" && genre) 
    {
        return res.status(400).json({ success: false, error: "Invalid field: Language record cannot contain a 'genre' field" });
    }

    next();
};
