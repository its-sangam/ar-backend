import express from 'express';
import { body, validationResult } from 'express-validator';
import { listUsers, store, update, getUserDetails, deleteUser } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const createUserValidator = [
    body('first_name').notEmpty().withMessage('First Name is required'),
    body('last_name').notEmpty().withMessage('Last Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').notEmpty().withMessage('Phone Number is required'),
];

const editUserValidator = [
    body('first_name').notEmpty().withMessage('First Name is required'),
    body('last_name').notEmpty().withMessage('Last Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').notEmpty().withMessage('Phone Number is required'),
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


const userRoutes = express.Router();

userRoutes.get('/list', authenticateToken,handleValidationErrors, listUsers);
userRoutes.post('/create', createUserValidator,authenticateToken, handleValidationErrors,store);
userRoutes.put('/:id/update',editUserValidator, authenticateToken,handleValidationErrors, update);
userRoutes.get('/:id',authenticateToken, handleValidationErrors, getUserDetails);
userRoutes.delete('/:id', authenticateToken, deleteUser);

export default userRoutes;
