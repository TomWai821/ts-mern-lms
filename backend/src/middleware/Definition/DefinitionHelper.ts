interface DefinitionValidationOptions 
{
    id?: string;
    name?: string;
    shortName?: string;
}

export const validateDefinition = async (config: any, type: string, options: DefinitionValidationOptions) => 
{
    const nameKey = config.field;

    // validate name
    if (options.name) 
    {
        console.log(nameKey);
        console.log(options.name);
        console.log(options.id);
        const duplicate = await config.find({ [nameKey]: options.name, ...(options.id ? { _id: { $ne: options.id } } : {}) });

        if (Array.isArray(duplicate) ? duplicate.length > 0 : !!duplicate) 
        {
            throw new Error(`${type} "${options.name}" already exists!`);
        }
    }

    // validate shortname
    if (options.shortName && options.shortName.trim() !== "N/A") 
    {
        const duplicateShortname = await config.find({ shortName: options.shortName, ...(options.id ? { _id: { $ne: options.id } } : {}) });

        if (Array.isArray(duplicateShortname) ? duplicateShortname.length > 0 : !!duplicateShortname) 
        {
            throw new Error(`${type} "${options.name}" is already taken!`);
        }
    }
};
