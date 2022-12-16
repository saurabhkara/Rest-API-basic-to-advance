import { DEBUG_MODE } from "../config";
import { ValidationError } from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler";

const errorHandler =(err, req, res, next)=>{
    let statuscode =500;
    let data ={
        message:'Internal Server Error',
        ...(DEBUG_MODE === 'true' && { originalError : err.message})
    }

    //validation error handling
    if(err instanceof ValidationError){
        statuscode=422;
        data ={
            message : err.message
        }
    }

    //user is already in database error handling
    if(err instanceof CustomErrorHandler){
        statuscode = err.status;
        data = {
            message : err.message
        }
    }



    return res.status(statuscode).json(data);
}

export default errorHandler;