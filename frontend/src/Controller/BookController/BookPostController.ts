const contentType = "application/json";
const localhost = process.env.REACT_APP_API_URL;
const url:string = `${localhost}/book`;

export const createBookRecord = async (authToken:string, image:File, bookname:string, genreID:string, languageID:string, publisherID:string, authorID:string, description:string, publishDate:string) => 
{
    const formData = createFormData(image, bookname, genreID, languageID, publisherID, authorID, description, publishDate);
    
    const response = await fetch(`${url}/bookData`,
        {
            method: 'POST',
            headers: { 'authToken': authToken },
            body: formData
        }
    );

    return response;
}

export const createLoanBookRecord = async (authToken:string, bookID:string, loanDate:Date, dueDate:Date, userID?:string) => 
{
    const loanBookBody:Record<string, any> =
    {
        ...(bookID && {bookID}),
        ...(userID && {userID}),
        ...(loanDate && {loanDate}),
        ...(dueDate && {dueDate})
    }

    const response = await fetch(`${url}/LoanBook`,
        {
            method: 'POST',
            headers: { 'Content-Type': contentType, 'authToken': authToken },
            body: JSON.stringify(loanBookBody)
        }
    );
    
    return response;
}

export const createFavouriteBookRecord = async (authToken:string, bookID:string) => 
{
    
    const response = await fetch(`${url}/FavouriteBook`,
        {
            method: 'POST',
            headers: { 'Content-Type': contentType, 'authToken': authToken },
            body: JSON.stringify({bookID})
        }
    );
    
    return response
}

const createFormData = (image:File, bookname:string, genreID:string, languageID:string, publisherID:string, authorID:string, description:string, publishDate:string) => 
{
    const formData = new FormData();
    formData.append('image', image);
    formData.append('bookname', bookname);
    formData.append('genreID', genreID);
    formData.append('languageID', languageID);
    formData.append('publisherID', publisherID);
    formData.append('authorID', authorID);
    formData.append('description', description);
    formData.append('publishDate', publishDate);

    return formData;
}