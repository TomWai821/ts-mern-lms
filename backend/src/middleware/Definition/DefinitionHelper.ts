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
        const duplicate = await config.find({ [nameKey]: options.name, ...(options.id ? { _id: { $ne: options.id } } : {}) });

        if (duplicate) 
        {
            throw new Error(`${type} "${options.name}" already exists!`);
        }
    }

    // validate shortname
    if (options.shortName) 
    {
        const duplicateShortname = await config.find({ shortname: options.shortName, ...(options.id ? { _id: { $ne: options.id } } : {}) });

        if (duplicateShortname) 
        {
            throw new Error(`Shortname "${options.shortName}" is already taken!`);
        }
    }
};
