import { FinesPaidStatusOption, GenderFilterOption, GenderOption, RoleFilterOption, RoleOption } from "./TableData";

const RegisterField = 
[
    {name:"email", type:"email", label:"Email:"},
    {name:"username", type:"text", label:"Username:"},
    {name:"password", type:"password", label:"Password:"},
    {name:"birthDay", type:"date", label:"Date Of Birth:"}
]

const LoginField = 
[
    { name: "email", type: "email", label: "Email" },
    { name: "password", type: "password", label: "Password" }
];

const ViewProfileField = 
[
    {name: "role", label: "Role"}, 
    {name: "username", label: "Username"}, 
    {name: "email", label: "Email"}, 
    {name: "gender", label: "Gender"},
]

// For user filter
const UserSearchField = 
[
    {name: "gender", label: "Gender", type: "text", select: true, options: GenderFilterOption}
]

const AllUserSearchField = 
[
    ...UserSearchField,
    {name: "role", label: "Role", type: "text", select: true, options: RoleFilterOption},
]

const OtherUserSearchField = 
[
    {name: "role", label: "Role", type: "text", syntax:{ width: '10%', marginLeft: '10px' }, select: true, options: RoleFilterOption},
    {name: "gender", label: "Gender", type: "text", select: true, options: GenderFilterOption},
]

// For user modal
const UserFieldForModal = 
[
    {name: "email", label: "Email", type: "email"},
    {name: "gender", label: "Gender", type: "text", select: true, options: GenderOption}
]

const CreateUserInputField = 
[
    {name: "username", label: "Username", type:"text", select:false, slotProps: {}, options: []},
    {name: "password", label: "Password", type:"password"},
    ...UserFieldForModal,
    {name: "role", label: "Role", type: "text", select: true, options: RoleOption},
    {name: "birthDay", label: "Birthday", type: "date", select:false, options: []}
]

const EditUserInputField =
[
    {name: "username", label: "Username", type:"text", select:false, slotProps: {}, options: []},
    ...UserFieldForModal,
    {name: "role", label: "Role", type: "text", select: true, options: RoleOption}
]

const EditSuspendUserInputField = 
[
    {name: "startDate", label: "Start Date", type:"Date", select:false, slotProps: {}, options: [], rows: 1, disable: true},
    {name: "dueDate", label: "Due Date", type:"Date", select:false, slotProps: {}, options: [], rows: 1, disable: false},
    {name: "description", label: "Description", type:"String", select:false, slotProps: {}, options: [], rows: 5, disable: false},
]

// For banList
const dateOption = 
[
    {label:'30 days', value: 30}, 
    {label:'60 days', value: 60}, 
    {label:'365 days', value: 365}, 
    {label:'Forever', value: Infinity}
];

const SearchLoanBookInputField = 
[
    {name: "username", label: "Username", type:"text", select:false, slotProps: {}, options: []},
    {name: "finesPaid", label: "Fines Paid", type:"text", select:true, slotProps: {}, options: FinesPaidStatusOption},
]

const EditLanguageInputField = 
[
    {name: "language", label: "Language", type:"text"},
    {name: "shortName", label: "Short Name", type:"text"}
]

const EditGenreInputField = 
[
    {name: "genre", label: "Genre", type:"text"},
    {name: "shortName", label: "Short Name", type:"text"}
]

export {RegisterField, LoginField, ViewProfileField, AllUserSearchField, OtherUserSearchField, CreateUserInputField, EditUserInputField, EditSuspendUserInputField, dateOption, SearchLoanBookInputField, EditLanguageInputField, EditGenreInputField}