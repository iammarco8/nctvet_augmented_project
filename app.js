// This is the main interface for the API requests.
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import ejs from 'ejs';
// import fs from 'fs';
// import multer from multer;
import { userRouter } from './routes/userActiveRouter.js';
import { taskRouter } from './routes/taskRouter.js';

const app = express();

// i wanted to have angular independently handle the
//  entire email ui design but unfortunately this has to be 
//  reduced to the backend so i stayed with the evil i know 
//  and implemented "ejs" 

app.set('view engine', ejs)
app.options('*',cors(['http://localhost:4200']))
app.use(cors(['http://localhost:4200']))

app.use(express.json({limit:'5kb'}));
app.use(express.urlencoded({
    extended:true, limit:'5kb'
}));

if(process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api/assesment/v1/task', taskRouter);
app.use('/api/assesment/v1/user', userRouter);

const port = process.env.PORT;
const server = app.listen(port, ()=>
console.log(`http://localhost:${port}/`));