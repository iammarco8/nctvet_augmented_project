import express from 'express';
import { createTask, getAllTasks, getSingleTask,updateTask,deleteTask} from '../controlllers/tasksController.js';
export const taskRouter = express.Router();

taskRouter
    .route('/')
    .get(getAllTasks)
    .post(createTask)
taskRouter
    .route('/:id')
    .get(getSingleTask)
    .patch(updateTask)
    .delete(deleteTask)