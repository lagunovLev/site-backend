import { body } from 'express-validator';

export const createArticleValidator = [
    body('title', "Wrong title").isLength({ min: 3 }).isString(),
    body('text', "Too short article").isLength({ min: 10 }).isString(),
]

export const registerValidator = [
    body('email', "Wrong email").isEmail(),
    body('password', "Password must contain at least 6 characters").isLength({ min: 6 }),
    body('fullName', "Name is too short").isLength({ min: 3 }),
    body('avatarUrl', "Invalid URL").optional().isURL(),
];

export const loginValidator = [
    body('email', "Wrong email").isEmail(),
    body('password', "Password must contain at least 6 characters").isLength({ min: 6 }),
];