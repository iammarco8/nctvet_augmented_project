import { pool } from '../data/database.js';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// this is a payload for the sign in function.
function signJWTToken(user){
    return JWT.sign({
        id: user.id
        // ,email: user.email
        },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN
    }
    )
};

// function checking if user exsists using the email
async function userExsist(email){
    const [user]= await pool.query(`SELECT * FROM user WHERE email = ?`, [email]);
    if (user.length > 0){
        return true;
    }else{
        return false;
    }
}

// function designed to create a new user 
export const createUser = async(req,res,next)=>{
      const vDate = new Date();
    const sqlQuery = `INSERT INTO user(
        first_name, last_name, email, password
        )
        VALUES
        (?,?,?,?);`;
    if (await userExsist(req.body.eml)){
        res.status(400).json({
            status:'error',
            message:'User exsists'
        })
        return;
    }
    req.body.pass = await bcrypt.hashSync(req.body.pass)
    const [user] = await pool.query(sqlQuery,
        [req.body.f_nm, req.body.l_nm, req.body.eml, req.body.pass]
    );
    if (user.insertId > 0){
        const token = signJWTToken({
            id: user.insertId
        })
        res.status(201).json({
            status:'success',
            message:'user made',
            id:user.insertId,
            data:{
                token,
                user:req.body
            }
        })
    }else{
        res.status(404).json({
            status:'error',
            message:'check the data entered'
        });
    }
}

// user login function
export const loginUser = async(req,res, _next)=>{
    const [user] = await pool.query(`
        SELECT * FROM user WHERE email = ? AND first_name = ? AND last_name = ?`,
    [req.body.email, req.body.f_nm, req.body.l_nm]);
    if(!user.length){
        return res.status(404).json({
            status:'error',
            message:'No user found'
        })
    }else if(!(await bcrypt.compare(req.body.password, user[0].password))){
        return res.status(404).json({
            status:'error',
            message:'Wrong information'
        });
    }else{
        const token = signJWTToken(user[0]);
        user[0].password = undefined;
        res.status(200).json({
            status:'success',
            data:{
                token,
                user: user[0]
            }
        })
    }
}

// user protect function
export const protectUser = async(req,res, next)=>{
    const authorization = req.get('Authorization');
    console.log(`REQUEST PROTECT FUNCTION OBJECT ${JSON.stringify(req.headers)}`);
    console.log(`REQUEST AUTHORIZATION >> ${authorization}`);
    if(!authorization?.startsWith('Bearer')){
        return next(
            res.status(400).json({
                status:'error',
                message:'Cannot accsess without logging in'
            })
        )
    }
    const token = authorization.split(' ')[1];
    console.log(`TOKEN IS: ${token}`)
    try{
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log(`DECODED TOKEN: ${JSON.stringify(decoded)}`);
        const [user] = await pool.query(`SELECT * FROM user WHERE id = ?`,[decoded.id])
        if(!user.length){
            return next(
                res.status(404).json({
                    status:'error' ,
                    message:'User no longer valid'
                }) 
            );
        }
        console.log(`user[0]${JSON.stringify(user[0])}`);
        const data = user[0];
        data.password = undefined;
        req.user = data;
        next();
    }catch(error){
        console.log(error.message)
        if(error.message){
            return next(
                res.status(400).json({
                    status:'error',
                    message:'token expired'
                })
            );
        }else if(error.message == 'jwt malformed'){
            return next(
                res.status(400).json({
                    status:'error',
                    message:'token malformed'
                })
            );
        }else if(error.message == 'invalid token'){
            return next(
                res.status(400).json({
                    status:'error',
                    message: 'token is invalid'
                })
            );
        }else{
            return next(
                res.status(400).json({
                    status:'error',
                    message:'Unknown Error...'
                })
            );
        }
    }
}

export const getAllUsers =async (req,res,_next)=>{
    const [user] = await pool.query(`SELECT * FROM user`);
    // const user = await pool.query(`SELECT * FROM user`);
    if(user.length){
        res.status(200).json({
            status:'success',
            result: user.length,
            data:{
                user
            }
        })
    }else{
        res.status(404).json({
            status:'error',
            message:'no data return'
        });
    }
}
export const getSingleUser = async (req,res,_next)=>{
    const id = req.params.id;
    const user = await pool.query(`SELECT * FROM user WHERE id = ?`,[id]);

    if(user.length>0) {
        res.status(200).json({
            status:'success',
            results:user.length,
            data:{
                user:user[0]
            }
        });
    }else{
        res.status(404).json({
            status:'error',
            message:'user not found'
        });
    };
}

export const mainUser = async (req,res, _next)=>{
    const admin = req.user;
    if (!admin){
        console.log(`no user`)
        return next();
    }
    admin.password=undefined;

    let strQuery = `SELECT * FROM user WHERE id = ?`
    const [user]= await pool.query(strQuery, [admin.id]);
    if (!user.length){
        return res.status(401).json({
            status:'error',
            message:'Invalid request'
        });
    }
    _next();
    user[0].password= undefined;
    return res.status(200).json({
        status:'success',
        data:{
            user:user[0]
        }
    });
}