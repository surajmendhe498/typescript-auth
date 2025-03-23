import express, {Request, Response} from 'express';
const app= express();
import connectDB from './config/db';
import dotenv from 'dotenv';
dotenv.config();
import userRoute from './routes/User';

app.use(express.json());

const port= 5000;

connectDB();

app.get('/', (req: Request, res: Response)=>{
    res.send('Jai Shree Ram');
});

app.use('/api/users', userRoute);

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})