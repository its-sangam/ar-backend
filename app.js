import express from 'express';
import bodyParser from 'body-parser';
import apiRoutes from './routes/apiRoutes.js';
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api',apiRoutes);

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
