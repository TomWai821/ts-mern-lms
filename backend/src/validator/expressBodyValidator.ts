import { body } from 'express-validator'

export const UserRegisterRules =
[
    body("email").isEmail().withMessage("Invalid Email Address"), 
    body("username").notEmpty().withMessage("Username is required").isLength({min: 3}).withMessage("Username require at least 3 characters"),
    body("password").notEmpty().withMessage("Password is required").isLength({min: 6}).withMessage("Password require at least 6 characters"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("birthDay").notEmpty().withMessage("BirthDay is required")
];

export const UserModifySelfDataRules = 
[
    body("username").notEmpty().withMessage("Username is required").isLength({min: 3}).withMessage("Username require at least 3 characters"),
    body("password").notEmpty().withMessage("Password is required").isLength({min: 6}).withMessage("Password require at least 6 characters")
]

export const UserLoginRules = 
[
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("password").notEmpty().withMessage("Password is required")
]

export const UserModifyDataRules = 
[
    body("email").isEmail().withMessage("Invalid Email Address"), 
    body("username").notEmpty().withMessage("Username is required").isLength({min: 3}).withMessage("Password require at least 3 characters"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("role").notEmpty().withMessage("Role is required"),
    body("status").notEmpty().withMessage("Status is required"),
    body("startDate").optional().isDate(),
    body("dueDate").optional().isDate()
]

export const BookCreateRules = 
[
    body("bookname").notEmpty().withMessage("bookname is required").isLength({min: 6}).withMessage("bookname require at least 6 characters"),
    body("languageID").notEmpty().withMessage("languageID is required"),
    body("genreID").notEmpty().withMessage("genreID is required"),
    body("publisherID").notEmpty().withMessage("publisherID is required"),
    body("authorID").notEmpty().withMessage("authorID is required")
]