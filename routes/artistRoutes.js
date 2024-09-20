import express from 'express';
import { body, validationResult } from 'express-validator';
import { listArtists, store, update, getArtistDetails, deleteArtist } from '../controllers/artistController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';


const createArtistValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('dob').optional().isISO8601().withMessage('Invalid date format'),
    body('gender').optional().isIn(['m', 'f', 'o']).withMessage('Invalid gender value'),
    body('address').optional().notEmpty().withMessage('Address is required'),
    body('first_release_year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid release year'),
    body('no_of_albums_released').optional().isInt({ min: 0 }).withMessage('Invalid number of albums'),
];

const editArtistValidator = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('dob').optional().isISO8601().withMessage('Invalid date format'),
    body('gender').optional().isIn(['m', 'f', 'o']).withMessage('Invalid gender value'),
    body('address').optional().notEmpty().withMessage('Address cannot be empty'),
    body('first_release_year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid release year'),
    body('no_of_albums_released').optional().isInt({ min: 0 }).withMessage('Invalid number of albums'),
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


const artistRoutes = express.Router();

artistRoutes.get('/list', authenticateToken,handleValidationErrors, listArtists);
artistRoutes.post('/create', createArtistValidator,authenticateToken, handleValidationErrors,store);
artistRoutes.put('/:id/update',editArtistValidator, authenticateToken,handleValidationErrors, update);
artistRoutes.get('/:id',authenticateToken, handleValidationErrors, getArtistDetails);
artistRoutes.delete('/:id', authenticateToken, deleteArtist);

export default artistRoutes;
