const BookRecordTableHeader = [
    {label:"No."}, 
    {label:"Book Name"}, 
    {label:"Language"}, 
    {label:"Genre"}, 
    {label:"Publisher"}, 
    {label:"Author"}, 
    {label:"Pages"}, 
    {label:"Amount"},
    {label:"Actions", condition:"isLoggedIn"}
];

// Table Cell Header for User tables
const AllUserTableHeader = 
[
    {label:"No."},
    {label:"Username"},
    {label:"Role"},
    {label:"Status"},
    {label:"Gender"},
    {label:"Actions"}
]

const SuspendUserTableHeader = 
[
    {label:"No.", isAdmin: false},
    {label:"Username", isAdmin: false},
    {label:"Role", isAdmin: false},
    {label:"Status", isAdmin: false},
    {label:"StartDate", isAdmin: false},
    {label:"Duration", isAdmin: false},
    {label:"Actions", isAdmin: true}
]

const DeleteUserTableHeader = 
[
    {label:"No."},
    {label:"Username"},
    {label:"Role"},
    {label:"Gender"},
    {label:"Start Date"},
    {label:"Due Date"},
    {label:"Actions"}
]

// Table Cell Header for Book tables
const AllBookTableHeader = 
[
    {label:"No.", isLoggedIn: false, hasSortLabel: false},
    {label:"Image", isLoggedIn: false, hasSortLabel: false},
    {label:"BookName", isLoggedIn: false, hasSortLabel: true},
    {label:"Genre", isLoggedIn: false, hasSortLabel: true},
    {label:"Language", isLoggedIn: false, hasSortLabel: true},
    {label:"Author", isLoggedIn: false, hasSortLabel: true},
    {label:"Publisher", isLoggedIn: false, hasSortLabel: true},
    {label:"Status", isLoggedIn: true, hasSortLabel: true},
    {label:"Actions", isLoggedIn: true, hasSortLabel: false}
]

const LoanBookTableHeader = 
[
    {label:"No."},
    {label:"Image"},
    {label:"BookName"},
    {label:"Username"},
    {label:"Loan Date"},
    {label:"Due Date"},
    {label:"Status"},
    {label:"Return Date"},
    {label:"Fines Paid"},
    {label:"Fines Amount"},
    {label:"Actions"}
]

const SelfLoanBookTableHeader = 
[
    {label:"No."},
    {label:"Image"},
    {label:"BookName"},
    {label:"Loan Date"},
    {label:"Due Date"},
    {label:"Status"},
    {label:"Return Date"},
    {label:"Fines Paid"},
    {label:"Fine Amount"}
]

const PublisherTableHeader = 
[
    {label:"No."},
    {label:"Publisher"},
    {label:"Email"},
    {label:"Phone No."},
    {label:"Action"}
]

const AuthorTableHeader = 
[
    {label:"No."},
    {label:"Author"},
    {label:"Email"},
    {label:"Phone No."},
    {label:"Action"}
]

// For Tabs
const UserTabLabel = 
[
    {label: 'All User'},
    {label: 'Suspend List User'}
]

const BookTabLabel = 
[
    {label: "Book Data"},
    {label: "Loan Record"}
]

const BookDataTabLabel =
[
    {label: "Book Data"},
    {label: "Book Data (Google Books)"}
]

const LoanBookModalTabLabel = 
[
    {label: "Self Loaned"},
    {label: "User Loaned"}
]

const BookRecordTabLabel = 
[
    {label: 'Loan Book Record'},
    {label: 'Favourite Book Record'}
]

const ContactTabLabel = 
[
    {label:"Author List"},
    {label:"publisher List"},
]

const DefinitionTabLabel =
[
    {label: "Genre Data"},
    {label: "Language Data"}
]

const UserDataTableName = ["AllUser", "SuspendUser"];

const PaginationOption = [10, 20, 50, 100];

const EmptyOption = ["All"];

const RoleOption = ["User", "Admin"];

const StatusOption = ["Normal", "Suspend"];

const GenderOption = ["Male", "Female"];

const RoleFilterOption = [...RoleOption, ...EmptyOption];

const StatusFilterOption = [...StatusOption, ...EmptyOption];

const GenderFilterOption = [...GenderOption, ...EmptyOption];

const LoanBookStatusOption = ["Loaned", "Returned", "Returned(Late)", "All"];

const FinesPaidStatusOption = ["Not Fine Needed", "Paid", "Not Paid", "All"]

const AllBookStatusOption = ["OnShelf", "OnLoan", "All"];

export {BookRecordTableHeader, AllUserTableHeader, SuspendUserTableHeader, DeleteUserTableHeader, AllBookTableHeader, LoanBookTableHeader, SelfLoanBookTableHeader, PublisherTableHeader, AuthorTableHeader, BookTabLabel, BookDataTabLabel, UserTabLabel, LoanBookModalTabLabel, BookRecordTabLabel, ContactTabLabel, DefinitionTabLabel, UserDataTableName, PaginationOption, EmptyOption, RoleOption, StatusOption, GenderOption, RoleFilterOption, StatusFilterOption, GenderFilterOption, LoanBookStatusOption, FinesPaidStatusOption, AllBookStatusOption}