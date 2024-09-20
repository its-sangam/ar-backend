import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import artistRoutes from './artistRoutes.js';
import musicRoutes from './musicRoutes.js';

const api = express();

api.get('/',function(req,res){
    return res.json({status:'success',message:'Api Routes'});
});
api.use('/auth',authRoutes);
api.use('/users',userRoutes);
api.use('/artists',artistRoutes);
api.use('/music',musicRoutes);

export default api;
