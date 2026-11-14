const localhost = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const url:string = `${localhost}/api/book`;
const contentType:string = "application/json";

export interface IBookUpdateData
{
    imageName:string;
    newFile:File;
    bookname:string;
    genreID:string;
    languageID:string;
    publisherID:string;
    publishDate:string;
    authorID:string;
    description: string;
}

export const updateBookRecord = async (bookID: string, bookUpdateData: IBookUpdateData) => 
{
    const data = createFormData(bookUpdateData);

    const response = await fetch(`${url}/record/id=${bookID}`,
        {
            method: 'PUT',
            credentials:"include",
            body: data
        }
    );

    return response;
}

export const returnBookAndChangeStatus = async (loanBookRecord:string, finesPaid?:string) => 
{
    const response = await fetch(`${url}/loanRecord/id=${loanBookRecord}`,
        {
            method: 'PUT',
            credentials:"include",
            headers: { 'content-type': contentType },
            body: JSON.stringify({ finesPaid })
        }
    );
    
    return response;
}

const createFormData = (bookUpdateData: IBookUpdateData) => 
{
    const formData = new FormData();
    if(bookUpdateData.newFile)
    {
        formData.append('image', bookUpdateData.newFile);
    }
    
    formData.append('imageName', bookUpdateData.imageName);
    formData.append('bookname', bookUpdateData.bookname);
    formData.append('genreID', bookUpdateData.genreID);
    formData.append('languageID', bookUpdateData.languageID);
    formData.append('publisherID', bookUpdateData.publisherID);
    formData.append('authorID', bookUpdateData.authorID);
    formData.append('description', bookUpdateData.description);
    formData.append('publishDate', bookUpdateData.publishDate);

    return formData;
}