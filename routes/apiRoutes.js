import express from 'express';
import authRoutes from './authRoutes.js';

const api = express();

api.get('/',function(req,res){
    return res.json({status:'success',message:'Api Routes'});
});
api.use('/auth',authRoutes);

export default api;
