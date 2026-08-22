const contentType = "application/json";
const localhost = process.env.REACT_APP_BACKEND_BASE_URL;
const url:string = `${localhost}/api/book`;

export interface IBookCreationData
{
    image?: File | null;
    bookname: string;
    genreID: string;
    languageID: string;
    publisherID: string;
    authorID: string;
    description: string;
    publishDate: string;
}

export const createBookRecord = async (authToken: string, bookCreationData: IBookCreationData) => 
{
    const formData = createFormData(bookCreationData);
    
    const response = await fetch(`${url}/record`,
        {
            method: 'POST',
            headers: { 'authToken': authToken },
            body: formData
        }
    );

    return response;
}

const createFormData = (bookCreationData: IBookCreationData) => 
{
    const formData = new FormData();

    if(bookCreationData.image)
    {
        formData.append('image', bookCreationData?.image);
    }

    formData.append('bookname', bookCreationData.bookname);
    formData.append('genreID', bookCreationData.genreID);
    formData.append('languageID', bookCreationData.languageID);
    formData.append('publisherID', bookCreationData.publisherID);
    formData.append('authorID', bookCreationData.authorID);
    formData.append('description', bookCreationData.description);
    formData.append('publishDate', bookCreationData.publishDate);

    return formData;
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

    const response = await fetch(`${url}/loanRecord`,
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
    
    const response = await fetch(`${url}/favourite`,
        {
            method: 'POST',
            headers: { 'Content-Type': contentType, 'authToken': authToken },
            body: JSON.stringify({bookID})
        }
    );
    
    return response
}