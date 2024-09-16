import express from 'express';
import { body, validationResult } from 'express-validator';
import {register,login,me} from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const registerValidators = [
    body('first_name').notEmpty().withMessage('First Name is required'),
    body('last_name').notEmpty().withMessage('Last Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').notEmpty().withMessage('Phone Number is required'),
];

const loginValidators = [
    body('email')
        .notEmpty().withMessage("Email is required"),
    body('password')
        .notEmpty().withMessage("Password is required")
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().reduce((acc, error) => {
            if (error.path) {
                acc[error.path] = error.msg;
            }
            return acc;
        }, {});

        return res.status(400).json(formattedErrors);
    }
    next();
};


const authRoutes = express.Router();

authRoutes.post('/register', registerValidators, handleValidationErrors,register);
authRoutes.post('/login',loginValidators, handleValidationErrors, login);
authRoutes.get('/me', authenticateToken, me);

export default authRoutes;
