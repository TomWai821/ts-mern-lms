interface ContactValidationOptions 
{
    id?: string;
    name?: string;
    email?: string;
}

export const validateContact = async (config: any, type: string, options: ContactValidationOptions) => 
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

    // validate email
    if (options.email) 
    {
        const duplicateEmail = await config.find({email: options.email, ...(options.id ? { _id: { $ne: options.id } } : {}) });

        if (duplicateEmail) 
        {
            throw new Error(`${type} email "${options.email}" is already taken!`);
        }
    }
};
