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

        if (Array.isArray(duplicate) ? duplicate.length > 0 : !!duplicate) 
        {
            throw new Error(`${type} "${options.name}" already exists!`);
        }
    }

    // validate email
    if (options.email && options.email.trim() !== "N/A")
    {
        const duplicateEmail = await config.find({email: options.email, ...(options.id ? { _id: { $ne: options.id } } : {}) });

        if (Array.isArray(duplicateEmail) ? duplicateEmail.length > 0 : !!duplicateEmail) 
        {
            throw new Error(`${type} email "${options.email}" is already exists!`);
        }
    }
};
