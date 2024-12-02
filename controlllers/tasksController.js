import { pool } from '../data/database.js';
// task creater
export const createTask = async(req, res, next)=>{
    const sql = `INSERT INTO tasks
    (
    task_name
    , description
    , date_due
    , status
    , note
    , user_assigned
    , admin

    
    )
    VALUES
    (?,?,?,?,?,?,?);`
    const nTask = await pool.query(sql,
        [
            req.body.task_name, req.body.description
            ,req.body.date_due, req.body.status, req.body.note
            , req.body.user, req.body.admin
        ]
    )
    
    console.log(`admin is: ${req.body.admin}`)
    ;
    if(nTask.insertId <= 0){
        res.status(400).json({
            status:'error',
            message:'check all the feilds'
        })
    }else{
        res.status(201).json({
            status:'success',
            message:'task added',
            id:nTask.insertId
        });
    }
}

// this will find all tasks
export const getAllTasks = async(req, res, next)=>{
    const sql = `SELECT * FROM tasks`
    const [task] = await pool.query(sql);
    if(task.length){
        res.status(200).json({
            status:'success',
            result: task.length,
            data:{
                task
            }
        })
    }else{
        res.status(404).json({
            status:'error',
            message:'No Task found'
        })
    }
}

// single task finder for editing purposes
export const getSingleTask = async (req,res,next)=>{
    const id = req.params.id;
    const [task] = await pool.query(`SELECT * FROM tasks WHERE id = ?`,[id])
    if (task.length > 0){
        res.status(200).json({
            status:'success',
            results:task.length,
            data:{task:task[0]}
        });
    }else{
        res.status(404).json({
            status:'error',
            message:'nothing to return'
        });
    };
};

// update function 
export const updateTask = async(req, res, next)=>{
     const id = req.params.id;
    console.log(JSON.stringify(req.body.date_due))
    const etask = await pool.query(`
        Update tasks
        SET task_name = ?, description = ?, date_due = ?, status = ?, note = ?, user_assigned = ?, admin = ?
        WHERE id = ?`,
    [req.body.task_name, req.body.description, req.body.date_due, req.body.status, req.body.note, req.body.user_assigned, req.body.admin, id])
    if (etask.affectedRows = 0){
        res.status(400).json({
            status:'error',
            message:'nothing changed',
        });
        
    }else{
        res.status(202).json({
            status:'success',
            affectedRows:etask.affectedRows
        });
    }
}

// delete the task
export const deleteTask = async(req,res,next)=>{
    const id = req.params.id;
    const dtask = await pool.query(`DELETE FROM tasks WHERE id= ?`,[id])
    if (dtask.affectedRows = 0){
        res.status(400).json({
            status:'error',
            message:'unable to delete'
        });
    }else{
        res.status(200).json({
            status:'success',
            // affectedRows:dtask.affectedRows,
            message:'data deleted'
        });
    };
};