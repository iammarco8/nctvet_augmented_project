import express from 'express';
import { createUser, loginUser, protectUser, getAllUsers, mainUser } from '../controlllers/usersController.js';
export const userRouter = express.Router();

userRouter
        .route('/')
        .post(createUser)
userRouter
        .route('/login')
        .post(loginUser)
userRouter
        .use(protectUser)
        .route('/userActive')
        .get(mainUser)
