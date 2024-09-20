import express from 'express';
import { body, validationResult } from 'express-validator';
import { listMusic, store, update, getMusicDetails, deleteMusic } from '../controllers/musicController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const createMusicValidator = [
    body('title').notEmpty().withMessage('Title is required'),
    body('album_name').notEmpty().withMessage('Album Name is required'),
    body('genre').optional().isIn(['rnb', 'country', 'classic', 'rock', 'jazz']).withMessage('Invalid genre value'),
];

const editMusicValidator = [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('album_name').optional().notEmpty().withMessage('Album Name cannot be empty'),
    body('genre').optional().isIn(['rnb', 'country', 'classic', 'rock', 'jazz']).withMessage('Invalid genre value'),
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

const musicRoutes = express.Router();

musicRoutes.get('/list', authenticateToken, handleValidationErrors, listMusic);
musicRoutes.post('/create', createMusicValidator, authenticateToken, handleValidationErrors, store);
musicRoutes.put('/:id/update', editMusicValidator, authenticateToken, handleValidationErrors, update);
musicRoutes.get('/:id', authenticateToken, handleValidationErrors, getMusicDetails);
musicRoutes.delete('/:id', authenticateToken, deleteMusic);

export default musicRoutes;
