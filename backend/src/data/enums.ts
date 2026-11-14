// Book Type
export const bookStatus =  ['OnShelf', 'OnLoan'] as const;

export const bookReturnStatus = ['Returned', 'Loaned', 'Returned(Late)'] as const;

export const finesPaidStatus = ['Not Fine Needed', 'Paid', 'Not Paid'] as const;

// User Types
export const userStatus = ['Normal', 'Suspend'] as const;
export const suspendListStatus = ['Suspend', 'Unsuspend'] as const;
export const userRole = ['User', 'Admin'] as const;